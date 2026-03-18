# workflow:issue

> Execute a GitHub issue through the full pipeline.
> Issues mode only.

**Usage:**
- `/workflow:issue <N>` — full pipeline for issue #N
- `/workflow:issue <N> --dry-run` — show plan without executing
- `/workflow:issue <N> --worktree` — execute in isolated git worktree
- `/workflow:issue <N> --quick` — skip review stage, minimal overhead

**When to use:**
- Any time you have a GitHub issue ready to implement
- `status:ready` issues in your backlog
- After `/workflow:create-issue` produces an issue

**Pre-requisites:**
- `workflow_mode: issues` in CLAUDE.md (run `/workflow:mode set issues` first)
- Issue must have: workflow label, priority label, status:ready, body sections
- GitHub auth: `gh auth status`

**What happens:**
1. `issue-executor` fetches + validates + auto-labels the issue
2. Rules layers loaded, patches loaded selectively, ADRs consulted
3. `master-orchestrator` forms agent squad from stack + issue keywords
4. Plan with estimates presented → you approve
5. Branch created: `feature/N-slug` or `fix/N-slug`
6. Code implemented by specialist squad
7. REVIEW + QUALITY run in parallel
8. Commit with conventional message + issue reference
9. Draft PR created → marked ready
10. After merge: `issue-closer` posts summary + closes + archives PLAN.md

**Agent squad auto-selection:**

| Stack | Base squad | Added by keywords |
|-------|-----------|------------------|
| laravel | laravel-specialist, php-pro | docker-expert, security-auditor, db-admin |
| wordpress | wp-specialist, php-pro | db-admin |
| vue/nuxt | vue-specialist | performance-engineer |
| react/next | react-specialist | performance-engineer |

**--dry-run mode:** Fetches issue, forms squad, shows full implementation plan with estimates — does not execute. Use to preview before committing.

**--worktree mode:** Creates isolated git worktree at `.claude/worktrees/N-slug/`. Lets you work on multiple issues simultaneously without branch conflicts.

**--quick mode:** Skips the REVIEW stage (no code-reviewer agent). Quality gates still run. Use for low-risk tasks.

**Related:**
- `/workflow:plan` — plan without a GitHub issue (scratch mode)
- `/workflow:bugfix <N>` — bug-specific pipeline with patch writing
- `/workflow:feature` — plan + create issue + execute in one flow

Invoke `issue-executor` then `master-orchestrator`:
> "Execute issue #$ARGUMENTS. Read CLAUDE.md: verify workflow_mode is 'issues', extract repo_owner, repo_name. Read PROVIDER.md. Check for --dry-run, --worktree, --quick flags. Invoke issue-executor to fetch, validate, auto-label, and enrich context. Then invoke master-orchestrator for full pipeline execution. IF --dry-run: present plan with estimates, stop before implementation. IF --worktree: create isolated worktree. IF --quick: skip REVIEW stage. After PR merge: invoke issue-closer."
