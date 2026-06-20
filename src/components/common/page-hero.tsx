import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Container } from "./container";
import { HeroBackground } from "./hero-background";
import { LinkifiedText } from "./linkified-text";

type Crumb = { name: string; href: string };

/** Compact navy hero used at the top of interior pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  image,
  imageAlt,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  image?: string | null;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground">
      {/* Decorative grid lines, glows and floating circles — layered over the
          navy section background, matching the home hero. */}
      <HeroBackground />

      <Container
        className={
          image
            ? "relative grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10 lg:py-20"
            : "relative py-10 lg:py-20"
        }
      >
        <div>
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
          <LinkifiedText
            text={description}
            className="mt-4 max-w-2xl text-pretty text-lg text-white/80 [&_a]:font-medium [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent-orange"
          />
        )}
        {children && <div className="mt-8">{children}</div>}
        </div>
        {image && (
          <div className="group relative">
            {/* soft warm glow so the card lifts off the navy backdrop */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2.5rem] bg-accent-orange/25 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
            />
            {/* flat on mobile (stacked below the copy); slight tilt at rest on
                desktop that straightens and lifts on hover */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm transition-transform duration-500 ease-out lg:rotate-[2.5deg] lg:group-hover:rotate-0 lg:group-hover:scale-[1.03]">
              <Image
                src={image}
                alt={imageAlt ?? title}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
