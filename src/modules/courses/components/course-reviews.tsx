import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { ReviewsCarousel } from "@/modules/reviews/components/reviews-carousel";
import type { TestimonialDTO } from "@/types";

/**
 * "What our graduates say" for a course detail page — wraps the shared
 * {@link ReviewsCarousel} with course-specific copy.
 */
export function CourseReviews({
  courseTitle,
  testimonials,
}: {
  courseTitle: string;
  testimonials: TestimonialDTO[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="course-reviews-title" className="py-10 sm:py-14">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Testimonials"
          title="What our graduates say"
          description={`Real feedback from learners who advanced their careers with the ${courseTitle} program at Techvaa.`}
          gradient
        />
      </Container>

      <ReviewsCarousel testimonials={testimonials} />

      <Container className="mt-8 text-center">
        <Button asChild variant="ghost" className="text-brand">
          <Link href="/reviews">
            Read all student reviews <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}
