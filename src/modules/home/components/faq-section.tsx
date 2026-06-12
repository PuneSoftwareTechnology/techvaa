import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqDTO } from "@/types";
import { RichTextContent } from "@/components/common/rich-text-content";

/**
 * Renders the FAQ accordion. The matching FAQPage JSON-LD is emitted by the
 * page (see lib/jsonld → faqSchema) so the markup and structured data stay in
 * sync from one data source.
 */
export function FaqSection({ faqs }: { faqs: FaqDTO[] }) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-title" className="py-20">
      <Container className="max-w-3xl">
        <SectionHeader
          as="h2"
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about courses, batches, and placements."
        />
        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <RichTextContent
                    html={faq.answer}
                    className="prose-sm prose-p:text-muted-foreground prose-li:text-muted-foreground"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
