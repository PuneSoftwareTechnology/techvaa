import { Container } from "@/components/common/container";
import { LogoMarquee } from "@/components/common/logo-marquee";
import { HIRING_PARTNERS } from "@/constants/site";

/**
 * "Our Alumni Are Placed In" company marquee for the course detail page.
 * Reuses the shared hiring-partner list + LogoMarquee, mirroring the home-page
 * social-proof band but framed around graduates of this course.
 */
export function AlumniPlaced({ courseTitle }: { courseTitle: string }) {
  return (
    <section
      aria-labelledby="alumni-placed-title"
      className="border-y bg-secondary/40 py-12"
    >
      <Container>
        <h2
          id="alumni-placed-title"
          className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Our {courseTitle} Alumni Are Placed In
        </h2>
        <LogoMarquee items={HIRING_PARTNERS} />
      </Container>
    </section>
  );
}
