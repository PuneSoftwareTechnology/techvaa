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
    image: c.image ?? null,
    isFeatured: c.isFeatured,
    createdAt: c.createdAt.toISOString(),
    curriculum: Array.isArray(c.curriculum)
      ? c.curriculum.map((i: any) => ({
          id: i.id,
          heading: i.heading,
          description: i.description,
        }))
      : [],
    batches: Array.isArray(c.batches)
      ? c.batches.map((b: any) => ({
          id: b.id,
          startDate: b.startDate.toISOString(),
          duration: b.duration,
          mode: b.mode ?? null,
          isOpen: b.isOpen,
        }))
      : [],
    relatedCourses: Array.isArray(c.relatedCourses)
      ? c.relatedCourses.map((r: any) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          image: r.image ?? null,
          shortDescription: r.shortDescription ?? null,
          isFeatured: r.isFeatured ?? false,
        }))
      : [],
    seo: toSeoDTO(c.seo ?? null),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toBlogDTO(b: any): BlogDTO {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    metaDescription: b.metaDescription ?? null,
    featuredImage: b.featuredImage ?? null,
    introduction: b.introduction,
    primary: {
      title: b.primaryTitle ?? null,
      intro: b.primaryIntro ?? null,
      image: b.primaryImage ?? null,
      text: b.primaryText ?? null,
      points: [],
    },
    secondary: {
      title: b.secondaryTitle ?? null,
      intro: b.secondaryIntro ?? null,
      image: b.secondaryImage ?? null,
      text: b.secondaryText ?? null,
      points: [],
    },
    tertiary: {
      title: b.tertiaryTitle ?? null,
      intro: b.tertiaryIntro ?? null,
      image: b.tertiaryImage ?? null,
      text: b.tertiaryText ?? null,
      points: b.tertiaryPoints ?? [],
    },
    conclusion: b.conclusion ?? null,
    showOnHomepage: b.showOnHomepage ?? false,
    publishedAt: b.publishedAt ? b.publishedAt.toISOString() : null,
    relatedCourse: b.relatedCourse
      ? {
          id: b.relatedCourse.id,
          title: b.relatedCourse.title,
          slug: b.relatedCourse.slug,
          image: b.relatedCourse.image ?? null,
        }
      : null,
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
