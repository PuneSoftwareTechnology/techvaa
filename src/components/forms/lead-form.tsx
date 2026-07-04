"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shimmer } from "@/components/common/shimmer";
import { cn } from "@/lib/utils";
import { leadSchema, type LeadInput } from "@/validations/lead";
import { submitLead } from "@/actions/submit-lead";
import { executeRecaptcha } from "@/lib/recaptcha-client";
import { RecaptchaNotice } from "@/components/common/recaptcha-notice";

type LeadFormProps = {
  /** Pre-fill the course interest (used on course detail pages). */
  courseInterest?: string;
  /** "dark" tunes field styling for the navy contact band. */
  tone?: "light" | "dark";
  className?: string;
};

export function LeadForm({ courseInterest, tone = "light", className }: LeadFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      courseInterest: courseInterest ?? "",
      hpField: "",
    },
  });

  const dark = tone === "dark";
  const fieldClass = cn(
    dark &&
      "border-white/25 bg-white/10 text-white placeholder:text-white/55 focus-visible:border-white/60"
  );

  const onSubmit = (values: LeadInput) => {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ""));
      fd.append("recaptchaToken", await executeRecaptcha("lead_submit"));
      const result = await submitLead({ status: "idle" }, fd);

      if (result.status === "success") {
        toast.success(result.message ?? "Thanks! We'll be in touch.");
        reset({ ...values, name: "", email: "", phone: "", message: "" });
        return;
      }
      if (result.fieldErrors) {
        for (const [field, msgs] of Object.entries(result.fieldErrors)) {
          if (msgs?.[0])
            setError(field as keyof LeadInput, { message: msgs[0] });
        }
      }
      toast.error(result.message ?? "Something went wrong. Please try again.");
    });
  };

  // Surface blocked submits — without this a failed client-side validation is
  // silent (no server action, no network request, just the inline field errors).
  const onInvalid = () => toast.error("Please fix the highlighted fields.");

  const labelClass = cn("mb-1.5 block text-sm font-medium", dark && "text-white");
  const errClass = cn("mt-1 text-xs", dark ? "text-amber-200" : "text-destructive");

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className={cn("space-y-4", className)}
      aria-label="Lead enquiry form"
    >
      {/* Honeypot — visually hidden, off the tab order, and named non-semantically
          so password managers / browser autofill don't populate it for real users.
          Uses `sr-only` (clip-based) rather than off-screen positioning: inside a
          dialog, an absolutely positioned `left-[-9999px]` element forces a
          horizontal scrollbar because the dialog's `overflow-y-auto` promotes
          `overflow-x` to `auto`, and the off-screen box counts as overflow. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="lf-hp">Leave this field empty</label>
        <input
          id="lf-hp"
          tabIndex={-1}
          autoComplete="off"
          {...register("hpField")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lf-name" className={labelClass}>
            Name
          </Label>
          <Input
            id="lf-name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className={fieldClass}
            {...register("name")}
          />
          {errors.name && <p className={errClass}>{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="lf-email" className={labelClass}>
            Email
          </Label>
          <Input
            id="lf-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={fieldClass}
            {...register("email")}
          />
          {errors.email && <p className={errClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="lf-phone" className={labelClass}>
          Phone
        </Label>
        <Input
          id="lf-phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel"
          placeholder="10-digit mobile number"
          aria-invalid={!!errors.phone}
          className={fieldClass}
          {...register("phone", {
            // Allow digits only, capped at 10 — strip anything else as the user types.
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            },
          })}
        />
        {errors.phone && <p className={errClass}>{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="lf-message" className={labelClass}>
          Your question
        </Label>
        <Textarea
          id="lf-message"
          rows={3}
          placeholder="Tell us what you'd like to learn…"
          aria-invalid={!!errors.message}
          className={fieldClass}
          {...register("message")}
        />
        {errors.message && <p className={errClass}>{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        variant="accent"
        size="xl"
        disabled={isPending}
        className="relative w-full overflow-hidden sm:w-auto"
      >
        {!isPending && <Shimmer />}
        {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
        {isPending ? "Sending…" : "Request a Callback"}
      </Button>

      <RecaptchaNotice tone={tone} />
    </form>
  );
}
