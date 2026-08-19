/**
 * One Member in one squad in one round.
 *
 * Carries its own permanent id because ratings hang off it: identity-by-
 * content would orphan them the moment a published roster is edited. Never
 * hard-deleted, for the same reason.
 */

import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { SQUAD_ROLES } from "@/consts/squad";

import { now, timestamp } from "./columns";
import { members } from "./create_table_members";
import { squads } from "./create_table_squads";

export const slots = sqliteTable(
  "slots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    squadId: integer("squad_id")
      .notNull()
      .references(() => squads.id),

    memberId: text("member_id")
      .notNull()
      .references(() => members.id),

    /**
     * The Squad role actually played here — two of the six rating criteria
     * are kit-relative, so «what were they doing» has to be recorded.
     */
    role: text("role", { enum: SQUAD_ROLES }),

    /** Soft delete, always. A removed slot keeps its ratings and its history. */
    removedAt: timestamp("removed_at"),

    createdAt: timestamp("created_at").notNull().default(now),
  },
  (t) => [
    index("slots_squad_idx").on(t.squadId),
    // Chemistry and «rosters I played in» both start here.
    index("slots_member_idx").on(t.memberId),
  ],
);

export type Slot = typeof slots.$inferSelect;
export type NewSlot = typeof slots.$inferInsert;
