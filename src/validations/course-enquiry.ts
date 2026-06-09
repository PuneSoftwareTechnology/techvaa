import { z } from "zod";

/**
 * "Enroll Now" enquiry schema — shared by the dialog form (React Hook Form
 * resolver) and the server action. The course is pre-selected from the batch
 * row the visitor clicked, so it is required but not user-editable. No email is
 * collected here (name + phone are enough to call the lead back).
 */
export const courseEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter your phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+()\d\s-]+$/, "Enter a valid phone number"),
  course: z
    .string()
    .trim()
    .min(1, "Please select a course")
    .max(160, "Course name is too long"),
  message: z
    .string()
    .trim()
    .max(1000, "Message is too long")
    .optional()
    .or(z.literal("")),
  // Honeypot — see leadSchema for the rationale. Humans never see it; we do not
  // reject a filled value client-side, the server silently drops bot hits.
  hpField: z.string().optional(),
});

export type CourseEnquiryInput = z.infer<typeof courseEnquirySchema>;

export type CourseEnquiryFormValues = {
  name: string;
  phone: string;
  course: string;
  message: string;
  hpField: string;
};
