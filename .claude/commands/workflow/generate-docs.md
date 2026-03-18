# workflow:generate-docs

> Generate project-description.md and user-stories.md from a client discovery file.
> The entry point when all you have is a discovery document.

**Usage:**
- `/workflow:generate-docs <discovery-file>` — generate all project docs
- `/workflow:generate-docs <discovery-file> --description-only` — generate project-description.md only
- `/workflow:generate-docs <discovery-file> --stories-only` — generate user-stories.md only

**When to use:**
- You received a discovery file from a client
- You're starting a new project with only requirements/brief
- You need to formalise scattered notes into structured project docs
- Before running `/workflow:init` or `/workflow:discover`

**What it does:**

### Phase 1 — Read and analyse
1. Read the discovery file completely
2. Extract: project purpose, problem statement, features, audience, stack hints, constraints
3. Identify what is described as already built vs planned

### Phase 2 — Generate project-description.md
Writes `docs/project-description.md` with:
- What the project is (1-2 sentence elevator pitch)
- The problem it solves (with before/after comparison if possible)
- Key features split into: Implemented / Planned
- Target audience and technical requirements
- Tech stack (detected or inferred from discovery)
- Platform support
- Competitive landscape (if mentioned in discovery)
- Project status

### Phase 3 — Generate user-stories.md
Writes `docs/user-stories.md` with:
- Stories grouped by functional domain
- Each story: `As a [role], I want [action], so that [benefit]`
- Acceptance criteria as checkboxes under each story
- Status markers: `[x]` implemented, `[ ]` not yet, `[~]` partial
- Status inferred from discovery — features described as "planned" = `[ ]`

### Phase 4 — Summary report
Reports:
- Total stories generated
- Implemented vs not implemented count
- Suggested next commands

**Output files:**
```
docs/
├── project-description.md    ← generated
└── user-stories.md           ← generated
```

**After running:**
```bash
# Review and edit both files — Claude's output is a starting point
# Then set up the kit properly:
/workflow:init              # if new project
/workflow:discover          # if existing codebase
# Then plan from user stories:
/workflow:plan              # reads user-stories.md for unimplemented stories
```

**Example:**
```
/workflow:generate-docs docs/client-discovery.md

→ Reading discovery file...
→ Generating project-description.md (~10 min)
→ Generating user-stories.md (~15 min)

✅ Generated:
   docs/project-description.md  (12 sections, ~800 words)
   docs/user-stories.md         (34 stories across 8 domains)
   Implemented: 12 stories
   Not yet:     18 stories
   Partial:      4 stories

Next steps:
  → Review and edit both files
  → /workflow:init or /workflow:discover
  → /workflow:plan to plan from unimplemented stories
  → /workflow:create-issue to push stories to GitHub
```

Invoke `description-writer` then a story-generation agent:
> "Run /workflow:generate-docs. Read the discovery file at '$ARGUMENTS'. Phase 1: analyse the file — extract purpose, problem, features (implemented vs planned), audience, stack, constraints. Phase 2: write docs/project-description.md covering all key sections. Phase 3: write docs/user-stories.md — group stories by functional domain, format As a/I want/So that, add acceptance criteria checkboxes, mark implemented/partial/not-yet based on what discovery says. Phase 4: report totals and suggest next steps. IF --description-only: skip Phase 3. IF --stories-only: skip Phase 2."
