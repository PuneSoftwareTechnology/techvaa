import { courseService } from "@/services/course.service";
import { SITE } from "@/constants/site";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgImage } from "@/lib/og";

export const alt = `${SITE.name} SAP training course`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Branded Open Graph card per course, with the course title rendered large.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await courseService.getBySlug(slug);
  return renderOgImage({
    eyebrow: "SAP Training Course",
    title: course?.title ?? `${SITE.name} — ${SITE.tagline}`,
  });
}
