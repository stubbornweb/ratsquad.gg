# arch:brainstorm

> Start an architecture brainstorming session. Produces 2-3 options with tradeoffs.

**Usage:**
- `/arch:brainstorm` — start session, Claude asks what you're deciding
- `/arch:brainstorm "<topic>"` — start with specific topic

**When to use:**
- Any significant technical decision that will affect future code
- Before picking a pattern for a new domain/module
- Before choosing between two approaches you're unsure about
- When you want 2-3 options documented before committing

**What it does:**
1. Reads CLAUDE.md → stack, extras
2. Reads ALL existing ADRs → won't propose conflicting approaches
3. Reads `project/architecture.md` rules → respects locked decisions
4. `architecture-lead` produces 2-3 concrete options:
   - Each with pros, cons, complexity, risk, AI estimate
   - Tradeoff matrix comparing all options
   - Clear recommendation with reasoning
5. Writes `.workflow/proposals/[topic-slug].md`
6. Prompts: "Challenge with `/arch:challenge` or decide with `/arch:decide`"

**Estimates in proposals:**
Each option includes an AI-assisted implementation estimate so you can factor time into the decision. Example: Option A `~45 min`, Option B `~2h` — sometimes the simpler option is worth the constraints.

**Related:**
- `/arch:challenge` — run after brainstorm to stress-test
- `/arch:decide` — lock in the decision and write ADR

Invoke `architecture-lead`:
> "Run /arch:brainstorm. Read CLAUDE.md, all .workflow/ADRs/, and .claude/rules/project/architecture.md to understand existing constraints. IF argument provided: use as the topic. ELSE: ask user what decision they need to make. Invoke architecture-lead to produce 2-3 options with tradeoffs, estimates, and recommendation. Write to .workflow/proposals/[topic-slug].md. Prompt user to run /arch:challenge or /arch:decide."
