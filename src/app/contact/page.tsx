import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { pageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/common/container";
import { Card } from "@/components/ui/card";
import { LeadForm } from "@/components/forms/lead-form";
import { SOCIAL_ICON_MAP } from "@/components/common/social-icons";
import { SITE, SOCIAL_LINKS } from "@/constants/site";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/contact", {
    title: "Contact Us",
    description:
      "Talk to a Techvaa SAP advisor about courses, batch schedules and placements. We respond within one business day.",
    keywords: ["contact Techvaa", "SAP training enquiry"],
  });
}

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHero
        eyebrow="Contact"
        title="Talk to our SAP advisors"
        description="Questions about a course, batch, or placements? Send us a message — we reply within one business day."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Contact details */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Get in touch
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our advisors are here to help you choose the right SAP track and
              plan your career.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <a href={`mailto:${SITE.email}`} className="text-sm text-muted-foreground hover:text-brand">
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Phone</p>
                  <a
                    href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                    className="text-sm text-muted-foreground hover:text-brand"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                  <a
                    href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-brand"
                  >
                    {SITE.whatsapp}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Hours</p>
                  <p className="text-sm text-muted-foreground">Mon–Sat, 9 AM – 8 PM</p>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground">Follow us</p>
              <ul className="mt-3 flex gap-3">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = SOCIAL_ICON_MAP[s.icon as keyof typeof SOCIAL_ICON_MAP];
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
                      >
                        <Icon className="size-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Form */}
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form and we&apos;ll get back to you shortly.
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}
