import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** Heading level for correct document outline; defaults to h2. */
  as?: "h1" | "h2" | "h3";
  /** Render the title as a brand→orange gradient for extra emphasis. */
  gradient?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  gradient = false,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-accent-orange uppercase",
            align === "center" &&
              "before:h-px before:w-6 before:bg-accent-orange/50 after:h-px after:w-6 after:bg-accent-orange/50"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl",
          gradient
            ? "bg-gradient-to-r from-brand via-brand to-accent-orange bg-clip-text text-transparent"
            : "text-foreground"
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
