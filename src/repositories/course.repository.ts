import "server-only";
import { prisma } from "@/lib/prisma";
import { toCourseDTO } from "./mappers";
import type { CourseDTO } from "@/types";

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
      include: { seo: true },
    });
    return row ? toCourseDTO(row) : null;
  },

  async findPublishedSlugs(): Promise<string[]> {
    const rows = await prisma.course.findMany({
      where: PUBLISHED,
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
};
