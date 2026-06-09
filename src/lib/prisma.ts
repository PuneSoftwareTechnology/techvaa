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

// Cold Neon wakeups occasionally drop one of several WebSocket connections
// opened concurrently (a page that fires `Promise.all` of queries can lose one
// to a transient connect error). Retry transient connection failures with a
// short backoff so the user never sees the error page for a recoverable blip.
const TRANSIENT_MESSAGE =
  /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EPIPE|Connection terminated|connection closed|network error|non-101|socket hang up|fetch failed/i;

function isTransientConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = error.constructor?.name ?? (error as { name?: string }).name;
  // WebSocket-level failures surface as `ErrorEvent`; connection setup failures
  // as `PrismaClientInitializationError`. Both are safe to retry.
  if (
    name === "ErrorEvent" ||
    name === "PrismaClientInitializationError" ||
    name === "PrismaClientUnknownRequestError"
  ) {
    return true;
  }
  const code = (error as { code?: string }).code;
  if (code && /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EPIPE/.test(code)) return true;
  return TRANSIENT_MESSAGE.test(String((error as { message?: string }).message ?? ""));
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
            // TEMP DIAG
            console.error("[DIAG] attempt", attempt, {
              ctor: (error as any)?.constructor?.name,
              name: (error as any)?.name,
              message: (error as any)?.message,
              code: (error as any)?.code,
              keys: error && typeof error === "object" ? Object.keys(error as any) : null,
              str: String(error).slice(0, 200),
              transient: isTransientConnectionError(error),
            });
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
