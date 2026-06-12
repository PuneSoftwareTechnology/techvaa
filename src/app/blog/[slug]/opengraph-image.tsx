import { blogService } from "@/services/blog.service";
import { SITE } from "@/constants/site";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

export const alt = `${SITE.name} SAP insights article`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Branded Open Graph card per blog post, with the article title rendered large.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await blogService.getBySlug(slug);
  return renderOgImage({
    eyebrow: "SAP Insights Hub",
    title: blog?.title ?? `${SITE.name} — ${SITE.tagline}`,
  });
}
