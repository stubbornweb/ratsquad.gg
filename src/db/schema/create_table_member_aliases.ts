/**
 * Apollo display name → Member.
 *
 * The only part of the RSVP import that survives the purge: an SL's manual
 * correction («`kotyara` is Kotyara_UA») has to outlive the event it was made
 * on. It stores a name and a Member and nothing else — no dates, no event
 * reference, nothing about participation.
 *
 * Stays empty and gets deleted outright if Apollo turns out to emit real
 * Discord IDs (#9's open question, folded into #14).
 */

import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { members } from "./create_table_members";

export const memberAliases = sqliteTable("member_aliases", {
  alias: text("alias").primaryKey(),
  memberId: text("member_id")
    .notNull()
    .references(() => members.id),
});

export type MemberAlias = typeof memberAliases.$inferSelect;
export type NewMemberAlias = typeof memberAliases.$inferInsert;
