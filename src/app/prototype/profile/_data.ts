/**
 * PROTOTYPE — throwaway. See src/app/prototype/profile/page.tsx.
 *
 * The 14 ролі and 4 напрями from the map (#7). Groups exist only so the
 * prototype can ask whether grouping helps — note that `command` is a
 * catch-all holding SL (a job) and Mortar (a station), neither of which is
 * a kit. That smell is deliberate: it is the axis-mixing the model removed,
 * creeping back in through the grouping. Watch for it while judging B.
 */

export type RoleGroup = "infantry" | "vehicle" | "other";

export type Role = {
  id: string;
  /** Squad kit name — what players actually say out loud, so left in English. */
  label: string;
  /** Ukrainian gloss, to test whether 14 unglossed options is a wall. */
  hint: string;
  group: RoleGroup;
};

export const ROLES: Role[] = [
  { id: "rifler", label: "RIFLER", hint: "стрілець", group: "infantry" },
  { id: "medic", label: "MEDIC", hint: "медик", group: "infantry" },
  { id: "lat", label: "LAT", hint: "легке ПТ", group: "infantry" },
  { id: "hat", label: "HAT", hint: "важке ПТ", group: "infantry" },
  { id: "gl", label: "GL", hint: "гранатометник", group: "infantry" },
  { id: "mg", label: "MG", hint: "кулеметник", group: "infantry" },
  { id: "marksman", label: "MARKSMAN", hint: "влучний стрілець", group: "infantry" },
  { id: "ce", label: "CE", hint: "сапер", group: "infantry" },
  { id: "tech-light", label: "TECH LIGHT", hint: "RWS, BRDM", group: "vehicle" },
  { id: "tech-middle", label: "TECH MIDDLE", hint: "BTR, LAV", group: "vehicle" },
  { id: "tech-heavy", label: "TECH HEAVY", hint: "Tank, ZBD", group: "vehicle" },
  { id: "pilot", label: "PILOT", hint: "пілот", group: "vehicle" },
  { id: "sl", label: "SL", hint: "командир загону", group: "other" },
  { id: "mortar", label: "MORTAR", hint: "міномет", group: "other" },
];

export const GROUP_LABELS: Record<RoleGroup, string> = {
  infantry: "ПІХОТА",
  vehicle: "ТЕХНІКА",
  other: "ІНШЕ",
};

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]));

export type Direction = "frontline" | "backline" | "flank" | "flex";

export const DIRECTIONS: { id: Direction; label: string; hint: string }[] = [
  { id: "frontline", label: "ФРОНТ", hint: "перший контакт, штурм" },
  { id: "backline", label: "ТИЛ", hint: "логістика, підтримка, FOB" },
  { id: "flank", label: "ФЛАНГ", hint: "обхід, розвідка, тиск збоку" },
  { id: "flex", label: "ФЛЕКС", hint: "куди поставлять" },
];

/** The shape every variant edits. In-memory only — nothing persists. */
export type ProfileDraft = {
  /** Capability set — «які ролі ти МОЖЕШ грати». */
  can: string[];
  /** Ordered top-3, a subset of `can`. Max, not a quota. */
  top: string[];
  direction: Direction | null;
  directionSecondary: Direction | null;
  steamId: string;
};

export const EMPTY_DRAFT: ProfileDraft = {
  can: [],
  top: [],
  direction: null,
  directionSecondary: null,
  steamId: "",
};

/** A returning member — for question 4, empty vs filled. */
export const FILLED_DRAFT: ProfileDraft = {
  can: ["rifler", "medic", "lat", "gl", "ce", "tech-middle", "tech-heavy", "sl"],
  top: ["sl", "tech-heavy", "medic"],
  direction: "frontline",
  directionSecondary: "flex",
  steamId: "76561198042690115",
};

export const MOCK_DISCORD_USER = {
  callsign: "SMEREKA",
  tag: "smereka",
  rank: "MEMBER",
  /** Discord's default avatar palette, so the stub login looks plausible. */
  colour: "#5865F2",
};
