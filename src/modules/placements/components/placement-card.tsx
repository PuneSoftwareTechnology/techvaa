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

/** Distinct accent palettes, picked deterministically per student. */
const PALETTES = [
  { avatar: "from-sky-500 to-blue-600", glow: "bg-sky-500/10", ring: "ring-sky-500/20", icon: "text-sky-600" },
  { avatar: "from-violet-500 to-purple-600", glow: "bg-violet-500/10", ring: "ring-violet-500/20", icon: "text-violet-600" },
  { avatar: "from-amber-500 to-orange-600", glow: "bg-amber-500/10", ring: "ring-amber-500/20", icon: "text-amber-600" },
  { avatar: "from-emerald-500 to-teal-600", glow: "bg-emerald-500/10", ring: "ring-emerald-500/20", icon: "text-emerald-600" },
  { avatar: "from-rose-500 to-pink-600", glow: "bg-rose-500/10", ring: "ring-rose-500/20", icon: "text-rose-600" },
  { avatar: "from-indigo-500 to-blue-700", glow: "bg-indigo-500/10", ring: "ring-indigo-500/20", icon: "text-indigo-600" },
] as const;

function pickPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTES[hash % PALETTES.length];
}

export function PlacementCard({ placement }: { placement: PlacementDTO }) {
  const p = pickPalette(placement.studentName + placement.company);

  return (
    <Card
      className={`group relative flex h-full flex-col overflow-hidden p-6 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${p.ring}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-8 size-28 rounded-full blur-2xl ${p.glow}`}
      />

      <div className="relative flex items-center gap-3">
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${p.avatar}`}
        >
          {initials(placement.studentName)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">
            {placement.studentName}
          </p>
          {placement.course && (
            <p className="truncate text-xs text-muted-foreground">{placement.course}</p>
          )}
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2 text-sm text-foreground">
        <Briefcase className={`size-4 ${p.icon}`} aria-hidden="true" />
        Placed at <span className="font-semibold">{placement.company}</span>
      </div>
    </Card>
  );
}
