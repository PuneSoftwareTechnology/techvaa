/**
 * Read-only SEO coverage audit. Reports courses & blogs whose per-entity SEO
 * fields (metaTitle / metaDescription / keywords) are empty so they can be
 * filled in the admin. Talks to the DB directly (no `server-only` services).
 * Run: npx tsx --env-file=.env scripts/seo-audit.mts
 */
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client.ts";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE! });
const prisma = new PrismaClient({ adapter });

const mark = (ok: boolean) => (ok ? "ok " : "MISSING");
const PUBLISHED = { isPublished: true, deletedAt: null } as const;

const [courses, blogs] = await Promise.all([
  prisma.course.findMany({ where: PUBLISHED, include: { seo: true } }),
  prisma.blog.findMany({ where: PUBLISHED, include: { seo: true } }),
]);

console.log(`\n=== COURSES (${courses.length}) ===`);
for (const c of courses) {
  const t = mark(!!c.seo?.metaTitle);
  const d = mark(!!(c.seo?.metaDescription ?? c.shortDescription));
  const k = mark(!!c.seo?.keywords?.length);
  if (t + d + k !== "ok ok ok ")
    console.log(`  ${c.slug}\n    metaTitle=${t}  desc=${d}  keywords=${k}`);
}

console.log(`\n=== BLOGS (${blogs.length}) ===`);
for (const b of blogs) {
  const t = mark(!!b.seo?.metaTitle);
  const d = mark(!!(b.seo?.metaDescription ?? b.metaDescription));
  const k = mark(!!b.seo?.keywords?.length);
  if (t + d + k !== "ok ok ok ")
    console.log(`  ${b.slug}\n    metaTitle=${t}  desc=${d}  keywords=${k}`);
}

console.log("\n(Only rows with at least one gap are listed.)");
await prisma.$disconnect();
process.exit(0);
