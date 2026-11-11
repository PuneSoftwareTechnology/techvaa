import "server-only";
import { cached } from "@/lib/data-cache";
import { blogRepository } from "@/repositories/blog.repository";

export const BLOGS_PER_PAGE = 6;

const getListingPage = cached("blog.getPage", (page: number) =>
  blogRepository.findPublishedPage({ page, pageSize: BLOGS_PER_PAGE })
);

export const blogService = {
  // Plain listing pages are cached; free-text searches go straight to the DB so
  // arbitrary queries can't fill the cache.
  getPage: (page: number, q?: string) =>
    q
      ? blogRepository.findPublishedPage({ q, page, pageSize: BLOGS_PER_PAGE })
      : getListingPage(page),
  getBySlug: cached("blog.getBySlug", (slug: string) => blogRepository.findBySlug(slug)),
  getRelated: cached("blog.getRelated", (slug: string) => blogRepository.findRelated(slug)),
  getForCourse: cached("blog.getForCourse", (slug: string) => blogRepository.findForCourse(slug)),
  getAllSlugs: cached("blog.getAllSlugs", () => blogRepository.findPublishedSlugs()),
};
