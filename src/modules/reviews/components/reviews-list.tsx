"use client";

import { useState } from "react";
import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import type { ReviewDTO } from "@/types";

// The grid is 3-up on desktop. Show 3 rows initially, then reveal one row
// (3 cards) per "Read more" click until every review is on the page.
const INITIAL_COUNT = 9;
const STEP = 3;

export function ReviewsList({ reviews }: { reviews: ReviewDTO[] }) {
  const [visible, setVisible] = useState(INITIAL_COUNT);

  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
        No reviews yet.
      </p>
    );
  }

  const shown = reviews.slice(0, visible);
  const hasMore = visible < reviews.length;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {shown.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center sm:mt-10">
          <Button
            type="button"
            size="cta"
            onClick={() => setVisible((v) => Math.min(v + STEP, reviews.length))}
          >
            Read More
          </Button>
        </div>
      )}
    </div>
  );
}
