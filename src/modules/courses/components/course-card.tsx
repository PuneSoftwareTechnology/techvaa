import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaCard } from "@/components/common/media-card";
import { richTextToInlineHtml } from "@/lib/sanitize";
import { courseShortName } from "@/lib/course-short-name";
import type { CourseDTO } from "@/types";

/** The subset of course fields the card renders — lets related-course links reuse it. */
type CourseCardData = Pick<
  CourseDTO,
  "title" | "slug" | "shortDescription" | "isFeatured" | "image"
>;

export function CourseCard({
  course,
  className,
}: {
  course: CourseCardData;
  className?: string;
}) {
  // shortDescription is authored in the rich text editor; flatten it to inline
  // HTML so bold/links survive but block tags (<p>, …) don't leak as text.
  const blurb = richTextToInlineHtml(course.shortDescription);
  const shortName = courseShortName(course);

  return (
    <MediaCard
      stacked
      href={`/courses/${course.slug}`}
      image={course.image}
      title={course.title}
      subtitle={
        blurb ? <span dangerouslySetInnerHTML={{ __html: blurb }} /> : undefined
      }
      className={className}
      imageOverlay={
        course.isFeatured ? (
          <Badge className="absolute left-2 top-2 z-10 bg-accent-orange-strong text-accent-orange-foreground">
            Featured
          </Badge>
        ) : undefined
      }
      footer={
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/courses/${course.slug}`}
            // A generic "Explore Course" (unknown module) repeats on every card;
            // name the target so screen-reader link lists can tell them apart.
            aria-label={shortName ? undefined : `Explore Course: ${course.title}`}
            className="relative z-10 inline-flex items-center gap-1 text-sm font-semibold text-accent-orange-strong dark:text-accent-orange transition-transform hover:underline group-hover:translate-x-0.5"
          >
            {shortName ? `Explore ${shortName} Course` : "Explore Course"}
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      }
    />
  );
}
