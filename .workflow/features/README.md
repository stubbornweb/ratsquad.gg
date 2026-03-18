# Feature Archive

> Completed feature plans are archived here by `issue-closer` after every pipeline run.
> Used by `skill-evolver` to learn from past implementations.
> Never edit these files — they are historical records.

---

## Naming Convention

```
YYYY-MM-DD-feature-slug.md
```

Examples:
```
2026-03-14-user-authentication.md
2026-03-20-payment-webhook-handler.md
2026-04-01-admin-dashboard-phase-1.md
```

---

## What Each File Contains

Each archived file is the original `PLAN.md` with two additions:

**Header:**
```markdown
# Archived: [Feature Title]
Issue: #N  |  PR: #N  |  Date: YYYY-MM-DD
```

**Footer:**
```markdown
## Outcome
[Summary: what shipped vs what was originally planned, any deviations, time accuracy]
```

---

## How skill-evolver Uses This

During `/workflow:evolve`, skill-evolver reads these files to:
- Compare planned vs actual estimates (improve future estimates)
- Find patterns in what was consistently under/over-estimated
- Identify recurring task types that need better tooling

---

## Active Features

Active (in-progress) feature tracking files follow the naming `feature-N.md`
where N is the GitHub issue number. These are created by `feature-planner`
and cleaned up by `issue-closer` after archiving.
