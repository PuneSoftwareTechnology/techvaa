import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/modules/reviews/components/testimonial-card";
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
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal as="div" index={i} key={t.id}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="ghost" className="text-brand">
            <Link href="/reviews">
              Read all student reviews <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
