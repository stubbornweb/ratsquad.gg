# Provisioning checklist (issue #14)

Everything the platform work depends on, and where each credential lives. The
portal and dashboard steps below cannot be automated — do them by hand, then run:

```bash
make check-provisioning
```

That command verifies the result against the live services. Treat it, not this
document, as the definition of "done".

---

## 1. Turso

**Where:** <https://app.turso.tech> (or the `turso` CLI).

1. Create a group and a database — one region, EU, matching the clan's players.
   ```bash
   turso auth login
   turso group create rats --location fra
   turso db create rats-site --group rats
   ```
2. Read the connection URL and mint a token:
   ```bash
   turso db show rats-site --url        # → libsql://rats-site-<org>.turso.io
   turso db tokens create rats-site     # → the auth token, shown once
   ```
3. Record both:
   - `.env.local` → `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
   - Vercel → Settings → Environment Variables → the same two names, for
     **Production, Preview and Development**.

**Plan:** the Free tier (500M row reads, 10M writes, 5 GB, 1 group) is far
beyond 40 players. Its one real limit is a **1-day** point-in-time restore
window; Developer ($4.99/mo) raises that to 10 days. See
`docs/research/turso-on-vercel.md`.

---

## 2. Discord OAuth application

**Where:** <https://discord.com/developers/applications>.

Use the **existing** RATS application — the one whose bot token already powers
the roster. A second application would mean a second bot in the guild.

1. **OAuth2 → Redirects.** Add all three, exactly, with no trailing slash.
   Discord matches redirect URIs character for character.
   - `http://localhost:3000/api/auth/callback`
   - `https://<stable-preview-alias>/api/auth/callback`
   - `https://ratsquad.gg/api/auth/callback`

   > Vercel gives every preview deployment its own generated hostname, and
   > Discord cannot wildcard. Assign one **stable preview alias** in Vercel and
   > register only that; previews on other hostnames will not be able to log in.

2. **OAuth2 → Client information.** Copy the **Client ID**; press **Reset
   Secret** and copy the **Client Secret** (shown once).

3. Record them:
   - `.env.local` → `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`,
     `DISCORD_REDIRECT_URI` (the localhost one)
   - Vercel → the same three, with `DISCORD_REDIRECT_URI` set **per
     environment** to the matching URL above.

Scopes are requested by the app at login (`identify`, `guilds.members.read`) —
nothing to configure in the portal. See `docs/research/discord-oauth-nextjs.md`.

---

## 3. Message Content intent

**Where:** the same application → **Bot** → Privileged Gateway Intents.

Enable **Message Content Intent** and save.

Without it Discord returns `content`, `embeds` and `attachments` **empty** on
REST reads too — not only over the gateway — so the Apollo RSVP embed would come
back blank. RATS is under the 75-server verification threshold, so this is a
self-serve toggle with no review.

**Already enabled** — measured on 2026-07-29 by reading a real channel with the
bot token: `content` and `embeds` came back populated, which is impossible
without the intent. `make check-provisioning` re-proves it on every run by
reading the newest channel in «Календар 1.1».

---

## 4. Bot write access — scoped to the event category

**Where:** Discord client → Server Settings → Roles, then «Календар 1.1».

> **The bot is not read-only today.** Its role, **Integration Helper**, holds
> guild-wide **Administrator**: it can already post in, and delete from, all 390
> channels including `🔐・паролі` and `moderator-only`. This was measured on
> 2026-07-29, not assumed: `GET /guilds/{id}/roles` shows Integration Helper
> with the `ADMINISTRATOR` bit set. So this step is a *reduction* in access, not
> the escalation the ticket anticipated. `make check-provisioning` reports it as
> its own finding.

1. **Server Settings → Roles → Integration Helper → remove Administrator.**
   Leave it with `View Channels` and `Read Message History` only.
2. Open the **«Календар 1.1» category** → Edit Category → Permissions.
3. Add **Integration Helper** as an override and allow exactly
   **Send Messages** and **Manage Messages**. Leave everything else neutral.
4. Grant it on the **category**, not on each channel and not on the role. New
   event channels are created inside the category and inherit it, so a
   per-channel grant would have to be repeated every scrim — and forgotten once.
5. Grant nothing guild-wide — a guild-wide grant is what the check below exists
   to catch.

Removing Administrator may break other things the token is used for. The roster
fetch (`src/lib/discord.ts`) needs only `View Channels` plus the Server Members
intent, so it is unaffected; anything else using this token has to be checked
before flipping it.

`make check-provisioning` resolves the bot's effective permissions in **every**
channel and fails if it can write anywhere outside «Календар 1.1».

---

## 5. Channel and category IDs

Discover them with:

```bash
make discord-channels
```

Record them in `src/consts/discord.ts` — they are IDs, not secrets, and belong
beside the guild and role IDs rather than in the environment.

| Constant | Meaning | Status |
| --- | --- | --- |
| `CHANNEL_APPLICATIONS` | «📁・для-анкет» — where the Discord form posts recruit анкети | `1249820817827692645` ✅ |
| `CATEGORY_EVENTS` | «Календар 1.1» — the category holding one channel per scrim | `1251110806225948722` ✅ |

**There is no single event channel.** RATS opens a **text channel per scrim**
inside «Календар 1.1», each carrying its own Apollo RSVP embed, so the event
channels are a set that changes every week. They are resolved at read time by
`listEventChannels()` in `src/lib/event-channels.ts`, which takes the category's
text channels in Discord's own order and **drops the first** — that is the
«🔖・зразок-дд-мм-рр» template new event channels are copied from, and it holds
no RSVP.

Anything that needs "the event channel" should call `listEventChannels()`, never
hardcode an ID. As of 2026-07-29 the category holds two live event channels
(`🍺・хх-07-26-анті`, `🍺・09-08-26-sph`) plus the template.

> «Arma Календар 1.4» is a second calendar with the same shape, for Arma rather
> than Squad. It is deliberately **not** in scope: `CATEGORY_EVENTS` is a single
> ID today, and widening it to a list is trivial if Arma scrims ever need the
> roster builder.

---

## What lives where, in one table

| Credential | Local | Vercel | Notes |
| --- | --- | --- | --- |
| `DISCORD_BOT_TOKEN` | `.env.local` | env var, all envs | already provisioned |
| `DISCORD_CLIENT_ID` | `.env.local` | env var, all envs | not a secret, kept together with the rest |
| `DISCORD_CLIENT_SECRET` | `.env.local` | env var, all envs | shown once on reset |
| `DISCORD_REDIRECT_URI` | `.env.local` | env var, **per environment** | must match a registered redirect exactly |
| `TURSO_DATABASE_URL` | `.env.local` | env var, all envs | `libsql://…` |
| `TURSO_AUTH_TOKEN` | `.env.local` | env var, all envs | shown once on creation |
| Guild / role / channel IDs | — | — | `src/consts/discord.ts`, in git |

None of these may ever carry a `NEXT_PUBLIC_` prefix.
