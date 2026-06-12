import "server-only";
import { prisma } from "@/lib/prisma";
import { toBlogDTO } from "./mappers";
import type { BlogDTO } from "@/types";

const PUBLISHED = { isPublished: true, deletedAt: null } as const;

export const blogRepository = {
  async findPublished(opts?: { take?: number }): Promise<BlogDTO[]> {
    const rows = await prisma.blog.findMany({
      where: PUBLISHED,
      orderBy: { publishedAt: "desc" },
      take: opts?.take,
      include: { seo: true },
    });
    return rows.map(toBlogDTO);
  },

  async findBySlug(slug: string): Promise<BlogDTO | null> {
    const row = await prisma.blog.findFirst({
      where: { slug, ...PUBLISHED },
      include: {
        seo: true,
        // Only surface related courses that are themselves live.
        relatedCourses: {
          where: PUBLISHED,
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return row ? toBlogDTO(row) : null;
  },

  /**
   * Blogs shown as "Related articles". Prefers the post's curated
   * `relatedBlogs`; falls back to the latest published posts (excluding the
   * current one) when none are curated.
   */
  async findRelated(slug: string, take = 3): Promise<BlogDTO[]> {
    const row = await prisma.blog.findFirst({
      where: { slug, ...PUBLISHED },
      select: {
        relatedBlogs: {
          where: PUBLISHED,
          orderBy: { publishedAt: "desc" },
          take,
          include: { seo: true },
        },
      },
    });
    if (row?.relatedBlogs.length) return row.relatedBlogs.map(toBlogDTO);

    const rows = await prisma.blog.findMany({
      where: { ...PUBLISHED, slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take,
      include: { seo: true },
    });
    return rows.map(toBlogDTO);
  },

  async findPublishedSlugs(): Promise<string[]> {
    const rows = await prisma.blog.findMany({
      where: PUBLISHED,
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
};
