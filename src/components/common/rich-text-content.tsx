import { cn } from "@/lib/utils";
import { autolinkRichText } from "@/lib/sanitize";

interface RichTextContentProps {
  /** HTML authored in the admin rich text editor. */
  html: string | null | undefined;
  className?: string;
  /**
   * Skip the built-in `prose` wrapper — use when the content is already inside
   * a parent `prose` container (avoids nested-prose spacing quirks).
   */
  bare?: boolean;
}

/**
 * Renders sanitised rich-text HTML from the admin editor inside a Tailwind
 * `prose` container so it matches the site's typography. Returns nothing when
 * the content is empty. Bare URLs, emails, phone and WhatsApp numbers in the
 * text are made clickable. Server component — runs at render time.
 */
export function RichTextContent({ html, className, bare }: RichTextContentProps) {
  const clean = autolinkRichText(html);
  if (!clean) return null;

  return (
    <div
      className={cn(
        !bare &&
          "prose prose-neutral max-w-none prose-headings:font-heading prose-a:text-accent-orange prose-img:rounded-xl",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
