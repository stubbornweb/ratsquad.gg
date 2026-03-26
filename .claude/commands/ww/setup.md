# ww:setup

> Technical environment setup. Analyze project, detect stack, migrate CLAUDE.md, and configure quality gates.

**Usage:**
- `/ww:setup` — quick analysis (default)
- `/ww:setup <file>` — analyze a discovery document for additional context
- `/ww:setup --deep` — deep analysis with audit + goal questions

## Default Mode (quick)

1. **Migrate from CLAUDE-OLD.md** (if exists)
   - Check if `CLAUDE-OLD.md` exists in project root
   - If yes: read it and extract all rules, config, and instructions
   - Classify each rule:
     ```
     "If Claude forgets this, does something break?"
     → Yes = hard rule → add to CLAUDE.md Non-Negotiable Rules section
     → No = soft rule → write to appropriate rules/ file
     ```
   - Migrate soft rules to correct destination:
     - Git/commit rules → `rules/base/git.md`
     - Testing rules → `rules/base/testing.md`
     - Coding standards → `rules/base/coding-standards.md`
     - Stack-specific → `rules/project/stack.md`
     - Project conventions → `rules/project/conventions.md`
     - Architecture decisions → `rules/project/architecture.md`
     - Feature-specific → `rules/features/<name>.md`
   - Extract config values (owner, repo, stack, quality commands) → update CLAUDE.md sections
   - Show migration summary

2. **Detect technology stack**
   - Languages, frameworks, databases, test runner, lint tools
   - Read: `composer.json`, `package.json`, `requirements.txt`, `wp-config.php`, directory structure

3. **Identify quality gate commands**
   - Lint command for detected stack
   - Test command for detected stack

4. **Update project files**
   - Update `.claude/rules/project/stack.md` with detected stack info
   - Update CLAUDE.md stack section if changed

5. **Checkpoint**
   ```
   Setup complete.

   Detected: [stack] with [lint] and [test] commands.
   Updated: rules/project/stack.md, CLAUDE.md

   Next steps:
   → /ww:discover — capture business context and goals
   → /wws:describe — generate project description
   → /wws:stories — generate user stories
   → /wws:phases — generate implementation phases
   → /ww:plan — create task breakdown
   ```

## Deep Mode (--deep)

Everything in default mode, plus:

1. **Ask about goals**
   ```
   "What are you trying to accomplish with this project?"
   → Ship new features
   → Fix bugs and stabilize
   → Modernize / migrate
   → Security hardening
   → Performance optimization
   ```

2. **Run codebase analysis**
   - Dependency scan (outdated, vulnerabilities)
   - Code quality metrics
   - Test coverage check
   - Architecture pattern detection

3. **Note findings for /ww:do**
   - After analysis, note findings for context:
     - If low coverage → mention "test coverage gaps detected"
     - If security issues → mention "security concerns found"
     - If performance concerns → mention "performance issues found"
     - If legacy patterns → mention "legacy patterns detected"
   - Agents are installed on-demand during `/ww:do` execution

4. **Recommend rules**
   - Suggest project-specific rules based on detected patterns
   - Present each with reasoning, wait for confirmation
