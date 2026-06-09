import { Container } from "./container";

export type LegalSection = {
  id: string;
  title: string;
  /** Free-flowing paragraphs rendered before any bullet list. */
  paragraphs?: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
};

/**
 * Shared long-form layout for legal pages (Terms, Privacy). Keeps typography
 * consistent without depending on the tailwind-typography plugin, and renders
 * a sticky table of contents on wide screens.
 */
export function LegalDoc({
  lastUpdated,
  intro,
  sections,
}: {
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <Container className="py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
        {/* Table of contents */}
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24 text-sm">
            <p className="mb-3 font-semibold text-foreground">On this page</p>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-muted-foreground transition-colors hover:text-brand"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Body */}
        <article className="max-w-3xl">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>

          {intro && (
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              {intro}
            </p>
          )}

          <div className="mt-10 space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {i + 1}. {s.title}
                </h2>
                {s.paragraphs?.map((p, j) => (
                  <p
                    key={j}
                    className="mt-3 leading-relaxed text-muted-foreground"
                  >
                    {p}
                  </p>
                ))}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-brand">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </article>
      </div>
    </Container>
  );
}
