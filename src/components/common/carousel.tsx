"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Swipeable, scroll-snap carousel with prev/next arrows and position dots.
 * Each child is one slide; `itemClassName` sets the slide width per breakpoint
 * (e.g. one per view on mobile, three on desktop). The controls only appear
 * when the slides overflow, so a carousel that fits on screen renders as a
 * plain row.
 *
 * `autoPlayMs` advances one slide on an interval (wrapping at the end). It
 * pauses while the visitor hovers, focuses or touches the carousel, and is off
 * under prefers-reduced-motion.
 */
export function Carousel({
  children,
  label,
  itemClassName,
  autoPlayMs,
  className,
}: {
  children: ReactNode;
  /** Accessible name for the carousel region, e.g. "Student reviews". */
  label: string;
  itemClassName?: string;
  autoPlayMs?: number;
  className?: string;
}) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const [positions, setPositions] = useState(1);
  const [active, setActive] = useState(0);

  /** Distance between two adjacent slides (slide width + gap). */
  const stepOf = (track: HTMLUListElement) => {
    const [first, second] = track.children as unknown as HTMLElement[];
    return second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
  };

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepOf(track);
    const max = track.scrollWidth - track.clientWidth;
    const count = max <= 1 ? 1 : Math.round(max / step) + 1;
    setPositions(count);
    // At the far end the last few slides can't snap to the start edge, so
    // treat "scrolled to the end" as the last position.
    setActive(
      track.scrollLeft >= max - 2
        ? count - 1
        : Math.round(track.scrollLeft / step),
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure, slides.length]);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: Math.min(index * stepOf(track), track.scrollWidth - track.clientWidth),
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  const prev = () => goTo(active === 0 ? positions - 1 : active - 1);
  const next = useCallback(
    () => goTo(active >= positions - 1 ? 0 : active + 1),
    [active, positions, goTo],
  );

  useEffect(() => {
    if (!autoPlayMs || positions <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) next();
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, positions, next]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={className}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <ul
        ref={trackRef}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <li
            key={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn("shrink-0 snap-start", itemClassName)}
          >
            {slide}
          </li>
        ))}
      </ul>

      {positions > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="grid size-10 shrink-0 place-items-center rounded-full border bg-card text-foreground shadow-sm transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: positions }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === active
                    ? "w-6 bg-accent-orange"
                    : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="grid size-10 shrink-0 place-items-center rounded-full border bg-card text-foreground shadow-sm transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
