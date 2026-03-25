# Plan: Phase 2 — Visual Polish

Source: docs/planning/phases/phase-2.md
Created: 2026-03-25

## Context

Phase 1 (Content Completion) is done. Phase 2 adds polish: hover micro-interactions, page transitions, and responsive audit. Three stories to implement: US-10.3, US-1.2, US-9.2.

## Tasks

- [ ] **Social icon hover animations** — Add CSS hover effects (scale + accent color shift) to `.social-icon` elements in the Discord CTA banner on `page.tsx` [priority: high]
- [ ] **Remove dead Steam/Twitter social links** — Discord CTA banner has `href="#"` for Steam and Twitter; remove both icon links (matching the footer decision to drop Steam; Twitter has no account either) [priority: high]
- [ ] **Nav link hover underline** — Add hover underline/highlight effect to `.nav-link` elements in `Navbar.tsx` via CSS [priority: medium]
- [ ] **FAQ accordion hover feedback** — Add subtle border/background hover state to `.faq-question` in `page.tsx` [priority: medium]
- [ ] **Page transition animations** — Create `src/app/template.tsx` with Framer Motion `AnimatePresence` for fade/slide transitions between routes [priority: high]
- [ ] **Responsive design audit & fixes** — Audit grid layouts, hero stacking on mobile, roster page grids; fix any overflow or spacing issues found [priority: medium]

## Dependencies

- All tasks are independent
- Page transitions (task 5) requires understanding of Next.js App Router AnimatePresence pattern

## Notes

- Social icon hover: use CSS `transform: scale(1.1)` + `color` shift to Cyber Yellow on hover
- Nav link hover: CSS underline via `::after` pseudo-element or `border-bottom`
- FAQ hover: `background` or `border-color` shift on `.faq-question:hover`
- Page transitions: Next.js App Router uses `template.tsx` (not `layout.tsx`) for per-page animations — re-mounts on navigation
- Responsive audit is "find and fix" — no predefined scope, estimate based on actual issues found
- No tests needed for UI polish work
