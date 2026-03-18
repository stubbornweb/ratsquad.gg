# workflow:plan

> Plan a feature with task breakdown and AI-assisted time estimates.
> Works in all three workflow modes.

**Usage:**
- `/workflow:plan` — plan from current context or description
- `/workflow:plan --plan-only` — create plan, do not execute
- `/workflow:plan --issue <N>` — plan from existing GitHub issue

**When to use:**
- Before any significant feature work
- Before switching to `/workflow:build` (scratch mode)
- Before `/workflow:issue` when you want to preview the plan first
- When you need an estimate for planning purposes

**What it does:**
1. Reads CLAUDE.md + loads all rule layers
2. Reads relevant ADRs for architecture constraints
3. Asks what you want to build (or reads from issue/context)
4. Creates structured task breakdown with estimates
5. Shows plan for approval: total time, phases, tasks
6. If approved → writes `.workflow/PLAN.md`
7. In issues mode: also writes `.workflow/features/feature-N.md`
8. Presents plan, waits for approval

**Estimate format you'll see:**
```
📋 Plan ready: [Feature Name]

Tasks: N across N phases
Estimate: ~Xh (generation: ~Xmin · fix cycles: ~Xmin · review: ~10min · buffer: ~Xmin)

[task list with per-task estimates]

Proceed? → Approve | Edit | Cancel
```

**Plan-only mode:** Stops after writing PLAN.md — no execution. Use when estimating work or creating issues for later.

**Related:**
- `/workflow:build` — execute after planning (scratch mode)
- `/workflow:issue <N>` — execute a planned issue (issues mode)
- `/workflow:create-issue` — turn PLAN.md into a GitHub issue

Invoke `feature-planner` then `task-decomposer`:
> "Run /workflow:plan. Read CLAUDE.md and load all rules layers. Read relevant ADRs. IF --issue N: fetch issue #N from GitHub via PROVIDER.md and plan from its acceptance criteria. ELSE: ask the user what they want to build. Invoke feature-planner to create the task breakdown with AI-assisted estimates. Invoke task-decomposer to refine tasks to atomic units. Present plan summary for approval. IF --plan-only OR user cancels: stop here. IF approved: write .workflow/PLAN.md. In issues mode also write .workflow/features/feature-N.md."
