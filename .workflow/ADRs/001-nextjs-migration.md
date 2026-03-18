# ADR-001: Migrate to Next.js for Dynamic Member Loading and Animations

**Status:** Accepted
**Date:** 2026-03-16
**Supercedes:** None
**Related issues:** TBD

---

## Context

The RATS EU Squad clan website currently exists as a single 840-line `index.html` file using static HTML, Tailwind CSS (CDN), and Alpine.js (CDN). While this worked for a simple landing page, new requirements have emerged that fundamentally change the architecture:

1. **Better design with animations** - sophisticated UI with smooth transitions for member cards, filter effects, and scroll reveals
2. **Load members from GitHub** - fetch roster from GitHub organization API dynamically
3. **Map members by Discord roles** - role-based display categories (leaders, officers, members, recruits)

These requirements introduce:
- **API integration** (GitHub API to fetch organization members)
- **Server-side secrets** (GitHub Personal Access Token cannot be exposed client-side)
- **Role mapping logic** (Discord roles -> display categories)
- **Dynamic data fetching** (members can change, needs refresh)
- **Component-based UI** (animated member cards, filters by role)

### Security Constraint
The GitHub Personal Access Token (PAT) must never be exposed to the client. This requires a server-side component to proxy GitHub API requests, which eliminates purely static solutions.

### GitHub Rate Limits
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour
- Roster changes are infrequent, making caching critical

### Deployment Target
Vercel is the preferred deployment platform.

**Options considered:**
- Option A: Next.js with API Routes and Framer Motion — full React framework with built-in serverless functions
- Option B: Astro with Vercel Adapter + API Endpoint — HTML-first framework with separate API handler
- Option C: Static HTML + External Backend (Supabase) — keep current frontend, add separate database backend

## Decision

**Chosen:** Option A — Next.js with API Routes, App Router, Tailwind CSS, and Framer Motion

The site will be rebuilt as a full Next.js application with the following stack:

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS (local config, not CDN)
- **Animations:** Framer Motion for smooth, declarative animations
- **API:** Next.js API routes (`/api/members`) for secure GitHub integration
- **Deployment:** Vercel (native support for Next.js)
- **Data:**
  - GitHub Organization API for member list
  - Manual JSON mapping (`data/role-mappings.json`) for Discord role assignments

### Project Structure
```
app/
├── page.tsx                 # Main landing page
├── layout.tsx               # Root layout with fonts
├── api/
│   └── members/
│       └── route.ts         # Secure GitHub API proxy with ISR caching
├── components/
│   ├── MemberCard.tsx       # Animated member card component
│   ├── RosterSection.tsx    # Role-filtered roster display
│   └── AnimatedSection.tsx  # Scroll-triggered animations
├── lib/
│   ├── github.ts            # GitHub API client with error handling
│   ├── discord-roles.ts     # Role mapping logic
│   └── cache.ts             # Revalidation utilities
└── data/
    └── role-mappings.json   # GitHub username -> Discord role mapping
```

### Key Implementation Details

1. **API Route with ISR:** `/api/members` will fetch from GitHub with server-side token and use Next.js ISR with `revalidate: 3600` (1-hour cache) to respect rate limits while keeping data reasonably fresh.

2. **Discord Role Mapping:** Start with manual JSON file version-controlled in the repo. This is simple, auditable, and sufficient for a small clan roster. Future enhancement: add Discord bot for real-time sync.

3. **Framer Motion Animations:** Use for:
   - Staggered member card entrances on load
   - Hover effects on cards (scale, shadow)
   - Filter transitions when switching role categories
   - Scroll-triggered section reveals

4. **Environment Variables:** GitHub token stored in Vercel environment variables (`GITHUB_TOKEN`), never committed to code.

5. **TypeScript:** Full type safety across the codebase, leveraging Next.js TypeScript support.

## Reasoning

Next.js was chosen because it provides the most cohesive solution for the new requirements once a server-side component is mandated:

1. **Security:** API routes with environment variables is the Vercel-native pattern for hiding secrets. No need for additional services or complex deployment configs.

