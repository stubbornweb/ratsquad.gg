/**
 * The in-game taxonomy: what a Member can do, and where they belong.
 *
 * These two lists are the single source of truth for their columns. Drizzle's
 * `text({ enum })` types the column in TypeScript; the stored SQLite type is
 * plain TEXT. There are deliberately no CHECK constraints and no lookup
 * tables — SQLite cannot ALTER a constraint, so a fifteenth Squad role would
 * rebuild the table, and this taxonomy only changes when Squad itself does.
 * The trade accepted: a bad value can only enter by bypassing the app.
 */

/**
 * The fourteen in-game kits a Member can play — «Ролі».
 *
 * Always qualify this as a *Squad role*: `CONTEXT.md` reserves bare "role" as
 * ambiguous, and this is a fourth meaning alongside Rank and Discord role.
 */
export const SQUAD_ROLES = [
  "RIFLER",
  "MEDIC",
  "LAT",
  "HAT",
  "GL",
  "MG",
  "MARKSMAN",
  "CE",
  "SL",
  "TECH_LIGHT",
  "TECH_MIDDLE",
  "TECH_HEAVY",
  "PILOT",
  "MORTAR",
] as const;

export type SquadRole = (typeof SQUAD_ROLES)[number];

/** English labels, matching how the clan writes them in Discord. */
export const SQUAD_ROLE_LABELS: Record<SquadRole, string> = {
  RIFLER: "Rifler",
  MEDIC: "Medic",
  LAT: "LAT",
  HAT: "HAT",
  GL: "GL",
  MG: "MG",
  MARKSMAN: "Marksman",
  CE: "CE",
  SL: "SL",
  TECH_LIGHT: "Tech light",
  TECH_MIDDLE: "Tech middle",
  TECH_HEAVY: "Tech heavy",
  PILOT: "Pilot",
  MORTAR: "Mortar",
};

/** Which vehicles each Tech tier covers, shown beside the label on the form. */
export const SQUAD_ROLE_HINTS: Partial<Record<SquadRole, string>> = {
  TECH_LIGHT: "RWS, BRDM",
  TECH_MIDDLE: "BTR, LAV",
  TECH_HEAVY: "Tank, ZBD",
};

/** How many Squad roles a Member may rank as a preference. A maximum, not a quota. */
export const MAX_ROLE_PREFERENCES = 3;

/**
 * The six «напрями» — the type of загін a Member belongs in.
 *
 * A напрямок is a *type of squad*, not a position on the map, which is why
 * the same enum serves `members.direction_primary` and `squads.type_tag`.
 * Corrected from four by issue #18, against the clan's written squad doctrine.
 */
export const DIRECTIONS = [
  "FRONTLINE",
  "BACKLINE",
  "FLANK",
  "FLEX",
  "VIC",
  "MORTAR",
] as const;

export type Direction = (typeof DIRECTIONS)[number];

/**
 * The Ukrainian gloss shown alongside the English label. Issue #18 settled the
 * form as English label + gloss, matching the Squad role tiles.
 */
export const DIRECTION_LABELS: Record<Direction, string> = {
  FRONTLINE: "ФРОНТ",
  BACKLINE: "ТИЛ",
  FLANK: "ФЛАНГ",
  FLEX: "ФЛЕКС",
  VIC: "ТЕХНІКА",
  MORTAR: "МІНОМЕТ",
};

/**
 * The Ranks a Member can hold, derived from their Discord roles.
 *
 * Denormalised onto `members.rank` for display and filtering only — the
 * permission tier is resolved live from the session on every request and
 * never reads the column.
 */
export const RANKS = [
  "DUCHE",
  "VO_DUCHE",
  "OFFICER",
  "RATS",
  "RECRUIT",
  "INACTIVE",
] as const;

export type Rank = (typeof RANKS)[number];
