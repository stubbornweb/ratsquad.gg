# Feature Rules

> Subsystem-specific rules. Highest priority — override base and project layers.

---

## When to Add a Feature Rule File

Add a file here when a subsystem has specific rules that should override
general conventions. Rules here are only loaded when Claude is working on
that subsystem.

**Good candidates:**
- `auth.md` — authentication-specific patterns, token handling, guard names
- `payments.md` — Stripe specifics, idempotency requirements, error handling
- `notifications.md` — channel preferences, template locations, rate limits
- `api.md` — response format specifics, versioning patterns, rate limiting
- `admin.md` — Filament/admin-specific patterns

**How to add:**
```bash
# Quick add mid-session
/rules:add features/auth "Only use sanctum guards — never session auth on API routes"

# Edit a feature rule file
/rules:edit features/auth

# Create from scratch
/rules:add features/payments "Always pass idempotency_key when charging — generate UUID v4 in caller"
```

**After adding: always sync**
```bash
/workflow:sync
```

---

## Priority

Feature rules override everything:

```
features/auth.md       ← wins on conflict
    ↑ overrides
project/conventions.md
    ↑ overrides
base/coding-standards.md  ← baseline
```

---

## Loading Strategy

Claude loads feature rule files **selectively** — only when the current task
is related to that subsystem. This keeps context lean.

`master-orchestrator` identifies relevant feature rules from:
- Issue title and body keywords
- Task description
- Files being modified

You can also explicitly load a feature rule in a session:
```
"Load the auth feature rules before we start"
```

---

## Example Feature Rule Files

### auth.md
```markdown
# Auth Rules

- ONLY use Laravel Sanctum — never raw session auth on API routes
- ALL auth routes must use ['auth:sanctum', 'verified'] middleware
- Token expiry: 24h for user tokens, 1h for API tokens
- NEVER return the plain token in a response — return hashed reference only
- Failed login attempts: rate limit to 5/min per IP via throttle middleware
```

### payments.md
```markdown
# Payment Rules

- ALWAYS pass idempotency_key to Stripe — generate UUID v4 in the caller
- NEVER store raw card data — always use Stripe payment methods
- ALL payment failures must be logged with full Stripe error object
- Webhook signature verification is mandatory — NEVER skip it
- Refunds go through RefundService — never call Stripe API directly from controllers
```
