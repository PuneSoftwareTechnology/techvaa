import type { Metadata } from "next";
import { blogService } from "@/services/blog.service";
import { pageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { BlogCard } from "@/modules/blog/components/blog-card";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/blogs", {
    title: "SAP Insights Hub — Blog",
    description:
      "Expert articles, tutorials and career guidance across SAP S/4HANA, FICO, MM, ABAP, BTP and SuccessFactors from the Techvaa team.",
    keywords: ["SAP blog", "SAP tutorials", "SAP career", "SAP FICO articles"],
  });
}

export default async function BlogPage() {
  const [blogs, featured] = await Promise.all([
    blogService.getAll(),
    blogService.getFeatured(3),
  ]);

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
        <section aria-labelledby="featured-title" className="py-16">
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
      <section aria-labelledby="all-posts-title" className="bg-secondary/40 py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 id="all-posts-title" className="font-heading text-2xl font-bold text-foreground">
              Explore all modules
            </h2>
          </div>

          {blogs.length === 0 ? (
            <p className="mt-10 rounded-xl border bg-card p-10 text-center text-muted-foreground">
              No articles published yet. Check back soon.
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
        </Container>
      </section>
    </>
  );
}
