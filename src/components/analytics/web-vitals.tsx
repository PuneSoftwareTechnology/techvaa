"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) to GA4 via gtag, so the
 * "Web Vitals" / custom event reports in GA reflect real field data — the
 * numbers Google actually ranks on, not just lab/Lighthouse scores.
 *
 * No-ops when GA isn't loaded (gtag undefined), so it's safe with a blank
 * NEXT_PUBLIC_GA_ID. Confined to its own client component per Next guidance so
 * the client boundary doesn't leak into the root layout.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Defined at module scope so the callback reference is stable across renders
// (prevents duplicate reporting — see the useReportWebVitals docs).
function report(metric: { name: string; id: string; value: number }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", metric.name, {
    // GA event values must be integers; CLS is a small ratio so scale it up.
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_label: metric.id, // unique to the current page load
    non_interaction: true, // don't affect bounce rate
  });
}

export function WebVitals() {
  useReportWebVitals(report);
  return null;
}
