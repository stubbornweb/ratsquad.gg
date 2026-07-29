# Research: Reading Apollo RSVP Data from a Discord Channel

**Date of research:** July 29, 2026  
**Scope:** Fetching scrim event RSVP rosters from Apollo event embeds via Discord REST API; evaluating feasibility for a clan roster builder.

---

## Summary

Reading Apollo RSVP data from Discord is technically feasible via the Discord REST API. The two critical blockers are both resolved:

1. **MESSAGE_CONTENT intent:** Embeds are gated by the MESSAGE_CONTENT privileged intent on the REST API. However, **unverified bots (in fewer than 75 servers, reaching fewer than 10,000 unique users) can access embeds without approval**—a self-serve toggle in the Developer Portal suffices. RATS, as a clan-only bot, qualifies. Verified bots in 100+ servers (or reaching 10,000+ users as of June 2026) face review barriers.

2. **Apollo embed schema:** Not documented in Apollo's primary sources (no public API docs, closed-source bot), so it was **verified empirically against a real event message from the clan's own channel on 2026-07-29**. The Accepted / Declined / Tentative fields carry **`<@id>` user mentions**, not display names — roster slots can key on Discord ID with no name matching. Field *names* are unstable (`<:emoji:id> Status (count)`), values are `>>> `-prefixed and newline-separated, and event time is a `<t:unix:F>` timestamp. See section 3.

**For message discovery:** Discord REST API does not support full-text search. Parse a message link or iterate recent channel messages by ID.

---

## 1. Fetching Messages from a Channel: Endpoint, Permissions, Scopes, Rate Limits

### Endpoint

**List channel messages:**  
`GET /channels/{channel.id}/messages`

**Get a single message:**  
`GET /channels/{channel.id}/messages/{message.id}`

