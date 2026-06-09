import Link from "next/link";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { DynamicIcon } from "@/components/common/dynamic-icon";
import { Shimmer } from "@/components/common/shimmer";
import { Button } from "@/components/ui/button";
import { COURSE_OUTCOME_STATS } from "@/constants/course-detail";

export function CourseOutcomes({ courseTitle }: { courseTitle: string }) {
  return (
    <section aria-labelledby="outcomes-title" className="bg-secondary/40 py-16">
      <Container>
        <h2 id="outcomes-title" className="sr-only">
          Course outcomes
        </h2>
        <Reveal>
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {COURSE_OUTCOME_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                  <DynamicIcon name={s.icon} className="size-6" />
                </div>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-heading text-2xl font-extrabold text-brand">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="mt-10 text-center">
          <Button asChild variant="accent" size="xl" className="relative overflow-hidden">
            <Link href="#contact">
              <Shimmer />
              Enroll in {courseTitle}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
