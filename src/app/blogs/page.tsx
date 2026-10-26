import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BLOGS_PER_PAGE, blogService } from "@/services/blog.service";
import { pageMetadata } from "@/lib/page-seo";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Pagination } from "@/components/common/pagination";
import { BlogCard } from "@/modules/blog/components/blog-card";
import { BlogSearch } from "@/modules/blog/components/blog-search";

// Render on every request (live DB read) — see the home page for why Amplify's
// multi-instance ISR cache makes a cached page flap stale.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** `?q=` (search text) and `?page=` (1-based), normalised. */
async function readParams(searchParams: SearchParams) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const q = first(sp.q)?.trim().slice(0, 100) || undefined;
  const page = Number.parseInt(first(sp.page) ?? "", 10);
  return { q, page: Number.isFinite(page) && page > 1 ? page : 1 };
}

function blogsHref(page: number, q?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/blogs${qs ? `?${qs}` : ""}#all-posts`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q, page } = await readParams(searchParams);
  const meta = await pageMetadata("/blogs", {
    title: "SAP Insights Hub — Blog",
    description:
      "Expert articles, tutorials and career guidance across SAP S/4HANA, FICO, MM, ABAP, BTP and SuccessFactors from the Techvaa team.",
    keywords: ["SAP blog", "SAP tutorials", "SAP career", "SAP FICO articles"],
  });

  // Search results are thin, query-specific pages — keep them out of the
  // index. Later listing pages are canonical to themselves so their posts
  // stay discoverable.
  if (q) return { ...meta, robots: { index: false, follow: true } };
  if (page > 1) {
    return {
      ...meta,
      alternates: { canonical: absoluteUrl(`/blogs?page=${page}`) },
    };
  }
  return meta;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, page: requestedPage } = await readParams(searchParams);
  // Featured posts only lead the unfiltered first page.
  const showFeatured = !q && requestedPage === 1;
  const [{ items: blogs, total, page, pageCount }, featured] = await Promise.all([
    blogService.getPage(requestedPage, q),
    showFeatured ? blogService.getFeatured(3) : Promise.resolve([]),
  ]);
  // Past the last page (e.g. a stale link after posts were removed) — send the
  // visitor to the real last page rather than serving it under a wrong URL.
  if (page !== requestedPage) redirect(blogsHref(page, q));
  const firstShown = (page - 1) * BLOGS_PER_PAGE + 1;
  const lastShown = firstShown + blogs.length - 1;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blogs" },
        ])}
      />

      <PageHero
        eyebrow="Blogs"
        title="SAP Insights Hub — knowledge that builds expertise"
        description="Comprehensive articles, expert analysis and the latest trends across all SAP modules."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blogs" },
        ]}
      />

      {/* Featured posts */}
      {featured.length > 0 && (
        <section aria-labelledby="featured-title" className="py-10 sm:py-16">
          <Container>
            <SectionHeader align="left" as="h2" title="Featured posts" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {featured.map((b, i) => (
                <Reveal as="div" index={i} key={b.id}>
                  <BlogCard blog={b} featured />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* All posts */}
      <section
        id="all-posts"
        aria-labelledby="all-posts-title"
        className="scroll-mt-20 bg-secondary/40 py-4 lg:py-16"
      >
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2
                id="all-posts-title"
                className="font-heading text-2xl font-bold text-foreground"
              >
                {q ? <>Results for &ldquo;{q}&rdquo;</> : "Explore all modules"}
              </h2>
              {total > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Showing {firstShown}–{lastShown} of {total}{" "}
                  {total === 1 ? "article" : "articles"}
                </p>
              )}
            </div>
            <BlogSearch query={q} />
          </div>

          {blogs.length === 0 ? (
            <p className="mt-10 rounded-xl border bg-card p-10 text-center text-muted-foreground">
              {q
                ? "No articles match your search. Try a different keyword."
                : "No articles published yet. Check back soon."}
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b, i) => (
                <Reveal as="div" index={i % 3} key={b.id}>
                  <BlogCard blog={b} />
                </Reveal>
              ))}
            </div>
          )}

          <Pagination
            className="mt-10"
            page={page}
            pageCount={pageCount}
            hrefFor={(p) => blogsHref(p, q)}
          />
        </Container>
      </section>
    </>
  );
}
