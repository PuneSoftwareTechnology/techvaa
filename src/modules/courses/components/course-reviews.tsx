import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import {
  TestimonialCard,
  type TestimonialAccent,
} from "@/modules/reviews/components/testimonial-card";
import type { TestimonialDTO } from "@/types";

/** Rotating color accents so adjacent review cards read as distinct. */
const ACCENTS: TestimonialAccent[] = [
  { bar: "border-t-4 border-t-brand", quote: "text-brand/70", avatar: "bg-brand/10 text-brand" },
  { bar: "border-t-4 border-t-accent-orange", quote: "text-accent-orange/70", avatar: "bg-accent-orange/10 text-accent-orange" },
  { bar: "border-t-4 border-t-emerald-500", quote: "text-emerald-500/70", avatar: "bg-emerald-500/10 text-emerald-600" },
  { bar: "border-t-4 border-t-violet-500", quote: "text-violet-500/70", avatar: "bg-violet-500/10 text-violet-600" },
  { bar: "border-t-4 border-t-sky-500", quote: "text-sky-500/70", avatar: "bg-sky-500/10 text-sky-600" },
];

/**
 * "What our graduates say" — an infinite, CSS-driven marquee of review cards,
 * mirroring the alumni-placed logo marquee. The track is duplicated so the
 * -50% translate loops seamlessly; it pauses on hover and respects
 * prefers-reduced-motion (handled in globals.css alongside `.animate-marquee`).
 */
export function CourseReviews({
  courseTitle,
  testimonials,
}: {
  courseTitle: string;
  testimonials: TestimonialDTO[];
}) {
  if (testimonials.length === 0) return null;

  // Duplicate the source list for a seamless loop. A short list (3–4 reviews)
  // would otherwise leave gaps mid-track, so pad it out to a comfortable run.
  const base =
    testimonials.length < 4
      ? [...testimonials, ...testimonials]
      : testimonials;
  const track = [...base, ...base];

  return (
    <section aria-labelledby="course-reviews-title" className="py-14">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Success Stories"
          title="What our graduates say"
          description={`Real outcomes from learners who advanced their careers with the ${courseTitle} program at Techvaa.`}
          gradient
        />
      </Container>

      <Container className="mt-10">
        <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <ul
            className="flex w-max items-stretch gap-6 animate-marquee group-hover:[animation-play-state:paused]"
            style={{ ["--marquee-duration" as string]: "48s" }}
            aria-hidden="true"
          >
            {track.map((t, i) => (
              <li key={`${t.id}-${i}`} className="w-[300px] shrink-0 sm:w-[360px]">
                <TestimonialCard
                  testimonial={t}
                  accent={ACCENTS[i % ACCENTS.length]}
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

        <div className="mt-8 text-center">
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
