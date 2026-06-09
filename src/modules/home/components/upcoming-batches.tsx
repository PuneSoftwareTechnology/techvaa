import Link from "next/link";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { UPCOMING_BATCHES, type BatchStatus } from "@/constants/home";

const STATUS_STYLES: Record<BatchStatus, string> = {
  "Enrollment Open": "bg-emerald-100 text-emerald-700",
  "Limited Seats": "bg-amber-100 text-amber-700",
  "Filling Fast": "bg-rose-100 text-rose-700",
};

export function UpcomingBatches() {
  return (
    <section aria-labelledby="batches-title" className="bg-secondary/40 py-20">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="New Batch Schedules"
          title="Upcoming training batches"
          description="Reserve your seat in the next live cohort. Limited seats per batch to keep mentorship hands-on."
        />

        <Reveal className="mt-12 overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full text-left md:table">
            <thead className="bg-brand text-brand-foreground">
              <tr className="text-xs uppercase tracking-wide">
                <th scope="col" className="px-5 py-4 font-semibold">Course / Module</th>
                <th scope="col" className="px-5 py-4 font-semibold">Mode</th>
                <th scope="col" className="px-5 py-4 font-semibold">Start Date</th>
                <th scope="col" className="px-5 py-4 font-semibold">Timing (EST)</th>
                <th scope="col" className="px-5 py-4 font-semibold">Status</th>
                <th scope="col" className="px-5 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {UPCOMING_BATCHES.map((b) => (
                <tr key={b.module} className="text-sm transition-colors hover:bg-secondary/50">
                  <th scope="row" className="px-5 py-4 font-semibold text-foreground">
                    {b.module}
                  </th>
                  <td className="px-5 py-4 text-muted-foreground">{b.mode}</td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(b.startDate)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{b.timing}</td>
                  <td className="px-5 py-4">
                    <Badge className={cn("font-medium", STATUS_STYLES[b.status])}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/courses/${b.courseSlug}`}>View Details</Link>
                      </Button>
                      <EnrollDialog course={b.module} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y md:hidden">
            {UPCOMING_BATCHES.map((b) => (
              <li key={b.module} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-foreground">{b.module}</h3>
                  <Badge className={cn("shrink-0", STATUS_STYLES[b.status])}>
                    {b.status}
                  </Badge>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div><dt className="text-xs uppercase">Mode</dt><dd>{b.mode}</dd></div>
                  <div><dt className="text-xs uppercase">Start</dt><dd>{formatDate(b.startDate)}</dd></div>
                  <div className="col-span-2"><dt className="text-xs uppercase">Timing</dt><dd>{b.timing}</dd></div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <EnrollDialog course={b.module} className="flex-1" />
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link href={`/courses/${b.courseSlug}`}>View Details</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
