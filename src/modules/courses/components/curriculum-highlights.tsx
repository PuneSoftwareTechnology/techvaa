import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CURRICULUM_HIGHLIGHTS } from "@/constants/course-detail";
import type { CurriculumItemDTO } from "@/types";

/** Rotating accents so each curriculum card reads as its own colored module. */
const CARD_ACCENTS = [
  { badge: "bg-brand/10 text-brand", bar: "before:bg-brand" },
  {
    badge: "bg-accent-orange/10 text-accent-orange",
    bar: "before:bg-accent-orange",
  },
  { badge: "bg-emerald-500/10 text-emerald-600", bar: "before:bg-emerald-500" },
  { badge: "bg-violet-500/10 text-violet-600", bar: "before:bg-violet-500" },
  { badge: "bg-sky-500/10 text-sky-600", bar: "before:bg-sky-500" },
  { badge: "bg-rose-500/10 text-rose-600", bar: "before:bg-rose-500" },
];

export function CurriculumHighlights({
  items,
}: {
  items?: CurriculumItemDTO[];
}) {
  // Prefer the course's own Key Curriculum; fall back to editorial defaults so
  // the section never renders empty for a course that has none authored yet.
  const highlights =
    items && items.length > 0
      ? items.map((i) => ({
          key: i.id,
          title: i.heading,
          description: i.description,
        }))
      : CURRICULUM_HIGHLIGHTS.map((h) => ({
          key: h.title,
          title: h.title,
          description: h.description,
        }));

  return (
    <section
      aria-labelledby="curriculum-title"
      className="relative overflow-hidden bg-gradient-to-b from-secondary/40 to-background py-10 sm:py-14"
    >
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="What you'll learn"
          title="Key curriculum highlights"
          gradient
        />
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {highlights.map((item, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <Reveal as="div" index={i % 3} key={item.key}>
                <Card
                  className={cn(
                    "relative flex h-full gap-3 p-4 pl-5 transition-all duration-200 hover:-translate-y-1 hover:ring-foreground/20 sm:block sm:gap-0 sm:p-6 sm:pl-7",
                    "before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-full sm:before:inset-y-4",
                    accent.bar,
                  )}
                >
                  <div
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold sm:mb-3 sm:size-10 sm:text-base",
                      accent.badge,
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground sm:mt-2">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
