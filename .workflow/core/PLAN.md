# Plan: Phase 3 — Performance

Source: docs/planning/phases/phase-3.md
Created: 2026-03-25

## Context

Phase 2 (Visual Polish) is complete. Phase 3 focuses on loading speed and runtime performance. US-11.1 is the only story. Note: `next/font/google` already defaults to `font-display: swap` so that task is done automatically.

## Tasks

- [ ] **Replace inline SVGs with Lucide React** — Swap 3 inline SVG icons for Lucide equivalents: Discord icon in `page.tsx`, search icon in `roster/page.tsx`, hamburger menu in `Navbar.tsx` [priority: medium]
- [ ] **Add video preload + poster** — Add `preload="metadata"` and a `poster` frame to the hero `<video>` element in `page.tsx` to avoid eager full video download [priority: medium]
- [ ] **Run `npm run build`** — Verify the project builds without errors or warnings; record any issues [priority: medium]
- [ ] **Run Lighthouse baseline** — Run Lighthouse on the built site; record performance score before optimizations [priority: low]
- [ ] **Compress hero video (if needed)** — If Lighthouse score is below 90 due to video size, compress hero-bg.mp4 to < 2MB or convert to WebM; user to provide the compressed file [priority: medium]

## Dependencies

- Lighthouse baseline (task 4) requires successful build (task 3)
- Video compression (task 5) depends on Lighthouse results — only if score < 90

## Notes

- Font loading: `next/font/google` already uses `font-display: swap` by default — no changes needed
- No raster images found in `src/` — `next/image` task is N/A (no images to convert)
- CSS dead class audit was too vague — dropped; `globals.css` is a known quantity
- Lucide React is already in `package.json` but not imported anywhere
- The video is at `/assets/inspo-images/hero-bg.mp4` — a `poster` image would need to be provided by user
