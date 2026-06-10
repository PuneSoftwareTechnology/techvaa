import { SITE, SOCIAL_LINKS } from "@/constants/site";
import { absoluteUrl } from "./seo";
import type {
  BlogDTO,
  CourseDTO,
  FaqDTO,
  RatingSummary,
  ReviewDTO,
} from "@/types";

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

export function courseSchema(course: CourseDTO) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description.slice(0, 200),
    url: absoluteUrl(`/courses/${course.slug}`),
    provider: {
      "@type": "EducationalOrganization",
      name: SITE.name,
      sameAs: absoluteUrl("/"),
    },
  };
}

export function faqSchema(faqs: FaqDTO[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
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
    description: blog.metaDescription ?? blog.introduction,
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
