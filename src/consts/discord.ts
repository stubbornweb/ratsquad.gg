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
 * «Календар 1.1» — one text channel per scrim, each carrying Apollo's RSVP
 * embed. There is no single event channel: the set changes every week, so the
 * event channels are resolved from this category at read time by
 * `listEventChannels()` in `src/lib/event-channels.ts`.
 *
 * The category's first channel is the «зразок-дд-мм-рр» template new event
 * channels are copied from; it holds no RSVP and is excluded.
 *
 * The bot's Send Messages and Manage Messages grant belongs on this category
 * and nowhere else — `make check-provisioning` fails if it leaks wider.
 */
export const CATEGORY_EVENTS = "1251110806225948722";

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
