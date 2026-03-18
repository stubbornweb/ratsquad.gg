# agents:remove

> Remove an installed agent.

**Usage:**
- `/agents:remove <n>` — remove (searches local first, then global)
- `/agents:remove <n> --local` — local only
- `/agents:remove <n> --global` — global only
- `/agents:remove <n> --force` — force-remove a protected agent

**Protected agents** (require `--force`):
master-orchestrator · issue-executor · issue-creator · issue-closer · agent-installer · workflow-orchestrator · project-analyst · feature-planner · task-decomposer

**Examples:**
```
/agents:remove docker-expert
/agents:remove python-pro --global
```

Invoke `agent-installer` in remove mode:
> "Remove agent '$ARGUMENTS'. Check --local, --global, --force flags. Search for agent file. IF agent is in CLAUDE.md protected list AND no --force: refuse with explanation. ELSE: delete file, confirm removal, list remaining agents in same category."
