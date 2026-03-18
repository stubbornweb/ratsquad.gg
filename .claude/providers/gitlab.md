# GitLab Provider

> GitLab provider definition. Copy this file to PROVIDER.md to activate.
> Update provider: gitlab in CLAUDE.md after switching.

---

## Issue Operations

```bash
# Create issue
glab issue create --repo {{owner}}/{{repo}} --title '{{title}}' --description '{{body}}' --label '{{labels}}'

# Get issue
glab issue view {{number}} --repo {{owner}}/{{repo}}

# Add label
glab issue update {{number}} --repo {{owner}}/{{repo}} --label '{{label}}'

# Close issue
glab issue close {{number}} --repo {{owner}}/{{repo}}

# Post comment
glab issue note {{number}} --repo {{owner}}/{{repo}} --message '{{body}}'
```

## MR (Merge Request) Operations

```bash
# Create draft MR
glab mr create --repo {{owner}}/{{repo}} --title '{{title}}' --description '{{body}}' --draft --source-branch {{branch}} --target-branch main

# Mark MR ready
glab mr update {{number}} --repo {{owner}}/{{repo}} --ready

# Merge MR
glab mr merge {{number}} --repo {{owner}}/{{repo}} --squash --delete-source-branch
```

## MCP Tool Configuration

> GitLab MCP is not yet configured. Update this section when MCP is available.

```
mcp_prefix:     mcp__gitlab__
mcp_owner_arg:  namespace="{{owner}}"
mcp_repo_arg:   project="{{repo}}"
```

## Notes

- GitLab uses "Merge Requests" not "Pull Requests"
- Labels work the same way as GitHub
- `glab` CLI must be installed and authenticated: `glab auth login`
- MCP support is partial — use CLI commands where MCP is not available
