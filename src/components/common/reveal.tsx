import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper — pure CSS, no JavaScript (see `.reveal` in
 * globals.css). Uses a scroll-driven animation (`animation-timeline: view()`):
 *
 * - Content is rendered fully visible in the server HTML. Anything already on
 *   screen at load is past its "entry" range, so it is never hidden — no
 *   first-paint / LCP delay waiting for a JS animation library.
 * - Browsers without scroll-driven animations (or with reduced motion) simply
 *   show the content with no animation.
 *
 * `index` used to stagger items via JS; scroll position now provides a natural
 * stagger, so it is accepted for API compatibility and ignored.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}
