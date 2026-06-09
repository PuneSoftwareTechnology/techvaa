"use server";

import { leadSchema } from "@/validations/lead";
import { leadService } from "@/services/lead.service";
import { verifyRecaptcha } from "@/lib/recaptcha";

export type LeadActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
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
    return {
      status: "success",
      message: "Thanks! Our team will reach out within one business day.",
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}
