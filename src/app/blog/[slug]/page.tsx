import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, CalendarDays } from "lucide-react";
import { blogService } from "@/services/blog.service";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { BlogCard } from "@/modules/blog/components/blog-card";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await blogService.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await blogService.getBySlug(slug);
  if (!blog) return buildMetadata({ title: "Article not found", robots: "NOINDEX_FOLLOW" });

  const seo = blog.seo;
  return buildMetadata({
    title: seo?.metaTitle ?? blog.title,
    description: seo?.metaDescription ?? blog.excerpt ?? blog.content.slice(0, 160),
    path: `/blog/${blog.slug}`,
    image: seo?.ogImage ?? blog.featuredImage,
    keywords: seo?.keywords,
    robots: seo?.robots,
    type: "article",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await blogService.getBySlug(slug);
  if (!blog) notFound();

  const related = await blogService.getRelated(blog.slug, blog.category.id);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(blog),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: blog.title, path: `/blog/${blog.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={blog.category.name}
        title={blog.title}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: blog.title, href: `/blog/${blog.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
          <Badge className="bg-white/15 text-white">{blog.category.name}</Badge>
          {blog.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(blog.publishedAt)}
            </span>
          )}
          {blog.readingTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" aria-hidden="true" /> {blog.readingTime} min read
            </span>
          )}
        </div>
      </PageHero>

      <Container className="max-w-3xl py-14">
        <article className="prose prose-neutral max-w-none">
          {blog.excerpt && (
            <p className="text-lg font-medium leading-relaxed text-foreground">
              {blog.excerpt}
            </p>
          )}
          <div className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">
            {blog.content}
          </div>
        </article>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-secondary/40 py-16">
          <Container>
            <SectionHeader align="left" as="h2" title="Related articles" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b, i) => (
                <Reveal as="div" index={i % 3} key={b.id}>
                  <BlogCard blog={b} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
