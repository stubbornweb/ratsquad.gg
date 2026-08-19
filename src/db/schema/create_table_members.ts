/**
 * One row per person who has ever been in the guild.
 *
 * Rows are never deleted: published rosters are history, and removing a
 * Member would retroactively rewrite past scrims and silently shift chemistry
 * counts. Naming follows `CONTEXT.md` — the person is a **Member**, not a
 * player. (#13 wrote `players`; the ubiquitous language overrides it.)
 */

import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { DIRECTIONS, RANKS } from "@/consts/squad";

import { now, timestamp } from "./columns";

export const members = sqliteTable(
  "members",
  {
    /** Discord snowflake. TEXT, never INTEGER — snowflakes exceed 2^53. */
    id: text("id").primaryKey(),

    /** Last known callsign, overwritten by the guild sync. */
    callsign: text("callsign").notNull(),

    /**
     * Denormalised from the guild sync for display and filtering.
     * May never drive a permission gate — the tier is resolved live from the
     * session on every request (#12), and never reads this column.
     */
    rank: text("rank", { enum: RANKS }).notNull(),

    rolesSyncedAt: timestamp("roles_synced_at"),

    /** Officer-only when read for anyone but the Member themselves (#12). */
    steamId: text("steam_id"),

    directionPrimary: text("direction_primary", { enum: DIRECTIONS }),
    directionSecondary: text("direction_secondary", { enum: DIRECTIONS }),

    /**
     * Write-only. No site surface renders these — exactly one read path, for
     * the greeting, plus the Member's own profile form. Three columns rather
     * than one date so «14 березня» can be given without inventing a year.
     */
    birthDay: integer("birth_day"),
    birthMonth: integer("birth_month"),
    birthYear: integer("birth_year"),

    /**
     * Not `is_active`: `Inactive` is a Rank held by members who have *not*
     * left. Set by the guild sync when an ID present yesterday is absent
     * today — and only when the fetch succeeded with a plausible member
     * count, since a half-failed fetch looks identical to a mass exodus.
     */
    isLeft: integer("is_left", { mode: "boolean" }).notNull().default(false),

    createdAt: timestamp("created_at").notNull().default(now),
    updatedAt: timestamp("updated_at").notNull().default(now),
  },
  (t) => [
    // The one read path for birthdays.
    index("members_birthday_idx").on(t.birthMonth, t.birthDay),
    // The directory, and «хто ще не заповнив?».
    index("members_is_left_idx").on(t.isLeft),
  ],
);

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
