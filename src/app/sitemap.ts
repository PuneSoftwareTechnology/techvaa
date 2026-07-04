import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Match every content route (see the force-dynamic switch in commit 83d19c8):
// the sitemap is DB-driven, so ISR left it serving stale slugs after admin
// edits while the pages themselves updated. Rendering it dynamically keeps it
// in sync at both the origin and the Amplify/CloudFront edge.
export const dynamic = "force-dynamic";

// Fetch the dynamic slugs without ever letting a DB problem crash the route.
// The services import prisma.ts, which throws at *module load* if the DATABASE
// env var is missing (e.g. a runtime that doesn't expose build-time env vars) —
// a throw that a try/catch around the call can't catch, because it fires during
// import. Importing lazily inside the try makes it catchable, so a missing or
// unreachable DB degrades the sitemap to its static routes instead of a 500.
async function getDynamicSlugs(): Promise<{
  courseSlugs: string[];
  blogSlugs: string[];
}> {
  try {
    const [{ courseService }, { blogService }] = await Promise.all([
      import("@/services/course.service"),
      import("@/services/blog.service"),
    ]);
    const [courseSlugs, blogSlugs] = await Promise.all([
      courseService.getAllSlugs().catch(() => [] as string[]),
      blogService.getAllSlugs().catch(() => [] as string[]),
    ]);
    return { courseSlugs, blogSlugs };
  } catch {
    return { courseSlugs: [], blogSlugs: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { courseSlugs, blogSlugs } = await getDynamicSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/courses"), changeFrequency: "weekly", priority: 0.9 },
    {
      url: absoluteUrl("/placements"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: absoluteUrl("/blogs"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/reviews"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = courseSlugs.map((slug) => ({
    url: absoluteUrl(`/courses/${slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: absoluteUrl(`/blogs/${slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
