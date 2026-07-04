"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RatingStars } from "@/components/common/rating-stars";
import { cn } from "@/lib/utils";
import type { ReviewDTO } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Deterministic color theme per card so the grid feels lively but stable.
const THEMES = [
  { avatar: "bg-blue-500 text-white", ring: "ring-blue-500/15", accent: "from-blue-500 to-sky-400", bg: "bg-blue-50/60" },
  { avatar: "bg-emerald-500 text-white", ring: "ring-emerald-500/15", accent: "from-emerald-500 to-teal-400", bg: "bg-emerald-50/60" },
  { avatar: "bg-violet-500 text-white", ring: "ring-violet-500/15", accent: "from-violet-500 to-fuchsia-400", bg: "bg-violet-50/60" },
  { avatar: "bg-amber-500 text-white", ring: "ring-amber-500/15", accent: "from-amber-500 to-orange-400", bg: "bg-amber-50/60" },
  { avatar: "bg-rose-500 text-white", ring: "ring-rose-500/15", accent: "from-rose-500 to-pink-400", bg: "bg-rose-50/60" },
  { avatar: "bg-cyan-600 text-white", ring: "ring-cyan-500/15", accent: "from-cyan-500 to-blue-400", bg: "bg-cyan-50/60" },
];

function themeFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return THEMES[h % THEMES.length];
}

// Reviews longer than this are clamped with an inline "Read more" toggle.
const PREVIEW_LENGTH = 130;

export function ReviewCard({
  review,
  className,
}: {
  review: ReviewDTO;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = [review.designation, review.company].filter(Boolean).join(" · ");
  const theme = themeFor(review.id ?? review.studentName);

  const isLong = review.review.length > PREVIEW_LENGTH;
  const shown =
    isLong && !expanded
      ? review.review.slice(0, PREVIEW_LENGTH).trimEnd() + "…"
      : review.review;

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden p-6 pt-7 ring-1 transition-shadow hover:shadow-lg",
        theme.bg,
        theme.ring,
        className,
      )}
    >
      <span
        className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", theme.accent)}
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold shadow-sm",
            theme.avatar,
          )}
        >
          {initials(review.studentName)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{review.studentName}</p>
          {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
        </div>
      </div>
      <RatingStars rating={review.rating} className="mt-4" />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
        “{shown}”
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="ml-1 font-medium text-accent-orange underline underline-offset-2 hover:text-accent-orange/80"
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>
    </Card>
  );
}
