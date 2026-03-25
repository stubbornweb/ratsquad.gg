# Phase 2: Visual Polish

**Status:** Complete
**Priority:** high

## Overview

Elevate the site from functional to premium. Add missing hover states, page transitions, and micro-interactions that make the difference between a template and a high-end experience.

## Stories

### US-10.3 — Hover micro-interactions
- **From:** US-10.3
- **Priority:** high
- **Status:** [~]

Tasks:
- [x] Add social icon hover animations (scale + accent color shift)
- [x] Add nav link hover underline or highlight effect
- [x] Refine FAQ accordion hover feedback (subtle border or background shift)
- [x] Audit all interactive elements for consistent hover states

---

### US-1.2 — Page transitions
- **From:** US-1.2
- **Priority:** high
- **Status:** [ ]

Tasks:
- [x] Add Framer Motion `AnimatePresence` for route transitions
- [x] Implement fade or slide transition between homepage and roster
- [x] Ensure no layout shift during transition
- [x] Test transition on both navigation directions (home → roster, roster → home)

---

### US-9.2 — Responsive design audit
- **From:** US-9.2
- **Priority:** high
- **Status:** [~]

Tasks:
- [x] Audit grid layouts at tablet breakpoint (md) — verify 2-column grids
- [x] Audit grid layouts at desktop breakpoint (lg/xl) — verify 4-column grids
- [x] Test hero section layout on mobile (HUD panel stacking)
- [x] Test roster page grid on all breakpoints
- [x] Fix any overflow or spacing issues found
- [x] Verify hamburger menu opens/closes correctly on mobile

---

## Exit Criteria

- [ ] All interactive elements have polished hover states
- [ ] Page transitions are smooth between all routes
- [ ] Site looks correct on mobile (375px), tablet (768px), and desktop (1440px)
- [ ] `npm run lint` passes
