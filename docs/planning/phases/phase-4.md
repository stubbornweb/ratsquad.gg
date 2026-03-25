# Phase 4: Code Quality

**Status:** Not Started
**Priority:** low

## Overview

Refactor the codebase for maintainability. Extract components, reduce CSS bloat, and adopt the utilities already installed but unused. This phase doesn't change what the user sees — it makes future changes easier.

## Stories

### US-12.1 — Component architecture
- **From:** US-12.1
- **Priority:** low
- **Status:** [~]

Tasks:
- [ ] Extract Hero section from `page.tsx` into `src/components/sections/Hero.tsx`
- [ ] Extract About section into `src/components/sections/About.tsx`
- [ ] Extract Requirements/Join section into `src/components/sections/Join.tsx`
- [ ] Extract FAQ section into `src/components/sections/FAQ.tsx`
- [ ] Extract Discord banner into `src/components/sections/Discord.tsx`
- [ ] Extract roster preview into `src/components/sections/RosterPreview.tsx`
- [ ] Migrate frequently-used CSS classes from globals.css to Tailwind utilities
- [ ] Use `cn()` utility for conditional class merging in components
- [ ] Replace inline SVGs with Lucide React icons throughout
- [ ] Verify page.tsx is under 100 lines after extraction
- [ ] Verify globals.css reduced by at least 40%

---

## Exit Criteria

- [ ] Each section is a standalone component in `src/components/sections/`
- [ ] `page.tsx` is a clean composition of section components
- [ ] `cn()` utility used where className logic exists
- [ ] Lucide React icons replace all inline SVGs
- [ ] globals.css significantly reduced
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] No visual regressions — site looks identical before and after
