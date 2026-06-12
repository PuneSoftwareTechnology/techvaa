import sanitizeHtml from "sanitize-html";

/**
 * Sanitises HTML produced by the admin rich text editor (TipTap) before it is
 * rendered with `dangerouslySetInnerHTML`. The allow-list mirrors the editor's
 * toolbar: headings, marks, links, lists, quotes, code, tables, images and the
 * inline styles it emits (text colour, highlight, font size, alignment).
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "strike", "mark", "sub", "sup",
    "a", "span",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "img",
    "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["style"],
    mark: ["style"],
    p: ["style"],
    h1: ["style"], h2: ["style"], h3: ["style"],
    h4: ["style"], h5: ["style"], h6: ["style"],
    td: ["colspan", "rowspan", "style"],
    th: ["colspan", "rowspan", "style"],
    col: ["style", "span"],
  },
  allowedStyles: {
    "*": {
      color: [/^#(?:[0-9a-fA-F]{3,8})$/, /^rgb\(/, /^rgba\(/, /^[a-z]+$/],
      "background-color": [/^#(?:[0-9a-fA-F]{3,8})$/, /^rgb\(/, /^rgba\(/, /^[a-z]+$/],
      "font-size": [/^\d+(?:\.\d+)?(?:px|rem|em|%)$/],
      "text-align": [/^(?:left|right|center|justify)$/],
      width: [/^\d+(?:\.\d+)?(?:px|%)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Force safe link behaviour regardless of what was stored.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer nofollow",
    }),
  },
};

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, OPTIONS);
}

/* ----------------------------------------------------------- auto-linking */

/**
 * Sanitises rich-text HTML and then makes bare URLs, emails, phone numbers and
 * WhatsApp numbers clickable. The editor already links URLs the author types,
 * so this catches anything pasted/typed as plain text. Run on already-sanitised
 * HTML — the anchors it injects use only `https:`/`mailto:`/`tel:` schemes.
 *
 * Use this (not `sanitizeRichText`) wherever rich text is rendered for readers.
 */
export function autolinkRichText(html: string | null | undefined): string {
  const clean = sanitizeRichText(html);
  if (!clean) return "";
  return linkifyOutsideTags(clean);
}

// Text inside these tags is never auto-linked (already a link, or code).
const SKIP_AUTOLINK_TAGS = new Set(["a", "code", "pre"]);

// Common TLDs we accept for *bare* domains (no scheme). Keeps "Node.js",
// "schema.prisma", "e.g." etc. from being mistaken for links.
const BARE_TLD =
  "com|org|net|io|co|in|dev|app|ai|me|info|biz|edu|gov|uk|us|ca|au|eu|tech|online|store|xyz";

// One left-to-right pass; the first alternative to match at a position wins, so
// an email is never re-scanned as a phone number, a URL host never as a domain.
const AUTOLINK_RE = new RegExp(
  [
    // 1. "WhatsApp[: -] <number>" → wa.me chat link
    String.raw`(?<wa>whats\s?app)\s*(?:number|no\.?|chat|:|-|–)?\s*(?<wanum>\+?\d[\d\s().-]{6,}\d)`,
    // 2. email → mailto:
    String.raw`(?<email>[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)`,
    // 3. URL with explicit scheme
    String.raw`(?<url>https?:\/\/[^\s<]+)`,
    // 4. www. or bare domain ending in a known TLD, with optional path
    String.raw`(?<domain>(?:www\.)?[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.(?:${BARE_TLD})\b(?:\/[^\s<]*)?)`,
    // 5. phone → tel:
    String.raw`(?<phone>\+?\d[\d\s().-]{6,}\d)`,
  ].join("|"),
  "gi",
);

const ENTITY_DECODE: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'",
};
function decodeEntities(value: string): string {
  return value.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (m) => ENTITY_DECODE[m] ?? m);
}
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function anchor(href: string, text: string, external: boolean): string {
  const attrs = external ? ' target="_blank" rel="noopener noreferrer nofollow"' : "";
  return `<a href="${escapeAttr(href)}"${attrs}>${text}</a>`;
}

// Trailing sentence punctuation shouldn't be part of a URL/domain.
function splitTrailing(value: string): [core: string, trail: string] {
  const m = value.match(/[)\].,;:!?'"]+$/);
  return m ? [value.slice(0, -m[0].length), m[0]] : [value, ""];
}

// 8–15 digits, and either an international "+", visible grouping, or a plain
// 10-digit number — so years/prices like "10000000" aren't dialled.
function phoneDigits(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  const looksPhone = raw.trim().startsWith("+") || /[\s().-]/.test(raw.trim()) || digits.length === 10;
  return looksPhone ? digits : null;
}

function linkifyText(text: string): string {
  return text.replace(AUTOLINK_RE, (match, ...args) => {
    const g = args[args.length - 1] as Record<string, string | undefined>;

    if (g.wa !== undefined && g.wanum) {
      const digits = g.wanum.replace(/\D/g, "").replace(/^0+/, "");
      if (digits.length < 8 || digits.length > 15) return match;
      return anchor(`https://wa.me/${digits}`, match, true);
    }
    if (g.email) {
      return anchor(`mailto:${decodeEntities(g.email)}`, match, false);
    }
    if (g.url) {
      const [core, trail] = splitTrailing(match);
      return anchor(decodeEntities(core), core, true) + trail;
    }
    if (g.domain) {
      const [core, trail] = splitTrailing(match);
      const href = /^https?:\/\//i.test(core) ? decodeEntities(core) : `https://${decodeEntities(core)}`;
      return anchor(href, core, true) + trail;
    }
    if (g.phone) {
      // Skip date-like runs ("12-31-2024", "31/12/2024").
      if (/^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/.test(match.trim())) return match;
      const digits = phoneDigits(match);
      if (!digits) return match;
      return anchor(`tel:${match.trim().startsWith("+") ? "+" : ""}${digits}`, match, false);
    }
    return match;
  });
}

// Walk the HTML token by token, linkifying only text that sits outside the
// skip tags above. Self-closing tags don't change depth.
function linkifyOutsideTags(html: string): string {
  let skipDepth = 0;
  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (!part) return part;
      if (part[0] === "<") {
        const tag = part.match(/^<\s*(\/?)\s*([a-zA-Z0-9]+)/);
        if (tag && SKIP_AUTOLINK_TAGS.has(tag[2].toLowerCase())) {
          if (tag[1] === "/") skipDepth = Math.max(0, skipDepth - 1);
          else if (!part.endsWith("/>")) skipDepth += 1;
        }
        return part;
      }
      return skipDepth > 0 ? part : linkifyText(part);
    })
    .join("");
}

/**
 * Strips all markup to plain text — for meta descriptions, JSON-LD and card
 * excerpts where rich-text fields must not leak HTML tags.
 */
export function htmlToPlainText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