2. **Animations:** Framer Motion is the gold standard for React animations. It handles complex animations like staggered entrances, layout transitions, and scroll triggers with minimal code. This is significantly better than CSS-only or Alpine.js approaches.

3. **Caching:** Next.js ISR (Incremental Static Regeneration) elegantly handles the GitHub rate limit problem. Fetch once, cache for an hour, regenerate in background. No separate Redis or database cache service needed.

4. **Single Deployment:** Everything (frontend, API, animations) deploys as one Vercel project. No need to coordinate multiple services or worry about CORS between domains.

5. **Developer Experience:** Excellent TypeScript support, hot reloading, and the largest React ecosystem. Easy to add features later (CMS, auth, more pages).

6. **Future Scalability:** Next.js scales from simple pages to full applications. Adding member management, news, or events won't require a framework migration.

**Key tradeoff accepted:** We accept higher complexity and larger bundle size (~80-100KB React runtime) in exchange for a unified, well-documented architecture. The site is no longer "just a landing page" — it's a dynamic application with API integration and sophisticated animations. For a recruitment site that needs to look polished and professional, this tradeoff is justified.

**Why not Astro?** Astro's smaller bundle and HTML-first approach are attractive, but the animation requirement strongly favors React. Framer Motion is tightly integrated with React's component model and would require additional integration work in Astro. Next.js provides a more complete solution out of the box.

**Why not Supabase?** While Supabase solves the token security problem elegantly, it introduces another service to manage and creates a distributed data flow (GitHub -> Supabase -> Frontend). For a small clan website, the complexity of managing two services outweighs the benefit.

## Consequences

### What this means going forward

- **All new code must use Next.js App Router patterns** — no Pages Router, no mixed routing strategies
- **All external API calls must go through Next.js API routes** — never fetch directly from the browser with secrets
- **All animations must use Framer Motion** — no CSS-only animations except for very simple transitions
- **All data fetching must use Next.js caching primitives** — use `fetch` with `next.revalidate` or React `cache` function
- **Environment variables for secrets** — never commit tokens, always use Vercel environment variables

### Migration needed for existing code

- Delete or archive the current `index.html` file
- Recreate all sections as React components in Next.js App Router
- Migrate Tailwind classes to local Tailwind config (remove CDN reference)
- Replace Alpine.js interactivity with React state and Framer Motion animations
- Create initial `role-mappings.json` with current member data

### What to watch for

- **GitHub API rate limits** — monitor usage, increase cache duration if needed
- **ISR regeneration delays** — stale data may show for up to 1 hour
- **Bundle size impact** — ensure first-load JS remains reasonable (target <200KB)
- **Animation performance** — test on mobile devices, avoid excessive layout shifts

## Implementation

**Estimate:** ~8-12 hours

**Implementation issue:** TBD (pending user confirmation)

**Phases:**

### Phase 1: Foundation (~3-4 hours)
1. Initialize Next.js 14+ project with TypeScript and Tailwind
2. Set up project structure (`components/`, `lib/`, `api/`, `data/`)
3. Configure Vercel project and add `GITHUB_TOKEN` environment variable
4. Create API route `/api/members` with GitHub integration
5. Implement ISR caching with 1-hour revalidation

### Phase 2: Data Integration (~2-3 hours)
1. Create `data/role-mappings.json` with current member roles
2. Build GitHub API client with proper error handling and type definitions
3. Implement role mapping logic (GitHub username -> Discord role -> display category)
4. Test with real organization data and verify caching behavior

### Phase 3: UI Components (~2-3 hours)
1. Convert current HTML sections to React components
2. Build `MemberCard` component with Framer Motion hover effects and animations
3. Implement `RosterSection` with role-based filtering and transition animations
4. Add `AnimatedSection` for scroll-triggered reveals
5. Implement responsive layout matching current design

### Phase 4: Polish & Deploy (~1-2 hours)
1. Migrate custom fonts and optimize Tailwind config
2. Add loading states, error handling, and empty states
3. Deploy to Vercel and verify all functionality
4. Test ISR cache behavior and GitHub rate limits
5. Performance optimization and bundle analysis

**Total estimate: ~8-12 hours**
