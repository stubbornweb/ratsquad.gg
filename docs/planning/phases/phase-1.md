# Phase 1: Content Completion

**Status:** Not Started
**Priority:** critical

## Overview

Finish all remaining content gaps and incomplete sections. The site's core sections are built but some have placeholder data or missing elements. This phase makes every section production-ready with real content.

## Stories

### US-5.1 — Roster preview on homepage
- **From:** US-5.1
- **Priority:** critical
- **Status:** [~]

Tasks:
- [ ] Replace placeholder callsigns [CALLSIGN_1/2/3] with real featured members
- [ ] Ensure featured members match roster page data
- [ ] Verify avatar placeholder, role tag, hours, and join date display correctly

---

### US-5.3 — Roster data management
- **From:** US-5.3
- **Priority:** critical
- **Status:** [~]

Tasks:
- [ ] Extract roster data from `roster/page.tsx` into `src/data/roster.ts`
- [ ] Import roster data in both homepage preview and roster page
- [ ] Define featured members constant for homepage preview
- [ ] Verify Member type in `src/types/index.ts` covers all fields

---

### US-8.1 — Site footer completion
- **From:** US-8.1
- **Priority:** high
- **Status:** [~]

Tasks:
- [ ] Add navigation links to Footer component (About, Roster, Join, FAQ)
- [ ] Add social links to Footer (Discord, Steam, Twitter)
- [ ] Ensure footer matches tactical design system

---

## Exit Criteria

- [ ] All homepage member cards show real data
- [ ] Roster data lives in a single shared file
- [ ] Footer has nav links and social links
- [ ] `npm run lint` passes
- [ ] All pages render correctly
