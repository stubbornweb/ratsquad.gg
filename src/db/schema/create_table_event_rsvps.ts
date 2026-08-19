/**
 * TRANSIENT — never history.
 *
 * Replaced wholesale on refresh (delete-then-insert for the event, never
 * merged) and lazy-purged 5 days after `events.date`, swept at the start of
 * every import since Vercel has no background daemon. This table therefore
 * can never become a record of who attended what — which is why attendance
 * can only ever mean *rounds played*, counted from slots.
 */

import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { now, timestamp } from "./columns";
import { events } from "./create_table_events";
import { members } from "./create_table_members";

export const eventRsvps = sqliteTable(
  "event_rsvps",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),

    /** NULL = «не впізнано» — no alias matched. */
    memberId: text("member_id").references(() => members.id),

    /** Kept even on a match, so a wrong match is visible rather than silent. */
    apolloRawName: text("apollo_raw_name").notNull(),

    status: text("status").notNull(),

    importedAt: timestamp("imported_at").notNull().default(now),
  },
  (t) => [index("event_rsvps_event_idx").on(t.eventId)],
);

export type EventRsvp = typeof eventRsvps.$inferSelect;
export type NewEventRsvp = typeof eventRsvps.$inferInsert;
