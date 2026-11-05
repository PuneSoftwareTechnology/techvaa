import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { fuzzyRank } from "@/lib/fuzzy";
import { htmlToPlainText } from "@/lib/sanitize";
import { toBlogDTO } from "./mappers";
import type { BlogDTO } from "@/types";

const PUBLISHED = { isPublished: true, deletedAt: null } as const;

// Fields the blog CARD renders. List queries select only these so the heavy
// body sections (primary/secondary/tertiary text, conclusion) and the unused
// `seo` relation never leave the DB. `introduction` stays as the excerpt
// fallback when a post has no metaDescription.
const CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  metaDescription: true,
  featuredImage: true,
  introduction: true,
  publishedAt: true,
} as const;

export const blogRepository = {
  /**
   * One page of the blog listing, optionally filtered by a free-text query.
   * Search is fuzzy (typo-tolerant, see lib/fuzzy) over the title, summary,
   * lede and section titles, ranked best match first. It ranks in memory, which
   * is fine at blog scale (tens of posts) — move to Postgres pg_trgm / full-text
   * search if the archive grows into the thousands.
   * An out-of-range `page` is clamped to the last page so stale links still
   * land on results.
   */
  async findPublishedPage({
    q,
    page,
    pageSize,
  }: {
    q?: string;
    page: number;
    pageSize: number;
  }): Promise<{ items: BlogDTO[]; total: number; page: number; pageCount: number }> {
    if (q) {
      const rows = await prisma.blog.findMany({
        where: PUBLISHED,
        orderBy: { publishedAt: "desc" },
        select: {
          ...CARD_SELECT,
          primaryTitle: true,
          secondaryTitle: true,
          tertiaryTitle: true,
        },
      });
      const ranked = fuzzyRank(q, rows, (b) => [
        { text: b.title, weight: 3 },
        { text: b.metaDescription, weight: 1.5 },
        { text: b.primaryTitle, weight: 1.5 },
        { text: b.secondaryTitle, weight: 1.5 },
        { text: b.tertiaryTitle, weight: 1.5 },
        { text: htmlToPlainText(b.introduction), weight: 1 },
      ]);
      const total = ranked.length;
      const pageCount = Math.max(1, Math.ceil(total / pageSize));
      const current = Math.min(Math.max(1, page), pageCount);
      const items = ranked.slice((current - 1) * pageSize, current * pageSize);
      return { items: items.map(toBlogDTO), total, page: current, pageCount };
    }

    const where: Prisma.BlogWhereInput = { ...PUBLISHED };
    const total = await prisma.blog.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(Math.max(1, page), pageCount);

    const rows = await prisma.blog.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (current - 1) * pageSize,
      take: pageSize,
      select: CARD_SELECT,
    });
    return { items: rows.map(toBlogDTO), total, page: current, pageCount };
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
   * `relatedBlogIds` (resolved to live blogs, in the curated order); falls back
   * to the latest published posts (excluding the current one) when none are
   * curated.
   */
  async findRelated(slug: string, take = 3): Promise<BlogDTO[]> {
    const blog = await prisma.blog.findFirst({
      where: { slug, ...PUBLISHED },
      select: { relatedBlogIds: true },
    });

    if (blog?.relatedBlogIds.length) {
      const curated = await prisma.blog.findMany({
        where: { id: { in: blog.relatedBlogIds }, ...PUBLISHED },
        include: { seo: true },
      });
      // `IN` doesn't preserve order; restore the curated order and cap to `take`.
      const byId = new Map(curated.map((b) => [b.id, b]));
      const ordered = blog.relatedBlogIds
        .map((id) => byId.get(id))
        .filter((b): b is (typeof curated)[number] => b !== undefined)
        .slice(0, take);
      if (ordered.length) return ordered.map(toBlogDTO);
    }

    const rows = await prisma.blog.findMany({
      where: { ...PUBLISHED, slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take,
      include: { seo: true },
    });
    return rows.map(toBlogDTO);
  },

  /**
   * Published blogs tagged with the given course (the reciprocal of a blog's
   * `relatedCourses`). Powers the "Related articles" block on course pages,
   * which strengthens topic-cluster internal linking for SEO.
   */
  async findForCourse(courseSlug: string, take = 3): Promise<BlogDTO[]> {
    const rows = await prisma.blog.findMany({
      where: { ...PUBLISHED, relatedCourses: { some: { slug: courseSlug } } },
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
