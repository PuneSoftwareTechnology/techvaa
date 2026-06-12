"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import { Phone, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/common/shimmer";
import { SITE } from "@/constants/site";

/** WhatsApp brand glyph — lucide dropped brand icons, so we inline it. */
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5l-.56-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.2 1.87.12.57-.08 1.74-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.02 21.5h-.01a9.5 9.5 0 0 1-4.83-1.32l-.35-.2-3.59.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.04c0-5.24 4.27-9.5 9.51-9.5a9.45 9.45 0 0 1 6.72 2.79 9.43 9.43 0 0 1 2.78 6.72c0 5.24-4.27 9.5-9.5 9.5zm8.09-17.6A11.36 11.36 0 0 0 12.02.5C5.74.5.64 5.6.64 11.87c0 2.01.53 3.98 1.53 5.71L.5 23.5l6.07-1.59a11.34 11.34 0 0 0 5.44 1.39h.01c6.28 0 11.38-5.1 11.39-11.37a11.3 11.3 0 0 0-3.3-8.04z" />
    </svg>
  );
}

const PHONE_DIGITS = SITE.phone.replace(/[^+\d]/g, "");
const WHATSAPP_DIGITS = SITE.whatsapp.replace(/\D/g, "");
const WHATSAPP_MESSAGE = `Hi ${SITE.name}, I'd like to know more about your SAP courses.`;

/**
 * Bottom-right floating contact launcher. Collapsed it's a single FAB; tapping
 * it expands a vertical stack of Call + WhatsApp actions and turns the FAB into
 * a close (X) button. Links work on every device: `tel:` opens the dialer on
 * mobile (and the default handler on desktop), and `wa.me` opens the WhatsApp
 * app on mobile or WhatsApp Web on desktop.
 */
export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {/* Action stack — rendered above the toggle, revealed when open. */}
      <div
        className={cn(
          "flex flex-col items-end gap-3 transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
        // Hide from AT and tab order while collapsed.
        aria-hidden={!open}
      >
        <a
          href={`https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={open ? 0 : -1}
          className="group flex items-center gap-3"
          aria-label="Chat with us on WhatsApp"
        >
          <span className="rounded-md bg-foreground/85 px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            WhatsApp
          </span>
          <span className="grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105">
            <WhatsAppIcon className="size-6" />
          </span>
        </a>

        <a
          href={`tel:${PHONE_DIGITS}`}
          tabIndex={open ? 0 : -1}
          className="group flex items-center gap-3"
          aria-label={`Call us at ${SITE.phone}`}
        >
          <span className="rounded-md bg-foreground/85 px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            Call us
          </span>
          <span className="grid size-12 place-items-center rounded-full bg-accent-orange text-accent-orange-foreground shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105">
            <Phone className="size-5" aria-hidden="true" />
          </span>
        </a>
      </div>

      {/* Toggle / close button. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close contact options" : "Contact us"}
        className={cn(
          "group relative grid size-14 place-items-center overflow-hidden rounded-full",
          "bg-gradient-to-br from-accent-orange to-[oklch(0.62_0.2_38)] text-accent-orange-foreground",
          "shadow-[0_8px_24px_oklch(0.62_0.2_38/0.45)] ring-2 ring-white/20",
          "transition-transform duration-200 hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Attention pulse only while collapsed — stops once the menu is open.
          !open && "animate-fab-pulse",
        )}
      >
        <Shimmer />
        {/* Brighter shine burst on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full"
        />
        <X
          className={cn(
            "absolute size-6 transition-all duration-300",
            open
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0",
          )}
          aria-hidden="true"
        />
        {/* Composite contact glyph: a phone with a small message badge so the
            FAB reads as "call + message", not chat alone. */}
        <span
          className={cn(
            "absolute transition-all duration-300",
            open
              ? "-rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100",
          )}
          aria-hidden="true"
        >
          <Phone className="size-6" />
          <MessageCircle className="absolute -right-1 -top-1 size-4 fill-current stroke-[2.5] text-accent-orange-foreground" />
        </span>
      </button>
    </div>
  );
}
