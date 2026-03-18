# agents:list

> List all installed agents with location and description.

**Usage:**
- `/agents:list` — list all (local + global)
- `/agents:list --local` — local only (`.claude/agents/`)
- `/agents:list --global` — global only (`~/.claude/agents/`)

**Output:**
```
Local agents (.claude/agents/):
  master-orchestrator    [protected] Central pipeline orchestrator
  laravel-specialist     PHP/Laravel 11+ specialist
  php-pro                PHP 8.4+ expert
  ...

Global agents (~/.claude/agents/):
  code-reviewer          Code quality guardian
  ...

Total: N local, N global
Protected: N (require --force to remove)
```

Invoke `agent-installer` in list mode:
> "List all installed agents. Glob .claude/agents/*.md for local. Glob ~/.claude/agents/*.md for global. For each: extract name, description, and whether it's in the protected list from CLAUDE.md. IF --local: show only local. IF --global: show only global. Format as table with Protected indicator. Show counts."
