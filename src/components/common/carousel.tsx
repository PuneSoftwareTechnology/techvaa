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

const MAX_DOTS = 5;

const ARROW_CLASS =
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border bg-card text-foreground shadow-md transition-colors hover:border-brand hover:text-brand sm:grid";

/**
 * Swipeable, scroll-snap carousel: prev/next arrows on the edges from `sm`
 * up, and a short row of position dots on mobile.
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

  // Mobile shows a short window of dots that slides with the active slide,
  // so a long list reads as "there's more" instead of a wall of dots.
  const dotStart = Math.min(
    Math.max(active - Math.floor(MAX_DOTS / 2), 0),
    Math.max(positions - MAX_DOTS, 0),
  );
  const dotEnd = Math.min(dotStart + MAX_DOTS, positions);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("relative", className)}
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
        <>
          {/* Desktop: arrows sit on the left/right edges of the track. */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className={cn(ARROW_CLASS, "left-0 -translate-x-1/3")}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className={cn(ARROW_CLASS, "right-0 translate-x-1/3")}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>

          {/* Mobile: swipe, with position dots below. */}
          <div className="mt-5 flex items-center justify-center gap-2 sm:hidden">
            {Array.from({ length: dotEnd - dotStart }, (_, k) => {
              const i = dotStart + k;
              // Shrink the outer dots when more slides exist beyond them.
              const edge =
                (k === 0 && dotStart > 0) ||
                (i === dotEnd - 1 && dotEnd < positions);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    "rounded-full transition-all",
                    i === active
                      ? "h-2.5 w-6 bg-accent-orange"
                      : edge
                        ? "size-1.5 bg-muted-foreground/30"
                        : "size-2.5 bg-muted-foreground/30",
                  )}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
