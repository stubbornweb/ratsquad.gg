# RATS EU — Competitive Squad Clan Website

**Last Updated:** 2026-03-25

---

## Summary

A premium, dark-themed tactical landing page for RATS, an elite European competitive clan in the hardcore tactical shooter Squad. The site serves as a recruitment funnel that converts visitors into Discord members and a community hub for existing clan members to view the roster and clan information.

---

## Current Phase

**Phase 1: Content Completion** — In Progress

Phase 1 tasks: 3 stories (US-5.1, US-5.3, US-8.1) — 2 complete, 1 partial.

---

## Feature Status

| Category | Story | Status |
|----------|-------|--------|
| Navigation | US-1.1 Persistent navigation | [x] |
| Navigation | US-1.2 Page transitions | [ ] |
| Hero | US-2.1 Cinematic hero landing | [x] |
| Hero | US-2.2 Terminal HUD effect | [x] |
| About | US-3.1 Clan identity | [x] |
| Requirements | US-4.1 Join requirements | [x] |
| Requirements | US-4.2 Recruitment process steps | [x] |
| Roster | US-5.1 Roster preview on homepage | [x] |
| Roster | US-5.2 Full roster page | [x] |
| Roster | US-5.3 Roster data management | [x] |
| FAQ | US-6.1 FAQ accordion | [x] |
| Discord | US-7.1 Discord CTA banner | [x] |
| Footer | US-8.1 Site footer | [x] |
| Design | US-9.1 Dark tactical theme | [x] |
| Design | US-9.2 Responsive design | [~] |
| Design | US-9.3 Typography system | [x] |
| Animations | US-10.1 Scroll-triggered animations | [x] |
| Animations | US-10.2 Hero entrance choreography | [x] |
| Animations | US-10.3 Hover micro-interactions | [~] |
| Performance | US-11.1 Fast initial load | [ ] |
| Code Quality | US-12.1 Component architecture | [~] |

**Total: 12 [x] · 4 [~] · 5 [ ]**

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 (CSS custom properties for tokens) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Utilities | clsx + tailwind-merge |
| Deployment | Vercel (standalone output, free tier) |

---

## Open Questions / Blockers

- **Steam Group URL** — Footer social link still has `href="#"` for Steam Group (no URL provided yet)
- **Responsive testing** — US-9.2 grid adjustments not verified on actual mobile/tablet devices
- **Hero video optimization** — US-11.1 not started; video compression + lazy loading needed
- **Component extraction** — US-12.1 section components still inline in page.tsx

---

## Contributing

- **Lint:** `npm run lint` (ESLint 9)
- **Typecheck:** `npx tsc --noEmit`
- **Commits:** Conventional format `<type>(<scope>): <description>`
