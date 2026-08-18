# Research: What Discord's Own Features Already Replace

**Date of research:** August 18, 2026
**Scope:** Which of the fourteen bots in the RATS guild can be retired by turning on a native Discord feature, with no code at all. Six candidate features: AutoMod, Onboarding, Scheduled Events, forum channels and threads, temporary voice channels, Server Insights.
**Issue:** [#27](https://github.com/stubbornweb/ratsquad.gg/issues/27), part of the map in [#26](https://github.com/stubbornweb/ratsquad.gg/issues/26).

**Sourcing rule for this document.** Only Discord's own pages count — `docs.discord.com/developers/*` (the developer docs, which `discord.com/developers/docs/*` now redirects to) and `support.discord.com` (the help centre). No vendor pages, no third-party write-ups, no recall. Several help-centre pages return HTTP 403 to a plain fetch; where a claim rests on a search-engine snippet of a Discord URL rather than a full page load, it is marked **(snippet-sourced)**. Where nothing on a Discord page could be found, the answer is **COULD NOT VERIFY** rather than a guess.

---

## Summary

Discord has absorbed **the filtering half of moderation** and **most of role self-selection**, and it has a scheduled-event object with a subscriber list. It has absorbed almost nothing of the *record-keeping* half of moderation, nothing of RSVP beyond a single binary "Interested", and — as far as any Discord page states — nothing at all of temporary voice channels.

| Bot | Native feature | Verdict from the docs |
| --- | --- | --- |
| `Dyno`, `MEE6` (filters) | AutoMod | **Mostly replaced.** Keyword, spam, mention-spam and profile filtering are native, with timeout as an action. |
| `Dyno`, `MEE6` (the rest) | — | **Not replaced.** No warn/strike ledger, no mod-case history, no custom commands, no levelling. Nothing in the API surface for any of it. |
| `Carl-bot` (reaction roles) | Onboarding questions | **Largely replaced**, with a shape change: roles are picked in a Channels & Roles tab, not by reacting to a message. No arbitrary emoji-on-message role grants. |
| `MEE6` (welcome messages) | Welcome Screen + system channel | **Not replaced.** Native welcome is a static channel-list screen; there is no custom join message. |
| `Apollo` | Scheduled Events | **Partially replaced.** Recurring events and an Interested list exist. Yes/no/maybe, signup slots, caps, waitlists and configurable reminders do not. |
| `Tickets`, `Ticket Tool` | Private threads | **Not replaced.** Private threads are the right *container*; the panel, transcripts and claim/close lifecycle are all still code. Forum channels are the wrong fit — forum posts cannot be private. |
| `VoiceMaster` | — | **Nothing native found.** Must be built. Cheap to build: one non-privileged intent, one event, two permission bits. |
| `Statbot` | Server Insights | **Blocked by a threshold.** Community plus more than 500 members. Aggregate charts only, no per-member data, no export, no API. |

The single most consequential finding for the map: **five of these six features require the server to be a Community server** (AutoMod does not; Onboarding, forum channels and Insights do; Scheduled Events could not be confirmed either way). Enabling Community is therefore a prerequisite decision that sits upstream of most of the per-bot rulings.

---

## 1. AutoMod — how much of `Dyno` and `MEE6` is now built in

### What it does

AutoMod is a first-class API resource: rules made of a trigger type, a set of actions, and exempt roles/channels. [Auto Moderation resource](https://docs.discord.com/developers/resources/auto-moderation).

**Trigger types, with the per-guild cap Discord enforces on each:**

| Trigger | Value | Max rules per guild | Docs wording |
| --- | --- | --- | --- |
| `KEYWORD` | 1 | **6** | "check if content contains words from a user defined list of keywords" |
| `SPAM` | 3 | **1** | "check if content represents generic spam" |
| `KEYWORD_PRESET` | 4 | **1** | "check if content contains words from internal pre-defined wordsets" |
| `MENTION_SPAM` | 5 | **1** | "check if content contains more unique mentions than allowed" |
| `MEMBER_PROFILE` | 6 | **1** | "check if member profile contains words from a user defined list" |

Six keyword rules is the real ceiling to plan against. Everything else is one rule each.

**Filter size limits** ([Auto Moderation resource](https://docs.discord.com/developers/resources/auto-moderation)):

- `keyword_filter` — max **1000** entries, **60** characters each
- `regex_patterns` — max **10** entries, **260** characters each, **Rust-flavoured regex only**
- `allow_list` — **100** entries × 60 chars for `KEYWORD` and `MEMBER_PROFILE`; **1000** entries × 60 chars for `KEYWORD_PRESET`

**Actions:** `BLOCK_MESSAGE` (1, with an optional 150-character custom explanation shown to the user), `SEND_ALERT_MESSAGE` (2, "logs user content to a specified channel"), `TIMEOUT` (3), `BLOCK_MEMBER_INTERACTION` (4, "prevents a member from using text, voice, or other interactions").

`TIMEOUT` has a hard cap of **2,419,200 seconds (4 weeks)**, requires the `MODERATE_MEMBERS` permission, and — this matters — is **only available on `KEYWORD` and `MENTION_SPAM` rules**. A spam rule cannot time someone out.

**Preset word categories** are "Insults and Slurs", "Sexual Content" and "Severe Profanity", each with a per-server exemption list ([AutoMod FAQ](https://support.discord.com/hc/en-us/articles/4421269296535-AutoMod-FAQ), snippet-sourced). Administrators, Manage Server holders, bots and webhooks are exempt by default.

Discord's own framing of raid handling is explicitly reactive, not automatic: you "configure AutoMod's keyword and spam filters in real-time to prevent and de-escalate raids by adding spammed keywords or adjusting your mention limit in the event of a mention raid" ([AutoMod FAQ](https://support.discord.com/hc/en-us/articles/4421269296535-AutoMod-FAQ), snippet-sourced). There is no native "lockdown on join spike" switch documented.

### What it requires

- **`MANAGE_GUILD`** for every Auto Moderation endpoint.
- **No Community requirement** — nothing on the AutoMod pages gates it on the `COMMUNITY` guild feature. This is the one feature in this document that a non-Community server gets.
- For a bot to *observe* AutoMod: the `AUTO_MODERATION_CONFIGURATION` and `AUTO_MODERATION_EXECUTION` intents. The events "are only sent to bot users which have the `MANAGE_GUILD` permission" ([Gateway Events](https://docs.discord.com/developers/topics/gateway-events)). `AUTO_MODERATION_ACTION_EXECUTION` carries `matched_keyword` and `matched_content`; the full `content` field additionally needs the privileged `MESSAGE_CONTENT` intent.

### What it cannot do

Nothing in the Auto Moderation resource — no object, no field, no endpoint — exists for any of the following, which is the majority of why a server installs `Dyno` or `MEE6`:

- **Warn / strike / infraction points.** AutoMod acts at the moment of the message and keeps no ledger.
- **A moderation case history** you can look up per member. `SEND_ALERT_MESSAGE` writes to a channel; that channel *is* the record.
- **Escalation** — "three keyword hits in an hour becomes a kick" is not expressible.
- **Custom commands**, autoresponders, tags.
- **Levelling / XP.**
- **Ban appeals**, tempbans, or scheduled unbans.

**Ruling implication.** AutoMod genuinely retires the filtering configuration on both bots. The strike system, mod-log and levelling are separate questions and must be ruled on separately — and if the clan wants them, they are RATS-bot features, not settings.

---

## 2. Onboarding — does it cover `Carl-bot` reaction roles and `MEE6` welcome messages?

### What it does

Onboarding is an API object on the guild ([Guild resource, Guild Onboarding Object](https://docs.discord.com/developers/resources/guild)):

- **Prompt types:** `MULTIPLE_CHOICE` (0) and `DROPDOWN` (1).
- **Prompt options** carry `channel_ids` and `role_ids` — answering a question grants roles and/or unhides channels.
- **`mode`:** `ONBOARDING_DEFAULT` (0) — "Counts only Default Channels towards constraints"; `ONBOARDING_ADVANCED` (1) — "Counts Default Channels and Questions towards constraints".
- **`default_channel_ids`:** "Channel IDs that members get opted into automatically."

**Roles are re-selectable after join.** This is the finding that decides the `Carl-bot` question. Per the [Community Onboarding FAQ](https://support.discord.com/hc/en-us/articles/11074987197975-Community-Onboarding-FAQ) (snippet-sourced): "this isn't permanent — once they're in, they can adjust their answers to your questions to swap roles or channels at any time in a new Channels & Roles tab above their channel list."

So onboarding is not a join-time-only gate. It is a permanent, always-available self-service role picker — functionally what reaction roles were used for, in a different place in the UI.

**Server Guide** is a separate surface built on top of onboarding: "a dedicated space that new members see after they join", configured in Server Settings → Onboarding, offering a Welcome Sign, New Member To-Do's and Resources sections. It only unlocks "once you've completed the Default Channels and Questions portion of Onboarding" ([Server Guide FAQ](https://support.discord.com/hc/en-us/articles/13497665141655-Server-Guide-FAQ), snippet-sourced). It is not independently switchable.

**Welcome Screen** is a third, older, distinct object on the guild ([Guild resource, Welcome Screen Object](https://docs.discord.com/developers/resources/guild)): a `description` plus a `welcome_channels` array capped at **5 channels**, each with a `channel_id`, `description` and emoji.

**System channel join messages** are controlled by `system_channel_flags` on the guild object — `SUPPRESS_JOIN_NOTIFICATIONS` (`1 << 0`, "Suppress member join notifications"), `SUPPRESS_PREMIUM_SUBSCRIPTIONS` (`1 << 1`), `SUPPRESS_GUILD_REMINDER_NOTIFICATIONS` (`1 << 2`).

### What it requires

- **Community must be enabled**, and the server needs a rules channel and an updates channel ([Enabling Your Community Server](https://support.discord.com/hc/en-us/articles/360047132851-Enabling-Your-Community-Server); [Community Onboarding FAQ](https://support.discord.com/hc/en-us/articles/11074987197975-Community-Onboarding-FAQ), both snippet-sourced): "Onboarding is a Community-only feature, so the server must be a Community server first."
- **Channel-count constraints before onboarding can be enabled.** Per the [Community Onboarding FAQ](https://support.discord.com/hc/en-us/articles/11074987197975-Community-Onboarding-FAQ) (snippet-sourced): at least **7 Default Channels**, of which at least **5 must allow `@everyone` to View and Send Messages**.
  - **Partially unverified.** The developer docs describe `mode` as changing "the criteria used to satisfy Onboarding constraints" but give no numbers, and the Modify Guild Onboarding endpoint section (`PUT /guilds/{guild.id}/onboarding`) could not be retrieved from `docs.discord.com` across several attempts — only the object definition rendered. **COULD NOT VERIFY** the endpoint's required permission, its documented error responses on constraint failure, or exactly how `ONBOARDING_ADVANCED` relaxes the 7/5 rule. This is worth confirming in the Server Settings UI before committing to onboarding, because 5 channels open to `@everyone` is a real constraint on a clan server with a locked-down channel tree.

### What it cannot do

- **It is not a general reaction-role system.** There is no way to attach an emoji-to-role mapping to an arbitrary message anywhere in the server. Role self-selection lives only inside the onboarding flow and the Channels & Roles tab.
- **It does not send a custom welcome message.** Nothing in the onboarding object, the Welcome Screen object, or the [Community Onboarding blog post](https://discord.com/blog/community-onboarding-welcome-your-new-members) describes a `MEE6`-style templated join message with variables posted to a channel. Native welcome is a *screen*, not a *message*. The only native message on join is Discord's own system-channel notification, which you can suppress but not customise.
- **No conditional logic** — answers cannot gate other answers.
- **No verification gate** tied to answering.

**Ruling implication.** `Carl-bot`'s reaction roles: replaceable, with a UI change members will notice. `MEE6`'s welcome messages: not replaceable natively. If the clan wants a custom greeting, that is a RATS-bot feature — and a cheap one, since the bot is already a gateway process listening for `GUILD_MEMBER_ADD`.

---

## 3. Scheduled Events — how close to `Apollo`?

### What it does

[Guild Scheduled Event resource](https://docs.discord.com/developers/resources/guild-scheduled-event).

- **Entity types:** `STAGE_INSTANCE` (1), `VOICE` (2), `EXTERNAL` (3, with location metadata).
- **Object fields:** `id`, `guild_id`, `channel_id`, `creator_id`, `name`, `description`, `scheduled_start_time`, `scheduled_end_time`, `privacy_level`, `status`, `entity_type`, `entity_id`, `entity_metadata`, `creator`, `user_count`, `image` ("the cover image hash of the scheduled event", optional and nullable), `recurrence_rule`.
- **Cap:** "A guild can have a maximum of 100 events with `SCHEDULED` or `ACTIVE` status at any time."
- **The RSVP list:** `user_count` on the object, and `GET /guilds/{guild.id}/scheduled-events/{id}/users` for the actual members — paginated with `before`/`after`, **limit max 100 per page**, optional inline member data.
- **Gateway:** `GUILD_SCHEDULED_EVENT_CREATE/UPDATE/DELETE`, plus `GUILD_SCHEDULED_EVENT_USER_ADD` and `_REMOVE` (carrying `guild_scheduled_event_id`, `user_id`, `guild_id`), all behind the `GUILD_SCHEDULED_EVENTS` intent ([Gateway Events](https://docs.discord.com/developers/topics/gateway-events)). A bot can therefore watch RSVPs live rather than polling.

**Recurrence.** `recurrence_rule` takes `frequency` (`YEARLY` 0, `MONTHLY` 1, `WEEKLY` 2, `DAILY` 3), `interval`, `by_weekday`, `by_n_weekday`, `by_month`, `by_month_day`, `by_year_day`, `count`, `end`. The docs carry an explicit Limitations block:

- "The following fields cannot be set by the client / application: `count`, `end`, `by_year_day`" — **a recurring event cannot be given an end date or an occurrence count via the API.**
- "`interval` can only be set to a value other than `1` when `frequency` is set to `WEEKLY`" — in practice, biweekly is the only non-unit interval.
- Weekly events using `by_weekday` support only a single day.
- Monthly `by_n_weekday` allows only one day per month.
- Yearly recurrence requires both `by_month` and `by_month_day`, each of length 1.

A weekly scrim on a fixed day is squarely inside this. "Tuesdays and Thursdays" as one recurring event is not.

**Lifecycle.** `EXTERNAL` events auto-transition `ACTIVE` → `COMPLETED` at their start/end times; `VOICE` and `STAGE_INSTANCE` events auto-complete a few minutes after everyone disconnects. And per the [Scheduled Events help article](https://support.discord.com/hc/en-us/articles/4409494125719-Scheduled-Events) (snippet-sourced), "if an event doesn't start within an hour of the scheduled time, the event is automatically removed from the list of Scheduled Events." A scrim nobody starts vanishes on its own.

### What it requires

- **`CREATE_EVENTS`** to create; **`MANAGE_EVENTS`** to modify an event you did not create.
- **Community requirement: COULD NOT VERIFY.** Neither the help article nor the guild-scheduled-event resource states that the endpoints are gated on the `COMMUNITY` guild feature, and no Discord page was found that says either way. Note that `STAGE_INSTANCE` events implicitly need a stage channel, which is itself Community-only — but `VOICE` and `EXTERNAL` events appear unaffected.

### What it cannot do

This is the part that matters, because `Apollo` is the bot with the most real weekly usage.

- **There is exactly one RSVP state: "Interested".** No yes / no / maybe. The help article describes clicking "Interested" as the whole mechanism, with the start notification going "to all server members who marked themselves as Interested". The API object confirms it: there is no response-type field anywhere on the event, and the user endpoint returns a flat list, not a list with states.
- **No role-specific signup slots.** No squad-lead / medic / rifleman roster, no per-slot counts.
- **No attendance limit**, no waitlist, no overflow.
- **No configurable reminders.** One built-in notification at start time. Nothing at T-24h, nothing at T-1h, nothing you can word yourself.
- **No sign-up deadline**, no lock, no attendance record after the fact.

Discord's own support forums carry unresolved feature requests for precisely these — a ["More options than just interested"](https://support.discord.com/hc/en-us/community/posts/4413166913815-Scheduled-Events-More-options-than-just-interested) thread asking for "Will Attend"/"Maybe Attend" tiers, and a separate thread asking for per-attendee reminder timing. Cited here **only as evidence of absence**, not as documentation of behaviour.

**Ruling implication.** Native Scheduled Events are a plausible *substrate* for a RATS-bot scrim feature — recurrence, a subscriber list and live gateway events are real work you do not have to do — but they are not an `Apollo` replacement on their own. If the clan uses maybe-states or role slots today, that is code either way. The map already puts `Apollo` last, and this finding supports that.

---

## 4. Forum channels vs. private threads — the ticket workflow

### Forum channels

[Channel resource](https://docs.discord.com/developers/resources/channel). `GUILD_FORUM` (type 15) is "Channel that can only contain threads". `GUILD_MEDIA` (type 16) is similar but Discord's docs flag it as still in active development and warn against depending on undocumented behaviour.

- `available_tags` — max **20** tags per channel; tag `name` is 0–20 characters.
- `applied_tags` — a thread can carry at most **5**.
- A tag's `moderated` flag means "only members with `MANAGE_THREADS` can add/remove the tag".
- `default_reaction_emoji` — exactly one of `emoji_id` / `emoji_name`; one default reaction for the whole forum, not per tag.
- `default_forum_layout` — `NOT_SET` (0), `LIST_VIEW` (1), `GALLERY_VIEW` (2).
- `default_sort_order` — `LATEST_ACTIVITY` (0) or `CREATION_DATE` (1).
- Thread auto-archive durations: **60, 1440, 4320, 10080** minutes.

**Community required.** Unambiguous, from Discord's own [Forum Channels FAQ](https://support.discord.com/hc/en-us/articles/6208479917079-Forum-Channels-FAQ): "In order to create and have forum channels on your server, you must enable Community on your server." Server-wide, not per channel.

### Threads

- `PUBLIC_THREAD` (11) — a sub-channel of a `GUILD_TEXT` or `GUILD_FORUM` channel.
- `PRIVATE_THREAD` (12) — "a temporary sub-channel within a `GUILD_TEXT` channel that is only viewable by those invited and those with the `MANAGE_THREADS` permission".
- `ANNOUNCEMENT_THREAD` (10).

**Private threads are a `GUILD_TEXT` sub-channel only.** They are not a forum thing. Forum posts are public threads by type. This settles the issue's question: for a private, one-recruit-at-a-time conversation, **a private thread on a text channel is the fit; a forum channel is not.** A forum with tags is a good fit for something else — a public, browsable, categorised backlog — but not for a ticket nobody else should read.

- `invitable` — "whether non-moderators can add other non-moderators to a thread; only available on private threads."
- `PUT /channels/{channel.id}/thread-members/{user.id}` — "Requires the ability to send messages in the thread. Also requires the thread is not archived."
- `MANAGE_THREADS` ([Permissions](https://docs.discord.com/developers/topics/permissions)) — "Allows for deleting and archiving threads, and viewing all private threads". A moderator holding this bit sees every private thread in scope, which is exactly what an officer needs and also exactly the thing to be careful about when granting it.
- `CREATE_PRIVATE_THREADS` — "Allows for creating private threads."
- `SEND_MESSAGES_IN_THREADS` — "Allows for sending messages in threads."

**Boost gate on private threads — flagged, not resolved.** Discord's live [Threads FAQ](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ) still states (snippet-sourced; direct fetch returned 403) that "Level 2 server boosted servers will have access to Private Threads. You will also need the Create Private Threads permission to create private threads." No Discord changelog or help page could be found announcing that this gate was removed. **COULD NOT VERIFY** whether that sentence is live policy or stale copy on an unmaintained page. Given that a ticket replacement depends entirely on private threads existing, **this must be checked in the actual guild before any ruling on `Tickets` / `Ticket Tool`** — open a private thread by hand and see whether Discord lets you.

### What neither gives you

A ticket bot is not the container, it is the machinery around it. Nothing native provides:

- **A button-driven "open a ticket" panel.** That is a message with a component and an interaction handler — i.e. our bot.
- **Transcripts.** No native export of a thread to a readable archive.
- **Claim / close lifecycle.** No assignee, no status, no reopen. Archiving a thread is the nearest thing and carries no semantics.
- **Per-ticket permission overwrites.** A thread has no permission-overwrite object of its own. Its access is "the parent channel's permissions, plus whoever was added, plus `MANAGE_THREADS` holders", and the only knob is `invitable`. A ticket bot that cuts a fresh channel per ticket has far finer control than a thread ever will.

**Ruling implication.** The map already decided that join submission opens a Discord ticket from the site. This research says the ticket should be **a private thread on an officer text channel**, created by the bot, with officers reaching it through `MANAGE_THREADS` rather than through per-ticket invites. That deletes both ticket bots — but it is a rebuild, not a setting.

---

## 5. Temporary voice channels — is `VoiceMaster` doing something Discord has no answer for?

**Yes. No native equivalent was found.**

Checked: the [Channel resource](https://docs.discord.com/developers/resources/channel), the [Gateway events](https://docs.discord.com/developers/events/gateway) documentation, and help-centre material on voice channels. None documents an auto-create/auto-delete voice primitive, a "Join to Create" trigger channel, or any per-user on-demand channel feature. Stage channels are a distinct, manually created channel type for structured audio events and are not this. Reporting this as a plainly stated absence rather than a verified impossibility: no Discord page says "we do not have this", so the claim is "no Discord page documents it", which is the strongest form available.

**What building it costs**, per Discord's own docs — and it is cheap:

- **Intent:** `GUILD_VOICE_STATES`, `1 << 7` (decimal 128) ([Gateway](https://docs.discord.com/developers/events/gateway)), which covers `VOICE_STATE_UPDATE` and `VOICE_CHANNEL_EFFECT_SEND`.
- **Not privileged.** Discord lists only `GUILD_PRESENCES`, `GUILD_MEMBERS` and `MESSAGE_CONTENT` as privileged intents. `GUILD_VOICE_STATES` needs no app review, no verification, no gating. This is the important half of the finding: the feature the clan cannot get natively is also the feature with the lowest approval friction to build.
- **Event:** `VOICE_STATE_UPDATE` — "Someone joined, left, or moved a voice channel."
- **Permissions:** `MANAGE_CHANNELS` ("Allows management and editing of channels") to create and delete, and `MOVE_MEMBERS` ("Allows for moving of members between voice channels") to drop the joining member into the channel just created.

**Ruling implication.** `VoiceMaster` is a rebuild-then-drop, and it is the clearest one on the list: a small, well-bounded feature with no native alternative and no privileged-intent hurdle. Note that `MANAGE_CHANNELS` guild-wide is a broad grant; scoping it to a single voice category is worth doing when the permission set is finalised.

---

## 6. Server Insights — how much of `Statbot` is already there?

Source: [Server Insights FAQ](https://support.discord.com/hc/en-us/articles/360032807371-Server-Insights-FAQ) (snippet-sourced; direct fetch returned 403).

### The gate

**Community enabled, and more than 500 members.** Discord's wording: "If you're someone who helps run a Community Server with more than 500 members, you may have seen a new permission pop up in your server settings: View Server Insights."

This is the deciding fact for the `Statbot` ruling and it should be checked against the guild's actual member count before anything else. Below 500, Insights does not exist and the comparison is moot.

### What it shows

- Engagement and retention — "whether it's healthy, whether people are talking".
- Growth and activation — joins by source, week-one retention.
- Data is "up-to-date as of one day in the past" and goes "as far back as 120 days for non-Partner and Verified servers"; Partner and Verified servers get history back to their partner/verification date. Some charts only begin from the day the server crossed 500 members. All dates UTC.

### What it cannot do

- **No per-member data.** No leaderboards, no per-user message counts, no voice minutes per person — the thing clans actually want stats for.
- **No arbitrary date ranges.** Fixed windows, capped at 120 days.
- **No export.**
- **No API.** A targeted search of the developer docs found no Insights endpoint of any kind. Insights is a Server Settings UI surface with zero programmatic access. Anything that needs Insights-like numbers in the site or the bot has to compute them from gateway events itself.
- **One-day lag.** Nothing real-time.

**Ruling implication.** Insights and `Statbot` barely overlap. Insights answers "is the community healthy"; a stats bot answers "who has been active". If the clan uses `Statbot` for per-member activity — which is the usual reason — Insights replaces none of it, and the alternative is our own bot counting messages and voice minutes into Turso. That is a real feature with a real storage cost, not a setting, and it deserves its own ruling.

---

## What this means for the map

1. **Community is a prerequisite decision, and it is upstream of almost everything here.** Onboarding, forum channels and Insights all require it outright. Only AutoMod does not. Before ruling on `Carl-bot`, the ticket bots or `Statbot`, the clan has to decide whether the guild becomes a Community server — and Community brings its own obligations (rules channel, updates channel, and the onboarding channel constraints in §2).
2. **Two clean "turn on a setting" wins:** AutoMod for the filter half of `Dyno`/`MEE6`, and Onboarding questions for `Carl-bot`'s reaction roles.
3. **Three things that are definitely still code:** welcome messages, the ticket lifecycle, and temporary voice channels. All three are ordinary gateway-bot work; none needs a privileged intent.
4. **`Apollo` and `Statbot` are the two genuinely open questions**, and both hinge on what the clan actually uses today rather than on what Discord offers. The map is right to hold `Apollo` to last.
5. **One blocking unknown before the ticket ruling:** whether private threads are still gated behind Boost Level 2 in this guild. Five minutes of manual checking, and the whole ticket plan depends on it.

---

## Open Questions / Could Not Verify

1. **Modify Guild Onboarding endpoint.** `PUT /guilds/{guild.id}/onboarding` could not be retrieved from `docs.discord.com` — repeated fetches returned only the Guild Onboarding object definition, not the endpoint section. Its required permission and its documented error responses on constraint failure are unknown.
2. **Onboarding constraints under `ONBOARDING_ADVANCED`.** The 7-default-channels / 5-open-to-`@everyone` figure comes from a snippet of the Community Onboarding FAQ. How, or whether, Advanced mode relaxes it is not stated on any Discord page found. Verify in Server Settings.
3. **Private threads and Boost Level 2.** Discord's live Threads FAQ still carries the Level 2 requirement. Whether this is current policy or stale copy could not be resolved from a Discord source. **Test manually in the guild.**
4. **Community requirement for Scheduled Events.** Neither the developer docs nor the help article states whether the guild-scheduled-event endpoints are gated on the `COMMUNITY` feature. Unknown for `VOICE` and `EXTERNAL` events.
5. **Help-centre pages return HTTP 403 to automated fetches.** Every `support.discord.com` claim in this document marked snippet-sourced rests on a search-engine index of a Discord URL, not a full page load. They should be re-read in a browser before anything expensive is decided on them. The `docs.discord.com` developer-docs claims were fetched directly and carry no such caveat.
6. **AutoMod regex dialect.** "Rust-flavoured regex" is documented; the practical consequences (no backreferences, no lookaround) were only found in a Discord community-forum reply, not in the docs, and are therefore not asserted here.
7. **Scheduled event cover image constraints.** The `image` field exists and is a hash. Dimensions, aspect ratio and file-size limits were not found on the resource page.

---

## Key Sources

All Discord-owned. `discord.com/developers/docs/*` now redirects to `docs.discord.com/developers/*`; the latter form is used below.

- [Auto Moderation resource](https://docs.discord.com/developers/resources/auto-moderation) — trigger types, per-guild rule caps, filter limits, action types, timeout cap
- [Guild resource](https://docs.discord.com/developers/resources/guild) — guild onboarding object, welcome screen object, `system_channel_flags`
- [Guild Scheduled Event resource](https://docs.discord.com/developers/resources/guild-scheduled-event) — entity types, `recurrence_rule` and its limitations, `user_count`, the users endpoint, the 100-event cap
- [Channel resource](https://docs.discord.com/developers/resources/channel) — `GUILD_FORUM`, `forum_tag`, thread types, `invitable`, auto-archive durations
- [Permissions](https://docs.discord.com/developers/topics/permissions) — `MANAGE_THREADS`, `CREATE_PRIVATE_THREADS`, `SEND_MESSAGES_IN_THREADS`, `MANAGE_CHANNELS`, `MOVE_MEMBERS`
- [Gateway](https://docs.discord.com/developers/events/gateway) — intent bit values, the privileged-intent list, `GUILD_VOICE_STATES`
- [Gateway Events](https://docs.discord.com/developers/topics/gateway-events) — AutoMod events, scheduled-event user add/remove, `VOICE_STATE_UPDATE`
- [AutoMod FAQ](https://support.discord.com/hc/en-us/articles/4421269296535-AutoMod-FAQ) — preset categories, default exemptions, raid framing *(snippet-sourced)*
- [Community Onboarding FAQ](https://support.discord.com/hc/en-us/articles/11074987197975-Community-Onboarding-FAQ) — Community requirement, channel constraints, Channels & Roles tab *(snippet-sourced)*
- [Enabling Your Community Server](https://support.discord.com/hc/en-us/articles/360047132851-Enabling-Your-Community-Server) — Community prerequisites *(snippet-sourced)*
- [Server Guide FAQ](https://support.discord.com/hc/en-us/articles/13497665141655-Server-Guide-FAQ) — Server Guide sections, dependency on onboarding *(snippet-sourced)*
- [Scheduled Events](https://support.discord.com/hc/en-us/articles/4409494125719-Scheduled-Events) — the Interested mechanism, start notification, one-hour auto-removal *(snippet-sourced)*
- [Forum Channels FAQ](https://support.discord.com/hc/en-us/articles/6208479917079-Forum-Channels-FAQ) — Community requirement for forums
- [Threads FAQ](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ) — the Boost Level 2 statement on private threads *(snippet-sourced; see Open Question 3)*
- [Server Insights FAQ](https://support.discord.com/hc/en-us/articles/360032807371-Server-Insights-FAQ) — 500-member threshold, 120-day window, one-day lag *(snippet-sourced)*
- [Community Onboarding blog post](https://discord.com/blog/community-onboarding-welcome-your-new-members) — feature framing at launch

Discord support **community forum** posts were consulted only as evidence that a feature is *absent* (unresolved requests for scheduled-event RSVP tiers and for removing the private-thread boost gate). No positive claim in this document rests on one.

---

**Last fetched:** August 18, 2026
**Next review date:** Recommended before the `Apollo` ruling closes, and immediately if Discord ships RSVP states or changes the Insights threshold.
