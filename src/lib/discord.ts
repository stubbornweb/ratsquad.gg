import { type Member } from "@/types";
import {
  DISCORD_GUILD_ID,
  ROLE_DUCHE,
  ROLE_VO_DUCHE,
  ROLE_OFFICER,
  ROLE_RATS,
  ROLE_DISPLAY_NAMES,
  FEATURED_ORDER,
} from "@/consts/discord";

const API_BASE = "https://discord.com/api/v10";

interface DiscordGuildMember {
  user?: { id: string; username: string; global_name?: string | null };
  nick?: string | null;
  roles: string[];
  joined_at: string;
}

function getToken(): string {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error("DISCORD_BOT_TOKEN is not set");
  return token;
}

/**
 * Fetch all guild members (handles Discord's 1000-member pagination).
 */
async function fetchAllGuildMembers(): Promise<DiscordGuildMember[]> {
  const token = getToken();
  const all: DiscordGuildMember[] = [];
  let after = "0";

  while (true) {
    const url = `${API_BASE}/guilds/${DISCORD_GUILD_ID}/members?limit=1000&after=${after}`;
    // Inherit revalidation from page-level config (300s ISR)
    const res = await fetch(url, {
      headers: { Authorization: `Bot ${token}` },
    });

    if (!res.ok) {
      console.error(`Discord API error: ${res.status} ${res.statusText}`);
      return all;
    }

    const batch: DiscordGuildMember[] = await res.json();
    if (batch.length === 0) break;

    all.push(...batch);
    after = batch[batch.length - 1].user?.id ?? "0";

    if (batch.length < 1000) break;
  }

  return all;
}

/**
 * Convert a Discord guild member to the site's Member type.
 */
function toMember(dm: DiscordGuildMember, roleId: string): Member {
  const callsign =
    dm.nick ?? dm.user?.global_name ?? dm.user?.username ?? "Unknown";
  const role = ROLE_DISPLAY_NAMES[roleId] ?? roleId;
  const joinYear = dm.joined_at
    ? new Date(dm.joined_at).getFullYear()
    : 0;

  return {
    callsign,
    role,
    hours: 0,
    since: joinYear,
    discordId: dm.user?.id,
  };
}

/**
 * Filter members by role ID and convert to Member[].
 */
function membersWithRole(
  allMembers: DiscordGuildMember[],
  roleId: string,
): Member[] {
  return allMembers
    .filter((m) => m.roles.includes(roleId))
    .map((m) => toMember(m, roleId));
}

/**
 * Sort members by the custom featured order.
 * Members in FEATURED_ORDER appear first (in that order),
 * the rest follow alphabetically.
 */
function applyFeaturedOrder(members: Member[]): Member[] {
  if (FEATURED_ORDER.length === 0) return members;

  const orderMap = new Map(FEATURED_ORDER.map((name, i) => [name, i]));

  return [...members].sort((a, b) => {
    const aIdx = orderMap.get(a.callsign) ?? Infinity;
    const bIdx = orderMap.get(b.callsign) ?? Infinity;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.callsign.localeCompare(b.callsign);
  });
}

export interface RosterData {
  featured: Member[];
  squadLeads: Member[];
  members: Member[];
}

/**
 * Fetch roster data from Discord API.
 * Returns empty arrays on failure (caller should fall back to static data).
 */
export async function fetchRosterFromDiscord(): Promise<RosterData> {
  try {
    const allGuildMembers = await fetchAllGuildMembers();

    // Дуче → always first in featured, then В.О.Дуче
    const ducheMembers = membersWithRole(allGuildMembers, ROLE_DUCHE);
    const voDucheMembers = membersWithRole(allGuildMembers, ROLE_VO_DUCHE)
      .filter((m) => !ducheMembers.some((d) => d.discordId === m.discordId));
    const featured = applyFeaturedOrder([...ducheMembers, ...voDucheMembers]);
    const featuredIds = new Set(featured.map((m) => m.discordId));

    // officer RATS → squad leads (exclude anyone already in featured)
    const squadLeads = membersWithRole(allGuildMembers, ROLE_OFFICER).filter(
      (m) => !featuredIds.has(m.discordId),
    );
    const leaderIds = new Set([
      ...featuredIds,
      ...squadLeads.map((m) => m.discordId),
    ]);

    // RATS → regular members (exclude anyone already in featured or squad leads)
    const members = membersWithRole(allGuildMembers, ROLE_RATS).filter(
      (m) => !leaderIds.has(m.discordId),
    );

    return { featured, squadLeads, members };
  } catch (err) {
    console.error("Failed to fetch roster from Discord:", err);
    return { featured: [], squadLeads: [], members: [] };
  }
}
