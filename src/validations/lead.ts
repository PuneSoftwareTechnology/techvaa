import { z } from "zod";

/**
 * Lead-capture schema shared by the client form (React Hook Form resolver) and
 * the server action — one source of truth for validation on both sides.
 */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "Name is too long"),
  email: z.email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter your phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+()\d\s-]+$/, "Enter a valid phone number"),
  message: z
    .string()
    .trim()
    .min(1, "Please enter your message")
    .max(1000, "Message is too long"),
  courseInterest: z.string().trim().max(120).optional().or(z.literal("")),
  // Honeypot. Humans never see it; bots fill every field. We do NOT reject a
  // filled value here — that would block a real user whose browser/password
  // manager autofilled the hidden input with an invisible, un-fixable error.
  // The server inspects this and silently drops bot submissions instead. The
  // name is deliberately non-semantic so autofill heuristics ignore it.
  hpField: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  courseInterest: string;
  hpField: string;
};
