import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { PlacedCompanies } from "@/components/common/placed-companies";

export function HiringPartners() {
  return (
    <section
      aria-label="Placements"
      className="relative overflow-hidden border-y bg-gradient-to-b from-secondary/60 via-background to-secondary/60 py-10 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-orange/10 blur-3xl"
      />
      <Container className="relative">
        <SectionHeader
          as="h2"
          eyebrow="Placements"
          title="Our Students Are Placed In Companies"
          className="[&_h2]:uppercase"
        />
      </Container>
      <div className="relative mt-8 sm:mt-12">
        <PlacedCompanies />
      </div>
    </section>
  );
}
