import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TestimonialDTO } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Optional per-card color accent, cycled by callers to differentiate cards. */
export type TestimonialAccent = {
  /** Top accent bar, e.g. "border-t-4 border-t-brand". */
  bar: string;
  /** Quote glyph color, e.g. "text-brand/70". */
  quote: string;
  /** Avatar circle bg + text, e.g. "bg-brand/10 text-brand". */
  avatar: string;
};

/** Rotating color accents so adjacent review cards read as distinct. */
export const TESTIMONIAL_ACCENTS: TestimonialAccent[] = [
  { bar: "border-t-4 border-t-brand", quote: "text-brand/70", avatar: "bg-brand/10 text-brand" },
  { bar: "border-t-4 border-t-accent-orange", quote: "text-accent-orange/70", avatar: "bg-accent-orange/10 text-accent-orange" },
  { bar: "border-t-4 border-t-emerald-500", quote: "text-emerald-500/70", avatar: "bg-emerald-500/10 text-emerald-600" },
  { bar: "border-t-4 border-t-violet-500", quote: "text-violet-500/70", avatar: "bg-violet-500/10 text-violet-600" },
  { bar: "border-t-4 border-t-sky-500", quote: "text-sky-500/70", avatar: "bg-sky-500/10 text-sky-600" },
];

export function TestimonialCard({
  testimonial,
  className,
  accent,
}: {
  testimonial: TestimonialDTO;
  className?: string;
  accent?: TestimonialAccent;
}) {
  const meta = [testimonial.role, testimonial.company].filter(Boolean).join(" · ");
  return (
    <Card className={cn("flex h-full flex-col p-6", accent?.bar, className)}>
      <Quote
        className={cn("size-7", accent?.quote ?? "text-accent-orange/70")}
        aria-hidden="true"
      />
      <blockquote className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
        “{testimonial.message}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold",
            accent?.avatar ?? "bg-brand/10 text-brand",
          )}
        >
          {initials(testimonial.name)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-foreground">
            {testimonial.name}
          </span>
          {meta && (
            <span className="block text-xs text-muted-foreground">{meta}</span>
          )}
        </span>
      </figcaption>
    </Card>
  );
}
