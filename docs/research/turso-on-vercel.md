# Research: Turso on Vercel — Limits, Client, and the Exit Path

**Date of research:** July 29, 2026  
**Scope:** Evaluating Turso (libSQL-powered SQLite-as-a-service) for a ~8-table, ~40-player clan database, deployed on Vercel with an optional Docker standalone image.

---

## Summary

Turso is production-ready for this scale. The free tier is generous (100 DBs, 5GB storage, 500M read rows/month), and the team's quoted plan numbers are outdated—they reference the Starter plan from September 2023, which no longer exists. The exit path to local SQLite is clean: `@libsql/client` supports both Turso (via HTTPS) and local files (via `file://`), with 100% API compatibility and zero SQL dialect friction. An ORM is optional; raw SQL via `@libsql/client.execute()` is simple and sufficient for 8 tables. Vercel's ephemeral Functions require HTTP-based connections (not WebSocket), which Turso fully supports.

---

## 1. Turso Pricing Plans — Current Limits (as of 2026-07-29)

### Plan Comparison

| Aspect | Free | Developer | Scaler | Pro |
|--------|------|-----------|--------|-----|
| **Cost** | $0 | $4.99/mo | $24.92/mo | $416.58/mo |
| **Databases** | 100 | Unlimited | Unlimited | Unlimited |
| **Storage** | 5 GB (+$0.75/GB) | 9 GB (+$0.75/GB) | 24 GB (+$0.50/GB) | 50 GB (+$0.45/GB) |
| **Monthly Row Reads** | 500M (+$1/B) | 2.5B (+$1/B) | 100B (+$0.80/B) | 250B (+$0.75/B) |
| **Monthly Row Writes** | 10M | 25M (+$1/M) | 100M (+$0.80/M) | 250M (+$0.75/M) |
| **Monthly Syncs** | 3 GB | 10 GB (+$0.35/GB) | 24 GB (+$0.25/GB) | 100 GB (+$0.15/GB) |
| **Point-In-Time Restore** | 1 day | 10 days | 30 days | 90 days |
| **Groups** | 1 | Unlimited | Unlimited | Unlimited |
| **Locations** | 3 | Unlimited | Unlimited | Unlimited |
| **Audit Logs** | — | 3-day retention | — | 30-day retention |

