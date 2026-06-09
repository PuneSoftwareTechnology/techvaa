/**
 * Client-side helper for Google reCAPTCHA v3.
 *
 * `executeRecaptcha(action)` resolves a fresh token for the given action, which
 * the form then sends to the server action for verification. If no site key is
 * configured (or the script hasn't loaded), it resolves to "" and the server
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

export function executeRecaptcha(action: string): Promise<string> {
  const siteKey = RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === "undefined" || !window.grecaptcha) {
    return Promise.resolve("");
  }

  return new Promise<string>((resolve) => {
    window.grecaptcha!.ready(() => {
      window
        .grecaptcha!.execute(siteKey, { action })
        .then(resolve)
        .catch(() => resolve("")); // fail soft; server fails open on empty token
    });
  });
}
