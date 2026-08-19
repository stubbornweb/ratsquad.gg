# Environment Variables: `.env` Files vs. Name Prefixes

Research question: Can the team replace their current "variable name prefix" strategy (e.g., `TURSO_DATABASE_URL` vs `TURSO_DEV_DATABASE_URL`) with separate `.env` files (`.env.development`, `.env.production`) using identical variable names?

**TL;DR:** Yes, this approach is viable locally and in Vercel Preview/Production, but there are critical differences in behavior vs. the current strategy.

---

## 1. Next.js Environment Variable Load Order & Precedence

**Source:** [.next-docs/01-app/02-guides/environment-variables.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/02-guides/environment-variables.mdx) (lines 266–276)

Next.js loads `.env*` files in this order, **stopping at the first match**:

1. `process.env` (from shell/system)
2. `.env.$(NODE_ENV).local` (e.g., `.env.development.local`)
3. `.env.local` (skipped in `test` environment only)
4. `.env.$(NODE_ENV)` (e.g., `.env.development`)
5. `.env`

### For each command:

- **`next dev`** → NODE_ENV = `development` → loads `.env.development.local`, `.env.local`, `.env.development`, `.env`
- **`next build`** → NODE_ENV = `production` → loads `.env.production.local`, `.env.local`, `.env.production`, `.env`
- **`next start`** → NODE_ENV = `production` → loads `.env.production.local`, `.env.local`, `.env.production`, `.env`
- **`next lint` / `next test`** → NODE_ENV = `test` → loads **only** `.env.test.local` and `.env.test` (`.env.local` is explicitly skipped)

**Source:** Lines 283, 244–250

---

## 2. NODE_ENV Values Set by Next.js

**Source:** [.next-docs/01-app/02-guides/environment-variables.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/02-guides/environment-variables.mdx) (line 283)

- **`next dev`**: NODE_ENV = `development` (auto-assigned by Next.js)
- **`next build`**: NODE_ENV = `production` (auto-assigned)
- **`next start`**: NODE_ENV = `production` (auto-assigned)
- **`next lint`**: NODE_ENV = ? (UNVERIFIED in docs, likely `development`)
- **`next test`** (Vitest): NODE_ENV = `test` (typically set by test runner)

Next.js automatically assigns these values; you cannot override with a file.

---

## 3. Vercel Build & Deployment Behavior

### Files in Repository

**Vercel does NOT read `.env*` files from your repository** during builds or deployments.

