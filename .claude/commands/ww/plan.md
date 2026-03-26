# ww:plan

> Create a task breakdown with priorities. Grills the plan before finalizing.

**Usage:**
- `/ww:plan` — plan from current phase (interactive)
- `/ww:plan --issue N` — plan from existing GitHub issue
- `/ww:plan --story US-X.Y` — plan from specific user story
- `/ww:plan --plan-only` — create plan, do not propose doc changes
- `/ww:plan --estimate` — include time estimates per task

## Context Loading

1. **Load project docs**
   - Read `docs/planning/project-description.md` for overview
   - Read `docs/planning/user-stories.md` for stories
   - Read `docs/planning/phases/README.md` for current phase
   - Read current phase file (e.g., `docs/planning/phases/phase-1.md`)
   - If no docs exist: error "Run /ww:discover first"

2. **Determine source**
   - If `--story US-X.Y`: find that story in user-stories.md
   - If `--issue N`: fetch issue via `gh issue view N --json title,body,labels`
   - Else if `docs/planning/phases/` exists: plan current phase
   - Else: ask user what they want to plan

## Task Breakdown

3. **Create task breakdown**
   - Break story into atomic, implementable tasks
   - Order by dependency (what blocks what)
   - Assign priority: critical / high / medium / low
   - If `--estimate`: add time estimates per task

4. **Grill the plan** (uses grill-me skill)

   **Feasibility check:**
   - "Task X depends on Y but Y isn't in the plan — what's missing?"
   - "This task is too vague to implement — what specifically gets built?"
   - "These 3 tasks could be one — why split them?"

   **Scope check:**
   - "Is this MVP or full feature?"
   - "What can be deferred without blocking the rest?"

   **Quality check:**
   - "Where are the tests in this plan?"
   - "Which tasks need database migrations?"

5. **Write PLAN.md**

   Write to `.workflow/core/PLAN.md`:

   ```markdown
   # Plan: [Title]

   Source: [docs/planning/user-stories.md US-X.Y / Issue #N / user description]
   Created: [date]

   ## Tasks

   - [ ] Task 1 — description [priority: high]
   - [ ] Task 2 — description [priority: high]

   ## Dependencies
   - Task 3 requires Task 1

   ## Notes
   - ...
   ```

6. **Present for approval**
   ```
   Plan created with N tasks. Review and approve?
   → Approve | Edit | Re-grill | Cancel
   ```

7. **Ask what to do next**

   After user approves the plan:
   ```
   Plan approved. What next?
   → Execute now (/ww:do) | Save to PLAN.md | Both (save + execute)
   ```

   - **Execute now:** proceed directly to /ww:do logic in same session (no file written)
   - **Save to PLAN.md:** write `.workflow/core/PLAN.md` as described in step 5
   - **Both:** write file + proceed to execution

## Doc Change Proposals

8. **Propose structural doc changes** (if any needed and not `--plan-only`)

   **If planning introduces a new story:**
   - Write proposal to `.workflow/pending-sync.md`:
     ```
     ### [timestamp] — /ww:plan
     - **File:** docs/planning/user-stories.md
     - **Action:** add
     - **Content:** [new story markdown]
     - **Context:** "New story from planning"
     ```

   **If planning adds tasks to a phase:**
   - Write proposal to `.workflow/pending-sync.md`:
     ```
     ### [timestamp] — /ww:plan
     - **File:** docs/planning/phases/phase-X.md
     - **Action:** update
     - **Section:** ## Tasks
     - **Content:** [new task markdown]
     - **Context:** "Tasks added from planning"
     ```

   **If no structural doc changes needed:** skip proposal step
