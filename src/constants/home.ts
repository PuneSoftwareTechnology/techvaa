/**
 * Static, editorial content for the home page that does not live in the CMS
 * (feature highlights, trust stats, demo sessions).
 * Course/blog/review content — including upcoming batches — comes from the DB
 * via the data layer.
 */

export const WHY_CHOOSE = [
  {
    icon: "award",
    title: "Certified Mentors",
    description: "Learn from SAP-certified consultants with 10+ years of real industry experience.",
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    icon: "monitor-play",
    title: "Live Projects",
    description: "Real-time server access and case studies that mirror actual enterprise rollouts.",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: "calendar-clock",
    title: "Flexible Learning",
    description: "Virtual and classroom sessions with lifetime access to recordings.",
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    icon: "briefcase",
    title: "Job Placement",
    description: "Dedicated career services and a hiring-partner network to get you placed.",
    iconClass: "bg-violet-100 text-violet-600",
  },
] as const;

export const TRUST_STATS = [
  { value: "98%", label: "Certification Success Rate" },
  { value: "24/7", label: "S/4HANA Server Access" },
  { value: "500+", label: "Candidates Placed" },
  { value: "4.9/5", label: "Average Student Rating" },
] as const;

export const HERO_HIGHLIGHTS = [
  "Comprehensive SAP training with live Projects",
  "100% placement support & career services",
  "Real-time S/4HANA server access",
] as const;
