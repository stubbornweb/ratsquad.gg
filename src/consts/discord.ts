/**
 * Discord integration constants.
 *
 * Role IDs are used instead of names so the integration
 * survives role renames. Run `npx tsx scripts/list-discord-roles.ts`
 * to discover IDs for your server.
 */

export const DISCORD_GUILD_ID = "1139847863950639185";

// --- Role IDs (update after running the discovery script) ---
// "Дуче" — supreme leader, always first in RosterPreview
export const ROLE_DUCHE = "1249808811980623942";
// "В.О.Дуче" — leadership / featured on homepage
export const ROLE_VO_DUCHE = "1249808893400449064";
// "Officer" — squad leads
export const ROLE_OFFICER = "1249806255388627015";
// "RATS" — regular members
export const ROLE_RATS = "1249804025667260467";

/**
 * Maps Discord role IDs to display labels shown on the site.
 * If a role ID isn't here, the Discord role name is used as-is.
 */
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  [ROLE_DUCHE]: "ДУЧЕ",
  [ROLE_VO_DUCHE]: "В.О.ДУЧЕ",
  [ROLE_OFFICER]: "SQUAD LEAD",
  [ROLE_RATS]: "MEMBER",
};

/**
 * Which roles to fetch for each page context.
 */
export const ROSTER_ROLES = {
  /** Homepage RosterPreview — Дуче (always first) + В.О.Дуче */
  featured: [ROLE_DUCHE, ROLE_VO_DUCHE],
  /** /roster page — all tracked roles */
  full: [ROLE_DUCHE, ROLE_VO_DUCHE, ROLE_OFFICER, ROLE_RATS],
} as const;

// --- Channel IDs (discover with `make discord-channels`) ---
// Channel IDs are not secrets — they live here beside the guild and role IDs,
// not in the environment, which is reserved for credentials.

/**
 * Where the current Discord registration form posts recruit applications
 * («анкети»): the «📁・для-анкет» channel. Read-only for the bot.
 */
export const CHANNEL_APPLICATIONS = "1249820817827692645";

/**
 * The channel carrying Apollo's RSVP embeds. The bot's Send Messages and
 * Manage Messages grant is scoped to this channel and nowhere else — see
 * `make check-provisioning`, which fails if that grant leaks wider.
 *
 * Empty until a human fills it in: RATS opens a channel per event, so which
 * one is authoritative is a clan decision, not something to detect.
 */
export const CHANNEL_EVENT = "";

/**
 * Custom display order for featured members on RosterPreview.
 * Callsigns listed here appear first, in this order.
 * Members not listed appear after, in Discord's member order.
 */
export const FEATURED_ORDER: string[] = [
  // Add callsigns here in the desired display order, e.g.:
  // "Creep-ak",
  // "AnotherCallsign",
];

/** ISR revalidation interval in seconds (5 minutes) */
export const REVALIDATE_INTERVAL = 300;
