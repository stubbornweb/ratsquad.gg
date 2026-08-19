# Research: Discord Ticket Channels, Buttons, and Their Limits

**Date of research:** August 19, 2026
**Scope:** The Discord mechanics a recruitment ticket depends on — private channel creation, threads vs channels, hard limits and rate limits, buttons that must survive a redeploy, permission checks on Accept, role assignment, and archival.
**Issue:** [#58](https://github.com/stubbornweb/ratsquad.gg/issues/58), part of the map in [#56](https://github.com/stubbornweb/ratsquad.gg/issues/56).
**Not re-researched here:** bundling `discord.js` ([#28](https://github.com/stubbornweb/ratsquad.gg/issues/28)). That RATS HQ is a single 24/7 gateway bot owning every Discord write is fixed by [#26](https://github.com/stubbornweb/ratsquad.gg/issues/26) and is assumed throughout.

**Sourcing rule for this document.** Same rule as `discord-native-features.md`: only Discord's own pages count — the developer docs (`docs.discord.com/developers/*`, whose source of truth is the public `discord/discord-api-docs` repository, quoted directly here) and `support.discord.com`. `discord.js` documentation is used only where Discord's own docs leave a doubt about *how you write the code*, never to establish a fact about the platform. Help-centre pages return HTTP 403 to automated fetches, so claims resting on a search-engine index of a Discord URL are marked **(snippet-sourced)**. Where nothing Discord-owned settles the question, the answer is **DOCS DO NOT SETTLE THIS**, not a guess.

---

## Summary

| Question | Short answer |
| --- | --- |
| 1. Private channel | `POST /guilds/{id}/channels` with three overwrites: deny `VIEW_CHANNEL` on `@everyone`, allow on the staff role, allow on the applicant. Bot needs `MANAGE_CHANNELS` **and every bit it writes into the overwrites**. |
| 2. Threads vs channels | Private thread is cheaper (no channel budget, no per-ticket overwrites) but **has no permission-overwrite object at all** — access is membership + `MANAGE_THREADS`. Not equivalent scoping. Possible Boost Level 2 gate, unresolved. |
| 3. Limits | 50 channels per category (**documented**); 500 channels / 50 categories per guild (**snippet-sourced**); active-thread cap exists but the **number is not documented**. Channel *creation* has no documented special limit; channel *name/topic edits* are throttled to ~2 per 10 min, and Discord states on the record that it will not document individual limits. |
| 4. Buttons | `custom_id`, 1–100 chars, developer-defined, returned on click. 3 s to respond, 15 min token. Discord documents **no expiry for the component itself** — but it does not affirmatively say buttons live forever either. |
| 5. Admin check | The interaction payload carries `member.permissions`, already resolved for that channel by Discord. Check the **staff role ID** in `member.roles`, not the `ADMINISTRATOR` bit. |
| 6. Role assignment | `PUT /guilds/{id}/members/{uid}/roles/{rid}`, needs `MANAGE_ROLES`, and the target role must sit **below** RATS HQ's highest role in the role list. |
| 7. Archival | Archived thread — free, no channel-budget cost. Locked channel or archive category — still one of the 500. Deleting is irreversible. |

The two things that will bite: **the 500-channel guild cap against a channel-per-applicant-forever flow**, and **the role-position ordering**, which fails silently.

---

## 1. Private channel creation

### The endpoint

> ## Create Guild Channel
> `POST /guilds/{guild.id}/channels`
>
> Create a new channel object for the guild. **Requires the `MANAGE_CHANNELS` permission. If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. Setting `MANAGE_ROLES` permission in channels is only possible for guild administrators.** Returns the new channel object on success. Fires a Channel Create Gateway event.

— [Guild resource, Create Guild Channel](https://docs.discord.com/developers/resources/guild#create-guild-channel)

Three consequences, all load-bearing:

1. **`MANAGE_CHANNELS` is guild-wide.** There is no scoped form of it. RATS HQ will hold the ability to create, edit and delete *any* channel in the guild. That is a real widening of the grant that `docs/research/discord-native-features.md` already flagged for `VoiceMaster`.
2. **The bot cannot grant what it does not have.** To write `allow: VIEW_CHANNEL | SEND_MESSAGES | READ_MESSAGE_HISTORY | ATTACH_FILES | EMBED_LINKS` into an overwrite, RATS HQ must itself hold every one of those bits at guild level. A bot that only has `MANAGE_CHANNELS` will get a 403 on the overwrite, not a silently reduced channel.
3. **`MANAGE_ROLES` cannot be put in a channel overwrite by a non-administrator bot.** So "give the applicant permission to manage the ticket" in any form that involves the `MANAGE_ROLES` bit is off the table unless RATS HQ is a guild administrator — which the repo's own audit (`auditBotChannelGrant`) treats as a failure condition.

### The overwrite shape

The [Overwrite Object](https://docs.discord.com/developers/resources/channel#overwrite-object):

| Field | Type | Description |
| --- | --- | --- |
| `id` | snowflake | role or user id |
| `type` | integer | either `0` (role) or `1` (member) |
| `allow` | string | permission bit set |
| `deny` | string | permission bit set |

Note both bit sets are **decimal strings**, not numbers — which is why `src/lib/discord-permissions.ts` does all of its arithmetic in `BigInt`.

The minimum shape for "applicant plus staff role, nobody else", using the bit values from the [Permissions](https://docs.discord.com/developers/topics/permissions#permissions-bitwise-permission-flags) table:

```jsonc
{
  "name": "ticket-<applicant>",
  "type": 0,                       // GUILD_TEXT
  "parent_id": "<recruitment category id>",
  "permission_overwrites": [
    { "id": "<guild id>",      "type": 0, "allow": "0",           "deny": "1024" },  // @everyone: deny VIEW_CHANNEL
    { "id": "<staff role id>", "type": 0, "allow": "68608",       "deny": "0"    },  // VIEW_CHANNEL|SEND_MESSAGES|READ_MESSAGE_HISTORY
    { "id": "<applicant id>",  "type": 1, "allow": "68608",       "deny": "0"    }
  ]
}
```

- `@everyone`'s overwrite id **is the guild id** — the `@everyone` role's id equals the guild id. `resolveChannelPermissions` in this repo already relies on that (`o.type === 0 && o.id === ctx.guildId`).
- `1024` = `VIEW_CHANNEL` (`1 << 10`). `68608` = `VIEW_CHANNEL` + `SEND_MESSAGES` (`1 << 11`, 2048) + `READ_MESSAGE_HISTORY` (`1 << 16`, 65536). Add `ATTACH_FILES` (`1 << 15`, 32768) and `EMBED_LINKS` (`1 << 14`, 16384) if applicants should be able to post screenshots — a recruitment ticket probably should.
- RATS HQ does **not** need an overwrite for itself if it already holds `VIEW_CHANNEL` and `SEND_MESSAGES` guild-wide; `@everyone`'s deny will strip `VIEW_CHANNEL` from it too, so in practice it needs either a guild-level role above the deny or its own allow overwrite. Adding an explicit bot overwrite is the safe form.

Overwrites can also be edited after creation, per channel and per target:

> **Edit Channel Permissions** — `PUT /channels/{channel.id}/permissions/{overwrite.id}` — Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. **Requires the `MANAGE_ROLES` permission. Only permissions your bot has in the guild or parent channel (if applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel).** Returns a 204 empty response on success.

— [Channel resource, Edit Channel Permissions](https://docs.discord.com/developers/resources/channel#edit-channel-permissions)

So **`MANAGE_ROLES` is required to change overwrites after the fact**, even though `MANAGE_CHANNELS` sufficed to set them at creation. Any flow that revokes the applicant's access on Reject needs `MANAGE_ROLES` on top of `MANAGE_CHANNELS`.

### Cross-check against `src/lib/discord-permissions.ts`

Discord's documented resolution order ([Permission Overwrites](https://docs.discord.com/developers/topics/permissions#permission-overwrites)):

> 1. Base permissions given to @everyone are applied at a guild level
> 2. Permissions allowed to a user by their roles are applied at a guild level
> 3. Overwrites that deny permissions for @everyone are applied at a channel level
> 4. Overwrites that allow permissions for @everyone are applied at a channel level
> 5. Overwrites that deny permissions for specific roles are applied at a channel level
> 6. Overwrites that allow permissions for specific roles are applied at a channel level
> 7. Member-specific overwrites that deny permissions are applied at a channel level
> 8. Member-specific overwrites that allow permissions are applied at a channel level

`resolveChannelPermissions` implements exactly this, and correctly accumulates **all** role denies before **all** role allows (steps 5–6), which is the subtle part — the docs spell out the consequence:

> For example, a user has two roles: A and B. A denies the `VIEW_CHANNEL` permission on a #coolstuff channel. B allows the `VIEW_CHANNEL` permission on the same #coolstuff channel. The user would ultimately be able to view the #coolstuff channel, regardless of the role positions.

— [Permissions, Permission Hierarchy](https://docs.discord.com/developers/topics/permissions#permission-hierarchy)

**The module is correct as written.** Two gaps worth recording rather than fixing here:

- It has no guild-owner short circuit. Discord's own pseudocode begins `if guild.is_owner(member): return ALL`. Irrelevant for a bot (a bot is never the owner), so this is a documentation note, not a bug.
- `PERMISSION` models four bits: `ADMINISTRATOR`, `VIEW_CHANNEL`, `SEND_MESSAGES`, `MANAGE_MESSAGES`. The ticket flow needs `MANAGE_CHANNELS` (`1 << 4`), `MANAGE_ROLES` (`1 << 28`), `READ_MESSAGE_HISTORY` (`1 << 16`), and — if threads are chosen — `CREATE_PRIVATE_THREADS` (`1 << 36`), `MANAGE_THREADS` (`1 << 34`), `SEND_MESSAGES_IN_THREADS` (`1 << 38`). Those constants have to be added before `make check-provisioning` can verify a ticket-capable bot.

**A collision worth naming now.** `auditBotChannelGrant` reports as `overreach` any channel outside `eventChannelIds` where the bot can send or manage. A ticket channel is by construction a channel where RATS HQ can send. Once ticket creation ships, **every open ticket will be reported as overreach** unless the audit learns about the recruitment category. That is a design decision for the implementing ticket, not a finding to act on here.

---

## 2. Private threads versus channels

### What a private thread is

> Private threads behave similar to Group DMs, but in a Guild. Private threads are always created with the `GUILD_PRIVATE_THREAD` type and **can only be created in `GUILD_TEXT` channels**.

> Private threads are similar to Group DMs, but in a guild: **You must be invited to the thread to be able to view or participate in it, or be a moderator (`MANAGE_THREADS` permission).**

— [Topics: Threads](https://docs.discord.com/developers/topics/threads)

Created with `POST /channels/{channel.id}/threads` ([Start Thread without Message](https://docs.discord.com/developers/resources/channel#start-thread-without-message)); `type` currently defaults to `PRIVATE_THREAD`, and the docs warn that this default will be removed in a future API version, so pass it explicitly.

### The decisive difference: threads have no overwrites

A thread's channel object has no `permission_overwrites` field, and there is no endpoint to set one. Threads

> generally inherit permissions from the parent channel

— [Topics: Threads, Permissions](https://docs.discord.com/developers/topics/threads)

Access to a private thread is therefore exactly three things: **thread membership**, **`MANAGE_THREADS` on the parent**, and the `invitable` flag ("whether non-moderators can add other non-moderators to a thread; only available on private threads", [Channel resource](https://docs.discord.com/developers/resources/channel#start-thread-without-message)).

**So: no, a thread cannot carry equivalent permission scoping.** You cannot say "the applicant may read but not attach files", or "this staff role sees it and that one does not". You get a membership list. If the ticket needs per-ticket granularity — and a recruitment ticket that later becomes read-only history plausibly does — a channel is the only mechanism with a knob for it.

One trap the docs call out explicitly:

> **The `SEND_MESSAGES` permission has no effect in threads; users must have `SEND_MESSAGES_IN_THREADS` to talk in a thread.**

A bot provisioned for channels will silently be unable to post in threads.

### What each costs

| | Private thread | Text channel |
| --- | --- | --- |
| Guild channel budget | **Does not count.** "Threads do not count against the max-channels limit in a guild, but there is a limit on the maximum number of active threads in a guild." | One of 500 (snippet-sourced, §3) |
| Category budget (50) | Not applicable | One of 50 |
| Per-ticket permission control | None beyond membership + `invitable` | Full overwrite object |
| Auto-cleanup | **Automatic**, on inactivity | None; explicit action required |
| Bot permissions to create | `CREATE_PRIVATE_THREADS` (+ `SEND_MESSAGES_IN_THREADS` to post) | `MANAGE_CHANNELS` (guild-wide) |
| Staff access mechanism | `MANAGE_THREADS` — which grants "viewing all private threads" guild-wide, not just recruitment ones | Per-channel role overwrite |
| Survives indefinitely | Only if unarchived; see below | Yes |

### Auto-archive, and why it is not free

`auto_archive_duration` may be **60, 1440, 4320 or 10080 minutes** (1 hour, 1 day, 3 days, 7 days) — [Channel resource](https://docs.discord.com/developers/resources/channel#start-thread-without-message).

But the duration is not a guarantee:

> Threads automatically archive after a period of inactivity. **As a server approaches the max thread limit this timer will automatically lower, usually not below the `auto_archive_duration`.** In very busy channels, threads set to a 7 day auto archive may archive earlier to help avoid the server becoming "full". "Activity" is defined as sending a message, unarchiving a thread, or changing the auto-archive time.

— [Topics: Threads](https://docs.discord.com/developers/topics/threads)

And an archived thread is close to inert:

> Users cannot edit messages, add reactions, **use application commands**, or join archived threads. The only operation that should happen within an archived thread is messages being deleted. Sending a message will automatically unarchive the thread, unless the thread has been locked by a moderator.

That last point is the one that matters for a ticket with Accept/Reject buttons: **a ticket sitting for four days while officers deliberate will archive itself, and the buttons on it stop being usable until something unarchives the thread.** Unarchiving is a `PATCH` on the thread; the docs note that "when setting `archived` to `false`, when `locked` is also `false`, only the `SEND_MESSAGES` permission is required", otherwise `MANAGE_THREADS`.

### The Boost Level 2 question, still open

`docs/research/discord-native-features.md` Open Question 3 flagged that Discord's [Threads FAQ](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ) still states private threads require Boost Level 2. **Re-checked for this document; still unresolved.** No Discord changelog, patch note or help page could be found announcing removal of the gate, and the Threads FAQ snippet still carries it (snippet-sourced). The developer docs never mention a boost requirement for `CREATE_PRIVATE_THREADS` at all — the two Discord sources disagree by omission.

**DOCS DO NOT SETTLE THIS.** It must be tested by hand in the RATS guild before any decision rests on private threads. It is a five-minute check and it invalidates half of option (2) if it goes the wrong way.

---

## 3. Hard limits and rate limits

### Channels per category — documented

> `parent_id` — for guild channels: id of the parent category for a channel (**each parent category can contain up to 50 channels**)

> `GUILD_CATEGORY` | 4 | an organizational category that **contains up to 50 channels**

— [Channel resource](https://docs.discord.com/developers/resources/channel#channel-object-channel-types), stated twice.

**50 per category is a hard, documented number.** A single "Recruitment" category holds at most 50 open tickets. That is the first ceiling the flow hits, long before the guild ceiling.

### Channels per guild — not in the developer docs

The developer documentation states no guild-wide channel maximum. Discord's help centre article [Discord Account Caps, Server Caps, and More](https://support.discord.com/hc/en-us/articles/33694251638295-Discord-Account-Caps-Server-Caps-and-More) is the canonical source, and gives **500 channels and 50 categories per server, 250 roles** (snippet-sourced; the page returns HTTP 403 to automated fetches). Categories are themselves channels and count toward the 500.

**Treat 500 as the working number but verify it in a browser before anything expensive depends on it.** It is the number the whole channel-per-applicant question turns on: at 500 channels total, minus the guild's existing tree, a recruitment flow that never deletes anything has a finite and countable lifespan. This is the single most important quantity in this document and it is the one Discord documents least well.

### Active threads per guild — number not documented

> Therefore guilds are capped at a certain number of active threads, and only active threads can be manipulated.

> Threads do not count against the max-channels limit in a guild, but there is a limit on the maximum number of active threads in a guild.

— [Topics: Threads](https://docs.discord.com/developers/topics/threads)

**DOCS DO NOT SETTLE THIS.** Discord says the cap exists and never gives the figure, anywhere in the developer docs. The practical mitigation is documented, though — the auto-archive timer shortens as you approach the cap, so the guild degrades by archiving early rather than by refusing to create threads.

### Rate limit on channel creation

There is **no documented special rate limit** on `POST /guilds/{guild.id}/channels`. What is documented:

> All bots can make up to **50 requests per second** to our API.

> **Per-route rate limits** exist for many individual endpoints, and may include the HTTP method. In some cases, per-route limits will be shared across a set of similar endpoints, indicated in the `X-RateLimit-Bucket` header.

> IP addresses that make too many invalid HTTP requests are automatically and temporarily restricted from accessing the Discord API. Currently, this limit is **10,000 per 10 minutes**. An invalid request is one that results in **401**, **403**, or **429** statuses.

— [Topics: Rate Limits](https://docs.discord.com/developers/topics/rate-limits)

A recruitment flow creates one channel per applicant, arriving at human pace. Nothing here is a constraint on that. The constraint is the 500-channel cap, not the request rate.

### Rate limit on channel *edits* — real, and deliberately undocumented

The issue's premise is correct: `PATCH /channels/{channel.id}` carries a **sublimit** on `name` and `topic` changes of roughly **2 requests per 10 minutes**, separate from and much harsher than the route's advertised bucket. The route's own documentation ([Modify Channel](https://docs.discord.com/developers/resources/channel#modify-channel)) says nothing about it.

Discord's position on this is on the record, from a Discord staff member replying in Discord's own API-docs repository:

> Individual rate limits are generally not documented on our API docs, and that is for good reason: **they can change at any time. We make no guarantees that rate limits will remain the same, and they may end up being variable per application at some point in the future.** We understand some 429 errors are to be encountered, which is why we offer flexibility by allowing applications to still encounter them before being temporarily blocked from the API. I would recommend you start logging and/or tracking metrics on 401, 403, and 429 status codes […]

— `night` (Discord staff), [discord/discord-api-docs#1900, "Undocumented channel rename rate limit"](https://github.com/discord/discord-api-docs/issues/1900)

The behaviour reported in that thread and in [#2190](https://github.com/discord/discord-api-docs/issues/2190) and [#1909](https://github.com/discord/discord-api-docs/issues/1909) — that the sublimit is invisible in the `X-RateLimit-*` headers, that the `X-RateLimit-Bucket` hash is identical whichever sublimit you hit, and that a `PATCH` with an unchanged name does not consume it — is **community-reported on a Discord-owned repository, not documented behaviour**. It is cited here as evidence that the limit exists and is undocumented, which is exactly what Discord staff confirm above. Do not encode the specific numbers.

**The design consequence stands regardless of the exact figure: do not encode ticket state in the channel name.** A flow that renames `ticket-x` to `✅-ticket-x` on Accept, or prefixes with a stage, will hit a limit it cannot see coming and cannot detect in advance. State belongs in the message embed, in a moved category, or in Turso — all three of which RATS HQ already has. The 429 that results carries `Retry-After`, and counts toward the 10,000-per-10-minutes invalid-request ban.

---

## 4. Message components: buttons that must survive a redeploy

### Custom IDs

> Additionally, interactive components like buttons and selects must have a `custom_id` field. **The developer defines this field when sending the component payload, and it is returned in the interaction payload sent when a user interacts with the component.** For example, if you set `custom_id: click_me` on a button, you'll receive an interaction containing `custom_id: click_me` when a user clicks that button.

> `custom_id` is only available on interactive components and must be unique per component. **Multiple components on the same message must not share the same `custom_id`. This field is a string of 1 to 100 characters and can be used flexibly to maintain state or pass through other important data.**

— [Components reference, Anatomy of a Component](https://docs.discord.com/developers/components/reference#anatomy-of-a-component)

Discord's own wording — "can be used flexibly to maintain state or pass through other important data" — endorses encoding the ticket identity in the id. A shape like `recruit:accept:<applicationId>` fits comfortably in 100 characters and makes the handler stateless.

Button fields: `style` (Primary 1 / Secondary 2 / Success 3 / **Danger 4**, the last being "an action with irreversible consequences" — the right style for Reject), `label` ≤ 80 characters, `custom_id` 1–100 characters, `disabled`. Non-link, non-premium buttons **must** have a `custom_id`. An action row holds up to 5 buttons.

### The deadline

> Interaction `tokens` are valid for **15 minutes** and can be used to send followup messages but you **must send an initial response within 3 seconds of receiving the event**. If the 3 second deadline is exceeded, the token will be invalidated.

— [Interactions: Receiving and Responding](https://docs.discord.com/developers/interactions/receiving-and-responding#responding-to-an-interaction)

For a button, the correct pattern when the work takes longer than 3 seconds is `DEFERRED_UPDATE_MESSAGE` (type 6), which is component-only and, unlike type 5, shows the user no loading state and leaves the original message intact. Then finish the work and edit within the 15 minutes. Accept does several writes — a Turso row, a role grant, a channel move, an announcement — so **deferring first is the default, not an optimisation.**

### Does a button posted months ago still work after a redeploy?

Two separate questions, and only one of them is settled.

**Settled: nothing in your process needs to remember the button.** The click arrives as a fresh `INTERACTION_CREATE` gateway event carrying the `custom_id` you originally set, plus `guild_id`, `channel`, `member` and `message`. A newly started process receives it identically to the process that sent it. The failure mode people hit is not Discord forgetting the button — it is the bot handling components with an in-memory collector, which dies with the process. `discord.js` says this plainly:

> Creating a permanent component handler in the `Client#interactionCreate` event. […] For this, returning to the `Client#interactionCreate` event is the best approach [for] permanent button or select menu features within your guild.

> Message components interactions require a response within 3 seconds, else Discord will treat them as failed.

— [discord.js guide, Component interactions](https://discordjs.guide/interactive-components/interactions)

So: **RATS HQ must route Accept/Reject through the `interactionCreate` event and parse the `custom_id`, never through `awaitMessageComponent()` or an `InteractionCollector`.** A collector is correct for a 60-second confirmation prompt; it is wrong for a ticket that may sit for a week and must survive `git push`.

**Not settled: whether the component itself ever expires.** Discord documents an expiry for the *interaction token* (15 minutes) and no expiry at all for a component attached to a message. But it also never affirmatively states that components remain clickable indefinitely. **DOCS DO NOT SETTLE THIS.** The absence of a documented expiry is the strongest available evidence and is what every ticket bot in practice relies on, but it is an absence, not a guarantee. If the design cannot tolerate a dead button on a nine-month-old ticket, the mitigation is cheap and worth building anyway: a slash command that does the same thing as the buttons, so a stale ticket is never unresolvable.

---

## 5. Verifying the presser is staff, not the applicant

Discord resolves this for you and puts the answer in the payload. The interaction object:

| Field | Type | Description |
| --- | --- | --- |
| `member?` | guild member object | **Guild member data for the invoking user, including permissions** |
| `app_permissions` | string | Bitwise set of permissions **the app** has in the source location of the interaction |

— [Interactions: Receiving and Responding, Interaction Object](https://docs.discord.com/developers/interactions/receiving-and-responding#interaction-object)

and on the member object:

| Field | Type | Description |
| --- | --- | --- |
| `permissions?` | string | **total permissions of the member in the channel, including overwrites, returned when in the interaction object** |

— [Guild resource, Guild Member Object](https://docs.discord.com/developers/resources/guild#guild-member-object)

Three facts follow:

1. **`member.permissions` is already channel-resolved by Discord.** No extra fetch, no re-running `resolveChannelPermissions`, no cache staleness. The repo's resolver stays useful for the *provisioning audit*, which reasons about channels nobody is currently interacting with — a different job.
2. **`member` is present only in a guild.** "`member` is sent when the interaction is invoked in a guild, and `user` is sent when invoked in a DM." A handler must reject the DM case rather than assume `member` exists.
3. **`app_permissions`** lets the bot check *its own* rights in that channel before attempting the side effects — useful for failing with a readable message instead of a 403.

### What to actually check

The issue says "administrator". Two different things go by that name and choosing wrong is a real bug:

- **The `ADMINISTRATOR` permission bit** (`1 << 3`) — "Allows all permissions and bypasses channel permission overwrites" ([Permissions](https://docs.discord.com/developers/topics/permissions#permissions-bitwise-permission-flags)). Testing this bit means anyone with server-admin rights can accept a recruit, and anyone the clan considers a recruiter but has *not* given full admin cannot.
- **The RATS staff/officer role**, an id in `src/consts/`. `CONTEXT.md`'s vocabulary — Officer, Дуче — is about roles, not permission bits.

**Check the role id in `member.roles`, not the `ADMINISTRATOR` bit.** `member.roles` is an array of role snowflakes on the member object, present in the interaction payload; a set-membership test against the configured officer role ids is the whole check, and it costs nothing.

Belt and braces: because the ticket channel's overwrite (§1) already denies `VIEW_CHANNEL` to everyone but the applicant and the staff role, an ordinary member cannot reach the message to click it at all. The applicant *can*, which is precisely why the handler check is not optional.

---

## 6. Role assignment on Accept

### The endpoint

> **Add Guild Member Role** — `PUT /guilds/{guild.id}/members/{user.id}/roles/{role.id}`
>
> Adds a role to a guild member. **Requires the `MANAGE_ROLES` permission.** Returns a 204 empty response on success. Fires a Guild Member Update Gateway event. This endpoint supports the `X-Audit-Log-Reason` header.

— [Guild resource, Add Guild Member Role](https://docs.discord.com/developers/resources/guild#add-guild-member-role)

Use `X-Audit-Log-Reason`. It is free, and it puts "accepted by @officer via ticket #123" into the guild audit log, which is the cheapest possible answer to "who let this person in".

`MANAGE_ROLES` is also one of the permissions Discord marks with an asterisk:

> **These permissions require the owner account to use two-factor authentication when used on a guild that has server-wide 2FA enabled.**

— [Permissions](https://docs.discord.com/developers/topics/permissions#permissions-bitwise-permission-flags)

If the RATS guild has server-wide 2FA on, the account that owns the RATS HQ application must have 2FA enabled or every role grant fails.

### The hierarchy rule, stated exactly

> How permissions apply may at first seem intuitive, but there are some hidden restrictions that prevent bots from performing certain inappropriate actions based on a bot's highest role compared to its target's highest role. **A bot's or user's highest role is its role that has the greatest position value in the guild, with the default @everyone role starting at 0.** Permissions follow a hierarchy with the following rules:
>
> - **A bot can grant roles to other users that are of a lower position than its own highest role.**
> - A bot can edit roles of a lower position than its highest role, but it can only grant permissions it has to those roles.
> - A bot can only sort roles lower than its highest role.
> - A bot can only kick, ban, and edit nicknames for users whose highest role is lower than the bot's highest role.

— [Permissions, Permission Hierarchy](https://docs.discord.com/developers/topics/permissions#permission-hierarchy)

### How the ordering must be configured

Every role RATS HQ will ever grant or revoke must sit **strictly below** RATS HQ's own highest role in Server Settings → Roles. Higher in that list = higher `position` = higher precedence.

For this map's three progression stages plus the recruitment states, the list must read, top to bottom:

```
Дуче                     ← above the bot; the bot must never touch it
Officer                  ← above the bot; the bot must never touch it
──────────────────────────────────────────────────────────
RATS HQ                  ← the bot's own role. Everything it grants lives below this line.
──────────────────────────────────────────────────────────
RATS
Recruit
Intern
Inactive
@everyone                (position 0)
```

Notes that make this non-obvious in practice:

- **RATS HQ's role is created by Discord at invite time and lands at the bottom of the list.** Nobody moves it, and then role grants fail. This is the classic silent failure the issue names.
- **The failure is a 403 `Missing Permissions` on the API call, not a validation error at configuration time.** Discord will happily let you order the list wrongly; you find out on the first Accept. So the ordering must be asserted by `make check-provisioning`: fetch the guild roles, find RATS HQ's highest position, and fail if any grantable role's position is greater than or equal to it. That check does not exist yet and is the concrete deliverable this section implies.
- **Position ties are possible and resolve by id.** The channel-object docs note "channels with the same position are sorted by id" for channels; for roles, the safe rule is to require a strict `<`, never `<=`.
- **`ADMINISTRATOR` does not exempt a bot from the hierarchy.** It bypasses *channel overwrites* ("Allows all permissions and bypasses channel permission overwrites") — the hierarchy rules above are stated without exception. Giving RATS HQ Administrator is therefore both a security regression *and* not a fix for a mis-ordered role list.

---

## 7. Keeping the ticket as history

Four options, and what each costs against §3.

### (a) Archive the thread — if the ticket is a thread

Free against the channel budget: "Threads do not count against the max-channels limit in a guild." Archiving is a `PATCH` setting `archived: true`, and pairing it with `locked: true` makes it genuinely read-only — "when a thread is locked, only users with `MANAGE_THREADS` can unarchive it", and a message can no longer silently unarchive it, since "sending a message will automatically unarchive the thread, **unless the thread has been locked by a moderator**".

Archived threads persist and remain enumerable — `GET /channels/{channel_id}/threads/archived/private` "returns all archived, private threads in a channel, sorted by archive timestamp descending". They are not synced over the gateway, so RATS HQ must fetch them on demand rather than expect them in `GUILD_CREATE`.

**Cost:** none against the 500. Consumes an active-thread slot only while active. Requires accepting §2's answer — no per-ticket overwrites, and the Boost Level 2 question unresolved. Also: an archived thread cannot run application commands, so a "reopen" affordance must live outside it.

### (b) Lock the channel in place — deny `SEND_MESSAGES`

`PUT /channels/{id}/permissions/{overwrite.id}` moving `SEND_MESSAGES` from `allow` to `deny` for the applicant and the staff role, leaving `VIEW_CHANNEL` and `READ_MESSAGE_HISTORY` allowed. Requires `MANAGE_ROLES` (§1). Readable forever, writable by nobody.

**Cost:** the channel stays one of the 500 and one of its category's 50, forever. This is the expensive option, and it is the one the naive reading of "keep the ticket as recruitment history" leads to.

### (c) Move to an archive category

`PATCH /channels/{channel.id}` with a new `parent_id` — the field is documented as "id of the new parent category for a channel". Requires `MANAGE_CHANNELS`. Note the [Modify Guild Channel Positions](https://docs.discord.com/developers/resources/guild#modify-guild-channel-positions) endpoint's rule, which describes the same permission model:

> An entry that changes `parent_id` requires the `MANAGE_CHANNELS` permission on that channel **and on the destination** (the new parent category, or the guild when moving the channel out of a category), and the current user must be able to view the channel. Otherwise the request fails with a `403` response and error code `50001` (`Missing Access`). Setting `lock_permissions` additionally requires `MANAGE_ROLES`.

**Cost:** frees a slot in the recruitment category's 50 but **not** in the guild's 500 — and the archive category has its own 50-channel ceiling, so this buys 50 tickets at a time and needs archive-1, archive-2… A `parent_id` change is a `PATCH /channels/{id}`; whether it lands in the 2-per-10-minutes name/topic sublimit or the ordinary bucket is **not documented** (see §3, and Discord's stated policy of not documenting individual limits). Assume it may be throttled and queue moves rather than doing 40 at once.

### (d) Delete

> **Deleting a guild channel cannot be undone.** Use this with caution, as it is impossible to undo this action when performed on a guild channel.

— [Channel resource, Delete/Close Channel](https://docs.discord.com/developers/resources/channel#deleteclose-channel)

**Cost:** the history. Only viable if a transcript is written to Turso first — which RATS HQ can do, since #26 gives it direct database access, and which is arguably the right architecture anyway: Discord is a poor archive and the site already has a database that "never forgets" ([#7](https://github.com/stubbornweb/ratsquad.gg/issues/7)).

### The arithmetic that decides this

Everything above is downstream of one number: 500 channels per guild (snippet-sourced), minus the RATS tree as it stands today. If the clan takes ~50 applications a year and keeps every ticket as a channel, option (b) or (c) buys under a decade before the guild is full and nothing else can be created — including the per-scrim event channels that `src/lib/event-channels.ts` already depends on existing. **Count the guild's current channels before choosing.** That count is a `make discord-channels` away and it is the first thing the design ticket should do.

---

## Open questions / could not verify

1. **The guild channel cap (500) and category cap (50).** Not in the developer docs at all; snippet-sourced from the help centre, which returns 403 to automated fetches. This is the number the whole channel-versus-thread decision turns on. **Verify in a browser, and count the RATS guild's existing channels.**
2. **The active-thread cap per guild.** Discord states the cap exists and never gives the number. No figure appears anywhere in the developer docs.
3. **Whether private threads still require Boost Level 2.** Unresolved since `discord-native-features.md`; re-checked here and still unresolved. The Threads FAQ says yes, the developer docs say nothing. **Test by hand in the guild.**
4. **Whether a message component ever expires.** No documented expiry, and no documented guarantee of permanence either. The absence is strong but is not a statement.
5. **The exact `PATCH /channels/{id}` sublimit, and which fields it covers.** Discord staff state on the record that individual rate limits are deliberately undocumented and may change or become per-application. Whether a `parent_id`-only change is throttled with `name`/`topic` is unknown. Never hard-code the numbers; parse `Retry-After`.
6. **Whether the RATS guild has server-wide 2FA enabled.** If it does, `MANAGE_ROLES` and `MANAGE_CHANNELS` both require 2FA on the application owner's account. A guild-settings check, not a docs question.
7. **Interaction delivery to a restarting gateway bot.** The docs do not state what happens to an interaction whose click lands during the seconds RATS HQ is disconnected for a redeploy. The 3-second deadline is documented; whether the event is buffered, replayed on `RESUME`, or lost is not. Worst case is a user seeing "This interaction failed" and clicking again, which is survivable — but it argues for making Accept idempotent on the application id rather than assuming exactly-once delivery.

---

## Key sources

Discord-owned unless noted. `discord.com/developers/docs/*` redirects to `docs.discord.com/developers/*`; the developer-docs text quoted above was read from the public `discord/discord-api-docs` repository, which is the source those pages are built from.

- [Guild resource](https://docs.discord.com/developers/resources/guild) — Create Guild Channel, Modify Guild Channel Positions, Add/Remove Guild Member Role, guild member object `permissions`
- [Channel resource](https://docs.discord.com/developers/resources/channel) — overwrite object, 50-per-category, Modify Channel, Edit Channel Permissions, Delete/Close Channel, Start Thread without Message, `auto_archive_duration`, `invitable`, `locked`
- [Topics: Permissions](https://docs.discord.com/developers/topics/permissions) — bit values, Permission Hierarchy, Permission Overwrites resolution order and pseudocode, the 2FA asterisk
- [Topics: Threads](https://docs.discord.com/developers/topics/threads) — private threads, `SEND_MESSAGES_IN_THREADS` warning, active/archived behaviour, "threads do not count against the max-channels limit", enumeration routes, editing/deleting threads
- [Topics: Rate Limits](https://docs.discord.com/developers/topics/rate-limits) — 50 requests/second global, per-route buckets, 10,000 invalid requests per 10 minutes, `X-RateLimit-Scope`
- [Components reference](https://docs.discord.com/developers/components/reference) — `custom_id` semantics and 1–100 length, button object and styles, action row limits
- [Interactions: Receiving and Responding](https://docs.discord.com/developers/interactions/receiving-and-responding) — interaction object, `member`, `app_permissions`, the 3-second deadline and 15-minute token, deferred response types
- [discord/discord-api-docs#1900](https://github.com/discord/discord-api-docs/issues/1900) — Discord staff on why individual rate limits are not documented *(Discord-owned repository; the surrounding community reports are cited only as evidence the sublimit exists)*
- [Discord Account Caps, Server Caps, and More](https://support.discord.com/hc/en-us/articles/33694251638295-Discord-Account-Caps-Server-Caps-and-More) — 500 channels, 50 categories, 250 roles *(snippet-sourced)*
- [Threads FAQ](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ) — the Boost Level 2 statement on private threads *(snippet-sourced; see open question 3)*
- [discord.js guide, Component interactions](https://discordjs.guide/interactive-components/interactions) — *non-Discord source, used only for the handling pattern (permanent `interactionCreate` handler versus collector), not for any platform fact*

---

**Last fetched:** August 19, 2026
**Next review date:** Before the ticket-mechanics design ticket on [#56](https://github.com/stubbornweb/ratsquad.gg/issues/56) closes, and immediately if Discord changes the guild channel cap or the private-thread boost gate.
