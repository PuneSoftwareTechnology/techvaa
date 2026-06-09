import type { Metadata } from "next";
import { SITE } from "@/constants/site";

export function absoluteUrl(path = "/"): string {
  const base = SITE.url.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

type BuildMetadataArgs = {
  title?: string;
  description?: string;
  path?: string;
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
  image,
  keywords,
  robots,
  type = "website",
}: BuildMetadataArgs = {}): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const noindex = robots?.startsWith("NOINDEX");

  // When no explicit image is supplied we omit openGraph.images so the
  // file-based `opengraph-image` convention provides the branded fallback.
  const explicitImage = image
    ? [{ url: absoluteUrl(image), width: 1200, height: 630, alt: resolvedTitle }]
    : undefined;

  return {
    title: title ?? `${SITE.name} — ${SITE.tagline}`,
    description,
    keywords,
    alternates: { canonical: url },
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
      ...(explicitImage ? { images: explicitImage } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(image ? { images: [absoluteUrl(image)] } : {}),
    },
  };
}
