import { cn } from "@/lib/utils";

/**
 * Looping diagonal shine sweep used to draw attention to a CTA.
 *
 * Drop it inside a `relative overflow-hidden` element (e.g. a Button). It is
 * purely decorative, respects `prefers-reduced-motion` (see `.animate-shimmer`
 * in globals.css), and never intercepts pointer events.
 */
export function Shimmer({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "animate-shimmer pointer-events-none absolute -inset-y-6 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent blur-md",
        className,
      )}
    />
  );
}
