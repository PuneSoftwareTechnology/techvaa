import "server-only";
import { leadRepository } from "@/repositories/lead.repository";
import type { LeadInput } from "@/validations/lead";

export const leadService = {
  async submit(data: LeadInput) {
    return leadRepository.create(data);
  },
};
