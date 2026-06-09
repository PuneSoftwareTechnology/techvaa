/**
 * Domain DTOs — the shape the UI consumes.
 *
 * These are deliberately decoupled from Prisma models: prices are plain
 * `number`s (not Decimal) and dates are ISO strings, so every DTO is safely
 * serializable across the Server/Client Component boundary.
 */

export type CourseLevel =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "ALL_LEVELS";

export interface SeoDTO {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  keywords: string[];
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  robots: string;
  schemaMarkup: unknown | null;
}

export interface CourseDTO {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  duration: string | null;
  level: CourseLevel;
  image: string | null;
  isFeatured: boolean;
  createdAt: string;
  seo: SeoDTO | null;
}

export interface BlogCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  readingTime: number | null;
  publishedAt: string | null;
  category: BlogCategoryDTO;
  seo: SeoDTO | null;
}

export interface ReviewDTO {
  id: string;
  studentName: string;
  company: string | null;
  designation: string | null;
  rating: number;
  review: string;
  image: string | null;
  createdAt: string;
}

export interface TestimonialDTO {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  message: string;
  image: string | null;
  videoUrl: string | null;
}

export interface PlacementDTO {
  id: string;
  studentName: string;
  company: string;
  package: string | null;
  course: string | null;
  image: string | null;
  linkedinUrl: string | null;
  joiningDate: string | null;
}

export interface FaqDTO {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

/** Aggregate rating computed from published reviews — drives Review schema. */
export interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
