-- Corrections 2, point 7: new homepage meta title + description.
-- There is no admin screen for fixed-page SEO, and the existing Home row in
-- page_seo overrides the code fallback in src/app/page.tsx, so update the row
-- here. Runs once via `prisma migrate deploy` in the Amplify build. Matches
-- no rows (harmless) if the Home row doesn't exist.
UPDATE "page_seo"
SET "metaTitle" = 'SAP Training Institute in Pune | Best SAP Courses | Techvaa',
    "metaDescription" = 'Techvaa is an SAP training institute in Pune offering SAP S4 HANA courses, online training and placement support with live projects. Join the next batch.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "path" = '/';
