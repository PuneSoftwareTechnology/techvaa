import "server-only";
import { prisma } from "@/lib/prisma";
import { toBlogDTO } from "./mappers";
import type { BlogCategoryDTO, BlogDTO } from "@/types";

const PUBLISHED = { isPublished: true, deletedAt: null } as const;

export const blogRepository = {
  async findPublished(opts?: {
    categorySlug?: string;
    take?: number;
  }): Promise<BlogDTO[]> {
    const rows = await prisma.blog.findMany({
      where: {
        ...PUBLISHED,
        ...(opts?.categorySlug
          ? { category: { slug: opts.categorySlug } }
          : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: opts?.take,
      include: { category: true, seo: true },
    });
    return rows.map(toBlogDTO);
  },

  async findBySlug(slug: string): Promise<BlogDTO | null> {
    const row = await prisma.blog.findFirst({
      where: { slug, ...PUBLISHED },
      include: {
        category: true,
        seo: true,
        relatedCourse: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          },
        },
      },
    });
    return row ? toBlogDTO(row) : null;
  },

  async findRelated(slug: string, categoryId: string, take = 3): Promise<BlogDTO[]> {
    const rows = await prisma.blog.findMany({
      where: { ...PUBLISHED, categoryId, slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take,
      include: { category: true, seo: true },
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

  async findCategories(): Promise<BlogCategoryDTO[]> {
    const rows = await prisma.blogCategory.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
    }));
  },
};
