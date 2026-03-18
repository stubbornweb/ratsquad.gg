# workflow:commit

> Create a conventional commit for current staged/unstaged changes. Works in all modes.

**Usage:**
- `/workflow:commit` — interactive commit with diff review
- `/workflow:commit "message"` — commit with provided message (still shows diff)
- `/workflow:commit --pr` — commit then immediately create PR

**When to use:**
- After completing work in scratch mode (after `/workflow:build`)
- At a checkpoint during a long feature
- Any time you want a properly formatted conventional commit

**What it does:**
1. Reads CLAUDE.md → `workflow_mode`, issue number if active
2. Loads `base/git.md` rules → conventional commit format
3. Shows full diff summary
4. AskUserQuestion: "Review changes?" → Approve all | Review per file | Cancel
5. If per-file: shows each changed file, you choose Keep | Discard | Edit
6. Generates commit message: `type(scope): subject (#N if issues mode)`
7. AskUserQuestion: "Commit?" → Yes | Edit message | Cancel
8. Runs quality gate first if uncommitted changes exist: lint + tests must pass
9. Creates commit
10. If `--pr`: invokes `/workflow:pr`

**Commit format (from base/git.md rules):**
```
feat(auth): add sanctum token login endpoint (#42)
fix(webhook): handle duplicate event delivery (#87)
refactor(user): extract password reset service (#91)
test(payment): add coverage for failed charge (#103)
docs(readme): update local development setup
chore(deps): update laravel to 11.x
```

**In scratch mode:** Issue number `(#N)` is omitted unless you provide one.
**In issues mode:** Issue number is required — pulled from active feature context.

**Quality gate before commit:**
If uncommitted changes exist and tests haven't run recently: runs lint + tests first. Blocks commit if they fail.

**Related:**
- `/workflow:gate` — run quality checks without committing
- `/workflow:pr` — create PR after commit
- `/workflow:build` — full scratch mode execution that ends with commit

Invoke directly — read rules and current diff:
> "Run /workflow:commit. Read CLAUDE.md for workflow_mode and active issue number. Load .claude/rules/base/git.md for commit format. Run git diff --staged and git diff to show pending changes. Show diff summary. AskUserQuestion about review preference. If per-file review: show each file diff and ask Keep/Discard/Edit. Generate conventional commit message following base/git.md format — include issue number if in issues mode. AskUserQuestion to confirm. Run lint check first if changes are uncommitted. Create commit. If --pr flag: invoke /workflow:pr."
