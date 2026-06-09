"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewCard } from "./review-card";
import type { ReviewDTO } from "@/types";

const RATING_OPTIONS = [
  { value: "all", label: "All ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars & up" },
  { value: "3", label: "3 stars & up" },
];

export function ReviewsList({ reviews }: { reviews: ReviewDTO[] }) {
  const [minRating, setMinRating] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const min = minRating === "all" ? 0 : Number(minRating);
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      if (r.rating < min) return false;
      if (!q) return true;
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.review.toLowerCase().includes(q) ||
        (r.company?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [reviews, minRating, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:w-52">
          <Label htmlFor="rating-filter" className="mb-1.5 block text-sm font-medium">
            Filter by rating
          </Label>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger id="rating-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex-1">
          <Label htmlFor="review-search" className="mb-1.5 block text-sm font-medium">
            Search reviews
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="review-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, company or keyword"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">
        Showing {filtered.length} of {reviews.length} reviews
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-xl border bg-card p-10 text-center text-muted-foreground">
          No reviews match your filters.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
