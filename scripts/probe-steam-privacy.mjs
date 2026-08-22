/**
 * Estimate the share of players whose Steam profile is public.
 *
 * Issue #57's application reads Squad playtime from Steam and only falls back to
 * asking the player. That pays off only if «Game details» is public for most
 * applicants, and the real-world rate is unknown — see the open section of
 * `docs/research/discord-limits-measured.md`.
 *
 * Reading playtime needs a Steam Web API key this project does not have, and the
 * old keyless route (`/games?tab=all&xml=1`) now redirects to a login page. But
 * the *profile* XML is still keyless and reports privacy, which gives an upper
 * bound for free: a non-public profile certainly cannot be read, a public one
 * probably can. `privacyState` is whole-profile privacy, not the «Game details»
 * sub-setting, so treat a public result as "probably readable", not "readable".
 *
 *   node scripts/probe-steam-privacy.mjs 76561198000000000 https://steamcommunity.com/id/someone
 *
 * Accepts SteamID64s, /profiles/<id> URLs, /id/<vanity> URLs, and bare vanity
 * names — the same three shapes #57 asks the form to resolve.
 */

const inputs = process.argv.slice(2);

if (inputs.length === 0) {
  console.error("Usage: node scripts/probe-steam-privacy.mjs <steamid64 | profile url | vanity>...");
  console.error("Collect 10-15 from current members to settle #57's open question.");
  process.exit(1);
}

/** Steam answers non-browser agents inconsistently; this is the one it likes. */
const UA = "Mozilla/5.0";

/**
 * Steam exposes two profile URL shapes, and the XML endpoint hangs off both —
 * so resolving a vanity name needs no API key and no separate lookup call.
 */
function toXmlUrl(input) {
  const trimmed = input.trim().replace(/\/+$/, "");
  const id64 = trimmed.match(/^(?:https?:\/\/steamcommunity\.com\/profiles\/)?(\d{17})$/);
  if (id64) return `https://steamcommunity.com/profiles/${id64[1]}/?xml=1`;
  const vanity = trimmed.match(/^(?:https?:\/\/steamcommunity\.com\/id\/)?([A-Za-z0-9_-]+)$/);
  if (vanity) return `https://steamcommunity.com/id/${vanity[1]}/?xml=1`;
  return null;
}

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`));
  return m ? m[1].trim() : null;
};

const results = [];

for (const input of inputs) {
  const url = toXmlUrl(input);
  if (!url) {
    console.log(`  ${input.padEnd(40)} unrecognised`);
    results.push({ input, privacy: "unrecognised" });
    continue;
  }

  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  const xml = await res.text();
  const privacy = tag(xml, "privacyState");
  const persona = tag(xml, "steamID");
  const id64 = tag(xml, "steamID64");

  if (!privacy) {
    // No <profile> means the vanity does not resolve, or Steam bounced us.
    console.log(`  ${input.padEnd(40)} no profile (${res.status})`);
    results.push({ input, privacy: "missing" });
    continue;
  }

  console.log(`  ${(persona ?? input).padEnd(30)} ${id64 ?? "".padEnd(17)}  ${privacy}`);
  results.push({ input, persona, id64, privacy });

  // Steam rate-limits community pages aggressively; this is a survey, not a
  // hot path, so pace it rather than risk a temporary block.
  await new Promise((r) => setTimeout(r, 1000));
}

const resolved = results.filter((r) =>
  ["public", "friendsonly", "private"].includes(r.privacy),
);
const publicCount = resolved.filter((r) => r.privacy === "public").length;
const share = resolved.length === 0 ? 0 : Math.round((publicCount / resolved.length) * 100);

console.log(`\n  ${publicCount} of ${resolved.length} profiles public${resolved.length ? ` (${share}%)` : ""}`);
console.log("  A public profile is an upper bound on readable playtime, not a guarantee.\n");
