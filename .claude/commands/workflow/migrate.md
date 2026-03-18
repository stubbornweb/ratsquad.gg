# workflow:migrate

> Execute a specific migration phase from the current migration plan. Legacy mode.

**Usage:**
- `/workflow:migrate <phase>` — execute phase N (e.g. `/workflow:migrate 1`)
- `/workflow:migrate <phase> --dry-run` — preview phase plan without executing
- `/workflow:migrate list` — list all phases and their status

**When to use:**
- After `/workflow:discover` has set up a legacy project
- After `/workflow:plan` has created a multi-phase migration plan
- When executing one isolated phase of a larger migration

**Why phases matter:**
Each phase is a separate branch + PR. If phase 2 breaks something, you can revert it without touching phase 1 or 3. Never merge multiple phases into one PR — it makes rollback impossible.

**What it does:**
1. Reads CLAUDE.md → confirms `workflow_mode: legacy`
2. Reads `.workflow/PLAN.md` → finds phase N details + estimates
3. Confirms phase scope with user (what will change, estimate)
4. Creates branch: `migration/phase-N-slug`
5. Executes phase tasks using `migration-planner` + stack specialist
6. Backward compatibility check after each task
7. Runs quality gate
8. Commits + creates PR labelled `workflow:modernize`
9. After PR merge: marks phase as complete in PLAN.md

**Phase safety rules:**
- Never modify the same file in two different phases (plan them in sequence)
- Every phase must leave the application in a working state
- Backward-compatible changes only within a phase (breaking changes = new major phase)
- Phase branch is deleted after merge

**list subcommand output:**
```
Migration Phases

Phase 1: Extract UserService from UserController    ✅ Complete (PR #42)
Phase 2: Add repository layer for User model        🔄 In progress (branch: migration/phase-2-user-repo)
Phase 3: Replace direct DB calls in OrderService    ⏳ Ready
Phase 4: Add missing test coverage to User domain   ⏳ Ready
Phase 5: Upgrade Laravel from 9 to 11              ⏸ Blocked by Phase 4
```

**Related:**
- `/workflow:discover` — set up legacy project first
- `/workflow:audit --legacy` — re-audit before planning phases
- `/workflow:plan` — plan the migration phases

Invoke `migration-planner` then `master-orchestrator` in legacy mode:
> "Run /workflow:migrate $ARGUMENTS. Read CLAUDE.md: verify workflow_mode is 'legacy'. IF argument is 'list': read PLAN.md and show all phases with status. ELSE: read phase N from PLAN.md, show scope + estimate, ask for confirmation. Create branch migration/phase-N-slug. Execute phase tasks using migration-planner guidance + stack specialists. Run quality gate. Check backward compatibility. Commit + create PR. After merge: update phase status in PLAN.md."
