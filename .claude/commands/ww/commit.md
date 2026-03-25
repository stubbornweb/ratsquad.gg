# ww:commit

> Run quality gates, review diff, create conventional commit.

**Usage:**
- `/ww:commit` — interactive commit with diff review
- `/ww:commit "message"` — commit with specified message
- `/ww:commit --pr` — commit, push, and create PR

## Steps

1. **Check for pending sync**
   - Read `.workflow/pending-sync.md` if it exists
   - Count pending proposals
   - If proposals exist:
     ```
     ⚠️  [N] pending doc changes queued.

     Run /ww:sync to apply them before or after commit.

     Proceed with commit?
     → Continue | Run /ww:sync first | Cancel
     ```

2. **Run quality gates**
   - Read lint and test commands from CLAUDE.md
   - Run lint command
   - Run test command
   - Both must pass before proceeding
   - If fail: auto-fix retry (1x), then stop

3. **Review changes**
   - Run `git diff` to show all changes
   - Run `git status` to show file list
   ```
   Review changes before commit?
   → Approve all | Review each file | Cancel
   ```
   - If "Review each file": show diff per file, ask Keep | Discard | Edit

4. **Stage changes**
   - Stage approved files with `git add`

5. **Generate commit message**
   - If message provided: validate it follows conventional commit format
   - If not: generate from diff analysis
   - Format: `<type>(<scope>): <description>`
   - Add issue reference `(#N)` if in issues mode
   ```
   Commit with: "feat(auth): add login endpoint (#42)"?
   → Yes | Edit message | Cancel
   ```

6. **Commit**
   - `git commit -m "<message>"`

7. **Post-commit reminder**
   ```
   ✓ Committed successfully.

   [N] pending doc changes still queued.
   Run /ww:sync to apply them.
   ```

8. **If --pr flag:**
   - Push: `git push origin <branch>`
   - Create draft PR: `gh pr create --draft --repo {owner}/{repo}`
   - PR body: what changed, why, link to issue
   - Mark ready: `gh pr ready --repo {owner}/{repo}`
   - Update issue label: add `status:review`
