import "server-only";
import { prisma } from "@/lib/prisma";
import type { CourseEnquiryInput } from "@/validations/course-enquiry";

export const courseEnquiryRepository = {
  async create(data: CourseEnquiryInput) {
    return prisma.courseEnquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        course: data.course,
        message: data.message || null,
      },
      select: { id: true },
    });
  },
};
