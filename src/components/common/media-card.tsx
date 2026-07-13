import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Shared content-card shell used by blog and course cards.
 *
 * Default: mobile is a compact horizontal row (image left, copy right) to fit
 * more cards per screen; sm+ is a classic vertical card with a top banner.
 * `stacked`: image-on-top at every breakpoint — for one-per-row grids where the
 * horizontal row wastes width and truncates the copy.
 *
 * The whole card is clickable via a stretched link; interactive footer
 * elements must set `relative z-10` to sit above it.
 */
export function MediaCard({
  href,
  image,
  title,
  subtitle,
  imageOverlay,
  footer,
  featured = false,
  stacked = false,
  className,
}: {
  href: string;
  image?: string | null;
  title: string;
  subtitle?: ReactNode;
  /** Optional element layered over the image (e.g. a "Featured" badge). */
  imageOverlay?: ReactNode;
  /** Card-specific actions/meta, pinned to the bottom of the copy column. */
  footer?: ReactNode;
  /** Bumps the title size on emphasised cards. */
  featured?: boolean;
  /** Image-on-top at all breakpoints (vs the default mobile horizontal row). */
  stacked?: boolean;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "group relative flex h-full overflow-hidden p-0 transition-shadow hover:shadow-lg",
        stacked ? "flex-col" : "flex-row sm:flex-col",
        className,
      )}
    >
      {/* Stretched link — makes the whole card clickable */}
      <Link href={href} aria-label={title} className="absolute inset-0 z-0" />

      {/* pointer-events-none lets clicks fall through to the stretched link
          behind it, so the image is part of the clickable card. */}
      <div
        className={cn(
          "pointer-events-none relative overflow-hidden bg-brand",
          stacked
            ? "aspect-[16/9] w-full"
            : "w-28 shrink-0 self-stretch sm:aspect-[16/9] sm:w-full sm:self-auto",
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes={
              stacked
                ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 7rem"
            }
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,oklch(0.46_0.11_258),oklch(0.26_0.07_258))]"
          />
        )}
        {imageOverlay}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className={cn(
            "font-heading font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-orange",
            stacked ? "line-clamp-2" : "line-clamp-1 sm:line-clamp-none",
            featured ? "text-base sm:text-xl" : "text-base sm:text-lg",
          )}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={cn(
              "mt-2 text-sm text-muted-foreground",
              stacked ? "line-clamp-2" : "line-clamp-1 sm:line-clamp-2",
            )}
          >
            {subtitle}
          </p>
        )}
        {footer && <div className="mt-auto pt-4">{footer}</div>}
      </div>

      {/* Mobile-only: subtle fade along the bottom edge for a little depth.
          Skipped when stacked — the fade is tuned for the horizontal row. */}
      {!stacked && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-brand/15 to-transparent sm:hidden"
        />
      )}
    </Card>
  );
}
