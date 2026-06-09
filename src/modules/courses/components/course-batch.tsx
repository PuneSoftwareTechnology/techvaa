import Link from "next/link";
import { CalendarDays, Clock, Monitor } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Shimmer } from "@/components/common/shimmer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { CourseDTO } from "@/types";

/** New-batch schedule for a single course — one row, one "Enroll Now" CTA. */
export function CourseBatch({ course }: { course: CourseDTO }) {
  const startDate = "2026-07-01";
  return (
    <section aria-labelledby="batch-title" className="py-16">
      <Container className="max-w-4xl">
        <SectionHeader as="h2" eyebrow="New Batch Schedule" title="Upcoming training" />
        <Reveal className="mt-10">
          <Card className="overflow-hidden p-0">
            <div className="grid items-center gap-6 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {course.title}
                </h3>
                <dl className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="size-4 text-brand" aria-hidden="true" />
                    <span>Live Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-brand" aria-hidden="true" />
                    <span>{formatDate(startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-brand" aria-hidden="true" />
                    <span>{course.duration ?? "12 weeks"}</span>
                  </div>
                </dl>
              </div>
              <Button asChild variant="accent" size="xl" className="relative overflow-hidden">
                <Link href="#contact">
                  <Shimmer />
                  Enroll Now
                </Link>
              </Button>
            </div>
          </Card>
        </Reveal>
      </Container>
    </section>
  );
}
