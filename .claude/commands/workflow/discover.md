# workflow:discover

> Onboard an existing project into tuti-kit. Detects stack, audits health,
> writes CLAUDE.md, installs agents, and sets up for Legacy or Issues mode.

**Usage:**
- `/workflow:discover` — analyse current directory
- `/workflow:discover <path>` — analyse a specific path or file

**When to use:**
- Adding tuti-kit to an existing project that was built without it
- Taking over a legacy codebase
- Auditing a project before migrating to a new architecture

**What it does:**
1. Invokes `project-analyst` in discover mode
2. Auto-detects: stack, test runner, quality commands, git provider, owner/repo
3. Confirms detected values with user before writing anything
4. Writes complete `CLAUDE.md` config block
5. Creates `.claude/rules/project/stack.md` from detected packages/versions
6. Installs stack agents via agent-installer
7. Sets `workflow_mode: legacy` (discover always implies legacy start)
8. Runs `codebase-auditor` → writes `.workflow/AUDIT.md`
9. Runs `tech-debt-mapper` → writes `.workflow/TECH-DEBT.md`
10. AskUserQuestion: "Create GitHub issues from tech debt findings?"
    → Yes: invokes `issue-creator` in batch mode for each TECH-DEBT item
    → No: leave TECH-DEBT.md for manual review
11. Runs `/workflow:sync` to build `active-rules.md`
12. Prints discovery summary

**After discover:**
```
→ /rules:add project   — add your conventions based on what you found
→ /workflow:audit      — re-run deeper audit at any time
→ /workflow:mode set issues  — when ready to work from GitHub issues
→ /workflow:plan       — plan the first migration phase
```

**Related:**
- `/workflow:init` — for new projects (no existing code)
- `/workflow:audit` — run audit only, without full discovery setup
- `/workflow:mode set` — change mode after discovery

Invoke `project-analyst` in discover mode, then `codebase-auditor`, then `tech-debt-mapper`:
> "Run in /workflow:discover mode. Auto-detect stack from files in '$ARGUMENTS' (or current directory if no argument). Confirm detected values with user. Write CLAUDE.md. Create project rules starter files. Install stack agents. Set workflow_mode to legacy. Run codebase-auditor to produce AUDIT.md. Run tech-debt-mapper to produce TECH-DEBT.md. Ask user if they want to create GitHub issues from tech debt. Run /workflow:sync. Print discovery summary."
