import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/constants/site";

// Intrinsic size of the source logo files (public/logo.png, public/logo-white.png).
const LOGO_W = 1430;
const LOGO_H = 385;

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
        priority={variant === "default"}
        className="h-12 w-auto lg:h-14"
      />
    </Link>
  );
}
