---
name: workflow-rules
description: "Global pipeline rules for all tuti-kit agents. Stack-agnostic. Covers pre-flight protocol, pipeline stages, quality gates, retry logic, and communication patterns. Loaded by all orchestration agents."
---

# Workflow Rules

These rules apply to every agent in the tuti-kit system, regardless of stack.

## Pre-Flight Protocol

Before any implementation, every agent must:

1. Read `CLAUDE.md` — extract `workflow_mode`, `stack`, `repo_owner`, `repo_name`, `quality` config
2. Read `.claude/providers/PROVIDER.md` — load all command patterns
3. Load rules layers:
   - `.claude/rules/base/*.md` — unconditional
   - `.claude/rules/project/*.md` — unconditional
   - `.claude/rules/features/[relevant].md` — based on task context
4. Load patches selectively via `.workflow/patches/INDEX.md`
5. Load relevant ADRs from `.workflow/ADRs/`

**Never skip pre-flight.** Never use hardcoded values that belong in CLAUDE.md.

## Core Principles

### 1. Plan Before Code
- Always present a plan with time estimates first
- Wait for explicit approval before implementing
- Never write code without user approval
- Use the estimation model from architecture: generation + fix cycles + manual review

### 2. Quality Gates Are Mandatory
- Tests must pass before any commit — no exceptions
- Lint must pass before any commit
- Coverage thresholds must be met (see CLAUDE.md quality config)
- No bypassing quality gates for any reason

### 3. Documentation Is Required
- Update CHANGELOG.md for user-visible changes
- Update README.md for usage changes
- Add inline docs for new public methods
- No commit without doc updates when they apply

### 4. Conventional Commits Only
Format from `.claude/rules/base/git.md` — always follow it.

### 5. Issue Closure Required (Issues mode only)
- Every completed issue must be closed by `issue-closer`
- Summary must include: what was done, tests added, time taken vs estimated
- PLAN.md archived on every close

## Pipeline Stages

```
SETUP → IMPLEMENT → [REVIEW + QUALITY parallel] → COMMIT → PR → CLOSE
```

### Stage rules

**SETUP:**
- Read CLAUDE.md and all rules layers
- Validate branch situation (AskUserQuestion if not on main)
- Create branch via PROVIDER.md pattern
- Update issue status label

**IMPLEMENT:**
- Present estimate breakdown before starting
- Follow all active rules — if unsure, check `.workflow/rules/active-rules.md`
- Commit checkpoint every 3-5 tasks
- Surface overrun warning if task exceeds estimate by 50%

**REVIEW + QUALITY (parallel):**

```
IMPLEMENT done
    │
    ├─────────────────────┐
    ▼                     ▼
 REVIEW               QUALITY
 code-reviewer        [quality.lint_command]
 security-auditor?    [quality.test_command]
 perf-engineer?       coverage check
    │                     │
    └──────────┬──────────┘
               ▼
          both pass → COMMIT
          either fails → STOP
```

**Tiered quality gates:**

| Change type | Detection | Lint | Tests | Coverage |
|-------------|-----------|------|-------|----------|
| docs only | Only `.md` files | ✓ | ✗ | ✗ |
| config only | Only config files | ✓ | ✗ | ✗ |
| refactor | `type:refactor` label | ✓ | ✓ | maintain |
| feature/fix | default | ✓ | ✓ | 90% new |
| security | `type:security` label | ✓ | ✓ | 95% affected |

Quality commands come from `CLAUDE.md quality config` — never hardcode `composer test` or similar.

**COMMIT:**
- Self-review full diff
- AskUserQuestion: "Review changes?" → Approve all | Review per file | Cancel
- Use conventional commit format per `base/git.md`
- AskUserQuestion: "Create commit?" → Yes | Edit message | Cancel
- Include issue `(#N)` in Issues mode

**PR:**
- Create draft first, then mark ready
- Link to issue with `Closes #N`
- Full description with testing notes

**CLOSE (Issues mode only):**
- `issue-closer` posts summary, archives PLAN.md, cleans up, closes issue

## Smart Retry Logic

| Failure pattern | Detection | Strategy |
|-----------------|-----------|----------|
| Flaky test | Intermittent, random | Retry 2× different seed |
| Lint error | Pint, syntax errors | Run lint auto-fix, retry once |
| Refactor error | Rector errors | Run refactor auto-fix, retry once |
| Type error | PHPStan/TypeScript | No retry — escalate to human |
| Timeout | "exceeded", "timeout" | Increase timeout, retry once |
| Dependency error | "not found", "not installed" | Clear cache, retry once |
| Logic error | Assertion failed | Back to IMPLEMENT stage |

**Max retries by type:**
- Flaky: 2 (different seeds)
- Lint: 1 (after auto-fix)
- Refactor: 1 (after auto-fix)
- Timeout: 1
- Dependency: 1
- Type/Logic: 0 (escalate)

**Hard stops — never retry, always escalate:**
- Existing test broken → STOP IMMEDIATELY, do not commit
- Type error after auto-fix attempt → STOP, needs human
- Coverage drops below threshold → STOP, write missing tests first

## Selective Patch Loading

```
1. Read .workflow/patches/INDEX.md
2. Extract keywords from current task/issue
3. Match to categories:
   docker/container → docker
   test/coverage    → testing
   security/vuln    → security
   php/laravel      → php
   vue/react/js     → frontend
   workflow/agent   → workflow
4. Load only matching patch categories
5. Full load if INDEX.md older than 24h
```

## Estimation Standards

- Always estimate in minutes (< 60 min) or hours (≥ 60 min) — never days
- Always show breakdown: generation + fix cycles + manual review
- Add 10% buffer
- Flag total > 4h for splitting
- Surface overrun warning at 50% over estimate during execution

## Agent Communication (Issues mode)

Post on GitHub issue at pipeline start using PROVIDER.md comment command:

```markdown
**🚀 Workflow Started**
Pipeline: [type] | Squad: [agents] | Branch: `[branch]` | Estimate: ~[time]
Rules: base ([N]) + project ([N]) + features ([N])
```

Post on blocking failure:
```markdown
⚠️ **Pipeline Blocked**
Stage: [stage] | Error: [message] | Action required: [what to do]
```
