/**
 * The schema, one file per table, as settled in issue #13.
 *
 * Table names are plural; foreign key columns stay singular. Enums are
 * TypeScript-only, from `src/consts/squad.ts` — see the note there on why
 * there are no CHECK constraints and no lookup tables.
 */

export * from "./create_table_members";
export * from "./create_table_member_roles";
export * from "./create_table_member_aliases";
export * from "./create_table_events";
export * from "./create_table_event_rsvps";
export * from "./create_table_rounds";
export * from "./create_table_squads";
export * from "./create_table_slots";
