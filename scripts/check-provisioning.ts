/**
 * Provisioning Check (issue #14)
 *
 * Verifies everything the provisioning ticket asks for, against the live
 * services rather than a checklist someone ticked by hand:
 *
 *   1. every credential is present, and none leaked into NEXT_PUBLIC_*
 *   2. the Turso database answers with the recorded token
 *   3. the recorded channel IDs resolve to real channels
 *   4. the bot has Send Messages + Manage Messages in the event channel
 *      and NOWHERE else
 *   5. the MESSAGE_CONTENT intent is on (embeds come back populated)
 *
 * Run: make check-provisioning
 *
 * Every group runs on whatever credentials it has, so a half-provisioned setup
 * still reports on all of them. Exits non-zero if anything failed.
 */

import {
  CHANNEL_APPLICATIONS,
  CHANNEL_EVENT,
  DISCORD_GUILD_ID,
} from "../src/consts/discord";
import {
  PERMISSION,
  auditBotChannelGrant,
  can,
  type GuildChannel,
} from "../src/lib/discord-permissions";
import { readServerEnv } from "../src/lib/env";

const API = "https://discord.com/api/v10";
const ADMIN = PERMISSION.ADMINISTRATOR;
/** https://discord.com/developers/docs/resources/channel — 4 is a category. */
const CHANNEL_TYPE_CATEGORY = 4;

let failed = false;

function pass(message: string) {
  console.log(`  [32mPASS[0m  ${message}`);
}

function fail(message: string) {
  failed = true;
  console.log(`  [31mFAIL[0m  ${message}`);
}

function skip(message: string) {
  console.log(`  [33mSKIP[0m  ${message}`);
}

function section(title: string) {
  console.log(`\n${title}`);
}

async function discord<T>(path: string, token: string): Promise<T | null> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) {
    fail(`GET ${path} → ${res.status} ${res.statusText}`);
    return null;
  }
  return (await res.json()) as T;
}

// --- 1. Credentials ------------------------------------------------------

function checkEnv(): void {
  section("Credentials");

  const result = readServerEnv(process.env);
  if (result.ok) {
    pass("all six credentials present, none under NEXT_PUBLIC_");
    return;
  }

  for (const problem of result.problems) {
    const reason = {
      missing: "not set (add it to .env.local and Vercel)",
      exposed: "found under NEXT_PUBLIC_ — it would ship to the browser",
      invalid: "set but malformed",
    }[problem.reason];
    fail(`${problem.key}: ${reason}`);
  }
}

// --- 2. Turso ------------------------------------------------------------

async function checkTurso(url: string, token: string): Promise<void> {
  section("Turso");

  if (!url || !token) {
    skip("no database URL or token yet — see docs/setup/provisioning.md §1");
    return;
  }

  if (url.startsWith("file:")) {
    skip("TURSO_DATABASE_URL points at a local file — nothing to reach");
    return;
  }

  // Hrana over HTTP: the protocol Vercel Functions must use.
  const endpoint = `${url.replace(/^libsql:/, "https:")}/v2/pipeline`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql: "select 1" } },
        { type: "close" },
      ],
    }),
  });

  if (!res.ok) {
    fail(`database did not answer: ${res.status} ${res.statusText}`);
    return;
  }
  const body = (await res.json()) as {
    results?: { type: string; error?: { message: string } }[];
  };
  const error = body.results?.find((r) => r.type === "error");
  if (error) {
    fail(`database rejected the query: ${error.error?.message}`);
    return;
  }
  pass("database reachable and the auth token works");
}

// --- 3–5. Discord --------------------------------------------------------

interface BotUser {
  id: string;
  username: string;
}
interface GuildRole {
  id: string;
  name: string;
  permissions: string;
}
interface GuildMember {
  roles: string[];
}

