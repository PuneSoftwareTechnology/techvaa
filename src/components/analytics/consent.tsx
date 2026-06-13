"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleAnalytics } from "./google-analytics";
import { MicrosoftClarity } from "./clarity";
import { MetaPixel } from "./meta-pixel";

/**
 * Cookie consent gate. The analytics scripts (GA, Clarity, Meta Pixel) only
 * mount once the visitor has clicked "Accept", so no tracking cookies are set
 * until then — the GDPR / DPDP "consent before tracking" requirement.
 *
 * The choice is persisted in localStorage under `cookie-consent`
 * ("accepted" | "rejected") so the banner shows only on the first visit.
 * Web Vitals reporting stays mounted in the layout but no-ops without GA, so it
 * is gated for free.
 */
const STORAGE_KEY = "cookie-consent";
type Choice = "accepted" | "rejected";

export function CookieConsent() {
  // null = not yet read from storage (server + first paint); avoids both a
  // hydration mismatch and a flash of the banner for returning visitors.
  const [choice, setChoice] = useState<Choice | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") setChoice(stored);
    setHydrated(true);
  }, []);

  function decide(next: Choice) {
    localStorage.setItem(STORAGE_KEY, next);
    setChoice(next);
  }

  return (
    <>
      {choice === "accepted" && (
        <>
          <GoogleAnalytics />
          <MicrosoftClarity />
          <MetaPixel />
        </>
      )}

      {hydrated && choice === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-4 right-4 left-4 z-[90] sm:left-auto sm:w-[26rem] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
        >
          <div className="overflow-hidden rounded-2xl border border-brand/15 bg-background shadow-2xl shadow-brand/10 ring-1 ring-black/5">
            {/* Brand accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-brand via-accent-orange to-brand" />
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-base">
                  🍪
                </span>
                <h2 className="text-sm font-semibold text-foreground">
                  We value your privacy
                </h2>
              </div>
              <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
                We use cookies for analytics to understand how visitors use the
                site and improve your experience. See our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-brand underline underline-offset-4 hover:text-brand/80"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => decide("rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  className="flex-1"
                  onClick={() => decide("accepted")}
                >
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
