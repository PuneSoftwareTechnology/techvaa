import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { cn } from "@/lib/utils";
import type { CourseDTO } from "@/types";

/** The subset of course fields the card renders — lets related-course links reuse it. */
type CourseCardData = Pick<
  CourseDTO,
  "title" | "slug" | "image" | "shortDescription" | "isFeatured"
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
        "group relative flex h-full flex-col gap-0 overflow-hidden p-0 transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-brand">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            {/* Decorative module band — fallback when course.image is unset */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,oklch(0.42_0.1_258),oklch(0.28_0.08_258))]"
            />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <span className="text-balance text-center text-xl font-bold tracking-tight text-white/95">
                {course.title}
              </span>
            </div>
          </>
        )}
        {course.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-accent-orange text-accent-orange-foreground">
            Featured
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
          <Link
            href={`/courses/${course.slug}`}
            className="transition-colors hover:text-accent-orange"
          >
            {course.title}
          </Link>
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
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            }}
          />
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange transition-transform hover:translate-x-0.5"
          >
            Learn more
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
