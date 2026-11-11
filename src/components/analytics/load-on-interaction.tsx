"use client";

import { useEffect, useState, type ReactNode } from "react";

// Any of these means a real person is on the page. `mousemove` catches desktop
// readers who never click; `scroll`/`touchstart` catch mobile readers.
const EVENTS = [
  "pointerdown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
  "mousemove",
] as const;

/**
 * Renders `children` (third-party analytics <Script>s) only after the visitor's
 * first interaction. Keeps ~320 KiB of GA / Meta Pixel / Clarity JavaScript
 * off the initial load, which was the bulk of mobile "unused JavaScript" and
 * main-thread time in PageSpeed.
 *
 * Trade-off: a visitor who leaves without scrolling, tapping, typing or moving
 * the mouse is not tracked.
 */
export function LoadOnInteraction({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const opts = { passive: true, capture: true } as const;
    const start = () => {
      setReady(true);
      EVENTS.forEach((e) => window.removeEventListener(e, start, opts));
    };
    EVENTS.forEach((e) => window.addEventListener(e, start, opts));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, start, opts));
  }, []);

  return ready ? children : null;
}
