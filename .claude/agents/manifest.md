# Agent Manifest

> Defines when agents are spawned. Used by `/ww:do` for on-demand installation.

## Pipeline-Driven Agents

These run at specific pipeline stages, deterministically.

| Stage | Agent | Trigger |
|-------|-------|---------|
| On quality gate failure | `error-detective` | Auto-fix retry exhausted |
| Post-implementation review | `code-reviewer` | Before commit (if installed) |
| Pre-commit | `security-auditor` | If changes touch auth/input/sensitive data (if installed) |

## Task-Driven Agents

These are spawned based on task keywords in PLAN.md.

| Task Keywords | Agent | Notes |
|---------------|-------|-------|
| security, auth, vulnerability, injection, xss, csrf | `security-auditor` | |
| performance, slow, optimize, bottleneck, query, n+1 | `performance-engineer` | |
| test, coverage, qa, quality | `qa-expert` | |
| architecture, design, structure | `architect-reviewer` | |
| refactor, debt, cleanup, technical | `refactoring-analyzer` | |
| bug, error, fix, diagnose | `error-detective` | Also used in failure handling |

## On-Demand Install Logic

When `/ww:do` needs to spawn an agent:

1. Check if agent exists in `.claude/agents/<name>.md`
2. If missing → run `/ww:create agent <name>` to install
3. Validate skill dependencies in agent frontmatter exist in `.claude/skills/`
4. If skill missing → error with list of required skills
5. Once installed, spawn agent

## Skill Dependencies

> Currently no agents require external skills. If an agent declares `skills:` in frontmatter and that skill doesn't exist in `.claude/skills/`, installation fails with a clear error.

## Agent Availability

All 7 agents are bundled with workflow-kit and ship in `kit/.claude/agents/`:

- `code-reviewer`
- `error-detective`
- `security-auditor`
- `qa-expert`
- `performance-engineer`
- `architect-reviewer`
- `refactoring-analyzer`

During `/ww:do`, agents are installed on-demand — only when their trigger condition is met.
