"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/forms/lead-form";
import { Shimmer } from "@/components/common/shimmer";
import { cn } from "@/lib/utils";

/**
 * Bottom-left floating enquiry launcher. Sits opposite the {@link FloatingContact}
 * call/WhatsApp FAB and opens a dialog with the lead form so visitors can request
 * a callback from anywhere on the site. A persistent "Enquire" tag keeps the CTA
 * legible — a bare icon on the left edge reads as ambiguous otherwise.
 */
export function FloatingEnquiry() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Enquire now — request a callback"
        className={cn(
          "group fixed bottom-5 left-5 z-50 grid place-items-center print:hidden",
          "overflow-hidden rounded-full p-3",
          "bg-gradient-to-br from-accent-orange to-[oklch(0.62_0.2_38)] text-accent-orange-foreground",
          "shadow-[0_8px_24px_oklch(0.62_0.2_38/0.45)] ring-2 ring-white/20",
          "transition-transform duration-200 hover:scale-105 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "animate-fab-pulse",
        )}
      >
        <Shimmer />
        {/* Brighter shine burst on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full"
        />
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/20">
          <ClipboardList className="size-5" aria-hidden="true" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a callback</DialogTitle>
            <DialogDescription>
              Share your details and our team will reach out to help you get
              started.
            </DialogDescription>
          </DialogHeader>
          <LeadForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
