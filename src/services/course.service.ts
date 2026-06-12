import "server-only";
import { cache } from "react";
import { courseRepository } from "@/repositories/course.repository";

/**
 * Course service. `cache()` dedupes calls within a single render pass; ISR
 * freshness is controlled by `export const revalidate` on the consuming route.
 */
export const courseService = {
  getAll: cache(() => courseRepository.findPublished()),
  getFeatured: cache((limit?: number) => courseRepository.findFeatured(limit)),
  getBySlug: cache((slug: string) => courseRepository.findBySlug(slug)),
  getAllSlugs: cache(() => courseRepository.findPublishedSlugs()),
  getUpcomingBatches: cache((limit?: number) =>
    courseRepository.findUpcomingBatches(limit),
  ),
};
