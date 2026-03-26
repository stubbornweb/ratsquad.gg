# Footer & Brand Mark Redesign

**Branch:** none (fast mode)
**Created:** 2026-03-26

## Settings
- Testing: no
- Logging: standard
- Docs: no
- Roadmap Linkage: none

## Design Direction

**Aesthetic:** Industrial Brutalist — raw, bold, unapologetic. The footer-brand-mark feels like a war stamp or military insignia, not decorative text.

**Key changes:**
- Brand mark: Full-width, massive typography, edge-to-edge (no horizontal padding)
- Footer: Compact, minimal padding, organized into clean columns
- Animation: Brand mark reveals with dramatic entrance when scrolled into view, subtle pulse/glow on hover
- Overall: Edge-to-edge design, modern "sticky bottom" feel

## Tasks

### Task 1: Restructure Footer CSS — Edge-to-Edge Brand Mark
**Files:** `src/app/globals.css`

- [x] Make brand mark full-width with `width: 100vw` and center with `margin-left: calc(50% - 50vw)`
- [x] Remove horizontal padding from `.footer-brand-mark`
- [x] Reduce vertical padding for tighter composition
- [x] Add CSS glow effect using `text-shadow` with accent color
- [x] Make brand mark text more dramatic with enhanced letter-spacing

### Task 2: Animate Brand Mark on Scroll Reveal
**Files:** `src/components/Footer.tsx`, `src/app/globals.css`

- [x] Add IntersectionObserver in Footer component to detect when brand mark enters viewport
- [x] Apply `.brand-mark-visible` class to trigger entrance animation
- [x] Entrance animation: Scale from 0.9 → 1.0, opacity 0 → 1, with slight blur dissolve
- [x] Add continuous subtle glow pulse when visible

### Task 3: Add Hover Interactions to Brand Mark
**File:** `src/app/globals.css`

- [x] On hover: Intensify glow, subtle scale (1.02), letter-spacing expansion
- [x] CSS transition for smooth 0.3s ease

### Task 4: Reorganize Footer Grid for Better Hierarchy
**Files:** `src/components/Footer.tsx`, `src/app/globals.css`

- [x] Reduce footer top padding for tighter connection to content
- [x] Ensure consistent spacing between columns
- [x] Clean up mobile responsive breakpoints

### Task 5: Lint & Verify
- [x] Run `npm run lint` to ensure no errors
