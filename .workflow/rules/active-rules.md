# Active Rules Snapshot

> Generated: 2026-03-18
> Base: 4 files | Project: 3 files | Features: 0 feature-specific files
> Run `/workflow:sync` after editing any rule file.

---

## BASE LAYER
> Global conventions — apply to all projects. Priority: lowest.

### base/coding-standards.md

**TypeScript Standards (applicable to this project):**
- Always use TypeScript — never plain JavaScript in application code
- Never use `any` — use `unknown` and narrow it, or define a proper type
- Always define return types on functions
- Prefer `interface` over `type` for object shapes that may be extended
- Always use named imports — avoid default imports except for framework components
- Always group imports: external packages -> internal modules -> relative paths
- Always use `const` — use `let` only when reassignment is truly needed
- Never use `var`

**Universal Standards:**
- Never add comments that describe *what* — only explain *why*
- Never silently swallow exceptions
- Never use empty catch blocks
- One class/interface per file
- Keep files under 300 lines

### base/git.md

- Conventional commits: `<type>(<scope>): <subject>`
- Types: feat, fix, docs, style, refactor, test, chore, perf, ci
- Subject line max 72 chars, imperative mood
- Branch naming: `feature/<N>-slug`, `fix/<N>-slug`, etc.
- Never commit .env files, secrets, or node_modules

### base/architecture.md

- Never put business logic in controllers/route handlers
- Dependencies point downward (handler -> service -> repository -> database)
- Framework integration at outer layer only

### base/testing.md

- Coverage thresholds: 80% overall, 90% new code, 95% critical paths
- Test naming: "it [does something]"
- AAA pattern: Arrange / Act / Assert
- Use Vitest for unit/component tests, Playwright for E2E
- Never snapshot-test component output
- Test behaviour, not implementation

---

## PROJECT LAYER
> Project-specific decisions. Override base rules on conflict.

### project/stack.md

- **Framework:** Next.js 16 (App Router, TypeScript)
- **CSS:** Tailwind CSS 4 (via @tailwindcss/postcss)
- **Animations:** Framer Motion 12
- **Icons:** Lucide React
- **Fonts:** DM Sans, Bebas Neue, Barlow Condensed, IBM Plex Mono (Google), NASTUP (local)
- **Deployment:** Vercel (standalone output)

**Stack-Specific Rules:**
- Always use App Router (`app/`) — never Pages Router
- Always use `next/font/google` — never CDN font links
- Always use `next/link` for internal navigation
- Always add `"use client"` when using hooks or browser APIs
- Tailwind v4: use `@import "tailwindcss"` syntax
- Custom theme in `@theme inline` block in globals.css
- Never use rounded corners on buttons (border-radius: 0)
- Always use `clamp()` for responsive typography

### project/conventions.md

No project-specific conventions defined yet.

### project/architecture.md

**ADR-001: Next.js Migration (2026-03-16)**
- ALWAYS use Next.js App Router — never Pages Router or static HTML
- ALWAYS proxy external API calls through Next.js API routes
- ALWAYS use Framer Motion for all animations
- ALWAYS use Next.js caching primitives for data fetching

---

## FEATURES LAYER
> No feature-specific rules defined yet.

---

## Conflict Notes

- **project/stack.md overrides base/coding-standards.md:** PHP/Laravel standards do not apply — this is a TypeScript/React project. Only the TypeScript and Universal sections of coding-standards are relevant.
- **project/stack.md overrides base/testing.md:** No test runner configured yet. Coverage thresholds are aspirational until Vitest is set up.
- **project/architecture.md overrides base/architecture.md:** Base layer's PHP layered architecture (controllers/services/repositories) does not apply. Next.js App Router patterns from ADR-001 take precedence.
- **Current state vs ADR-001:** The codebase currently violates ADR-001 — Framer Motion is not used, all pages are client-side, no ISR/caching. These are tracked as technical debt (DEBT-001, DEBT-006).
