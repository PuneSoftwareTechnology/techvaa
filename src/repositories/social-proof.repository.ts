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
  async findPublished(take?: number): Promise<TestimonialDTO[]> {
    const rows = await prisma.testimonial.findMany({
      where: PUBLISHED,
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
};
