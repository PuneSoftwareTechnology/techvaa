import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Shared content-card shell used by blog and course cards.
 *
 * Mobile: compact horizontal row (image left, copy right) to fit more cards
 * per screen. sm+: classic vertical card with a top banner image.
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
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-row overflow-hidden p-0 transition-shadow hover:shadow-lg sm:flex-col",
        className,
      )}
    >
      {/* Stretched link — makes the whole card clickable */}
      <Link href={href} aria-label={title} className="absolute inset-0 z-0" />

      <div className="relative w-28 shrink-0 self-stretch overflow-hidden bg-brand sm:aspect-[16/9] sm:w-full sm:self-auto">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 7rem"
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
            "line-clamp-1 font-heading font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-orange sm:line-clamp-none",
            featured ? "text-base sm:text-xl" : "text-base sm:text-lg",
          )}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground sm:line-clamp-2">
            {subtitle}
          </p>
        )}
        {footer && <div className="mt-auto pt-4">{footer}</div>}
      </div>

      {/* Mobile-only: subtle fade along the bottom edge for a little depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-brand/15 to-transparent sm:hidden"
      />
    </Card>
  );
}
