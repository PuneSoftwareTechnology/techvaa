"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Collapsible, NavigationMenu } from "radix-ui";
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

function desktopLinkClass(active: boolean) {
  return cn(
    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand after:transition-transform after:duration-200",
    active
      ? "text-brand after:scale-x-100"
      : "text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-100 hover:after:bg-border"
  );
}

function mobileLinkClass(active: boolean) {
  return cn(
    "rounded-md border-l-2 px-3 py-3 text-base font-medium transition-colors",
    active
      ? "border-accent-orange bg-brand/10 text-brand"
      : "border-transparent text-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
  );
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
          <NavigationMenu.Root
            aria-label="Primary"
            delayDuration={100}
            className="hidden lg:block"
          >
            <NavigationMenu.List className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <NavigationMenu.Item key={item.href} className="relative">
                    {item.children ? (
                      <>
                        <NavigationMenu.Trigger
                          className={cn(
                            desktopLinkClass(active),
                            "group flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                          )}
                        >
                          {item.label}
                          <ChevronDown
                            className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                            aria-hidden="true"
                          />
                        </NavigationMenu.Trigger>
                        {/* pt-2 (not mt-2) keeps the hover area continuous between trigger and panel. */}
                        <NavigationMenu.Content className="absolute left-0 top-full z-50 pt-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                          <ul className="w-52 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
                            {item.children.map((child) => {
                              const childActive = pathname === child.href;
                              return (
                                <li key={child.href}>
                                  <NavigationMenu.Link asChild active={childActive}>
                                    <Link
                                      href={child.href}
                                      aria-current={childActive ? "page" : undefined}
                                      className={cn(
                                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:bg-brand/5 focus-visible:text-brand",
                                        childActive
                                          ? "bg-brand/10 text-brand"
                                          : "text-foreground hover:bg-brand/5 hover:text-brand"
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  </NavigationMenu.Link>
                                </li>
                              );
                            })}
                          </ul>
                        </NavigationMenu.Content>
                      </>
                    ) : (
                      <NavigationMenu.Link asChild active={active}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={desktopLinkClass(active)}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenu.Link>
                    )}
                  </NavigationMenu.Item>
                );
              })}
            </NavigationMenu.List>
          </NavigationMenu.Root>

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
              <nav
                aria-label="Mobile"
                className="mt-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 pb-6"
              >
                {NAV_ITEMS.map((item) => {
                  const active = isActive(pathname, item.href);
                  return item.children ? (
                    <Collapsible.Root key={item.href} defaultOpen={active}>
                      <Collapsible.Trigger
                        className={cn(
                          mobileLinkClass(active),
                          "group flex w-full items-center justify-between"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                          aria-hidden="true"
                        />
                      </Collapsible.Trigger>
                      <Collapsible.Content>
                        <ul className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-2">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <li key={child.href}>
                                <SheetClose asChild>
                                  <Link
                                    href={child.href}
                                    aria-current={childActive ? "page" : undefined}
                                    className={cn(
                                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                      childActive
                                        ? "bg-brand/10 text-brand"
                                        : "text-foreground hover:bg-brand/5 hover:text-brand"
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                </SheetClose>
                              </li>
                            );
                          })}
                        </ul>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  ) : (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={mobileLinkClass(active)}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
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
