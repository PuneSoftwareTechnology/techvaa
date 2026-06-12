import Link from "next/link";
import { CalendarCheck, Download, Eye, Sparkles, Star } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { Shimmer } from "@/components/common/shimmer";
import { Button } from "@/components/ui/button";

export function TransformCta() {
  return (
    <Container as="section" className="py-6">
      <Reveal className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 text-center text-brand-foreground sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-accent-orange/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-white/10 blur-3xl"
        />

        {/* Decorative outlined rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-12 size-72 rounded-full border border-white/5"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-12 size-64 rounded-full border border-white/10"
        />

        {/* Decorative sparkles & stars */}
        <Sparkles
          aria-hidden="true"
          className="pointer-events-none absolute left-8 top-8 size-6 text-accent-orange/70"
        />
        <Star
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-12 size-4 fill-white/30 text-white/30"
        />
        <Star
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-16 size-3 fill-white/40 text-white/40"
        />
        <Sparkles
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-1/4 size-5 text-white/30"
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Ready to transform your future?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Join the next cohort, attend a free demo, or download the full
            course catalog to plan your SAP career.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              variant="accent"
              size="xl"
              className="relative overflow-hidden"
            >
              <Link href="#contact">
                <Shimmer />
                <CalendarCheck aria-hidden="true" /> Book a Free Demo
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            >
              <Link href="/courses">
                <Eye aria-hidden="true" /> View Catalog
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
