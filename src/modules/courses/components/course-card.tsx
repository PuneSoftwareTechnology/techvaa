import Link from "next/link";
import { ArrowRight, Clock, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { levelLabel } from "@/lib/format";
import type { CourseDTO } from "@/types";

export function CourseCard({
  course,
  className,
}: {
  course: CourseDTO;
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
        {/* Decorative module band — replace with course.image when available */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,oklch(0.42_0.1_258),oklch(0.28_0.08_258))]"
        />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <span className="text-balance text-center text-xl font-bold tracking-tight text-white/95">
            {course.title}
          </span>
        </div>
        {course.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-accent-orange text-accent-orange-foreground">
            Featured
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BarChart3 className="size-3.5" aria-hidden="true" />
            {levelLabel(course.level)}
          </span>
          {course.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              {course.duration}
            </span>
          )}
        </div>

        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
          <Link
            href={`/courses/${course.slug}`}
            className="after:absolute after:inset-0"
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
          <span className="text-sm font-medium text-muted-foreground">
            Talk to us
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange transition-transform group-hover:translate-x-0.5">
            Learn more
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Card>
  );
}
