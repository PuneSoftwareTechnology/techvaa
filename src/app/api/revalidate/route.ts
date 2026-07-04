import "server-only";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { corsHeaders, preflight } from "@/lib/api/rest";

/**
 * On-demand cache revalidation. The admin CMS calls this after creating /
 * editing / deleting content so the public site reflects the change
 * immediately, instead of waiting for the per-route ISR window to lapse.
 *
 * AUTH: a shared secret in the `x-revalidate-secret` header, matched against
 * `REVALIDATE_SECRET`. If the env var isn't set the route allows the call (so
 * it never hard-breaks before the secret is configured) but logs a warning.
 *
 * Usage (from the admin, after a successful course save):
 *   POST /api/revalidate
 *   headers: { "x-revalidate-secret": <secret>, "content-type": "application/json" }
 *   body: { "paths": ["/courses/sap-mm-materials-management"] }
 *
 * The list / home pages are always revalidated too, since most content types
 * surface there (featured courses, latest blogs, etc.).
 */
// All public listing pages refresh on any admin edit. Most content types
// surface across several of them (featured courses + latest blogs on home,
// testimonials on /reviews and home, etc.), so broad revalidation is the
// reliable choice for this marketing site — the cost is just a rebuild on the
// next request to each page.
const ALWAYS_REVALIDATE = ["/", "/courses", "/blogs", "/placements", "/reviews"];

// Dynamic detail routes are revalidated by pattern so edits to a course's
// curriculum / FAQs (rows that carry no slug of their own) still refresh the
// affected detail pages, not just the listings.
const DETAIL_ROUTES = ["/courses/[slug]", "/blogs/[slug]"];

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret && req.headers.get("x-revalidate-secret") !== secret) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401, headers: corsHeaders(req) }
    );
  }
  if (!secret) {
    console.warn("[revalidate] REVALIDATE_SECRET not set — allowing unauthenticated revalidation");
  }

  // Accept extra paths from the JSON body (e.g. the specific course slug page).
  let paths: string[] = [];
  try {
    const body = (await req.json()) as { paths?: unknown };
    if (Array.isArray(body.paths)) {
      paths = body.paths.filter(
        (p): p is string => typeof p === "string" && p.startsWith("/")
      );
    }
  } catch {
    // No / invalid body is fine — we still refresh the always-on paths.
  }

  const revalidated = [...new Set([...ALWAYS_REVALIDATE, ...paths])];
  for (const path of revalidated) revalidatePath(path);
  // Invalidate every page under the dynamic detail routes.
  for (const route of DETAIL_ROUTES) revalidatePath(route, "page");
  // The sitemap is DB-driven (slugs from published courses/blogs), so any
  // content edit can change it — refresh it on every revalidation too, else a
  // renamed/added/removed slug lingers until its own ISR window lapses.
  revalidatePath("/sitemap.xml");

  // NOTE: this refreshes the ORIGIN's ISR cache only. The site runs on Amplify
  // Hosting, whose managed CloudFront still serves its edge copy until the
  // page's `s-maxage` (= `revalidate`) lapses — Amplify exposes no API to purge
  // it. Edge freshness is therefore bounded by the low `revalidate` we set on
  // each page, not by this call.

  return Response.json(
    { revalidated: [...revalidated, ...DETAIL_ROUTES, "/sitemap.xml"], now: Date.now() },
    { status: 200, headers: corsHeaders(req) }
  );
}
