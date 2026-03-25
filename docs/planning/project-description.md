# RATS EU — Competitive Squad Clan Website

**Version:** 0.1.0 (Pre-release)
**License:** MIT
**Repository:** rats-site (no remote)

---

## Overview

A premium, dark-themed tactical landing page for RATS, an elite European competitive clan in the hardcore tactical shooter Squad. The site serves as a recruitment funnel that converts visitors into Discord members and a community hub for existing clan members to view the roster and clan information.

## The Problem

RATS is a serious competitive Squad clan that needs a web presence matching its tactical identity. Recruitment currently relies entirely on Discord with no external-facing site to establish credibility or funnel prospective members. Without a dedicated landing page, the clan lacks the professional presentation that sets it apart from casual groups and signals the level of commitment expected from recruits.

## The Solution

A single-purpose, high-impact landing page that immediately communicates dominance, professionalism, and military precision. Visitors land on a cinematic hero section, scroll through the clan's identity (about, requirements, roster, FAQ), and are funneled toward a Discord join CTA at every touchpoint. The site loads fast, animates sharply, and feels like a tactical briefing — not a generic gaming site.

## Target Audience

- **Primary:** Hardcore Squad players with 100+ hours looking for a serious, organized, English-speaking European clan. Technically comfortable navigating Discord and gaming community sites.
- **Secondary:** Current RATS members who need a central reference for the roster, rules, and clan information.

## Features

### Landing Page
- Cinematic hero section with terminal typing effect and primary Discord CTA
- About Us section with clan ethos and key statistics
- Requirements section listing join criteria (hours, mic, age, etc.)
- FAQ accordion for common questions
- Persistent navigation bar with section links and join button

### Roster
- Dedicated roster page displaying clan members by role
- Search/filter functionality
- Member cards with gamertags (no real names)

### Design System
- Dark-only militaristic theme with Cyber Yellow (#FFD700) accent
- Custom NASTUP brand font for identity
- Tactical typography hierarchy (Bebas Neue, Barlow Condensed, DM Sans, IBM Plex Mono)
- Sharp corners, gritty textures, fast transitions
- Noise overlay and subtle glow effects

### Animations
- Framer Motion scroll-triggered reveals
- Hero entrance animations with staggered delays
- Terminal typing effect in hero section
- Sharp, fast hover transitions (150-200ms)

## Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 (CSS custom properties for tokens) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Utilities | clsx + tailwind-merge |
| Deployment | Vercel (standalone output, free tier) |

### Design Principles

- **Dark only** — no light mode, no theme toggle
- **Speed over features** — static content, no APIs, no database
- **Visual impact first** — every section must command attention
- **Mobile-ready** — responsive from 320px to ultrawide
- **Zero tracking** — no analytics, no cookies, no ads
- **Privacy-conscious** — gamertags only, no personal data

### Data Storage

All content is hardcoded in source files. No database, no CMS, no external data fetching. Roster data lives directly in page components. Content updates require code changes and redeployment.

### Platform Support

- Modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
- Mobile, tablet, and desktop viewports
- Deployed on Vercel free tier

## Competitive Landscape

This is a clan landing page, not a SaaS product. The competitive comparison is against other Squad clan websites and generic gaming templates.

| Aspect | Generic Templates | RATS Site |
|--------|------------------|-----------|
| Visual identity | Cookie-cutter gaming themes | Custom tactical design system |
| Performance | Bloated with plugins/trackers | Zero dependencies on external services |
| Typography | Default web fonts | 5 curated fonts including custom brand font |
| Animations | jQuery/basic CSS | Framer Motion scroll-driven choreography |
| Privacy | Analytics, ads, cookies | Zero tracking by design |

## Contributing

- **Lint:** `npm run lint` (ESLint 9) before every commit
- **Typecheck:** `npx tsc --noEmit`
- **Commits:** Conventional format `<type>(<scope>): <description>`
- **Branching:** Feature branches from main, never direct commits
- **Style:** Tailwind utilities preferred, CSS custom properties for tokens
- **Files:** Under 300 lines, one component per file
