import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { LegalDoc, type LegalSection } from "@/components/common/legal-doc";
import { SITE } from "@/constants/site";

const LAST_UPDATED = "June 9, 2026";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/privacy", {
    title: "Privacy Policy",
    description:
      "How Techvaa collects, uses, and protects the personal information you share with us.",
    keywords: ["Techvaa privacy policy", "data protection"],
  });
}

const SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    paragraphs: [
      `${SITE.legalName} ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our Services.`,
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: ["We may collect the following types of information:"],
    bullets: [
      "Contact details you provide — such as your name, email address, and phone number — when you submit an enquiry or enrol in a course.",
      "Course preferences and messages you share with our advisors.",
      "Technical data such as IP address, browser type, and pages visited, collected automatically through cookies and analytics tools.",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    paragraphs: ["We use the information we collect to:"],
    bullets: [
      "Respond to your enquiries and provide information about courses and batches.",
      "Process enrolments and deliver our training services.",
      "Send you relevant updates, schedules, and offers (you can opt out at any time).",
      "Improve our website, content, and overall user experience.",
      "Comply with legal obligations and protect against fraud or misuse.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    paragraphs: [
      "Our website uses cookies and similar technologies to remember your preferences and understand how visitors use the site. You can control or disable cookies through your browser settings, though some features may not function properly as a result.",
    ],
  },
  {
    id: "sharing",
    title: "How we share information",
    paragraphs: [
      "We do not sell your personal information. We may share it with trusted service providers who help us operate the website and deliver our Services, and only to the extent necessary. We may also disclose information where required by law or to protect our rights.",
    ],
  },
  {
    id: "data-security",
    title: "Data security",
    paragraphs: [
      "We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "data-retention",
    title: "Data retention",
    paragraphs: [
      "We retain your personal information only for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      "You have the right to access, correct, or request deletion of your personal information, and to opt out of marketing communications. To exercise these rights, please contact us using the details below.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children's privacy",
    paragraphs: [
      "Our Services are not directed to children under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us so we can remove it.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      `If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at ${SITE.email} or call ${SITE.phone}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />

      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Your privacy matters to us. Here's how we collect, use, and protect your information."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ]}
      />

      <LegalDoc
        lastUpdated={LAST_UPDATED}
        intro={`This Privacy Policy describes how ${SITE.name} handles the personal information you share with us when using our website and services.`}
        sections={SECTIONS}
      />
    </>
  );
}
