import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import type { BlogContentBlockDTO } from "@/types";
import { blogService } from "@/services/blog.service";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { formatDate } from "@/lib/format";
import { BlogCard } from "@/modules/blog/components/blog-card";

export const revalidate = 3600;
export const dynamicParams = true;

/** Renders one templated content block; nothing if the block is empty. */
function ContentBlock({ block }: { block: BlogContentBlockDTO }) {
  const isEmpty =
    !block.title &&
    !block.intro &&
    !block.image &&
    !block.text &&
    block.points.length === 0;
  if (isEmpty) return null;

  return (
    <section className="mt-10">
      {block.title && (
        <h2 className="text-2xl font-semibold text-foreground">{block.title}</h2>
      )}
      {block.intro && (
        <p className="mt-2 font-medium leading-relaxed text-foreground">
          {block.intro}
        </p>
      )}
      {block.image && (
        <Image
          src={block.image}
          alt={block.title ?? ""}
          width={768}
          height={432}
          className="mt-4 w-full rounded-xl object-cover"
        />
      )}
      {block.text && (
        <div className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
          {block.text}
        </div>
      )}
      {block.points.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-6 text-muted-foreground">
          {block.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

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
    description:
      seo?.metaDescription ?? blog.metaDescription ?? blog.introduction.slice(0, 160),
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

  const related = await blogService.getRelated(blog.slug);

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
        eyebrow="Blog"
        title={blog.title}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: blog.title, href: `/blog/${blog.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
          {blog.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(blog.publishedAt)}
            </span>
          )}
        </div>
      </PageHero>

      <Container className="max-w-3xl py-14">
        <article className="prose prose-neutral max-w-none">
          <p className="text-lg font-medium leading-relaxed text-foreground">
            {blog.introduction}
          </p>

          <ContentBlock block={blog.primary} />
          <ContentBlock block={blog.secondary} />
          <ContentBlock block={blog.tertiary} />

          {blog.conclusion && (
            <div className="mt-10 whitespace-pre-line leading-relaxed text-muted-foreground">
              {blog.conclusion}
            </div>
          )}
        </article>

        {blog.relatedCourse && (
          <Link
            href={`/courses/${blog.relatedCourse.slug}`}
            className="mt-12 flex items-center gap-4 rounded-xl border bg-secondary/40 p-5 transition-colors hover:bg-secondary/60"
          >
            {blog.relatedCourse.image && (
              <Image
                src={blog.relatedCourse.image}
                alt={blog.relatedCourse.title}
                width={80}
                height={80}
                className="size-20 shrink-0 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Related course
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {blog.relatedCourse.title}
              </p>
            </div>
          </Link>
        )}
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
