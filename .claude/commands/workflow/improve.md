# workflow:improve

> Analyse and improve the workflow system itself — commands, pipelines, rules structure.

**Usage:**
- `/workflow:improve` — full workflow system analysis with suggestions
- `/workflow:improve --focus <area>` — focus on specific area: commands | agents | rules | pipeline

**When to use:**
- When workflow commands feel slow or produce wrong output
- After several sessions where something kept not working as expected
- Periodically to keep the system healthy
- When you want to add a new workflow pattern

**What it does:**
1. Reads all `.claude/commands/` files — checks for inconsistencies
2. Reads all `.claude/agents/` files — checks pre-flight patterns, hardcoded values
3. Reads `.workflow/rules/active-rules.md` — checks for rule conflicts
4. Reads `.workflow/patches/` — identifies systemic workflow issues (vs code issues)
5. Produces improvement report with specific suggestions
6. AskUserQuestion: "Apply suggested improvements?" → select which ones to apply
7. Updates files for approved improvements

**Areas it checks:**
- Agent pre-flight completeness (all agents reading CLAUDE.md properly?)
- Hardcoded values that slipped back in
- Command descriptions that are outdated
- Pipeline stage timing that seems off based on patches
- Rules that conflict across layers
- Missing commands for common workflows

**Output format:**
```
## Workflow Improvement Report

### Issues Found

🔴 [agent-name].md — hardcoded value found: "tuti-cli/cli" on line 24
🟠 [command].md — description references old pipeline steps
🟡 rules conflict: project/conventions.md overrides base/architecture.md on [topic]

### Suggestions

1. Fix hardcoded value in [agent] → replace with CLAUDE.md read
2. Update [command] description to match current pipeline
3. Clarify rule conflict: feature layer needed for [topic]

Apply? → Select: [1] [2] [3] All None
```

**Related:**
- `/workflow:evolve` — improve agents from patches (code bugs → agent knowledge)
- `/rules:show` — audit active rules state

Invoke `workflow-improver`:
> "Run /workflow:improve. Read all .claude/commands/**/*.md and .claude/agents/*.md files. Read .workflow/rules/active-rules.md. Identify: hardcoded values, outdated descriptions, pre-flight gaps, rule conflicts, missing improvements from recent patches. Produce structured improvement report. IF --focus: limit analysis to specified area. AskUserQuestion about which improvements to apply. Apply approved improvements."
