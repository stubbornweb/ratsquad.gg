# Discovery — RATS EU Competitive Squad Clan Website

> Frozen snapshot of project thinking. Generated 2026-03-25.
> Sources: [from-code] = inferred from codebase, [from-interview] = answered by owner.

---

## 1. Business Overview

- **What:** Premium dark-themed tactical landing page for RATS, an elite Squad clan [from-code]
- **Purpose:** Recruitment funnel + community hub [from-code]
- **Game:** Squad (hardcore tactical shooter) [from-code]
- **Region:** Europe, English-speaking [from-code]

## 2. The Problem

- Need a professional web presence that matches the clan's tactical identity [from-code]
- Current recruitment relies entirely on Discord — site drives traffic there [from-interview]
- No existing website live — local development only [from-interview]

## 3. Current Workflow

- **Deployment:** Local only, not live anywhere [from-interview]
- **Recruitment process:** Discord-based, site will funnel visitors to Discord [from-interview]
- **Roster data:** Hardcoded in page source, gamertags only [from-interview]
- **Content status:** Partially built, sections and pages still being updated [from-interview]

## 4. Desired Outcome

- Convert visitors into Discord members and recruits [from-code]
- Establish dominance, professionalism, and serious militaristic vibe [from-code]
- Impress with high-end web presence that mirrors tactical depth of clan [from-code]

## 5. Constraints

- **Deadline:** None [from-interview]
- **Budget:** Free tier only (Vercel free, no paid APIs) [from-interview]
- **Content:** Still being finalized — sections and pages will be updated [from-interview]
- **Design:** Dark mode only, militaristic high-contrast theme [from-code]
- **Stack:** Next.js + Tailwind CSS + Framer Motion (locked in) [from-code]
- **Responsive:** Must work on mobile, tablet, desktop [from-code]

## 6. Users & Stakeholders

- **Primary:** Hardcore Squad players looking for a serious, organized, skilled clan [from-code]
- **Secondary:** Existing RATS clan members viewing roster, rules, clan info [from-code]
- **Decision maker:** Clan leadership (site owner) [from-interview]

## 7. Automation & Efficiency

- No automation needed — static content site [from-code]
- Roster is manual/hardcoded, no API integration planned [from-interview]
- Discord is the single external integration point (links only) [from-interview]

## 8. Data & Integration

- **External services:** Discord (outbound links only) [from-interview]
- **Data sources:** None — all content hardcoded [from-interview]
- **APIs:** None required [from-interview]
- **Analytics/tracking:** None — explicitly no tracking, no ads [from-interview]

## 9. Risks & Concerns

- **SEO:** Not a priority — site shared via Discord links, not search [from-interview]
- **Privacy:** Gamertags only on roster, no real names [from-interview]
- **Forbidden:** No ads, no tracking, no signup forms [from-interview]
- **Content churn:** Sections still being finalized, expect changes [from-interview]

## 10. Success Metrics

- All sections built and visually polished [from-interview]
- Visual polish and speed are top priorities [from-interview]
- "Done" = all sections complete + looks professional [from-interview]

## 11. Additional Context

- Legacy static HTML version exists in `variant-v1/` (archived) [from-code]
- Detailed design specs per section in `website-sections/` directory [from-code]
- Style guide with color tokens, typography, component patterns in `docs/STYLE_GUIDE.md` [from-code]
- Fonts: DM Sans, Bebas Neue, Barlow Condensed, IBM Plex Mono (Google) + NASTUP (local brand font) [from-code]
- Navbar and Footer already extracted as shared components [from-code]
- Framer Motion now in use on homepage (animation helpers) [from-code]

## 12. Priority Assessment

Ranked by owner [from-interview]:

1. **Finish remaining sections/pages** — get content complete
2. **Visual polish** — animations, transitions, micro-interactions
3. **Performance** — loading speed, image optimization, lighthouse score
4. **Code quality** — extract components, reduce globals.css, clean architecture
