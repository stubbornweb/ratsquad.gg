# Usage Guide

## Installation

### Quick Install

```bash
curl -sL https://raw.githubusercontent.com/tuti-cli/workflow-kit/main/scripts/install.sh | bash
```

### Install in a Specific Project

```bash
./install.sh /path/to/my-project
```

### Install Options

```bash
./install.sh --version 1.0.0   # specific version
./install.sh --check            # check for updates only
./install.sh --force            # overwrite modified files
./install.sh --local            # use local kit (development)
```

## First-Time Setup

After installing, run these commands in order:

```bash
/ww:setup                     # technical: stack detection, skills, CLAUDE.md
/ww:discover                   # business: capture thinking, goals, constraints
/wws:describe                  # generate project description from discovery
/wws:stories                  # generate user stories from description
/wws:phases                    # generate implementation phases
/ww:sync                       # apply generation to docs/planning/
```

## Commands Reference

### Setup & Discovery

#### `/ww:init`
Initialize workflow-kit in a new or existing project.

```bash
/ww:init                          # interactive setup
/ww:init --owner=org --repo=name  # with explicit GitHub config
```

#### `/ww:setup`
Technical environment setup. Analyze project, detect stack, migrate CLAUDE.md, recommend skills/agents.

```bash
/ww:setup                    # quick: detect stack, recommend
/ww:setup --deep             # deep: audit + goals + recommendations
```

#### `/ww:discover`
Business discovery interview. Capture thinking to seed project planning.

```bash
/ww:discover                 # interactive interview (full template)
/ww:discover --existing     # analyze existing project, fill gaps
/ww:discover --fresh        # start blank (greenfield)
```

Output: `docs/planning/discovery.md` (frozen after creation)

### Generation Pipeline (`wws:` namespace)

#### `/wws:describe`
Generate project-description.md from docs/planning/discovery.md.

```bash
/wws:describe                # generate from discovery
/wws:describe --force        # overwrite existing
```

Output: `docs/planning/project-description.md`

#### `/wws:stories`
Generate user-stories.md from project description and discovery.

```bash
/wws:stories                # generate stories
/wws:stories --force         # overwrite existing
```

Output: `docs/planning/user-stories.md`

#### `/wws:schema`
Generate database-schema.md if project uses a database.

```bash
/wws:schema                  # generate if DB detected
/wws:schema --force          # regenerate even if exists
```

Output: `docs/planning/database-schema.md` (conditional)

#### `/wws:phases`
Generate implementation phases from user stories.

```bash
/wws:phases                 # generate all phases
/wws:phases --force         # overwrite existing
```

Output: `docs/planning/phases/phase-1.md`, `docs/planning/phases/phase-2.md`, etc.

### Execution

#### `/ww:plan`
Create a task breakdown with priorities. Grills the plan before finalizing.

```bash
/ww:plan                          # plan from current phase
/ww:plan --issue 42             # plan from GitHub issue
/ww:plan --story US-1.1          # plan from specific story
/ww:plan --plan-only              # create plan, no doc changes
/ww:plan --estimate               # include time estimates
```

Output: `.workflow/core/PLAN.md`, proposals to `.workflow/pending-sync.md`

#### `/ww:do`
Execute a plan. Scratch mode from PLAN.md, issues mode from GitHub issue.

```bash
/ww:do                  # scratch mode: execute from PLAN.md
/ww:do 42              # issues mode: execute from GitHub issue #42
/ww:do --dry-run       # show what would happen
/ww:do --worktree      # run in isolated git worktree
/ww:do --quick         # skip review, minimal quality checks
```

#### `/ww:commit`
Run quality gates, review diff, create conventional commit.

```bash
/ww:commit                    # interactive: lint, test, diff, commit
/ww:commit "feat: add auth"   # with specified message
/ww:commit --pr               # commit + push + create PR
```

Shows reminder about pending sync changes after commit.

#### `/ww:sync`
Apply pending document changes from pending-sync.md to docs/planning/.

```bash
/ww:sync                # interactive: approve/reject each change
/ww:sync --dry-run      # show what would be applied
/ww:sync --approve-all  # apply all without asking
/ww:sync --clear        # clear without applying
```

