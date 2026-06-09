You are a Staff+ Frontend Engineer, SEO Architect, and UI/UX Expert.

Build a production-grade, enterprise-quality SAP Training Institute website named "Techvaa" based on the attached screenshots.

IMPORTANT:
The screenshots are the primary design reference. Replicate the visual structure, layout hierarchy, spacing, typography, sections, content flow, and user experience while improving responsiveness, accessibility, performance, and SEO.

TECH STACK

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Framer Motion (lightweight)
- Prisma ORM
- Neon PostgreSQL
- AWS S3 (media storage)
- React Hook Form
- Zod Validation

ARCHITECTURE REQUIREMENTS

Follow:

- SOLID Principles
- Clean Architecture
- Feature-Based Modular Architecture
- Reusable Components
- Separation of Concerns
- Scalable Folder Structure

Folder Structure:

src/
├── app/
├── modules/
│ ├── home/
│ ├── courses/
│ ├── blog/
│ ├── placements/
│ ├── reviews/
│ ├── contact/
│ └── common/
├── components/
├── services/
├── repositories/
├── actions/
├── hooks/
├── providers/
├── lib/
├── types/
├── constants/
├── validations/
└── utils/

SEO REQUIREMENTS

This is a marketing website.

SEO is a top priority.

Implement:

- Server Side Rendering
- Static Generation where possible
- Incremental Static Regeneration
- Dynamic Metadata API
- Open Graph
- Twitter Cards
- Canonical URLs
- XML Sitemap
- Robots.txt
- Structured Data
- JSON-LD
- FAQ Schema
- Review Schema
- Course Schema
- Breadcrumb Schema
- Organization Schema
- Local Business Schema

Every page must have:

- Optimized title
- Optimized meta description
- Open Graph image
- Canonical URL
- Structured data

PERFORMANCE REQUIREMENTS

Target:

- Lighthouse Score 95+
- SEO 100
- Accessibility 95+
- Performance 95+
- Best Practices 100

Implement:

- Route-based code splitting
- Dynamic imports
- Lazy loading
- Image optimization
- next/image
- AVIF
- WebP
- Font optimization
- Tree shaking
- Suspense boundaries
- Streaming SSR
- Partial hydration
- Skeleton loading states
- CDN-friendly caching
- Edge caching
- Browser caching
- ISR revalidation

USER EXPERIENCE

Implement:

- Modern animations
- Smooth transitions
- Skeleton loaders
- Loading placeholders
- Error boundaries
- Empty states
- Mobile-first design

Responsive for:

- Mobile
- Tablet
- Desktop
- Ultra-wide screens

FORMS

Implement:

- React Hook Form
- Zod validation
- Accessible form fields
- Error handling
- Loading state
- Success state

SECURITY

Implement:

- Secure headers
- CSP
- XSS protection
- CSRF protection
- Input sanitization
- Rate limiting ready

ADMIN INTEGRATION

Website data must come from APIs.

Content should never be hardcoded.

Data Sources:

- Courses
- Blogs
- Reviews
- Placements
- FAQs
- Testimonials
- SEO Metadata

Use API abstraction layer.

Do not call APIs directly inside UI components.

Create:

- repositories
- services
- DTOs
- validation layer

DESIGN SYSTEM

Create reusable:

- Buttons
- Cards
- Forms
- Section Headers
- Testimonials
- Course Cards
- Blog Cards
- FAQ Components
- Hero Components
- Navigation Components

ACCESSIBILITY

Implement:

- WCAG AA
- Semantic HTML
- Keyboard Navigation
- Proper ARIA Labels

OUTPUT REQUIREMENTS

Generate:

1. Complete project architecture
2. Folder structure
3. Reusable design system
4. Page architecture
5. Data flow architecture
6. SEO implementation
7. Performance strategy
8. Production-ready code
9. Type-safe implementation
10. Scalable maintainable codebase

The final result should feel like a premium EdTech website capable of ranking on Google and handling large traffic volumes while maintaining excellent Core Web Vitals.

Build the Home Page for Techvaa using the attached screenshots as the primary design reference.

Requirements:

Sections:

1. Header Navigation
   - Sticky Header
   - Mobile Menu
   - CTA Button

2. Hero Section
   - Strong value proposition
   - Primary CTA
   - Secondary CTA
   - Modern visual hierarchy

3. Hiring Partners Section
   - Logo carousel
   - Infinite smooth animation

4. Why Choose Techvaa
   - Feature cards
   - Statistics
   - Trust indicators

5. SAP Courses Section
   - Dynamic course cards
   - SEO-friendly links

6. Placement Services Section
   - Success metrics
   - Placement highlights

7. Student Success Stories
   - Testimonials
   - Ratings
   - Video testimonial ready

8. Upcoming Batches

9. Free Demo Session CTA

10. FAQ Section
    - Schema Markup
    - Accordion

11. Lead Capture Section

12. Footer

SEO:

- Optimized H1
- Proper heading hierarchy
- Internal linking
- FAQ Schema
- Organization Schema
- Local Business Schema

Performance:

- Lazy loading
- Skeleton states
- Optimized images
- Dynamic imports

Animations:

- Framer Motion
- Lightweight only

Accessibility:

- WCAG AA
- Semantic HTML

Generate production-ready Next.js implementation with TypeScript and Tailwind CSS following SOLID principles and modular architecture.

STATE MANAGEMENT & DATA FETCHING

Use TanStack Query for all client-side server state management.

Responsibilities:

- API caching
- Background refetching
- Optimistic updates
- Pagination
- Search
- Filters
- Admin CRUD operations
- Retry handling
- Error handling

Use Zustand for lightweight global client state only.

Responsibilities:

- Authentication state
- Theme state
- Sidebar state
- Modal state
- Global UI preferences

Do NOT store server data in Zustand.

Server data such as:

- Courses
- Blogs
- Reviews
- Placements
- FAQs
- Leads

must be managed through TanStack Query.

NEXT.JS DATA FETCHING STRATEGY

SEO-Critical Pages:

- Home Page
- Course Pages
- Blog Pages
- Placement Pages

Use:

- Server Components
- SSR
- ISR
- Direct Prisma Data Access

Avoid TanStack Query for initial SEO-critical content.

Admin Dashboard:

Use:

- TanStack Query
- Client Components
- Query Caching
- Optimistic Updates

Follow separation:

Server State:
→ TanStack Query

Client/UI State:
→ Zustand

Database:
→ Neon PostgreSQL

ORM:
→ Prisma
