"use client";

import { useEffect } from "react";
import { RECAPTCHA_SITE_KEY, loadRecaptcha } from "@/lib/recaptcha-client";

/**
 * Pre-loads reCAPTCHA the first time a visitor focuses a form field anywhere
 * on the page, so the token is ready by the time they submit — without paying
 * the library's main-thread cost on every page view. Renders nothing.
 */
export function RecaptchaPreloader() {
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.matches?.("input, textarea, select")) {
        document.removeEventListener("focusin", onFocus);
        void loadRecaptcha();
      }
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);

  return null;
}
