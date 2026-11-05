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

/**
 * Heading for a course's syllabus section, e.g. "SAP FICO S4HANA Course
 * Syllabus". S4HANA courses (by slug) get "S4HANA" added when the short name
 * leaves it out ("SAP MM" → "SAP MM S4HANA"); other courses keep their name.
 */
export function courseSyllabusTitle(title: string, slug: string): string {
  let name = courseShortName(title);
  if (/s4hana/i.test(slug) && !/s\/?4\s*hana/i.test(name)) name += " S4HANA";
  return `${name} Course Syllabus`;
}
