// Best-effort warm-up for Neon's auto-suspending compute, run as a `prebuild`
// step. Static prerendering fires many DB queries the instant `next build`
// starts; if Neon is suspended, the herd can exhaust the cold-start window and
// the build fails with a cryptic "[object Object]" prerender error. Waking the
// compute with one cheap query first removes that race.
//
// This is best-effort: on persistent failure it warns and exits 0 rather than
// blocking the build — the in-query retry in src/lib/prisma.ts is the real
// safety net. Run via `node --env-file-if-exists=.env` so it uses .env locally
// and falls back to the real environment in CI.
import ws from "ws";
import { neonConfig, Pool } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE;
if (!connectionString) {
  console.warn("[warm-db] DATABASE not set — skipping warm-up.");
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MAX_ATTEMPTS = 10;

const pool = new Pool({ connectionString });
const started = Date.now();

for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
  try {
    await pool.query("SELECT 1");
    console.log(`[warm-db] Neon awake in ${Date.now() - started}ms.`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    if (attempt === MAX_ATTEMPTS - 1) {
      console.warn(
        `[warm-db] could not wake Neon after ${attempt + 1} attempts:`,
        error?.message ?? error,
      );
      console.warn("[warm-db] continuing — build will retry per-query.");
      await pool.end().catch(() => {});
      process.exit(0);
    }
    const backoff = Math.min(4000, 100 * 2 ** attempt);
    await sleep(backoff + Math.random() * 250);
  }
}
