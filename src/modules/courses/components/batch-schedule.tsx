import Link from "next/link";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { BatchScheduleRow, BatchStatus } from "@/types";

const STATUS_STYLES: Record<BatchStatus, string> = {
  "Enrollment Open": "bg-emerald-100 text-emerald-700",
  "Limited Seats": "bg-amber-100 text-amber-700",
  "Filling Fast": "bg-rose-100 text-rose-700",
};

interface BatchScheduleProps {
  /** Batch rows to render — either the next batches across courses or one
   *  course's batches. The table is omitted entirely when this is empty. */
  rows: BatchScheduleRow[];
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Hide the "View Details" link — used on a course detail page where the
   *  link would point back to the page you're already on. */
  hideViewDetails?: boolean;
}

/**
 * The shared "Upcoming training batches" schedule. Used on the home and courses
 * pages (next batches across all courses) and on a course detail page (that
 * course's batches). Data shape is identical; only the source query differs.
 */
export function BatchSchedule({
  rows,
  eyebrow = "New Batch Schedules",
  title = "Upcoming training batches",
  description = "Reserve your seat in the next live cohort. Limited seats per batch to keep mentorship hands-on.",
  hideViewDetails = false,
}: BatchScheduleProps) {
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="batches-title" className="bg-secondary/40 py-12 sm:py-20">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <Reveal className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm sm:mt-12">
          {/* Desktop table */}
          <table className="hidden w-full text-left md:table">
            <thead className="bg-brand text-brand-foreground">
              <tr className="text-xs uppercase tracking-wide">
                <th scope="col" className="px-5 py-4 font-semibold">
                  Course / Module
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  Mode
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  Start Date
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  Duration
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className="text-sm transition-colors hover:bg-secondary/50"
                >
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-foreground"
                  >
                    {b.courseTitle}
                  </th>
                  <td className="px-5 py-4 text-muted-foreground">{b.mode}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(b.startDate)}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {b.duration}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      className={cn("font-medium", STATUS_STYLES[b.status])}
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!hideViewDetails && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/courses/${b.courseSlug}`}>
                            View Details
                          </Link>
                        </Button>
                      )}
                      <EnrollDialog course={b.courseTitle} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y md:hidden">
            {rows.map((b) => (
              <li key={b.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold leading-snug text-foreground">
                    {b.courseTitle}
                  </h3>
                  <Badge className={cn("shrink-0", STATUS_STYLES[b.status])}>
                    {b.status}
                  </Badge>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-x-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Mode
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {b.mode}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Start
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {formatDate(b.startDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Duration
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {b.duration}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <EnrollDialog course={b.courseTitle} className="flex-1" />
                  {!hideViewDetails && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Link href={`/courses/${b.courseSlug}`}>View Details</Link>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
