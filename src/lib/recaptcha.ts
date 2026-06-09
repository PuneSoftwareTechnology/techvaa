import "server-only";

/**
 * Server-side Google reCAPTCHA v3 verification.
 *
 * v3 is invisible: the browser fetches a short-lived token (tied to an
 * "action") which we POST to Google here. Google returns a 0.0–1.0 score —
 * higher means more likely human. We reject low scores and (optionally)
 * mismatched actions.
 *
 * If no secret key is configured the check is SKIPPED (returns ok), so local
 * dev and previews work before keys are added. Production should always set
 * RECAPTCHA_SECRET_KEY.
 */
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const MIN_SCORE = (() => {
  const parsed = Number(process.env.RECAPTCHA_MIN_SCORE);
  return Number.isFinite(parsed) ? parsed : 0.5;
})();

export type RecaptchaResult = {
  ok: boolean;
  /** Reason for failure, for server logs (never shown verbatim to the user). */
  reason?: string;
  score?: number;
};

export async function verifyRecaptcha(
  token: string,
  expectedAction?: string
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Not configured → don't block submissions.
  if (!secret) return { ok: true, reason: "skipped: no secret configured" };

  if (!token) return { ok: false, reason: "missing token" };

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });

    const data = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return {
        ok: false,
        reason: `failed: ${data["error-codes"]?.join(",") ?? "unknown"}`,
      };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return { ok: false, reason: `action mismatch: ${data.action}`, score: data.score };
    }

    if (typeof data.score === "number" && data.score < MIN_SCORE) {
      return { ok: false, reason: `low score: ${data.score}`, score: data.score };
    }

    return { ok: true, score: data.score };
  } catch {
    // Network/Google outage: fail open so a real lead is never lost to an
    // infrastructure blip. The honeypot still guards against simple bots.
    return { ok: true, reason: "verify request errored — failing open" };
  }
}
