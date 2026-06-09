import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/modules/courses/components/course-card";
import type { CourseDTO } from "@/types";

export function TopModules({ courses }: { courses: CourseDTO[] }) {
  if (courses.length === 0) return null;
  return (
    <section aria-labelledby="modules-title" className="bg-secondary/40 py-20">
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Curriculum"
          title="Explore our top SAP modules"
          description="Industry-aligned tracks across finance, logistics and development — each with live projects and certification guidance."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course, i) => (
            <Reveal as="div" index={i} key={course.id}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="xl">
            <Link href="/courses">
              View all 25+ modules <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
