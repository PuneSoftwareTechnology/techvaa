import "server-only";
import { headers } from "next/headers";

/**
 * Tiny in-memory, fixed-window rate limiter. Keyed by an arbitrary string
 * (usually `bucket:ip`). No external dependency — state lives in this process.
 *
 * Trade-offs (by design, for a single-instance deployment):
 *   - Counts reset on deploy/restart.
 *   - Not shared across instances (each serverless instance keeps its own map).
 * If the site ever scales to multiple always-on instances, swap the store for
 * Upstash Redis behind the same `rateLimit()` signature.
 */
type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export type RateLimitResult = {
  ok: boolean;
  /** Whole seconds until the window resets (for Retry-After). */
  retryAfter: number;
};

/**
 * Record a hit for `key` and report whether it's within `limit` per `windowMs`.
 * Prunes expired entries lazily on each call to keep the map bounded.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    pruneExpired(now);
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Drop expired windows so the map can't grow without bound. */
function pruneExpired(now: number): void {
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k);
  }
}

/**
 * Best-effort client IP from proxy headers. Falls back to a constant so a
 * missing header degrades to a shared (stricter) bucket rather than no limit.
 * Use inside Server Actions / route handlers.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}

/** Same as clientIp() but reads from a Request (route handlers have `req`). */
export function ipFromRequest(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
