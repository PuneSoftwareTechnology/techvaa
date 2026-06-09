import "server-only";
import { courseEnquiryRepository } from "@/repositories/course-enquiry.repository";
import type { CourseEnquiryInput } from "@/validations/course-enquiry";

export const courseEnquiryService = {
  async submit(data: CourseEnquiryInput) {
    return courseEnquiryRepository.create(data);
  },
};
