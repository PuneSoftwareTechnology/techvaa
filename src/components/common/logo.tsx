import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/constants/site";

// Largest rendered size (h-14 = 56px tall at lg; source art is 2029x489).
// Passing the display size — not the 2029px intrinsic size — makes next/image
// serve ~256w/640w (1x/2x) instead of a 1920px file for a 232px logo.
const LOGO_W = 232;
const LOGO_H = 56;

/**
 * Techvaa brand logo. Renders the real artwork:
 *  - `default`  → full-colour logo (use on light backgrounds, e.g. the header)
 *  - `light`    → white knockout (use on dark backgrounds, e.g. the footer)
 */
export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  const src = variant === "light" ? "/logo-white.png" : "/logo.png";
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={src}
        alt={SITE.name}
        width={LOGO_W}
        height={LOGO_H}
        // Header logo is above the fold: load it immediately, but don't
        // preload it — a <head> preload would compete with the hero LCP image.
        loading={variant === "default" ? "eager" : "lazy"}
        className="h-12 w-auto lg:h-14"
      />
    </Link>
  );
}
