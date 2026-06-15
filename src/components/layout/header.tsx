"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { NAV_ITEMS, PRIMARY_CTA } from "@/constants/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        "bg-background bg-gradient-to-b from-brand/12 via-brand/[0.04] to-transparent",
        scrolled
          ? "border-border bg-background/85 backdrop-blur"
          : "border-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-18">
        <Logo />

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand after:transition-transform after:duration-200",
                  isActive(pathname, item.href)
                    ? "text-brand after:scale-x-100"
                    : "text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-100 hover:after:bg-border"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:max-w-xs">
              <SheetHeader className="border-b border-brand/10 bg-gradient-to-br from-brand-muted to-accent-orange/10">
                <SheetTitle asChild>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-2 flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                      className={cn(
                        "rounded-md border-l-2 px-3 py-3 text-base font-medium transition-colors",
                        isActive(pathname, item.href)
                          ? "border-accent-orange bg-brand/10 text-brand"
                          : "border-transparent text-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild variant="accent" size="xl" className="mt-4">
                    <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
