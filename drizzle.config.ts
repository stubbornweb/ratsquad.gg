import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit reads credentials straight from the environment rather than
 * through `src/lib/env.ts`, because it runs as a CLI outside Next.js and the
 * `@/` path alias is not available to it.
 *
 * **Which database is decided by which file the Makefile sourced**, not by a
 * name: `.env.development` and `.env.production` carry the same variable names
 * and differ only in `APP_ENV`. So the target is not something this file picks
 * — it is something it *verifies*. `EXPECTED_TARGET` is set by the make target
 * you typed, and a mismatch means the wrong file was sourced.
 *
 * That keeps #45's intent intact: migrating the clan's real data has to be
 * asked for by name, `make db-migrate-prod`. What changed is that asking for it
 * wrongly now fails here rather than silently running.
 *
 * Prisma Migrate does not work over Turso's HTTP protocol (#8); drizzle-kit
 * does, which is half the reason Drizzle won.
 */
const declared = process.env.APP_ENV;
const expected = process.env.EXPECTED_TARGET;

if (declared !== expected) {
  throw new Error(
    `Refusing to run: this command expects the ${expected} database, but the ` +
      `loaded environment declares APP_ENV=${declared ?? "(unset)"}. ` +
      "Use make db-migrate (development) or make db-migrate-prod (production).",
  );
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "No TURSO_DATABASE_URL set — load it with " +
      `\`set -a && . ./.env.${expected}\`, as the make targets do.`,
  );
}

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema/create_table_*.ts",
  out: "./drizzle",
  dbCredentials: { url, authToken },
});
