# workflow:pr

> Create a pull request for the current branch.

**Usage:**
- `/workflow:pr` — create PR for current branch
- `/workflow:pr --draft` — create as draft (default behaviour)
- `/workflow:pr --ready` — create and immediately mark ready for review

**When to use:**
- After `/workflow:commit` in scratch mode when you want a PR
- Anytime you want a PR from the current branch
- In issues mode this runs automatically — but you can call it manually too

**Pre-requisites:**
- Current branch has commits not in main
- GitHub auth: `gh auth status`
- CLAUDE.md has `repo_owner` and `repo_name` set

**What it does:**
1. Reads CLAUDE.md → `repo_owner`, `repo_name`, `workflow_mode`
2. Reads PROVIDER.md → `create_pr` command pattern
3. Detects current branch name
4. In issues mode: reads issue number from branch name → fetches issue title + acceptance criteria
5. Generates PR title and body:
   - Title from branch name or issue title
   - Body: what changed, why, acceptance criteria status, testing notes, `Closes #N`
6. Creates draft PR using PROVIDER.md command
7. AskUserQuestion: "Mark as ready for review now?" → Yes | Keep as draft
8. Posts PR link as comment on linked issue (issues mode only)
9. Updates issue label to `status:review` (issues mode only)

**PR body generated:**
```markdown
## Summary
[what was changed and why]

## Changes
- [key change 1]
- [key change 2]

## Acceptance Criteria
- [x] Criterion 1
- [x] Criterion 2

## Testing
[how to verify this works]

## Notes
[any caveats, follow-ups, or context]

Closes #N
```

**Related:**
- `/workflow:commit` — commit before PR
- `/workflow:issue <N>` — full pipeline that auto-creates PR
- `/workflow:gate` — verify quality before creating PR

Invoke directly — read CLAUDE.md and PROVIDER.md:
> "Run /workflow:pr. Read CLAUDE.md for repo_owner, repo_name, workflow_mode. Read .claude/providers/PROVIDER.md for create_pr command. Get current branch: `git branch --show-current`. If issues mode: extract issue number from branch name (e.g. feature/42-slug → #42), fetch issue via PROVIDER.md get_issue. Generate PR title and body including Closes #N. Use PROVIDER.md create_pr command to create draft PR. AskUserQuestion about marking ready. In issues mode: post PR link comment on issue and update label to status:review via PROVIDER.md commands."
