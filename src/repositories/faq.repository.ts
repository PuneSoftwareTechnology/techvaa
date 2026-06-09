import "server-only";
import { prisma } from "@/lib/prisma";
import { toFaqDTO } from "./mappers";
import type { FaqDTO } from "@/types";

const PUBLISHED = { isPublished: true, deletedAt: null } as const;

export const faqRepository = {
  /** FAQs flagged to appear in the homepage FAQ section. */
  async findForHomepage(): Promise<FaqDTO[]> {
    const rows = await prisma.faq.findMany({
      where: { ...PUBLISHED, showOnHomepage: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(toFaqDTO);
  },

  /** FAQs attached to a specific course. */
  async findForCourse(courseId: string): Promise<FaqDTO[]> {
    const rows = await prisma.faq.findMany({
      where: { ...PUBLISHED, courses: { some: { id: courseId } } },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(toFaqDTO);
  },
};
