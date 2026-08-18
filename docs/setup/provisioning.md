# Provisioning checklist (issue #14)

Everything the platform work depends on, and where each credential lives. The
portal and dashboard steps below cannot be automated — do them by hand, then run:

```bash
make check-provisioning
```

That command verifies the result against the live services. Treat it, not this
document, as the definition of "done".

---

## 0. The CLIs

`turso` and `vercel` are pinned in the project's Docker image, so provisioning
does not depend on what happens to be installed on somebody's laptop:

```bash
make tools-build                    # once
make turso  ARGS="db list"
make vercel ARGS="env ls"
make tools-shell                    # or just get a shell with both
```

Logins persist in a named volume. Authenticate once:

```bash
make turso ARGS="auth login --headless"   # or: config set token "<token>"
make vercel ARGS="login"
```

> Two different projects are called Turso. `tursodatabase/turso` is the Rust
> SQLite rewrite — its CLI is `tursodb`, a local shell with **no** cloud
> commands. Groups, databases and tokens come from `tursodatabase/turso-cli`,
> which is what the image pins.

---

## 1. Turso — ✅ done

**Provisioned 2026-07-29.** Group `rats`, database `rats-site`, both live and
verified by `make check-provisioning` (it runs a real `select 1` over the same
Hrana-over-HTTP path Vercel Functions will use).

| | |
| --- | --- |
| Org | `smereka` (personal) |
| Group | `rats` @ `aws-eu-west-1` (AWS EU West, Ireland) |
| Database | `rats-site` |
| URL | `libsql://rats-site-smereka.aws-eu-west-1.turso.io` |

The CLIs live in the project, not on a laptop — see §0. What was run:

```bash
make turso ARGS="group create rats --location aws-eu-west-1"
make turso ARGS="db create rats-site --group rats"
make turso ARGS="db show rats-site --url"      # → TURSO_DATABASE_URL
make turso ARGS="db tokens create rats-site"   # → TURSO_AUTH_TOKEN, shown once
```

> **Locations are AWS regions**, not the old fly.io three-letter codes. Run
> `make turso ARGS="db locations"` for the list; `aws-eu-west-1` is the default
> and the only EU option.

**Region caveat — flagged, not yet actionable.** The database is in Ireland.
The project pins no function region (no `vercel.json`, and neither
`vercel project inspect` nor `vercel inspect` reports one), so it runs on
Vercel's default — `iad1`, Washington — unless the dashboard says otherwise.

It costs nothing *today*: every route is prerendered, and the only server work
is ISR regeneration hitting Discord, not Turso. It starts costing on the first
DB read, when each query becomes a transatlantic round trip.

