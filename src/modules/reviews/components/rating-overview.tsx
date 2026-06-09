import { Card } from "@/components/ui/card";
import { RatingStars } from "@/components/common/rating-stars";
import type { RatingSummary } from "@/types";

export function RatingOverview({ summary }: { summary: RatingSummary }) {
  const total = summary.count || 1;
  return (
    <Card className="p-6">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">Student Rating</p>
        <p className="mt-1 font-heading text-5xl font-extrabold text-foreground">
          {summary.average.toFixed(1)}
          <span className="text-2xl text-muted-foreground">/5</span>
        </p>
        <RatingStars rating={summary.average} size={20} className="mt-2 justify-center" />
        <p className="mt-2 text-xs text-muted-foreground">
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
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
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
