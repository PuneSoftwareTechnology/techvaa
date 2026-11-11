import "server-only";
import { cached } from "@/lib/data-cache";
import { faqRepository } from "@/repositories/faq.repository";

export const faqService = {
  getForHomepage: cached("faq.getForHomepage", () => faqRepository.findForHomepage()),
  getForCourse: cached("faq.getForCourse", (courseId: string) =>
    faqRepository.findForCourse(courseId)
  ),
};
