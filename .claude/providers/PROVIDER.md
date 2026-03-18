# GitHub Provider

> Active provider definition for all agents.
> Variables `{{owner}}` and `{{repo}}` are read from CLAUDE.md at runtime.

---

## Issue Operations

```bash
# Create issue
gh issue create --repo {{owner}}/{{repo}} --title '{{title}}' --body '{{body}}' --label '{{labels}}'

# Get issue details
gh issue view {{number}} --repo {{owner}}/{{repo}} --json title,body,labels,state,assignees,comments

# Add label
gh issue edit {{number}} --repo {{owner}}/{{repo}} --add-label '{{label}}'

# Remove label
gh issue edit {{number}} --repo {{owner}}/{{repo}} --remove-label '{{label}}'

# Close issue
gh issue close {{number}} --repo {{owner}}/{{repo}} --comment '{{comment}}'

# Post comment
gh issue comment {{number}} --repo {{owner}}/{{repo}} --body '{{body}}'

# List issues
gh issue list --repo {{owner}}/{{repo}} --label '{{label}}' --state open --json number,title,labels
```

## PR Operations

```bash
# Create draft PR
gh pr create --repo {{owner}}/{{repo}} --title '{{title}}' --body '{{body}}' --draft --base main --head {{branch}}

# Mark PR ready
gh pr ready {{number}} --repo {{owner}}/{{repo}}

# Get PR details
gh pr view {{number}} --repo {{owner}}/{{repo}} --json title,body,state,mergeCommit,files

# Merge PR
gh pr merge {{number}} --repo {{owner}}/{{repo}} --squash --delete-branch
```

## Branch Operations

```bash
# Create and checkout branch
git checkout -b {{branch}} && git push -u origin {{branch}}

# Pull latest main
git checkout main && git pull origin main

# Delete branch after merge
git branch -d {{branch}} && git push origin --delete {{branch}}
```

## MCP Tool Configuration

When using GitHub MCP tools instead of `gh` CLI:

```
mcp_prefix:     mcp__github__
mcp_owner_arg:  owner="{{owner}}"
mcp_repo_arg:   repo="{{repo}}"
```

MCP tool examples:
```
mcp__github__create_issue(owner="{{owner}}", repo="{{repo}}", title="...", body="...", labels=[...])
mcp__github__get_issue(owner="{{owner}}", repo="{{repo}}", issue_number={{number}})
mcp__github__create_pull_request(owner="{{owner}}", repo="{{repo}}", title="...", body="...", head="{{branch}}", base="main")
mcp__github__add_labels_to_issue(owner="{{owner}}", repo="{{repo}}", issue_number={{number}}, labels=[...])
```

## Label System

### Workflow Type (one required per issue)
- `workflow:feature`
- `workflow:bugfix`
- `workflow:refactor`
- `workflow:modernize`
- `workflow:task`

### Priority (one required per issue)
- `priority:critical`
- `priority:high`
- `priority:normal`
- `priority:low`

### Status
- `status:ready`
- `status:in-progress`
- `status:review`
- `status:done`
- `status:blocked`
- `status:needs-confirmation`
- `status:rejected`

### Type
- `type:feature`
- `type:bug`
- `type:chore`
- `type:security`
- `type:performance`
- `type:infra`
- `type:docs`
- `type:test`

## Variable Resolution

All `{{variable}}` placeholders are resolved by reading CLAUDE.md:

| Variable | Source |
|----------|--------|
| `{{owner}}` | `CLAUDE.md → repo_owner` |
| `{{repo}}` | `CLAUDE.md → repo_name` |
| `{{branch}}` | Current git branch or newly created branch name |
| `{{number}}` | Issue or PR number from context |
| `{{title}}` | Constructed from task or issue |
| `{{body}}` | Constructed from template |
| `{{label}}` | From label system above |
