# arch:challenge

> Stress-test the current architecture proposal. Finds blockers, risks, and hidden costs.

**Usage:**
- `/arch:challenge` — challenge the most recent proposal
- `/arch:challenge <topic-slug>` — challenge a specific proposal

**When to use:**
- After `/arch:brainstorm` produces a proposal
- Before committing to any significant architecture decision
- When you feel too confident about an approach (challenge it anyway)

**What it does:**
1. Reads `.workflow/proposals/[topic].md` — the proposal to challenge
2. Reads all ADRs + project rules — grounds the challenge in reality
3. `architecture-challenger` stress-tests each option:
   - Failure modes and recovery scenarios
   - ADR/rule conflicts
   - Hidden costs and maintenance burden
   - Missing constraints
   - Estimate challenges
4. Writes `.workflow/challenges/[topic].md` with:
   - Blockers (must address) per option
   - Concerns (should address)
   - Notes (optional)
   - Verdict: which option survives challenge
5. Presents verdict and recommends next step

**Quality of challenge:**
Every blocker must have a concrete failure scenario — not abstract concerns. If an option survives challenge with no blockers, it says so clearly. The goal is a better decision, not defeating the proposal.

**Related:**
- `/arch:brainstorm` — produces the proposal to challenge
- `/arch:decide` — run after challenge to lock in decision

Invoke `architecture-challenger`:
> "Run /arch:challenge. IF argument provided: find .workflow/proposals/[argument].md. ELSE: find the most recently modified file in .workflow/proposals/. Read the proposal completely. Read all .workflow/ADRs/ and .claude/rules/project/architecture.md. Invoke architecture-challenger to stress-test each option. Write .workflow/challenges/[topic-slug].md. Present verdict. Suggest /arch:decide with recommended option."
