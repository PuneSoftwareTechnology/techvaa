import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { MediaCard } from "@/components/common/media-card";
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
  return (
    <MediaCard
      href={`/courses/${course.slug}`}
      image={course.image}
      title={course.title}
      subtitle={course.shortDescription}
      className={className}
      imageOverlay={
        course.isFeatured ? (
          <Badge className="absolute left-2 top-2 z-10 bg-accent-orange text-accent-orange-foreground">
            Featured
          </Badge>
        ) : undefined
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <EnrollDialog
            course={course.title}
            trigger={{
              label: "Talk to us",
              className:
                "relative z-10 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            }}
          />
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange transition-transform group-hover:translate-x-0.5">
            Learn more
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      }
    />
  );
}
