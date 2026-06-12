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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}
