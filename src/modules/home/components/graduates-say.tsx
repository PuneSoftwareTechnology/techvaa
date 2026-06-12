import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { ReviewsMarquee } from "@/modules/reviews/components/reviews-marquee";
import type { TestimonialDTO } from "@/types";

export function GraduatesSay({ testimonials }: { testimonials: TestimonialDTO[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section aria-labelledby="grads-title" className="py-20">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Success Stories"
          title="What our graduates say"
          description="Real outcomes from learners who switched into high-growth SAP careers with Techvaa."
          gradient
        />
      </Container>

      <ReviewsMarquee testimonials={testimonials} />

      <Container className="mt-10 text-center">
        <Button asChild variant="ghost" className="text-brand">
          <Link href="/reviews">
            Read all student reviews <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}
