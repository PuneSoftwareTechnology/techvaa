/** Static editorial content for the Placement Services page. */

import { HIRING_PARTNERS } from "@/constants/site";

export const CAREER_TOOLS = [
  {
    icon: "file-text",
    title: "Professional Resume Building",
    description: "ATS-friendly, consultant-grade resumes that get shortlisted.",
  },
  {
    icon: "mic",
    title: "Mock Interview Workshops",
    description: "Domain and HR mock interviews with real-time consultant feedback.",
  },
  {
    icon: "users",
    title: "One-on-One Mentorship",
    description: "A dedicated mentor to guide your job search end to end.",
  },
] as const;

export const PLACEMENT_PROCESS = [
  { icon: "book-open", step: "Training", description: "Theory + practical on live S/4HANA systems." },
  { icon: "file-text", step: "CV Writing & Upload", description: "Build and publish a standout SAP resume." },
  { icon: "search", step: "Interview Preparation", description: "Question banks, scenarios and mock drills." },
  { icon: "monitor-play", step: "Mock Interview", description: "Panel-style interviews with feedback." },
  { icon: "award", step: "Certification Guidance", description: "Roadmap to official SAP certification." },
  { icon: "briefcase", step: "Job Search & Interview", description: "Referrals to hiring partners and follow-through." },
] as const;

export const PLACEMENT_GUARANTEE = [
  "Training",
  "Placement Training",
  "Professional Support",
  "Final Job Offer",
] as const;

/**
 * Alumni hiring partners shown in the placements grid. Shares the single
 * canonical partner list with the home marquee (see HIRING_PARTNERS).
 */
export const ALUMNI_PARTNERS = HIRING_PARTNERS;
