# workflow:review

> Trigger code review on current changes. Runs code-reviewer + optional specialists.

**Usage:**
- `/workflow:review` — standard code review
- `/workflow:review --security` — include security-auditor
- `/workflow:review --performance` — include performance-engineer
- `/workflow:review --full` — all reviewers

**When to use:**
- Before submitting a PR you're unsure about
- After a complex refactor
- When working on security-sensitive code
- When performance matters for the changed code

**What it does:**
1. Reads CLAUDE.md → stack, quality config
2. Loads all rules layers → reviewer checks against your actual rules
3. `code-reviewer` checks:
   - Adherence to `base/coding-standards.md` rules
   - Adherence to `project/conventions.md`
   - Any relevant feature rules
   - Architecture violations against `base/architecture.md`
   - Missing tests or low coverage
   - Documentation gaps
4. `security-auditor` (if `--security` or `--full`):
   - Input validation
   - Authentication/authorisation
   - Secret exposure risk
   - SQL injection / XSS potential
5. `performance-engineer` (if `--performance` or `--full`):
   - N+1 query risks
   - Missing indexes
   - Memory usage patterns
   - Cache opportunities

**Output format:**
```
## Code Review

### Must Fix (blocks PR)
- [file:line] [issue description]

### Should Fix (strongly recommended)
- [file:line] [issue description]

### Consider (optional improvements)
- [file:line] [suggestion]

### ✅ Looks good
- [what was done well]

Overall: ✅ Ready / 🟠 Fix before merge / 🔴 Needs significant work
```

**Related:**
- `/workflow:gate` — quality gate (lint/tests/coverage)
- `/workflow:issue <N>` — runs review automatically as part of pipeline

Invoke `code-reviewer` and optionally `security-auditor`, `performance-engineer`:
> "Run /workflow:review. Read CLAUDE.md and load all rules layers. Get current diff: git diff HEAD. Invoke code-reviewer to check against active rules. IF --security or --full: invoke security-auditor. IF --performance or --full: invoke performance-engineer. Produce structured output: Must Fix / Should Fix / Consider / Looks Good sections. Overall verdict."
