# wws:phases

> Generate implementation phases from docs/planning/user-stories.md and docs/planning/discovery.md.

**Usage:**
- `/wws:phases` — generate from user stories
- `/wws:phases --force` — overwrite existing phases

**Input:** `docs/planning/user-stories.md`, `docs/planning/discovery.md`
**Output:** `docs/planning/phases/phase-1.md`, `docs/planning/phases/phase-2.md`, etc.

## Steps

1. **Check prerequisites**
   - Verify `docs/planning/user-stories.md` exists
   - If missing: error "Run /wws:stories first"
   - If `docs/planning/phases/` already has phases and no `--force`: warn and exit

2. **Read sources**
   - Parse all stories from `docs/planning/user-stories.md`
   - Read priority assessment from `docs/planning/discovery.md`
   - Read constraints and timeline

3. **Group stories into phases**

   **Phase 1 — Foundation/MVP**
   - Critical priority stories only
   - Must-have features from discovery
   - Core functionality that other things depend on
   - No dependencies on future phases

   **Phase 2 — Core Features**
   - High priority stories
   - Main feature set
   - Stories that deliver primary value

   **Phase 3 — Enhancement**
   - Medium priority stories
   - Nice-to-have features
   - Polish and optimization

   **Phase 4 — Future/Nice-to-have**
   - Low priority stories
   - Features deferred to later
   - Exploratory work

4. **Order stories within each phase**
   - By dependency (what blocks what)
   - By risk (higher risk earlier)
   - By quick wins (easy wins first to build momentum)

5. **Generate phase files**

   For each phase, write `docs/planning/phases/phase-N.md`:

   ```markdown
   # Phase N: [Phase Name]

   **Status:** Not Started
   **Priority:** [critical/high/medium]

   ## Overview

   [Brief description of this phase]

   ## Stories

   ### [Story ID] — [Story title]
   - **From:** US-X.Y
   - **Priority:** [critical/high/medium/low]
   - **Status:** [ ]

   Tasks:
   - [ ] [Atomic task 1]
   - [ ] [Atomic task 2]

   ---

   ### [Story ID] — [Story title]
   - **From:** US-X.Y
   - **Priority:** [critical/high/medium/low]
   - **Status:** [ ]

   Tasks:
   - [ ] [Atomic task 1]
   - [ ] [Atomic task 2]

   ## Exit Criteria

   - [ ] All stories in this phase marked [x]
   - [ ] All acceptance criteria met
   - [ ] Phase reviewed and approved
   ```

   Also create `docs/planning/phases/README.md`:

   ```markdown
   # Project Phases

   | Phase | Name | Stories | Status |
   |-------|------|---------|--------|
   | 1 | Foundation | 5 | Not Started |
   | 2 | Core Features | 8 | Not Started |
   | 3 | Enhancement | 4 | Not Started |

   Run `/ww:plan` to start working on the current phase.
   ```

6. **Checkpoint**
   ```
   Generated [N] phases with [M] total stories.

   docs/planning/phases/
   ├── README.md
   ├── phase-1.md (Foundation — 5 stories)
   ├── phase-2.md (Core Features — 8 stories)
   └── phase-3.md (Enhancement — 4 stories)

   Review the generated files and edit if needed.

   Next: /ww:plan — create task breakdown for implementation
   ```
