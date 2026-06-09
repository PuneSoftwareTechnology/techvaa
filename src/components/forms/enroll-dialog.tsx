"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GraduationCap, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  courseEnquirySchema,
  type CourseEnquiryInput,
} from "@/validations/course-enquiry";
import { submitCourseEnquiry } from "@/actions/submit-course-enquiry";
import { executeRecaptcha } from "@/lib/recaptcha-client";
import { RecaptchaNotice } from "@/components/common/recaptcha-notice";
import { Shimmer } from "@/components/common/shimmer";

type EnrollDialogProps = {
  /** Pre-selected course / module the visitor is enrolling for. */
  course: string;
  /** Extra classes for the trigger button (e.g. full-width on mobile cards). */
  className?: string;
};

export function EnrollDialog({ course, className }: EnrollDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseEnquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      course,
      message: "",
      hpField: "",
    },
  });

  const onSubmit = (values: CourseEnquiryInput) => {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ""));
      // The course is fixed to this batch — never trust a tampered hidden value.
      fd.set("course", course);
      fd.append("recaptchaToken", await executeRecaptcha("enroll_submit"));
      const result = await submitCourseEnquiry({ status: "idle" }, fd);

      if (result.status === "success") {
        toast.success(result.message ?? "Thanks! We'll be in touch.");
        reset({ name: "", phone: "", course, message: "", hpField: "" });
        setOpen(false);
        return;
      }
      if (result.fieldErrors) {
        for (const [field, msgs] of Object.entries(result.fieldErrors)) {
          if (msgs?.[0])
            setError(field as keyof CourseEnquiryInput, { message: msgs[0] });
        }
      }
      toast.error(result.message ?? "Something went wrong. Please try again.");
    });
  };

  const onInvalid = () => toast.error("Please fix the highlighted fields.");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="accent"
          className={cn("relative overflow-hidden", className)}
        >
          <Shimmer />
          Enroll Now
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve your seat</DialogTitle>
          <DialogDescription>
            Share your details and our team will confirm your spot in this batch.
          </DialogDescription>
        </DialogHeader>

        {/* Auto-selected course — shown read-only, submitted via the form value. */}
        <div className="flex items-center gap-3 rounded-lg border bg-secondary/50 px-3 py-2.5">
          <GraduationCap
            className="size-5 shrink-0 text-brand"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Selected course
            </p>
            <p className="truncate font-semibold text-foreground">{course}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          className="space-y-4"
          aria-label="Course enrollment enquiry form"
        >
          {/* Honeypot — visually hidden, off the tab order. */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
          >
            <label htmlFor="enroll-hp">Leave this field empty</label>
            <input
              id="enroll-hp"
              tabIndex={-1}
              autoComplete="off"
              {...register("hpField")}
            />
          </div>

          {/* Course is fixed; carry it in a hidden input for completeness. */}
          <input type="hidden" {...register("course")} />

          <div>
            <Label htmlFor="enroll-name" className="mb-1.5 block">
              Name
            </Label>
            <Input
              id="enroll-name"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="enroll-phone" className="mb-1.5 block">
              Phone
            </Label>
            <Input
              id="enroll-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 000 0000"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="enroll-message" className="mb-1.5 block">
              Message <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="enroll-message"
              rows={3}
              placeholder="Any questions about this batch?"
              aria-invalid={!!errors.message}
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isPending}
            className={cn("w-full")}
          >
            {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isPending ? "Sending…" : "Submit Enrollment"}
          </Button>

          <RecaptchaNotice />
        </form>
      </DialogContent>
    </Dialog>
  );
}
