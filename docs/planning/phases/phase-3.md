# Phase 3: Performance

**Status:** Not Started
**Priority:** medium

## Overview

Optimize loading speed and runtime performance. The site should feel instant — especially the hero section which is the first impression.

## Stories

### US-11.1 — Fast initial load
- **From:** US-11.1
- **Priority:** medium
- **Status:** [ ]

Tasks:
- [ ] Run Lighthouse audit and record baseline scores
- [ ] Compress hero background video (target < 2MB, consider WebM format)
- [ ] Add `priority` or `preload` hints for hero video
- [ ] Audit font loading strategy — ensure `font-display: swap` on all fonts
- [ ] Remove unused CSS from globals.css (dead classes from pre-migration)
- [ ] Replace inline SVG icons with Lucide React (already installed, not used)
- [ ] Use Next.js `<Image>` component for any raster images
- [ ] Verify standalone build size is reasonable
- [ ] Re-run Lighthouse and confirm 90+ performance score

---

## Exit Criteria

- [ ] Lighthouse performance score 90+
- [ ] Hero section visible within 1.5s on 4G connection
- [ ] No render-blocking resources
- [ ] `npm run build` completes without warnings
- [ ] `npm run lint` passes
