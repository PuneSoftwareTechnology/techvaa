import {
  TestimonialCard,
  TESTIMONIAL_ACCENTS,
} from "@/modules/reviews/components/testimonial-card";
import { Container } from "@/components/common/container";
import { Carousel } from "@/components/common/carousel";
import type { TestimonialDTO } from "@/types";

/**
 * Shared "What our graduates say" carousel. Reviews stay still so they're
 * easy to read; visitors page through them with the arrows, dots or a swipe.
 * One card per view on mobile, two on tablet, three on desktop. Used on the
 * home page and every course detail page.
 */
export function ReviewsCarousel({
  testimonials,
}: {
  testimonials: TestimonialDTO[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <Container className="mt-10">
      <Carousel
        label="Student reviews"
        itemClassName="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
      >
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={t.id}
            testimonial={t}
            accent={TESTIMONIAL_ACCENTS[i % TESTIMONIAL_ACCENTS.length]}
            className="h-full"
          />
        ))}
      </Carousel>
    </Container>
  );
}
