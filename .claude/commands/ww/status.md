# ww:status

> Show workflow-kit version, configuration, and project state.

**Usage:**
- `/ww:status` — full status dashboard

## Steps

1. **Read configuration**
   - CLAUDE.md: owner, repo, stack, mode, version
   - Quality gates: lint command, test command

2. **Count installed components**
   - Agents: count `.claude/agents/*.md`
   - Commands: count `.claude/commands/ww/*.md` + `.claude/commands/wws/*.md`
   - Skills: count `.claude/skills/**/*.md`
   - Rules: count `.claude/rules/**/*.md`

3. **Check workflow state**

   **Docs layer:**
   - `docs/planning/discovery.md` exists? Show date
   - `docs/planning/project-description.md` exists? Show date
   - `docs/planning/user-stories.md` exists? Show story count
   - `docs/planning/database-schema.md` exists? Show if present
   - `docs/planning/phases/` exists? Show phase count and status
   - `PROJECT.md` exists? Show date, if current with docs

   **Workflow layer:**
   - PLAN.md exists? Show title and task progress
   - `.claude/rules/project/stack.md` populated? Show detected stack
   - AUDIT.md exists? Show last audit date
   - TECH-DEBT.md exists? Show item count by priority
   - ADRs: count `.workflow/decisions/ADRs/*.md`
   - Patches: count `.workflow/execution/patches/*.md`

4. **Check pending sync**
   - Read `.workflow/pending-sync.md`
   - If proposals exist: show count with warning

5. **Display dashboard**
   ```
   workflow-kit Status
   ===================

   Version:  v3.0
   Stack:    [stack]
   Mode:     [scratch/issues]
   GitHub:   [owner/repo]

   Quality Gates:
     Lint:   [lint command]
     Test:   [test command]

   Components:
     Agents:   [N]
     Commands: [N] (ww: [N], wws: [N])
     Skills:   [N]
     Rules:    [N]

   Docs:
     discovery.md:           [exists - date]
     project-description.md: [exists - date]
     user-stories.md:        [N stories - date]
     database-schema.md:     [present/absent]
     phases/:               [N phases]
     PROJECT.md:             [exists - current/stale]

   ⚠️  [N] pending sync changes. Run /ww:sync.

   Workflow:
     Plan:     [title] ([done/total] tasks)
     ADRs:     [N]
     Patches:  [N]
     Debt:     [N] items
   ```
