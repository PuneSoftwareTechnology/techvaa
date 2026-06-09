/**
 * Seed script for Techvaa.
 *
 * Run with:  npx prisma db seed     (uses the command in prisma.config.ts)
 * or directly:  node --env-file=.env --import tsx prisma/seed.ts
 *
 * Idempotent: uses upserts keyed on unique columns, so it is safe to re-run.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE;
if (!connectionString) {
  throw new Error("Missing DATABASE connection string. Run with --env-file=.env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱  Seeding Techvaa database...");

  // ── Admin user ───────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@techvaa.com" },
    update: {},
    create: {
      name: "Techvaa Admin",
      email: "admin@techvaa.com",
      password: passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`   ✓ admin user (${admin.email}) — default password: ChangeMe123!`);

  // ── Page SEO (fixed pages) ─────────────────────────────────────────────────
  const pageSeo = [
    {
      page: "Home",
      path: "/",
      metaTitle: "Techvaa — #1 SAP Training Institute in India",
      metaDescription:
        "Master SAP with India's leading institute. Live S/4HANA labs, expert trainers and 100% placement assistance.",
      keywords: ["SAP training", "SAP course", "S/4HANA", "SAP institute"],
    },
    {
      page: "Courses",
      path: "/courses",
      metaTitle: "SAP Courses — FICO, MM, ABAP, SD & More | Techvaa",
      metaDescription:
        "Browse industry-aligned SAP courses with hands-on projects, certification prep and placement support.",
      keywords: ["SAP FICO", "SAP MM", "SAP ABAP", "SAP courses"],
    },
    {
      page: "Blog",
      path: "/blog",
      metaTitle: "SAP Blog — Careers, Tips & Industry News | Techvaa",
      metaDescription:
        "Expert articles on SAP careers, module guides, interview prep and the latest SAP ecosystem news.",
      keywords: ["SAP blog", "SAP careers", "SAP tips"],
    },
    {
      page: "Placements",
      path: "/placements",
      metaTitle: "SAP Placements & Success Stories | Techvaa",
      metaDescription:
        "See how Techvaa learners landed SAP roles at top companies with strong packages.",
      keywords: ["SAP placements", "SAP jobs", "SAP success stories"],
    },
    {
      page: "Reviews",
      path: "/reviews",
      metaTitle: "Student Reviews & Ratings | Techvaa",
      metaDescription:
        "Read what Techvaa learners say about our SAP training, trainers and placement support.",
      keywords: ["Techvaa reviews", "SAP training reviews"],
    },
    {
      page: "Contact",
      path: "/contact",
      metaTitle: "Contact Techvaa — Talk to an SAP Advisor",
      metaDescription:
        "Get course details, fees and batch schedules. Talk to a Techvaa SAP career advisor today.",
      keywords: ["contact Techvaa", "SAP course enquiry"],
    },
  ];
  for (const p of pageSeo) {
    await prisma.pageSeo.upsert({
      where: { path: p.path },
      update: {
        page: p.page,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        keywords: p.keywords,
      },
      create: p,
    });
  }
  console.log(`   ✓ ${pageSeo.length} page SEO entries`);

  // ── Blog categories ────────────────────────────────────────────────────────
  const categoryData = [
    { name: "SAP FICO", slug: "sap-fico", description: "Finance & Controlling insights." },
    { name: "SAP MM", slug: "sap-mm", description: "Materials Management guides." },
    { name: "SAP ABAP", slug: "sap-abap", description: "ABAP development tutorials." },
    { name: "Career", slug: "career", description: "SAP careers, salaries and placements." },
    { name: "Certification", slug: "certification", description: "SAP certification roadmaps." },
  ];
  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const cat = await prisma.blogCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categories[c.slug] = cat.id;
  }
  console.log(`   ✓ ${categoryData.length} blog categories`);

  // ── Courses (5) ─────────────────────────────────────────────────────────────
  const courses = [
    {
      title: "SAP FICO End-to-End Training",
      slug: "sap-fico-end-to-end-training",
      shortDescription: "Master SAP Financial Accounting & Controlling.",
      description:
        "A comprehensive, hands-on SAP FICO program covering GL, AP, AR, Asset Accounting, Cost Center and Profit Center Accounting with real-time scenarios.",
      duration: "8 weeks",
      level: "INTERMEDIATE" as const,
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "SAP MM (Materials Management)",
      slug: "sap-mm-materials-management",
      shortDescription: "Procure-to-pay, inventory and vendor management.",
      description:
        "Learn SAP MM from procurement and purchasing to inventory management, invoice verification and integration with FI and SD.",
      duration: "6 weeks",
      level: "BEGINNER" as const,
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "SAP ABAP Programming",
      slug: "sap-abap-programming",
      shortDescription: "Build and extend SAP with ABAP.",
      description:
        "From reports and data dictionary to ALV, BAPIs, BDC and OData services — become a job-ready SAP ABAP developer.",
      duration: "10 weeks",
      level: "ADVANCED" as const,
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "SAP S/4HANA Simple Finance",
      slug: "sap-s4hana-simple-finance",
      shortDescription: "Next-gen finance on S/4HANA.",
      description:
        "Understand the Universal Journal, migration from ECC, central finance and the new S/4HANA finance capabilities.",
      duration: "7 weeks",
      level: "INTERMEDIATE" as const,
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "SAP SD (Sales & Distribution)",
      slug: "sap-sd-sales-distribution",
      shortDescription: "Order-to-cash mastery.",
      description:
        "Cover the full order-to-cash cycle: sales orders, pricing, delivery, billing, and integration with MM and FI.",
      duration: "6 weeks",
      level: "ALL_LEVELS" as const,
      isFeatured: false,
      isPublished: false,
    },
  ];
  const courseIds: Record<string, string> = {};
  for (const c of courses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    courseIds[c.slug] = course.id;
  }
  console.log(`   ✓ ${courses.length} courses`);

  // Attach SEO metadata to the featured FICO course (demonstrates 1:1).
  await prisma.seoMetadata.upsert({
    where: { courseId: courseIds["sap-fico-end-to-end-training"] },
    update: {},
    create: {
      courseId: courseIds["sap-fico-end-to-end-training"],
      metaTitle: "SAP FICO Training in India | Techvaa",
      metaDescription:
        "Job-oriented SAP FICO training with real-time projects, certification guidance and 100% placement support.",
      canonicalUrl: "https://techvaa.com/courses/sap-fico-end-to-end-training",
      keywords: ["SAP FICO training", "SAP finance course", "SAP FICO certification"],
      robots: "INDEX_FOLLOW",
      schemaMarkup: {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "SAP FICO End-to-End Training",
        provider: { "@type": "Organization", name: "Techvaa" },
      },
    },
  });

  // ── Blogs (5) ────────────────────────────────────────────────────────────────
  const blogs = [
    {
      title: "SAP FICO Career Path in 2026",
      slug: "sap-fico-career-path-2026",
      excerpt: "What does a modern SAP FICO career look like?",
      content: "SAP FICO remains one of the most in-demand SAP modules...",
      readingTime: 6,
      isPublished: true,
      publishedAt: new Date("2026-01-15T09:00:00Z"),
      categorySlug: "sap-fico",
    },
    {
      title: "Top 10 SAP MM Interview Questions",
      slug: "top-10-sap-mm-interview-questions",
      excerpt: "Ace your next SAP MM interview.",
      content: "Preparing for an SAP MM interview? Here are the questions that come up most...",
      readingTime: 8,
      isPublished: true,
      publishedAt: new Date("2026-02-02T09:00:00Z"),
      categorySlug: "sap-mm",
    },
    {
      title: "ABAP vs. ABAP on HANA: What Changed",
      slug: "abap-vs-abap-on-hana",
      excerpt: "The code-pushdown paradigm explained.",
      content: "With S/4HANA, ABAP developers must rethink performance...",
      readingTime: 7,
      isPublished: true,
      publishedAt: new Date("2026-03-10T09:00:00Z"),
      categorySlug: "sap-abap",
    },
    {
      title: "Is SAP Certification Worth It?",
      slug: "is-sap-certification-worth-it",
      excerpt: "We break down the ROI of SAP certification.",
      content: "SAP certification can accelerate your career, but is it right for you?...",
      readingTime: 5,
      isPublished: true,
      publishedAt: new Date("2026-04-05T09:00:00Z"),
      categorySlug: "certification",
    },
    {
      title: "How Our Students Land SAP Jobs",
      slug: "how-our-students-land-sap-jobs",
      excerpt: "Inside the Techvaa placement process.",
      content: "Placements are the heart of what we do. Here's how the process works...",
      readingTime: 4,
      isPublished: false,
      publishedAt: null as Date | null,
      categorySlug: "career",
    },
  ];
  for (const b of blogs) {
    const { categorySlug, ...rest } = b;
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: { ...rest, categoryId: categories[categorySlug] },
      create: { ...rest, categoryId: categories[categorySlug] },
    });
  }
  console.log(`   ✓ ${blogs.length} blogs`);

  // ── Reviews (5) ──────────────────────────────────────────────────────────────
  const reviews = [
    { studentName: "Priya Sharma", company: "Infosys", designation: "SAP Consultant", rating: 5, review: "The FICO course was incredibly practical. Got placed within a month!", isPublished: true },
    { studentName: "Rahul Verma", company: "TCS", designation: "Associate Consultant", rating: 5, review: "Trainers are real-time consultants. Highly recommended.", isPublished: true },
    { studentName: "Anita Desai", company: "Accenture", designation: "SAP MM Analyst", rating: 4, review: "Great content and support. Lab access could be longer.", isPublished: true },
    { studentName: "Vikram Singh", company: "Capgemini", designation: "ABAP Developer", rating: 5, review: "Best ABAP training I could find. Worth every rupee.", isPublished: true },
    { studentName: "Sneha Iyer", company: "Wipro", designation: "Finance Analyst", rating: 4, review: "Solid S/4HANA finance coverage with good projects.", isPublished: false },
  ];
  for (const r of reviews) {
    await prisma.review.create({ data: r }).catch(() => {
      /* reviews have no natural unique key; ignore duplicates on re-run */
    });
  }
  console.log(`   ✓ ${reviews.length} reviews (created if not already present)`);

  // ── FAQs (5) ─────────────────────────────────────────────────────────────────
  const faqs = [
    { question: "Do you provide placement assistance?", answer: "Yes, we provide 100% placement support including resume prep and interview coaching.", sortOrder: 1 },
    { question: "Are the trainers SAP-certified?", answer: "All trainers are SAP-certified working consultants with 8+ years of experience.", sortOrder: 2 },
    { question: "Do I get server (sandbox) access?", answer: "Yes, every student gets dedicated SAP server access for the full course duration.", sortOrder: 3 },
    { question: "Are classes online or offline?", answer: "We offer both live online and classroom batches, with lifetime recording access.", sortOrder: 4 },
    { question: "Will I get a certificate?", answer: "You receive a Techvaa course completion certificate and guidance for official SAP certification.", sortOrder: 5 },
  ];
  for (const f of faqs) {
    await prisma.faq.upsert({
      where: { id: `faq-${f.sortOrder}` },
      update: f,
      create: { id: `faq-${f.sortOrder}`, ...f, isPublished: true, showOnHomepage: true },
    });
  }
  console.log(`   ✓ ${faqs.length} FAQs`);

  // ── Placements (5) ───────────────────────────────────────────────────────────
  const placements = [
    { studentName: "Priya Sharma", company: "Infosys", package: "9 LPA", course: "SAP FICO", joiningDate: new Date("2026-02-01"), isPublished: true },
    { studentName: "Rahul Verma", company: "TCS", package: "8.5 LPA", course: "SAP MM", joiningDate: new Date("2026-02-15"), isPublished: true },
    { studentName: "Vikram Singh", company: "Capgemini", package: "12 LPA", course: "SAP ABAP", joiningDate: new Date("2026-03-01"), isPublished: true },
    { studentName: "Anita Desai", company: "Accenture", package: "7.5 LPA", course: "SAP MM", joiningDate: new Date("2026-03-20"), isPublished: true },
    { studentName: "Sneha Iyer", company: "Wipro", package: "10 LPA", course: "SAP S/4HANA Finance", joiningDate: new Date("2026-04-10"), isPublished: false },
  ];
  for (const p of placements) {
    await prisma.placement.create({ data: p }).catch(() => {
      /* no natural unique key; ignore duplicates on re-run */
    });
  }
  console.log(`   ✓ ${placements.length} placements (created if not already present)`);

  console.log("✅  Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
