"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground">
      <HeroBackground />

      <Container className="relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-28">
        <div>
          <motion.p
            {...fade(0)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 ring-1 ring-white/15"
          >
            <MapPin className="size-3.5 text-accent-orange" aria-hidden="true" />
            SAP Training Institute in {LOCATION.city}
          </motion.p>

          <motion.h1
            {...fade(0.08)}
            className="mt-5 text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Master SAP. <span className="text-accent-orange">Elevate</span> Your
            Career. Get Hired.
          </motion.h1>

          <motion.p
            {...fade(0.16)}
            className="mt-5 max-w-xl text-pretty text-lg text-white/80"
          >
            Comprehensive SAP training in {LOCATION.city} with real-time Projects
            and 100% placement support.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
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
          </motion.div>

          <motion.ul {...fade(0.32)} className="mt-8 grid gap-2">
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
          </motion.ul>
        </div>

        {/* Placements banner — LCP image, so preload it */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, scale: 0.96, y: 24 },
                animate: { opacity: 1, scale: 1, y: 0 },
                transition: {
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1] as const,
                },
              })}
          className="relative mx-auto w-full max-w-xl"
        >
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
        </motion.div>
      </Container>
    </section>
  );
}
