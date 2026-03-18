# workflow:create-issue

> Create a GitHub issue from a workflow artifact: PLAN.md, ADR, patch, or tech debt item.

**Usage:**
- `/workflow:create-issue` — create issue from current PLAN.md
- `/workflow:create-issue --adr <N>` — create from ADR-N
- `/workflow:create-issue --patch <slug>` — create from patch file
- `/workflow:create-issue --debt` — batch create from all open TECH-DEBT.md items
- `/workflow:create-issue --execute` — create issue AND immediately execute it

**When to use:**
- After `/workflow:plan` to push the plan to GitHub for tracking
- After `/arch:decide` creates an ADR that needs implementing (auto-called)
- After `/workflow:audit` to push debt items to GitHub (auto-asked)
- When graduating from scratch mode: push existing plans to issues

**What it does:**
1. Reads CLAUDE.md → `repo_owner`, `repo_name`
2. Reads PROVIDER.md → `create_issue` command
3. Reads source artifact (PLAN.md / ADR / patch / TECH-DEBT.md)
4. Formats issue body using standard template (includes time estimate)
5. Assigns correct labels (workflow type + priority + status:ready)
6. Creates issue via PROVIDER.md
7. Links back to source artifact: adds `issue: #N` to artifact
8. Returns issue number

**Issue includes estimate from source:**
If PLAN.md has a `## Estimate Breakdown` section, it's included in the issue body under `## Time Estimate`. This lets anyone picking up the issue know the AI-assisted estimate upfront.

**--execute mode:**
Creates the issue AND immediately invokes `/workflow:issue <N>` to start execution. Use when you want plan → issue → code in one flow.

**Related:**
- `/workflow:plan` — create the plan first
- `/workflow:issue <N>` — execute after creating
- `/workflow:audit` — auto-asks about creating issues from tech debt

Invoke `issue-creator`:
> "Run /workflow:create-issue. Read CLAUDE.md for repo_owner and repo_name. Read PROVIDER.md for create_issue command. Parse arguments: no args → use .workflow/PLAN.md as source; --adr N → use .workflow/ADRs/00N-*.md; --patch slug → use .workflow/patches/*slug*.md; --debt → batch mode from all open items in .workflow/TECH-DEBT.md. Invoke issue-creator with identified source. Each created issue gets linked back to source artifact. IF --execute: after creation invoke /workflow:issue with new issue number. Return issue number(s) created."
