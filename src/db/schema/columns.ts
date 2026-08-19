/**
 * Column helpers shared across the tables.
 *
 * Every table file imports from here rather than redefining the timestamp
 * shape, so «what does a date look like in this database» has one answer.
 */

import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

/** Unix seconds. SQLite has no date type, and Turso is SQLite. */
export const timestamp = (name: string) =>
  integer(name, { mode: "timestamp" });

/** Default for `created_at` / `updated_at`, evaluated by SQLite itself. */
export const now = sql`(unixepoch())`;
