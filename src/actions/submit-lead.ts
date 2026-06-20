"use server";

import { leadSchema } from "@/validations/lead";
import { leadService } from "@/services/lead.service";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { syncEnquiryToT2E, type T2ESyncResult } from "@/lib/t2e";

export type LeadActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  /** Result of mirroring the lead to Training2Expert (drives a separate toast). */
  t2e?: T2ESyncResult;
};

/**
 * Server action for the lead-capture forms. Validates with the shared Zod
 * schema, rejects honeypot hits, and persists via the service layer. The UI
 * never touches Prisma directly.
 */
export async function submitLead(
  _prev: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  // Throttle abuse: at most 5 submissions per 10 minutes per IP.
  const limit = rateLimit(`lead:${await clientIp()}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.ok) {
    return {
      status: "error",
      message: "Too many submissions. Please wait a few minutes and try again.",
    };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
    courseInterest: String(formData.get("courseInterest") ?? ""),
    hpField: String(formData.get("hpField") ?? ""),
  };

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot: silently succeed so bots get no signal.
  if (parsed.data.hpField) {
    return { status: "success", message: "Thanks! We'll be in touch shortly." };
  }

  // reCAPTCHA v3: reject low-score / automated submissions.
  const captcha = await verifyRecaptcha(
    String(formData.get("recaptchaToken") ?? ""),
    "lead_submit"
  );
  if (!captcha.ok) {
    return {
      status: "error",
      message: "We couldn't verify you're human. Please reload and try again.",
    };
  }

  try {
    await leadService.submit(parsed.data);
    // Mirror to Training2Expert (best-effort; the local save above is the
    // source of truth, so a T2E hiccup never loses the lead).
    const t2e = await syncEnquiryToT2E({
      name: parsed.data.name,
      phone: parsed.data.phone ?? "",
      email: parsed.data.email,
      course: parsed.data.courseInterest ?? "",
      message: parsed.data.message ?? "",
    });
    return {
      status: "success",
      message: "Thanks! Our team will reach out within one business day.",
      t2e,
    };
  } catch (error) {
    console.error("[submit-lead] failed to persist lead:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}
