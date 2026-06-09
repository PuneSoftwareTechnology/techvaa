"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type MarqueeItem = { name: string; domain?: string };

/**
 * Renders a partner brand mark when a domain is available (resolved via
 * Google's favicon service — free and keyless), falling back to a styled
 * wordmark if the image is missing or fails to load, so a broken logo request
 * never leaves a gap in the track.
 */
function MarqueeItemContent({ item }: { item: MarqueeItem }) {
  const [failed, setFailed] = useState(false);

  if (item.domain && !failed) {
    return (
      <span className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative external logo; plain img avoids remotePattern config and keeps it off the LCP path */}
        <img
          src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
          alt=""
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
 * Infinite, CSS-driven logo marquee (right-to-left). The track is duplicated so
 * the -50% translate loops seamlessly. Pauses on hover and respects
 * prefers-reduced-motion (handled in globals.css).
 */
export function LogoMarquee({
  items,
  durationSeconds = 32,
  className,
}: {
  items: readonly MarqueeItem[];
  durationSeconds?: number;
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
        className="flex w-max items-center gap-12 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
        aria-hidden="true"
      >
        {track.map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex shrink-0 items-center">
            <MarqueeItemContent item={item} />
          </li>
        ))}
      </ul>
      {/* Accessible, non-animated list for screen readers */}
      <span className="sr-only">
        Our hiring partners: {items.map((i) => i.name).join(", ")}
      </span>
    </div>
  );
}
