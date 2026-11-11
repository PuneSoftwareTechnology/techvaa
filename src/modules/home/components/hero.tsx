import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { MapPin } from "lucide-react";
import { HeroBackground } from "@/components/common/hero-background";
import { ScrollLink } from "@/components/common/scroll-link";
import { Shimmer } from "@/components/common/shimmer";
import { HERO_HIGHLIGHTS } from "@/constants/home";
import { LOCATION } from "@/constants/site";

export function Hero() {
  // No entrance animations here: the hero is the first paint and holds the
  // LCP image, so it must arrive visible in the server HTML (not opacity:0
  // waiting for JavaScript).
  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground">
      <HeroBackground />

      <Container className="relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 ring-1 ring-white/15"
          >
            <MapPin className="size-3.5 text-accent-orange" aria-hidden="true" />
            SAP Training Institute in {LOCATION.city}
          </p>

          <h1 className="mt-5 text-balance font-heading text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl"
          >
            Master SAP. <span className="text-accent-orange">Elevate</span> Your
            Career. Get Hired.
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg text-white/80"
          >
            Comprehensive SAP training in {LOCATION.city} with real-time Projects
            and 100% placement support.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              variant="accent"
              size="xl"
              className="relative overflow-hidden"
            >
              <ScrollLink href="#contact">
                <Shimmer />
                Enroll Now <ArrowRight aria-hidden="true" />
              </ScrollLink>
            </Button>
          </div>

          <ul className="mt-8 grid gap-2">
            {HERO_HIGHLIGHTS.map((h) => (
              <li
                key={h}
                className="flex items-center gap-2 text-sm text-white/85"
              >
                <CheckCircle2
                  className="size-4 shrink-0 text-accent-orange"
                  aria-hidden="true"
                />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Placements banner — LCP image, so preload it */}
        <div className="relative mx-auto w-full max-w-xl">
          <Image
            src="/images/hero-placements.webp"
            alt="Techvaa students placed at PwC, EY, Deloitte, TCS and Infosys"
            width={1600}
            height={900}
            sizes="(min-width: 640px) 576px, 100vw"
            preload
            className="h-auto w-full rounded-2xl shadow-2xl ring-1 ring-white/20"
          />
          <div
            className="absolute -bottom-5 -left-5 rounded-xl bg-accent-orange px-4 py-3 text-sm font-semibold text-white shadow-xl"
            aria-hidden="true"
          >
            100% Placement Support
          </div>
        </div>
      </Container>
    </section>
  );
}
