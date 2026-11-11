"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) to GA4 via gtag, so the
 * "Web Vitals" / custom event reports in GA reflect real field data — the
 * numbers Google actually ranks on, not just lab/Lighthouse scores.
 *
 * No-ops with a blank NEXT_PUBLIC_GA_ID; metrics that arrive before the
 * GA stub exists are buffered and sent once it is ready. Confined to its own client component per Next guidance so
 * the client boundary doesn't leak into the root layout.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Metric = { name: string; id: string; value: number };

// The `gtag` stub is defined right after hydration (google-analytics.tsx) and
// queues into dataLayer until gtag.js loads on first interaction. Metrics that
// arrive before even the stub exists are buffered and flushed once it does;
// give up after ~30 s (e.g. GA blocked or not configured).
const pending: Metric[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let flushTries = 0;

function send(metric: Metric) {
  window.gtag!("event", metric.name, {
    // GA event values must be integers; CLS is a small ratio so scale it up.
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_label: metric.id, // unique to the current page load
    non_interaction: true, // don't affect bounce rate
  });
}

function flush() {
  if (typeof window.gtag === "function") {
    pending.splice(0).forEach(send);
  } else if (++flushTries < 30) {
    return; // keep waiting
  } else {
    pending.length = 0;
  }
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = null;
}

// Defined at module scope so the callback reference is stable across renders
// (prevents duplicate reporting — see the useReportWebVitals docs).
function report(metric: Metric) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_GA_ID) return;
  if (typeof window.gtag === "function") return send(metric);
  pending.push(metric);
  if (!flushTimer) {
    flushTries = 0;
    flushTimer = setInterval(flush, 1000);
  }
}

export function WebVitals() {
  useReportWebVitals(report);
  return null;
}
