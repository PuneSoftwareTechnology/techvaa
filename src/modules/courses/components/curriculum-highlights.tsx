import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Card } from "@/components/ui/card";
import { CURRICULUM_HIGHLIGHTS } from "@/constants/course-detail";
import type { CurriculumItemDTO } from "@/types";

export function CurriculumHighlights({ items }: { items?: CurriculumItemDTO[] }) {
  // Prefer the course's own Key Curriculum; fall back to editorial defaults so
  // the section never renders empty for a course that has none authored yet.
  const highlights =
    items && items.length > 0
      ? items.map((i) => ({ key: i.id, title: i.heading, description: i.description }))
      : CURRICULUM_HIGHLIGHTS.map((h) => ({
          key: h.title,
          title: h.title,
          description: h.description,
        }));

  return (
    <section aria-labelledby="curriculum-title" className="py-16">
      <Container>
        <SectionHeader as="h2" eyebrow="What you'll learn" title="Key curriculum highlights" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <Reveal as="div" index={i % 3} key={item.key}>
              <Card className="h-full p-6">
                <div className="mb-3 grid size-10 place-items-center rounded-lg bg-accent-orange/10 font-bold text-accent-orange">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
