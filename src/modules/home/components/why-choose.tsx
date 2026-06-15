import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { DynamicIcon } from "@/components/common/dynamic-icon";
import { Card } from "@/components/ui/card";
import { WHY_CHOOSE } from "@/constants/home";

export function WhyChoose() {
  return (
    <section aria-labelledby="why-title" className="py-12 sm:py-20">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Why Techvaa"
          title="Why choose us for your training?"
          description="Everything you need to go from beginner to job-ready SAP consultant — mentorship, hands-on projects, and a placement engine that works."
        />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-4">
          {WHY_CHOOSE.map((f, i) => (
            <Reveal as="div" index={i} key={f.title}>
              <Card className="h-full p-4 text-center transition-shadow hover:shadow-md sm:p-6">
                <div className={`mx-auto mb-3 grid size-12 place-items-center rounded-2xl sm:mb-4 sm:size-16 ${f.iconClass}`}>
                  <DynamicIcon name={f.icon} className="size-6 sm:size-9" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
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
