import Image from "next/image";
import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { PlacementDTO } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Distinct accent palettes, picked deterministically per student.
 *  `band` is the card's header strip; `chip` colours the company pill. */
const PALETTES = [
  { band: "from-sky-500 to-blue-600", chip: "bg-sky-50 text-sky-700 ring-sky-600/20", ring: "hover:ring-sky-500/40" },
  { band: "from-violet-500 to-purple-600", chip: "bg-violet-50 text-violet-700 ring-violet-600/20", ring: "hover:ring-violet-500/40" },
  { band: "from-amber-500 to-orange-600", chip: "bg-amber-50 text-amber-700 ring-amber-600/20", ring: "hover:ring-amber-500/40" },
  { band: "from-emerald-500 to-teal-600", chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", ring: "hover:ring-emerald-500/40" },
  { band: "from-rose-500 to-pink-600", chip: "bg-rose-50 text-rose-700 ring-rose-600/20", ring: "hover:ring-rose-500/40" },
  { band: "from-indigo-500 to-blue-700", chip: "bg-indigo-50 text-indigo-700 ring-indigo-600/20", ring: "hover:ring-indigo-500/40" },
] as const;

function pickPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTES[hash % PALETTES.length];
}

/**
 * Student placement card: coloured header strip, the student's photo (or
 * initials when none is uploaded), name, course and the hiring company.
 * Compact enough to sit two per row on mobile.
 */
export function PlacementCard({ placement }: { placement: PlacementDTO }) {
  const p = pickPalette(placement.studentName + placement.company);

  return (
    <Card
      className={`group relative flex h-full flex-col items-center gap-0 overflow-hidden p-0 text-center ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${p.ring}`}
    >
      <div
        aria-hidden="true"
        className={`h-14 w-full bg-gradient-to-br sm:h-16 ${p.band}`}
      />

      <div className="relative -mt-10 size-20 shrink-0 overflow-hidden rounded-full bg-card ring-4 ring-card shadow-md transition-transform duration-300 group-hover:scale-105 sm:-mt-12 sm:size-24">
        {placement.image ? (
          <Image
            src={placement.image}
            alt={placement.studentName}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`grid size-full place-items-center bg-gradient-to-br text-xl font-bold text-white sm:text-2xl ${p.band}`}
          >
            {initials(placement.studentName)}
          </span>
        )}
      </div>

      <div className="flex w-full flex-1 flex-col items-center px-3 pb-4 pt-3 sm:px-5 sm:pb-5">
        <p className="line-clamp-1 font-heading text-sm font-semibold text-foreground sm:text-base">
          {placement.studentName}
        </p>
        {placement.course && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {placement.course}
          </p>
        )}

        <div className="mt-auto w-full pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Placed at
          </p>
          <p
            className={`mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 sm:text-sm ${p.chip}`}
          >
            <Briefcase className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{placement.company}</span>
          </p>
          {placement.package && (
            <p className="mt-2 text-xs font-semibold text-accent-orange">
              {placement.package}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
