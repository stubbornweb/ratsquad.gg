# Research: discord.js bundled to one file on a 1 GB host

**Date of research:** August 18, 2026
**Scope:** Whether a single-file esbuild bundle of a `discord.js` + `@libsql/client` bot runs on a Pterodactyl/Pelican host with **no `npm install`**, and what the bot needs at the Discord gateway. Answers issue #28 (part of #26).

---

## Summary

**Yes — the single-file, no-`npm install` deploy holds, with three conditions.** Verified empirically, not inferred: a bundle containing `discord.js@14.27.0`, `@libsql/client@0.17.4` and `drizzle-orm@0.45.2` was built with `esbuild@0.28.2` and executed from a directory with **no `node_modules` anywhere on its parent path**. It booted, constructed a `Client` with five intents, constructed a Drizzle/libSQL handle, and — given a deliberately invalid token — reached Discord's REST API over the network and failed with `TokenInvalid`. That is a real round trip out of a self-contained file.

The three conditions:

1. **Import `@libsql/client/web`, not `@libsql/client`** — and, critically, **`drizzle-orm/libsql/web`, not `drizzle-orm/libsql`**. The Drizzle default subpath statically requires the native client and silently reintroduces a `node_modules` dependency into a bundle that otherwise has none. This is the trap, and it fires *at runtime on the host*, not at build time.
2. **Do not install `zlib-sync` on the build machine.** Absent, it is harmless (discord.js degrades gracefully). Present, it is a **hard esbuild build error**. If you want it, mark it `--external:zlib-sync` and ship it beside the bundle.
3. **Use `--format=cjs`.** `--format=esm` produces a bundle that throws `Dynamic require of "node:events" is not supported` on the first line of discord.js. A `createRequire` banner fixes it; CJS avoids the question.

Resident memory is **not** the concern the ticket suspected — an idle bundled client sits around **80 MB RSS** on Node 24, most of it Node's own baseline. Disk is not close: the minified bundle is **1.52 MB** (429 KB gzipped). A 1 GB allowance is comfortable by three orders of magnitude; the only thing that can fill it is **logs**, so rotation is the one disk control worth writing down.

At the gateway, the features in #26 are cheaper than expected: **slash commands need no intent at all**, and **temporary voice channels need no privileged intent**. Both privileged intents the bot would want (`GuildMembers`, `MessageContent`) are **already enabled** on `RATS Integration Helper` per `docs/setup/provisioning.md` §3 and §4.

---

## Method, and what "verified" means here

Claims below marked **[verified]** were produced by running the thing, in a throwaway directory that has since been deleted. Reproduce with:

```bash
mkdir /tmp/probe && cd /tmp/probe && npm init -y
npm i discord.js @libsql/client drizzle-orm esbuild
# entry.js as in §1.2
npx esbuild entry.js --bundle --platform=node --target=node22 --format=cjs --outfile=dist/index.js
cp dist/index.js /tmp/isolated/   # somewhere with NO node_modules above it
node /tmp/isolated/index.js
```

The `/tmp/isolated` step is the whole experiment. Running the bundle from inside the project directory **proves nothing**: Node walks up the tree and finds the very `node_modules` the deploy will not have. Both of the failure modes in §2 look like success until you move the file.

Versions under test: Node **24.16.0**, `discord.js` **14.27.0**, `@libsql/client` **0.17.4**, `drizzle-orm` **0.45.2**, `esbuild` **0.28.2**.

---

## 1. Bundling discord.js with esbuild

### 1.1 The tree has no native code in it

