import "server-only";
import { cache } from "react";
import { blogRepository } from "@/repositories/blog.repository";

export const blogService = {
  getAll: cache(() => blogRepository.findPublished()),
  getFeatured: cache((take = 3) => blogRepository.findPublished({ take })),
  getBySlug: cache((slug: string) => blogRepository.findBySlug(slug)),
  getRelated: cache((slug: string) => blogRepository.findRelated(slug)),
  getAllSlugs: cache(() => blogRepository.findPublishedSlugs()),
};
