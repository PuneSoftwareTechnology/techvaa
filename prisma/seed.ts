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

  // ── Courses (5) ─────────────────────────────────────────────────────────────
  // Each course carries its Key Curriculum sections and upcoming batches. These
  // are nested relations, so we strip them off before the course upsert and seed
  // them separately (delete + recreate) to stay idempotent.
  const BATCH_TIMING = "Weekdays 9–11 AM · Weekends 10 AM–12 PM";
  // Deterministic dummy images. picsum.photos is allow-listed in next.config.
  const img = (seed: string, w = 1200, h = 675) =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`;
  const courses = [
    {
      title: "SAP FICO End-to-End Training",
      slug: "sap-fico-end-to-end-training",
      shortDescription: "Master SAP Financial Accounting & Controlling.",
      description:
        "A comprehensive, hands-on SAP FICO program covering GL, AP, AR, Asset Accounting, Cost Center and Profit Center Accounting with real-time scenarios.",
      duration: "8 weeks",
      image: img("techvaa-course-fico", 800, 600),
      isFeatured: true,
      isPublished: true,
      curriculum: [
        { heading: "General Ledger (FI-GL)", description: "Chart of accounts, document types, posting keys and real-time GL postings." },
        { heading: "Accounts Payable & Receivable", description: "Vendor/customer master data, invoicing, payments and dunning." },
        { heading: "Asset Accounting", description: "Asset master data, depreciation runs and asset lifecycle." },
        { heading: "Controlling (CO)", description: "Cost centers, profit centers and internal orders." },
      ],
      batches: [
        { startDate: new Date("2026-07-01T00:00:00Z"), duration: "8 weeks", mode: "Instructor Led Training", timing: BATCH_TIMING, status: "ENROLLMENT_OPEN" as const },
        { startDate: new Date("2026-08-15T00:00:00Z"), duration: "8 weeks", mode: "Classroom", timing: BATCH_TIMING, status: "LIMITED_SEATS" as const },
      ],
    },
    {
      title: "SAP MM (Materials Management)",
      slug: "sap-mm-materials-management",
      shortDescription: "Procure-to-pay, inventory and vendor management.",
      description:
        "Learn SAP MM from procurement and purchasing to inventory management, invoice verification and integration with FI and SD.",
      duration: "6 weeks",
      image: img("techvaa-course-mm", 800, 600),
      isFeatured: true,
      isPublished: true,
      curriculum: [
        { heading: "Procurement Process", description: "Purchase requisitions, RFQs, purchase orders and release strategies." },
        { heading: "Inventory Management", description: "Goods receipt, goods issue, transfer postings and physical inventory." },
        { heading: "Invoice Verification", description: "Three-way match, blocked invoices and FI integration." },
      ],
      batches: [
        { startDate: new Date("2026-07-10T00:00:00Z"), duration: "6 weeks", mode: "Instructor Led Training", timing: BATCH_TIMING, status: "LIMITED_SEATS" as const },
      ],
    },
    {
      title: "SAP ABAP Programming",
      slug: "sap-abap-programming",
      shortDescription: "Build and extend SAP with ABAP.",
      description:
        "From reports and data dictionary to ALV, BAPIs, BDC and OData services — become a job-ready SAP ABAP developer.",
      duration: "10 weeks",
      image: img("techvaa-course-abap", 800, 600),
      isFeatured: false,
      isPublished: true,
      curriculum: [
        { heading: "ABAP Fundamentals", description: "Data types, internal tables, control structures and modularization." },
        { heading: "Data Dictionary & ALV", description: "Tables, views, search helps and ALV report building." },
        { heading: "Interface Programming", description: "BAPIs, BDC, RFCs and OData service creation." },
      ],
      batches: [
        { startDate: new Date("2026-07-20T00:00:00Z"), duration: "10 weeks", mode: "Instructor Led Training", timing: BATCH_TIMING, status: "FILLING_FAST" as const },
      ],
    },
    {
      title: "SAP S/4HANA Simple Finance",
      slug: "sap-s4hana-simple-finance",
      shortDescription: "Next-gen finance on S/4HANA.",
      description:
        "Understand the Universal Journal, migration from ECC, central finance and the new S/4HANA finance capabilities.",
      duration: "7 weeks",
      image: img("techvaa-course-s4hana", 800, 600),
      isFeatured: true,
      isPublished: true,
      curriculum: [
        { heading: "Universal Journal", description: "The ACDOCA table and unified finance data model." },
        { heading: "Migration from ECC", description: "System conversion, data migration and customizing." },
        { heading: "Central Finance", description: "Central Finance architecture and replication." },
      ],
      batches: [
        { startDate: new Date("2026-08-01T00:00:00Z"), duration: "7 weeks", mode: "Instructor Led Training", timing: BATCH_TIMING, status: "ENROLLMENT_OPEN" as const },
      ],
    },
    {
      title: "SAP SD (Sales & Distribution)",
      slug: "sap-sd-sales-distribution",
      shortDescription: "Order-to-cash mastery.",
      description:
        "Cover the full order-to-cash cycle: sales orders, pricing, delivery, billing, and integration with MM and FI.",
      duration: "6 weeks",
      image: img("techvaa-course-sd", 800, 600),
      isFeatured: false,
      isPublished: false,
      curriculum: [
        { heading: "Sales Order Management", description: "Order types, item categories and schedule lines." },
        { heading: "Pricing & Billing", description: "Condition technique, pricing procedures and billing documents." },
      ],
      batches: [],
    },
  ];
  const courseIds: Record<string, string> = {};
  for (const { curriculum, batches, ...c } of courses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    courseIds[c.slug] = course.id;

    // Reseed Key Curriculum (ordered) idempotently.
    await prisma.curriculumItem.deleteMany({ where: { courseId: course.id } });
    if (curriculum.length > 0) {
      await prisma.curriculumItem.createMany({
        data: curriculum.map((item, i) => ({ ...item, courseId: course.id, sortOrder: i })),
      });
    }

    // Reseed upcoming batches idempotently.
    await prisma.courseBatch.deleteMany({ where: { courseId: course.id } });
    if (batches.length > 0) {
      await prisma.courseBatch.createMany({
        data: batches.map((b) => ({ ...b, courseId: course.id })),
      });
    }
  }
  console.log(`   ✓ ${courses.length} courses (with curriculum + batches)`);

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
  // Each blog is fully populated — every content block (primary/secondary/
  // tertiary) with a dummy featured image, block images, bullet points, a
  // conclusion, plus curated `relatedCourses` (by course slug) and
  // `relatedBlogs` (by sibling slug). Relations are connected after the scalar
  // upsert so the script stays idempotent.
  type BlogSeed = {
    title: string;
    slug: string;
    metaDescription: string;
    featuredImage: string;
    introduction: string;
    primaryTitle: string;
    primaryIntro: string;
    primaryText: string;
    secondaryTitle: string;
    secondaryIntro: string;
    secondaryText: string;
    tertiaryTitle: string;
    tertiaryIntro: string;
    tertiaryText: string;
    tertiaryPoints: string[];
    conclusion: string;
    showOnHomepage: boolean;
    isPublished: boolean;
    publishedAt: Date | null;
    relatedCourseSlugs: string[];
    relatedBlogSlugs: string[];
  };
  const blogs: BlogSeed[] = [
    {
      title: "SAP FICO Career Path in 2026",
      slug: "sap-fico-career-path-2026",
      metaDescription:
        "From fresher to lead consultant — a clear, up-to-date roadmap for building a high-growth SAP FICO career in 2026.",
      featuredImage: img("techvaa-blog-fico-career"),
      introduction:
        "<p>SAP FICO remains one of the most in-demand SAP modules in 2026, and the career ladder has never been clearer. Whether you are switching from core finance or starting fresh, this guide maps every step from your first project to a principal consultant role.</p>",
      primaryTitle: "Why FICO still leads the market",
      primaryIntro:
        "<p>Finance is the heartbeat of every ERP rollout, which is why FICO consultants stay in demand cycle after cycle.</p>",
      primaryText:
        "<p>From accounts payable to controlling, FICO touches every financial process in the enterprise. Even as SAP shifts to S/4HANA, the underlying finance know-how transfers directly, protecting your skills from obsolescence.</p>",
      secondaryTitle: "The four-stage career ladder",
      secondaryIntro:
        "<p>Most successful FICO careers move through four predictable stages over six to eight years.</p>",
      secondaryText:
        "<p>Associate consultant, consultant, senior consultant, and finally solution architect or lead. Each stage adds breadth — first configuration, then integration, then design ownership, and finally stakeholder leadership.</p>",
      tertiaryTitle: "Skills that accelerate promotions",
      tertiaryIntro:
        "<p>Beyond core configuration, these adjacent skills are what fast-track a FICO consultant.</p>",
      tertiaryText:
        "<p>Pair deep module knowledge with the capabilities below to stand out in appraisals and interviews.</p>",
      tertiaryPoints: [
        "S/4HANA Universal Journal (ACDOCA) hands-on experience",
        "Cross-module integration with MM and SD",
        "Month-end close automation and reporting",
        "Stakeholder communication and requirement workshops",
      ],
      conclusion:
        "<p>FICO is not just durable — it compounds. Invest in real-time projects early, layer on S/4HANA, and the path from fresher to architect is well within reach.</p>",
      showOnHomepage: true,
      isPublished: true,
      publishedAt: new Date("2026-01-15T09:00:00Z"),
      relatedCourseSlugs: ["sap-fico-end-to-end-training", "sap-s4hana-simple-finance"],
      relatedBlogSlugs: ["is-sap-certification-worth-it", "how-our-students-land-sap-jobs"],
    },
    {
      title: "Top 10 SAP MM Interview Questions",
      slug: "top-10-sap-mm-interview-questions",
      metaDescription:
        "The ten SAP MM interview questions that come up most often — with the framework interviewers actually want to hear.",
      featuredImage: img("techvaa-blog-mm-interview"),
      introduction:
        "<p>Preparing for an SAP MM interview? These are the questions that come up most often, drawn from real hiring panels at top consultancies.</p>",
      primaryTitle: "How interviewers think",
      primaryIntro:
        "<p>Panels test the process end to end, not isolated transaction codes.</p>",
      primaryText:
        "<p>Frame every answer around the procure-to-pay flow and how MM integrates with FI and SD. Demonstrating the bigger picture beats memorising T-codes.</p>",
      secondaryTitle: "Configuration vs. real-time scenarios",
      secondaryIntro:
        "<p>Expect a blend of customizing questions and 'what would you do' scenarios.</p>",
      secondaryText:
        "<p>Be ready to explain release strategies, account determination, and how you debugged a goods-receipt issue in a live project.</p>",
      tertiaryTitle: "The questions you must master",
      tertiaryIntro:
        "<p>Rehearse crisp, structured answers to each of the following.</p>",
      tertiaryText:
        "<p>If you can answer these confidently with examples, you will clear most first rounds.</p>",
      tertiaryPoints: [
        "Explain the procure-to-pay cycle end to end.",
        "What is a release strategy and when is it used?",
        "How does the valuation class link to G/L accounts?",
        "Walk through the three-way match in invoice verification.",
        "How does MM integrate with FI during goods receipt?",
      ],
      conclusion:
        "<p>Practice out loud, anchor answers in real scenarios, and you will walk into the room ready for anything the panel throws at you.</p>",
      showOnHomepage: true,
      isPublished: true,
      publishedAt: new Date("2026-02-02T09:00:00Z"),
      relatedCourseSlugs: ["sap-mm-materials-management"],
      relatedBlogSlugs: ["sap-fico-career-path-2026", "abap-vs-abap-on-hana"],
    },
    {
      title: "ABAP vs. ABAP on HANA: What Changed",
      slug: "abap-vs-abap-on-hana",
      metaDescription:
        "The code-pushdown paradigm explained — how ABAP development changes on S/4HANA and what skills to refresh.",
      featuredImage: img("techvaa-blog-abap-hana"),
      introduction:
        "<p>With S/4HANA, ABAP developers must rethink performance and push logic down to the database. The classic patterns still compile, but they no longer perform.</p>",
      primaryTitle: "Code pushdown in practice",
      primaryIntro:
        "<p>The golden rule: do the heavy lifting where the data lives.</p>",
      primaryText:
        "<p>Instead of looping in the application server, modern ABAP leans on CDS views and AMDP to let HANA crunch large datasets in-memory and return only what you need.</p>",
      secondaryTitle: "CDS views and AMDP",
      secondaryIntro:
        "<p>Two tools define HANA-optimized ABAP.</p>",
      secondaryText:
        "<p>Core Data Services model reusable, semantically rich views; ABAP Managed Database Procedures push complex logic into native SQLScript when a CDS view is not enough.</p>",
      tertiaryTitle: "Refresh this checklist before your next project",
      tertiaryIntro:
        "<p>If you are moving from ECC to S/4HANA, brush up on the following.</p>",
      tertiaryText:
        "<p>Each item maps to a common review comment in HANA migration projects.</p>",
      tertiaryPoints: [
        "Replace nested SELECTs with CDS view associations",
        "Use AMDP for set-based, performance-critical logic",
        "Avoid SELECT * and minimise data transfer to the app server",
        "Adopt the RESTful ABAP Programming Model (RAP) for new apps",
      ],
      conclusion:
        "<p>ABAP is not going away — it is getting closer to the data. Master pushdown and you become far more valuable on every S/4HANA programme.</p>",
      showOnHomepage: true,
      isPublished: true,
      publishedAt: new Date("2026-03-10T09:00:00Z"),
      relatedCourseSlugs: ["sap-abap-programming"],
      relatedBlogSlugs: ["top-10-sap-mm-interview-questions", "is-sap-certification-worth-it"],
    },
    {
      title: "Is SAP Certification Worth It?",
      slug: "is-sap-certification-worth-it",
      metaDescription:
        "We break down the real ROI of SAP certification — cost, salary impact, and when it actually moves the needle.",
      featuredImage: img("techvaa-blog-certification"),
      introduction:
        "<p>SAP certification can accelerate your career, but is it right for you? The honest answer depends on where you are and what you want next.</p>",
      primaryTitle: "What certification actually signals",
      primaryIntro:
        "<p>A badge proves baseline knowledge — it does not replace project experience.</p>",
      primaryText:
        "<p>For freshers, certification opens doors that experience has not yet earned. For experienced consultants, it validates a module switch or a move to S/4HANA.</p>",
      secondaryTitle: "Cost vs. return",
      secondaryIntro:
        "<p>Weigh the exam fee and prep time against the roles it unlocks.</p>",
      secondaryText:
        "<p>In most markets, certified freshers see faster shortlisting and a measurable bump in starting offers, typically recovering the cost within the first few months.</p>",
      tertiaryTitle: "Certification is worth it when…",
      tertiaryIntro:
        "<p>Use this quick test to decide.</p>",
      tertiaryText:
        "<p>If two or more of these are true for you, the investment usually pays off.</p>",
      tertiaryPoints: [
        "You are entering SAP with no prior project experience",
        "You are switching modules or to S/4HANA",
        "Your target employers explicitly list it as preferred",
        "You learn better with a structured, exam-driven goal",
      ],
      conclusion:
        "<p>For most early-career consultants, the answer is a qualified yes — pair the certificate with hands-on project work and it becomes a genuine accelerator.</p>",
      showOnHomepage: false,
      isPublished: true,
      publishedAt: new Date("2026-04-05T09:00:00Z"),
      relatedCourseSlugs: ["sap-fico-end-to-end-training"],
      relatedBlogSlugs: ["sap-fico-career-path-2026", "how-our-students-land-sap-jobs"],
    },
    {
      title: "How Our Students Land SAP Jobs",
      slug: "how-our-students-land-sap-jobs",
      metaDescription:
        "Inside the Techvaa placement process — from mock interviews to offer letters, the system behind our outcomes.",
      featuredImage: img("techvaa-blog-placements"),
      introduction:
        "<p>Placements are the heart of what we do. Here's how the process works — and why it consistently turns trainees into hired consultants.</p>",
      primaryTitle: "It starts on day one",
      primaryIntro:
        "<p>Career prep is woven into the course, not bolted on at the end.</p>",
      primaryText:
        "<p>From the first week, every project is framed as portfolio material, and trainers coach you to articulate what you built and why.</p>",
      secondaryTitle: "Mock interviews and resume clinics",
      secondaryIntro:
        "<p>Repetition under realistic pressure is what builds confidence.</p>",
      secondaryText:
        "<p>Each learner goes through multiple mock interviews with working consultants and one-on-one resume reviews tuned to the roles they are targeting.</p>",
      tertiaryTitle: "The placement playbook",
      tertiaryIntro:
        "<p>Here is the repeatable system behind our outcomes.</p>",
      tertiaryText:
        "<p>Follow it end to end and the offer is usually a matter of when, not if.</p>",
      tertiaryPoints: [
        "Project-based portfolio built throughout the course",
        "Weekly mock interviews with real consultants",
        "Resume and LinkedIn optimisation clinics",
        "Direct referrals to our hiring partner network",
      ],
      conclusion:
        "<p>Skill plus structured preparation plus our partner network is the formula. Show up, do the work, and the placements follow.</p>",
      showOnHomepage: false,
      isPublished: true,
      publishedAt: new Date("2026-05-08T09:00:00Z"),
      relatedCourseSlugs: ["sap-fico-end-to-end-training", "sap-mm-materials-management"],
      relatedBlogSlugs: ["sap-fico-career-path-2026", "is-sap-certification-worth-it"],
    },
  ];
  // Pass 1: upsert scalar fields and capture ids by slug.
  const blogIds: Record<string, string> = {};
  for (const { relatedCourseSlugs, relatedBlogSlugs, ...b } of blogs) {
    const blog = await prisma.blog.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
    blogIds[b.slug] = blog.id;
  }
  // Pass 2: wire up curated relations now that every blog exists. `set`
  // replaces the link set, keeping the seed idempotent on re-run.
  for (const b of blogs) {
    await prisma.blog.update({
      where: { slug: b.slug },
      data: {
        relatedCourses: {
          set: b.relatedCourseSlugs
            .filter((s) => courseIds[s])
            .map((s) => ({ id: courseIds[s] })),
        },
        relatedBlogs: {
          set: b.relatedBlogSlugs
            .filter((s) => blogIds[s])
            .map((s) => ({ id: blogIds[s] })),
        },
      },
    });
  }
  console.log(`   ✓ ${blogs.length} blogs (with content blocks, images & relations)`);

  // Attach SEO metadata to the FICO career blog (demonstrates Blog 1:1 SEO).
  await prisma.seoMetadata.upsert({
    where: { blogId: blogIds["sap-fico-career-path-2026"] },
    update: {},
    create: {
      blogId: blogIds["sap-fico-career-path-2026"],
      metaTitle: "SAP FICO Career Path in 2026 — Full Roadmap | Techvaa",
      metaDescription:
        "A clear, up-to-date roadmap for building a high-growth SAP FICO career in 2026, from fresher to lead consultant.",
      canonicalUrl: "https://techvaa.com/blog/sap-fico-career-path-2026",
      keywords: ["SAP FICO career", "SAP FICO jobs", "SAP finance career path"],
      ogImage: img("techvaa-blog-fico-career"),
      robots: "INDEX_FOLLOW",
      schemaMarkup: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "SAP FICO Career Path in 2026",
        publisher: { "@type": "Organization", name: "Techvaa" },
      },
    },
  });
  console.log(`   ✓ blog SEO metadata`);

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
