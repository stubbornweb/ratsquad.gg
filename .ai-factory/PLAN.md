# Plan: Hero Section Redesign

Updated: 2026-03-26
Status: active

## Topic
Redesign the hero section with a wider headline, v2-style grid background, conditional video, no HUD, and scroll indicator — keeping English content.

## Settings

| Setting | Value |
|---------|-------|
| Testing | No |
| Logging | standard |
| Docs | no |
| Roadmap Linkage | none |

## Research Context

**Topic:** Redesign hero section to match v2 rats-site-v2 style
**Goal:** Wider hero text, grid background with video fallback, no terminal/HUD, watermark + scroll indicator
**Constraints:**
- Keep English ("MOVE AS ONE / STRIKE AS ONE")
- Remove HUD/terminal completely
- Add grid background that shows when video is absent
- Keep Framer Motion animations
- Remove terminal typing effect (no longer applicable)

## Tasks

### Phase 1 — CSS (globals.css)

- [x] **Task 1:** Update globals.css — add grid bg, vignette, watermark, scroll bounce; remove HUD CSS

### Phase 2 — Component (Hero.tsx)

- [x] **Task 2:** Update Hero.tsx — remove HUD, add conditional video/grid bg, watermark, scroll indicator, wider headline

---

## Implementation Notes

**Key visual changes:**
- Hero headline: `clamp(48px,8vw,110px)` → `clamp(72px,12vw,148px)`
- Letter-spacing: `0.08em` → `0.03em`
- Layout: split (content + HUD) → centered content + watermark
- Background: grid always present; video overlays when available
- Remove: terminal typing effect, HUD frame, corner accents, stats grid

**Files changed:**
- `src/app/globals.css` — add/remove hero CSS classes
- `src/components/sections/Hero.tsx` — restructure JSX, conditional video, remove terminal state
