"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";
import { PlacementCard } from "./placement-card";
import type { PlacementDTO } from "@/types";

/** Rows shown up front, and added per "Show More" click. */
const ROWS_PER_STEP = 5;

/**
 * Placement cards in a 2 / 3 / 4-column grid (mobile / tablet / desktop),
 * capped at {@link ROWS_PER_STEP} rows with a "Show More" button.
 *
 * The cap is applied with breakpoint classes rather than JS so the server
 * render already matches the viewport (no layout jump on hydration): every
 * card is in the HTML, the ones past the cap for the current column count are
 * just hidden.
 */
export function PlacementsGrid({ placements }: { placements: PlacementDTO[] }) {
  const [rows, setRows] = useState(ROWS_PER_STEP);
  const limit = { base: 2 * rows, sm: 3 * rows, lg: 4 * rows };

  /** Classes that hide `hidden[bp]` at that breakpoint and show it otherwise. */
  const visibility = (hidden: { base: boolean; sm: boolean; lg: boolean }) =>
    cn(
      hidden.base && "hidden",
      hidden.sm !== hidden.base && (hidden.sm ? "sm:hidden" : "sm:block"),
      hidden.lg !== hidden.sm && (hidden.lg ? "lg:hidden" : "lg:block"),
    );

  const n = placements.length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {placements.map((p, i) => (
          <Reveal
            as="div"
            index={i % 4}
            key={p.id}
            className={visibility({
              base: i >= limit.base,
              sm: i >= limit.sm,
              lg: i >= limit.lg,
            })}
          >
            <PlacementCard placement={p} />
          </Reveal>
        ))}
      </div>

      <div
        className={cn(
          "mt-8 text-center",
          visibility({
            base: n <= limit.base,
            sm: n <= limit.sm,
            lg: n <= limit.lg,
          }),
        )}
      >
        <Button
          type="button"
          variant="brand"
          size="cta"
          onClick={() => setRows((r) => r + ROWS_PER_STEP)}
        >
          Show More <ChevronDown aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
