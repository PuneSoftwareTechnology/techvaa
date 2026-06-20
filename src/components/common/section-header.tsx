import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** Heading level for correct document outline; defaults to h2. */
  as?: "h1" | "h2" | "h3";
  /**
   * Render the title as the vibrant brand→violet→orange gradient. On by
   * default so every section heading across the site reads consistently; pass
   * `gradient={false}` for headings on dark/colored backgrounds.
   */
  gradient?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  gradient = true,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 inline-flex items-center gap-3 text-2xl sm:text-3xl font-extrabold tracking-wider text-accent-orange uppercase",
            align === "center" &&
              "before:h-px before:w-12 before:bg-accent-orange/50 after:h-px after:w-12 after:bg-accent-orange/50",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          "text-balance font-heading text-xl font-bold tracking-tight sm:text-3xl",
          gradient
            ? "bg-gradient-to-l from-brand  to-accent-orange bg-clip-text text-transparent"
            : "text-foreground",
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
