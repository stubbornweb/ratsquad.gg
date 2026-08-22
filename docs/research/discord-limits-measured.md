# The Discord limits the ticket design turns on — measured

Resolves wayfinder ticket [#67](https://github.com/stubbornweb/ratsquad.gg/issues/67), which
[#58](https://github.com/stubbornweb/ratsquad.gg/issues/58) raised as two blockers-in-waiting.
[#27](https://github.com/stubbornweb/ratsquad.gg/issues/27) left the private-thread question open;
it is closed here by test rather than by reading.

**Measured 2026-08-22.** Every figure below moves. The guild numbers move weekly — see
[The guild is 48 channels from the cap](#the-guild-is-48-channels-from-the-cap), which is the
finding with a clock on it.

Everything here was produced by `scripts/probe-discord-limits.mjs` in this directory's sibling
`scripts/`, against the live guilds. Re-run it before trusting any number.

## Summary

| Question | Answer | How it was established |
| --- | --- | --- |
| Guild channel cap | 500, help-centre-grade only — never in the developer docs | Secondary sources, corroborated |
| RATS guild today | **452 channels** — 48 from the cap | Measured, `GET /guilds/{id}/channels` |
| Channel growth | **~5–7/week, and nothing is ever deleted** | Measured from snowflake timestamps |
| Private threads need Boost 2 | **No.** Created one at Boost Level **0** | Tested in `SmereKa Squad` |
| Threads count against the channel cap | **No** — stated in the developer docs | Primary source |
| Active thread cap | Exists, figure never published. 1000 is the community number | Docs confirm the cap, not the figure |
| RATS boost level | Tier 1, 2 boosts | Measured |

**The design consequence is not close.** A channel-per-applicant recruitment ticket cannot be
built in this guild. A thread-per-applicant one can, at any boost level, and is exempt from the
cap that the channel design would hit. [#59](https://github.com/stubbornweb/ratsquad.gg/issues/59)
picks from one viable option, not two.

## The guild is 48 channels from the cap

```
text            380
category         40
voice            18
forum            12
stage             2
TOTAL           452   (412 excluding categories)
```

Two ceilings, not one. The 500 cap counts categories, so the guild is at **452/500**. It is also
at **40/50 categories**, which matters because of the second limit below.

### Nothing is ever deleted

Channels created per calendar year, derived from the snowflake timestamp of every channel that
exists today:

```
2024   134
2025   187
2026   131   (through 22 Aug)
       ---
       452
```

That sum is the exact current total. **No channel has ever been deleted in the guild's history.**
Growth is therefore net growth, and the recent rate is the rate the cap is being consumed at:

```
last  30d:  31 channels   7.2/week
last  90d:  72 channels   5.6/week
last 180d: 121 channels   4.7/week
last 365d: 187 channels   3.6/week
```

The rate is rising, not falling. At the trailing-90-day rate, 48 channels of headroom is **about
eight weeks**. At the 30-day rate, under seven.

**This is an existing operational problem that predates recruitment.** The guild will hit the
channel cap around October 2026 whether or not anything on this map ships. Recruitment did not
cause it and cannot be blamed for it, but a channel-per-applicant design would land on top of it
and pull the date forward by however many people apply. Worth telling the administrators
independently of this map — the archive practice below is where the channels went, and it is
theirs to change.

### Where the channels went

```
  50 архів битв          ← at the 50-per-category cap
  50 архів тренувань     ← at the cap
  50 архів битв 2        ← at the cap
  45 Архів Тренувань 2   ← nearly
  19 рівень 1
  16 архів
  15 архів битв USL
  13 архів битв SEC
  ...
```

Seven archive categories hold **239 channels — 53% of the guild** — and three of them sit at
exactly 50, which is why «архів битв 2» and «Архів Тренувань 2» exist at all. The «Календар 1.1»
one-channel-per-scrim practice that `src/lib/event-channels.ts` reads from is the source: every
scrim channel is eventually moved to an archive category and kept forever. The 40/50 category
ceiling is the tighter of the two constraints here, because the response to a full archive
category has so far been to create another category.

### The 500 figure is not documented

`GET /guilds/{id}/channels` returns no quota, and the developer documentation states no
server-wide channel maximum. The 500 figure comes from third-party guides and Discord's own
community feedback forum — where a feature request to raise the 50-category limit argues against
the 500-channel one, which corroborates both numbers without either being authoritative.
Discord's Server Limits help-centre article returns 403 to non-browser clients, so it could not be
read here.

The **50-channels-per-category** limit is better attested: it is reported to surface as error
`50035` on `parent_id`, and this guild has three categories sitting at exactly 50 and none above.

Neither number should be hardcoded. Handle the error.

## Private threads do not require Boost Level 2

Settled by test, in the `SmereKa Squad` test guild
([#29](https://github.com/stubbornweb/ratsquad.gg/issues/29)) — **Boost Level 0, zero boosts**, the
strongest available case:

```
POST /channels/{id}/threads  {"type": 12, "invitable": false}   ->  201 Created
POST /channels/{id}/threads  {"type": 11}                       ->  201 Created
```

Both threads were deleted immediately afterwards. A `PRIVATE_THREAD` was created on a guild that
has never been boosted, so the requirement is gone.

Corroborated in production independently: the RATS guild is **Boost Level 1** and already has one
active private thread.

**Why reading could not settle this, and #27 was right to leave it open.** Discord removed the
requirement in November 2022, but the Threads FAQ help-centre article *still* lists private
threads as a Level 2 boost perk today. The developer documentation never mentioned boost levels at
all. So the only two written sources are one that is stale and one that is silent — the FAQ is
wrong, not merely outdated in emphasis. Do not re-open this from documentation; re-open it only
from a failing `POST`.

RATS production guild, for the record: `premium_tier: 1`, 2 boosts, 548 members, `COMMUNITY`
enabled.

## Threads are exempt from the channel cap

From the developer documentation, verbatim:

> Threads do not count against the max-channels limit in a guild, but there is a limit on the
> maximum number of active threads in a guild.

This is the sentence that makes a thread-per-applicant ticket viable in a guild sitting at
452/500, and it is primary-source, not community-sourced.

## The active thread cap exists and has no published figure

The documentation confirms the cap and withholds the number:

> guilds are capped at a certain number of active threads, and only active threads can be
> manipulated.

**1000** is the consistently reported community figure — from a discussion on Discord's own
`discord-api-docs` repository and from users on the support forum treating it as a real ceiling.
It is not in the developer documentation and was not verified here; verifying it would mean
creating a thousand threads.

Two mechanics matter more than the figure:

- **Archiving frees the slot; auto-archiving is automatic.** Threads archive after 1, 3 or 7 days
  of inactivity, and the documentation adds that *"as a server approaches the max thread limit
  this timer will automatically lower"* — Discord defends the cap itself. Archived threads are
  unlimited.
- **A closed recruitment ticket should be archived, not deleted.** That returns the slot and keeps
  the history, which is the same instinct the guild already has about channels — except threads
  make it free.

The RATS guild currently has **90 active threads** (89 public, 1 private) against a probable 1000.
With applications archiving on resolution, recruitment would need ~900 simultaneously-open
applications to threaten this. It is not a constraint on the design.

One caveat, reported but unverified: marking a thread archived *through the API* may still count
against the active limit, unlike auto-archiving. If a design ever depends on programmatic
archiving to reclaim slots, test it first.

## Unresolved: the Steam «Game details» hit rate

[#57](https://github.com/stubbornweb/ratsquad.gg/issues/57) folded a third unverified fact into
this ticket — the application reads Squad playtime from Steam and only falls back to asking, which
works only when the player's «Game details» privacy is public. **This could not be settled here,
and it is not blocked on a decision — only on data nobody has yet.**

What was established while trying:

- **No Steam credential exists.** `src/lib/env.ts` holds six values, all Discord and Turso.
  `members.steam_id` exists in the schema (`src/db/schema/create_table_members.ts:35`) and is
  empty. So there is no list of member SteamID64s to sample.
- **The keyless playtime route is closed.** `steamcommunity.com/profiles/{id}/games?tab=all&xml=1`
  used to return owned games and playtime without a credential; it now redirects to `/login`.
  **The Steam Web API key #57's fog anticipated is unavoidable** for the playtime half.
- **The identity half needs no credential.** `steamcommunity.com/profiles/{id}/?xml=1` still
  returns `steamID64`, persona name, avatar URLs, and `privacyState` / `visibilityState` keylessly.
  That covers #57's «Це ти?» confirmation entirely, and it also exposes profile privacy — so the
  hit rate can be *estimated* keylessly, as an upper bound, before any key is requested.
  (`privacyState` is whole-profile privacy, not the «Game details» sub-setting; a non-public
  profile definitely cannot be read, a public one probably can.)
- **A proxy population was looked for and rejected.** Steam's game-hub member list for appid
  393380 is not exposed, and the `squad` community group has 12 members. There is no honest
  sample of Squad players to substitute for RATS's own.

**To settle it** — cheap, but it needs a human with the guild:

1. Collect 10–15 Steam profile links from current members (ask in Discord, or read the Steam
   connection off their Discord profiles).
2. Run `node scripts/probe-steam-privacy.mjs <link-or-id>...` in this branch. It resolves vanity
   URLs and profile URLs to SteamID64 and reports each profile's privacy state and the share that
   are public.
3. If most are public, #57's design pays off as written. If most are not, the Steam fetch degrades
   to the self-reported band with extra code and a new secret behind it — and #57's decision to
   add Steam should be revisited on the strength of the identity check alone, which is keyless and
   still worth having.

Note that RATS members are a biased sample in the *pessimistic* direction: applicants are
motivated to be accepted and can be asked to make a profile public for five minutes, which
members answering a survey have no reason to do.

## What this does not settle

- Whether a redeploy can drop an interaction, and the exact `PATCH /channels` name/topic sublimit
  — both left open by [#58](https://github.com/stubbornweb/ratsquad.gg/issues/58) and both
  mitigations, not blockers. #58's advice stands: make Accept idempotent on the application id.
- The bot's provisioning gaps #58 found (`PERMISSION` models 4 bits; `auditBotChannelGrant` will
  flag ticket channels as overreach; no role-hierarchy assertion). Still map
  [#26](https://github.com/stubbornweb/ratsquad.gg/issues/26)'s to own. Note that a thread-based
  design changes the shape of the first two: threads have no permission overwrite object at all,
  so `auditBotChannelGrant` may have less to learn than #58 assumed.
