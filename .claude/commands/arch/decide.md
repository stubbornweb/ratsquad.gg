# arch:decide

> Lock in an architecture decision. Writes ADR, updates rules, optionally creates implementation issue.

**Usage:**
- `/arch:decide` — decide on most recent proposal (after challenge)
- `/arch:decide <topic-slug>` — decide on specific proposal
- `/arch:decide <topic-slug> --option A` — skip interactive selection, choose option A

**When to use:**
- After `/arch:challenge` produces a verdict
- When you're ready to permanently record a decision
- When a proposal survived challenge and you want to commit to it

**What it does (permanent actions — cannot be undone without a new ADR):**
1. Reads proposal + challenge files
2. If no `--option` flag: shows summary and AskUserQuestion which option to go with
3. `architecture-recorder` writes ADR to `.workflow/ADRs/NNN-[slug].md`
4. Updates `.claude/rules/project/architecture.md` with actionable rule
5. Deletes `.workflow/proposals/[slug].md` — decision is recorded
6. Deletes `.workflow/challenges/[slug].md` — no longer needed
7. Runs `/workflow:sync` — Claude sees the new rule immediately
8. AskUserQuestion: "Create implementation issue?" → Yes | No
9. If yes: invokes `issue-creator` to produce a `workflow:feature` issue

**The ADR is permanent.** It lives in `.workflow/ADRs/` forever. If you change your mind later, write a new ADR that supersedes it — don't delete the original.

**Related:**
- `/arch:brainstorm` → `/arch:challenge` → `/arch:decide` — full flow
- `/workflow:create-issue` — create issue without full decide flow

Invoke `architecture-recorder`:
> "Run /arch:decide. IF argument: find that proposal/challenge pair. ELSE: use most recent. Read proposal and challenge. IF no --option flag: show option summary and AskUserQuestion which to choose. Invoke architecture-recorder to: write ADR, update .claude/rules/project/architecture.md, delete proposal + challenge files, run /workflow:sync. AskUserQuestion about creating implementation issue. If yes: invoke issue-creator."
