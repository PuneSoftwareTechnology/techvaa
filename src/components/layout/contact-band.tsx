import type { SVGProps } from "react";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/common/container";
import { LeadForm } from "@/components/forms/lead-form";
import { SITE } from "@/constants/site";

/** WhatsApp brand glyph — lucide dropped brand icons, so we inline it. */
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5l-.56-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.2 1.87.12.57-.08 1.74-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.02 21.5h-.01a9.5 9.5 0 0 1-4.83-1.32l-.35-.2-3.59.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.04c0-5.24 4.27-9.5 9.51-9.5a9.45 9.45 0 0 1 6.72 2.79 9.43 9.43 0 0 1 2.78 6.72c0 5.24-4.27 9.5-9.5 9.5zm8.09-17.6A11.36 11.36 0 0 0 12.02.5C5.74.5.64 5.6.64 11.87c0 2.01.53 3.98 1.53 5.71L.5 23.5l6.07-1.59a11.34 11.34 0 0 0 5.44 1.39h.01c6.28 0 11.38-5.1 11.39-11.37a11.3 11.3 0 0 0-3.3-8.04z" />
    </svg>
  );
}

const WHATSAPP_MESSAGE = `Hi ${SITE.name}, I'd like to know more about your SAP courses.`;

/**
 * "Get in touch with our experts" lead-capture band shown above the footer on
 * every page. Mirrors the design reference's dark contact section.
 */
export function ContactBand({ courseInterest }: { courseInterest?: string }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-band-title"
      className="relative overflow-hidden bg-[oklch(0.28_0.08_258)] text-white"
    >
      {/* decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-accent-orange/20 blur-3xl"
      />
      <Container className="relative grid gap-10 py-10 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <h2 id="contact-band-title" className="font-heading text-3xl font-bold sm:text-4xl">
            Get in touch with our experts
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            Have questions about a course, batch schedule, or placements? Send us
            a note and a Techvaa advisor will get back to you within one business
            day.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 hover:text-accent-orange">
              <span className="grid size-9 place-items-center rounded-full bg-white/10">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-3 hover:text-accent-orange"
            >
              <span className="grid size-9 place-items-center rounded-full bg-white/10">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              {SITE.phone}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-accent-orange"
            >
              <span className="grid size-9 place-items-center rounded-full bg-white/10">
                <WhatsAppIcon className="size-4" />
              </span>
              {SITE.whatsapp}
            </a>
          </div>
        </div>

        <div
          id="enquiry-form"
          className="scroll-mt-24 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur sm:p-8"
        >
          <LeadForm tone="dark" courseInterest={courseInterest} />
        </div>
      </Container>
    </section>
  );
}
