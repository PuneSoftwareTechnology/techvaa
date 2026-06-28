import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import type { BlogContentBlockDTO } from "@/types";
import { blogService } from "@/services/blog.service";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { RichTextContent } from "@/components/common/rich-text-content";
import { htmlToPlainText } from "@/lib/sanitize";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { formatDate } from "@/lib/format";
import { BlogCard } from "@/modules/blog/components/blog-card";

// Render on every request (live DB read) — see the home page for why Amplify's
// multi-instance ISR cache makes a cached page flap stale. `generateStaticParams`
// below is kept only as a build-time warm-up; pages render dynamically.
export const dynamic = "force-dynamic";

/** Renders one templated content block; nothing if the block is empty. */
function ContentBlock({ block }: { block: BlogContentBlockDTO }) {
  const isEmpty =
    !block.title &&
    !block.image &&
    !block.intro &&
    !block.text &&
    block.points.length === 0;
  if (isEmpty) return null;

  return (
    <section className="mt-10">
      {block.title && (
        <h2 className="text-2xl font-semibold text-foreground">{block.title}</h2>
      )}
      {block.image && (
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl border bg-secondary/40">
          <Image
            src={block.image}
            alt={block.title ?? ""}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <RichTextContent
        html={block.intro}
        bare
        className="mt-2 [&_p]:font-medium [&_p]:leading-relaxed [&_p]:text-foreground"
      />
      <RichTextContent html={block.text} bare className="mt-4 text-muted-foreground" />
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
      seo?.metaDescription ??
      blog.metaDescription ??
      htmlToPlainText(blog.introduction).slice(0, 160),
    path: `/blogs/${blog.slug}`,
    canonical: seo?.canonicalUrl,
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

  // Short summary shown under the hero title.
  const excerpt =
    blog.metaDescription ?? htmlToPlainText(blog.introduction).slice(0, 180);

  // Rough read time from the full article body (~200 words/min).
  const bodyText = [
    blog.introduction,
    blog.primary.intro,
    blog.primary.text,
    ...blog.primary.points,
    blog.secondary.intro,
    blog.secondary.text,
    ...blog.secondary.points,
    blog.tertiary.intro,
    blog.tertiary.text,
    ...blog.tertiary.points,
    blog.conclusion,
  ]
    .filter(Boolean)
    .map((html) => htmlToPlainText(html as string))
    .join(" ");
  const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

  const tags = (blog.seo?.keywords ?? []).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(blog),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
            { name: blog.title, path: `/blogs/${blog.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Blog"
        title={blog.title}
        description={excerpt}
        image={blog.featuredImage}
        imageAlt={blog.title}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blogs" },
          { name: blog.title, href: `/blogs/${blog.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
          {blog.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(blog.publishedAt)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {readMinutes} min read
          </span>
        </div>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </PageHero>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <article className="prose prose-neutral max-w-none">
            <RichTextContent
              html={blog.introduction}
              bare
              className="[&_p]:text-lg [&_p]:font-medium [&_p]:text-foreground"
            />

            <ContentBlock block={blog.primary} />
            <ContentBlock block={blog.secondary} />
            <ContentBlock block={blog.tertiary} />

            <RichTextContent
              html={blog.conclusion}
              bare
              className="mt-10 text-muted-foreground"
            />
          </article>

          {blog.relatedCourses.length > 0 && (
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Related course{blog.relatedCourses.length > 1 ? "s" : ""}
              </p>
              <div className="mt-3 grid gap-4">
                {blog.relatedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-4 rounded-xl border bg-secondary/40 p-5 transition-colors hover:bg-secondary/60"
                  >
                    <p className="font-semibold text-foreground">{course.title}</p>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-secondary/40 py-10 sm:py-16">
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
