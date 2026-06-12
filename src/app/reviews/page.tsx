import type { Metadata } from "next";
import { reviewService } from "@/services/social-proof.service";
import { pageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/json-ld";
import { reviewSchema, breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { DynamicIcon } from "@/components/common/dynamic-icon";
import { Card } from "@/components/ui/card";
import { RatingOverview, RatingDistribution } from "@/modules/reviews/components/rating-overview";
import { ReviewsList } from "@/modules/reviews/components/reviews-list";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/reviews", {
    title: "Student Reviews & Testimonials",
    description:
      "Read verified Techvaa student reviews. 4.9/5 average rating with 99% satisfaction and 100% job assistance across our SAP training programs.",
    keywords: ["Techvaa reviews", "SAP training reviews", "student testimonials"],
  });
}

const REVIEW_STATS = [
  {
    icon: "shield-check",
    value: "99%",
    label: "Student Satisfaction",
    accent: "#3b82f6",
    tint: "bg-blue-500/10 text-blue-600",
    text: "text-blue-600",
  },
  {
    icon: "briefcase",
    value: "100%",
    label: "Job Assistance",
    accent: "#10b981",
    tint: "bg-emerald-500/10 text-emerald-600",
    text: "text-emerald-600",
  },
  {
    icon: "users",
    value: "500+",
    label: "Candidates Placed",
    accent: "#f97316",
    tint: "bg-orange-500/10 text-orange-600",
    text: "text-orange-600",
  },
];

const WHY_US = [
  { icon: "graduation-cap", title: "Expert Instructors", description: "SAP-certified consultants who teach what they practise." },
  { icon: "briefcase", title: "100% Placement Support", description: "End-to-end career services until you're hired." },
  { icon: "monitor-play", title: "Industry-Relevant Curriculum", description: "Live projects mapped to real enterprise rollouts." },
];

export default async function ReviewsPage() {
  const [reviews, summary] = await Promise.all([
    reviewService.getAll(),
    reviewService.getRatingSummary(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          reviewSchema(reviews, summary),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Reviews"
        title="What our students say about us"
        description="Verified feedback from learners who trusted Techvaa with their SAP careers."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Reviews", href: "/reviews" },
        ]}
      />

      {/* Overview + stats */}
      <section aria-labelledby="overview-title" className="py-16">
        <Container>
          <h2 id="overview-title" className="sr-only">
            Rating overview
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] lg:items-stretch">
            <Reveal className="h-full" index={0}>
              <RatingOverview summary={summary} />
            </Reveal>
            <Reveal className="h-full" index={1}>
              <RatingDistribution summary={summary} />
            </Reveal>
            {REVIEW_STATS.map((s, i) => (
              <Reveal key={s.label} className="h-full" index={i + 2}>
                <Card className="relative h-full items-center justify-center gap-3 overflow-hidden p-6 text-center">
                  <div
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ background: s.accent }}
                  />
                  <div
                    className={`grid size-12 place-items-center rounded-xl ${s.tint}`}
                  >
                    <DynamicIcon name={s.icon} className="size-6" />
                  </div>
                  <p className={`font-heading text-3xl font-extrabold leading-none ${s.text}`}>
                    {s.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed feedback with filters */}
      <section aria-labelledby="feedback-title" className="bg-secondary/40 py-16">
        <Container>
          <SectionHeader align="left" as="h2" title="Detailed student feedback" />
          <div className="mt-8">
            <ReviewsList reviews={reviews} />
          </div>
        </Container>
      </section>

      {/* Why choose us */}
      <section aria-labelledby="whyus-title" className="py-16">
        <Container>
          <SectionHeader as="h2" eyebrow="Why Choose Us" title="Built around your success" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHY_US.map((w, i) => (
              <Reveal as="div" index={i} key={w.title}>
                <Card className="h-full p-7 text-center">
                  <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-accent-orange/10 text-accent-orange">
                    <DynamicIcon name={w.icon} className="size-7" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
