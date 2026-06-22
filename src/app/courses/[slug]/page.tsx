import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { courseService } from "@/services/course.service";
import { faqService } from "@/services/faq.service";
import { blogService } from "@/services/blog.service";
import { testimonialService } from "@/services/social-proof.service";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { courseSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { RichTextContent } from "@/components/common/rich-text-content";
import { CollapsibleContent } from "@/components/common/collapsible-content";
import { EnrollDialog } from "@/components/forms/enroll-dialog";
import { htmlToPlainText } from "@/lib/sanitize";
import { CourseCard } from "@/modules/courses/components/course-card";
import { BlogCard } from "@/modules/blog/components/blog-card";
import { CurriculumHighlights } from "@/modules/courses/components/curriculum-highlights";
import { AboutTrainer } from "@/modules/courses/components/about-trainer";
import { CourseOutcomes } from "@/modules/courses/components/course-outcomes";
import { BatchSchedule } from "@/modules/courses/components/batch-schedule";
import { AlumniPlaced } from "@/modules/courses/components/alumni-placed";
import { CourseReviews } from "@/modules/courses/components/course-reviews";
import { FaqSection } from "@/modules/home/components/faq-section";

// Render on every request (live DB read) — see the home page for why Amplify's
// multi-instance ISR cache makes a cached page flap stale. `generateStaticParams`
// below is kept only as a build-time warm-up; pages render dynamically.
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await courseService.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseService.getBySlug(slug);
  if (!course)
    return buildMetadata({
      title: "Course not found",
      robots: "NOINDEX_FOLLOW",
    });

  const seo = course.seo;
  return buildMetadata({
    title: seo?.metaTitle ?? course.title,
    description:
      seo?.metaDescription ??
      course.shortDescription ??
      htmlToPlainText(course.description).slice(0, 160),
    path: `/courses/${course.slug}`,
    canonical: seo?.canonicalUrl,
    image: seo?.ogImage ?? course.image,
    keywords: seo?.keywords,
    robots: seo?.robots,
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await courseService.getBySlug(slug);

  if (!course) notFound();

  const [faqs, testimonials, relatedArticles] = await Promise.all([
    faqService.getForCourse(course.id),
    testimonialService.getForDisplay(8),
    blogService.getForCourse(course.slug),
  ]);

  // Reuse the shared schedule table with just this course's batches.
  const batchRows = course.batches.map((b) => ({
    id: b.id,
    courseSlug: course.slug,
    courseTitle: course.title,
    startDate: b.startDate,
    mode: b.mode ?? "Instructor Led Training",
    duration: b.duration ?? "",
    status: b.status,
  }));

  return (
    <>
      <JsonLd
        data={[
          courseSchema(course),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
            { name: course.title, path: `/courses/${course.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow="SAP Certification Bootcamp"
        title={course.title}
        description={course.shortDescription ?? undefined}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Courses", href: "/courses" },
          { name: course.title, href: `/courses/${course.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <EnrollDialog
            course={course.title}
            trigger={{
              label: (
                <>
                  Advance My Career <ArrowRight aria-hidden="true" />
                </>
              ),
              className: cn(
                buttonVariants({ variant: "accent", size: "xl" }),
                "relative overflow-hidden",
              ),
              shimmer: true,
            }}
          />
        </div>
      </PageHero>

      {course.description && (
        <Container className="py-8 sm:py-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-orange">
            Overview
          </p>
          <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-foreground">
            <span
              aria-hidden="true"
              className="h-7 w-1.5 rounded-full bg-gradient-to-b from-brand to-accent-orange"
            />
            About this course
          </h2>
          <CollapsibleContent className="mt-4">
            <RichTextContent
              html={course.description}
              className="prose-p:text-muted-foreground prose-li:text-muted-foreground"
            />
          </CollapsibleContent>
        </Container>
      )}

      <CurriculumHighlights items={course.curriculum} />

      <AboutTrainer
        heading={course.trainerHeading}
        description={course.trainerDescription}
      />

      <CourseOutcomes courseTitle={course.title} />
      <BatchSchedule
        rows={batchRows}
        eyebrow="New Batch Schedule"
        title="Upcoming training"
        hideViewDetails
      />

      <AlumniPlaced courseTitle={course.title} />

      <CourseReviews courseTitle={course.title} testimonials={testimonials} />

      <FaqSection faqs={faqs} />

      {course.relatedCourses.length > 0 && (
        <Container className="py-10 sm:py-14">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-orange">
              Keep exploring
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-brand via-brand to-accent-orange bg-clip-text text-transparent">
                Related courses
              </span>
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {course.relatedCourses.map((related, i) => (
              <Reveal as="div" index={i % 3} key={related.id}>
                <CourseCard course={related} />
              </Reveal>
            ))}
          </div>
        </Container>
      )}

      {relatedArticles.length > 0 && (
        <Container className="pb-10 sm:pb-16">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-orange">
              From the blog
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-brand via-brand to-accent-orange bg-clip-text text-transparent">
                Related articles
              </span>
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((article, i) => (
              <Reveal as="div" index={i % 3} key={article.id}>
                <BlogCard blog={article} />
              </Reveal>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
