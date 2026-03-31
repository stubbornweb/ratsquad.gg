# AGENTS.md

> Project map for AI agents. Keep this file up-to-date as the project evolves.

## Project Overview

Premium dark-themed tactical landing page for RATS EU, an elite European competitive clan in the hardcore tactical shooter Squad. Site serves as a recruitment funnel (Discord CTA) and community hub.

## Tech Stack

- **Framework:** Next.js 16.1.7 (App Router)
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.2.1 + custom CSS
- **Animations:** Framer Motion 12.38.0
- **Icons:** Lucide React 0.577.0
- **Utilities:** clsx, tailwind-merge

## Project Structure

```
rats-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with fonts
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles + CSS variables
│   │   ├── template.tsx       # Page template with transitions
│   │   ├── global-error.tsx   # Error boundary
│   │   └── roster/
│   │       └── page.tsx       # Roster page
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Footer.tsx         # Footer
│   │   ├── motion/
│   │   └── MotionDiv.tsx      # Animation wrapper
│   │   ├── PageTransition.tsx  # Page transition component
│   │   ├── FaqAccordion.tsx    # FAQ accordion
│   │   ├── DiscordIcon.tsx     # Discord icon
│   │   ├── LoadingScreen.tsx   # Loading screen with animations
│   │   ├── SmoothScroll.tsx    # Lenis smooth scroll provider
│   │   ├── ui/                # UI primitives
│   │   │   ├── GlitchText.tsx
│   │   │   ├── HeroGlitchLine.tsx
│   │   │   ├── AnimatedCounter.tsx
│   │   │   ├── ScrollProgress.tsx
│   │   │   └── SectionDivider.tsx
│   │   └── sections/          # Page sections
│   │       ├── Hero.tsx
│   │       ├── About.tsx
│   │       ├── RosterPreview.tsx
│   │       ├── Join.tsx
│   │       ├── FAQ.tsx
│   │       └── Discord.tsx
│   ├── data/
│   │   ├── roster.ts          # Roster member data
│   │   ├── faq.ts             # FAQ items data
│   │   ├── about.ts           # About pillars data
│   │   └── join.ts            # Join requirements data
│   ├── hooks/
│   │   └── useAnimations.ts   # Centralized Framer Motion variants
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts           # cn() utility (clsx + tailwind-merge)
│   └── consts/
│       └── router.ts          # Nav links, Discord URL constants
├── public/
│   └── fonts/nastup/          # NASTUP brand font
├── docs/                      # Project documentation
├── .ww-kit/                   # AI agent context
│   ├── DESCRIPTION.md         # Project specification
│   └── ARCHITECTURE.md        # Architecture guidelines
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

## Key Entry Points

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage with hero, about, requirements, FAQ |
| `src/app/roster/page.tsx` | Roster page with search/filter |
| `src/app/layout.tsx` | Root layout with fonts, metadata |
| `src/app/globals.css` | CSS variables, global styles |
| `src/components/Navbar.tsx` | Shared navigation component |
| `src/components/Footer.tsx` | Shared footer component |
| `src/data/roster.ts` | Roster member data |
| `src/data/faq.ts` | FAQ items data |
| `src/data/about.ts` | About section pillars |
| `src/data/join.ts` | Join requirements data |
| `src/lib/utils.ts` | `cn()` utility for class merging |
| `src/app/sitemap.ts` | Dynamic sitemap generation |
| `src/app/robots.ts` | Robots.txt configuration |

## Documentation

| Document | Path | Description |
|----------|------|-------------|
| README | README.md | Project landing page |
| Style Guide | docs/STYLE_GUIDE.md | Design tokens, typography, patterns |
| Project Requirements | docs/PROJECT_REQUIREMENTS.md | Requirements documentation |
| Discovery | docs/planning/discovery.md | Project discovery snapshot |
| Project Description | docs/planning/project-description.md | Full project spec |

## AI Context Files

| File | Purpose |
|------|---------|
| AGENTS.md | This file — project structure map |
| .ww-kit/DESCRIPTION.md | Project specification and tech stack |
| .ww-kit/ARCHITECTURE.md | Architecture decisions and guidelines |
| CLAUDE.md | Agent instructions and preferences |

## Design System

- **Primary accent:** Cyber Yellow (#FFD700)
- **Background:** Dark tactical (#0a0a0f typical)
- **Fonts:** DM Sans, Bebas Neue, Barlow Condensed, IBM Plex Mono, NASTUP
- **Animations:** Framer Motion, 150-200ms transitions

## Agent Rules

- Never combine shell commands with `&&`, `||`, or `;` — execute each command as a separate Bash tool call
- Run `npm run lint` before every commit
- Run `npx tsc --noEmit` for typecheck
- Dark mode only — no theme toggle
- Zero tracking — no analytics, no cookies
