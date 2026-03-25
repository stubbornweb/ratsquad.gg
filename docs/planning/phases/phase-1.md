# Phase 1: Content Completion

**Status:** Complete
**Priority:** critical

## Overview

Finish all remaining content gaps and incomplete sections. The site's core sections are built but some have placeholder data or missing elements. This phase makes every section production-ready with real content.

## Stories

### US-5.1 — Roster preview on homepage
- **From:** US-5.1
- **Priority:** critical
- **Status:** [x]

Tasks:
- [x] Replace placeholder callsigns [CALLSIGN_1/2/3] with real featured members
- [x] Ensure featured members match roster page data
- [x] Verify avatar placeholder, role tag, hours, and join date display correctly

---

### US-5.3 — Roster data management
- **From:** US-5.3
- **Priority:** critical
- **Status:** [x]

Tasks:
- [x] Extract roster data from `roster/page.tsx` into `src/data/roster.ts`
- [x] Import roster data in both homepage preview and roster page
- [x] Define featured members constant for homepage preview
- [x] Verify Member type in `src/types/index.ts` covers all fields

---

### US-8.1 — Site footer completion
- **From:** US-8.1
- **Priority:** high
- **Status:** [~] — Discord URL done, Steam Group URL still pending

Tasks:
- [x] Add navigation links to Footer component (About, Roster, Join, FAQ)
- [x] Add social links to Footer (Discord, Steam, Twitter) — Discord URL set, Steam Group URL still pending
- [x] Ensure footer matches tactical design system

---

## Exit Criteria

- [x] All homepage member cards show real data
- [x] Roster data lives in a single shared file
- [x] Footer has nav links and social links
- [x] `npm run lint` passes
- [x] All pages render correctly
