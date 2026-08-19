import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit reads credentials straight from the environment rather than
 * through `src/lib/env.ts`, because it runs as a CLI outside Next.js and the
 * `@/` path alias is not available to it. The target selection is duplicated
 * here deliberately and kept trivial.
 *
 * **Defaults to the development database.** Migrating the clan's real data has
 * to be a thing you asked for by name — `make db-migrate-prod`, which sets
 * `APP_ENV=production`.
 *
 * Prisma Migrate does not work over Turso's HTTP protocol (#8); drizzle-kit
 * does, which is half the reason Drizzle won.
 */
const isProduction = process.env.APP_ENV === "production";

const url = isProduction
  ? process.env.TURSO_DATABASE_URL
  : process.env.TURSO_DEV_DATABASE_URL;

const authToken = isProduction
  ? process.env.TURSO_AUTH_TOKEN
  : process.env.TURSO_DEV_AUTH_TOKEN;

if (!url) {
  throw new Error(
    `No ${isProduction ? "TURSO_DATABASE_URL" : "TURSO_DEV_DATABASE_URL"} set — ` +
      "load it with `set -a && . ./.env.local`, as the make targets do.",
  );
}

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema/create_table_*.ts",
  out: "./drizzle",
  dbCredentials: { url, authToken },
});
