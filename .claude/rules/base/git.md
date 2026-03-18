# Git Rules

> Base layer — commit, branch, and PR rules for all projects.

---

## Conventional Commits

Every commit message must follow this format exactly:

```
<type>(<scope>): <subject> (#N)

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructure — no behaviour change |
| `test` | Adding or updating tests |
| `chore` | Maintenance, dependencies, build config |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration |

### Rules
- Subject line: max 72 characters
- Subject: imperative mood — "add user auth" not "added user auth"
- Issue reference `(#N)` is required when working in Issues mode
- Issue reference is optional in Scratch mode

### Examples

```
feat(auth): add sanctum token authentication (#42)
fix(webhook): handle duplicate event delivery (#87)
refactor(user): extract password reset into dedicated service (#91)
test(payment): add coverage for failed charge scenarios (#103)
docs(readme): update local development setup instructions
chore(deps): update laravel framework to 11.x
```

---

## Branch Naming

| Work Type | Pattern | Example |
|-----------|---------|---------|
| Feature | `feature/<N>-short-slug` | `feature/42-user-auth` |
| Bug fix | `fix/<N>-short-slug` | `fix/87-duplicate-webhook` |
| Refactor | `refactor/<N>-short-slug` | `refactor/91-password-reset` |
| Chore | `chore/<N>-short-slug` | `chore/55-update-deps` |
| Hotfix | `hotfix/<N>-short-slug` | `hotfix/99-payment-crash` |

### Rules
- Always branch from `main` (or `master`) — never branch from another feature branch
- Always pull latest before creating a branch
- Slugs are lowercase, hyphen-separated, max 40 chars
- Issue number is required in Issues mode, optional in Scratch

---

## Pull Requests

### Before Creating a PR
- All tests must pass locally
- All quality gates must pass (lint, types, coverage)
- No debug code, `dd()`, `console.log()`, `var_dump()` left in
- Self-reviewed the full diff

### PR Description Must Include
- What was changed and why
- Link to the GitHub issue (`Closes #N` or `Relates to #N`)
- Testing notes — how to verify the change works
- Screenshots if UI changed

### PR Rules
- **Always** create as draft first, then mark ready
- **Never** force-push to a branch with an open PR
- **Never** merge your own PR — wait for review in team projects
- Squash merge to keep main history clean (one commit per feature)

---

## What Must Never Be Committed

```gitignore
.env
.env.*
*.key
storage/logs/
node_modules/
vendor/
*.local
.DS_Store
```

Run `/workflow:gate` before every commit — it catches these automatically.

---

## Commit Checkpoints

When working on a feature with multiple tasks:
- Commit every 3-5 completed tasks — never accumulate a huge uncommitted diff
- Each checkpoint commit should pass all quality gates on its own
- Use `WIP:` prefix only if committing broken state intentionally (rare)

---

## Squash Policy

- Feature branches: squash on merge to keep main clean
- Hotfixes: squash on merge
- Release branches: merge commit (preserves history)
