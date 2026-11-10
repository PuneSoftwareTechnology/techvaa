import { LogoMarquee } from "@/components/common/logo-marquee";
import { HIRING_PARTNERS, PLACED_COMPANY_ROWS } from "@/constants/site";

/** Per-row speed so the rows drift past each other instead of moving in lockstep. */
const ROW_DURATIONS = [48, 56, 52];

/**
 * Three rows of company tiles scrolling in alternating directions. Each row
 * shows its own set of companies (see PLACED_COMPANY_ROWS), so no company
 * repeats across rows.
 */
export function PlacedCompanies() {
  return (
    <div className="space-y-4">
      {PLACED_COMPANY_ROWS.map((items, row) => (
        <LogoMarquee
          key={row}
          items={items}
          variant="tile"
          reverse={row % 2 === 1}
          durationSeconds={ROW_DURATIONS[row % ROW_DURATIONS.length]}
          announce={false}
        />
      ))}
      <p className="sr-only">
        Our students are successfully placed in: {HIRING_PARTNERS.map((p) => p.name).join(", ")}
      </p>
    </div>
  );
}
