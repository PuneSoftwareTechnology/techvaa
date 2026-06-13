import "dotenv/config"; // Prisma 7 no longer auto-loads .env — load it here so
// env("DATABASE") resolves for migrate / db / studio commands.
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    // Seed runs on Node 20+; --env-file makes DATABASE available to the process.
    seed: "node --env-file=.env --import tsx prisma/seed.ts",
  },

  // Required for migration / introspection commands. The runtime PrismaClient
  // uses a driver adapter (see src/lib/prisma.ts) rather than this URL.
  //
  // Migrations MUST use a direct (non-pooled) connection: PgBouncer breaks the
  // session-level advisory lock that `prisma migrate deploy` acquires, which
  // surfaces as P1002 "Timed out trying to acquire a postgres advisory lock".
  // Set DATABASE_DIRECT to the Neon endpoint WITHOUT `-pooler` in the host.
  // Falls back to DATABASE so local/dev still works if unset.
  datasource: {
    url: process.env.DATABASE_DIRECT ? env("DATABASE_DIRECT") : env("DATABASE"),
  },
});
