/**
 * Discord Channel Discovery Script
 *
 * Lists every channel in the RATS EU Discord server with its ID, grouped by
 * category. Use it to find the event channel (Apollo RSVP embeds) and the
 * anketa channel, then record both in src/consts/discord.ts.
 *
 * Run: npx tsx --env-file=.env.local scripts/list-discord-channels.ts
 *
 * Requires DISCORD_BOT_TOKEN.
 */

import { DISCORD_GUILD_ID } from "../src/consts/discord";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("ERROR: DISCORD_BOT_TOKEN environment variable is required.");
  console.error(
    "Usage: npx tsx --env-file=.env.local scripts/list-discord-channels.ts",
  );
  process.exit(1);
}

/** https://discord.com/developers/docs/resources/channel#channel-object-channel-types */
const CHANNEL_TYPES: Record<number, string> = {
  0: "text",
  2: "voice",
  4: "category",
  5: "announcement",
  13: "stage",
  15: "forum",
};

interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  parent_id: string | null;
  position: number;
}

async function fetchChannels(): Promise<void> {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/channels`,
    { headers: { Authorization: `Bot ${BOT_TOKEN}` } },
  );

  if (!res.ok) {
    console.error(`Discord API error: ${res.status} ${res.statusText}`);
    console.error(await res.text());
    process.exit(1);
  }

  const channels: DiscordChannel[] = await res.json();
  const categories = channels.filter((c) => c.type === 4);
  const named = new Map(categories.map((c) => [c.id, c.name]));

  const grouped = new Map<string, DiscordChannel[]>();
  for (const channel of channels) {
    if (channel.type === 4) continue;
    const key = channel.parent_id ?? "";
    const bucket = grouped.get(key) ?? [];
    bucket.push(channel);
    grouped.set(key, bucket);
  }

  console.log("\n=== RATS EU Discord Channels ===\n");

  for (const [parentId, members] of grouped) {
    console.log(`\n[${named.get(parentId) ?? "no category"}]`);
    members.sort((a, b) => a.position - b.position);
    for (const channel of members) {
      const type = (CHANNEL_TYPES[channel.type] ?? String(channel.type)).padEnd(
        12,
      );
      console.log(`  ${channel.id.padEnd(20)} ${type} ${channel.name}`);
    }
  }

  console.log(`\nTotal: ${channels.length - categories.length} channels`);
  console.log("\nRecord the event and anketa channel IDs in src/consts/discord.ts");
}

fetchChannels();
