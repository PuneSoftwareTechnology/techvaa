"use client";

import { useEffect, useRef } from "react";
import {
  TestimonialCard,
  TESTIMONIAL_ACCENTS,
} from "@/modules/reviews/components/testimonial-card";
import { Container } from "@/components/common/container";
import type { TestimonialDTO } from "@/types";

/**
 * Shared "What our graduates say" marquee — an infinite loop of colorful
 * review cards. Used on the home page and every course detail page so the
 * testimonials section looks identical everywhere.
 *
 * The scroll is driven in JS with requestAnimationFrame (not a CSS animation)
 * so pausing is fully under our control: it pauses on hover (desktop) and
 * toggles pause on tap (mobile, where hover never fires). Respects
 * prefers-reduced-motion.
 */
export function ReviewsMarquee({
  testimonials,
  durationSeconds = 12,
}: {
  testimonials: TestimonialDTO[];
  durationSeconds?: number;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  // A ref (not state) so the animation loop reads the latest value without
  // re-running, and toggling pause never triggers a React re-render.
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Honour reduced-motion: leave the track static.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = 0;
    let offset = 0;

    const tick = (now: number) => {
      if (last === 0) last = now;
      const dt = now - last;
      last = now;

      if (!pausedRef.current) {
        // The track is rendered twice, so one full loop is half its width.
        const half = track.scrollWidth / 2;
        if (half > 0) {
          const pxPerMs = half / (durationSeconds * 1000);
          offset = (offset + pxPerMs * dt) % half;
          track.style.transform = `translateX(${-offset}px)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationSeconds, testimonials]);

  if (testimonials.length === 0) return null;

  // Duplicate the source list for a seamless loop. A short list (3–4 reviews)
  // would otherwise leave gaps mid-track, so pad it out to a comfortable run.
  const base =
    testimonials.length < 4 ? [...testimonials, ...testimonials] : testimonials;
  const track = [...base, ...base];

  // Hover pauses on desktop; tap toggles on touch devices. Both just flip the
  // ref the animation loop reads — no CSS, no re-render.
  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };
  const toggle = () => {
    pausedRef.current = !pausedRef.current;
  };

  return (
    <Container className="mt-10">
      <div
        className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={toggle}
      >
        <ul
          ref={trackRef}
          className="flex w-max items-stretch gap-6 will-change-transform"
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
