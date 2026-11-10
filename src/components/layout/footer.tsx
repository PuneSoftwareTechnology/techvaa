import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/common/container";
import { Logo } from "@/components/common/logo";
import { SOCIAL_ICON_MAP } from "@/components/common/social-icons";
import {
  SITE,
  LOCATION,
  HAS_ADDRESS,
  FOOTER_LINKS,
  SOCIAL_LINKS,
} from "@/constants/site";

/** Official brand colours for each social tile. */
const SOCIAL_TILE: Record<(typeof SOCIAL_LINKS)[number]["icon"], string> = {
  instagram:
    "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]",
  youtube: "bg-[#FF0000]",
  facebook: "bg-[#1877F2]",
};

export function Footer() {
  const year = 2026; // server-rendered; avoids hydration drift from Date.now()
  return (
    <footer className="bg-brand text-brand-foreground">
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 lg:max-w-sm">
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {SITE.description}
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/80">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {HAS_ADDRESS && (
                    <>
                      {LOCATION.address.street}
                      <br />
                    </>
                  )}
                  {[
                    HAS_ADDRESS ? LOCATION.address.locality : null,
                    LOCATION.city,
                    LOCATION.region,
                    HAS_ADDRESS ? LOCATION.address.postalCode : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {LOCATION.mapLink && (
                    <>
                      {" · "}
                      <a
                        href={LOCATION.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white"
                      >
                        Get directions
                      </a>
                    </>
                  )}
                </span>
              </p>
            </div>

            {/* Brand-coloured social icons, directly under the location. */}
            <ul aria-label="Follow Techvaa" className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => {
                const Icon =
                  SOCIAL_ICON_MAP[s.icon as keyof typeof SOCIAL_ICON_MAP];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`grid size-10 place-items-center rounded-xl text-white shadow-md ring-1 ring-white/20 transition-transform hover:-translate-y-0.5 hover:scale-105 ${SOCIAL_TILE[s.icon]}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 md:contents">
            <nav aria-label="Company" className="text-sm">
              <h2 className="mb-4 font-semibold tracking-wide text-white">
                Company
              </h2>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.company.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Courses" className="text-sm">
              <h2 className="mb-4 font-semibold tracking-wide text-white">
                Top Courses
              </h2>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.courses.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:mt-12 sm:flex-row">
          <div className="space-y-2">
            <p className="text-sm text-white/60">
              © {year} {SITE.legalName}. All rights reserved.
            </p>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {FOOTER_LINKS.legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/60 underline underline-offset-4 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-xs text-center mt-8 mb-16 font-semibold text-white/45 italic">
          Techvaa is not an authorized SAP partner.
        </p>
      </Container>
    </footer>
  );
}
