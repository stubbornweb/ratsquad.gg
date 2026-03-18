# Project Architecture Rules

> Populated automatically by `architecture-recorder` via `/arch:decide`.
> Do not edit manually — use the arch commands to add decisions.
> Run `/workflow:sync` after any changes here.

---

## How Decisions Get Here

1. `/arch:brainstorm` — explore options
2. `/arch:challenge` — stress-test the proposal
3. `/arch:decide` — lock in the decision

`architecture-recorder` appends a rule to this file after every `/arch:decide`.
The full decision context is in `.workflow/ADRs/`.

---

## Decisions

## ADR-001: Next.js Migration (2026-03-16)

**Rule:** ALWAYS use Next.js App Router for all pages and features — never mix with Pages Router or use legacy static HTML.

**Details:**
- All new pages go in `app/` directory with `page.tsx` files
- Use `app/api/` for serverless functions that handle external APIs
- Use `app/layout.tsx` for root layout with global styles and fonts
- What this replaces: static HTML files, Alpine.js direct interactivity, CDN-based frameworks

**See:** .workflow/ADRs/001-nextjs-migration.md

## ADR-001: API Routes for Secure External Calls (2026-03-16)

**Rule:** ALWAYS proxy external API calls through Next.js API routes — never fetch directly from client with secrets.

**Details:**
- All external API calls (GitHub, Discord, etc.) go through `app/api/` routes
- Store API tokens in Vercel environment variables, never in code
- Use ISR caching (revalidate) to respect rate limits while keeping data fresh
- What this replaces: client-side fetch with exposed tokens, direct third-party API calls

**See:** .workflow/ADRs/001-nextjs-migration.md

## ADR-001: Framer Motion for Animations (2026-03-16)

**Rule:** ALWAYS use Framer Motion for all animations — never use CSS-only animations or Alpine.js transitions.

**Details:**
- Use Framer Motion for hover effects, page transitions, scroll reveals, staggered entrances
- Keep animation logic in components, avoid inline animation objects
- Test animations on mobile to ensure performance
- What this replaces: CSS keyframes, Alpine.js transitions, Animate.css

**See:** .workflow/ADRs/001-nextjs-migration.md

## ADR-001: Next.js Data Fetching Patterns (2026-03-16)

**Rule:** ALWAYS use Next.js caching primitives for data fetching — never fetch on every render without caching.

**Details:**
- Use `fetch` with `next.revalidate` for server components with ISR
- Use React `cache` function for deduplicating client-side fetches
- Set appropriate revalidation times based on data volatility (1 hour for member data)
- What this replaces: uncontrolled fetch calls, manual cache management

**See:** .workflow/ADRs/001-nextjs-migration.md
