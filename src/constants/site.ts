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
    "Techvaa is a premier SAP training institute in Pune offering job-oriented SAP S/4HANA, FICO, MM, ABAP and SuccessFactors courses with real-time projects and 100% placement support.",

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
};

/** Primary header navigation. Order mirrors the design reference. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Placement Services", href: "/placements" },
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
 * Hiring / alumni-placement partners for the marquee.
 * Logos are resolved at render time from each domain via Google's favicon
 * service (see LogoMarquee), with a wordmark fallback.
 */
export const HIRING_PARTNERS = [
  { name: "Wipro", domain: "wipro.com" },
  { name: "eClerx", domain: "eclerx.com" },
  { name: "Accenture", domain: "accenture.com" },
  { name: "Birlasoft", domain: "birlasoft.com" },
  { name: "Capgemini", domain: "capgemini.com" },
  { name: "H&M", domain: "hm.com" },
  { name: "L&T Infotech", domain: "ltimindtree.com" },
  { name: "Maersk", domain: "maersk.com" },
  { name: "TCS", domain: "tcs.com" },
  { name: "Tata Technologies", domain: "tatatechnologies.com" },
  { name: "Deloitte", domain: "deloitte.com" },
  { name: "Tata", domain: "tata.com" },
] as const;
