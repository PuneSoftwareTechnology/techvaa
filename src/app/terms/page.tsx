import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { LegalDoc, type LegalSection } from "@/components/common/legal-doc";
import { SITE } from "@/constants/site";

const LAST_UPDATED = "June 9, 2026";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/terms", {
    title: "Terms of Use",
    description:
      "The terms and conditions that govern your use of the Techvaa website, courses and services.",
    keywords: ["Techvaa terms of use", "terms and conditions"],
  });
}

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    paragraphs: [
      `By accessing or using the ${SITE.name} website and any related services, courses, or content (collectively, the "Services"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our Services.`,
      `${SITE.legalName} ("we", "us", or "our") may update these terms from time to time. Continued use of the Services after changes are posted constitutes your acceptance of the revised terms.`,
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    paragraphs: [
      "You must be at least 18 years of age, or have the consent of a parent or legal guardian, to enrol in our courses or submit an enquiry through the website.",
    ],
  },
  {
    id: "use-of-services",
    title: "Use of the Services",
    paragraphs: ["You agree to use the Services only for lawful purposes. You must not:"],
    bullets: [
      "Reproduce, distribute, or resell our course materials without written permission.",
      "Attempt to gain unauthorized access to any part of the website, accounts, or systems.",
      "Use the Services to transmit any unlawful, harmful, or misleading content.",
      "Interfere with or disrupt the integrity or performance of the website.",
    ],
  },
  {
    id: "enrolment-payments",
    title: "Enrolment and payments",
    paragraphs: [
      "Course fees, batch schedules, and inclusions are described at the time of enrolment. Fees once paid are subject to our refund policy, which is communicated to you before payment. We reserve the right to reschedule batches or update course content to maintain quality.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    paragraphs: [
      `All content on this website — including text, graphics, logos, course curricula, and training materials — is the property of ${SITE.legalName} or its licensors and is protected by applicable intellectual property laws. SAP and related product names are trademarks of SAP SE; ${SITE.name} is an independent training institute and is not an authorized SAP partner.`,
    ],
  },
  {
    id: "third-party-links",
    title: "Third-party links",
    paragraphs: [
      "Our website may contain links to third-party websites. We are not responsible for the content, policies, or practices of any third-party sites, and accessing them is at your own risk.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      'The Services are provided on an "as is" and "as available" basis. While we strive for accuracy, we make no warranties regarding the completeness or reliability of any content. Training outcomes, including placement assistance, depend on individual effort and market conditions and are not guaranteed.',
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of liability",
    paragraphs: [
      `To the maximum extent permitted by law, ${SITE.legalName} shall not be liable for any indirect, incidental, or consequential damages arising out of your use of, or inability to use, the Services.`,
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    paragraphs: [
      "These terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      `If you have any questions about these Terms of Use, please contact us at ${SITE.email} or call ${SITE.phone}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ])}
      />

      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="Please read these terms carefully before using the Techvaa website and services."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Terms of Use", href: "/terms" },
        ]}
      />

      <LegalDoc
        lastUpdated={LAST_UPDATED}
        intro={`These Terms of Use set out the rules for using the ${SITE.name} website and our training services. By using our Services, you agree to these terms.`}
        sections={SECTIONS}
      />
    </>
  );
}
