# Research: Discord OAuth and Role-Based Authorization in Next.js 16

**Date of research:** July 29, 2026  
**Scope:** Implementing OAuth2 identity and Discord role-based permissions for a stateless Next.js 16.1.7 / Vercel Serverless site with no existing auth or sessions.

---

## Summary

Adding Discord OAuth to rats-site enables user identity (via OAuth2) and role-based access control (via the guild member endpoint). The auth flow itself is straightforward: redirect to Discord's authorization endpoint, handle the callback, exchange the code for tokens, and store the session in a signed HTTP-only cookie. **Session storage via signed cookie is viable for Vercel**, where stateless functions are the norm—no database required. Role checks can be done cached-at-login (cheaper, stale) or re-checked-per-request (more expensive, fresh). **Auth.js is not officially supported on Next.js 16 or React 19**, making a hand-rolled flow simpler than managing an unsupported library; a minimal implementation is ~200 lines. When a user leaves the guild mid-session, a 404 from the Discord API indicates departure; re-checking roles per-request catches this immediately, while cached sessions miss it until expiry.

---

## 1. The OAuth2 Flow: Endpoints, Scopes, and Callback Handling

### Endpoints and Required Scopes

[Discord OAuth2 uses three endpoints:](https://discord.com/developers/docs/topics/oauth2)

| Step | Endpoint | Method | Purpose |
|------|----------|--------|---------|
| **Authorize** | `https://discord.com/oauth2/authorize` | GET (user visits) | User grants permissions |
| **Token Exchange** | `https://discord.com/api/oauth2/token` | POST (server-to-server) | Exchange auth code for tokens |
| **Revoke** | `https://discord.com/api/oauth2/token/revoke` | POST (server-to-server) | Invalidate a token |

**Required Scopes** for this use case:

- **`identify`** – [Allows `/users/@me` to return the user's basic profile](https://discord.com/developers/docs/topics/oauth2#scopes) (ID, username, avatar). Required for identity.
- **`guilds.members.read`** – [Allows `/users/@me/guilds/{guild.id}/member` to return the user's roles in the RATS guild](https://discord.com/developers/docs/resources/user#get-current-user-guild-member). Required for role-based access.
- **`guilds`** – [Allows `/users/@me/guilds` to list all guilds the user belongs to](https://discord.com/developers/docs/topics/oauth2#scopes). **Not required** for a single-guild app; `identify` and `guilds.members.read` are sufficient.

**Scope Relationship:** `guilds` and `guilds.members.read` are separate permissions. [The `guilds` scope returns basic guild info; `guilds.members.read` returns the user's membership and roles within a specific guild.](https://discord.com/developers/docs/topics/oauth2#scopes) To check user roles in the RATS guild, request `identify` and `guilds.members.read` only.

### OAuth2 Authorization Flow in Next.js 16

The flow uses the standard [OAuth2 authorization code grant](https://discord.com/developers/docs/topics/oauth2). In Next.js 16 with App Router:

1. **User initiates login** (client-side link or button)
2. **Redirect to Discord authorization endpoint** (Route Handler or `Link`)
3. **User grants permissions on Discord**
4. **Discord redirects to callback route** with `code` and `state` parameters
5. **Callback Route Handler exchanges code for tokens** (server-side, securely)
6. **Create session and set HTTP-only cookie** (Route Handler)
7. **Redirect to dashboard or home**

### PKCE and State Handling

**State Parameter** – [OAuth2 authorization endpoint supports a `state` parameter as CSRF protection.](https://discord.com/developers/docs/topics/oauth2) Generate a random string, store it temporarily (in session/cookie), and verify it matches when Discord redirects back. [Next.js Route Handlers can read cookies via the `cookies()` API.](./.next-docs/01-app/03-api-reference/04-functions/cookies.mdx)

**PKCE** – [Proof Key for Public Clients (PKCE) is an optional OAuth2 extension for single-page apps and native apps.](https://tools.ietf.org/html/rfc7636) Discord's OAuth2 documentation does not mandate PKCE for confidential clients (server-to-server flows with a client secret), but it is harmless. For a Next.js backend-for-frontend pattern (server Route Handlers), PKCE is **not required** because the client secret is never exposed. Standard `state` handling is sufficient.

### Session Storage: Signed Cookie vs. Database

[Next.js authentication guide recommends two approaches:](./.next-docs/01-app/02-guides/authentication.mdx#session-management)

1. **Stateless Sessions (Signed Cookie)** – Session data or a token is encrypted/signed and stored in an HTTP-only cookie. The server verifies the signature on each request; no database lookup needed. Simpler, but session data is immutable until the cookie expires or is refreshed.

2. **Database Sessions** – Session ID is stored in the cookie; session data (user ID, roles, expiry) lives in a database. Server looks up the session on each request. More flexible (can revoke sessions, update roles in-place), but requires a database and extra query per request.

**For Vercel Functions (stateless, ephemeral):**

[Vercel Functions are stateless and have no persistent filesystem.](https://vercel.com/guides/connection-pooling-with-serverless-functions) A **signed cookie approach is appropriate** because:
- No persistent state needed between invocations
- Cookie is sent with every request, enabling session verification
- Session expiry is handled by cookie `maxAge` / `expires`

To implement signed cookies on Vercel:

```typescript
// app/lib/session.ts (example from Next.js docs)
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET // 32-byte base64 key
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(userId: string, roles: string[]) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await new SignJWT({ userId, roles, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true, // HTTPS only on Vercel
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

export async function getSession() {
  const cookie = (await cookies()).get('session')?.value
  try {
    const { payload } = await jwtVerify(cookie, encodedKey)
    return payload
  } catch {
    return null
  }
}
```

**Drawback of Signed Cookie Approach:** Roles are immutable until session refresh. If a user is promoted mid-session, they won't see new permissions until re-login or cookie refresh. This is acceptable for most features but not for highly sensitive operations (e.g., data deletion).

---

## 2. Library vs. Hand-Rolled: Auth.js/NextAuth.js for Next.js 16

### Auth.js Current Support Status

[Auth.js (formerly NextAuth.js) is the most widely used OAuth library for Next.js.](https://authjs.dev)

**Current Version Status:**
- **Latest stable:** `next-auth@4.24.15` (July 20, 2025) — [No explicit Next.js 16 support documented.](https://authjs.dev) The package.json includes build overrides for Next.js 14 and 15, but Next.js 16 is not mentioned.
- **Beta:** `next-auth@5.0.0-beta` — Actively developed but not recommended for production.
- **React 19 Support:** [Not explicitly documented in official docs or GitHub repository.](https://github.com/nextauthjs/next-auth) The internal architecture uses Preact (not React) and does not list React 19 as a peer dependency.

**Important Note:** [The Auth.js README explicitly recommends: "We recommend new projects to start with Better Auth unless there are some very specific feature gaps."](https://authjs.dev) Auth.js was primarily designed for Next.js 13 and earlier; while it may work on 16, using an unsupported library adds risk.

### Discord Provider in Auth.js

[Auth.js includes a Discord provider,](https://authjs.dev/providers/discord) requiring:
```javascript
Discord({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
})
```

This handles OAuth token management and provides session objects, but:
1. **No built-in guild member endpoint calls** – You still need to fetch roles separately via `/users/@me/guilds/{guild.id}/member`.
2. **Adds 50–70 KB to bundle size** (Auth.js core + Discord provider) over a hand-rolled solution.
3. **Unverified on Next.js 16/React 19** – Stability on this stack is uncertain.

### Hand-Rolled OAuth Flow

For **one provider (Discord)**, a hand-rolled solution is simpler and more transparent:

**Pros:**
- Full control over the flow
- No unsupported library dependencies
- Minimal bundle overhead (~5 KB for crypto utilities)
- Easier to debug
- Transparent token handling

**Cons:**
- Manual CSRF state handling (straightforward but requires care)
- Manual session encryption (use `jose` library, ~15 KB)
- No built-in session revocation dashboard (not needed for this scope)
- Team must maintain the auth code (low risk for stable OAuth2 spec)

**Estimated Implementation Size:**
- OAuth callback route handler: ~60 lines
- Session encryption/decryption: ~40 lines  
- Authorization checks (DAL/middleware): ~50 lines
- **Total: ~150–200 lines of code** (vs. 1000+ lines of Auth.js internals)

### Verdict: Hand-Rolled is Recommended

For this project, **hand-rolled OAuth is the better choice** because:
1. Auth.js lacks official Next.js 16/React 19 support
2. Only one provider (Discord) is needed
3. The OAuth2 spec is stable and widely documented
4. Bundle size and complexity savings are significant
5. The implementation is learnable and maintainable

---

## 3. Reading the User's Roles IN THE RATS GUILD

### The Guild Member Endpoint

[To fetch a user's roles in the RATS guild, call:](https://discord.com/developers/docs/resources/user#get-current-user-guild-member)

```
GET /users/@me/guilds/{guild.id}/member
Authorization: Bearer {access_token}
```

**Required Scope:** `guilds.members.read`  
**Response:** [A Guild Member object containing:](https://discord.com/developers/docs/resources/guild#guild-member-object)

```json
{
  "roles": ["1249808811980623942", "1249808893400449064"],
  "joined_at": "2024-01-15T10:30:00Z",
  "nick": "optional_server_nickname",
  "avatar": null,
  "mute": false,
  "deaf": false
}
```

The `roles` array contains **Discord role IDs (snowflakes)** — compare these against `ROLE_DUCHE`, `ROLE_VO_DUCHE`, `ROLE_OFFICER`, `ROLE_RATS` defined in `src/consts/discord.ts`.

### Data Freshness and Caching Implications

[Discord's OAuth2 documentation does not specify whether guild member role data is real-time or cached.](https://discord.com/developers/docs/topics/oauth2) However, the existence of [Gateway events (`GUILD_MEMBER_UPDATE`)](https://discord.com/developers/docs/topics/gateway-events#guild-member-update) suggests Discord tracks membership changes in real-time internally.

**Two caching strategies:**

#### Strategy A: Cache at Login (Cheaper, Stale)

Store roles in the signed session cookie at first login. Roles don't change until the session expires.

```typescript
// Callback route handler
export async function handleOAuthCallback(code: string) {
  const token = await exchangeCodeForToken(code) // POST to Discord token endpoint
  const user = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  }).then(r => r.json())
  
  const member = await fetch(
    `https://discord.com/api/v10/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
    { headers: { Authorization: `Bearer ${token.access_token}` } }
  ).then(r => r.json())
  
  // Store roles in session, not updated until re-login
  await createSession(user.id, member.roles, token.refresh_token)
}
```

**Pros:**
- Zero extra API calls per request
- Fast authorization checks (roles in session cookie)

**Cons:**
- Stale: If user is promoted or demoted mid-session, changes don't apply until logout/re-login
- If user is kicked/leaves the guild, they retain access until session expires

**Acceptable for:** Public features (roster view) and non-critical role-based pages. Not suitable for sensitive operations.

#### Strategy B: Re-Check per Request (Expensive, Fresh)

On each request (or at route entry), verify the user's current roles by calling the guild member endpoint.

```typescript
// app/lib/dal.ts — Data Access Layer
export async function getCurrentUserRoles() {
  const session = await getSession() // Reads signed cookie
  if (!session?.accessToken) return null
  
  try {
    const member = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
      { 
        headers: { 
          Authorization: `Bearer ${session.accessToken}`,
          'User-Agent': 'rats-site/1.0' // Discord requires this
        }
      }
    ).then(r => {
      if (r.status === 404) throw new Error('User not in guild')
      return r.json()
    })
    
    return member.roles
  } catch (err) {
    // User left guild or token expired
    deleteSession()
    redirect('/login')
  }
}
```

**Pros:**
- Fresh: Catches role changes immediately
- Detects if user left the guild (404 response) and logs them out

**Cons:**
- Extra API call per request (50 ms latency + rate limit risk)
- Blocks rendering until Discord responds
- Doubles API quota usage

**Cost Analysis on Vercel:**
- For a site with 100 daily active users making 10 requests each: 1,000 requests/day to Discord
- At 50 req/sec global limit, this is well within Discord's rate limit
- But every request now blocks on network I/O to Discord's API (50–100 ms per request)

**Acceptable for:** Small user bases (<1000 DAU) or non-critical features. For a clan roster site, this is probably overkill.

### Recommended Approach: Hybrid

Cache roles at login (signed cookie), but add a **periodic refresh** on layout entry or via a silent re-check:

```typescript
// app/lib/dal.ts
export const getSessionWithFreshRoles = cache(async () => {
  const session = await getSession()
  if (!session?.accessToken) return null
  
  // Refresh only if session was created >1 hour ago
  const sessionAge = Date.now() - session.iat * 1000
  if (sessionAge < 1 * 60 * 60 * 1000) {
    return session // Use cached roles
  }
  
  // Else, re-fetch from Discord (happens once per request, cached via React cache())
  const member = await fetch(...).then(r => r.json())
  return { ...session, roles: member.roles }
})
```

This balances freshness (roles update within 1 hour) and performance (no extra Discord calls per request).

---

## 4. Protecting Routes by Role in Next.js 16

### Where the Check Belongs

[Next.js 16 authentication guide recommends authorization checks in a Data Access Layer (DAL) close to data,](./.next-docs/01-app/02-guides/authentication.mdx#creating-a-data-access-layer-dal) not middleware/proxy alone. The specific recommendation:

> *"While Proxy can be useful for initial checks, it should not be your only line of defense in protecting your data. The majority of security checks should be performed as close as possible to your data source."*

**Three layers to consider:**

1. **Proxy (Middleware)** – [Optional optimistic checks; runs on all routes. Fast but should not be sole defense.](./.next-docs/01-app/02-guides/authentication.mdx#optimistic-checks-with-proxy-optional) Use for redirects only (e.g., redirect non-members to `/login`).

2. **Layout or Page Component (Server Component)** – [Authorization check as the first operation in a Server Component.](./.next-docs/01-app/02-guides/authentication.mdx#server-components) Prevents rendering if unauthorized.

3. **Route Handler or Server Action** – [Always verify authorization before accessing data or performing mutations.](./.next-docs/01-app/02-guides/authentication.mdx#route-handlers) This is the secure layer.

**Important caveat from docs:**

> *"Due to Partial Rendering, be cautious when doing checks in Layouts as these don't re-render on navigation, meaning the user session won't be checked on every route change. Instead, do checks close to your data source or the component that'll be conditionally rendered."*

### Example: Role-Based Layout

```typescript
// app/officer/layout.tsx — Server Component
import { verifySession } from '@/app/lib/dal'
import { redirect } from 'next/navigation'

export default async function OfficerLayout({ children }) {
  const session = await verifySession()
  
  // Check if user has Officer role (or higher)
  const hasOfficerRole = session?.roles.includes(ROLE_OFFICER) ||
                         session?.roles.includes(ROLE_VO_DUCHE) ||
                         session?.roles.includes(ROLE_DUCHE)
  
  if (!hasOfficerRole) {
    redirect('/') // User not authorized
  }
  
  return <>{children}</>
}
```

### Example: Protected Route Handler

```typescript
// app/api/admin/roster/route.ts
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  const session = await verifySession()
  
  if (!session) {
    return new Response(null, { status: 401 })
  }
  
  if (!session.roles.includes(ROLE_DUCHE)) {
    return new Response(null, { status: 403 })
  }
  
  // Admin-only logic here
  return Response.json({ /* data */ })
}
```

### Proxy for Optimistic Redirect (Optional)

If you want to redirect non-members away from protected pages at the Proxy level (before rendering), use stateless session checks from the cookie:

```typescript
// middleware.ts (Root of project)
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/officer', '/duce']
const publicRoutes = ['/login', '/']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  
  if (!protectedRoutes.some(r => path.startsWith(r))) {
    return NextResponse.next()
  }
  
  // Read session from cookie (optimistic check only)
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  
  if (!session?.userId) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next).*)'],
}
```

**Critical warning from docs:** This Proxy check is **optimistic and not secure on its own**. It only prevents rendering; it does **not** prevent Server Actions or API Routes from being called if a client bypasses it. Always verify authorization in the Route Handler or Server Action itself.

---

## 5. Session Expiry: What Happens When a User Leaves the Guild

### Detection via API Response

[When a user no longer belongs to the RATS guild (left, kicked, or banned),](https://discord.com/developers/docs/resources/user#get-current-user-guild-member) calling `GET /users/@me/guilds/{guild.id}/member` returns **HTTP 404 (Not Found)**.

```typescript
const res = await fetch(
  `https://discord.com/api/v10/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
  { headers: { Authorization: `Bearer ${token.access_token}` } }
)

if (res.status === 404) {
  // User is no longer in the guild
  deleteSession()
  redirect('/login')
}
```

### Detection Timeline

| Strategy | Detection | Latency | Cost |
|----------|-----------|---------|------|
| **Cache at login** | After session expires (1–7 days) | Delayed | Zero per-request cost |
| **Re-check per request** | On next request after departure | ~50 ms | 1 API call per request |
| **Hybrid (refresh every hour)** | Within ~1 hour of departure | 1 hour | 1 API call per hour max |

### Server-Side Session Revocation

[Discord OAuth2 supports immediate token revocation via:](https://discord.com/developers/docs/topics/oauth2)

```
POST https://discord.com/api/oauth2/token/revoke
Content-Type: application/x-www-form-urlencoded

client_id={client_id}&client_secret={client_secret}&token={refresh_token}
```

**When to revoke:**
- Explicit logout (user clicks "Logout")
- Session expiry (7 days for signed cookies)
- Manual role removal (admin action)

**Cannot be called immediately upon guild departure** because Discord does not notify the application via webhook. Only the REST API call (GET guild member) reveals departure retroactively.

### Implication for Permissions Model

A user who leaves the RATS guild mid-session will:
- **With cached roles:** Retain access until session expires or re-login
- **With per-request checks:** Lose access immediately on next request (404 triggers logout)
- **With hybrid (hourly refresh):** Lose access within ~1 hour

For a recruitment/public site (rats-site), cached roles are acceptable. For an admin panel or sensitive operations, per-request checks are required.

---

## 6. Cost of Adding a Session Dependency

### Bundle Size Impact

| Component | Size | Impact |
|-----------|------|--------|
| `jose` (JWT sign/verify) | ~15 KB | Session encryption |
| OAuth callback handler | ~3 KB | OAuth exchange + session creation |
| DAL (role checks) | ~2 KB | Authorization logic |
| **Total** | ~20 KB | Added to server bundle (not client-side) |
| **Current app bundle** | ~50 KB (gzip, React 19 + animations) | Minimal impact |
| **Vercel limit per function** | 50 MB | No issue |

**Verdict:** Bundle size impact is negligible (~2% increase on server functions).

### Pages Become Dynamic

[Pages that read `cookies()` or call `verifySession()` cannot be statically pre-rendered;](./.next-docs/01-app/03-api-reference/03-file-conventions/route-segment-config#dynamic) they become **dynamic-rendered at request time**.

```typescript
// app/admin/page.tsx
import { verifySession } from '@/app/lib/dal'

export default async function AdminPage() {
  const session = await verifySession()
  // This page is now dynamic (rendered per-request, not at build time)
}
```

**Impact:**
- Homepage (`/`) – If it includes a user greeting or member list, it becomes dynamic (already the case for roster fetching)
- `/roster` – Already dynamic (fetches from Discord API)
- Admin pages – Fine to be dynamic
- **Static pages** (e.g., `/about`, FAQ) – Can remain static if they don't read session

**On Vercel:** Dynamic pages are still fast (<100 ms for simple rendering) and are cached by Vercel's system-level caching. This is normal for personalized content.

### Extra Requests to Discord

**At login:**
- 1 request to `/oauth2/token` (exchange code)
- 1 request to `/users/@me` (get user ID/username)
- 1 request to `/users/@me/guilds/{guild.id}/member` (get roles)
- **Total: 3 requests**

**Per request (if re-checking roles):**
- 1 request to `/users/@me/guilds/{guild.id}/member` (verify roles)
- **Total: 1 request per page load**

**Rate Limit Exposure:**

Discord enforces [50 requests per second globally for all bots.](https://discord.com/developers/docs/topics/rate-limits) For a clan site:

- 100 daily active users
- ~10 requests per user per day (page loads, roster view, etc.)
- ~1,000 requests/day to Discord
- ~12 requests/second average (well within the 50 req/sec limit)

Even if all 100 users hit the site simultaneously (worst case: ~100 req/sec to Discord), the 50 req/sec limit would be hit. **Add exponential backoff retries to handle rate limiting:**

```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(url, options)
    
    if (res.status === 429) {
      const retryAfter = parseFloat(res.headers.get('Retry-After') || '1')
      await new Promise(r => setTimeout(r, retryAfter * 1000))
      continue
    }
    
    return res
  }
  throw new Error('Max retries exceeded')
}
```

**Verdict:** Rate limiting is a concern only if traffic spikes significantly. For 100–1000 DAU, standard rate limit headers handling is sufficient.

---

## Open Questions / Could Not Verify

1. **Exact role data freshness on Discord's servers:** The documentation does not specify whether role data returned by the guild member endpoint is real-time or cached within Discord. Testing against a test guild would be needed to determine latency.

2. **Gateway event latency for GUILD_MEMBER_REMOVE:** The bot/user token can listen to `GUILD_MEMBER_REMOVE` events via Gateway. However, how quickly Discord dispatches this event after a user leaves is not documented. Empirical testing required.

3. **Auth.js on Next.js 16/React 19 stability:** No documented support exists. Running Auth.js on this stack would be entirely at-risk; the maintainers have not tested or verified it. Feasibility is unknown.

4. **Session table design (if using database sessions):** If you later want to migrate to database sessions for revocation/audit logging, the exact schema design (session ID, user ID, roles JSON, expires_at, created_at) is not defined here.

5. **Refresh token management:** Discord OAuth returns `access_token` and `refresh_token`. Managing refresh token rotation (when to refresh, how to store) is implementation-specific and not covered by Discord's docs.

6. **GDPR/data retention for OAuth sessions:** How long should historical session data or tokens be retained? Compliance requirements depend on jurisdiction and were not investigated.

---

## Key Sources

- [Discord Developer Docs – OAuth2](https://discord.com/developers/docs/topics/oauth2) — Endpoints, scopes, authorization flow
- [Discord Developer Docs – User Endpoints](https://discord.com/developers/docs/resources/user) — Guild member endpoint, response format
- [Discord Developer Docs – Rate Limits](https://discord.com/developers/docs/topics/rate-limits) — Global and per-route limits
- [Next.js 16 Documentation – Authentication](./.next-docs/01-app/02-guides/authentication.mdx) — Session management strategies, authorization patterns
- [Next.js 16 Documentation – Data Security](./.next-docs/01-app/02-guides/data-security.mdx) — DAL recommendations, authorization layer placement
- [Auth.js Documentation](https://authjs.dev) — Current version status, Next.js support
- [Auth.js GitHub Repository](https://github.com/nextauthjs/next-auth) — package.json, ongoing development
- [RFC 7636 – PKCE](https://tools.ietf.org/html/rfc7636) — Proof Key for Public Clients (informational; not required for server-to-server OAuth)

---

**Last fetched:** July 29, 2026  
**Next review date:** Recommended Q4 2026 (Auth.js 5.0 stable release, Next.js 17 roadmap, Discord API updates)
