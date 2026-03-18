# workflow:mode

> View or change the active workflow mode.

**Usage:**
- `/workflow:mode` — show current mode
- `/workflow:mode set scratch` — switch to Scratch/MVP mode
- `/workflow:mode set issues` — switch to GitHub Issues mode
- `/workflow:mode set legacy` — switch to Legacy/Audit mode

**When to use:**
- Graduating a scratch project to Issues mode when it grows
- Temporarily switching back to scratch for a quick experiment
- Setting up legacy mode before running `/workflow:discover`

**Mode differences:**

| Mode | Pipeline | Issue required? | PR required? |
|------|----------|----------------|-------------|
| `scratch` | PLAN → BUILD → TEST → COMMIT | No | No (optional) |
| `issues` | SETUP → IMPLEMENT → REVIEW+QUALITY → COMMIT → PR → CLOSE | Yes | Yes |
| `legacy` | DISCOVER → AUDIT → PLAN-MIGRATION → PHASES | No | Yes per phase |

**What it does:**
- Reads current `workflow_mode` from `CLAUDE.md`
- Updates `workflow_mode` value in `CLAUDE.md`
- Confirms the change

**Switching to `issues` mode — additional checks:**
1. Verifies `repo_owner` and `repo_name` are set in CLAUDE.md
2. Verifies `.claude/providers/PROVIDER.md` exists
3. Verifies GitHub CLI is available: `gh auth status`
4. If any check fails: reports what is missing and how to fix

**Example flow — graduating from Scratch to Issues:**
```
/workflow:mode set issues
→ ✅ repo_owner: your-org
→ ✅ repo_name: your-repo
→ ✅ gh CLI authenticated
→ workflow_mode updated to: issues

Now use /workflow:issue <N> to execute GitHub issues.
Create issues from plans with /workflow:create-issue
```

Invoke directly — read and update CLAUDE.md:
> "Read CLAUDE.md. IF no argument: print current workflow_mode and brief description of what it means. IF 'set <mode>': validate mode is one of scratch|issues|legacy. If switching to issues: check repo_owner, repo_name, PROVIDER.md existence, and gh auth status — report any missing pieces. Update workflow_mode in the CLAUDE.md config block. Confirm: 'Workflow mode set to: [mode]' and print relevant next-step commands."
