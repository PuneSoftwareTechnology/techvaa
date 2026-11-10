import type { Metadata } from "next";
import { SITE } from "@/constants/site";

/** Default share image (1200×630) for pages without their own. */
export const DEFAULT_OG_IMAGE = "/og-image.png";

export function absoluteUrl(path = "/"): string {
  const base = SITE.url.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

type BuildMetadataArgs = {
  title?: string;
  description?: string;
  path?: string;
  /**
   * Explicit canonical URL override (e.g. a DB-managed `canonicalUrl`). When
   * omitted the canonical is derived from `path`. Accepts an absolute URL or a
   * root-relative path.
   */
  canonical?: string | null;
  image?: string | null;
  keywords?: string[];
  robots?: string;
  type?: "website" | "article";
};

/**
 * Centralised Metadata builder so every route emits a consistent title
 * template, canonical URL, Open Graph and Twitter card block.
 */
export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  canonical,
  image,
  keywords,
  robots,
  type = "website",
}: BuildMetadataArgs = {}): Metadata {
  const url = absoluteUrl(path);
  const canonicalUrl = canonical ? absoluteUrl(canonical) : url;
  // A title that already carries the brand (e.g. "Techvaa - SAP Training
  // Institute in Pune") skips the "%s | Techvaa" template so it isn't doubled.
  const branded = title?.includes(SITE.name) ?? false;
  const resolvedTitle = title
    ? branded
      ? title
      : `${title} | ${SITE.name}`
    : `${SITE.name} — ${SITE.tagline}`;
  const noindex = robots?.startsWith("NOINDEX");

  // Falls back to a STATIC branded PNG in /public. A static file is served
  // with a Content-Length header; the generated `opengraph-image` route
  // streamed without one, and WhatsApp on phones then drops the preview image.
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);
  const explicitImage = [
    { url: ogImage, width: 1200, height: 630, alt: resolvedTitle },
  ];

  return {
    title: branded ? { absolute: resolvedTitle } : (title ?? resolvedTitle),
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    robots: noindex
      ? { index: false, follow: !robots?.endsWith("NOFOLLOW") }
      : { index: true, follow: true },
    openGraph: {
      type,
      siteName: SITE.name,
      title: resolvedTitle,
      description,
      url,
      locale: SITE.locale,
      images: explicitImage,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [ogImage],
    },
  };
}
