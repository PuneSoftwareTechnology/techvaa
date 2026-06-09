/**
 * Editorial scaffolding for course detail pages (curriculum highlights and the
 * outcomes/stats band). These are presentation defaults; the course title,
 * description, price and SEO come from the CMS via the data layer.
 */

export const CURRICULUM_HIGHLIGHTS = [
  {
    title: "General Ledger (GL) & Financial Statements",
    description: "Master the universal journal, document splitting and financial close.",
  },
  {
    title: "Accounts Payable (AP) & Receivable (AR)",
    description: "Vendor and customer accounting, payments, dunning and reconciliation.",
  },
  {
    title: "Asset Accounting (AA) & Bank Accounting",
    description: "Asset lifecycle, depreciation runs and bank communication management.",
  },
  {
    title: "Cost Center & Profit Center Accounting",
    description: "Overhead controlling, allocations and profitability segments.",
  },
  {
    title: "Controlling (CO-PA) Profitability Analysis",
    description: "Account- and costing-based CO-PA for margin reporting.",
  },
  {
    title: "Tax Accounting",
    description: "Configure input/output tax, withholding tax and statutory reporting.",
  },
] as const;

export const COURSE_OUTCOME_STATS = [
  { icon: "shield-check", value: "99%", label: "Course Completion Rate" },
  { icon: "monitor-play", value: "Live", label: "Real-World Project Experience" },
  { icon: "users", value: "Certified", label: "Industry-Recognized Mentors" },
  { icon: "briefcase", value: "100%", label: "Placement Support" },
] as const;
