/**
 * Domain DTOs — the shape the UI consumes.
 *
 * These are deliberately decoupled from Prisma models: prices are plain
 * `number`s (not Decimal) and dates are ISO strings, so every DTO is safely
 * serializable across the Server/Client Component boundary.
 */

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

/** A course's related-course link, slimmed for the detail page. */
export interface RelatedCourseDTO {
  id: string;
  title: string;
  slug: string;
  image: string | null;
}

/** One Key Curriculum section — heading + description. */
export interface CurriculumItemDTO {
  id: string;
  heading: string;
  description: string;
}

/** An upcoming batch for a course (the "New Batch Schedule" row). */
export interface CourseBatchDTO {
  id: string;
  startDate: string;
  duration: string;
  mode: string | null;
  isOpen: boolean;
}

export interface CourseDTO {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  duration: string | null;
  image: string | null;
  isFeatured: boolean;
  createdAt: string;
  /** Key Curriculum sections, ordered. Populated on the detail query. */
  curriculum: CurriculumItemDTO[];
  /** Upcoming batches, soonest first. Populated on the detail query. */
  batches: CourseBatchDTO[];
  /** Curated related courses (only populated on the detail query). */
  relatedCourses: RelatedCourseDTO[];
  seo: SeoDTO | null;
}

/** One templated content block (primary/secondary/tertiary) of a blog. */
export interface BlogContentBlockDTO {
  title: string | null;
  intro: string | null;
  image: string | null;
  text: string | null;
  points: string[];
}

/** A blog's related-course link, slimmed for the UI. */
export interface BlogRelatedCourseDTO {
  id: string;
  title: string;
  slug: string;
  image: string | null;
}

export interface BlogDTO {
  id: string;
  title: string;
  slug: string;
  metaDescription: string | null;
  featuredImage: string | null;
  introduction: string;
  primary: BlogContentBlockDTO;
  secondary: BlogContentBlockDTO;
  tertiary: BlogContentBlockDTO;
  conclusion: string | null;
  showOnHomepage: boolean;
  publishedAt: string | null;
  relatedCourse: BlogRelatedCourseDTO | null;
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
