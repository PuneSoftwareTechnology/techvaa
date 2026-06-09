import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "./container";
import { HeroBackground } from "./hero-background";

type Crumb = { name: string; href: string };

/** Compact navy hero used at the top of interior pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground">
      <HeroBackground />
      <Container className="relative py-14 lg:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
              {breadcrumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />}
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-orange">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-balance font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-pretty text-lg text-white/80">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
