import Link from "next/link";
import Image from "next/image";
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
      <HeroBackground />
      <Container
        className={
          image
            ? "relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20"
            : "relative py-14 lg:py-20"
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
          <p className="mt-4 max-w-2xl text-pretty text-lg text-white/80">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
        </div>
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 shadow-2xl ring-1 ring-white/5">
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
