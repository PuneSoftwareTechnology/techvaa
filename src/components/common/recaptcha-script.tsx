"use client";

import Script from "next/script";
import { RECAPTCHA_SITE_KEY } from "@/lib/recaptcha-client";

/**
 * Loads the Google reCAPTCHA v3 library once, app-wide. Renders nothing when no
 * site key is configured, so the third-party script (and its floating badge)
 * only ship once keys are set. Mounted in the root provider stack.
 */
export function RecaptchaScript() {
  if (!RECAPTCHA_SITE_KEY) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      strategy="afterInteractive"
    />
  );
}
