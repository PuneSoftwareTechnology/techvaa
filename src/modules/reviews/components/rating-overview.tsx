import { Card } from "@/components/ui/card";
import { RatingStars } from "@/components/common/rating-stars";
import type { RatingSummary } from "@/types";

/** Multicolour Google "G" mark — Google brand palette. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

export function RatingOverview({ summary }: { summary: RatingSummary }) {
  const total = summary.count || 1;
  return (
    <Card className="relative h-full justify-center overflow-hidden p-6">
      {/* Google-coloured top accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg,#4285F4 0%,#4285F4 25%,#EA4335 25%,#EA4335 50%,#FBBC05 50%,#FBBC05 75%,#34A853 75%,#34A853 100%)",
        }}
      />

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
          <GoogleMark className="size-4" />
          Google Reviews
        </div>

        <p className="mt-4 font-heading text-6xl font-extrabold leading-none text-foreground">
          {summary.average.toFixed(1)}
          <span className="text-3xl text-muted-foreground">/5</span>
        </p>
        <RatingStars rating={summary.average} size={24} className="mt-3 justify-center" />
        <p className="mt-2 text-sm text-muted-foreground">
          Based on {summary.count} review{summary.count === 1 ? "" : "s"}
        </p>
      </div>

      <ul className="mt-6 space-y-2" aria-label="Rating distribution">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = summary.distribution[star];
          const pct = Math.round((count / total) * 100);
          return (
            <li key={star} className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 text-muted-foreground">{star} star</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full rounded-full bg-amber-400"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-muted-foreground">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
