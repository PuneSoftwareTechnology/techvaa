import "server-only";
import { cached } from "@/lib/data-cache";
import { courseRepository } from "@/repositories/course.repository";

/**
 * Course service. Reads are cached across requests for a short TTL — see
 * lib/data-cache.ts.
 */
export const courseService = {
  getAll: cached("course.getAll", () => courseRepository.findPublished()),
  getFeatured: cached("course.getFeatured", (limit?: number) => courseRepository.findFeatured(limit)),
  getBySlug: cached("course.getBySlug", (slug: string) => courseRepository.findBySlug(slug)),
  getAllSlugs: cached("course.getAllSlugs", () => courseRepository.findPublishedSlugs()),
  getUpcomingBatches: cached("course.getUpcomingBatches", (limit?: number) =>
    courseRepository.findUpcomingBatches(limit),
  ),
};
