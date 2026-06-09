/**
 * Static, editorial content for the home page that does not live in the CMS
 * (feature highlights, trust stats, upcoming batch schedule, demo sessions).
 * Course/blog/review content still comes from the DB via the data layer.
 */

export const WHY_CHOOSE = [
  {
    icon: "award",
    title: "Certified Mentors",
    description: "Learn from SAP-certified consultants with 10+ years of real industry experience.",
  },
  {
    icon: "monitor-play",
    title: "Live Projects",
    description: "Real-time server access and case studies that mirror actual enterprise rollouts.",
  },
  {
    icon: "calendar-clock",
    title: "Flexible Learning",
    description: "Virtual and classroom sessions with lifetime access to recordings.",
  },
  {
    icon: "briefcase",
    title: "Job Placement",
    description: "Dedicated career services and a hiring-partner network to get you placed.",
  },
] as const;

export const TRUST_STATS = [
  { value: "98%", label: "Certification Success Rate" },
  { value: "24/7", label: "S/4HANA Server Access" },
  { value: "500+", label: "Candidates Placed" },
  { value: "4.9/5", label: "Average Student Rating" },
] as const;

export type BatchStatus = "Enrollment Open" | "Limited Seats" | "Filling Fast";

export interface UpcomingBatch {
  courseSlug: string;
  module: string;
  mode: "Live Online" | "Classroom" | "Self-Paced";
  startDate: string; // ISO
  timing: string;
  status: BatchStatus;
}

export const UPCOMING_BATCHES: UpcomingBatch[] = [
  {
    courseSlug: "sap-fico-end-to-end-training",
    module: "SAP S/4HANA Finance (FICO)",
    mode: "Live Online",
    startDate: "2026-07-01",
    timing: "Weekdays 9–11 AM · Weekends 10 AM–12 PM",
    status: "Enrollment Open",
  },
  {
    courseSlug: "sap-mm-materials-management",
    module: "SAP MM (Materials Management)",
    mode: "Classroom",
    startDate: "2026-07-08",
    timing: "Weekdays 9–11 AM · Weekends 10 AM–12 PM",
    status: "Limited Seats",
  },
  {
    courseSlug: "sap-abap-programming",
    module: "SAP ABAP (Programming)",
    mode: "Classroom",
    startDate: "2026-07-15",
    timing: "Weekdays 9–11 AM · Weekends 10 AM–12 PM",
    status: "Filling Fast",
  },
  {
    courseSlug: "sap-sd-sales-distribution",
    module: "SAP S/4HANA Sales (SD)",
    mode: "Self-Paced",
    startDate: "2026-07-22",
    timing: "Weekdays 9–11 AM · Weekends 10 AM–12 PM",
    status: "Enrollment Open",
  },
] as const;

export const DEMO_SESSIONS = [
  { title: "Free Demo: Intro to S/4HANA Finance", date: "Every Saturday · 11 AM EST" },
  { title: "Free Demo: SAP MM Procure-to-Pay", date: "Every Sunday · 11 AM EST" },
] as const;

export const HERO_HIGHLIGHTS = [
  "Comprehensive SAP training with live Projects",
  "100% placement support & career services",
  "Real-time S/4HANA server access",
] as const;
