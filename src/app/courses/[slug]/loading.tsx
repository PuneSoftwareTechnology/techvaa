import { Container } from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for the course detail page. Mirrors the real layout (hero → about →
 * Key curriculum grid → outcomes band → batch card) so it doesn't fall back to
 * the parent /courses grid skeleton, which is the wrong shape for this route.
 */
export default function CourseDetailLoading() {
  return (
    <>
      {/* Hero */}
      <div className="bg-brand py-14 lg:py-20">
        <Container>
          <Skeleton className="h-4 w-48 bg-white/20" />
          <Skeleton className="mt-4 h-4 w-32 bg-white/20" />
          <Skeleton className="mt-4 h-12 w-2/3 bg-white/20" />
          <Skeleton className="mt-4 h-6 w-1/2 bg-white/20" />
          <div className="mt-8 flex flex-wrap gap-4">
            <Skeleton className="h-12 w-48 bg-white/20" />
          </div>
        </Container>
      </div>

      {/* About this course */}
      <Container className="py-12">
        <Skeleton className="h-7 w-56" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Container>

      {/* Key curriculum highlights */}
      <Container className="py-16">
        <div className="mx-auto max-w-md text-center">
          <Skeleton className="mx-auto h-4 w-28" />
          <Skeleton className="mx-auto mt-3 h-8 w-64" />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full p-6">
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="mt-3 h-5 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </Card>
          ))}
        </div>
      </Container>

      {/* Outcomes / stats band (dark gradient) */}
      <div className="bg-gradient-to-br from-brand via-brand to-[oklch(0.26_0.09_262)] py-16">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <Skeleton className="mx-auto h-4 w-40 bg-white/20" />
            <Skeleton className="mx-auto mt-3 h-8 w-72 bg-white/20" />
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <Skeleton className="mx-auto size-12 rounded-xl bg-white/20" />
                <Skeleton className="mx-auto mt-3 h-7 w-20 bg-white/20" />
                <Skeleton className="mx-auto mt-2 h-4 w-28 bg-white/20" />
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Skeleton className="h-12 w-56 bg-white/20" />
          </div>
        </Container>
      </div>

      {/* Upcoming batch */}
      <Container className="max-w-4xl py-16">
        <div className="mx-auto max-w-md text-center">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto mt-3 h-8 w-56" />
        </div>
        <Card className="mt-10 p-6 sm:p-8">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <Skeleton className="h-6 w-2/3" />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-12 w-40" />
          </div>
        </Card>
      </Container>

      {/* Alumni placed-in marquee */}
      <div className="border-y bg-secondary/40 py-12">
        <Container>
          <Skeleton className="mx-auto h-4 w-64" />
          <div className="mt-8 flex justify-center gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-28 shrink-0" />
            ))}
          </div>
        </Container>
      </div>

      {/* What our graduates say */}
      <Container className="py-20">
        <div className="mx-auto max-w-md text-center">
          <Skeleton className="mx-auto h-4 w-28" />
          <Skeleton className="mx-auto mt-3 h-8 w-64" />
        </div>
        <div className="mt-12 flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="w-[320px] shrink-0 p-6 sm:w-[380px]">
              <Skeleton className="size-7 rounded" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-11/12" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-32" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
