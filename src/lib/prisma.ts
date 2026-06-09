import "server-only";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 removed the bundled Rust query engine, so a driver adapter is
// mandatory. Neon's compute auto-suspends when idle, so we use its serverless
// driver (`@prisma/adapter-neon` + `@neondatabase/serverless`), which talks to
// Postgres over a WebSocket and is built for cold starts and serverless pooling.
const connectionString = process.env.DATABASE;
if (!connectionString) {
  throw new Error("Missing DATABASE connection string in environment");
}

// The Neon driver needs a WebSocket implementation. Node < 22 ships none, and
// Node's built-in (undici) WebSocket fails Neon's upgrade handshake ("non-101
// status code"), so we pin the `ws` implementation explicitly.
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString });

// The Neon WebSocket driver occasionally drops one of several connections
// opened concurrently — a page that fires `Promise.all` of queries, or a build
// running many prerender workers at once, can lose one to a transient connect
// error. Retry transient connection failures with backoff so neither users nor
// the build ever see the error page for a recoverable blip.
const TRANSIENT_MESSAGE =
  /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EPIPE|Connection terminated|connection closed|network error|non-101|socket hang up|fetch failed/i;

// Prisma "known request" error codes (https://www.prisma.io/docs/orm/reference/error-reference).
// P1xxx are connection/engine failures (can't reach DB, timeout, dropped
// connection) and are safe to retry; P2xxx/P3xxx/P4xxx are query, migration,
// and constraint errors that will never succeed on retry.
const TRANSIENT_PRISMA_CODE = /^P1\d{3}$/;
const FATAL_PRISMA_CODE = /^P[2-9]\d{3}$/;

function isTransientConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as {
    name?: string;
    code?: string;
    message?: string;
    clientVersion?: string;
  };

  // WebSocket-level failures from the Neon driver surface as `ErrorEvent`.
  // (Match by name only — production bundling minifies class names, so we can
  // neither compare `constructor.name` nor rely on `instanceof`.)
  const name = (error as { constructor?: { name?: string } }).constructor?.name;
  if (name === "ErrorEvent" || err.name === "ErrorEvent") return true;

  // Node/driver-level socket errors.
  if (err.code && /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EPIPE/.test(err.code)) {
    return true;
  }

  // Prisma errors carry a `clientVersion`. Next bundles its own copy of the
  // Prisma runtime for prerendering, so the thrown error is NOT an instance of
  // the classes we import here and `instanceof` always returns false — we must
  // duck-type instead. A P1xxx code is a retryable connection failure; any
  // other Prisma code (P2xxx+) is a real query error we must surface. When the
  // Neon WebSocket drops mid-query, Prisma wraps it as an error with a
  // `clientVersion` but NO code and an empty message — exactly the failure that
  // intermittently breaks static builds — so treat that shape as transient too.
  if (typeof err.clientVersion === "string") {
    if (err.code && TRANSIENT_PRISMA_CODE.test(err.code)) return true;
    if (err.code && FATAL_PRISMA_CODE.test(err.code)) return false;
    if (!err.code && !err.message) return true;
  }

  return TRANSIENT_MESSAGE.test(String(err.message ?? ""));
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createPrismaClient() {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  }).$extends({
    query: {
      async $allOperations({ args, query }) {
        // Waking Neon compute from auto-suspend can take 10s+, and during
        // static builds many workers race their first connection at once.
        // Retry with exponential backoff + jitter so the herd de-synchronizes
        // and the total wait window comfortably outlasts a cold start (these
        // settings give a ~20s cumulative window).
        const MAX_ATTEMPTS = 10;
        let lastError: unknown;
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            lastError = error;
            if (
              attempt === MAX_ATTEMPTS - 1 ||
              !isTransientConnectionError(error)
            ) {
              throw error;
            }
            const backoff = Math.min(4000, 100 * 2 ** attempt);
            await sleep(backoff + Math.random() * 250);
          }
        }
        throw lastError;
      },
    },
  });
}

// Reuse a single client across hot reloads in development to avoid exhausting
// the connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
