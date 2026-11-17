-- Spelling fix: "S4 HANA" -> "S4HANA" in the Home meta description.
-- Fixed-page SEO has no admin screen and the page_seo row overrides the code
-- fallback in src/app/page.tsx, so fix it here. replace() touches only that
-- word and is a no-op if the text no longer contains it.
UPDATE "page_seo"
SET "metaDescription" = replace("metaDescription", 'S4 HANA', 'S4HANA'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "path" = '/' AND "metaDescription" LIKE '%S4 HANA%';
