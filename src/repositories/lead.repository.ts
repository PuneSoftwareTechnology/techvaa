import "server-only";
import { prisma } from "@/lib/prisma";
import type { LeadInput } from "@/validations/lead";

export const leadRepository = {
  async create(data: LeadInput) {
    return prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message || null,
        courseInterest: data.courseInterest || null,
      },
      select: { id: true },
    });
  },
};
