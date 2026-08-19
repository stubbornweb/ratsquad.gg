/**
 * Freeform squads, with the напрямок as an optional type tag.
 *
 * Freeform because scrim sizes vary 20/26/36 and vics are sometimes their own
 * squad and sometimes not — the tag lets the builder warn («цей інф сквад без
 * медика») without dictating structure.
 */

import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { DIRECTIONS } from "@/consts/squad";

import { rounds } from "./create_table_rounds";

export const squads = sqliteTable(
  "squads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    roundId: integer("round_id")
      .notNull()
      .references(() => rounds.id),

    name: text("name").notNull(),

    /**
     * The six напрями, per #18 — the same enum as `members.direction_*`,
     * because a напрямок *is* a type of загін rather than a position on the
     * map. (#13's «Інфантрі | Армор | Логі» was invented during charting and
     * is superseded.)
     */
    typeTag: text("type_tag", { enum: DIRECTIONS }),
  },
  (t) => [index("squads_round_idx").on(t.roundId)],
);

export type Squad = typeof squads.$inferSelect;
export type NewSquad = typeof squads.$inferInsert;
