import { LogoMarquee } from "@/components/common/logo-marquee";
import { HIRING_PARTNERS } from "@/constants/site";

/** Per-row speed so the rows drift past each other instead of moving in lockstep. */
const ROW_DURATIONS = [48, 56, 52, 60];

/**
 * Four rows of hiring-partner tiles scrolling in alternating directions. Each
 * row starts at a different point in the partner list so the same companies
 * never line up vertically.
 */
export function PlacedCompanies() {
  const step = Math.ceil(HIRING_PARTNERS.length / ROW_DURATIONS.length);

  return (
    <div className="space-y-4">
      {ROW_DURATIONS.map((duration, row) => {
        const offset = row * step;
        const items = [
          ...HIRING_PARTNERS.slice(offset),
          ...HIRING_PARTNERS.slice(0, offset),
        ];
        return (
          <LogoMarquee
            key={row}
            items={items}
            variant="tile"
            reverse={row % 2 === 1}
            durationSeconds={duration}
            announce={false}
          />
        );
      })}
      <p className="sr-only">
        Our students are placed in: {HIRING_PARTNERS.map((p) => p.name).join(", ")}
      </p>
    </div>
  );
}
