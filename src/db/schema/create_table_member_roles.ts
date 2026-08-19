/**
 * Squad-role capability.
 *
 * The row existing *is* «може» — which makes the roster builder's central
 * question, «хто ще може сісти в танк?», a single indexed read.
 */

import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { SQUAD_ROLES } from "@/consts/squad";

import { members } from "./create_table_members";

export const memberRoles = sqliteTable(
  "member_roles",
  {
    memberId: text("member_id")
      .notNull()
      .references(() => members.id),

    role: text("role", { enum: SQUAD_ROLES }).notNull(),

    /**
     * 1–3, the top-3 order. Nullable, and a **maximum not a quota** — 0 to 3
     * preferences are all valid, because demanding three would block exactly
     * the half-filled profiles the roster builder needs to see.
     *
     * Because a preference can only sit on a capability row, preferring a
     * Squad role you cannot play is unrepresentable.
     */
    preference: integer("preference"),
  },
  (t) => [
    primaryKey({ columns: [t.memberId, t.role] }),
    // Makes a corrupt top-3 (two firsts) unrepresentable.
    uniqueIndex("member_roles_preference_idx").on(t.memberId, t.preference),
    index("member_roles_role_idx").on(t.role),
  ],
);

export type MemberRole = typeof memberRoles.$inferSelect;
export type NewMemberRole = typeof memberRoles.$inferInsert;
