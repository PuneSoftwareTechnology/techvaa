import {
  TestimonialCard,
  TESTIMONIAL_ACCENTS,
} from "@/modules/reviews/components/testimonial-card";
import { Container } from "@/components/common/container";
import type { TestimonialDTO } from "@/types";

/**
 * Shared "What our graduates say" marquee — an infinite, CSS-driven loop of
 * colorful review cards. Used on the home page and every course detail page so
 * the testimonials section looks identical everywhere.
 *
 * The track is duplicated so the -50% translate loops seamlessly; it pauses on
 * hover and respects prefers-reduced-motion (handled in globals.css alongside
 * `.animate-marquee`).
 */
export function ReviewsMarquee({
  testimonials,
  durationSeconds = 48,
}: {
  testimonials: TestimonialDTO[];
  durationSeconds?: number;
}) {
  if (testimonials.length === 0) return null;

  // Duplicate the source list for a seamless loop. A short list (3–4 reviews)
  // would otherwise leave gaps mid-track, so pad it out to a comfortable run.
  const base =
    testimonials.length < 4 ? [...testimonials, ...testimonials] : testimonials;
  const track = [...base, ...base];

  return (
    <Container className="mt-10">
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <ul
          className="flex w-max items-stretch gap-6 animate-marquee group-hover:[animation-play-state:paused]"
          style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
          aria-hidden="true"
        >
          {track.map((t, i) => (
            <li key={`${t.id}-${i}`} className="w-[300px] shrink-0 sm:w-[360px]">
              <TestimonialCard
                testimonial={t}
                accent={TESTIMONIAL_ACCENTS[i % TESTIMONIAL_ACCENTS.length]}
                className="h-full"
              />
            </li>
          ))}
        </ul>
        {/* Accessible, non-animated copy for screen readers */}
        <ul className="sr-only">
          {testimonials.map((t) => (
            <li key={t.id}>
              {t.name}: {t.message}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
