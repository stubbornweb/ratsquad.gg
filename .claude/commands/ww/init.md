# ww:init

> Initialize workflow-kit in a new or existing project.

**Usage:**
- `/ww:init` — interactive initialization
- `/ww:init --owner=org --repo=name` — with explicit GitHub config

## Steps

1. **Check prerequisites**
   - Verify `gh` CLI is installed and authenticated
   - Verify project directory exists

2. **Detect or ask for GitHub config**
   - If `--owner` and `--repo` provided: use them
   - Else if CLAUDE.md exists: extract owner/repo
   - Else: ask user for owner and repo

3. **Detect stack**
   - Read `composer.json` → Laravel, WordPress, PHP
   - Read `package.json` → React, Vue, Nuxt, Next, Node
   - Read `requirements.txt` / `pyproject.toml` → Python
   - Read `wp-config.php` → WordPress
   - Set quality gate commands based on stack

4. **Ask workflow mode**
   ```
   "What's your goal?"
   → Build something new (scratch)
   → Improve existing codebase (issues)
   ```

5. **Download and install workflow-kit**
   - Fetch latest release from tuti-cli/workflow-kit
   - Create `.claude/` structure (agents/, commands/ww/, skills/, rules/)
   - Create `.workflow/` structure (core/, analysis/, decisions/, execution/, meta/)
   - Replace template variables in all files

6. **Set up GitHub labels** (issues mode only)
   - Run `.github/scripts/setup-labels.sh` to create type/priority/status labels

7. **Create or migrate CLAUDE.md**

   **If no CLAUDE.md exists:**
   - Create from `config/CLAUDE.example.md` template
   - Fill in: owner, repo, stack, lint command, test command, mode

   **If CLAUDE.md exists:**
   - Rename existing file to `CLAUDE-OLD.md`
   - Create fresh `CLAUDE.md` from `config/CLAUDE.example.md` template
   - Fill in detected config values (owner, repo, stack, quality commands)
   - Inform user:
     ```
     Existing CLAUDE.md renamed to CLAUDE-OLD.md
     Fresh CLAUDE.md created from template.

     Next steps:
     → /ww:setup — analyze project, configure quality gates (migrate from CLAUDE-OLD.md)
     → /ww:discover — capture business context and goals
     → /wws:describe — generate project description from discovery
     ```

8. **Post-install guidance**
   ```
   Workflow-kit installed.

   Next steps:
   → /ww:setup — technical setup, stack detection, quality gates
   → /ww:discover — business discovery interview
   → /wws:describe — generate project description
   ```
