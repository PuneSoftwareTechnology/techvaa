import "server-only";
import { cache } from "react";
import { faqRepository } from "@/repositories/faq.repository";

export const faqService = {
  getForHomepage: cache(() => faqRepository.findForHomepage()),
  getForCourse: cache((courseId: string) =>
    faqRepository.findForCourse(courseId)
  ),
};
