/**
 * Measure the Discord limits the recruitment ticket design turns on.
 *
 * Produced every figure in `docs/research/discord-limits-measured.md`, which is
 * a snapshot — the guild numbers move weekly. Re-run this before trusting them.
 *
 *   node --env-file=.env.production scripts/probe-discord-limits.mjs 1139847863950639185
 *   node --env-file=.env.development scripts/probe-discord-limits.mjs --thread-test
 *
 * The guild id defaults to DISCORD_GUILD_ID, which only .env.development sets;
 * the production guild id lives in src/consts/discord.ts and is passed
 * explicitly, so that pointing this at the real guild is always deliberate.
 *
 * `--thread-test` creates a private and a public thread and deletes both. It is
 * how the Boost Level 2 question was settled, and it writes to the guild — so it
 * is opt-in, and belongs nowhere near production.
 */

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const args = process.argv.slice(2);
const THREAD_TEST = args.includes("--thread-test");
const GUILD = args.find((a) => !a.startsWith("--")) ?? process.env.DISCORD_GUILD_ID;

if (!TOKEN || !GUILD) {
  console.error("Usage: node --env-file=<env> scripts/probe-discord-limits.mjs [guildId] [--thread-test]");
  console.error("Requires DISCORD_BOT_TOKEN, and a guild id as argument or DISCORD_GUILD_ID.");
  process.exit(1);
}

/** https://docs.discord.com/developers/resources/channel#channel-object-channel-types */
const TYPES = {
  0: "text", 2: "voice", 4: "category", 5: "announcement",
  10: "announcement_thread", 11: "public_thread", 12: "private_thread",
  13: "stage", 14: "directory", 15: "forum", 16: "media",
};

/** Help-centre-grade, never in the developer docs. Do not hardcode elsewhere. */
const REPORTED_GUILD_CHANNEL_CAP = 500;
const REPORTED_CATEGORY_CAP = 50;
const REPORTED_CHANNELS_PER_CATEGORY = 50;

const api = async (path, init) => {
  const res = await fetch(`https://discord.com/api/v10${path}`, {
    ...init,
    headers: { Authorization: `Bot ${TOKEN}`, "Content-Type": "application/json", ...init?.headers },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { ok: res.ok, status: res.status, body };
};

const guild = await api(`/guilds/${GUILD}?with_counts=true`);
if (!guild.ok) {
  console.error(`Discord API error: ${guild.status}`, guild.body);
  process.exit(1);
}

console.log(`\n=== ${guild.body.name} (${guild.body.id}) — ${new Date().toISOString().slice(0, 10)} ===\n`);
console.log(`  boost level      ${guild.body.premium_tier} (${guild.body.premium_subscription_count} boosts)`);
console.log(`  members          ~${guild.body.approximate_member_count}`);

const channels = (await api(`/guilds/${GUILD}/channels`)).body;
const counts = {};
for (const c of channels) {
  const t = TYPES[c.type] ?? String(c.type);
  counts[t] = (counts[t] ?? 0) + 1;
}
const categories = counts.category ?? 0;

console.log("\n--- channels ---\n");
for (const [t, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t.padEnd(20)} ${String(n).padStart(4)}`);
}
console.log(`  ${"TOTAL".padEnd(20)} ${String(channels.length).padStart(4)} / ${REPORTED_GUILD_CHANNEL_CAP}` +
  `  — ${REPORTED_GUILD_CHANNEL_CAP - channels.length} left`);
console.log(`  ${"categories".padEnd(20)} ${String(categories).padStart(4)} / ${REPORTED_CATEGORY_CAP}`);

// Snowflakes carry a creation timestamp, which is the only way to see how fast
// the cap is being consumed: Discord reports no quota and no history.
const DISCORD_EPOCH = 1420070400000n;
const createdAt = (id) => new Date(Number((BigInt(id) >> 22n) + DISCORD_EPOCH));
const dates = channels.map((c) => createdAt(c.id)).sort((a, b) => a - b);

console.log("\n--- growth (survivors only: a deleted channel leaves no trace) ---\n");
const perYear = {};
for (const d of dates) perYear[d.getUTCFullYear()] = (perYear[d.getUTCFullYear()] ?? 0) + 1;
for (const [y, n] of Object.entries(perYear)) console.log(`  ${y}  ${String(n).padStart(4)} created`);
const summed = Object.values(perYear).reduce((a, b) => a + b, 0);
console.log(`  ${"".padEnd(4)}  ${String(summed).padStart(4)} total` +
  (summed === channels.length ? "  — equals the live count: nothing has ever been deleted" : ""));

const now = Date.now();
let worst = 0;
for (const days of [30, 90, 180, 365]) {
  const n = dates.filter((d) => now - d < days * 864e5).length;
  const perWeek = (n / days) * 7;
  worst = Math.max(worst, perWeek);
  console.log(`  last ${String(days).padStart(3)}d: ${String(n).padStart(4)}   ${perWeek.toFixed(1)}/week`);
}
const headroom = REPORTED_GUILD_CHANNEL_CAP - channels.length;
console.log(`\n  at the fastest observed rate, ${headroom} channels of headroom is ` +
  `~${(headroom / worst).toFixed(0)} weeks`);

const named = new Map(channels.filter((c) => c.type === 4).map((c) => [c.id, c.name]));
const perCategory = {};
for (const c of channels) {
  if (c.type === 4) continue;
  const k = named.get(c.parent_id) ?? "(no category)";
  perCategory[k] = (perCategory[k] ?? 0) + 1;
}
console.log(`\n--- fullest categories (cap ${REPORTED_CHANNELS_PER_CATEGORY}) ---\n`);
for (const [k, n] of Object.entries(perCategory).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  console.log(`  ${String(n).padStart(3)}  ${k}${n >= REPORTED_CHANNELS_PER_CATEGORY ? "   ← full" : ""}`);
}

const threads = await api(`/guilds/${GUILD}/threads/active`);
if (threads.ok) {
  const list = threads.body.threads ?? [];
  const tc = {};
  for (const t of list) {
    const k = TYPES[t.type] ?? String(t.type);
    tc[k] = (tc[k] ?? 0) + 1;
  }
  // Threads are exempt from the channel cap; their own cap is real but Discord
  // has never published the figure. 1000 is the community number.
  console.log(`\n--- active threads: ${list.length} (~1000 reported cap) ---\n`);
  for (const [k, n] of Object.entries(tc)) console.log(`  ${k.padEnd(20)} ${String(n).padStart(4)}`);
}

if (!THREAD_TEST) {
  console.log("\n(pass --thread-test to re-run the private-thread creation test — writes to the guild)\n");
  process.exit(0);
}

const parent = channels.find((c) => c.type === 0);
console.log(`\n--- thread creation test in #${parent.name} ---\n`);
for (const [label, type] of [["PRIVATE_THREAD", 12], ["PUBLIC_THREAD", 11]]) {
  const made = await api(`/channels/${parent.id}/threads`, {
    method: "POST",
    body: JSON.stringify({ name: `probe-${type}`, type, invitable: false, auto_archive_duration: 60 }),
  });
  console.log(`  ${label.padEnd(16)} -> ${made.status}` +
    (made.ok ? "" : `  ${JSON.stringify(made.body)}`));
  if (made.ok) {
    const gone = await api(`/channels/${made.body.id}`, { method: "DELETE" });
    console.log(`  ${"".padEnd(16)}    cleaned up -> ${gone.status}`);
  }
}
console.log();
