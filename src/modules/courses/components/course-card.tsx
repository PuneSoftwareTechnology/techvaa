import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { cn } from "@/lib/utils";
import type { CourseDTO } from "@/types";

/** The subset of course fields the card renders — lets related-course links reuse it. */
type CourseCardData = Pick<
  CourseDTO,
  "title" | "slug" | "shortDescription" | "isFeatured"
>;

export function CourseCard({
  course,
  className,
}: {
  course: CourseCardData;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col gap-0 overflow-hidden p-5 transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Stretched link — makes the whole card clickable */}
      <Link
        href={`/courses/${course.slug}`}
        aria-label={course.title}
        className="absolute inset-0 z-0"
      />

      <div className="flex flex-1 flex-col">
        {course.isFeatured && (
          <Badge className="mb-3 w-fit bg-accent-orange text-accent-orange-foreground">
            Featured
          </Badge>
        )}

        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-orange">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {course.shortDescription}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between pt-2">
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
      </div>
    </Card>
  );
}
