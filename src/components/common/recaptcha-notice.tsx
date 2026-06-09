import { cn } from "@/lib/utils";
import { RECAPTCHA_SITE_KEY } from "@/lib/recaptcha-client";

/**
 * Google's reCAPTCHA terms require this disclosure whenever the v3 badge is used
 * (or hidden). Rendered under each protected form. Hidden when captcha is
 * disabled (no site key configured).
 */
export function RecaptchaNotice({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!RECAPTCHA_SITE_KEY) return null;

  const dark = tone === "dark";

  return (
    <p
      className={cn(
        "text-xs leading-relaxed",
        dark ? "text-white/55" : "text-muted-foreground",
        className
      )}
    >
      Protected by reCAPTCHA — Google&apos;s{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
