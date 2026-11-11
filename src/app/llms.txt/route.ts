import { SITE, LOCATION } from "@/constants/site";
import { absoluteUrl } from "@/lib/seo";
import { htmlToPlainText } from "@/lib/sanitize";
import { courseService } from "@/services/course.service";

// Rendered per request (from the short-lived data cache) rather than baked in
// at build time, so new / renamed courses show up without a redeploy.
export const dynamic = "force-dynamic";

/**
 * /llms.txt — a plain-Markdown summary of the site for AI assistants and LLM
 * crawlers (https://llmstxt.org): who Techvaa is, and a link + one-liner for
 * every published course and key page.
 */
export async function GET() {
  const courses = await courseService.getAll().catch(() => []);

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.name} is an SAP training institute in ${LOCATION.city}, ${LOCATION.region}, India, offering instructor-led SAP S/4HANA courses with live projects and placement support. Phone: ${SITE.phone}.`,
    "",
    "## Courses",
    "",
    ...courses.map((c) => {
      // shortDescription is rich text from the admin editor — strip the HTML.
      const summary = c.shortDescription ? htmlToPlainText(c.shortDescription) : "";
      return `- [${c.title}](${absoluteUrl(`/courses/${c.slug}`)})${summary ? `: ${summary}` : ""}`;
    }),
    "",
    "## Key pages",
    "",
    `- [All SAP courses](${absoluteUrl("/courses")}): every course, with upcoming batch dates`,
    `- [Placements](${absoluteUrl("/placements")}): students placed and the placement process`,
    `- [Student reviews](${absoluteUrl("/reviews")}): ratings and reviews from learners`,
    `- [Blog](${absoluteUrl("/blogs")}): SAP career and module guides`,
    `- [Contact](${absoluteUrl("/contact")}): request a callback or a free demo`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
