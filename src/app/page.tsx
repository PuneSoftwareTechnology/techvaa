import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-seo";
import { courseService } from "@/services/course.service";
import { faqService } from "@/services/faq.service";
import { testimonialService } from "@/services/social-proof.service";
import { reviewService } from "@/services/social-proof.service";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema, localBusinessSchema } from "@/lib/jsonld";
import { Hero } from "@/modules/home/components/hero";
import { HiringPartners } from "@/modules/home/components/hiring-partners";
import { WhyChoose } from "@/modules/home/components/why-choose";
import { TopModules } from "@/modules/home/components/top-modules";
import { GraduatesSay } from "@/modules/home/components/graduates-say";
import { TransformCta } from "@/modules/home/components/transform-cta";
import { BatchSchedule } from "@/modules/courses/components/batch-schedule";
import { FaqSection } from "@/modules/home/components/faq-section";

// Render on every request (live DB read). Amplify Hosting runs Next.js across
// multiple ephemeral compute instances with no shared ISR cache, so a cached
// page (`revalidate`) only refreshes on whichever instance handled the
// revalidation — other/cold instances keep serving the stale build snapshot,
// making admin edits "vanish" minutes later. Dynamic rendering removes the
// snapshot entirely so the page can never go stale.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/", {
    title: "SAP Training Institute in Pune",
    description:
      "Techvaa is Pune's leading SAP training institute — live S/4HANA labs, SAP-certified trainers and 100% placement support. SAP FICO, MM, ABAP & S/4HANA courses in Pune.",
    keywords: [
      "SAP training in Pune",
      "SAP course in Pune",
      "SAP institute Pune",
      "SAP FICO course Pune",
      "S/4HANA training Pune",
      "SAP classes Pune",
    ],
  });
}

export default async function HomePage() {
  const [featured, batches, testimonials, faqs, rating] = await Promise.all([
    courseService.getFeatured(3),
    courseService.getUpcomingBatches(5),
    testimonialService.getForHomepage(3),
    faqService.getForHomepage(),
    reviewService.getRatingSummary(),
  ]);

  return (
    <>
      <JsonLd data={[localBusinessSchema(rating), faqSchema(faqs)]} />
      <Hero />
      <HiringPartners />
      <WhyChoose />
      <TopModules courses={featured} />
      <GraduatesSay testimonials={testimonials} />
      <TransformCta />
      <BatchSchedule rows={batches} />
      <FaqSection faqs={faqs} />
    </>
  );
}
