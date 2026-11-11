/**
 * Single source of truth for static brand / contact / navigation data.
 * Anything that is *content* (courses, blogs, reviews…) comes from the DB via
 * the data layer — this file holds only structural site configuration.
 */

export const SITE = {
  name: "Techvaa",
  legalName: "Techvaa SAP Academy",
  tagline: "Your Training Partner in Technology and Automation",
  description:
    "Techvaa is a premier SAP training institute in Pune offering job-oriented SAP courses including SAP FICO, SAP MM, SAP SD, SAP PP, SAP BTP and SAP SAC with real-time projects and 100% placement support.",

  // Used for absolute URLs (canonical, OG, sitemap). Override via env in prod.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://techvaa.com",
  locale: "en_IN",
  email: "techvaa24@gmail.com",
  // Display format; tel:/wa.me links strip non-digits at the call site.
  phone: "+91 91755 99880",
  whatsapp: "+91 91755 99880",
  foundingYear: 2018,
} as const;

/**
 * Local-SEO geography. Techvaa operates from Pune, Maharashtra. The city /
 * region / area-served signals below are always emitted (they're true today).
 *
 * The street address, geo-coordinates and Google Map go live the MOMENT the
 * real values are filled in here — the footer postal block, the contact-page
 * map and the PostalAddress/GeoCoordinates JSON-LD all render conditionally on
 * these fields being non-empty. Do NOT invent a street address: an inconsistent
 * NAP (name/address/phone) actively hurts local ranking.
 *
 * To finish setup, fill in:
 *   - address.street / address.locality / address.postalCode
 *   - geo (right-click the pin in Google Maps → the lat,lng is copied)
 *   - mapEmbedUrl (Maps → Share → "Embed a map" → copy the src="" URL)
 *   - mapLink     (Maps → Share → "Send a link" → the short maps URL)
 */
type SiteLocation = {
  city: string;
  region: string;
  regionCode: string;
  country: string;
  countryCode: string;
  /** Localities Techvaa serves — fuels footer copy, schema areaServed and (later) location landing pages. */
  localities: readonly string[];
  address: { street: string; locality: string; postalCode: string };
  geo: { lat: number; lng: number } | null;
  /** Google Maps iframe `src` URL. Empty until provided → map block stays hidden. */
  mapEmbedUrl: string;
  /** Public Google Maps share link for the "Get directions" CTA. */
  mapLink: string;
  /** Human display + schema.org openingHours value (e.g. "Mo-Sa 09:00-20:00"). */
  hours: { display: string; schema: string };
};

export const LOCATION: SiteLocation = {
  city: "Pune",
  region: "Maharashtra",
  regionCode: "MH",
  country: "India",
  countryCode: "IN",
  localities: [
    "Hinjewadi",
    "Wakad",
    "Baner",
    "Kharadi",
    "Aundh",
    "Pimpri-Chinchwad",
  ],
  // Techvaa is vacating the Pimple Saudagar office, so no street/PIN is
  // published — the footer, contact page and JSON-LD fall back to city/region.
  address: {
    street: "",
    locality: "",
    postalCode: "",
  },
  // TODO: { lat: 18.xxxx, lng: 73.xxxx }
  geo: null,
  // TODO: paste the Google Maps embed src URL.
  mapEmbedUrl: "",
  // TODO: paste the Google Maps share link.
  mapLink: "",
  hours: { display: "Mon–Sat, 9 AM – 8 PM", schema: "Mo-Sa 09:00-20:00" },
};

/**
 * Whether a real street address is published. Techvaa always shows the
 * city/region ("Pune, Maharashtra"); the postal block / map / PostalAddress
 * JSON-LD only render once a street address is filled in above. There is no
 * date-based expiry — the address is not removed after any cutoff.
 */
export const HAS_ADDRESS = LOCATION.address.street.trim().length > 0;

export type NavItem = {
  label: string;
  href: string;
  /** Sub-links rendered as a dropdown (desktop) / expandable list (mobile). */
  children?: readonly NavItem[];
};

/**
 * Individual course pages listed under the header "Courses" dropdown. Slugs
 * must match published courses in the DB. The all-courses page (/courses) is
 * linked from the footer instead.
 */
export const NAV_COURSES: readonly NavItem[] = [
  { label: "SAP FICO", href: "/courses/sap-fico-s4hana-course" },
  { label: "SAP MM", href: "/courses/sap-mm-s4hana-course" },
  { label: "SAP SD", href: "/courses/sap-sd-s4hana-course" },
  { label: "SAP PP", href: "/courses/sap-pp-s4hana-course" },
  { label: "SAP EWM", href: "/courses/sap-ewm-course" },
  { label: "SAP CO", href: "/courses/sap-co-s4hana-course" },
  { label: "SAP ABAP", href: "/courses/sap-abap-s4hana-course" },
  { label: "SAP BTP", href: "/courses/sap-btp-course" },
  { label: "SAP SAC", href: "/courses/sap-analytics-cloud-course" },
  { label: "SAP BW", href: "/courses/sap-bw-s4hana-course" },
] as const;

