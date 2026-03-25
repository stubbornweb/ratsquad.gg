# Phase 3: Performance

**Status:** Partial
**Priority:** medium

## Overview

Optimize loading speed and runtime performance. The site should feel instant — especially the hero section which is the first impression.

## Stories

### US-11.1 — Fast initial load
- **From:** US-11.1
- **Priority:** medium
- **Status:** [ ]

Tasks:
- [x] Replace inline SVG icons with Lucide React — Menu (hamburger) and Search icons replaced; Discord SVG kept (no Lucide equivalent)
- [x] Add video preload hint — Added `preload="metadata"` to hero `<video>` element
- [x] Audit font loading strategy — `next/font/google` defaults to `font-display: swap`, no changes needed
- [ ] Run Lighthouse audit and record baseline scores — blocked by pre-existing build error
- [ ] Compress hero background video (target < 2MB) — blocked pending Lighthouse results
- [ ] Re-run Lighthouse and confirm 90+ performance score — blocked by pre-existing build error

---

## Exit Criteria

- [ ] Lighthouse performance score 90+
- [ ] Hero section visible within 1.5s on 4G connection
- [ ] No render-blocking resources
- [ ] `npm run build` completes without warnings
- [ ] `npm run lint` passes
