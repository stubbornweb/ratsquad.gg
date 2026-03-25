# ww:sync

> Apply pending document changes from pending-sync.md to docs/planning/.

**Usage:**
- `/ww:sync` — interactive: show each change, ask approve/reject
- `/ww:sync --dry-run` — show what would be applied without applying
- `/ww:sync --approve-all` — apply all without asking
- `/ww:sync --clear` — clear pending-sync.md without applying

**Input:** `.workflow/pending-sync.md`
**Output:** Updated docs/planning/* files + regenerated PROJECT.md

## Steps

1. **Check for pending changes**
   - Read `.workflow/pending-sync.md`
   - If file is empty or doesn't exist: exit "No pending changes"
   - Parse all proposals with timestamps

2. **Show summary**
   ```
   Pending Sync Changes
   ====================

   [N] changes queued from:
   - /ww:plan (2 changes)
   - /ww:arch decide (1 change)
   - /ww:do (0 changes)

   Review each change before applying.
   ```

3. **Interactive approval (if not --approve-all)**

   For each proposal:
   ```
   Change 1 of N
   ==============
   Source: /ww:plan
   File: docs/planning/user-stories.md
   Action: add

   Content:
   ---
   ### US-2.1: [New Story]
   **As a** developer,
   **I want to**...
   ---

   Apply this change?
   → Approve | Reject | Edit | Skip
   ```

   **Approve:** mark for application
   **Reject:** skip, don't apply
   **Edit:** open editor, save → use edited version
   **Skip:** defer to end of session

4. **Apply approved changes**
   - For each approved proposal:
     - Read target file
     - Apply change (add line, replace section, etc.)
     - Write back
   - If any change fails: stop, report error, preserve remaining proposals

5. **Regenerate PROJECT.md**
   - Read all docs/planning/*
   - Generate fresh PROJECT.md summary
   - Write to project root

6. **Clear pending-sync**
   - Write empty `.workflow/pending-sync.md` or delete it
   - Confirm: "All pending changes applied and cleared"

## Proposal Format (in pending-sync.md)

```markdown
# Pending Sync Changes

## Proposals

### [timestamp] — /ww:plan
- **File:** docs/planning/user-stories.md
- **Action:** add
- **Content:**
  ```markdown
  ### US-2.1: New Story
  **As a**...
  ```
- **Context:** "New feature from PLAN.md"

### [timestamp] — /ww:arch decide
- **File:** docs/planning/project-description.md
- **Action:** update
- **Section:** ## Architecture
- **Content:**
  ```markdown
  ### Stack
  - PHP 8.4
  - Laravel Zero 12.x
  ```
- **Context:** "ADR-001 decision"

### [timestamp] — /ww:do
- **File:** docs/planning/phases/phase-1.md
- **Action:** update
- **Section:** ### US-1.2
- **Content:** Status marker changed to [x]
- **Context:** "Task completed during /ww:do"
```

## Regeneration Rules for PROJECT.md

PROJECT.md must be:
- **Deterministic** — same inputs always produce same output
- **Idempotent** — safe to regenerate anytime
- **Fast** — under 1 second for typical projects

PROJECT.md includes:
- Summary (from project-description.md Overview)
- Current phase and progress (from phases/README.md)
- Feature list with status (from user-stories.md)
- Architecture highlights (from project-description.md)
- Open questions or blockers (from discovery.md if critical)
