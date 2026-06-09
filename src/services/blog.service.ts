import "server-only";
import { cache } from "react";
import { blogRepository } from "@/repositories/blog.repository";

export const blogService = {
  getAll: cache((categorySlug?: string) =>
    blogRepository.findPublished({ categorySlug })
  ),
  getFeatured: cache((take = 3) => blogRepository.findPublished({ take })),
  getBySlug: cache((slug: string) => blogRepository.findBySlug(slug)),
  getRelated: cache((slug: string, categoryId: string) =>
    blogRepository.findRelated(slug, categoryId)
  ),
  getAllSlugs: cache(() => blogRepository.findPublishedSlugs()),
  getCategories: cache(() => blogRepository.findCategories()),
};
