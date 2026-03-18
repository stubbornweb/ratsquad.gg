# workflow:sync

> Rebuilds `.workflow/rules/active-rules.md` — the merged flat view of all active rules.
> Run after editing any file in `.claude/rules/`.

**Usage:**
- `/workflow:sync` — rebuild active-rules.md from all rule layers

**When to use:**
- After editing any rule file in `.claude/rules/base/`, `project/`, or `features/`
- After `/rules:add` (runs automatically)
- After `/arch:decide` updates `project/architecture.md` (runs automatically)
- When Claude behaves unexpectedly — sync first, then retry
- At the start of a new session on a team project (after others may have edited rules)

**What it does:**
1. Reads all files in `.claude/rules/base/` in alphabetical order
2. Reads all files in `.claude/rules/project/` in alphabetical order
3. Reads all files in `.claude/rules/features/` in alphabetical order
4. Merges into `.workflow/rules/active-rules.md` with clear layer headers
5. Reports how many rules were loaded per layer
6. Flags any conflicts between layers

**Output format:**
```markdown
# Active Rules Snapshot
Generated: [timestamp]
Layers: base (4 files) → project (3 files) → features (2 files)

---
## BASE LAYER
[contents of base/*.md merged]

---
## PROJECT LAYER
[contents of project/*.md merged]

---
## FEATURES LAYER
[contents of features/*.md merged]

---
## Conflict Notes
[any rules that override earlier layers are flagged here]
```

Invoke `sync-rules` agent:
> "Read all rule files from `.claude/rules/base/`, `.claude/rules/project/`, and `.claude/rules/features/` in that order. Merge their contents into `.workflow/rules/active-rules.md` with clear section headers for each layer. Add a header showing generation timestamp and file counts per layer. Flag any rules in a later layer that appear to contradict an earlier layer. Report success with counts: X base rules, Y project rules, Z feature rules loaded."