**Do this when the first Turso query ships** (#13/#15), not before: pin the
functions to `dub1` (Dublin) via `vercel.json` `"regions"` or the project's
Function Region setting. Changing it is cheap; moving the Turso group is not —
region is fixed at group creation.

**Plan:** the Free tier (500M row reads, 10M writes, 5 GB, 1 group) is far
beyond 40 players. Its one real limit is a **1-day** point-in-time restore
window; Developer ($4.99/mo) raises that to 10 days. See
`docs/research/turso-on-vercel.md`.

Both values are in `.env.local` **and** in Vercel for Production, Preview and
Development — verified by pulling them back down and comparing:

```bash
make vercel ARGS="env ls"
```

---

## 2. Discord application — a new one, owned by the clan

**Decision (2026-08-18): stop using `RATS Integration Helper` and stand up a
replacement application, bot included.** The old app is not extended, patched or
transferred — it is retired.

`GET /applications/@me` reports `team: null` and `owner: creepachok`. The
application sits on one person's personal Discord account, so nobody else can
add a redirect URI, reset the client secret, or **rotate the bot token that is
already in production**. That last one is the real problem: if that account is
lost, `DISCORD_BOT_TOKEN` can never be rotated and the roster integration cannot
be recovered.

Transferring the old app to a Team would fix ownership, but it still needs
Creep-ak to perform the transfer — and it inherits the other mess. A fresh app
fixes both at once, and fixes them *without a single portal action by anyone but
the site maintainer*:

- **Ownership** — created inside a Team from the start, so it survives any one
  account leaving, and secrets are self-serve forever after.
- **The Administrator escalation (§4) disappears rather than being repaired.**
  A bot's permissions are fixed *at invite time*. The new bot is invited with
  `View Channels` + `Read Message History` and nothing else, so it never holds
  Administrator and there is nothing to strip. Retiring the old bot deletes its
  managed `Integration Helper` role along with it — and with it the write access
  currently leaking into 406 channels.

The one cost is that the Discord consent screen at login shows the new
application's name, so name and icon it as the clan, not as a dev tool.

> The earlier "second, OAuth-only application" option carried an untested
> assumption — whether `guilds.members.read` works against a guild the app has
> no bot in. **That risk does not apply here**: this app's bot *is* in the guild,
> which is the documented, ordinary case.

| | |
| --- | --- |
| Old application | `RATS Integration Helper` · `1304040209725521950` · owner `creepachok` — **to be retired** |
| New application | ⬜ to be created, inside a Discord Team |
| New Client ID | ⬜ replaces `DISCORD_CLIENT_ID` |
| New Client Secret | ⬜ |
| New Bot Token | ⬜ replaces `DISCORD_BOT_TOKEN` |

`DISCORD_REDIRECT_URI` does **not** change — the callback URLs are a property of
this site, not of the application.

### ⚠️ The one prerequisite

Inviting a bot needs **Manage Server** in the RATS guild. If the site maintainer
does not hold it, that is the single remaining human dependency — and it is a
guild admin, not Creep-ak. Everything else below is self-serve.

Creep-ak is needed for **nothing** in this plan. The old bot can be removed by
any guild admin; the old application can be left to rot on his account, since
after cutover nothing reads its token.

### 2a. Create the Team and the application

Developer Portal → profile menu → **Teams** → *Create Team* → then
**Applications** → *New Application*, and pick the team as its owner in the
creation dialog. Invite the other maintainers under Team → *Members* as
**Developer** (enough for secrets and redirects) or **Admin**.

Creating it *inside* the team is better than creating it personally and
transferring later — a transfer is another step that can be forgotten, and it is
exactly the step that stranded the old app.

### 2b. Add the bot and enable both privileged intents

**Bot** → *Add Bot*, then under **Privileged Gateway Intents** enable:

- **Server Members Intent** — `GET /guilds/{id}/members` is rejected without it,
  and that call *is* the roster.
- **Message Content Intent** — without it `content` and `embeds` come back empty
  on REST reads too, so the Apollo RSVP embed reads blank. See §3.

Both are self-serve toggles: RATS is far under the 75-guild verification
threshold. **Presence Intent is not needed** — leave it off.

> **A missing Server Members intent does not fail loudly.**
> `fetchAllGuildMembers()` in `src/lib/discord.ts` logs the API error and
> returns what it has, so the roster silently empties to the
> `src/data/roster.ts` fallback instead of throwing. If `/roster` looks thin
> after cutover, this toggle is the first thing to check.

Then **Reset Token** and copy the bot token — shown once.

### 2c. Invite the bot, scoped from the first second

Build the invite from the new client ID:

```
https://discord.com/oauth2/authorize?client_id=<NEW_CLIENT_ID>&scope=bot&permissions=66560
```

`66560` is exactly `View Channels` (1 << 10) + `Read Message History` (1 << 16).
Nothing else — **no Administrator, no Send Messages**. Writing is granted in one
place only, on the category, in §4.

Open it as a user holding Manage Server, pick the RATS guild, and confirm the
permission list on the consent screen reads only those two.

### 2d. Add the three redirect URIs

OAuth2 → **Redirects** → Add. Exactly these, no trailing slash — Discord
matches character for character:

```
http://localhost:3000/api/auth/callback
https://ratsquad-git-develop-stubbornweb-1370s-projects.vercel.app/api/auth/callback
https://ratsquad.vercel.app/api/auth/callback
```

**On the preview one.** Vercel gives every deployment a fresh generated
hostname, and Discord cannot wildcard — but Vercel also aliases every *branch*
to a stable `ratsquad-git-<branch>-stubbornweb-1370s-projects.vercel.app`. The
OAuth preview is therefore pinned to the integration branch, **`develop`**,
which every branch merges into. Any other branch gets a preview URL Discord will
reject, by design — test login on `develop`.

**On the production one.** `ratsquad.vercel.app` is the real production domain —
`vercel domains ls` reports **0 custom domains** on this account, so despite the
repo being named `ratsquad.gg`, that domain is not wired to this project. It
matches what the site already declares in `src/app/layout.tsx` (`metadataBase`),
`sitemap.ts` and `robots.ts`. **If `ratsquad.gg` is ever pointed at Vercel, a
fourth redirect URI has to be added here** — and those three files updated.

### 2e. Copy the client ID and secret

**Client information** → the **Application ID** is the client ID, and it is not
a secret. **Reset Secret** → copy it (shown once).

### 2f. Cut over — local first, production last

The old token is live in production. Do not overwrite it until the new bot is
proven, or the roster goes empty on the public site.

```bash
# 1. .env.local only — production still runs on the old bot
DISCORD_BOT_TOKEN=<new bot token>
DISCORD_CLIENT_ID=<new application id>
DISCORD_CLIENT_SECRET=<new secret>

# 2. prove it against the live guild
make check-provisioning        # expect green, including the §4 scoping
make dev                       # then open /roster — it must be fully populated

# 3. only then, push all three to Vercel, all environments
make vercel ARGS='env add DISCORD_BOT_TOKEN production'      # …and preview, development
make vercel ARGS='env add DISCORD_CLIENT_ID production'
make vercel ARGS='env add DISCORD_CLIENT_SECRET production'
```

Replacing an existing Vercel variable means removing it first —
`make vercel ARGS='env rm DISCORD_BOT_TOKEN production'`. Redeploy, then check
`/roster` on production before step 4.

**4. Retire the old bot.** Server Settings → Integrations (or the member list) →
remove **RATS Integration Helper** from the guild. Its managed `Integration
Helper` role is deleted with it, which is what finally clears §4's 406-channel
leak. Leave the old *application* alone — once nothing reads its token, an
abandoned app on a personal account is harmless.

Re-run `make check-provisioning` after the removal. It reads whichever token is
in `.env.local`, so it is now reporting on the new bot.

`DISCORD_REDIRECT_URI` is unchanged by any of this — it is set **per
environment**, since each one differs:

| Environment | `DISCORD_REDIRECT_URI` |
| --- | --- |
| Development | `http://localhost:3000/api/auth/callback` |
| Preview | `https://ratsquad-git-develop-stubbornweb-1370s-projects.vercel.app/api/auth/callback` |
| Production | `https://ratsquad.vercel.app/api/auth/callback` |

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

**Enabled on the old app** — measured on 2026-07-29 by reading a real channel
with its bot token: `content` and `embeds` came back populated, which is
impossible without the intent.

**It does not carry over.** Intents are per-application, so the new app of §2
starts with it off; §2b turns it on. `make check-provisioning` re-proves it on
every run by reading the newest channel in «Календар 1.1», against whichever
token is configured — so a forgotten toggle after cutover fails the check
rather than surfacing as a blank RSVP mid-scrim.

---

## 4. Bot write access — scoped to the event category

**Where:** Discord client → «Календар 1.1» → Edit Category → Permissions.

**This step got much smaller when §2 became a new application.** The original
plan was a *reduction*: the old bot's role, `Integration Helper`, holds
guild-wide **Administrator** — measured, not assumed, from
`GET /guilds/{id}/roles` — so it can post in and delete from all 406 channels
including `🔐・паролі` and `moderator-only`, and any channel-scoped grant was
decorative until that was stripped.

A bot cannot strip its own Administrator bit (it may edit only roles *below* its
highest, and `Integration Helper` at position 36 is its only role), so that
demotion needed a human. **The new bot makes it unnecessary.** It arrives with
`View Channels` + `Read Message History` and nothing more (§2c), and removing
the old bot deletes its managed role outright. Nothing is demoted; the
over-privileged role stops existing.

So the whole of §4 is now one grant:

1. Open the **«Календар 1.1» category** → Edit Category → Permissions.
2. Add the **new bot's role** as an override and allow exactly **Send Messages**
   and **Manage Messages**. Leave everything else neutral.
3. Grant it on the **category**, not on each channel and not guild-wide. New
   event channels are created inside the category and inherit it, so a
   per-channel grant would have to be repeated every scrim — and forgotten once.
   A guild-wide grant is what the check below exists to catch.

There is **no category override for either bot today** — verified against
`GET /channels/1251110806225948722`.

**This can be automated, but only before the old bot is retired.** A bot cannot
grant itself permissions it does not hold, so the new bot cannot create its own
override. The old bot can: it still holds Administrator, and
`PUT /channels/{category}/permissions/{role}` is an ordinary call for it. Doing
it during the window when both bots are in the guild — after §2c, before §2f
step 4 — costs no human action at all. Otherwise any admin with Manage Roles
does it by hand in the client.

**Nothing else is known to use the old token.** The roster fetch
(`src/lib/discord.ts`) is the only consumer in this repo, and it needs only
`View Channels` plus the Server Members intent. Confirm nobody is running
scripts against it outside the repo before removing the old bot.

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
hardcode an ID.

> **The category is not scrims-only.** As of 2026-08-18 it resolves to four
> channels — `⚽・17-08-26-лекція-сквадний`, `⚽・18-08-26-підготовка-до-скріма`,
> `🍺・22-08-26-sph`, `19-08-26-лекція` — of which only one is a scrim. The rest
> are lectures and prep sessions: real events people RSVP to, but nothing the
> roster builder can produce rounds and squads for. `listEventChannels()` is a
> *provisioning* boundary (where may the bot write) and is correct as it stands;
> which of those channels the builder should offer is a separate question, open
> on the map.

> «Arma Календар 1.4» is a second calendar with the same shape, for Arma rather
> than Squad. It is deliberately **not** in scope: `CATEGORY_EVENTS` is a single
> ID today, and widening it to a list is trivial if Arma scrims ever need the
> roster builder.

---

## What lives where, in one table

| Credential | Local | Vercel | Notes |
| --- | --- | --- | --- |
| `DISCORD_BOT_TOKEN` | `.env.local` ✅ | env var, all envs ✅ | already provisioned |
| `DISCORD_CLIENT_ID` | `.env.local` ✅ | env var, all envs ✅ | `1304040209725521950` — the application ID, not a secret |
| `DISCORD_CLIENT_SECRET` | `.env.local` ⬜ | env var, all envs ⬜ | shown once on reset — the last missing credential |
| `DISCORD_REDIRECT_URI` | `.env.local` ✅ | env var, **per environment** ✅ | must match a registered redirect exactly |
| `TURSO_DATABASE_URL` | `.env.local` ✅ | env var, all envs ✅ | `libsql://rats-site-smereka.aws-eu-west-1.turso.io` |
| `TURSO_AUTH_TOKEN` | `.env.local` ✅ | env var, all envs ✅ | shown once on creation; re-mint with `make turso ARGS="db tokens create rats-site"` |
| Guild / role / channel IDs | — | — | `src/consts/discord.ts`, in git |

None of these may ever carry a `NEXT_PUBLIC_` prefix.
