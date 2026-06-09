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

export function PlacementCard({ placement }: { placement: PlacementDTO }) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
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

      <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
        <Briefcase className="size-4 text-accent-orange" aria-hidden="true" />
        Placed at <span className="font-semibold">{placement.company}</span>
      </div>
    </Card>
  );
}
