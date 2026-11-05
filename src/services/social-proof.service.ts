import "server-only";
import { cache } from "react";
import {
  placementRepository,
  reviewRepository,
  testimonialRepository,
} from "@/repositories/social-proof.repository";
import type { RatingSummary, ReviewDTO, TestimonialDTO } from "@/types";

function computeRatingSummary(reviews: ReviewDTO[]): RatingSummary {
  const distribution: RatingSummary["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (const r of reviews) {
    const key = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
    distribution[key] += 1;
  }
  const count = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = count ? Math.round((sum / count) * 10) / 10 : 0;
  return { average, count, distribution };
}

/** Present published reviews in the testimonial card shape. */
function reviewsAsTestimonials(reviews: ReviewDTO[]): TestimonialDTO[] {
  return reviews.map((r) => ({
    id: r.id,
    name: r.studentName,
    role: r.designation,
    company: r.company,
    message: r.review,
    image: r.image,
    videoUrl: null,
  }));
}

export const reviewService = {
  getAll: cache(() => reviewRepository.findPublished()),
  getTop: cache((take = 6) => reviewRepository.findPublished(take)),
  getRatingSummary: cache(async (): Promise<RatingSummary> => {
    const reviews = await reviewRepository.findPublished();
    return computeRatingSummary(reviews);
  }),
};

export const placementService = {
  getAll: cache(() => placementRepository.findPublished()),
  getTop: cache((take = 12) => placementRepository.findPublished(take)),
};

/**
 * Fill a short testimonial list up to `take` with top published reviews, so the
 * reviews carousel always has enough cards to page through.
 */
async function topUpWithReviews(
  own: TestimonialDTO[],
  take: number,
): Promise<TestimonialDTO[]> {
  if (own.length >= take) return own;
  const reviews = await reviewRepository.findPublished(take - own.length);
  return [...own, ...reviewsAsTestimonials(reviews)];
}

export const testimonialService = {
  /**
   * Homepage success stories: testimonials flagged `showOnHomepage` first,
   * topped up with published reviews.
   */
  getForHomepage: cache(async (take = 3): Promise<TestimonialDTO[]> =>
    topUpWithReviews(await testimonialRepository.findForHomepage(take), take)
  ),

  /**
   * Course page success stories: testimonials tagged to this course first,
   * topped up with published reviews.
   */
  getForCourse: cache(async (courseId: string, take = 8): Promise<TestimonialDTO[]> =>
    topUpWithReviews(await testimonialRepository.findForCourse(courseId, take), take)
  ),
};
