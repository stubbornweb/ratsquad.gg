# RATS EU — Competitive Squad Clan Website

## Overview

Premium dark-themed tactical landing page for RATS, an elite European competitive clan in the hardcore tactical shooter Squad. The site serves as a recruitment funnel that converts visitors into Discord members and a community hub for existing clan members to view the roster and clan information.

## Core Features

- **Landing Page** — Cinematic hero with terminal typing effect, About Us, Requirements, FAQ sections
- **Roster Page** — Dedicated page displaying clan members by role with search/filter
- **Design System** — Dark-only militaristic theme with Cyber Yellow (#FFD700) accent
- **Animations** — Framer Motion scroll-triggered reveals, sharp hover transitions
- **Discord CTA** — Persistent funnel to Discord at every touchpoint

## Tech Stack

- **Framework:** Next.js 16.1.7 (App Router, TypeScript)
- **Styling:** Tailwind CSS 4.2.1 (CSS custom properties for tokens)
- **Animations:** Framer Motion 12.38.0
- **Icons:** Lucide React 0.577.0
- **Utilities:** clsx 2.1.1 + tailwind-merge 3.5.0
- **Deployment:** Vercel (standalone output, free tier)

## Architecture

See `.ai-factory/ARCHITECTURE.md` for detailed architecture guidelines.
Pattern: Component-Based (Next.js App Router)

**Key architectural decisions:**
- Pages (`src/app/`) orchestrate section components
- Section components (`src/components/sections/`) are self-contained
- Shared components (`src/components/`) are reusable across pages
- Data layer (`src/data/`) is pure — no side effects, no dependencies
- No API routes — fully static site

## Design System

- **Primary accent:** Cyber Yellow (#FFD700)
- **Background:** Dark tactical (#0a0a0f typical)
- **Fonts:** DM Sans, Bebas Neue, Barlow Condensed, IBM Plex Mono, NASTUP (local)
- **Animations:** Framer Motion with 150-200ms transitions
- **Glow effects, noise overlay, sharp corners**

## Constraints

- No ads, no tracking, no signup forms
- SEO not a priority (shared via Discord links)
- Content still being finalized
- No paid APIs or services

## Project Structure

```
rats-site/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Homepage (649 lines)
│   ├── globals.css        # 1378 lines of custom CSS
│   └── roster/
│       └── page.tsx       # Roster page (276 lines)
├── public/
│   └── fonts/nastup/     # Local brand font
├── docs/                  # Project documentation
│   └── planning/         # Discovery and project description
├── website-sections/      # Section design specs
├── variant-v1/           # Archived static HTML version
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Data Storage

All content is hardcoded in source files. Roster data lives directly in page components. Content updates require code changes and redeployment.

## Priority Assessment

1. Finish remaining sections/pages
2. Visual polish — animations, transitions, micro-interactions
3. Performance — loading speed, image optimization
4. Code quality — extract components, reduce globals.css
