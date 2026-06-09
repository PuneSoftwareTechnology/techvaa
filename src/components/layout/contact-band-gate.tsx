"use client";

import { usePathname } from "next/navigation";
import { ContactBand } from "./contact-band";

/**
 * The global "Get in touch" band shows on every page except /contact, which
 * has its own dedicated form (avoids a duplicate form on the same page).
 */
export function ContactBandGate() {
  const pathname = usePathname();
  if (pathname?.startsWith("/contact")) return null;
  return <ContactBand />;
}
