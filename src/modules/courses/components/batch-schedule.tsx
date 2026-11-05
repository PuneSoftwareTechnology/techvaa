import Link from "next/link";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { BatchScheduleRow, BatchStatus } from "@/types";

const STATUS_STYLES: Record<BatchStatus, string> = {
  "Enrollment Open": "bg-emerald-100 text-emerald-700",
  "Limited Seats": "bg-amber-100 text-amber-700",
  "Filling Fast": "bg-rose-100 text-rose-700",
};

const STATUS_DOT: Record<BatchStatus, string> = {
  "Enrollment Open": "bg-emerald-500",
  "Limited Seats": "bg-amber-500",
  "Filling Fast": "bg-rose-500",
};

/** Compact status chip: its own column on desktop, above the title on mobile. */
function StatusPill({ status }: { status: BatchStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4",
        STATUS_STYLES[status]
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", STATUS_DOT[status])}
      />
      {status}
    </span>
  );
}

/** Colored accent stripe on mobile cards so each batch reads as distinct. */
const STATUS_ACCENT: Record<BatchStatus, string> = {
  "Enrollment Open": "border-l-emerald-500",
  "Limited Seats": "border-l-amber-500",
  "Filling Fast": "border-l-rose-500",
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
  eyebrow = "Next Batch Schedules",
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

        <Reveal className="mt-8 sm:mt-12 md:overflow-hidden md:rounded-2xl md:border md:bg-card md:shadow-sm">
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
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {formatDate(b.startDate)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {b.duration}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={b.status} />
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

          {/* Mobile cards — each batch is its own distinct card with a
              status-colored accent stripe so they don't blur together. */}
          <ul className="space-y-4 md:hidden">
            {rows.map((b) => (
              <li
                key={b.id}
                className={cn(
                  "rounded-2xl border border-l-4 bg-card p-5 shadow-sm",
                  STATUS_ACCENT[b.status]
                )}
              >
                <div className="border-b pb-3">
                  <StatusPill status={b.status} />
                  <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">
                    {b.courseTitle}
                  </h3>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-x-3 rounded-xl bg-secondary/60 p-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Mode
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {b.mode}
                    </dd>
                  </div>
                  <div className="border-l pl-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Start
                    </dt>
                    <dd className="mt-0.5 font-semibold text-brand">
                      {formatDate(b.startDate)}
                    </dd>
                  </div>
                  <div className="border-l pl-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Duration
                    </dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
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
