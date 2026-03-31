# Plan: Migrate Site Language to Ukrainian

## Context
The RATS site is entirely in English. We're doing a **full language replacement** to Ukrainian — not adding i18n/multi-language support. The Ukrainian text must sound natural to native speakers (not literal/cringe translations). Gaming terms like Squad, SL, Discord, DLC, RATS stay in English where that's what Ukrainian gamers actually say.

## Approach: Direct Inline Replacement
No i18n library needed. Simply replace English strings with Ukrainian in every file. This is the simplest approach since we're not keeping English as an option.

---

## Phase 1: Font Cyrillic Support (BLOCKER)

**`src/app/layout.tsx`**
- Add `"cyrillic"` to `subsets` for all 4 Google Fonts (DM Sans, Bebas Neue, Barlow Condensed, IBM Plex Mono)
- Change `lang="en"` → `lang="uk"`
- Update all metadata to Ukrainian:
  - title: `"RATS | Конкурентний EU клан у Squad"`
  - description, OG, Twitter texts
  - `locale: "uk_UA"`

> **Note:** Bebas Neue supports Cyrillic. If any font doesn't render a Ukrainian glyph, the browser falls back gracefully.

## Phase 2: Data Files (4 files)

**`src/consts/router.ts`** — Nav labels:
| English | Ukrainian |
|---------|-----------|
| ABOUT | ПРО НАС |
| ROSTER | СКЛАД |
| FAQ | FAQ |
| JOIN US | ПРИЄДНАТИСЬ |

**`src/data/about.ts`** — Pillar titles + bodies:
| English | Ukrainian |
|---------|-----------|
| DISCIPLINE | ДИСЦИПЛІНА |
| TEAMWORK | КОМАНДНА РОБОТА |
| IMPROVEMENT | ВДОСКОНАЛЕННЯ |

**`src/data/faq.ts`** — 4 Q&A pairs translated, keeping Squad/Discord/DLC in English

**`src/data/join.ts`** — Requirements + steps translated, keeping Squad/Discord/Recruit in English

**`src/data/roster.ts`** — No changes (callsigns + "SQUAD LEAD"/"MEMBER" stay English — standard game terms)

## Phase 3: Section Components (6 files)

**`src/components/sections/Hero.tsx`**
| English | Ukrainian |
|---------|-----------|
| SQUAD — EU COMPETITIVE CLAN | SQUAD — КОНКУРЕНТНИЙ EU КЛАН |
| MOVE AS ONE. / STRIKE AS / ONE. | ДІЄМО ЯК ОДИН. / ПЕРЕМАГАЄМО / РАЗОМ. |
| RATS is a competitive EU mil-sim clan... | RATS — конкурентний EU клан у Squad... |
| APPLY TO JOIN | ПОДАТИ ЗАЯВКУ |
| LEARN MORE | ДІЗНАТИСЬ БІЛЬШЕ |
| EU BASED | БАЗУЄМОСЬ В EU |
| SQUAD ONLY | ТІЛЬКИ SQUAD |
| SELECTIVE RECRUITMENT | ВИБІРКОВИЙ НАБІР |
| SCROLL | ГОРТАЙ |

**`src/components/sections/About.tsx`** — "WHO WE ARE" → "ХТО МИ", "TACTICS OVER EVERYTHING." → "ТАКТИКА ПОНАД УСЕ.", body paragraphs

**`src/components/sections/RosterPreview.tsx`** — "THE UNIT" → "ПІДРОЗДІЛ", "MEET THE RATS." → "ПОЗНАЙОМТЕСЬ З RATS."

**`src/components/sections/Join.tsx`** — "RECRUITMENT" → "НАБІР", headline, sub, CTA

**`src/components/sections/FAQ.tsx`** — "INTELLIGENCE" → "РОЗВІДКА", "FREQUENTLY ASKED QUESTIONS" → "ЧАСТІ ЗАПИТАННЯ"

**`src/components/sections/Discord.tsx`** — "COMMUNITY" → "СПІЛЬНОТА", headline, sub, CTA

## Phase 4: Shared Components (3 files)

**`src/components/Navbar.tsx`**
- "APPLY NOW" → "ПОДАТИ ЗАЯВКУ"
- "// NAVIGATION" → "// НАВІГАЦІЯ"
- aria-labels translated

**`src/components/Footer.tsx`** — All section headers, links, contact text translated

**`src/components/LoadingScreen.tsx`**
- "RATS TACTICAL NETWORK" → "RATS ТАКТИЧНА МЕРЕЖА"
- "ESTABLISHING UPLINK..." → "ВСТАНОВЛЕННЯ ЗВ'ЯЗКУ..."
- "SIGNAL ACQUIRED" → "СИГНАЛ ОТРИМАНО"
- HUD labels (FREQ, ENCRYPT, LATENCY, STATUS) — **keep English** (military HUD aesthetic)

## Phase 5: App Pages (3 files)

**`src/app/global-error.tsx`** — lang="uk", error messages translated
**`src/app/not-found.tsx`** — "MISSION ABORTED" → "МІСІЮ СКАСОВАНО", etc.
**`src/app/roster/page.tsx`** — "ACTIVE ROSTER" → "АКТИВНИЙ СКЛАД", search placeholder, labels
**`src/app/roster/layout.tsx`** — metadata translated

## Terms Staying in English
- **Brand**: RATS, Discord
- **Game terms**: Squad, Squad Lead, SL, DLC, Recruit, scrim
- **HUD aesthetic**: FREQ, ENCRYPT, AES-256, LATENCY, STATUS, LOCKED, CONFIRMED
- **Roles**: SQUAD LEAD, MEMBER (in roster data)
- **Universal**: FAQ, ONLINE

## Files NOT Changing
- `src/app/page.tsx` (no strings)
- `src/app/sitemap.ts`, `robots.ts` (URLs only)
- `src/data/roster.ts` (game terms)
- All animation/utility components

## Verification
1. `npx tsc --noEmit` — no type errors
2. `npm run lint` — passes
3. `npm run dev` — visually check every page:
   - Homepage: all 6 sections render Ukrainian
   - Roster page: heading, search, filters in Ukrainian
   - 404 page: Ukrainian error text
   - Loading screen: mix of Ukrainian + English HUD
4. View source → verify `<html lang="uk">`, OG meta tags in Ukrainian
5. Check mobile viewport — longer Ukrainian text doesn't overflow buttons/nav

## Estimated Scope
~18 files modified, ~100+ strings translated, 0 new dependencies
