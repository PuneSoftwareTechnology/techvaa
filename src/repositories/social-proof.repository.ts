import "server-only";
import { prisma } from "@/lib/prisma";
import {
  toPlacementDTO,
  toReviewDTO,
  toTestimonialDTO,
} from "./mappers";
import type { PlacementDTO, ReviewDTO, TestimonialDTO } from "@/types";

const PUBLISHED = { isPublished: true, deletedAt: null } as const;

export const reviewRepository = {
  async findPublished(take?: number): Promise<ReviewDTO[]> {
    const rows = await prisma.review.findMany({
      where: PUBLISHED,
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take,
    });
    return rows.map(toReviewDTO);
  },
};

export const testimonialRepository = {
  /** Testimonials flagged to appear in the homepage success-stories section. */
  async findForHomepage(take?: number): Promise<TestimonialDTO[]> {
    const rows = await prisma.testimonial.findMany({
      where: { ...PUBLISHED, showOnHomepage: true },
      orderBy: { createdAt: "desc" },
      take,
    });
    return rows.map(toTestimonialDTO);
  },

  /** Testimonials attached to a specific course. */
  async findForCourse(courseId: string, take?: number): Promise<TestimonialDTO[]> {
    const rows = await prisma.testimonial.findMany({
      where: { ...PUBLISHED, courses: { some: { id: courseId } } },
      orderBy: { createdAt: "desc" },
      take,
    });
    return rows.map(toTestimonialDTO);
  },
};

export const placementRepository = {
  async findPublished(take?: number): Promise<PlacementDTO[]> {
    const rows = await prisma.placement.findMany({
      where: PUBLISHED,
      orderBy: { joiningDate: "desc" },
      take,
    });
    return rows.map(toPlacementDTO);
  },

  /**
   * Placements picked for a course page's "Recently Placed Students" section:
   * tagged to the course AND flagged `showOnCoursePage` in the admin.
   */
  async findForCourse(courseId: string, take?: number): Promise<PlacementDTO[]> {
    const rows = await prisma.placement.findMany({
      where: {
        ...PUBLISHED,
        showOnCoursePage: true,
        courses: { some: { id: courseId } },
      },
      orderBy: [{ joiningDate: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
      take,
    });
    return rows.map(toPlacementDTO);
  },
};