### Architecture

#### `/ww:arch`
Architecture decision workflow: brainstorm, challenge, decide and record.

```bash
/ww:arch brainstorm "auth strategy"    # explore 2-3 options
/ww:arch challenge "auth strategy"     # stress-test a proposal
/ww:arch decide "auth strategy"        # lock in decision
```

Decisions write to pending-sync, applied via `/ww:sync`.

Output: `.workflow/decisions/ADRs/NNN-topic.md`

### Analysis & Health

#### `/ww:audit`
Codebase health check. Produces AUDIT.md and TECH-DEBT.md.

```bash
/ww:audit               # standard health check
/ww:audit --legacy     # deep legacy analysis for migration
/ww:audit --debt-only  # update tech debt from existing audit
```

Output: `.workflow/analysis/AUDIT.md`, `.workflow/analysis/TECH-DEBT.md`

### Utilities

#### `/ww:status`
Show current workflow-kit version, configuration, and project state.

```bash
/ww:status
```

Shows: version, stack, mode, docs status, pending sync count, workflow state.

#### `/ww:update`
Pull latest workflow-kit updates.

```bash
/ww:update            # check and apply
/ww:update --check    # check only
/ww:update --force    # overwrite all files
```

#### `/ww:create`
Generate skills, agents, or GitHub issues. Validates correct type placement.

```bash
# Skills (instincts)
/ww:create skill livewire
/ww:create skill livewire --from vue-expert

# Agents (workers)
/ww:create agent api-tester
/ww:create agent api-tester --from qa-expert

# Issues
/ww:create issue                    # from current context
/ww:create issue --plan             # from PLAN.md
/ww:create issue --adr              # from latest ADR
/ww:create issue --execute         # create + immediately run
```

#### `/ww:rules-add` / `/ww:rules-show`
Add and display rules with automatic placement validation.

```bash
/ww:rules-add project "Always use Form Requests for validation"
/ww:rules-add features/auth "Only use sanctum guards on API routes"

/ww:rules-show              # all rules
/ww:rules-show hard        # CLAUDE.md rules only
/ww:rules-show base        # base layer
/ww:rules-show project     # project layer
```

#### `/ww:improve`
Diagnose workflow problems and suggest fixes.

```bash
/ww:improve
```

Analyzes problems and suggests: rule additions, skill edits, agent adjustments, quality gate fixes.

## Workflow Patterns

### New Project (Full Pipeline)

```bash
/ww:setup                     # technical setup
/ww:discover                  # business interview → docs/planning/discovery.md
/wws:describe                 # → docs/planning/project-description.md
/wws:stories                 # → docs/planning/user-stories.md
/wws:phases                  # → docs/planning/phases/
/ww:sync                      # apply all generation
/ww:plan                      # create first task breakdown
/ww:do                        # implement
/ww:commit                    # quality gates + commit
```

### Existing Project (from scratch)

```bash
/ww:setup                     # technical analysis
/ww:discover --existing       # interview gaps in existing docs
/wws:describe --force         # regenerate description
/wws:stories --force         # regenerate stories
/ww:sync                      # apply
/ww:plan                      # plan current phase
/ww:do                        # implement
/ww:commit --pr              # commit and PR
```

### Continuous Development

```bash
/ww:do 42                    # execute issue #42
/ww:commit                   # commit when done
# ... later ...
/ww:sync                     # apply any pending changes
```

### Architecture Decisions

```bash
/ww:arch brainstorm "caching"
/ww:arch challenge "caching"
/ww:arch decide "caching"
/ww:sync                     # apply ADR to docs/planning/
```

## File Structure

After full setup, your project has:

