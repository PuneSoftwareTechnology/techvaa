import { SITE, SOCIAL_LINKS, LOCATION } from "@/constants/site";
import { absoluteUrl } from "./seo";
import { htmlToPlainText } from "./sanitize";
import type {
  BlogDTO,
  CourseDTO,
  FaqDTO,
  RatingSummary,
  ReviewDTO,
} from "@/types";

/**
 * schema.org PostalAddress for the business. City / region / country are always
 * present (true today); street + postcode are added only once configured in
 * `LOCATION.address` so we never publish a placeholder NAP.
 */
function postalAddress() {
  const { address, city, region, regionCode, countryCode } = LOCATION;
  return {
    "@type": "PostalAddress",
    addressLocality: address.locality || city,
    addressRegion: regionCode || region,
    addressCountry: countryCode,
    ...(address.street ? { streetAddress: address.street } : {}),
    ...(address.postalCode ? { postalCode: address.postalCode } : {}),
  };
}

/** Pune + the localities we serve, as schema.org areaServed entries. */
function areaServed() {
  return [LOCATION.city, ...LOCATION.localities].map((name) => ({
    "@type": "City",
    name,
  }));
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: absoluteUrl("/"),
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: String(SITE.foundingYear),
    address: postalAddress(),
    areaServed: areaServed(),
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };
}

export function localBusinessSchema(rating?: RatingSummary) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl("/")}#localbusiness`,
    name: SITE.name,
    image: absoluteUrl("/opengraph-image"),
    url: absoluteUrl("/"),
    email: SITE.email,
    telephone: SITE.phone,
    priceRange: "$$",
    address: postalAddress(),
    areaServed: areaServed(),
    openingHours: LOCATION.hours.schema,
    ...(LOCATION.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: LOCATION.geo.lat,
            longitude: LOCATION.geo.lng,
          },
        }
      : {}),
    ...(LOCATION.mapLink ? { hasMap: LOCATION.mapLink } : {}),
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: SITE.name,
    url: absoluteUrl("/"),
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

/** Best-effort map of a free-text batch mode to a schema.org courseMode. */
function toCourseMode(mode: string | null): "online" | "onsite" {
  const m = (mode ?? "").toLowerCase();
  return m.includes("class") || m.includes("offline") || m.includes("onsite")
    ? "onsite"
    : "online";
}

export function courseSchema(course: CourseDTO) {
  // CourseInstance entries unlock the Google "Courses" rich result. Prefer real
  // batches; fall back to a single online instance carrying the course's
  // overall duration so the property is never empty.
  const instances =
    course.batches.length > 0
      ? course.batches.map((b) => ({
          "@type": "CourseInstance",
          courseMode: toCourseMode(b.mode),
          ...(b.duration ? { courseWorkload: b.duration } : {}),
          ...(b.startDate ? { startDate: b.startDate } : {}),
        }))
      : course.duration
        ? [
            {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: course.duration,
            },
          ]
        : [];

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: htmlToPlainText(course.description).slice(0, 200),
    url: absoluteUrl(`/courses/${course.slug}`),
    inLanguage: "en",
    educationalCredentialAwarded: `${course.title} — Course Completion Certificate`,
    provider: {
      "@type": "EducationalOrganization",
      name: SITE.name,
      url: absoluteUrl("/"),
      sameAs: absoluteUrl("/"),
    },
    ...(instances.length > 0 ? { hasCourseInstance: instances } : {}),
  };
}

export function faqSchema(faqs: FaqDTO[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: htmlToPlainText(f.answer) },
    })),
  };
}

export function reviewSchema(reviews: ReviewDTO[], rating: RatingSummary) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: absoluteUrl("/"),
    ...(rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.studentName },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.review,
    })),
  };
}

export function articleSchema(blog: BlogDTO) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.metaDescription ?? htmlToPlainText(blog.introduction),
    image: blog.featuredImage ? absoluteUrl(blog.featuredImage) : undefined,
    datePublished: blog.publishedAt ?? undefined,
    url: absoluteUrl(`/blog/${blog.slug}`),
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/opengraph-image") },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
