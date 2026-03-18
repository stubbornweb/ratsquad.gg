# workflow:test

> Run tests or write missing tests for current changes.

**Usage:**
- `/workflow:test` — run all tests
- `/workflow:test --filter "test name"` — run specific test
- `/workflow:test --coverage` — run with coverage report
- `/workflow:test --write` — identify and write missing tests for changed files
- `/workflow:test --watch` — run in watch mode (JS stacks)

**When to use:**
- During development to verify current changes
- Before committing to confirm tests pass
- After pulling changes from others
- When coverage looks low: `--write` to fill gaps

**What it does:**
1. Reads CLAUDE.md → `quality.test_command`, `quality.test_runner`
2. Uses the correct test command for the stack — never hardcodes
3. Runs tests, shows output
4. If `--coverage`: shows coverage report + flags files below threshold
5. If `--write`: scans changed files, identifies untested methods/functions, writes missing tests

**Stack-aware commands used:**
| test_runner | Command used |
|-------------|-------------|
| pest | `./vendor/bin/pest [--filter "..."] [--coverage]` |
| phpunit | `./vendor/bin/phpunit [--filter "..."] [--coverage-text]` |
| vitest | `npx vitest [run] [--reporter verbose]` |
| jest | `npx jest [--testNamePattern "..."] [--coverage]` |

**--write mode:**
1. Gets list of changed files: `git diff --name-only HEAD`
2. For each changed file: checks if test file exists
3. For each untested public method: writes test following `base/testing.md` rules
4. Tests follow: AAA pattern, descriptive names, no mocks of own classes
5. Runs tests after writing to confirm they pass

**Related:**
- `/workflow:gate` — full quality gate (lint + types + tests + coverage)
- `/workflow:coverage` — coverage check only

Invoke `test-engineer` or `qa-expert` directly:
> "Run /workflow:test. Read CLAUDE.md quality config for test_command and test_runner. IF --write: get changed files via git diff, identify untested methods, invoke test-engineer to write missing tests following .claude/rules/base/testing.md conventions. IF --filter: run with filter argument. IF --coverage: run with coverage and show per-file report. IF --watch: run in watch mode (JS only). Always use quality.test_command from CLAUDE.md — never hardcode."
