# Plan: Discord Roster Integration

**Branch:** `feature/discord-roster-integration`
**Created:** 2026-04-01
**Type:** Feature

## Summary

Migrate static roster data (`src/data/roster.ts`) to live Discord API integration. The site will fetch clan members by Discord role IDs from server `1139847863950639185`, using a bot token. Data is cached via Next.js ISR (revalidate every 5 min). Static data remains as fallback.

**Key requirements:**
- Fetch roles by **ID** (not name) — resilient to renames
- Roles: "officer RATS" (full roster) and "В.О.Дуче" (leadership/featured)
- `/RosterPreview` shows only "В.О.Дуче" role in custom sequence
- `/roster` page shows all roles (squad leads + members)
- Bot token stays server-side (never exposed to client)

## Settings

- **Testing:** No
- **Logging:** Minimal (WARN/ERROR only)
- **Docs:** No (warn-only)

## Architecture Changes

```
Before:
  static data (src/data/roster.ts) → client components

After:
  Discord REST API → src/lib/discord.ts (server-only)
                    → server components (ISR, revalidate=300)
                    → client components (props)
                    → fallback to static data on failure
```

**New files:**
- `scripts/list-discord-roles.ts` — utility to discover role IDs
- `src/consts/discord.ts` — role IDs, server ID, display mappings
- `src/lib/discord.ts` — Discord REST API service (server-only)
- `src/components/RosterClient.tsx` — extracted client component from roster page
- `.env.local.example` — env var template

**Modified files:**
- `src/types/index.ts` — add optional discordId
- `src/app/page.tsx` — fetch data, pass props, add revalidate
- `src/components/sections/RosterPreview.tsx` — accept props instead of static import
- `src/app/roster/page.tsx` — server/client split, add revalidate
- `src/data/roster.ts` — demote to fallback data

**No new dependencies** — uses native `fetch` for Discord REST API.

## Tasks

### Phase 1: Foundation (Tasks 1-3)

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1 | ~~Create Discord role discovery script~~ | `scripts/list-discord-roles.ts` | ✅ |
| 2 | ~~Add Discord constants and env config~~ | `src/consts/discord.ts`, `.env.local.example` | ✅ |
| 3 | ~~Create Discord API service~~ | `src/lib/discord.ts` | ✅ |
| 4 | ~~Update types for Discord integration~~ | `src/types/index.ts` | ✅ |

### Phase 2: Integration (Tasks 5-7)

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 5 | ~~Refactor homepage + RosterPreview~~ | `src/app/page.tsx`, `src/components/sections/RosterPreview.tsx` | ✅ |
| 6 | ~~Refactor Roster page (server/client split)~~ | `src/app/roster/page.tsx`, `src/components/RosterClient.tsx`, `src/components/RosterHeader.tsx` | ✅ |
| 7 | ~~Clean up static roster data~~ | `src/data/roster.ts` | ✅ |

## Commit Plan

**Commit 1** (after Tasks 1-4): `feat: add Discord API service and role discovery`
**Commit 2** (after Tasks 5-7): `feat: integrate Discord roster into pages with ISR`

## Notes

- User must run `scripts/list-discord-roles.ts` to get actual role IDs, then update `src/consts/discord.ts`
- User must set `DISCORD_BOT_TOKEN` in `.env.local`
- Discord bot needs `SERVER MEMBERS INTENT` enabled and the `guilds` + `guild members` permissions
- ISR revalidation set to 300s (5 min) — adjustable in page exports
