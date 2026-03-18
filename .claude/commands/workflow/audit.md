# workflow:audit

> Run a comprehensive codebase audit. Produces AUDIT.md and TECH-DEBT.md.

**Usage:**
- `/workflow:audit` — standard audit
- `/workflow:audit --legacy` — deep legacy audit (more thorough, takes longer)

**When to use:**
- Periodically on active projects to catch drift
- Before a major refactor to know what you're dealing with
- When performance or quality has degraded
- When onboarding a new contributor — show them the health baseline

**What it does:**
1. Archives existing `.workflow/AUDIT.md` if present:
   `→ .workflow/audits/YYYY-MM-DD-audit.md`
2. Runs `codebase-auditor`:
   - Dependency scan (security + freshness)
   - Code quality metrics
   - Test coverage gaps
   - Security check
   - Architecture pattern violations
3. Writes fresh `.workflow/AUDIT.md`
4. Runs `tech-debt-mapper`:
   - Maps findings to priority + effort estimates
   - Merges with existing `.workflow/TECH-DEBT.md` (doesn't overwrite resolved items)
5. AskUserQuestion: "Create GitHub issues for tech debt findings?"
   → Yes: batch creates issues, links them in TECH-DEBT.md
   → No: leave for manual review

**--legacy mode adds:**
- EOL/abandoned dependency detection
- Deprecated pattern scanning
- Migration path assessment
- Complexity hotspot mapping (files/methods that are most risky to change)

**After audit:**
```bash
/rules:show               # check if rules match what you found
/rules:add project "..."  # add rules based on existing patterns found
/workflow:plan            # plan a migration or cleanup phase
```

**Related:**
- `/workflow:discover` — full onboarding (includes audit)
- `/workflow:migrate` — execute a migration phase

Invoke `codebase-auditor` then `tech-debt-mapper`:
> "Run /workflow:audit. Read CLAUDE.md for stack and quality config. IF .workflow/AUDIT.md exists: archive it to .workflow/audits/YYYY-MM-DD-audit.md before proceeding. Invoke codebase-auditor with mode: standard (or legacy if --legacy flag). After AUDIT.md is written, invoke tech-debt-mapper to produce TECH-DEBT.md with priorities and AI-assisted effort estimates. Ask user about creating GitHub issues from findings."