```
your-project/
├── CLAUDE.md                      # project config + hard rules
├── USAGE.md                       # this guide
├── PROJECT.md                     # auto-generated summary (never edit)
├── docs/
│   └── planning/
│       ├── discovery.md              # frozen: original thinking
│       ├── project-description.md    # living: product overview
│       ├── user-stories.md          # living: features + criteria
│       ├── database-schema.md       # living: data model (if applicable)
│       └── phases/
│           ├── README.md
│           ├── phase-1.md
│           └── phase-2.md
├── .claude/
│   ├── agents/
│   ├── commands/
│   │   ├── ww/                  # pipeline commands
│   │   └── wws/                 # generation commands
│   ├── rules/
│   ├── skills/
│   └── templates/
├── .workflow/
│   ├── pending-sync.md           # proposed doc mutations
│   ├── core/
│   │   └── PLAN.md              # current task breakdown
│   ├── analysis/
│   ├── decisions/
│   ├── execution/
│   └── meta/
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── workflows/
    └── PULL_REQUEST_TEMPLATE.md
```

## Supported Stacks

Auto-detected during `/ww:setup`:

| Stack | Detection | Default Lint | Default Test |
|-------|-----------|-------------|-------------|
| Laravel | `composer.json` has `laravel/framework` | `composer lint` | `composer test` |
| WordPress | `wp-config.php` or `wp-load.php` | `composer lint` | `composer test` |
| React | `package.json` has `react` | `npm run lint` | `npm test` |
| Vue | `package.json` has `vue` | `npm run lint` | `npm test` |
| Next.js | `package.json` has `next` | `npm run lint` | `npm test` |
| Nuxt | `package.json` has `nuxt` | `npm run lint` | `npm test` |
| Node | `package.json` (fallback) | `npm run lint` | `npm test` |
| Python | `requirements.txt` or `pyproject.toml` | `ruff check .` | `pytest` |
| PHP | `composer.json` (fallback) | `composer lint` | `composer test` |

## Quality Gates

Quality gates run automatically before commits. The tier depends on what changed:

| Change Type | Lint | Tests |
|-------------|------|-------|
| Docs only (`.md` files) | Yes | No |
| Config only | Yes | No |
| Refactor | Yes | Yes (maintain existing) |
| Feature / Fix | Yes | Yes |

### When Quality Gates Fail

```
Failure → auto-fix retry (1x) → still failing → report to user
```

| Error Type | Auto-Fix | Retries |
|-----------|----------|---------|
| Lint / format | Run lint auto-fix | 1 |
| Flaky test | Retry different seed | 2 |
| Type error | Stop, show error | 0 |
| Logic error | Stop, back to implementation | 0 |

### Hard Stops

These immediately stop the pipeline:
- Existing test broken by changes
- Type error that can't be auto-fixed
- Coverage dropped below threshold

## Labels System

Run `.github/scripts/setup-labels.sh` to create standardized labels:

**Workflow labels** (drive pipeline selection):
`workflow:feature`, `workflow:bugfix`, `workflow:refactor`, `workflow:modernize`, `workflow:task`

**Type labels** (describe the work):
`type:feature`, `type:bug`, `type:chore`, `type:docs`, `type:security`, `type:performance`, `type:infra`, `type:test`

**Priority labels**:
`priority:critical`, `priority:high`, `priority:medium`, `priority:low`

**Status labels**:
`status:ready`, `status:in-progress`, `status:review`, `status:blocked`, `status:needs-confirmation`

## Document Lifecycle

| File | Created by | Lifecycle |
|------|-----------|----------|
| `docs/planning/discovery.md` | `/ww:discover` | Frozen — never mutated after creation |
| `docs/planning/project-description.md` | `/wws:describe` | Living — updated via `/ww:sync` |
| `docs/planning/user-stories.md` | `/wws:stories` | Living — updated via `/ww:sync` |
| `docs/planning/database-schema.md` | `/wws:schema` | Living — updated via `/ww:sync` |
| `docs/planning/phases/*.md` | `/wws:phases` | Living — updated via `/ww:sync` |
| `PROJECT.md` | auto-generated | Never manually edited |

## Pending Sync Rules

- No command directly mutates `docs/planning/` except generation commands and `/ww:sync`
- `/ww:plan`, `/ww:do`, `/ww:arch` write proposals to pending-sync
- `/ww:sync` is the only command that applies changes to living docs
- Stories marked `[x]` only when ALL acceptance criteria are met
- `PROJECT.md` regenerated after every `/ww:sync`
