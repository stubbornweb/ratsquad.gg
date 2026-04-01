/**
 * Discord Role Discovery Script
 *
 * Lists all roles in the RATS EU Discord server with their IDs.
 * Run: npx tsx scripts/list-discord-roles.ts
 *
 * Requires DISCORD_BOT_TOKEN environment variable.
 */

const GUILD_ID = "1139847863950639185";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("ERROR: DISCORD_BOT_TOKEN environment variable is required.");
  console.error("Usage: DISCORD_BOT_TOKEN=your_token npx tsx scripts/list-discord-roles.ts");
  process.exit(1);
}

interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
}

async function fetchRoles(): Promise<void> {
  const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/roles`;

  const res = await fetch(url, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  });

  if (!res.ok) {
    console.error(`Discord API error: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.error(body);
    process.exit(1);
  }

  const roles: DiscordRole[] = await res.json();

  // Sort by position (highest first, like Discord UI)
  roles.sort((a, b) => b.position - a.position);

  console.log("\n=== RATS EU Discord Roles ===\n");
  console.log("Position | ID                 | Name");
  console.log("---------+--------------------+-------------------------");

  for (const role of roles) {
    const pos = String(role.position).padStart(8);
    const id = role.id.padEnd(18);
    console.log(`${pos} | ${id} | ${role.name}`);
  }

  console.log(`\nTotal: ${roles.length} roles`);
  console.log("\nCopy the IDs you need into src/consts/discord.ts");
}

fetchRoles();
