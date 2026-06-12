import type { Metadata } from "next";
import { courseService } from "@/services/course.service";
import { pageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { PageHero } from "@/components/common/page-hero";
import { CourseCard } from "@/modules/courses/components/course-card";
import { HiringPartners } from "@/modules/home/components/hiring-partners";
import { UpcomingBatches } from "@/modules/home/components/upcoming-batches";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/courses", {
    title: "SAP Courses & Training Modules",
    description:
      "Explore Techvaa's SAP S/4HANA, FICO, MM, ABAP and SuccessFactors training modules — live projects, certified mentors and 100% placement support.",
    keywords: ["SAP courses", "SAP training", "SAP FICO", "SAP MM", "SAP ABAP"],
  });
}

export default async function CoursesPage() {
  const courses = await courseService.getAll();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
        ])}
      />
      <PageHero
        eyebrow="Curriculum"
        title="SAP courses built for the job market"
        description="Choose a track and start learning on live S/4HANA systems with mentors who hire."
      />

      <Container className="py-16">
        <SectionHeader
          align="left"
          as="h2"
          title="All training modules"
          description={`${courses.length} published ${courses.length === 1 ? "module" : "modules"} and growing.`}
        />
        {courses.length === 0 ? (
          <p className="mt-10 rounded-xl border bg-secondary/40 p-10 text-center text-muted-foreground">
            New courses are being published. Check back soon or contact our team.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <Reveal as="div" index={i % 3} key={course.id}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>

      <HiringPartners />
      <UpcomingBatches />
    </>
  );
}