`discord.js@14.27.0` declares **no `optionalDependencies`** and no native dependency. [Its runtime deps](https://github.com/discordjs/discord.js/blob/14.27.0/packages/discord.js/package.json) are `@discordjs/{collection,ws,builders,rest,formatters,util}`, `@sapphire/snowflake`, `discord-api-types`, `fast-deep-equal`, `lodash.snakecase`, `magic-bytes.js`, `tslib`, `undici` — all pure JavaScript. **[verified]** by reading the installed `package.json`.

The four hazards the ticket named:

| Hazard | Status | Evidence |
| --- | --- | --- |
| `zlib-sync` | Not a dependency. Loaded through a *guarded* dynamic `import()` with `.catch(() => null)`. Harmless if absent — **fatal to the build if present**. | **[verified]**, §1.4 |
| `bufferutil` / `utf-8-validate` | Optional **peer** dependencies of `ws`, not installed by default. `require()`d inside `try`/`catch` in `ws/lib`. | **[verified]** — `ws@8`'s `peerDependenciesMeta` marks both optional; esbuild logs `Importing "utf-8-validate" was allowed even though it could not be resolved because dynamic import failures appear to be handled here [ignored-dynamic-import]` |
| `@discordjs/opus` | **Not in the tree.** It belongs to `@discordjs/voice`, which discord.js does not depend on. Irrelevant unless the bot plays audio — see §1.7. | **[verified]** |
| `__dirname` / dynamic `require` | One occurrence that matters, in `@discordjs/ws`'s `WorkerShardingStrategy`, which is not the default. | **[verified]**, §1.5 |

Because esbuild treats unresolvable imports inside `try`/`catch` (and `.catch()`ed dynamic `import()`) as [`ignored-dynamic-import`](https://esbuild.github.io/api/#log-override), the optional natives produce **zero warnings** and are simply left as runtime `require()` calls that will throw and be swallowed. That is the mechanism that makes this whole plan work, and it is worth knowing by name: it is silent, so an absent warning is not evidence of a clean bundle.

### 1.2 The build that works

```js
// entry.js
const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js');
const { createClient } = require('@libsql/client/web');   // NOT '@libsql/client'
const { drizzle } = require('drizzle-orm/libsql/web');     // NOT 'drizzle-orm/libsql'
```

```bash
esbuild src/index.ts \
  --bundle --platform=node --target=node22 --format=cjs \
  --minify --outfile=dist/index.js
```

`--platform=node` is what makes esbuild leave `node:*` builtins external and pick the `node`/`require` export conditions. Nothing else has to be marked external, and **nothing has to ship alongside the bundle** — one file, plus whatever the host provides as a Node runtime. **[verified]**

### 1.3 `--format=esm` does not work out of the box

```
Error: Dynamic require of "node:events" is not supported
    at node_modules/discord.js/src/client/BaseClient.js (esm.mjs:33817:24)
```

**[verified].** discord.js is CommonJS; esbuild's ESM output replaces `require` with a stub that throws. Two fixes, both verified to boot:

```bash
# A. CJS output — recommended, nothing to remember
--format=cjs

# B. ESM output, with a banner that restores require
--format=esm \
--banner:js="import{createRequire as __cr}from'node:module';const require=__cr(import.meta.url);"
```

### 1.4 `zlib-sync`: harmless absent, fatal to the build if present

With `zlib-sync` installed and resolvable at build time:

```
✘ [ERROR] No loader is configured for ".node" files: node_modules/zlib-sync/build/Release/zlib_sync.node
    node_modules/zlib-sync/index.js:3:25:
      3 │ module.exports = require("./build/Release/zlib_sync.node");
```

**[verified].** Unlike `bufferutil`, `zlib-sync`'s entry is a *static relative* `require` of a `.node` file, which esbuild must resolve and cannot load. Adding `--external:zlib-sync` clears the error and the bundle boots isolated — but then `zlib-sync` and its `.node` binary must be installed on the host, which is exactly the `npm install` the deploy is trying to avoid.

**Recommendation: do not install `zlib-sync`.** Without it discord.js logs `WebSocketShard: Compression is enabled but zlib-sync is not installed, falling back to identify compress` and carries on. For one small guild the bandwidth saving is irrelevant.

### 1.5 The one real `__dirname` landmine

```js
// @discordjs/ws — WorkerShardingStrategy#resolveWorkerPath()
if (!path) return join(__dirname, 'defaultWorker.js');
```

**[verified]** present in the bundle. In a bundle `__dirname` is the directory of `dist/index.js`, where `defaultWorker.js` does not exist. This is only reached if you opt into `buildStrategy: WorkerShardingStrategy` — the default `SimpleShardingStrategy` never touches it. **Do not use worker sharding in a bundled bot.** A single-guild bot needs one shard anyway.

### 1.6 Sizes

| Build | Size |
| --- | --- |
| `--format=cjs` | 3.76 MB |
| `--format=esm` (with banner) | 3.76 MB |
| `--format=cjs --minify` | **1.52 MB** |
| minified + gzipped | 429 KB |
| `@libsql/client` alone, unminified | 369 KB |

**[verified]** — measured on a bundle containing discord.js, `@libsql/client/web` and `drizzle-orm/libsql/web`.

### 1.7 The line not to cross: `@discordjs/voice`

Temporary voice channels do **not** need `@discordjs/voice` — creating, moving and deleting channels is REST plus `VOICE_STATE_UPDATE` (§3.1). But if the bot ever *plays or receives audio*, the pure-JS story ends. `@discordjs/voice@0.19.2` has a **hard** dependency on [`@snazzah/davey`](https://www.npmjs.com/package/@snazzah/davey) (Discord's DAVE end-to-end encryption), which ships as napi platform packages — `@snazzah/davey-linux-x64-gnu` and friends — exactly like `libsql`. Audio also wants an Opus binding (`@discordjs/opus`, native, or `opusscript`, pure-JS and slower). **[verified]** via `npm view @discordjs/voice dependencies` and `npm view @snazzah/davey optionalDependencies`.

**Treat "the bot plays audio" as the event that invalidates this research.**

---

## 2. `@libsql/client` — which entry point is safe

### 2.1 The default entry is native; `web` and `http` are not

`@libsql/client@0.17.4` lists **`libsql` as a regular dependency**, not an optional one — so it always installs on the build machine (~20 MB of `@libsql/*` prebuilt `.node` binaries). The question is only whether it ends up *in the bundle*. **[verified]** from the installed `package.json`.

| Import path | Reaches native `libsql`? |
| --- | --- |
| `@libsql/client` (default → `node`) | **Yes** |
| `@libsql/client/node`, `@libsql/client/sqlite3` | **Yes** |
| **`@libsql/client/web`** | **No** — pure JS |
| `@libsql/client/http` | **No** — pure JS |

The failure is loud but only off-host:

```
Error: Cannot find module '@libsql/linux-x64-gnu'
    at requireNative (index.js:82262:14)
    at ../node_modules/libsql/index.js
```

**[verified].** The `libsql` loader ends in ``require(`@libsql/${target}`)`` — a *template literal*, so esbuild leaves it as a runtime require with no warning, and the destructure that calls it runs at **module load**. On the build machine it resolves; on the host it does not, and the process dies before your first line of code.

### 2.2 URL schemes — the existing Turso URL is fine

`TURSO_DATABASE_URL` in `provisioning.md` §1 is `libsql://rats-site-smereka.aws-eu-west-1.turso.io`. That scheme works with the web client:

| Entry | `libsql:` | `https:` | `wss:` | `file:` |
| --- | --- | --- | --- | --- |
| `@libsql/client/web` | ✅ → HTTP | ✅ | ✅ → WS | ❌ `URL_SCHEME_NOT_SUPPORTED` |
| `@libsql/client/http` | ✅ | ✅ | ❌ | ❌ |

**[verified].** No env-var change is needed. Only a local `file:` database requires the native client — which is another reason the bot should talk to Turso over HTTP like the site does, not keep a local SQLite file.

### 2.3 Drizzle's driver *does* change the answer — this is the trap

```js
// drizzle-orm/libsql/driver.cjs
var import_client = require("@libsql/client");        // native
// drizzle-orm/libsql/web/index.cjs
var import_web = require("@libsql/client/web");       // pure JS
```

**[verified]** by grep in the installed package. Consequence, verified end to end:

- `@libsql/client/web` + **`drizzle-orm/libsql`** → bundles clean, boots in-project, **dies isolated** with `Cannot find module '@libsql/linux-x64-gnu'`.
- `@libsql/client/web` + **`drizzle-orm/libsql/web`** → **boots isolated**.

Being careful about the libSQL import and careless about the Drizzle import buys nothing. Drizzle exposes `./libsql/http`, `./libsql/ws`, `./libsql/web`, `./libsql/node`, `./libsql/sqlite3` and `./libsql/wasm`; **`/web`** is the one to use.

**This is the single highest-value line in this document.** Consider enforcing it — an ESLint `no-restricted-imports` rule banning bare `drizzle-orm/libsql` and `@libsql/client` in the bot's source would turn a production-only crash into a lint failure.

---

## 3. Gateway intents

### 3.1 What each feature needs

Values from [Discord's gateway intents list](https://docs.discord.com/developers/events/gateway#list-of-intents).

| Feature | Intent | Bit | Privileged? |
| --- | --- | --- | --- |
| Guild/channel/role caches (the base for everything) | `Guilds` | `1 << 0` | No |
| Member join / leave (`GUILD_MEMBER_ADD` / `_REMOVE`) | `GuildMembers` | `1 << 1` | **Yes** |
| Knowing a message happened (`MESSAGE_CREATE`) | `GuildMessages` | `1 << 9` | No |
| Reading a message's `content`, `embeds`, `attachments`, `components` | `MessageContent` | `1 << 15` | **Yes** |
| Temporary voice channels (`VOICE_STATE_UPDATE`) | `GuildVoiceStates` | `1 << 7` | No |
| Slash commands (`INTERACTION_CREATE`) | **none** | — | — |

Notes that matter:

- **Slash commands need no intent.** `INTERACTION_CREATE` is in no intent group, and Discord's rule is that any event not listed is always delivered. The [discord.js command-handling guide](https://discordjs.guide/legacy/app-creation/deploying-commands) runs its whole example on `intents: [GatewayIntentBits.Guilds]`, and `Guilds` there is only for cache resolution.
- **`MessageContent` is not an event intent** — it gates *fields*, and it gates them [on REST reads too](https://docs.discord.com/developers/events/gateway#message-content-intent), which is exactly what `provisioning.md` §3 already records.
- **`Guilds` is effectively mandatory.** Without it, "data for interactions and messages will include only the guild and channel id, and will not resolve to the full class" ([intents guide](https://discordjs.guide/popular-topics/intents)).
- **`GuildVoiceStates` is not privileged**, and `VOICE_STATE_UPDATE` carries the full `member` object — so a temp-VC bot needs **no portal toggle at all**.
- **`GuildMembers` gates the full member list.** `guild.members.fetch()` is the `REQUEST_GUILD_MEMBERS` op, and Discord requires the intent to request the entire list. Without it the call hangs.
- Requesting a privileged intent that is not enabled closes the socket with **[close code `4014` "Disallowed intent(s)"](https://docs.discord.com/developers/topics/opcodes-and-status-codes)**, non-reconnectable; discord.js surfaces it as `[DisallowedIntents]`. Portal changes only take effect on a **new** connection — restart the bot.

### 3.2 Cross-check against `docs/setup/provisioning.md`

- **§3 — Message Content intent: already enabled**, and not merely assumed: it was proved on 2026-07-29 by reading a real channel and getting populated `content`/`embeds`, and `make check-provisioning` re-proves it every run. Nothing to do.
- **§4 — Server Members intent: already enabled.** §4 states the roster fetch "needs only `View Channels` plus the Server Members intent", and `src/lib/discord.ts` works today — `GET /guilds/{id}/members` is gated on the same portal toggle as the `GuildMembers` gateway intent. So the gateway client can take `GuildMembers` for free.
- **Both privileged intents the bot wants are therefore already on.** The gateway work adds **`GuildVoiceStates`, which is not privileged.** §2b's outstanding blocker (the client secret, and the personally-owned application) does **not** block the bot: the bot token is already provisioned and intent toggles are already flipped. **The bot is not gated on Creep-ak.**
- **§4 conflicts with temporary voice channels, and this needs deciding.** §4 plans to strip `Administrator` from **Integration Helper** and leave it `View Channels` + `Read Message History`, with `Send Messages` + `Manage Messages` overwritten only on the «Календар 1.1» category. Temp voice channels need `MANAGE_CHANNELS` (`1 << 4`) to create and delete, and `MOVE_MEMBERS` (`1 << 24`) to drag the joiner in ([permissions reference](https://docs.discord.com/developers/topics/permissions)). Neither is in §4's list. **Grant them as an overwrite on the voice category that holds the lobby**, never guild-wide — `make check-provisioning` exists specifically to fail on a guild-wide grant, and it should be extended to expect this second scoped overwrite rather than be loosened.

### 3.3 Privileged-intent eligibility — the 100-server rule is stale

The discord.js guide still says "not verified and in less than 100 guilds". Discord's current rule is different: **as of June 10, 2026**, the threshold is **10,000 unique reachable users**; below it, [privileged intents are a self-serve toggle with no application](https://docs.discord.com/developers/gateway/getting-started-with-privileged-intent-review). The 100-server number now only governs [app *verification*](https://support-dev.discord.com/hc/en-us/articles/23926564536471-How-Do-I-Get-My-App-Verified). `provisioning.md` §3 cites a "75-server verification threshold", which is also stale — the conclusion (self-serve, no review) is right, the number is not. Worth a one-line fix there.

---

## 4. Memory and disk

### 4.1 Memory — measured

`process.memoryUsage()`, Node 24.16.0, from the **bundled** file, before any gateway connection:

| Stage | RSS | heapUsed |
| --- | --- | --- |
| Node baseline, bundle not yet evaluated | 52.5 MB | 12.0 MB |
| after loading discord.js | 77.0 MB | 21.3 MB |
| after `new Client({ 5 intents })` | 77.3 MB | 21.6 MB |
| after libsql + Drizzle | **79.9 MB** | 21.8 MB |
| after 2 s idle | 79.9 MB | 21.8 MB |

**[verified].** From unbundled `node_modules` the same script peaks at 110.8 MB RSS — the bundle is *lighter*, because it loads one file instead of walking ~400 packages.

Roughly 50 MB of that is Node itself. discord.js adds ~25 MB. **A connected client on one ~100-member guild should settle in the 90–150 MB range**; the growth after connect comes from caches, and discord.js's defaults are worth knowing:

```js
// discord.js 14.27.0 — src/util/Options.js
static get DefaultMakeCacheSettings() { return { MessageManager: 200 }; }
static get DefaultSweeperSettings() { return { threads: { interval: 3600, lifetime: 14400 } }; }
```

That is the *entire* default limiting story: 200 messages per channel, archived threads swept hourly. **Every other manager — members, users, reactions, presences — is an unbounded `Collection`.** For one small guild that is fine and cache tuning is premature. The signal to watch is not the absolute number but **linear unbounded growth**, which means retained references rather than cache. If it ever matters, the levers are `makeCache: Options.cacheWithLimits({...})` and `sweepers`, documented at [cache customization](https://discordjs.guide/miscellaneous/cache-customization.html) — noting the guide's hard warning that customizing `GuildManager`, `ChannelManager`, `GuildChannelManager`, `RoleManager` or `PermissionOverwriteManager` **breaks functionality**.

Cheapest lever of all: **request fewer intents.** If the bot only does temp-VC and slash commands, `[Guilds, GuildVoiceStates]` keeps the member and message caches near-empty.

**Note the ticket's framing:** #26 asks about a **1 GB disk**. On Pterodactyl/Pelican, memory is a *separate* limit. Memory is not the constraint here, but confirm the memory allocation on the egg independently — 80 MB idle plus V8 headroom wants a container limit of at least 256 MB, and `--max-old-space-size` is the guard if the plan is tighter.

### 4.2 Disk — comfortable, not tight

| Item | Size |
| --- | --- |
| `dist/index.js`, minified | 1.52 MB |
| `dist/index.js`, unminified | 3.76 MB |
| what a `node_modules` deploy would have cost instead | **79 MB** |

The bundle uses **0.15%** of a 1 GB allowance. Even the unminified build with a source map is under 1%.

**The only thing that can fill 1 GB is logs.** A gateway bot with `debug` logging on is genuinely chatty, and Pterodactyl retains console output. Two controls, neither expensive:

1. Do not attach `client.on('debug', console.log)` in production.
2. Cap log files — write to stdout only and let the panel handle it, or if the bot writes files, rotate with a hard size ceiling.

Ship the **unminified** bundle plus a source map: readable stack traces are worth 2 MB out of 1000, and minification buys nothing at this scale.

---

## 5. Slash-command registration

### 5.1 Global vs guild-scoped

- **Guild commands update instantly.** Discord: "New guild commands will be available in the guild immediately." ([application commands](https://docs.discord.com/developers/interactions/application-commands))
- **Global commands: the "up to 1 hour" figure is no longer in the docs.** It has been replaced by read-repair: "if you make an update to a global command, and a user tries to use that command before it has updated for them, Discord will do an internal version check and reject the command, and trigger a reload for that command." No time bound is published today. Treat propagation as *eventually consistent with a self-healing first invocation*, not as a one-hour wait.

**RATS is a single guild. Register guild-scoped**, against `GUILD_ID` in `src/consts/discord.ts`. Instant propagation, no read-repair weirdness, and the commands do not leak into any other server.

### 5.2 Scope, limits, idempotency

- **`applications.commands` scope is required, and automatic**: "can be used independently, but is also automatically included with the `bot` scope." The existing bot invite already carries it.
- **200 application-command *creates* per day, per guild.** Documented on the create endpoints.
- **Registration is idempotent and cheap to repeat.** `POST` is an upsert on name, and for bulk overwrite Discord states only that "commands that do not already exist will count toward daily application command create limits" — so re-`PUT`ting an unchanged set costs nothing against the 200/day. **Bulk `PUT` is destructive**: anything omitted from the list is deleted.

### 5.3 At startup or as a separate step

**Separate step.** The discord.js guide is explicit and this is the correct call here:

> "Slash commands only need to be registered once, and updated when the definition (description, options etc) is changed. As there is a daily limit on command creations, it's not necessary nor desirable to connect a whole client to the gateway or do this on every `ready` event. As such, a standalone script using the lighter REST manager is preferred."
> — [deploying commands](https://discordjs.guide/legacy/app-creation/deploying-commands)

Two reasons: the 200/day create limit, and the waste of opening a gateway connection just to register. Use `REST` + `Routes.applicationGuildCommands(clientId, guildId)` with a bulk `PUT`.

This suits the deploy model well. Registration is a **build/release-time** action, not a **runtime** one — it belongs in a second tiny bundle (`dist/deploy-commands.js`, ~430 KB, needing only `@discordjs/rest` and `discord-api-types`) run by hand or from CI when command definitions change. On a restart-happy game-panel host, doing it on boot would burn the daily budget on the first crash loop.

Naming note for 14.27: the event is **`Events.ClientReady === 'clientReady'`**, not `'ready'`. The guide's prose still says `ready`.

---

## Recommendations

1. **Bundle with `esbuild --bundle --platform=node --format=cjs`.** No externals, nothing shipped alongside. Prefer unminified + source map.
2. **Import `@libsql/client/web` and `drizzle-orm/libsql/web`.** Enforce with `no-restricted-imports`.
3. **Never install `zlib-sync`** in the bot's build. Add a CI step that runs the built bundle from a directory with no `node_modules` — that one command catches every regression in §1 and §2.
4. **Intents: `[Guilds, GuildVoiceStates]`** for temp VC + slash commands; add `GuildMembers` only for join/leave hooks or a live cached roster; add `GuildMessages`+`MessageContent` only if the bot must read arbitrary message text. Both privileged toggles are already on.
5. **Extend §4 of `provisioning.md`** to grant `MANAGE_CHANNELS` + `MOVE_MEMBERS` as a scoped overwrite on the voice-lobby category, and extend `make check-provisioning` to assert that scope.
6. **Deploy commands from a separate guild-scoped bulk-`PUT` script**, never on `clientReady`.
7. **Budget disk for logs, not for code.** Turn off `debug` logging in production.

---

## Open questions / could not verify

1. **The WebSocket handshake itself.** With no valid bot token, the isolated bundle was proved only as far as Discord's REST API (`401 → TokenInvalid`). The gateway upgrade — `ws` without `bufferutil`/`utf-8-validate`, and the `zlib-sync`-absent compression fallback — was **not** exercised end to end. Both code paths are guarded and this is expected to work, but the first real deploy should confirm a `clientReady` fires.
2. **The host.** No Pterodactyl/Pelican instance was available. The Node **major version** the egg provides is unverified, and it matters: the build used `--target=node22`, so an egg pinned to Node 18 would need a lower target. Confirm before the first deploy.
3. **Steady-state memory of a *connected* client** on the real RATS guild. All numbers in §4.1 are pre-connect. The post-connect delta from `GUILD_CREATE` and caches is estimated, not measured.
4. **Global-command propagation time.** Discord no longer publishes a figure. Not investigated further because guild-scoped registration makes it moot.
5. **Log volume in practice.** The disk conclusion assumes disciplined logging; actual bytes/day was not measured.
6. **`@libsql/client` future versions.** `libsql` is a *hard* dependency, so the pure-JS `web` entry existing is a property of how the package is currently split, not a guarantee. Pin the version, and re-run the isolated-boot check on upgrade.

---

## Key sources

- [esbuild — log overrides, incl. `ignored-dynamic-import`](https://esbuild.github.io/api/#log-override)
- [esbuild — platform](https://esbuild.github.io/api/#platform)
- [discord.js 14.27.0 — `Options.js`](https://github.com/discordjs/discord.js/blob/14.27.0/packages/discord.js/src/util/Options.js), [`Events.js`](https://github.com/discordjs/discord.js/blob/14.27.0/packages/discord.js/src/util/Events.js)
- [discord.js guide — intents](https://discordjs.guide/popular-topics/intents), [deploying commands](https://discordjs.guide/legacy/app-creation/deploying-commands), [cache customization](https://discordjs.guide/miscellaneous/cache-customization.html)
- [Discord — gateway intents list & Message Content intent](https://docs.discord.com/developers/events/gateway)
- [Discord — gateway events, Request Guild Members](https://docs.discord.com/developers/events/gateway-events#request-guild-members)
- [Discord — opcodes and status codes (4013 / 4014)](https://docs.discord.com/developers/topics/opcodes-and-status-codes)
- [Discord — privileged intent review (June 2026 rules)](https://docs.discord.com/developers/gateway/getting-started-with-privileged-intent-review)
- [Discord — application commands](https://docs.discord.com/developers/interactions/application-commands), [permissions](https://docs.discord.com/developers/topics/permissions), [OAuth2 bot authorization](https://docs.discord.com/developers/topics/oauth2#bot-authorization-flow)
- [libsql-client-ts — supported URLs](https://github.com/libsql/libsql-client-ts#supported-urls)
- `docs/setup/provisioning.md` §1, §3, §4 — in this repo

---

**Last fetched:** August 18, 2026
**Next review:** on any `discord.js` minor, `@libsql/client` minor, or the first Pterodactyl deploy — whichever comes first.
