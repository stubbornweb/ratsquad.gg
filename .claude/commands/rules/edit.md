# rules:edit

> Open a specific rules file for editing. Re-syncs active-rules.md after save.

**Usage:**
- `/rules:edit base/coding-standards` — edit the base coding standards
- `/rules:edit base/testing` — edit testing rules
- `/rules:edit base/git` — edit git/commit rules
- `/rules:edit base/architecture` — edit architectural rules
- `/rules:edit project/conventions` — edit project conventions
- `/rules:edit project/stack` — edit stack configuration
- `/rules:edit project/architecture` — edit project architecture rules
- `/rules:edit features/auth` — edit auth subsystem rules
- `/rules:edit features/<n>` — edit any feature rule file

**When to use:**
- Making substantial changes to an existing rule (not just adding one line)
- Removing outdated rules
- Reorganising a rules file after it grows large
- Updating stack.md after a framework upgrade

**What it does:**
1. Resolves the file path from the argument (e.g. `base/testing` → `.claude/rules/base/testing.md`)
2. Opens the file using the Edit tool
3. After your edits are done, runs `/workflow:sync` automatically
4. Confirms: "Rules updated. Active rules rebuilt."

**Related:**
- `/rules:add` — for adding a single rule quickly
- `/rules:show` — to view current rules before editing
- `/workflow:sync` — runs automatically after this command

Invoke directly:
> "Open the rules file for editing. Parse argument '$ARGUMENTS' as a path relative to `.claude/rules/`. Resolve to full path (e.g. 'base/testing' → '.claude/rules/base/testing.md'). If the file does not exist, create it with a basic header and the layer name. Use the Edit tool to open it for editing. After editing is complete, run /workflow:sync to rebuild active-rules.md. Confirm with: 'Rules file updated. Active rules rebuilt.'"