**Source:** [https://vercel.com/kb/guide/how-to-add-vercel-environment-variables](https://vercel.com/kb/guide/how-to-add-vercel-environment-variables)

> "Local development reads from the same cloud-defined variables, so there's no separate `.env` file to maintain and drift out of sync."

Vercel injects variables exclusively from the **dashboard** or **CLI**, scoped to environments (Production, Preview, Development).

### NODE_ENV & VERCEL_ENV at Build & Runtime

**Source:** [https://vercel.com/docs/environment-variables/system-environment-variables](https://vercel.com/docs/environment-variables/system-environment-variables)

Vercel provides system variables:
- **`VERCEL_ENV`**: Can be `production`, `preview`, or `development`
- **`CI`**: Set to `1` at build time

Specifically for deployments:

| Deployment Type | VERCEL_ENV | NODE_ENV |
|---|---|---|
| Production | `production` | `production` |
| Preview | `preview` | `production` (UNVERIFIED; likely) |
| Build in CI | N/A | `production` |

**Source:** [https://vercel.com/docs/deployments/environments](https://vercel.com/docs/deployments/environments) (environment descriptions)

### Preview Deployments & Development Environment Variables

**Critical finding:** Vercel does NOT automatically load `.env.development` or `.env.production` files on Preview deployments. Instead:

- **Preview deployments get**: Variables scoped to the **Preview** environment in Vercel dashboard (not `.env.production`)
- **Development (local)**: Variables pulled by `vercel env pull` into `.env.local` or a named file

If the team wants Preview deployments to use dev/throwaway services, they must:
- Create separate Preview-scoped variables in the Vercel dashboard, OR
- Use conditional logic checking `VERCEL_ENV` (not `NODE_ENV`, which is always `production` on Preview)

---

## 4. Git & Committed Files

**Source:** [.next-docs/01-app/02-guides/environment-variables.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/02-guides/environment-variables.mdx) (lines 14, 252)

### Recommended practices:

- **Commit to git:** `.env`, `.env.development`, `.env.production`, `.env.test`
  - These contain non-secret, shared defaults
- **Add to `.gitignore`:** `.env.local`, `.env.*.local` (development, production, test)
  - These contain secrets or machine-specific values

### Special case: `.env.test`

- Should be **committed** (tests must be reproducible)
- `.env.test.local` should be **gitignored**

### Secrets in files?

The docs state `.env*` files **should not contain secrets** because the template ensures they're in `.gitignore`. Secrets belong in:
- Vercel environment variables (dashboard/CLI)
- `.env.local` (gitignored, local-only)

---

## 5. `vercel env pull` Command

**Source:** [https://vercel.com/docs/cli/env](https://vercel.com/docs/cli/env)

### Default behavior:

```bash
vercel env pull [file]
```

- **Without file argument:** Writes to `.env.local` by default
- **With file argument:** Writes to that file (e.g., `vercel env pull .env`)
- **Source:** Always pulls from Vercel's **Development** environment by default

### With `--environment` flag:

```bash
vercel env pull --environment=preview           # Pull Preview vars → `.env.local`
vercel env pull --environment=production        # Pull Production vars → `.env.local`
vercel env pull --environment=development       # Pull Development vars → `.env.local`
vercel env pull --environment=preview --git-branch=feature-x  # Branch-specific Preview
```

**Limitation:** Cannot directly generate `.env.development` or `.env.production` files; `vercel env pull` always writes to `.env.local` or a custom filename. The team would need to manually rename or use a wrapper script.

**Git safety:** `vercel env pull` does NOT modify `.gitignore` automatically. The user is responsible for adding `.env.local` to `.gitignore` (already done by `create-next-app`).

---

## 6. Vercel Dashboard Environment Variable Scopes

**Source:** [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables) (Environments table)

Vercel supports **per-environment values** for the **same variable name**:

| Environment | Scope |
|---|---|
| **Production** | Applied to deployments on the production branch (usually `main`) |
| **Preview** | Applied to non-production branches; can be **per-branch** (branch-specific override) |
| **Development** | For local `vercel dev` / `vercel env pull` |
| **Custom** | Pro/Enterprise only; arbitrary environments like `staging` or `QA` |

**Branch-specific Preview variables:**

> "Any branch-specific variables will override other preview environment variables with the same name. This means you don't need to replicate all your existing preview environment variables for each branch – you only need to add the values you wish to override."

**Source:** [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables) (Preview environment variables section)

So **yes**, Vercel supports per-environment scopes with identical variable names. This is their recommended approach instead of name-prefixing.

---

## 7. Custom Environment Switches & `next.config.js` `env` Key

### `APP_ENV` or custom switches:

**Relevant fact:** Next.js does not have built-in support for a custom `APP_ENV` variable that controls environment loading. The framework uses `NODE_ENV` exclusively to select `.env.$(NODE_ENV)` files.

If the team wants a custom "environment" concept beyond Next.js's three (development, production, test), they must:
- Read `process.env.NODE_ENV` or `process.env.VERCEL_ENV` and branch on it
- Manually select which secrets to load at runtime
- OR use custom middleware/initialization code

### `next.config.js` `env` key:

**Source:** [.next-docs/01-app/03-api-reference/05-config/01-next-config-js/env.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/03-api-reference/05-config/01-next-config-js/env.mdx)

This is a **legacy mechanism** (marked "version: legacy" in the docs). It inlines values at build time:

```js
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

All variables defined here are **always inlined** (similar to `NEXT_PUBLIC_`), not dynamically loaded. **Not recommended** for the team's use case.

---

## 8. Known Pitfalls: Build-Time vs. Runtime

### NEXT_PUBLIC_ variables:

- **Inlined at build time** into the JavaScript bundle
- **Cannot be changed** on a per-deployment basis without rebuilding
- Single Docker image deployed to multiple environments won't work with different `NEXT_PUBLIC_` values

**Source:** [.next-docs/01-app/02-guides/environment-variables.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/02-guides/environment-variables.mdx) (lines 154–166)

### Server-only variables (no `NEXT_PUBLIC_` prefix):

- **Available at build time** (Next.js loads `.env*` during `next build`)
- **Also available at runtime** in Vercel Functions (read dynamically from Vercel's injected environment)
- On Vercel, server-side `process.env` reads are **runtime-dynamic** for non-`NEXT_PUBLIC_` vars, meaning each function invocation can see different values if they're changed in the dashboard

**Important:** Dynamic rendering in App Router forces runtime evaluation:

```tsx
// This opts into dynamic rendering; env is read at runtime
import { connection } from 'next/server'
export default async function Component() {
  await connection()
  const value = process.env.MY_VALUE  // Read at runtime
}
```

**Source:** [.next-docs/01-app/02-guides/environment-variables.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/02-guides/environment-variables.mdx) (lines 194–235)

### Build-time immutability:

Static (pre-rendered) pages read `process.env` at **build time**, not runtime. Their values are frozen. On Vercel, a single build deployed to multiple environments will see the same server-only variables because they were read once during the build.

---

## 9. Test Environment Special Behavior

**Source:** [.next-docs/01-app/02-guides/environment-variables.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/02-guides/environment-variables.mdx) (lines 244–253)

When `NODE_ENV=test`:

- `.env.development` is **NOT** loaded
- `.env.production` is **NOT** loaded
- `.env.local` is **NOT** loaded (to ensure reproducibility)
- **Only** `.env.test.local` and `.env.test` are loaded

This prevents test environments from accidentally using development or production secrets. The team should create a `.env.test` file with safe test defaults.

---

## Summary: Viability of File-Based Approach

### Pros:

1. ✅ **Cleaner locally:** Single variable names in each file (no `TURSO_DEV_*` / `TURSO_*` duplication)
2. ✅ **Matches Next.js design:** Framework is built around `.env.development` / `.env.production`
3. ✅ **Test-friendly:** Clear separation with `.env.test`
4. ✅ **Vercel-compatible:** Vercel's dashboard already supports per-environment scopes with same names

### Cons / Required Changes:

1. ⚠️ **Vercel doesn't read files:** `.env.production` is ignored by Vercel CI/CD; must use dashboard variables instead
2. ⚠️ **Preview deployments need special handling:** Preview gets Vercel's `VERCEL_ENV=preview`, not local `.env.development`. Previews won't automatically use dev services unless Vercel's Preview scope is configured to use them
3. ⚠️ **`vercel env pull` creates `.env.local`, not `.env.development`:** Team needs a wrapper or manual step to organize downloaded vars
4. ⚠️ **NODE_ENV on Vercel is always `production`:** Preview and Production both run with `NODE_ENV=production`. Must check `VERCEL_ENV` if distinct behavior is needed

### Recommended Migration Path:

1. Commit `.env.development` and `.env.production` to git with non-secret defaults
2. Create `.env.local` (gitignored) for local overrides
3. In Vercel dashboard, configure **Production**, **Preview**, and **Development** scopes with same variable names
4. Update code to check `VERCEL_ENV` (not `NODE_ENV`) if Preview must behave differently from Production
5. For local `vercel dev`: Ensure `vercel env pull` is run regularly or automated

---

## Cited Sources

- Next.js 16.1.7 App Router docs (vendored): [.next-docs/01-app/02-guides/environment-variables.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/02-guides/environment-variables.mdx)
- Next.js 16.1.7 legacy config: [.next-docs/01-app/03-api-reference/05-config/01-next-config-js/env.mdx](file:///home/yevhenii/www/rats-site/.next-docs/01-app/03-api-reference/05-config/01-next-config-js/env.mdx)
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Vercel System Environment Variables: https://vercel.com/docs/environment-variables/system-environment-variables
- Vercel CLI `vercel env`: https://vercel.com/docs/cli/env
- Vercel Environments (local/preview/production): https://vercel.com/docs/deployments/environments
- Vercel KB: How to add env vars: https://vercel.com/kb/guide/how-to-add-vercel-environment-variables
