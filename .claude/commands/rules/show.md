# rules:show

> Display the current active rules snapshot — exactly what Claude will see.

**Usage:**
- `/rules:show` — show full active-rules.md
- `/rules:show base` — show base layer only
- `/rules:show project` — show project layer only
- `/rules:show features` — show features layer only
- `/rules:show features/<n>` — show one specific feature's rules

**When to use:**
- Claude did something unexpected — audit what rules it had access to
- Starting a new session — verify rules are current
- After adding rules — confirm they appear correctly
- Onboarding a teammate — show them what conventions Claude follows
- Debugging a conflict — check if a feature rule overrode a base rule

**Output:**
Prints `.workflow/rules/active-rules.md` (or the requested section).
If the file is stale or missing, runs `/workflow:sync` first automatically.

**Reading the output:**
```
## BASE LAYER          ← global rules, lowest priority
## PROJECT LAYER       ← project decisions, override base
## FEATURES LAYER      ← subsystem rules, override everything
## Conflict Notes      ← rules that override earlier layers — check these
```

**Tip:** If Claude is doing something you don't expect, run `/rules:show` and look for a missing rule. Then `/rules:add` it immediately.

Invoke directly:
> "Show the active rules for this project. Read `.workflow/rules/active-rules.md`. If the file is missing or older than the newest file in `.claude/rules/`, run /workflow:sync first. IF argument is 'base': show only the BASE LAYER section. IF 'project': show only PROJECT LAYER. IF 'features': show all FEATURES LAYER. IF 'features/<n>': show only that feature's rules. ELSE: show the full file. Present it clearly with layer headers visible."
