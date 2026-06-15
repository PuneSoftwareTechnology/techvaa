import { ReviewCard } from "./review-card";
import type { ReviewDTO } from "@/types";

export function ReviewsList({ reviews }: { reviews: ReviewDTO[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
        No reviews yet.
      </p>
    );
  }

  return (
    <div className="gap-4 [column-fill:_balance] columns-2 sm:gap-6 lg:columns-3">
      {reviews.map((r) => (
        <ReviewCard
          key={r.id}
          review={r}
          className="mb-4 break-inside-avoid sm:mb-6"
        />
      ))}
    </div>
  );
}
