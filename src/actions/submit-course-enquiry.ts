"use server";

import { courseEnquirySchema } from "@/validations/course-enquiry";
import { courseEnquiryService } from "@/services/course-enquiry.service";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type CourseEnquiryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server action for the "Enroll Now" dialog on the upcoming-batches table.
 * Validates with the shared Zod schema, drops honeypot hits, and persists via
 * the service layer. The UI never touches Prisma directly.
 */
export async function submitCourseEnquiry(
  _prev: CourseEnquiryActionState,
  formData: FormData
): Promise<CourseEnquiryActionState> {
  // Throttle abuse: at most 5 submissions per 10 minutes per IP.
  const limit = rateLimit(`enquiry:${await clientIp()}`, {
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
    phone: String(formData.get("phone") ?? ""),
    course: String(formData.get("course") ?? ""),
    message: String(formData.get("message") ?? ""),
    hpField: String(formData.get("hpField") ?? ""),
  };

  const parsed = courseEnquirySchema.safeParse(raw);
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
    "enroll_submit"
  );
  if (!captcha.ok) {
    return {
      status: "error",
      message: "We couldn't verify you're human. Please reload and try again.",
    };
  }

  try {
    await courseEnquiryService.submit(parsed.data);
    return {
      status: "success",
      message: "Thanks! Our team will call you about this batch within one business day.",
    };
  } catch (error) {
    console.error("[submit-course-enquiry] failed to persist enquiry:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}
