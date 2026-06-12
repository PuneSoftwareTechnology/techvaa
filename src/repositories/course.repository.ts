import "server-only";
import { prisma } from "@/lib/prisma";
import { toBatchScheduleRow, toCourseDTO } from "./mappers";
import type { BatchScheduleRow, CourseDTO } from "@/types";

const PUBLISHED = { isPublished: true, deletedAt: null } as const;

export const courseRepository = {
  async findPublished(): Promise<CourseDTO[]> {
    const rows = await prisma.course.findMany({
      where: PUBLISHED,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: { seo: true },
    });
    return rows.map(toCourseDTO);
  },

  async findFeatured(limit = 3): Promise<CourseDTO[]> {
    const rows = await prisma.course.findMany({
      where: { ...PUBLISHED, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { seo: true },
    });
    return rows.map(toCourseDTO);
  },

  async findBySlug(slug: string): Promise<CourseDTO | null> {
    const row = await prisma.course.findFirst({
      where: { slug, ...PUBLISHED },
      include: {
        seo: true,
        // Key Curriculum, in authored order.
        curriculum: { orderBy: { sortOrder: "asc" } },
        // Upcoming batches that are still open, soonest first.
        batches: {
          where: { isOpen: true },
          orderBy: { startDate: "asc" },
        },
        // Only surface related courses that are themselves live.
        relatedCourses: {
          where: PUBLISHED,
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            shortDescription: true,
            isFeatured: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return row ? toCourseDTO(row) : null;
  },

  /**
   * The next open batches across all published courses, soonest first — feeds
   * the home/courses "Upcoming training batches" table.
   */
  async findUpcomingBatches(limit = 5): Promise<BatchScheduleRow[]> {
    const rows = await prisma.courseBatch.findMany({
      where: { isOpen: true, course: PUBLISHED },
      orderBy: { startDate: "asc" },
      take: limit,
      include: { course: { select: { title: true, slug: true } } },
    });
    return rows.map(toBatchScheduleRow);
  },

  async findPublishedSlugs(): Promise<string[]> {
    const rows = await prisma.course.findMany({
      where: PUBLISHED,
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
};
