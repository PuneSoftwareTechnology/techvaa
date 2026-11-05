import { Container } from "@/components/common/container";
import { LeadForm } from "@/components/forms/lead-form";

/**
 * "Get in touch with our experts" lead-capture band shown above the footer on
 * every page. Mirrors the design reference's dark contact section. Visitors
 * reach us through the form here or the floating call/WhatsApp buttons, so
 * the band doesn't repeat the email/phone/WhatsApp details.
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
