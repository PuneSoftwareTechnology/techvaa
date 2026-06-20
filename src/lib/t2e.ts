import "server-only";

/**
 * Training2Expert (T2E) lead mirror.
 *
 * Every lead / course enquiry that lands on this site is also pushed to the T2E
 * admin API so both systems share the same pipeline. This is a best-effort,
 * server-side side-effect: the local DB write is the source of truth and must
 * have already succeeded before we call here — a T2E failure never loses a lead,
 * it just reports back so the UI can surface a separate toast.
 */

export type T2ESyncResult = { ok: boolean; message: string };

/** The Techvaa-side fields we have to map onto a T2E enquiry. */
export type T2EEnquiry = {
  name: string;
  phone: string;
  /** Course enquiries don't capture an email — pass "" / omit. */
  email?: string;
  course?: string;
};

// Cap how long a slow/hung T2E can stall the visitor's form response.
const T2E_TIMEOUT_MS = 8000;

export async function syncEnquiryToT2E(
  enquiry: T2EEnquiry
): Promise<T2ESyncResult> {
  const url = process.env.T2E_API_URL;
  const token = process.env.T2E_API_TOKEN;

  // Not configured → skip silently (no toast-worthy failure).
  if (!url || !token) {
    return { ok: false, message: "" };
  }

  // Fixed mapping agreed with T2E. Fields Techvaa doesn't capture get the
  // agreed defaults; demoDate/comment are intentionally left empty.
  const payload = {
    enquiryDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email ?? "",
    course: enquiry.course ?? "",
    institute: "Techvaa",
    leadStatus: "PROSPECTIVE",
    demoStatus: "PENDING",
    demoDate: "",
    comment: "",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(T2E_TIMEOUT_MS),
    });

    if (!res.ok) {
      // Surface the backend's own message when present (expired/blacklisted
      // token, deactivated account, validation error, etc.).
      const raw = await res.text().catch(() => "");
      let detail = "";
      try {
        const json = JSON.parse(raw) as { message?: string; error?: string };
        detail = json.message || json.error || "";
      } catch {
        detail = raw.slice(0, 160);
      }
      console.error("[t2e] sync rejected:", res.status, detail);
      return {
        ok: false,
        message: detail
          ? `Training2Expert sync failed: ${detail}`
          : `Training2Expert sync failed (HTTP ${res.status}).`,
      };
    }

    return { ok: true, message: "Also synced to Training2Expert." };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error("[t2e] sync request errored:", error);
    return {
      ok: false,
      message: timedOut
        ? "Training2Expert didn't respond in time. Saved on Techvaa only."
        : "Training2Expert server is unreachable. Saved on Techvaa only.",
    };
  }
}
