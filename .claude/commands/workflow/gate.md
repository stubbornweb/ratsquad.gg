# workflow:gate

> Run the full quality gate: lint + types + tests + coverage. The pre-commit check.

**Usage:**
- `/workflow:gate` — run full gate
- `/workflow:gate --fix` — run gate and auto-fix what can be fixed
- `/workflow:gate --quick` — lint + types only, skip tests (fast check)

**When to use:**
- Before any commit to confirm everything passes
- When something seems broken and you want a full diagnosis
- After making changes that affect multiple files
- When CI failed and you need to replicate locally

**What it does:**
1. Reads CLAUDE.md → all quality config
2. Determines change type (docs-only / config-only / feature / security)
3. Runs tiered gate based on change type:

| Change type | Lint | Types | Tests | Coverage |
|-------------|------|-------|-------|---------|
| docs only | ✓ | — | — | — |
| config only | ✓ | — | — | — |
| refactor | ✓ | ✓ | ✓ | maintain |
| feature/fix | ✓ | ✓ | ✓ | 90% new |
| security | ✓ | ✓ | ✓ | 95% affected |

4. Each check runs in sequence — stops at first hard failure
5. Reports: ✅ pass / 🔴 fail for each step
6. On failure: shows exactly what needs fixing

**--fix mode:**
- Lint failures → runs auto-fix (`composer lint` / `npm run lint --fix`)
- Refactor errors → runs Rector auto-fix if PHP stack
- Type errors → reports only, no auto-fix possible
- Test failures → reports, suggests `/workflow:test --write`

**Full pass output:**
```
✅ Gate: PASSED

Lint:     ✅ clean
Types:    ✅ 0 errors
Tests:    ✅ 47 passed, 0 failed
Coverage: ✅ 87% overall / 92% new code

Safe to commit.
```

**Fail output:**
```
🔴 Gate: BLOCKED

Lint:     ✅ clean
Types:    ✅ 0 errors
Tests:    🔴 2 failed
Coverage: ⏭ skipped (tests failed)

Failed tests:
  ✗ it creates a payment with idempotency key
  ✗ it throws when stripe returns 402

Run /workflow:test --filter "payment" to debug.
```

**Related:**
- `/workflow:test` — run tests only
- `/workflow:commit` — runs gate automatically before committing

Invoke `coverage-guardian` and run stack quality commands:
> "Run /workflow:gate. Read CLAUDE.md quality config: lint_command, test_command, coverage_min, coverage_new. Determine change type from git diff --name-only. Apply tiered gate based on change type. Run lint_command from CLAUDE.md. Run type check if applicable (phpstan or tsc). Run test_command from CLAUDE.md. Invoke coverage-guardian to check thresholds. IF --fix: run auto-fix commands for lint/refactor failures. Report each step clearly. Final verdict: PASSED or BLOCKED with specific failures listed."
