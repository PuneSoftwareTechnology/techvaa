export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * The bare module name from a marketing course title, for headings that add
 * their own wording, e.g. "SAP MM Course in Pune with 100% Practical…" →
 * "SAP MM" and "Advanced SAP FICO S4HANA Course in Pune…" → "SAP FICO S4HANA".
 */
export function courseShortName(title: string): string {
  const name = title
    .split(/\s+(?:course|training)\b|\s+in\s+pune\b/i)[0]
    .replace(/^advanced\s+/i, "")
    .trim();
  return name || title;
}
