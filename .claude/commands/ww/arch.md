# ww:arch

> Architecture decision workflow: brainstorm, challenge, decide and record.

**Usage:**
- `/ww:arch brainstorm <topic>` — explore architecture options
- `/ww:arch challenge <topic>` — stress-test a proposal
- `/ww:arch decide <topic>` — lock in decision, write to pending-sync

## Brainstorm

1. **Load context**
   - Read `docs/planning/project-description.md` for architecture context
   - Read existing ADRs in `.workflow/decisions/ADRs/`
   - Read `docs/planning/phases/` to understand current phase

2. **Explore options**
   - Generate 2-3 architecture options
   - For each: describe approach, list tradeoffs, identify risks
   - Compare options side by side

3. **Write proposal**
   - Write to `.workflow/meta/proposals/{topic}.md`
   ```
   Proposal written. Next:
   → /ww:arch challenge {topic} — stress-test this
   → /ww:arch decide {topic} — make a decision
   ```

## Challenge

Uses grill-me skill to stress-test an existing proposal.

1. **Load proposal**
   - Read `.workflow/meta/proposals/{topic}.md`
   - If no proposal: tell user to run brainstorm first

2. **Grill the proposal**
   - Phase 1: clarify assumptions
   - Phase 2: find failure modes, hidden costs, rule conflicts
   - Phase 3: test against scale, debugging, rollback

3. **Write challenge findings**
   - Write to `.workflow/meta/challenges/{topic}.md`
   ```
   Challenge complete. Findings written.
   → /ww:arch decide {topic} — make a decision
   ```

## Decide

1. **Load proposal + challenge**
   - Read proposal and challenge findings
   - Present summary of options and concerns

2. **Ask for decision**
   ```
   Which option? [1/2/3]
   Rationale? [user explains why]
   ```

3. **Write ADR**
   - Write to `.workflow/decisions/ADRs/NNN-{topic}.md`:
   ```markdown
   # ADR-NNN: [Topic]

   ## Status
   Accepted

   ## Context
   [What prompted this decision]

   ## Options Considered
   1. [Option 1] — [tradeoffs]
   2. [Option 2] — [tradeoffs]

   ## Decision
   [Chosen option and rationale]

   ## Consequences
   [What changes as a result]
   ```

4. **Propose doc update** (instead of direct write)
   - Write to `.workflow/pending-sync.md`:
   ```
   ### [timestamp] — /ww:arch decide
   - **File:** docs/planning/project-description.md
   - **Action:** update
   - **Section:** ## Architecture
   - **Content:** [decision summary]
   - **Context:** ADR-NNN-{topic}
   ```
   - If decision implies new rules: also propose:
   ```
   ### [timestamp] — /ww:arch decide
   - **File:** .claude/rules/project/architecture.md
   - **Action:** update
   - **Section:** ## Decisions
   - **Content:** ADR-NNN: [topic] — [decision]
   - **Context:** ADR-NNN-{topic}
   ```

5. **Final message**
   ```
   ADR-NNN: [Topic] recorded.

   Decision queued for /ww:sync to apply:
   - Update docs/planning/project-description.md with decision
   - Update rules/project/architecture.md

   Run /ww:sync to apply pending changes.
   ```
