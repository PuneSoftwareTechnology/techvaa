import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Reveal } from "@/components/common/reveal";
import { Card } from "@/components/ui/card";
import { RichTextContent } from "@/components/common/rich-text-content";

/**
 * "About the Trainer" — a heading + rich-text bio shown after the curriculum.
 * Renders nothing unless the course has authored trainer content.
 */
export function AboutTrainer({
  heading,
  description,
}: {
  heading?: string | null;
  description?: string | null;
}) {
  if (!heading && !description) return null;

  return (
    <section
      aria-labelledby="about-trainer-title"
      className="py-10 sm:py-14"
    >
      <Container>
        <SectionHeader
          as="h2"
          eyebrow="Meet your mentor"
          title={heading || "About the trainer"}
          gradient
        />
        {description && (
          <Reveal as="div" className="mx-auto mt-8 max-w-3xl sm:mt-12">
            <Card className="p-6 sm:p-8">
              <RichTextContent
                html={description}
                className="prose-p:text-muted-foreground prose-li:text-muted-foreground"
              />
            </Card>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
