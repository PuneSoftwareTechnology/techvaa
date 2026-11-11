"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type MarqueeItem = { name: string; domain?: string; logo?: string };

function logoSrc(item: MarqueeItem): string | undefined {
  if (item.logo) return item.logo;
  if (item.domain) {
    return `https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`;
  }
}

/**
 * Renders a partner brand mark when a domain is available (resolved via
 * Google's favicon service — free and keyless), falling back to a styled
 * wordmark if the image is missing or fails to load, so a broken logo request
 * never leaves a gap in the track.
 */
function MarqueeItemContent({
  item,
  tile,
}: {
  item: MarqueeItem;
  tile: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? undefined : logoSrc(item);

  if (tile) {
    return (
      <span className="flex h-16 items-center gap-3 rounded-2xl border bg-card px-6 text-base font-semibold tracking-tight text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element -- decorative external logo; plain img avoids remotePattern config and keeps it off the LCP path
          <img
            src={src}
            alt={`${item.name} logo`}
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-8 w-8 shrink-0 object-contain"
          />
        )}
        {item.name}
      </span>
    );
  }

  if (src) {
    return (
      <span className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative external logo; plain img avoids remotePattern config and keeps it off the LCP path */}
        <img
          src={src}
          alt={`${item.name} logo`}
          width={28}
          height={28}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-7 w-7 shrink-0 object-contain"
        />
        {item.name}
      </span>
    );
  }

  return (
    <span className="text-xl font-bold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground">
      {item.name}
    </span>
  );
}

/**
 * Infinite, CSS-driven logo marquee (right-to-left, or left-to-right with
 * `reverse`). The track is duplicated so the -50% translate loops seamlessly.
 * Pauses on hover and respects prefers-reduced-motion (handled in
 * globals.css). `variant="tile"` renders each partner as a card.
 */
export function LogoMarquee({
  items,
  durationSeconds = 32,
  reverse = false,
  variant = "plain",
  announce = true,
  className,
}: {
  items: readonly MarqueeItem[];
  durationSeconds?: number;
  reverse?: boolean;
  variant?: "plain" | "tile";
  /** Set false when a parent already lists the partners for screen readers. */
  announce?: boolean;
  className?: string;
}) {
  const track = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      <ul
        className={cn(
          "flex w-max items-center animate-marquee group-hover:[animation-play-state:paused]",
          variant === "tile" ? "gap-4 py-1" : "gap-12",
          reverse && "[animation-direction:reverse]"
        )}
        style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
        aria-hidden="true"
      >
        {track.map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex shrink-0 items-center">
            <MarqueeItemContent item={item} tile={variant === "tile"} />
          </li>
        ))}
      </ul>
      {/* Accessible, non-animated list for screen readers */}
      {announce && (
        <span className="sr-only">
          Our hiring partners: {items.map((i) => i.name).join(", ")}
        </span>
      )}
    </div>
  );
}
