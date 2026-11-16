/**
 * Short module name for a course ("SAP FICO", "SAP ABAP Cloud", …), used where
 * the full SEO title is too long — e.g. the "Explore SAP FICO Course" link on a
 * course card.
 *
 * Derived from the slug first (curated, short, stable), then the title, so
 * newly added courses pick up a label without a code change. Order matters:
 * more specific modules are tested before the ones they contain (FICO before
 * CO, ABAP Cloud before ABAP).
 */
const RULES: readonly [RegExp, string][] = [
  [/successfactors/, "SAP SuccessFactors"],
  [/\babap\b.*\bcloud\b|\bcloud\b.*\babap\b/, "SAP ABAP Cloud"],
  [/\babap\b/, "SAP ABAP on S4HANA"],
  [/analytics[\s-]cloud|\bsac\b/, "SAP SAC"],
  [/\bbw\b/, "SAP BW S4HANA"],
  [/\bewm\b/, "SAP EWM"],
  [/\bbtp\b/, "SAP BTP"],
  [/\bfico\b/, "SAP FICO"],
  [/\bmm\b/, "SAP MM"],
  [/\bsd\b/, "SAP SD"],
  [/\bpp\b/, "SAP PP"],
  [/\bps\b/, "SAP PS"],
  [/\bco\b|controlling/, "SAP CO"],
];

function match(text: string): string | null {
  const t = text.toLowerCase();
  for (const [re, name] of RULES) if (re.test(t)) return name;
  return null;
}

export function courseShortName(course: {
  slug: string;
  title: string;
}): string | null {
  return match(course.slug) ?? match(course.title);
}
