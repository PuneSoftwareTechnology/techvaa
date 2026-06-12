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
import { DemoSessions } from "@/modules/home/components/demo-sessions";
import { FaqSection } from "@/modules/home/components/faq-section";

// ISR: regenerate the home page at most once an hour.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/", {
    title: "Techvaa — #1 SAP Training Institute in India",
    description:
      "Master SAP with India's leading institute. Live S/4HANA labs, expert trainers and 100% placement assistance.",
    keywords: ["SAP training", "SAP course", "S/4HANA", "SAP institute"],
  });
}

export default async function HomePage() {
  const [featured, batches, testimonials, faqs, rating] = await Promise.all([
    courseService.getFeatured(3),
    courseService.getUpcomingBatches(5),
    testimonialService.getForDisplay(3),
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
      <DemoSessions />
      <FaqSection faqs={faqs} />
    </>
  );
}
