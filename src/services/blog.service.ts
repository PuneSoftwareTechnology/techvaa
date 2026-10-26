import "server-only";
import { cache } from "react";
import { blogRepository } from "@/repositories/blog.repository";

export const BLOGS_PER_PAGE = 6;

export const blogService = {
  getPage: cache((page: number, q?: string) =>
    blogRepository.findPublishedPage({ q, page, pageSize: BLOGS_PER_PAGE })
  ),
  getFeatured: cache((take = 3) => blogRepository.findPublished({ take })),
  getBySlug: cache((slug: string) => blogRepository.findBySlug(slug)),
  getRelated: cache((slug: string) => blogRepository.findRelated(slug)),
  getForCourse: cache((slug: string) => blogRepository.findForCourse(slug)),
  getAllSlugs: cache(() => blogRepository.findPublishedSlugs()),
};
