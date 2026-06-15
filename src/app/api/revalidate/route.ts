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
const ALWAYS_REVALIDATE = ["/", "/courses", "/blogs"];

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

  return Response.json(
    { revalidated, now: Date.now() },
    { status: 200, headers: corsHeaders(req) }
  );
}
