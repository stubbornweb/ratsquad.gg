# Architecture Decision Records

> ADRs are permanent records of significant architecture decisions.
> Written by `architecture-recorder` via `/arch:decide`.
> Never delete an ADR — supersede it with a new one instead.

---

## What Goes Here

Every significant architectural decision that will affect how the codebase
is structured, which patterns to use, or which approaches to avoid.

**Good ADR candidates:**
- Choosing between two architectural patterns (service layer vs CQRS)
- Selecting a package for a cross-cutting concern (auth, queues, storage)
- Defining domain boundaries in a larger application
- Making a backward-incompatible pattern change

**Not ADR candidates:**
- Routine feature implementation decisions
- Bug fix approaches
- Minor refactors

---

## Naming Convention

```
NNN-short-descriptive-title.md
```

Examples:
```
001-use-sanctum-for-api-auth.md
002-service-layer-pattern.md
003-multi-tenancy-shared-database.md
```

---

## Status Values

- **Proposed** — under discussion
- **Accepted** — decided and active
- **Deprecated** — still in place but being phased out
- **Superseded by ADR-NNN** — replaced by a newer decision

---

## How Decisions Flow Into Rules

After `/arch:decide`:
1. ADR is written here
2. `.claude/rules/project/architecture.md` is updated with the actionable rule
3. Claude sees the rule in every session via `active-rules.md`

The ADR is the "why". The rule is the "what to do about it".
