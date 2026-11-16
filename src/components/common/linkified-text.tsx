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
/** Block-level tags that may not sit inside a <p> (or a <span>). */
const BLOCK_TAG = /<(p|div|ul|ol|li|h[1-6]|blockquote|pre|table)\b/i;

export function LinkifiedText({ text, as = "p", className }: LinkifiedTextProps) {
  const html = autolinkRichText(text);
  if (!html) return null;

  // Fields like a course's shortDescription come from the rich-text editor
  // already wrapped in <p>. Nesting that in a <p> is invalid HTML: the browser
  // closes the outer <p> early, the DOM no longer matches the server render,
  // and React throws hydration error #418. Fall back to a <div> wrapper then.
  const Tag = as !== "div" && BLOCK_TAG.test(html) ? "div" : as;

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
