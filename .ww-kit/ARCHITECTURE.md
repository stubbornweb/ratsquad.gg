# Architecture: Component-Based (Next.js App Router)

## Overview

This is a simple static marketing/recruitment site with two pages (`/` and `/roster`). The architecture follows Next.js App Router conventions with a clear separation between page components, shared UI components, and data. No backend, no APIs, no database — all content is hardcoded.

Given the project's scope (landing page + roster), complexity is low. We use a straightforward component-based structure rather than formal layered or clean architecture.

## Decision Rationale

- **Project type:** Static marketing/recruitment site
- **Scale:** Two pages, no data persistence, no API calls
- **Team size:** Single developer (clan owner)
- **Key factor:** Simplicity — the project doesn't need formal architecture layers

## Folder Structure

```
src/
├── app/                    # Next.js App Router (presentation layer)
│   ├── layout.tsx         # Root layout (fonts, metadata)
│   ├── page.tsx           # Homepage
│   ├── globals.css        # CSS variables + global styles
│   ├── template.tsx       # Page transitions
│   ├── global-error.tsx   # Error boundary
│   └── roster/
│       └── page.tsx       # Roster page
├── components/             # Shared UI components
│   ├── Navbar.tsx         # Navigation
│   ├── Footer.tsx         # Footer
│   ├── MotionDiv.tsx       # Animation wrapper (Framer Motion)
│   ├── PageTransition.tsx  # Page transition
│   ├── FaqAccordion.tsx    # FAQ accordion
│   ├── DiscordIcon.tsx     # Discord icon SVG
│   └── sections/          # Page sections (one file per section)
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Requirements.tsx
│       ├── RosterPreview.tsx
│       ├── FAQ.tsx
│       ├── Join.tsx
│       └── Discord.tsx
├── data/                   # Static data (hardcoded)
│   └── roster.ts          # Roster members
├── hooks/                  # Custom React hooks
│   └── useAnimations.ts   # Intersection observer hooks
├── types/                  # TypeScript type definitions
│   └── index.ts
├── lib/                    # Utilities
│   └── utils.ts           # cn() for class merging
└── consts/                 # Constants
    └── router.ts
```

## Dependency Rules

- **App Router pages** (`app/`) can import from `components/`, `data/`, `hooks/`, `types/`, `lib/`
- **Components** can import from `components/` (sibling), `data/`, `types/`, `lib/`, `hooks/`
- **No circular dependencies** between components
- **Data layer** (`data/`) has no dependencies — pure data exports

```
App Pages → Components → Hooks/Lib/Types
                ↓
              Data
```

## Component Organization

### Page Components (`app/`)
- Orchestrate sections for a page
- Handle client-side state (search filters, etc.)
- Minimal styling — delegate to section components

### Section Components (`components/sections/`)
- Self-contained visual sections
- May include sub-components for repeated patterns
- All animations defined here via Framer Motion

### Shared Components (`components/`)
- Reusable across pages (Navbar, Footer)
- Generic UI elements (MotionDiv, FaqAccordion)

## Key Principles

1. **One component per file** — don't combine multiple components in one file
2. **Files under 300 lines** — if a component grows beyond 300 lines, extract sub-components
3. **CSS custom properties for design tokens** — colors, spacing, typography defined in `globals.css`
4. **Tailwind utilities for styling** — use Tailwind classes first, custom CSS only for complex patterns
5. **Framer Motion for animations** — replace manual IntersectionObserver with Framer Motion hooks

## Code Examples

### Section Component with Framer Motion

```tsx
// src/components/sections/Hero.tsx
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Hero content */}
      </motion.div>
    </section>
  )
}
```

### Class Merging Utility

```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Roster Data Structure

```ts
// src/data/roster.ts
export interface RosterMember {
  id: string
  gamertag: string
  role: 'SL' | 'Medic' | 'Marksman' | 'AT' | 'Crew' | 'Officer'
  joinDate: string
}

// Hardcoded roster data
export const roster: RosterMember[] = [
  { id: '1', gamertag: 'Viper', role: 'SL', joinDate: '2024-01' },
  // ...
]
```

## Anti-Patterns

- ❌ **Don't put page logic in layout.tsx** — keep layouts minimal (fonts, metadata only)
- ❌ **Don't use manual IntersectionObserver** — use Framer Motion's `useInView` or `motion` components
- ❌ **Don't duplicate section code** — if two pages share a section, extract to `components/sections/`
- ❌ **Don't mix concerns** — a component should either handle presentation OR state, not both (unless it's a page component)
- ❌ **Don't hardcode magic numbers** — extract to CSS custom properties or Tailwind config

## Animation Guidelines

- **Hero entrance:** `opacity: 0 → 1`, `y: 20 → 0`, `duration: 0.5`, `ease: easeOut`
- **Scroll reveals:** `useInView` with `once: true`, `margin: "-100px"`
- **Hover transitions:** `150-200ms`, `ease-out`
- **Page transitions:** Use `template.tsx` with Framer Motion `AnimatePresence`

## Styling Guidelines

- **CSS custom properties** for design tokens (defined in `globals.css`)
- **Tailwind utilities** for component styling
- **`cn()`** utility for conditional classes
- **No inline styles** except for dynamic values
