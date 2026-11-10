import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { PlacementCard } from "@/modules/placements/components/placement-card";
import type { PlacementDTO } from "@/types";

/** Below this many cards the track is repeated so the loop never shows a gap. */
const MIN_TRACK = 8;
/** Fewer placements than this sit still in a centred row — a loop of 1–3
 *  cards would just show the same student over and over. */
const MIN_FOR_MARQUEE = 4;

/**
 * "Recently Placed Students" on a course page — the placements the admin
 * tagged to this course (Placement → Courses + "Show on course page").
 *
 * A continuously scrolling strip of student cards (pauses on hover, static
 * under prefers-reduced-motion). Server-rendered so every name / company is in
 * the HTML for search engines: the first copy of the list is the real,
 * readable one; the repeats that make the loop seamless are aria-hidden.
 */
export function RecentlyPlaced({
  courseName,
  placements,
}: {
  courseName: string;
  placements: PlacementDTO[];
}) {
  if (placements.length === 0) return null;

  // Repeat short lists so one "half" of the track is wider than the viewport,
  // then double it — the -50% marquee translate loops onto an identical copy.
  const copies = Math.max(1, Math.ceil(MIN_TRACK / placements.length));
  const half = Array.from({ length: copies }, () => placements).flat();
  const track = [...half, ...half];
  // Slower for longer tracks so cards always move at roughly the same speed.
  const durationSeconds = Math.max(30, half.length * 5);

  return (
    <section
      aria-labelledby="recently-placed-title"
      className="relative overflow-hidden bg-gradient-to-b from-brand-muted/60 to-background py-10 sm:py-14"
    >
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Recently Placed Students"
          title={`Our ${courseName} learners, now hired`}
          description={`Techvaa ${courseName} students recently placed as SAP consultants at leading companies.`}
        />
      </Container>

      {placements.length < MIN_FOR_MARQUEE ? (
        <Container>
          <ul className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-12 sm:gap-6">
            {placements.map((placement) => (
              <li key={placement.id} className="w-40 sm:w-52">
                <PlacementCard placement={placement} />
              </li>
            ))}
          </ul>
        </Container>
      ) : (
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:mt-12">
          <ul
            className="flex w-max animate-marquee gap-4 px-2 py-2 group-hover:[animation-play-state:paused] sm:gap-6"
            style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
          >
            {track.map((placement, i) => (
              <li
                key={`${placement.id}-${i}`}
                aria-hidden={i >= placements.length || undefined}
                className="w-40 shrink-0 sm:w-52"
              >
                <PlacementCard placement={placement} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
