"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { MapPin } from "lucide-react";
import { HeroBackground } from "@/components/common/hero-background";
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

      <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
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
              <Link href="#contact">
                <Shimmer />
                Enroll Now <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>

          <motion.ul {...fade(0.32)} className="mt-8 grid gap-2 sm:grid-cols-2">
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

        {/* Stylised analytics dashboard mock (pure CSS — zero image weight) */}
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
          className="relative mx-auto w-full max-w-lg"
          aria-hidden="true"
        >
          <div className="rounded-2xl bg-white/95 p-5 shadow-2xl ring-1 ring-white/20">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-3 w-28 rounded-full bg-brand/80" />
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-accent-orange" />
                <span className="size-2.5 rounded-full bg-brand/30" />
                <span className="size-2.5 rounded-full bg-brand/20" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { k: "Modules", v: "25+" },
                { k: "Placed", v: "500+" },
                { k: "Rating", v: "4.9" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-lg bg-secondary p-3 text-center"
                >
                  <div className="text-lg font-bold text-brand">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-28 items-end gap-2 rounded-lg bg-secondary/60 p-3">
              {[40, 65, 50, 80, 70, 95, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-brand to-accent-orange"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-xl bg-accent-orange px-4 py-3 text-sm font-semibold text-white shadow-xl">
            100% Placement Support
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
