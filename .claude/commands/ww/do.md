# ww:do

> Execute a plan. Scratch mode from PLAN.md, issues mode from GitHub issue.

**Usage:**
- `/ww:do` — execute from PLAN.md (scratch mode)
- `/ww:do 42` — execute from GitHub issue #42 (issues mode)
- `/ww:do --dry-run` — show what would happen without executing
- `/ww:do --worktree` — run in isolated git worktree
- `/ww:do --quick` — skip review stage, minimal quality checks

## Agent Management

Before spawning any agent, check if it exists and install on-demand if missing.

### Check and Install Agent

When an agent is needed (see trigger conditions below):

1. **Check if agent exists**
   ```
   Is .claude/agents/<name>.md present?
   ```

2. **If missing → install on-demand**
   ```
   Run: /ww:create agent <name>
   - This validates the agent type (three-layer grill)
   - Fetches from VoltAgent if --from available
   - Validates skill dependencies exist
   - Shows draft for approval before writing
   ```

3. **Validate skill dependencies**
   ```
   Read .claude/agents/<name>.md frontmatter
   Check skills: field against .claude/skills/
   If skill missing → error: "Agent <name> requires skill X which is not installed"
   ```

4. **Spawn agent**
   ```
   Use Agent tool to spawn the agent
   Pass relevant context (diff, error output, etc.)
   ```

### Agent Triggers

| Stage | Agent | When |
|-------|-------|------|
| Quality gate failure | `error-detective` | Auto-fix retry exhausted |
| Post-implementation | `code-reviewer` | Before commit (unless --quick) |
| Security-sensitive changes | `security-auditor` | Changes touch auth/input/sensitive data |

### Task-Driven Agents

Based on PLAN.md task keywords, these agents may be spawned mid-execution:

| Keywords | Agent |
|----------|-------|
| security, auth, vulnerability | `security-auditor` |
| performance, slow, optimize | `performance-engineer` |
| test, coverage, qa | `qa-expert` |
| architecture, design | `architect-reviewer` |
| refactor, debt, cleanup | `refactoring-analyzer` |

## Skill & Agent Detection (runs before execution)

Before executing, check if relevant skills and agents exist for this work:

1. **Read project context**
   - `.claude/rules/project/stack.md` → detected stack
   - `docs/planning/project-description.md` → project type
   - `CLAUDE.md` → stack section

2. **Analyze task context**
   - Scan plan tasks for domain indicators:

   | Domain | Keywords | Suggested Skill | Suggested Agent |
   |--------|----------|-----------------|-----------------|
   | Frontend | component, UI, page, layout, CSS, style | frontend-design | — |
   | API | endpoint, route, REST, GraphQL | api-design | — |
   | Database | migration, model, schema, query | database-patterns | — |
   | Auth | login, auth, permission, role | auth-patterns | security-auditor |
   | Testing | test, coverage, mock, fixture | testing-patterns | qa-expert |
   | Performance | optimize, cache, lazy, bundle | performance-patterns | performance-engineer |

3. **Check stack skill**
   - Is there a skill in `.claude/skills/stack/` matching the detected stack?
   - If stack is "next" → check for `.claude/skills/stack/nextjs/SKILL.md`
   - If stack is "laravel" → check for `.claude/skills/stack/laravel/SKILL.md`
   - etc. for all supported stacks

4. **Suggest missing skills**
   - For each missing skill:
     ```
     Missing skill: [skill-name]
     This plan involves [domain] work but no [skill-name] skill is installed.

     Create it now? (fetches from VoltAgent + adapts to your project)
     → Create | Skip | Skip all skill suggestions
     ```
   - If user says "Create": run `/ww:create skill [name]` inline (uses fetch-first flow)
   - Created skills immediately load into context for the execution

---

## Scratch Mode (no issue number)

1. **Load plan**
   - Read `.workflow/core/PLAN.md`
   - If no PLAN.md: tell user to run `/ww:plan` first

