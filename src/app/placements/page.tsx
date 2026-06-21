import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  placementService,
  reviewService,
} from "@/services/social-proof.service";
import { pageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { DynamicIcon } from "@/components/common/dynamic-icon";
import { LogoMarquee } from "@/components/common/logo-marquee";
import { Shimmer } from "@/components/common/shimmer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlacementCard } from "@/modules/placements/components/placement-card";
import { GoogleRatingBadge } from "@/modules/reviews/components/google-rating-badge";
import {
  CAREER_TOOLS,
  PLACEMENT_PROCESS,
  PLACEMENT_GUARANTEE,
  ALUMNI_PARTNERS,
} from "@/constants/placements";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/placements", {
    title: "Placement Services & Career Support",
    description:
      "Launch your SAP career with Techvaa — resume building, mock interviews, one-on-one mentorship and a hiring-partner network with 100% placement support.",
    keywords: [
      "SAP placement",
      "SAP jobs",
      "SAP career support",
      "SAP placement assistance",
    ],
  });
}

export default async function PlacementsPage() {
  const [placements, ratingSummary] = await Promise.all([
    placementService.getTop(12),
    reviewService.getRatingSummary(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Placement Services", path: "/placements" },
        ])}
      />

      <PageHero
        eyebrow="Career Services"
        title="Launch your career with Techvaa"
        description="Master the skills that matter. Our expert-led training sharpens your edge for clearing interviews with confidence."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Placement Services", href: "/placements" },
        ]}
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Button
            asChild
            variant="accent"
            size="xl"
            className="relative overflow-hidden"
          >
            <Link href="#enquiry-form">
              <Shimmer />
              Schedule a Placement Session <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          {ratingSummary.count > 0 && (
            <GoogleRatingBadge summary={ratingSummary} />
          )}
        </div>
      </PageHero>

      {/* Career prep tools */}
      <section aria-labelledby="tools-title" className="py-8">
        <Container>
          <SectionHeader
            as="h2"
            eyebrow="Career Prep Tools"
            title="Everything you need to get hired"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {CAREER_TOOLS.map((t, i) => (
              <Reveal as="div" index={i} key={t.title}>
                <Card
                  className={`group relative flex justify-start items-center h-full items-start gap-4 overflow-hidden p-7 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${t.ring}`}
                >
                  <div
                    className={` grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${t.gradient}`}
                  >
                    <DynamicIcon name={t.icon} className="size-7" />
                  </div>
                  <div className="">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.description}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Recent placements */}
      {placements.length > 0 && (
        <section aria-labelledby="placed-title" className="py-12 sm:py-20">
          <Container>
            <SectionHeader
              as="h2"
              eyebrow="Recent Placements"
              title="Our students, placed"
            />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-4">
              {placements.map((p, i) => (
                <Reveal as="div" index={i % 4} key={p.id}>
                  <PlacementCard placement={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Our Students Are Placed In */}
      <section
        aria-labelledby="alumni-title"
        className="border-t bg-secondary/40 py-10 sm:py-14"
      >
        <Container>
          <h2
            id="alumni-title"
            className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Our Students Are Placed In
          </h2>
          <LogoMarquee items={ALUMNI_PARTNERS} durationSeconds={40} />
        </Container>
      </section>

      {/* Placement process */}
      <section
        aria-labelledby="process-title"
        className="pb-8 pt-12 sm:pb-12 sm:pt-20"
      >
        <Container>
          <SectionHeader
            as="h2"
            eyebrow="How It Works"
            title="Your path to placement"
            description="A guided, step-by-step process — book one session and we take it from there."
          />

          <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-indigo-800 to-violet-700 p-6 sm:mt-12 sm:p-8 lg:p-10">
            <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-1">
              {PLACEMENT_PROCESS.map((p, i) => (
                <li
                  key={p.step}
                  className="flex flex-col items-stretch gap-3 lg:flex-1 lg:flex-row lg:items-center"
                >
                  <Reveal
                    as="div"
                    index={i}
                    className="flex h-full flex-1 items-center gap-4 rounded-2xl bg-white/10 p-4 text-white ring-1 ring-white/10 lg:flex-col lg:items-center lg:gap-3 lg:p-5 lg:text-center"
                  >
                    <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-accent-orange text-accent-orange-foreground">
                      <DynamicIcon name={p.icon} className="size-6" />
                      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[10px] font-bold text-brand">
                        {i + 1}
                      </span>
                    </span>
                    <div className="lg:mt-1">
                      <h3 className="font-heading text-sm font-semibold leading-tight">
                        {p.step}
                      </h3>
                      <p className="mt-1 text-xs leading-snug text-white/70">
                        {p.description}
                      </p>
                    </div>
                  </Reveal>

                  {i < PLACEMENT_PROCESS.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="mx-auto size-5 shrink-0 rotate-90 text-accent-orange lg:rotate-0"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              variant="accent"
              size="xl"
              className="relative overflow-hidden"
            >
              <Link href="#enquiry-form">
                <Shimmer />
                Schedule a Placement Session
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Placement assistance guarantee */}
      <section
        aria-labelledby="guarantee-title"
        className="pb-12 pt-4 sm:pb-20"
      >
        <Container>
          <Reveal className="rounded-3xl bg-brand p-6 text-brand-foreground sm:p-12">
            <h2
              id="guarantee-title"
              className="font-heading text-2xl font-bold sm:text-3xl"
            >
              From beginner to job ready
            </h2>
            <p className="mt-2 max-w-2xl sm:max-w-4xl text-white/80">
              A structured path that builds your skills and supports you at
              every step — from training to interview-ready.
            </p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PLACEMENT_GUARANTEE.map((g, i) => (
                <li
                  key={g}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 text-sm font-medium"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-orange text-sm font-bold text-accent-orange-foreground">
                    {i + 1}
                  </span>
                  {g}
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