async function checkDiscord(token: string): Promise<void> {
  section("Discord bot");

  if (!token) {
    skip("no bot token — nothing else can be checked");
    return;
  }

  const me = await discord<BotUser>("/users/@me", token);
  if (!me) return;
  pass(`authenticated as ${me.username}`);

  const [member, roles, allChannels] = await Promise.all([
    discord<GuildMember>(`/guilds/${DISCORD_GUILD_ID}/members/${me.id}`, token),
    discord<GuildRole[]>(`/guilds/${DISCORD_GUILD_ID}/roles`, token),
    discord<(GuildChannel & { type: number })[]>(
      `/guilds/${DISCORD_GUILD_ID}/channels`,
      token,
    ),
  ]);
  if (!member || !roles || !allChannels) return;

  // Nothing is posted in a category, so one cannot be overreach.
  const channels = allChannels.filter(
    (c) => c.type !== CHANNEL_TYPE_CATEGORY,
  );

  // Guild-wide base permissions: @everyone plus every role the bot holds.
  const held = new Set([DISCORD_GUILD_ID, ...member.roles]);
  const basePermissions = roles
    .filter((r) => held.has(r.id))
    .reduce((acc, r) => acc | BigInt(r.permissions), 0n);

  section("Channel IDs");
  const applications = channels.find((c) => c.id === CHANNEL_APPLICATIONS);
  if (applications) {
    pass(`CHANNEL_APPLICATIONS → #${applications.name}`);
  } else {
    fail(`CHANNEL_APPLICATIONS (${CHANNEL_APPLICATIONS}) is not in this guild`);
  }

  if (!CHANNEL_EVENT) {
    fail(
      "CHANNEL_EVENT is empty — record the Apollo RSVP channel ID in src/consts/discord.ts",
    );
    return;
  }
  const event = channels.find((c) => c.id === CHANNEL_EVENT);
  if (!event) {
    fail(`CHANNEL_EVENT (${CHANNEL_EVENT}) is not in this guild`);
    return;
  }
  pass(`CHANNEL_EVENT → #${event.name}`);

  section("Bot permissions (the escalation)");
  const audit = auditBotChannelGrant({
    guildId: DISCORD_GUILD_ID,
    userId: me.id,
    roleIds: member.roles,
    basePermissions,
    eventChannelId: CHANNEL_EVENT,
    channels,
  });

  if (audit.isAdministrator) {
    fail(
      "the bot holds guild-wide ADMINISTRATOR — it can write in every channel, " +
        "and no channel-scoped grant means anything until that is removed",
    );
    const adminRoles = roles
      .filter((r) => held.has(r.id) && can(BigInt(r.permissions), ADMIN))
      .map((r) => r.name);
    console.log(`          via role(s): ${adminRoles.join(", ")}`);
  }

  if (audit.eventChannel.canSend) {
    pass(`Send Messages in #${event.name}`);
  } else {
    fail(`no Send Messages in #${event.name}`);
  }
  if (audit.eventChannel.canManage) {
    pass(`Manage Messages in #${event.name}`);
  } else {
    fail(`no Manage Messages in #${event.name}`);
  }

  if (audit.overreach.length === 0) {
    pass("no write access in any other channel");
  } else {
    fail(
      `write access leaks into ${audit.overreach.length} other channel(s) — the grant must be scoped to the event channel:`,
    );
    for (const channel of audit.overreach.slice(0, 10)) {
      const granted = [
        channel.canSend && "Send Messages",
        channel.canManage && "Manage Messages",
      ]
        .filter(Boolean)
        .join(" + ");
      console.log(`          #${channel.name} (${granted})`);
    }
    if (audit.overreach.length > 10) {
      console.log(`          … and ${audit.overreach.length - 10} more`);
    }
  }

  section("MESSAGE_CONTENT intent");
  const messages = await discord<
    { id: string; content: string; embeds: unknown[] }[]
  >(`/channels/${CHANNEL_EVENT}/messages?limit=25`, token);
  if (!messages) return;
  if (messages.length === 0) {
    skip(`#${event.name} is empty — cannot tell whether embeds come back`);
    return;
  }
  // Without the intent Discord blanks content, embeds and attachments on
  // REST reads. Any populated field proves the intent is on.
  const populated = messages.some((m) => m.content || m.embeds.length > 0);
  if (populated) {
    pass("embeds and content come back populated — intent is enabled");
  } else {
    fail(
      `every message in #${event.name} came back blank — enable Message Content in the Developer Portal`,
    );
  }
}

async function main() {
  checkEnv();

  // Each section runs on the credentials it needs, so a half-provisioned setup
  // still reports on every group instead of stopping at the first gap.
  await checkTurso(
    process.env.TURSO_DATABASE_URL?.trim() ?? "",
    process.env.TURSO_AUTH_TOKEN?.trim() ?? "",
  );
  await checkDiscord(process.env.DISCORD_BOT_TOKEN?.trim() ?? "");

  console.log(
    failed
      ? "\nProvisioning incomplete — see docs/setup/provisioning.md\n"
      : "\nProvisioning complete.\n",
  );
  process.exit(failed ? 1 : 0);
}

main();