**Source:** [Turso Pricing](https://turso.tech/pricing) (fetched 2026-07-29, footer shows © Turso 2026)

### Notes on Team's Quoted Figures

The clan quoted: ~500 DBs, 9GB storage, 1B row reads, 25M row writes, 1 group, 3 locations, 24h restore.

**Status:** These numbers do **not** match any current plan and appear to be outdated.

- **500 DBs:** From the old Starter plan in September 2023, which was increased from 3 to 500 databases. [Source: "Turso radically increases the amount of databases available on their Starter and Scaler plans" (Sept 25, 2023)](https://turso.tech/blog/turso-radically-increases-the-amount-of-databases-available-on-their-starter-and-scaler-plans-10a69ad94055). Current Free tier has only 100 databases; Developer and above have unlimited.
- **9GB storage, 25M writes, 10-day restore:** Match the current Developer plan ($4.99/mo).
- **1B row reads, 1 group, 3 locations:** Match the current Free tier exactly (1 group, 3 locations); the 1B reads is between Free (500M) and Developer (2.5B).
- **24h restore:** Equivalent to the Free tier's 1-day point-in-time restore.

**Recommendation:** Clarify with the team whether the intended plan is Free (for evaluation) or Developer ($4.99/mo for production). At 40 players with ~8 tables, even the Free tier is likely sufficient, since 500M reads and 10M writes per month is ~15M reads and ~300K writes daily per player—comfortably inside Free tier limits.

---

## 2. Connecting from Next.js 16: Client Package, Runtime Support, and Connection Reuse

### Client Libraries

Two TypeScript client packages are officially supported: [GitHub - tursodatabase/libsql-client-ts](https://github.com/tursodatabase/libsql-client-ts)

**`@libsql/client`** — General-purpose, production-ready, ORM-friendly
- Supports both remote Turso (via HTTPS) and local SQLite files (via `file://` protocol)
- Works in Node.js, edge runtimes, and Vercel Functions
- Depends on native bindings for some features; bundling can require care on Vercel (see known issues below)
- Used by Drizzle, Prisma (via adapter), and Kysely dialects

**`@tursodatabase/serverless`** — Edge/serverless optimized
- HTTP-only, zero native dependencies, minimal bundle size
- Explicitly designed for edge runtimes (Vercel Edge Functions, Cloudflare Workers, Deno Deploy)
- Cannot connect to local SQLite files; only remote Turso databases
- [Source: Turso docs on serverless JavaScript driver](https://turso.tech/blog/introducing-turso-serverless-javascript-driver)

**`@tursodatabase/vercel-experimental`** — Vercel Functions specific
- Purpose-built for Vercel Functions with embedded replica support
- Requires `TURSO_API_TOKEN`, `TURSO_ORG`, `TURSO_GROUP`, and `TURSO_DATABASE` env vars
- Implements singleton pattern: `createDb(name)` returns the same instance for the same database name, preventing redundant API calls
- Registers a callback with Vercel's `waitUntil()` API to push pending changes within 5 seconds before the Function closes
- [Source: "Bringing SQLite to Vercel Functions with Turso"](https://turso.tech/blog/serverless) (fetched 2026-07-29)

### Protocol and Runtime Support

**Protocol:** HTTP via Hrana over HTTP (vs. WebSocket via Hrana over WebSocket in traditional setups)

Turso supports two variants of the Hrana protocol:
- **Hrana over WebSocket:** Multiple streams can be multiplexed over a single WebSocket connection; more efficient but requires stateful connections
- **Hrana over HTTP:** Communicates via discrete HTTP requests; less efficient per-query but compatible with serverless environments where connections cannot be held open

[Source: Turso protocol documentation and blog](https://turso.tech/blog/serverless)

**Vercel Functions constraint:** Vercel Functions are stateless and ephemeral. While Vercel now supports WebSocket connections (as of June 22, 2026, in public beta), established connections are pinned to a specific Function instance and future connections are not guaranteed to reconnect to the same instance. [Source: "Do Vercel Serverless Functions support WebSocket connections?" and "WebSocket support is now in Public Beta"](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections)

**Recommendation for this project:** Use `@libsql/client` for Vercel deployment. It handles both HTTP and WebSocket transparently, and the HTTP fallback ensures reliable operation in the ephemeral environment. Avoid `@tursodatabase/vercel-experimental` if you want compatibility with the Docker exit path (it's Vercel-specific).

### Connection Reuse in Serverless

Vercel Functions do **not** support traditional connection pooling. Each Function invocation is stateless; module-level state (e.g., a global `client` instance) may persist *between* invocations in the same Function instance, but this is an implementation detail and not guaranteed.

For database connections:
- Vercel's [Fluid Compute model](https://vercel.com/guides/connection-pooling-with-serverless-functions) (as of 2026) handles pooling at the platform level, closing pool clients exactly as in traditional serverful solutions, solving the connection leak problem that plagued earlier serverless environments.
- With Turso's HTTP protocol, each query is a discrete HTTP request; there is no persistent connection to "reuse." Turso's servers handle load distribution and caching internally.

**Implication:** No custom connection pooling logic is needed. Instantiate the client once at module level in each route handler and reuse it:

```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET() {
  const result = await client.execute('SELECT * FROM members LIMIT 10');
  return Response.json(result);
}
```

[Source: GitHub - tursodatabase/libsql-client-ts](https://github.com/tursodatabase/libsql-client-ts); Vercel docs on [Connection Pooling](https://vercel.com/guides/connection-pooling-with-serverless-functions)

---

## 3. Migrations: Official Tooling and Schema Changes

Turso itself does **not** provide a native migration tool. Schema management is delegated to ORMs or CLI tools.

### Drizzle + drizzle-kit (Recommended for this project)

[Drizzle ORM](https://orm.drizzle.team/docs/sqlite/connect-turso) natively supports libSQL/Turso:
- `drizzle-kit generate` generates migration files from your schema definitions
- `drizzle-kit push` applies migrations to a remote Turso database
- `drizzle-kit pull` introspects an existing Turso database to generate schema

**Known issue:** `drizzle-kit push` can fail when a schema change requires table recreation (e.g., changing a foreign key constraint). SQLite doesn't support ALTER TABLE for FK changes, so drizzle-kit recreates the table. However, on Turso's HTTP protocol, the transaction wrapping breaks. [Source: GitHub issue #5489 - drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm/issues/5489)

**Workaround:** Use Turso's CLI or API to apply such migrations manually, or avoid the problematic schema patterns.

### Prisma (Early Access support)

[Prisma 6.6.0+](https://www.prisma.io/docs/orm/v6/overview/databases/turso) includes Early Access support for:
- `prisma db push` — apply schema changes to Turso
- `prisma db pull` — introspect schema
- `prisma migrate diff` — generate migration files

**Limitation:** Prisma Migrate (sequential migrations) is incompatible with Turso due to the HTTP protocol. Use `prisma db push` for schema changes, or use `prisma migrate diff` to generate SQL and apply it via Turso's CLI. [Source: "SQLite on the Edge: Prisma Support for Turso is in Early Access"](https://www.prisma.io/blog/prisma-turso-ea-support-rXGd_Tmy3UXX)

### Kysely + kysely-libsql

[Kysely](https://github.com/kysely-org/kysely-turso) has official dialect support for Turso via the `kysely-libsql` package. Migrations are built into Kysely's migration system: [Source: GitHub - tursodatabase/kysely-libsql](https://github.com/tursodatabase/kysely-libsql)

Kysely does not provide automatic schema diffing; you write migrations by hand, which gives fine-grained control but requires more manual work.

### Raw SQL (No migration framework)

If you use raw SQL via `@libsql/client.execute()`, you can manage migrations as SQL files in version control and apply them manually via the Turso CLI:
```bash
turso db shell <database> < migration.sql
```

This is simple and sufficient for 8 tables, but lacks automatic tracking of applied migrations.

---

## 4. Backups and Export: Getting Data Out as SQLite

### `turso db export` CLI

Turso provides a CLI command to export a database snapshot to a local SQLite file:

```bash
turso db export <database-name> <output-file.db>
```

**Note:** The exported file may not contain the latest changes if they are still in transit. [Source: "db export - Turso"](https://docs.turso.tech/cli/db/export)

### `turso db import` CLI

Inverse operation: import an SQLite dump into Turso:

```bash
turso db import <database-name> <input-file.db>
```

[Source: "Migrating and Importing SQLite to Turso Just Got Easier"](https://turso.tech/blog/migrating-and-importing-sqlite-to-turso-just-got-easier)

### Databases API

Turso's Databases API (HTTP/REST) supports:
- Creating databases
- Uploading SQLite dumps
- Creating database branches (for testing schema changes)
- Restoring from backup (within point-in-time restore window)

[Source: "The Databases API: Platform Saga Part VI"](https://turso.tech/blog/databases-api-platform-saga-part-6)

### Recommendation

For on-demand backups, use `turso db export` as a scheduled CLI task (e.g., daily cron job on your host). For point-in-time restore, rely on Turso's PITR within the plan's restore window (Free: 1 day, Developer: 10 days). For disaster recovery, keep exported files in version control or S3.

---

## 5. The Exit Path: Switching from Turso to Local SQLite

**This is the most important finding for this project.** The exit path is exceptionally clean.

### API Compatibility

[libSQL is 100% backwards compatible with SQLite](https://github.com/tursodatabase/libsql):
- Same file format
- Same SQL API
- Same JavaScript/TypeScript client interface via `@libsql/client`

This means switching from remote Turso to local SQLite requires **only a configuration change**, not application code rewrites.

### Concrete Code Example

**On Vercel (Turso):**
```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,  // e.g. https://my-db-abcd1234.turso.io
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

**In Docker (local SQLite):**
```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:/var/lib/app/data.db',  // Mount this path as a Docker volume
});
```

The `client.execute()`, `client.batch()`, and all other methods are identical. SQL syntax is compatible (see SQL Dialect section below). [Source: GitHub - tursodatabase/libsql-client-ts; Docker HOWTO](https://github.com/tursodatabase/libsql/blob/main/docs/DOCKER.md)

### SQL Dialect Compatibility

libSQL maintains 100% compatibility with SQLite's SQL dialect, with optional extensions:
- libSQL adds features like native vector search and extended ALTER TABLE support
- Applications that avoid these extensions generate standard SQLite files
- [Source: libSQL GitHub repo, EXTENSIONS documentation](https://github.com/tursodatabase/libsql/blob/main/libsql-sqlite3/doc/libsql_extensions.md)

**For 8 tables and 40 players:** Standard SQL (no libSQL extensions) is entirely sufficient. Your schema will be portable.

### Docker Setup for Local SQLite

The project already has a Docker image (`.docker/compose.bun.yml` referenced in CLAUDE.md). To integrate local SQLite:

1. Mount a volume for the database file:
   ```yaml
   volumes:
     - ./data:/var/lib/app/data  # Persists database across container restarts
   ```

2. In your Node.js application, connect via:
   ```typescript
   const client = createClient({ url: 'file:/var/lib/app/data/app.db' });
   ```

3. No code changes required in route handlers or server components—only the `url` config parameter.

### Runtime Differences

| Aspect | Turso (Vercel) | Local SQLite (Docker) |
|--------|---|---|
| **Client** | `@libsql/client` (HTTP) | `@libsql/client` (file) |
| **URL** | `https://...turso.io` + auth token | `file:/path/to/db` |
| **Connection** | HTTP request per query | Local file I/O |
| **Latency** | ~100ms (cross-region) | <1ms (local) |
| **Concurrency** | Turso handles contention | SQLite WAL mode (limited write concurrency) |
| **Environment** | Vercel Functions (ephemeral) | Docker container (persistent) |

[Source: Turso protocol docs and libSQL SQLite compatibility](https://github.com/tursodatabase/libsql)

### Recommendation for Module Seam

To maximize flexibility, create a thin database abstraction layer:

```typescript
// src/lib/db.ts
import { createClient } from '@libsql/client';

let client: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!client) {
    const isLocal = process.env.DATABASE_LOCAL === 'true';
    client = createClient({
      url: isLocal ? 'file:./data.db' : process.env.DATABASE_URL!,
      authToken: isLocal ? undefined : process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return client;
}
```

Then use `getDb()` throughout the codebase. Switching environments is a single environment variable change. This maintains clean separation and avoids hardcoding URLs in application logic.

---

## 6. ORM Evaluation: Drizzle vs. Prisma vs. Kysely vs. Raw SQL

For ~8 tables and 40 players, an ORM is **optional**. The decision should weigh type safety and developer experience against bundle size and abstraction overhead.

### Drizzle ORM

**Status:** [Full official support for Turso](https://orm.drizzle.team/docs/sqlite/connect-turso)

**Pros:**
- First-class Turso integration; migrations via drizzle-kit
- Type-safe schema definitions and query builders
- Supports both remote Turso and local SQLite without code changes
- Small bundle size (~50 KB minified)
- [Official get-started guide for Turso](https://orm.drizzle.team/docs/get-started/turso-new)

**Cons:**
- Known issue with table recreation migrations on Turso's HTTP protocol (requires workaround)
- Learning curve for new developers unfamiliar with Drizzle

**Recommendation:** Drizzle is the best choice if you want type safety and automated migrations. The table recreation issue is rare and has a known workaround.

[Source: Drizzle ORM - Turso Cloud](https://orm.drizzle.team/docs/sqlite/connect-turso); [Drizzle + Turso - Turso docs](https://docs.turso.tech/sdk/ts/orm/drizzle)

### Prisma ORM

**Status:** [Early Access support as of Prisma 6.6.0](https://www.prisma.io/blog/prisma-turso-ea-support-rXGd_Tmy3UXX) (April 2025)

**Pros:**
- Very intuitive schema language (`.prisma` files)
- Strong community and ecosystem
- Supports both remote Turso and local SQLite
- Early Access Turso migrations in v6.6.0+

**Cons:**
- Early Access status means potential API changes
- Prisma Migrate (sequential migrations) incompatible with Turso's HTTP protocol; must use `prisma db push` or manual SQL
- Larger bundle size (~100+ KB minified with all adapters)
- Requires `@prisma/adapter-libsql` adapter

**Recommendation:** Prisma is mature and well-supported, but Early Access for Turso means some risk. Suitable if your team is already familiar with Prisma. Avoid if you need sequential migration history.

[Source: "Turso | Prisma Documentation"](https://www.prisma.io/docs/orm/v6/overview/databases/turso); [Using Prisma with Turso](https://www.prisma.io/docs/guides/database/turso)

### Kysely (Query Builder, not ORM)

**Status:** [Official dialect support via kysely-turso](https://github.com/kysely-org/kysely-turso)

**Pros:**
- Type-safe SQL queries (compiles SQL at TypeScript compile time)
- Minimal abstraction; you control the SQL
- Excellent for developers who prefer writing SQL
- Supports both remote Turso and local SQLite

**Cons:**
- Not an ORM; no automatic migrations, you write migration files by hand
- Smaller community than Drizzle or Prisma
- Still requires learning its query DSL

**Recommendation:** Kysely is a good middle ground if you want type safety without the abstraction overhead of an ORM. Suitable for this scale.

[Source: GitHub - kysely-org/kysely-turso](https://github.com/kysely-org/kysely-turso); [GitHub - tursodatabase/kysely-libsql](https://github.com/tursodatabase/kysely-libsql)

### Raw SQL (No ORM or Query Builder)

**Supported:** Yes, via `@libsql/client.execute()`

```typescript
const result = await client.execute(
  'SELECT * FROM members WHERE rank = ?',
  ['SQUAD LEAD']
);
```

[Source: GitHub - tursodatabase/libsql-client-ts](https://github.com/tursodatabase/libsql-client-ts)

**Pros:**
- Simplest to implement; no abstraction layer
- Zero bundle overhead
- Full control over SQL
- Excellent for small schemas

**Cons:**
- No automatic migrations; manual SQL file management
- No type safety for query results
- Prone to SQL injection if parameters not used correctly
- Less maintainable as schema grows

**Recommendation:** Raw SQL is **viable and appropriate for 8 tables**. Mitigation strategies:
- Use parameterized queries (bind placeholders: `?`, `:name`, `@name`, `$1`) to prevent SQL injection
- Keep SQL in separate `.sql` files in version control for clarity
- Consider Kysely if type safety becomes valuable later

### Verdict: Recommendation for This Project

**Best fit: Drizzle ORM** if you want long-term maintainability and type safety.
**Alternative: Raw SQL** if you want to minimize dependencies and complexity. Sufficient for 8 tables at 40-player scale.

| Criteria | Drizzle | Prisma | Kysely | Raw SQL |
|----------|---------|--------|--------|---------|
| **Turso Support** | Full | Early Access | Full | Full |
| **Migration Tooling** | drizzle-kit | prisma db push | Manual | Manual |
| **Type Safety** | High | High | Medium | None |
| **Bundle Size** | ~50 KB | ~100+ KB | ~30 KB | ~5 KB |
| **Learning Curve** | Medium | Low | Medium | Low |
| **Best for This Scale** | ✓ | ✓ | ✓ | ✓ (viable) |

---

## Open Questions / Could Not Verify

1. **Turso per-user databases:** Search results mentioned "Per-User Starter" boilerplate. Current feature status and pricing tier applicability unclear. May warrant separate investigation if user-scoped databases are desired.

2. **libSQL embedded replicas:** Prisma and Turso support embedded replicas for offline-first apps. Feasibility for Vercel Functions (which lack persistent filesystem) and Django interactions not investigated.

3. **Exact plan limit change dates:** Blog posts and docs don't provide a comprehensive timeline of all plan changes since Turso's launch (2023). If you need historical pricing accuracy for cost projections, contact Turso support.

4. **Turso API/GraphQL vs REST vs SQL:** Research focused on SQL client connectivity. Turso's management APIs (for programmatic database creation, branch management, etc.) are not deeply evaluated here.

5. **ORM performance with Turso HTTP protocol:** ORMs may incur additional HTTP overhead compared to raw SQL. Benchmarks specific to Vercel + Turso not found in official sources.

---

## Key Sources

- [Turso Pricing](https://turso.tech/pricing) — Official plan limits and costs
- [GitHub - tursodatabase/libsql-client-ts](https://github.com/tursodatabase/libsql-client-ts) — TypeScript client source
- [Bringing SQLite to Vercel Functions with Turso](https://turso.tech/blog/serverless) — Vercel + Turso integration patterns
- [Drizzle ORM - Turso Cloud](https://orm.drizzle.team/docs/sqlite/connect-turso) — ORM integration guide
- [Prisma docs - Turso](https://www.prisma.io/docs/orm/v6/overview/databases/turso) — ORM integration guide
- [GitHub - kysely-org/kysely-turso](https://github.com/kysely-org/kysely-turso) — Query builder dialect
- [Vercel Connection Pooling](https://vercel.com/guides/connection-pooling-with-serverless-functions) — Vercel Functions architecture
- [libSQL GitHub](https://github.com/tursodatabase/libsql) — SQLite fork source and documentation

---

**Last fetched:** July 29, 2026  
**Next review date:** Recommended Q4 2026 (to catch new Prisma 7.x Turso features and potential Turso pricing changes)
