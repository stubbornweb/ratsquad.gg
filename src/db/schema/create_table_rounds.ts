/**
 * A scrim is N rosters, one per round — the faction changes, and the roster
 * changes with it. So squads and slots hang off a round, not the event (#11).
 *
 * The round carries its own permanent id: identity-by-content would orphan
 * every rating hanging beneath it the moment a published roster is edited.
 */

import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { events } from "./create_table_events";

export const rounds = sqliteTable(
  "rounds",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),

    ordinal: integer("ordinal").notNull(),

    faction: text("faction").notNull(),
    layer: text("layer").notNull(),
  },
  (t) => [index("rounds_event_idx").on(t.eventId)],
);

export type Round = typeof rounds.$inferSelect;
export type NewRound = typeof rounds.$inferInsert;
