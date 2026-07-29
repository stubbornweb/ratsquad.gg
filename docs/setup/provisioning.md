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

## 2. Discord OAuth application — ⬜ one step left

**Where:** <https://discord.com/developers/applications> → **RATS Integration
Helper** → OAuth2.

Use the **existing** application — the one whose bot token already powers the
roster. A second application would mean a second bot in the guild.

| | |
| --- | --- |
| Application | `RATS Integration Helper` (owner `creepachok`) |
| **Client ID** | `1304040209725521950` ✅ recorded |
| Client Secret | ⬜ **needs the portal** |
| Redirect URIs | ⬜ **needs the portal** |

The client ID is the application ID, so it was read straight off the API — no
portal needed, and it is not a secret. Everything below is not so lucky:
`PATCH /applications/@me` **accepts** a `redirect_uris` field and then silently
ignores it. Verified: the write returns 200 and a re-read still shows `[]`.
Redirect URIs are portal-only.

### ⚠️ Access blocker — the application is personally owned

`GET /applications/@me` reports `team: null` and `owner: creepachok`
(**Creep-ak**). The application sits on one person's personal Discord account,
so nobody else can add a redirect URI, reset the client secret, or **rotate the
bot token that is already in production**.

That last one is the real problem. It is not an OAuth inconvenience: if that
account is lost, or its owner leaves, `DISCORD_BOT_TOKEN` can never be rotated
and the roster integration cannot be recovered. This is worth fixing regardless
of what #14 needed.

**Recommended: move the app to a Discord Team.** Teams exist for exactly this —
several people administer one application, and ownership survives any one
account. Creep-ak does it once:

> Developer Portal → the profile menu → **Teams** → *Create Team* → then
> **RATS Integration Helper** → Settings → **Transfer ownership** → to the team →
> then Team → *Members* → invite the other maintainers as **Developer** (enough
> to manage secrets and redirects) or **Admin**.

After that, everything in §2 is self-serve and this blocker never returns.

**Fallback: Creep-ak performs §2a and §2b directly.** Faster, but every future
secret rotation or redirect change needs them again, and the token-rotation risk
above stays open.

**Last resort: a second, OAuth-only application** owned by whoever maintains the
site. Login does not need a bot — the `identify` and `guilds.members.read`
scopes read the *user's* own token — so **do not invite its bot to the guild**
and no second bot appears. Costs: the Discord consent screen shows the new
application's name rather than the clan's, there are two apps to keep straight,
and `guilds.members.read` against a guild the app has no bot in is **untested
here** — the docs do not state whether it is allowed, so verify it before
committing to this path. The bot token, and §4's permission work, still depend
on Creep-ak either way.

### 2a. Add the three redirect URIs

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

### 2b. Copy the client secret

OAuth2 → Client information → **Reset Secret** → copy it (shown once).

Then record it in both places:

```bash
# .env.local
DISCORD_CLIENT_SECRET=<the secret>

# Vercel, all three environments
make vercel ARGS='env add DISCORD_CLIENT_SECRET production'
make vercel ARGS='env add DISCORD_CLIENT_SECRET preview'
make vercel ARGS='env add DISCORD_CLIENT_SECRET development'
```

`make check-provisioning` goes green on this group once it is set.

### Already done

`DISCORD_CLIENT_ID` and `DISCORD_REDIRECT_URI` are in `.env.local` and in Vercel.
The redirect URI is set **per environment**, since each one differs:

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
| `DISCORD_BOT_TOKEN` | `.env.local` ✅ | env var, all envs ✅ | already provisioned |
| `DISCORD_CLIENT_ID` | `.env.local` ✅ | env var, all envs ✅ | `1304040209725521950` — the application ID, not a secret |
| `DISCORD_CLIENT_SECRET` | `.env.local` ⬜ | env var, all envs ⬜ | shown once on reset — the last missing credential |
| `DISCORD_REDIRECT_URI` | `.env.local` ✅ | env var, **per environment** ✅ | must match a registered redirect exactly |
| `TURSO_DATABASE_URL` | `.env.local` ✅ | env var, all envs ✅ | `libsql://rats-site-smereka.aws-eu-west-1.turso.io` |
| `TURSO_AUTH_TOKEN` | `.env.local` ✅ | env var, all envs ✅ | shown once on creation; re-mint with `make turso ARGS="db tokens create rats-site"` |
| Guild / role / channel IDs | — | — | `src/consts/discord.ts`, in git |

None of these may ever carry a `NEXT_PUBLIC_` prefix.
