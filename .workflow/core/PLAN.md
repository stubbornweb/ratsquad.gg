# Plan: Phase 1 — Content Completion

Source: docs/planning/phases/phase-1.md
Created: 2026-03-25

## Tasks

- [ ] **Create shared roster data file** — extract `rosterData` from `roster/page.tsx` into `src/data/roster.ts`, exporting the array and a `FEATURED_MEMBERS` constant (GHOST, VIPER, TITAN) for homepage [priority: critical]
- [ ] **Update homepage roster preview** — import from `src/data/roster.ts` and replace `[CALLSIGN_1/2/3]` placeholders with actual featured members GHOST (CLAN LEADER, 3500h, 2019), VIPER (SQUAD LEAD, 2400h, 2020), TITAN (SQUAD LEAD, 2150h, 2020) [priority: critical]
- [ ] **Update Footer social links** — replace `#` hrefs with real Discord/Steam/Twitter URLs for the social links in the COMMUNITY column [priority: high]

## Dependencies

- Homepage roster update (task 2) requires the roster data file (task 1) to be created first
- Footer task (task 3) is independent

## Notes

- Footer already has nav links (About, Roster, FAQ, How to Join) — only social links need real hrefs
- Member type in `src/types/index.ts` already covers all needed fields (callsign, role, hours, since)
- No database migrations needed — static data only
