# agents:install

> Install an agent from the VoltAgent catalog with full adaptation pass.

**Usage:**
- `/agents:install <n>` — install locally (default)
- `/agents:install <n> --global` — install to `~/.claude/agents/`
- `/agents:install <n> --update` — re-run adaptation pass on already-installed agent

**When to use:**
- Need a specialist agent for a specific task
- Adding a stack specialist for a new framework
- Refreshing an agent after changing stack in CLAUDE.md

**The adaptation pass (runs on every install):**
1. Fetch raw agent from VoltAgent catalog
2. Strip redundant sections (coding standards, commit format, hardcoded repos)
3. Inject project context pointer (reads CLAUDE.md)
4. Inject stack-specific quality commands from CLAUDE.md
5. Validate: no hardcoded values remain

This means installed agents are ~50% smaller and 100% aware of your project context.

**Catalog source:** `VoltAgent/awesome-claude-code-subagents`

**Examples:**
```
/agents:install php-pro
/agents:install laravel-specialist
/agents:install docker-expert
/agents:install vue-specialist --global
/agents:install react-specialist --update
```

**Related:**
- `/agents:search` — find agents first
- `/agents:list` — see installed agents
- `/agents:remove` — remove an agent

Invoke `agent-installer`:
> "Install agent '$ARGUMENTS' from the awesome-claude-code-subagents catalog. Check for --global (install to ~/.claude/agents/), --local (default: .claude/agents/), or --update (re-run adaptation pass on existing). Read CLAUDE.md for project context before adaptation. Run the 5-step adaptation pass: fetch, strip, inject context, inject quality config, validate. Save to appropriate directory. Report adaptation summary: what was stripped, what was injected."
