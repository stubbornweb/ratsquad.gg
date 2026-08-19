/**
 * The one place that knows how to reach the database.
 *
 * #8 settled the exit path: moving off Turso to a self-hosted SQLite file is
 * a change to `url` alone — same client, same queries — so this module owns
 * the URL and the credentials, and nothing else. Callers import `db` and the
 * tables; they never construct a client.
 *
 * Instantiated at module scope: Vercel Functions reuse the module across
 * invocations on a warm instance, and the libSQL client is HTTP-based with no
 * connection pool to exhaust.
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { readServerEnv } from "@/lib/env";

import * as schema from "./schema";

function createDb() {
  const result = readServerEnv(process.env);

  if (!result.ok) {
    // Fail loudly at first use rather than returning a client that 401s on
    // every query — `make check-provisioning` is the tool for diagnosing which
    // credential is missing.
    const keys = result.problems.map((p) => `${p.key} (${p.reason})`).join(", ");
    throw new Error(`Database unavailable — bad server environment: ${keys}`);
  }

  const client = createClient({
    url: result.config.tursoDatabaseUrl,
    authToken: result.config.tursoAuthToken,
  });

  return drizzle(client, { schema });
}

export const db = createDb();

export * from "./schema";
