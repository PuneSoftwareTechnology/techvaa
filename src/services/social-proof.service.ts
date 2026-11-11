import "server-only";
import { cached } from "@/lib/data-cache";
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
  getAll: cached("review.getAll", () => reviewRepository.findPublished()),
  getTop: cached("review.getTop", (take: number = 6) => reviewRepository.findPublished(take)),
  getRatingSummary: cached("review.getRatingSummary", async (): Promise<RatingSummary> => {
    const reviews = await reviewRepository.findPublished();
    return computeRatingSummary(reviews);
  }),
};

export const placementService = {
  getAll: cached("placement.getAll", () => placementRepository.findPublished()),
  getTop: cached("placement.getTop", (take: number = 12) => placementRepository.findPublished(take)),
  /** "Recently Placed Students" for one course page (admin-curated). */
  getForCourse: cached("placement.getForCourse", (courseId: string, take: number = 20) =>
    placementRepository.findForCourse(courseId, take)
  ),
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
  getForHomepage: cached("testimonial.getForHomepage", async (take: number = 3): Promise<TestimonialDTO[]> =>
    topUpWithReviews(await testimonialRepository.findForHomepage(take), take)
  ),

  /**
   * Course page testimonials: only those tagged to this course in the admin
   * (Testimonial → Courses). Deliberately NOT topped up with general reviews —
   * that showed the same (often other-course) reviews on every course page.
   */
  getForCourse: cached("testimonial.getForCourse", (courseId: string, take: number = 8): Promise<TestimonialDTO[]> =>
    testimonialRepository.findForCourse(courseId, take)
  ),
};
