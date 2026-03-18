# workflow:build

> Execute the current PLAN.md. The primary execution command for Scratch mode.

**Usage:**
- `/workflow:build` — execute current `.workflow/PLAN.md`
- `/workflow:build --dry-run` — show what would be executed without running

**When to use:**
- After `/workflow:plan` produces a plan you've approved
- In Scratch mode (no GitHub issue needed)
- When you want to execute a plan without creating an issue

**Mode behaviour:**
- **Scratch mode:** No branch required, no issue required, no PR required (optional)
- **Issues mode:** Requires an issue number — use `/workflow:issue <N>` instead
- **Legacy mode:** Use `/workflow:migrate <phase>` instead

**What it does:**
1. Reads `CLAUDE.md` to confirm `workflow_mode: scratch`
2. Reads `.workflow/PLAN.md` — fails if empty or missing
3. Reads all rules layers (base + project + relevant features)
4. Presents plan summary with estimates for final confirmation
5. Executes tasks in order using the assigned agents
6. Runs quality gates after each checkpoint (lint + tests + coverage)
7. If task overruns by 50%: surfaces warning, asks to continue/pause/split
8. After all tasks complete: runs final quality gate
9. Invokes `/workflow:commit` for conventional commit
10. Optionally: AskUserQuestion "Create PR?" → Yes | No

**Quality gates (same as Issues mode — never skipped):**
- Lint must pass
- Tests must pass
- Coverage thresholds enforced
- No uncommitted broken code

**On completion:**
- PLAN.md archived to `.workflow/features/YYYY-MM-DD-[slug].md`
- PLAN.md cleared
- Commit created with conventional format

**Related:**
- `/workflow:plan` — create the plan first
- `/workflow:commit` — commit only, no build
- `/workflow:gate` — run quality checks only
- `/workflow:pr` — create PR after build

Invoke `master-orchestrator` in scratch mode:
> "Run in scratch/build mode. Read CLAUDE.md and verify workflow_mode. If 'issues', redirect user to /workflow:issue instead. Read .workflow/PLAN.md — if empty, tell user to run /workflow:plan first. Load rules layers. Show plan summary with estimates and ask for confirmation. Execute tasks using assigned agents. Run quality gates at each checkpoint. Handle overruns with warning. On completion, commit and ask about PR. Archive PLAN.md."
