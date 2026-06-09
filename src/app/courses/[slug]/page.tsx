import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Download, BarChart3 } from "lucide-react";
import { courseService } from "@/services/course.service";
import { faqService } from "@/services/faq.service";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { courseSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/common/container";
import { levelLabel } from "@/lib/format";
import { CurriculumHighlights } from "@/modules/courses/components/curriculum-highlights";
import { CourseOutcomes } from "@/modules/courses/components/course-outcomes";
import { CourseBatch } from "@/modules/courses/components/course-batch";
import { FaqSection } from "@/modules/home/components/faq-section";

export const revalidate = 3600;
export const dynamicParams = true;

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
  if (!course) return buildMetadata({ title: "Course not found", robots: "NOINDEX_FOLLOW" });

  const seo = course.seo;
  return buildMetadata({
    title: seo?.metaTitle ?? course.title,
    description: seo?.metaDescription ?? course.shortDescription ?? course.description.slice(0, 160),
    path: `/courses/${course.slug}`,
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

  const faqs = await faqService.getForCourse(course.id);

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
          <Button asChild variant="accent" size="xl">
            <Link href="#contact">
              Advance My Career <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="xl"
            variant="outline"
            className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
          >
            <Link href="#contact">
              <Download aria-hidden="true" /> Download Syllabus
            </Link>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge className="gap-1 bg-white/15 text-white">
            <Clock className="size-3.5" aria-hidden="true" /> {course.duration ?? "12 weeks"}
          </Badge>
          <Badge className="gap-1 bg-white/15 text-white">
            <BarChart3 className="size-3.5" aria-hidden="true" /> {levelLabel(course.level)}
          </Badge>
        </div>
      </PageHero>

      {course.description && (
        <Container className="max-w-3xl py-12">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            About this course
          </h2>
          <p className="mt-4 whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
            {course.description}
          </p>
        </Container>
      )}

      <CurriculumHighlights />
      <CourseOutcomes courseTitle={course.title} />
      <CourseBatch course={course} />
      <FaqSection faqs={faqs} />
    </>
  );
}
