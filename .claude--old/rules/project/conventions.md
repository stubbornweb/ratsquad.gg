# Project Conventions

> Migrated from CLAUDE-OLD.md on 2026-03-25.

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with Google Fonts
    page.tsx            # Homepage (all sections in one file)
    globals.css         # Global CSS with custom properties + Tailwind v4
    roster/
      page.tsx          # Roster page with search & member grid
  lib/
    utils.ts            # cn() utility (clsx + tailwind-merge)
public/
  fonts/
    nastup/             # NASTUP brand font (WOFF2 + WOFF)
docs/
  PROJECT_REQUIREMENTS.md
  STYLE_GUIDE.md
  tasks.md
website-sections/       # Design specs per section
website-guidelines/     # Product brief
variant-v1/            # Legacy static HTML site (archived)
```

## Key Patterns

- All pages are `"use client"` with client-side rendering and React hooks
- CSS custom properties (`:root` vars) for design tokens, referenced in global CSS classes
- Tailwind v4 syntax: `@import "tailwindcss"` with `@theme inline` block
- Fonts loaded via `next/font/google` + local NASTUP font
- No component extraction yet — navbar, footer, sections inline in page files
- Navbar and footer duplicated between `page.tsx` and `roster/page.tsx`
- Intersection Observer for scroll animations (Framer Motion not yet wired)

## Forbidden Patterns

(empty -- add as you go)