/** Primary header navigation. Order mirrors the design reference. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses", children: NAV_COURSES },
  { label: "Placements", href: "/placements" },
  { label: "Blogs", href: "/blogs" },
  { label: "Reviews", href: "/reviews" },
] as const;

export const PRIMARY_CTA = { label: "Enroll Now", href: "/courses" } as const;

/** Footer link columns. */
export const FOOTER_LINKS = {
  company: [
    { label: "Blog", href: "/blogs" },
    { label: "Reviews", href: "/reviews" },
    { label: "Contact", href: "/contact" },
    { label: "All SAP Courses", href: "/courses" },
  ],
  courses: [
    { label: "SAP FICO", href: "/courses/sap-fico-s4hana-course" },
    { label: "SAP MM", href: "/courses/sap-mm-s4hana-course" },
    { label: "SAP PP", href: "/courses/sap-pp-s4hana-course" },
    { label: "SAP SD", href: "/courses/sap-sd-s4hana-course" },
    { label: "SAP EWM", href: "/courses/sap-ewm-course" },
    { label: "SAP ABAP", href: "/courses/sap-abap-s4hana-course" },
    { label: "SAP BW", href: "/courses/sap-bw-s4hana-course" },
    { label: "SAP Analytics Cloud", href: "/courses/sap-analytics-cloud-course" },
    { label: "SAP CO", href: "/courses/sap-co-s4hana-course" },
  ],
  legal: [
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact Us", href: "/contact" },
  ],
} as const;

/** Social profiles shown in the footer / contact page. */
export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/techvaa24/",
    icon: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Techvaa24",
    icon: "youtube",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Techvaa/61579635066915/",
    icon: "facebook",
  },
] as const;

/**
 * Companies our students are placed in, as the three rows of the "Our Students
 * Are Successfully Placed In" marquee. Each row is a different set (client
 * request) — IT services / consulting, IT & BFSI, and enterprises.
 *
 * Logos are self-hosted in /public/logos (no third-party requests, cached for a
 * year); LogoMarquee falls back to the name alone if a file is missing.
 */
export const PLACED_COMPANY_ROWS = [
  [
    { name: "Accenture", logo: "/logos/accenture.png" },
    { name: "Infosys", logo: "/logos/infosys.png" },
    { name: "Capgemini", logo: "/logos/capgemini.png" },
    { name: "Deloitte", logo: "/logos/deloitte.png" },
    { name: "Wipro", logo: "/logos/wipro.png" },
    { name: "Cognizant", logo: "/logos/cognizant.png" },
    { name: "TCS", logo: "/logos/tcs.png" },
    { name: "IBM", logo: "/logos/ibm.png" },
    { name: "EY", logo: "/logos/ey.png" },
    { name: "L&T Infotech", logo: "/logos/ltimindtree.png" },
  ],
  [
    { name: "Tata Technologies", logo: "/logos/tata-technologies.png" },
    { name: "Birlasoft", logo: "/logos/birlasoft.png" },
    { name: "Yash Technologies", logo: "/logos/yash-technologies.png" },
    { name: "eClerx", logo: "/logos/eclerx.png" },
    { name: "Genpact", logo: "/logos/genpact.png" },
    { name: "Synechron", logo: "/logos/synechron.png" },
    { name: "Tietoevry", logo: "/logos/tietoevry.png" },
    { name: "Atos", logo: "/logos/atos.png" },
    { name: "Barclays", logo: "/logos/barclays.png" },
    { name: "DBS Bank", logo: "/logos/dbs-bank.png" },
  ],
  [
    { name: "Maersk", logo: "/logos/maersk.png" },
    { name: "H&M", logo: "/logos/h-m.png" },
    { name: "Volkswagen", logo: "/logos/volkswagen.png" },
    { name: "Schindler", logo: "/logos/schindler.png" },
    { name: "Godrej", logo: "/logos/godrej.png" },
    { name: "Konecranes", logo: "/logos/konecranes.png" },
    { name: "Faurecia", logo: "/logos/faurecia.png" },
    { name: "Smith+Nephew", logo: "/logos/smith-nephew.png" },
    { name: "Kerry", logo: "/logos/kerry.png" },
  ],
] as const;

/** Every placed-in company, flattened (screen-reader list, schema, etc.). */
export const HIRING_PARTNERS = PLACED_COMPANY_ROWS.flat();
