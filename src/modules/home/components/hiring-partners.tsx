import { Container } from "@/components/common/container";
import { LogoMarquee } from "@/components/common/logo-marquee";
import { HIRING_PARTNERS } from "@/constants/site";

export function HiringPartners() {
  return (
    <section aria-labelledby="partners-title" className="border-y bg-secondary/40 py-8 sm:py-12">
      <Container>
        <h2
          id="partners-title"
          className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Our Students Are Placed In
        </h2>
        <LogoMarquee items={HIRING_PARTNERS} />
      </Container>
    </section>
  );
}
