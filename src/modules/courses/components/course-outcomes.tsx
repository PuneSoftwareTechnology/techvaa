import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { DynamicIcon } from "@/components/common/dynamic-icon";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COURSE_OUTCOME_STATS } from "@/constants/course-detail";

/** Colored icon tiles, rotated so each outcome stat pops on the dark band. */
const STAT_TILES = [
  "bg-accent-orange/20 text-accent-orange",
  "bg-emerald-400/20 text-emerald-300",
  "bg-sky-400/20 text-sky-300",
  "bg-violet-400/20 text-violet-300",
];

export function CourseOutcomes({ courseTitle }: { courseTitle: string }) {
  return (
    <section
      aria-labelledby="outcomes-title"
      className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-[oklch(0.26_0.09_262)] py-14 text-white"
    >
      {/* decorative warm glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-accent-orange/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-sky-500/20 blur-3xl"
      />
      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-orange">
            Why learners choose us
          </p>
          <h2
            id="outcomes-title"
            className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Outcomes you can count on
          </h2>
        </Reveal>
        <Reveal className="mt-12">
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {COURSE_OUTCOME_STATS.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center ring-1 ring-white/5 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div
                  className={cn(
                    "mx-auto mb-3 grid size-12 place-items-center rounded-xl",
                    STAT_TILES[i % STAT_TILES.length],
                  )}
                >
                  <DynamicIcon name={s.icon} className="size-6" />
                </div>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-heading text-2xl font-extrabold text-white">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-sm text-white/70">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="mt-10 text-center">
          <EnrollDialog
            course={courseTitle}
            trigger={{
              label: `Enroll in ${courseTitle}`,
              className: cn(
                buttonVariants({ variant: "accent", size: "xl" }),
                "relative overflow-hidden",
              ),
              shimmer: true,
            }}
          />
        </div>
      </Container>
    </section>
  );
}
