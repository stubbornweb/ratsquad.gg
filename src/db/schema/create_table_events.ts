/**
 * A scrim night, imported from an Apollo RSVP embed.
 *
 * The event owns its own date, copied from Apollo at import rather than
 * derived from it, so the roster survives Apollo being retired (#11).
 */

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamp } from "./columns";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  apolloMessageLink: text("apollo_message_link").notNull(),
  apolloMessageId: text("apollo_message_id").notNull(),

  date: timestamp("date").notNull(),

  /**
   * NULL = draft. «Publish» names this state transition, not the message —
   * see the note in `CONTEXT.md`.
   */
  publishedAt: timestamp("published_at"),

  /** The Roster post. Edited in place for the event's whole life. */
  discordMessageId: text("discord_message_id"),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