2. **Present plan for approval**
   - Show task list
   - If `--dry-run`: stop here
   ```
   Ready to execute N tasks. Proceed?
   → Start | Edit plan | Cancel
   ```

3. **Implement tasks**
   - Execute tasks from PLAN.md in order
   - Respect dependencies
   - Mark tasks complete as they finish

4. **Quality gates** (tiered by change type)
   - Detect change type from `git diff --name-only`:
     - Only `.md` files → lint only
     - Only config files → lint only
     - Code files changed → lint + test
   - Run applicable gates from CLAUDE.md
   - If fail: auto-fix retry (1x)
   - If still failing: spawn `error-detective` agent for diagnosis
     - Check if agent exists → if not, install via `/ww:create agent error-detective`
     - Present diagnosis → checkpoint: how to proceed?

5. **Review** (unless `--quick`)
   - Spawn `code-reviewer` agent to review the complete diff
     - Check if agent exists → if not, install via `/ww:create agent code-reviewer`
   - Show agent's findings alongside self-review

6. **Update phase files**
   - For each completed task:
     - Read the corresponding phase file in `docs/planning/phases/`
     - Mark the task as `[x]` directly in the file
   - For story completion (all acceptance criteria met):
     - Read `docs/planning/user-stories.md`
     - Mark story as `[x]` directly

7. **Done**
   - Show summary of what was implemented
   - Suggest: `/ww:commit` to commit changes

## Issues Mode (with issue number)

1. **Fetch and validate issue**
   - `gh issue view N --repo {owner}/{repo} --json title,body,labels,state`
   - Check required labels exist (type, priority, status)
   - Check required body sections (Summary, Context, Acceptance Criteria)
   - If validation fails: report what's missing, stop

2. **Auto-label if needed**
   - Detect type from content keywords
   - Suggest labels, wait for confirmation
   - Apply via `gh issue edit N --add-label`

3. **Setup**
   - Check current branch, ask where to branch from
   - Create branch: `{type}/{N}-{slug}`
   - Update issue label: add `status:in-progress`, remove `status:ready`
   - Post "Workflow started" comment on issue

4. **Present plan for approval**
   - Generate implementation plan from issue
   - If `--dry-run`: stop here
   ```
   Implementation plan for #N. Proceed?
   → Start | Edit plan | Cancel
   ```

5. **Implement**
   - Execute plan
   - Commit checkpoint every 3-5 tasks

6. **Quality gates** (tiered by change type)
   - Detect change type from `git diff --name-only`:
     - Only `.md` files → lint only
     - Only config files → lint only
     - Code files changed → lint + test
   - If `--quick`: run lint only regardless
   - Run applicable gates from CLAUDE.md
   - If fail: auto-fix retry (1x)
   - If still failing: spawn `error-detective` agent for diagnosis
     - Check if agent exists → if not, install via `/ww:create agent error-detective`
     - Present diagnosis → checkpoint: how to proceed?

7. **Review** (skip if `--quick`)
   - Spawn `code-reviewer` agent to review the complete diff
     - Check if agent exists → if not, install via `/ww:create agent code-reviewer`
     - Show agent's findings alongside self-review
   - Show summary of all changes

8. **Update phase files**
   - For each completed task:
     - Read the corresponding phase file in `docs/planning/phases/`
     - Mark the task as `[x]` directly in the file
   - For story completion (all acceptance criteria met):
     - Read `docs/planning/user-stories.md`
     - Mark story as `[x]` directly

9. **Done**
   - Show summary
   - Suggest: `/ww:commit --pr` to commit and create PR

## Story Completion Rule

**Stories are only marked [x] when ALL acceptance criteria are met.**

After task completion:
- Read `docs/planning/user-stories.md` for the story being worked
- Check if all acceptance criteria are now satisfied
- If yes: mark story as `[x]` directly in `docs/planning/user-stories.md`
- If partial: mark story as `[~]` directly

## Worktree Mode (--worktree)

- Create isolated worktree: `git worktree add .worktrees/{N}-{slug}`
- Run all steps inside worktree
- On completion: inform user of worktree path
