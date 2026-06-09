import "server-only";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

type Fallback = {
  title: string;
  description: string;
  image?: string | null;
  keywords?: string[];
};

/**
 * Metadata for a FIXED page, read from the `page_seo` table with a fallback to
 * the page's hardcoded defaults. Admins override a page's SEO in the admin's
 * SEO module; if no row exists (or the DB is unreachable) the defaults stand,
 * so behaviour never regresses.
 */
export async function pageMetadata(
  path: string,
  fallback: Fallback
): Promise<Metadata> {
  const seo = await prisma.pageSeo
    .findUnique({ where: { path } })
    .catch(() => null);

  return buildMetadata({
    title: seo?.metaTitle ?? fallback.title,
    description: seo?.metaDescription ?? fallback.description,
    path,
    image: seo?.ogImage ?? fallback.image,
    keywords: seo?.keywords?.length ? seo.keywords : fallback.keywords,
    robots: seo?.robots,
  });
}
