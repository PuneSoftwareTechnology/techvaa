import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseGridSkeleton } from "@/modules/courses/components/course-card-skeleton";

export default function CoursesLoading() {
  return (
    <>
      <div className="bg-brand py-10 lg:py-20">
        <Container>
          <Skeleton className="h-4 w-24 bg-white/20" />
          <Skeleton className="mt-4 h-10 w-2/3 bg-white/20" />
          <Skeleton className="mt-4 h-5 w-1/2 bg-white/20" />
        </Container>
      </div>
      <Container className="py-10 sm:py-16">
        <CourseGridSkeleton count={6} />
      </Container>
    </>
  );
}
