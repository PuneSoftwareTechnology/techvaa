import Link from "next/link";
import { CalendarDays, Download, Sparkles } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_SESSIONS } from "@/constants/home";

export function DemoSessions() {
  return (
    <Container as="section" aria-labelledby="demo-title" className="py-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card className="h-full p-7">
            <h2
              id="demo-title"
              className="font-heading text-xl font-bold text-foreground"
            >
              Featured demo sessions
            </h2>
            <ul className="mt-5 space-y-3">
              {DEMO_SESSIONS.map((d) => (
                <li
                  key={d.title}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-secondary/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                      <CalendarDays className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {d.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{d.date}</p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="accent">
                    <Link href="#contact">Book</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal index={1}>
          <Card className="relative flex h-full flex-col justify-center overflow-hidden bg-brand p-8 text-brand-foreground">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-accent-orange/25 blur-3xl"
            />
            <Sparkles
              className="size-8 text-accent-orange"
              aria-hidden="true"
            />
            <h2 className="mt-3 font-heading text-2xl text-black font-bold">
              Ready to send your career soaring?
            </h2>
            <p className="mt-2 max-w-sm text-black/80">
              Download the complete Techvaa course catalog with syllabi, batch
              dates, and placement outcomes.
            </p>
            <div className="mt-6">
              <Button asChild variant="accent" size="xl">
                <Link href="/courses">
                  <Download aria-hidden="true" /> Download Catalog
                </Link>
              </Button>
            </div>
          </Card>
        </Reveal>
      </div>
    </Container>
  );
}
