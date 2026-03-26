# wws:stories

> Generate user-stories.md from docs/planning/project-description.md and docs/planning/discovery.md.

**Usage:**
- `/wws:stories` — generate from existing docs/planning/project-description.md
- `/wws:stories --force` — overwrite existing user-stories.md

**Input:** `docs/planning/project-description.md`, `docs/planning/discovery.md`
**Output:** `docs/planning/user-stories.md`

## Steps

1. **Check prerequisites**
   - Verify `docs/planning/project-description.md` exists
   - If missing: error "Run /wws:describe first"
   - If `docs/planning/user-stories.md` exists and no `--force`: warn and exit

2. **Read sources**
   - Parse features from `docs/planning/project-description.md`
   - Parse priorities and constraints from `docs/planning/discovery.md`

3. **Extract stories from features**

   For each feature in project-description:
   - Break into user stories using format: "As a [role], I want [action], so that [benefit]"
   - Extract or infer the role from target audience
   - Each story gets acceptance criteria from the feature description

   **Priority assignment:**
   - From "Must-have" in discovery → critical
   - From "Nice-to-have" in discovery → medium
   - If unclear: infer from impact ("Impact on revenue", "Impact on time")
   - Urgent timeline (score 9-10) → boost priority

4. **Group by domain**

   Common domains:
   - Installation & Setup
   - Core Features
   - User Management (if applicable)
   - Data & Storage
   - Integration & API (if applicable)
   - Reporting & Analytics (if applicable)
   - Administration (if applicable)

5. **Write user-stories.md**

   ```markdown
   # User Stories

   **Last Updated:** [date]

   Status legend: `[x]` Implemented | `[ ]` Not yet implemented | `[~]` Partial

   ---

   ## [Domain 1]

   ### US-1.1: [Story title]

   **As a** [role],
   **I want to** [action],
   **so that** [benefit].

   **Status:** [ ]

   **Acceptance Criteria:**
   - [ ] [Criterion 1]
   - [ ] [Criterion 2]
   - [ ] [Criterion 3]

   ---

   ## [Domain 2]

   ### US-2.1: [Story title]

   **As a** [role],
   **I want to** [action],
   **so that** [benefit].

   **Status:** [ ]

   **Acceptance Criteria:**
   - [ ] [Criterion 1]
   - [ ] [Criterion 2]
   ```

6. **Checkpoint**
   ```
   docs/planning/user-stories.md generated with [N] stories across [M] domains.

   Review the generated file and edit if needed.

   Next: /wws:schema — generate database schema (if needed)
          /wws:phases — generate implementation phases
   ```
