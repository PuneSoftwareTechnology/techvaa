/**
 * Client-side helper for Google reCAPTCHA v3.
 *
 * The library is NOT loaded on page load — it costs ~250 ms of main-thread
 * work (Total Blocking Time) on every page. Instead it is:
 *   1. pre-loaded the first time a visitor focuses any form field
 *      (see RecaptchaPreloader), and
 *   2. loaded-and-awaited by `executeRecaptcha` at submit time if it still
 *      isn't there, so a token is always attempted.
 *
 * `executeRecaptcha(action)` resolves a fresh token for the given action, which
 * the form then sends to the server action for verification. If no site key is
 * configured (or the script can't load), it resolves to "" and the server
 * treats the submission as un-verified-but-allowed — so the UI never breaks.
 */
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

/** Give up waiting for the script after this long and submit without a token. */
const LOAD_TIMEOUT_MS = 8000;

let loading: Promise<boolean> | null = null;

/** Inject the reCAPTCHA script once. Resolves true when it is usable. */
export function loadRecaptcha(): Promise<boolean> {
  if (!RECAPTCHA_SITE_KEY || typeof window === "undefined") {
    return Promise.resolve(false);
  }
  if (window.grecaptcha) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => resolve(Boolean(window.grecaptcha));
    script.onerror = () => {
      loading = null; // allow a retry on the next attempt
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return loading;
}

export async function executeRecaptcha(action: string): Promise<string> {
  const siteKey = RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === "undefined") return "";

  const ready = await Promise.race([
    loadRecaptcha(),
    new Promise<boolean>((r) => setTimeout(() => r(false), LOAD_TIMEOUT_MS)),
  ]);
  if (!ready || !window.grecaptcha) return "";

  return new Promise<string>((resolve) => {
    window.grecaptcha!.ready(() => {
      window
        .grecaptcha!.execute(siteKey, { action })
        .then(resolve)
        .catch(() => resolve("")); // fail soft; server fails open on empty token
    });
  });
}
