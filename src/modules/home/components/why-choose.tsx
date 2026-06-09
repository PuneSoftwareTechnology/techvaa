import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { DynamicIcon } from "@/components/common/dynamic-icon";
import { Card } from "@/components/ui/card";
import { WHY_CHOOSE } from "@/constants/home";

export function WhyChoose() {
  return (
    <section aria-labelledby="why-title" className="py-20">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Why Techvaa"
          title="Why choose us for your training?"
          description="Everything you need to go from beginner to job-ready SAP consultant — mentorship, hands-on projects, and a placement engine that works."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE.map((f, i) => (
            <Reveal as="div" index={i} key={f.title}>
              <Card className="h-full p-6 text-center transition-shadow hover:shadow-md">
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <DynamicIcon name={f.icon} className="size-9" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
