# workflow:evolve

> Absorb accumulated patches into agent improvements. Makes the system smarter.

**Usage:**
- `/workflow:evolve` — analyse all unabsorbed patches and improve agents

**When to use:**
- After accumulating 3-5 new patches in `.workflow/patches/`
- When you notice a recurring pattern Claude keeps getting wrong
- Periodically (monthly on active projects)
- After a significant debugging session

**What it does:**
1. Reads `.workflow/patches/INDEX.md` → finds unabsorbed patches
2. Reads all unabsorbed patch files
3. `skill-evolver` identifies recurring patterns:
   - Same root cause appearing in multiple patches
   - Same mistake made by specific agents
   - Missing checklist items that keep causing issues
4. Updates relevant agent `.md` files with new checks/knowledge
5. Recommends `/rules:add` for patterns that warrant permanent project rules
6. Marks patches as absorbed in `INDEX.md`
7. Reports what changed

**Example output:**
```
🧠 Skill Evolution Complete

Patches analysed: 6
Patterns found: 3

Changes made:
  ✓ laravel-specialist.md — added "run migrations after schema changes" to checklist
  ✓ master-orchestrator.md — added reminder to check for N+1 queries in services
  ✓ feature-planner.md — strengthened pre-flight to load features/payments.md for payment tasks

Rules recommended:
  /rules:add project "Always call Arr::wrap() before iterating — never assume array type"
  /rules:add features/payments "Stripe idempotency key must be UUID v4, generated in caller"

Patches absorbed: 6
```

**Rules recommended but NOT auto-added:**
Skill-evolver recommends rules to you — it doesn't add them automatically. Run the suggested `/rules:add` commands if you agree. This keeps you in control.

**Related:**
- `/workflow:bugfix` — creates patches after fixes
- `/rules:add` — add suggested rules
- `/workflow:improve` — improve the workflow system itself (not agents)

Invoke `skill-evolver`:
> "Run /workflow:evolve. Invoke skill-evolver to read .workflow/patches/INDEX.md, identify unabsorbed patches, analyse patterns, update relevant agent .md files, recommend rules to developer, and mark patches absorbed. Report all changes made."
