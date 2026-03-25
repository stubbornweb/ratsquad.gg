# ww:discover

> Business discovery interview. Capture thinking, constraints, and goals to seed project planning.

**Usage:**
- `/ww:discover` — interactive interview (full template)
- `/ww:discover --existing` — analyze existing project, pre-fill gaps, interview missing pieces
- `/ww:discover --fresh` — start blank (greenfield project)

**Output:**
- `docs/planning/discovery.md` — frozen snapshot of original thinking

## Auto-Detection

If neither `--fresh` nor `--existing` is provided:
- Has source files (`.php`, `.js`, `composer.json`, `package.json`, etc.) → `--existing`
- Empty or only `.git` → `--fresh`

## Fresh Mode (--fresh)

1. **Ask the 12-section interview**
   - Walk through the discovery template sections in order
   - One section at a time, ask all questions in that section
   - Allow skipping questions with "skip" or leaving blank with "N/A"
   - Mark optional sections (budget, compliance) as explicitly optional

2. **Write discovery snapshot**
   - Write to `docs/planning/discovery.md`
   - Fill in all answered questions
   - Leave unanswered questions as "___" for future reference

3. **Checkpoint**
   ```
   Discovery interview complete.

   docs/planning/discovery.md created with [N] sections filled.

   Next steps:
   → /wws:describe — generate project description from discovery
   → /wws:stories — generate user stories
   → /wws:phases — generate implementation phases

   Run /ww:sync when ready to apply pending changes.
   ```

## Existing Mode (--existing)

1. **Analyze codebase**
   - Read existing `docs/planning/discovery.md` if it exists → skip sections already filled
   - Detect stack, architecture, patterns from code
   - Read existing `docs/planning/project-description.md`, `docs/planning/user-stories.md` if they exist

2. **Identify gaps**
   - Questions with no answers in existing docs
   - Business context that can't be inferred from code
   - Risks, success metrics, constraints not documented

3. **Interview only the gaps**
   - For each gap: ask the specific question
   - "Based on your code, I can see this handles X. What's the business goal here?"
   - "I found Y references but no docs. What should I know about Y?"

4. **Write discovery snapshot**
   - Merge pre-filled and newly answered questions
   - Mark source for each answer: [from-code] or [from-interview]

5. **Checkpoint**
   ```
   Discovery analysis complete.

   Pre-filled from code: [N] sections
   Answered in interview: [M] sections
   Skipped: [K] sections (marked N/A)

   docs/planning/discovery.md updated.

   Next steps:
   → /wws:describe — generate project description from discovery
   → /wws:stories — generate user stories
   → /wws:phases — generate implementation phases

   Run /ww:sync when ready to apply pending changes.
   ```

## Interview Rules

- **One section at a time** — don't rush ahead
- **Short answers encouraged** — bullet points, not essays
- **"I don't know" is valid** — mark as "unknown"
- **Optional sections clearly marked** — budget, compliance only if relevant
- **No wrong answers** — this is thinking, not commitment
- **Challenge assumptions** — use grill-me skill to stress-test answers:
  - "You said X — what happens if that assumption is wrong?"
  - "This contradicts what you said about Y — which is correct?"
  - "What's the worst case if Z fails?"

## Section Order

```
1. Business Overview        (required)
2. The Problem              (required)
3. Current Workflow         (required)
4. Desired Outcome          (required)
5. Constraints              (required)
6. Users & Stakeholders     (required)
7. Automation & Efficiency  (required)
8. Data & Integration       (required)
9. Risks & Concerns         (required)
10. Success Metrics         (required)
11. Additional Context      (optional)
12. Priority Assessment     (required)
```
