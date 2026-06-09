/**
 * Pure functions that map raw Prisma rows to serializable domain DTOs.
 * Centralised so every repository returns the exact same shape and Decimal /
 * Date conversions live in one place.
 */
import type {
  BlogDTO,
  CourseDTO,
  FaqDTO,
  PlacementDTO,
  ReviewDTO,
  SeoDTO,
  TestimonialDTO,
} from "@/types";

// Prisma's generated row types are structural; we accept the minimal shape we
// need rather than importing the heavy model types to keep this layer light.
type WithSeo = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  keywords: string[];
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  robots: string;
  schemaMarkup: unknown;
} | null;

export function toSeoDTO(seo: WithSeo): SeoDTO | null {
  if (!seo) return null;
  return {
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    canonicalUrl: seo.canonicalUrl,
    keywords: seo.keywords ?? [],
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
    robots: seo.robots,
    schemaMarkup: seo.schemaMarkup ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCourseDTO(c: any): CourseDTO {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    shortDescription: c.shortDescription ?? null,
    description: c.description,
    duration: c.duration ?? null,
    level: c.level,
    image: c.image ?? null,
    isFeatured: c.isFeatured,
    createdAt: c.createdAt.toISOString(),
    seo: toSeoDTO(c.seo ?? null),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toBlogDTO(b: any): BlogDTO {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt ?? null,
    content: b.content,
    featuredImage: b.featuredImage ?? null,
    readingTime: b.readingTime ?? null,
    publishedAt: b.publishedAt ? b.publishedAt.toISOString() : null,
    category: {
      id: b.category.id,
      name: b.category.name,
      slug: b.category.slug,
      description: b.category.description ?? null,
    },
    seo: toSeoDTO(b.seo ?? null),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toReviewDTO(r: any): ReviewDTO {
  return {
    id: r.id,
    studentName: r.studentName,
    company: r.company ?? null,
    designation: r.designation ?? null,
    rating: r.rating,
    review: r.review,
    image: r.image ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toTestimonialDTO(t: any): TestimonialDTO {
  return {
    id: t.id,
    name: t.name,
    role: t.role ?? null,
    company: t.company ?? null,
    message: t.message,
    image: t.image ?? null,
    videoUrl: t.videoUrl ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPlacementDTO(p: any): PlacementDTO {
  return {
    id: p.id,
    studentName: p.studentName,
    company: p.company,
    package: p.package ?? null,
    course: p.course ?? null,
    image: p.image ?? null,
    linkedinUrl: p.linkedinUrl ?? null,
    joiningDate: p.joiningDate ? p.joiningDate.toISOString() : null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toFaqDTO(f: any): FaqDTO {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
    sortOrder: f.sortOrder,
  };
}