Both endpoints return message objects containing embeds. [Source: Discord API Message Resource documentation](https://docs.discord.com/developers/resources/message) (fetched 2026-07-29)

### Bot Permissions (Required)

**Channel-level permissions:**
- `VIEW_CHANNEL` — required to read messages from the channel
- `READ_MESSAGE_HISTORY` — **required to receive messages in the list**; without it, an empty array is returned

If the channel is a voice channel, `CONNECT` is also required.

**Guild-level permissions:**  
The bot must be a member of the guild (managed via OAuth2 bot authorization). Once authorized, channel-level permissions apply per-channel.

[Source: Discord API Message Resource documentation](https://docs.discord.com/developers/resources/message) (fetched 2026-07-29)

### OAuth2 Scopes and Bot Authorization

Bot users do not use traditional OAuth2 scopes for API access. The only required scope is `bot`:

```
scope=bot
```

When adding a bot to a server, the admin grants permissions via Discord's permission interface. The OAuth2 flow with `scope=bot` triggers this. The bot's token (stored in `DISCORD_BOT_TOKEN` env var) then grants full API access to all endpoints the bot has permissions for in each guild.

There is no separate `messages.read` scope for bots—bots operate via token authentication, not bearer tokens.

[Source: Discord OAuth2 documentation](https://docs.discord.com/developers/topics/oauth2) (fetched 2026-07-29)

### Rate Limits

**Global rate limit:**  
50 requests per second across all bot endpoints. [Source: Discord Rate Limits documentation](https://docs.discord.com/developers/topics/rate-limits) (fetched 2026-07-29)

**Per-route rate limits:**  
Individual endpoints have per-route limits (e.g., channel-specific buckets). The exact limits for the `/channels/{channel.id}/messages` endpoint are **not hardcoded in Discord's documentation**—they vary and are subject to change.

**Implementation:** Parse the `X-RateLimit-*` response headers to detect limits. On HTTP 429 (rate limited), use the `Retry-After` header to backoff. Do not hardcode limits.

[Source: Discord Rate Limits documentation](https://docs.discord.com/developers/topics/rate-limits) (fetched 2026-07-29); [My Bot is Being Rate Limited FAQ](https://support-dev.discord.com/hc/en-us/articles/6223003921559-My-Bot-is-Being-Rate-Limited) (fetched 2026-07-29)

---

## 2. MESSAGE_CONTENT Privileged Intent: REST API Restrictions, Approval Process, and Visibility

### Does MESSAGE_CONTENT Gate Embeds on REST API?

**Yes, critical finding:** The MESSAGE_CONTENT intent blocks **embeds, content, attachments, and components** on REST API fetches—not only gateway events.

> "An app will receive empty values in the `content`, `embeds`, `attachments`, and `components` fields" (and poll will be omitted) without MESSAGE_CONTENT approval.

[Source: Discord Message Resource documentation](https://docs.discord.com/developers/resources/message) (fetched 2026-07-29); [Message Content Intent Alternatives](https://support-dev.discord.com/hc/en-us/articles/6383579033751-Message-Content-Intent-Alternatives-Workarounds) (fetched 2026-07-29)

### Self-Serve vs. Review: The 10,000 User Threshold (as of June 2026)

Discord changed the approval process on **June 10, 2026**. The threshold is now based on **unique users reachable by your app** across all servers, not server count.

**Self-serve (no review required):**
- App reaches fewer than 10,000 unique users across all servers it's installed in
- Toggle MESSAGE_CONTENT on in the Developer Portal—immediate access

**Requires review:**
- App reaches 10,000 or more unique users
- File a privileged intent access request
- Review timeline: Discord requires applications to apply within 90 days of notification; review duration is not specified in public docs
- Annual reapplication required: existing approval must be renewed annually or it expires

**Exception for unverified bots:**  
> "Unverified apps and bots will continue to be able to access message content without restrictions, just like presence and guild member data."

An unverified bot is one installed in fewer than 75 servers. RATS qualifies as unverified—**you can enable MESSAGE_CONTENT immediately without review**.

[Source: Changes to Privileged Intent Access (June 10, 2026)](https://support-dev.discord.com/hc/en-us/articles/40281523410967-Changes-to-Privileged-Intent-Access-for-Discord-Apps) (fetched 2026-07-29); [What are Privileged Intents?](https://support-dev.discord.com/hc/en-us/articles/6207308062871-What-are-Privileged-Intents) (fetched 2026-07-29)

### What Does a Bot See Without MESSAGE_CONTENT?

Without MESSAGE_CONTENT enabled (or approved):

| Field | Value |
|-------|-------|
| `content` | Empty string `""` |
| `embeds` | Empty array `[]` |
| `attachments` | Empty array `[]` |
| `components` | Empty array `[]` |
| `poll` | Omitted (not present in JSON) |

All other message fields (id, timestamp, author, etc.) remain available.

[Source: Discord Message Resource documentation](https://docs.discord.com/developers/resources/message) (fetched 2026-07-29)

---

## 3. Apollo Event RSVP Embed Schema: Field Structure and User Mentions vs. Display Names

### What I Could Verify

Apollo events use embeds with the following standard RSVP fields:
- **Accepted** — users who confirmed attendance
- **Declined** — users who declined  
- **Tentative** — users uncertain (maybe)
- **Custom roles** — additional sign-up categories defined by the event creator
- **Headcount** — total attendance counter
- Optional sub-fields for additional metadata

[Source: Apollo blog - Custom signup options](https://apollo.fyi/blog/custom-signup-options) (fetched 2026-07-29); multiple bot listing sites confirm these fields exist.

### VERIFIED EMPIRICALLY: The fields carry user mentions

This could not be answered from any published source — Apollo does not document an embed
schema and the bot is closed-source ([Apollo GitHub organization](https://github.com/apollo-fyi),
fetched 2026-07-29; docs.apollo.fyi times out). It was settled instead by fetching a real
event message from the clan's own archived scrim channel on 2026-07-29 via
`GET /channels/{channel.id}/messages`.

**The RSVP fields contain `<@id>` user mentions, not display names.** Roster slots can key on
Discord ID and join directly to player rows; no name matching, no fuzzy matching, and the
rename problem does not arise.

Observed shape (member IDs replaced with placeholders, structure otherwise faithful):

```json
{
  "type": "rich",
  "title": "1",
  "description": "20R vs RATS\nDate: 30.05\nTime (Match) 18:00 UTC\nSize: 26v26\nMap: SEC 26 Black cost\nServer: \nRules: SEC Rules",
  "color": 15844367,
  "fields": [
    { "name": "Time", "inline": false,
      "value": "<t:1780164000:F> [[+]](http://www.google.com/calendar/event?action=TEMPLATE&...) [[View on web]](https://app.apollo.fyi/workspaces/{workspaceId}/events/{eventId})\n<:countdown:878391707727716413> <t:1780164000:R>" },
    { "name": "<:accepted:713124484436983971> Accepted (22)", "inline": true,
      "value": ">>> <@100000000000000001>\n<@100000000000000002>\n<@100000000000000003>" },
    { "name": "<:declined:713124484688642068> Declined (18)", "inline": true,
      "value": ">>> <@100000000000000023>\n<@100000000000000024>" },
    { "name": "<:tentative:713214962641666109> Tentative (3)", "inline": true,
      "value": ">>> <@100000000000000041>" }
  ],
  "footer": { "text": "Created by MOP" }
}
```

Consequences for a parser:

- **Field names are not stable keys.** They are `<:emoji:id> Status (count)` — the status word
  plus a live count, wrapped in a custom emoji. Match on the emoji ID or a substring, never on
  string equality.
- **Values are blockquote-prefixed.** A leading `>>> ` on the first line only, then mentions
  separated by `\n`. Extract with `/<@(\d+)>/g` and ignore the rest.
- **Time is machine-readable.** `<t:1780164000:F>` is a Unix timestamp — no date parsing. The
  same field carries an `app.apollo.fyi/workspaces/{ws}/events/{id}` link, so Apollo's own
  event ID is recoverable.
- **Everything else is freeform prose.** The observed `title` was `"1"`; matchup, size, map and
  rules are unstructured lines in `description`. Do not build on them.
- **Apollo edits the message in place as votes arrive.** The sample's `edited_timestamp` was
  four days after its `timestamp`. Any cached RSVP list goes stale silently, and Apollo's
  buttons (`components` with `signup:<id>` custom IDs) belong to Apollo — their clicks are not
  observable. Reading RSVPs is therefore a poll, not an event subscription.

**MESSAGE_CONTENT was already enabled** on the existing bot: the fetch returned populated
`embeds`, which per section 2 would be empty without the intent.

---

## 4. Finding the Right Message: Polling, Matching, and Message Link Parsing

### Option A: Manual Message Link Paste (Most Practical)

**Discord message link format:**
```
https://discord.com/channels/{guild_id}/{channel_id}/{message_id}
```

**Parsing from a link:**  
Extract the three numeric IDs from the URL path. Discord stores IDs as snowflakes (serialized as strings in JSON).

**REST API fetch:**  
```
GET /channels/{channel_id}/messages/{message_id}
Authorization: Bot {DISCORD_BOT_TOKEN}
```

This requires a human (squad leader) to right-click an Apollo event message and copy the link. Paste in a form or text field, and parse the URL.

[Source: Discord Support - Where can I find my User/Server/Message ID?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID) (fetched 2026-07-29)

### Option B: Poll Recent Channel Messages (Automatic)

**Iterate recent messages:**  
```
GET /channels/{channel_id}/messages?limit=100&after={last_message_id}
```

This fetches up to 100 messages (newest first). Use pagination (`after` parameter with a message ID to resume from a prior checkpoint) to crawl the channel history.

**Match by content:**  
Search embeds for Apollo event messages. Look for:
- Author name containing "Apollo" or bot-specific signature
- Embed title matching the event name (e.g., "Tuesday Scrim")
- Presence of Accepted/Declined/Tentative fields

**Limitation:**  
Discord REST API has **no full-text search endpoint**. You must poll messages and match in application code.

[Source: Discord API Reference](https://docs.discord.com/developers/reference) (fetched 2026-07-29); Support articles on message search note that REST API lacks search: only Discord's client has search UI, which uses internal Elasticsearch infrastructure not exposed via API.

### Option C: Scheduled Polling (Background Task)

Periodically fetch messages from the scrim-announcements channel and cache recent events. Pros: no manual link-pasting, up-to-date roster. Cons: runs on a schedule (not real-time), network calls on every poll.

Given Vercel Functions are ephemeral (no daemons), a scheduled External HTTP endpoint or a Vercel Cron-like trigger would be needed—but this is an implementation detail, not an API limitation.

---

## 5. Apollo Event Metadata Beyond RSVPs: Title, Description, Time

Where Apollo stores event metadata in the embed:

| Field | Likely Location |
|-------|-----------------|
| **Event title** | Embed `title` field |
| **Event description** | Embed `description` field |
| **Event time** | Embed field with name "Time" or "When", or in description |
| **Event location/map** | Embed field with name "Location" or "Map" |

Discord embed structure limits:
- `title`: max 256 characters
- `description`: max 4096 characters
- Each embed `field`: name max 256, value max 1024
- Max 25 fields per embed
- Total across all embeds on message: 6000 characters

[Source: Discord Embed Structure documentation](https://docs.discord.com/developers/resources/message) (fetched 2026-07-29)

**Verification:** Inspect an actual Apollo event embed JSON to confirm field names and positions. They vary by bot and may differ from defaults.

---

## 6. Manual-Paste Fallback: What Parsing Must Handle

If Apollo changes their embed layout mid-scrim (or to support flexibility), a fallback for manual RSVP entry would need to parse:

### Input Format Options

**Option 1: Discord Message JSON**  
User exports/shares the raw JSON of a message (via API client tools or debugging). Your app parses:
- `message.embeds[0].fields` array
- Extract field names (Accepted, Declined, Tentative, etc.)
- Extract field values (list of user mentions or names)

**Option 2: Plaintext Paste (From Discord Embed Display)**  
User copy-pastes the embed as displayed (manually). Parse:
- Lines containing mentions or names
- Regex for Discord mention format: `<@(\d+)>` (captures user ID)
- Regex for names: alphanumeric + special characters (unicode support)

**Example plaintext:**
```
Accepted:
<@123456789> HeresJohnny
<@987654321> Creep-ak

Declined:
<@555555555> AFK_Guy
```

### Parser Needs

1. **User ID extraction:** Regex `<@(\d+)>` to pull user IDs from mentions
2. **Name extraction:** Handle display names with unicode (Cyrillic for Ukrainian clan members), parentheses, special chars
3. **Field mapping:** Infer Accepted/Declined/Tentative from field names (robust to capitalization, whitespace)
4. **Ambiguity handling:** If both mentions and names appear, prioritize mentions (more robust)

### Fragility Factors

- **If Apollo uses names only:** Unicode, parentheses, renames break matching. Fuzzy matching (Levenshtein distance) would be needed.
- **If Apollo mixes mentions and names:** Some rows will be robust (mentions), others fragile (names).
- **If Apollo changes field format:** Hardcoded parsing breaks. Use a schema inference approach (detect field patterns) or require user confirmation.

---

## Implementation Roadmap

### Phase 1: Verify Apollo Embed Structure (Blocking)

1. Fetch an actual scrim event message from your clan's announcements channel
2. Call `GET /channels/{channel_id}/messages/{message_id}` with the Apollo bot token
3. Inspect `response.json()['embeds'][0]['fields']`
4. **Confirm:** Do field values contain `<@userID>` (mentions) or plain names?

This single fact determines the robustness of your RSVP import.

### Phase 2: Enable MESSAGE_CONTENT Intent

1. Go to Discord Developer Portal → your RATS bot
2. Enable "Message Content Intent" in the "Privileged Gateway Intents" section
3. No approval process required (RATS is unverified)

### Phase 3: Implement Message Fetch

Build a route handler or server function:

```typescript
async function getApolloEventMessage(guildId: string, channelId: string, messageId: string) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
  });

  if (!res.ok) {
    console.error(`Discord API error: ${res.status} ${res.statusText}`);
    return null;
  }

  const message = await res.json();
  if (!message.embeds || message.embeds.length === 0) {
    console.warn('Message has no embeds');
    return null;
  }

  return message.embeds[0]; // Return the first embed
}
```

### Phase 4: Parse RSVP Fields

Extract Accepted/Declined/Tentative fields and reconcile names/mentions against guild members.

### Phase 5: Fallback

If Phase 1 reveals plain names, implement manual-paste with fuzzy matching, or require users to paste the API response JSON.

---

## Open Questions / Could Not Verify

_Items 1 and 2 below were the original blockers; both were closed empirically on 2026-07-29 (see section 3). They are kept here as resolved, with what the single sample could not tell us._

1. ~~**Exact Apollo embed field names.**~~ Resolved: `<:accepted:713124484436983971> Accepted (22)` and the equivalents for Declined / Tentative. **Still open:** whether the status words are localised per workspace, and whether the emoji IDs are stable across Apollo versions.

2. ~~**User mention vs. name format.**~~ Resolved: `<@id>` mentions.

3. **Apollo's custom role fields:** Structure and naming convention for custom attendance categories. The sampled event used only the three default fields, so a custom-signup event has not been observed. Likely documented in Apollo's bot help commands, not public API docs.

3a. **One sample, one event type.** Everything in section 3 comes from a single 26v26 scrim message. Recurring events, custom signup options, and events with a headcount field may differ.

4. **Message Content Intent review timeline:** How long does Discord take to review a Privileged Intent access request for apps in 75+ servers? Public docs don't specify.

5. **Discord per-route rate limits for messages endpoint:** Specific numeric limits (e.g., 5 req/s per channel, 10 req/s per guild) are not published. Must infer from response headers at runtime.

6. **Apollo API stability:** Apollo's embed schema could change with bot updates. No official versioning or changelog visible in public docs.

7. **Clan member name stability:** Whether Discord nicknames or global usernames are more stable. Nicknames are guild-specific; global usernames changed rules in 2023 (migration from discriminators). Relevant if Apollo uses either.

---

## Key Sources

- [Discord API Message Resource](https://docs.discord.com/developers/resources/message) — Endpoint specs, message and embed objects, MESSAGE_CONTENT gating
- [Discord API Channels Resource](https://docs.discord.com/developers/resources/channel) — Channel permissions and message fetching details
- [Discord OAuth2 Documentation](https://docs.discord.com/developers/topics/oauth2) — Bot authorization, scopes
- [Discord Rate Limits](https://docs.discord.com/developers/topics/rate-limits) — Global and per-route rate limiting, backoff strategy
- [Changes to Privileged Intent Access (June 2026)](https://support-dev.discord.com/hc/en-us/articles/40281523410967-Changes-to-Privileged-Intent-Access-for-Discord-Apps) — 10,000 user threshold, unverified bot exception
- [What are Privileged Intents?](https://support-dev.discord.com/hc/en-us/articles/6207308062871-What-are-Privileged-Intents) — Explanation of MESSAGE_CONTENT and gateway vs. REST
- [Message Content Intent Alternatives](https://support-dev.discord.com/hc/en-us/articles/6383579033751-Message-Content-Intent-Alternatives-Workarounds) — Workarounds and what's visible without the intent
- [Where can I find my User/Server/Message ID?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID) — Message link format and ID extraction
- [Apollo bot homepage](https://apollo.fyi) — General info; detailed RSVP schema not documented publicly
- [Apollo GitHub](https://github.com/apollo-fyi) — Source repositories; core bot is closed-source

---

**Last fetched:** July 29, 2026  
**Next review date:** Recommended when Vercel or Discord API versioning changes, or when RATS integrates with Apollo for the first time (to verify embed structure empirically).
