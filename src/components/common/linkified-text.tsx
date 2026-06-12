import { autolinkRichText } from "@/lib/sanitize";

interface LinkifiedTextProps {
  /**
   * Plain text (not rich HTML). Bare URLs, emails, phone and WhatsApp numbers
   * in it are made clickable. Use this for short plain-text fields — hero
   * subtitles, captions, excerpts — where authors may paste a link or number.
   * For full rich-text from the editor use `RichTextContent` instead.
   */
  text: string | null | undefined;
  /** Wrapper element. Defaults to a paragraph. */
  as?: "p" | "span" | "div";
  className?: string;
}

/**
 * Renders plain text with any links/phones/emails turned into anchors. The text
 * is HTML-escaped first (via the sanitizer), so it is safe to inject. Returns
 * nothing when empty. Server component — runs at render time.
 */
export function LinkifiedText({ text, as: Tag = "p", className }: LinkifiedTextProps) {
  const html = autolinkRichText(text);
  if (!html) return null;

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
