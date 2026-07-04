"use client";

import { forwardRef, type ComponentProps, type MouseEvent } from "react";
import Link from "next/link";

/**
 * A `next/link` for same-page hash targets (e.g. `#contact`).
 *
 * The App Router does not reliably scroll to an in-page anchor when the link's
 * href is a bare fragment on the route you're already on, so buttons like
 * "Book a Free Demo" appeared to do nothing. This intercepts the click, smooth
 * scrolls to the target element, and syncs the URL hash — falling back to the
 * default `<Link>` behaviour when the target isn't on the current page.
 */
export const ScrollLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(
  function ScrollLink({ href, onClick, ...props }, ref) {
    const hash = typeof href === "string" && href.startsWith("#") ? href.slice(1) : null;

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      onClick?.(event);
      if (!hash || event.defaultPrevented) return;
      const target = document.getElementById(hash);
      if (!target) return; // let Next handle it (e.g. anchor lives on another route)
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${hash}`);
    }

    return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
  },
);
