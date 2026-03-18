---
name: issue-template
description: "Standard GitHub issue template for tuti-kit workflow. Used by issue-creator when creating issues from plans, ADRs, patches, and audit findings."
---

# Issue Template

Use this template for all GitHub issues created through tuti-kit workflows.

## Standard Issue Body

```markdown
## Summary
[What needs to be done — 1-2 sentences. Clear enough that someone who wasn't in the planning session understands it.]

## Context
[Why this matters. Background, business reason, or technical driver.]

## Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

## Time Estimate
**Total: ~[X min | X h]**
- Code generation: ~[X min]
- Test fix cycles: ~[X min]
- Manual review: ~10 min

## Technical Notes
[Stack details, constraints, related issues, ADR references. Omit if obvious.]

## Definition of Done
- [ ] Code written and working
- [ ] Tests written and passing
- [ ] Coverage threshold met ([quality.coverage_new]% new code)
- [ ] Code review passed
- [ ] Docs updated (CHANGELOG + inline where applicable)
- [ ] Issue closed with summary comment

<!-- WORKFLOW META -->
workflow_type: feature|bugfix|refactor|modernize|task
project_type: new|existing|legacy
estimated_complexity: small|medium|large
related_issues:
```

## Label Requirements

Every issue needs at minimum:

| Label group | Options | Required? |
|------------|---------|-----------|
| Workflow type | `workflow:feature` `workflow:bugfix` `workflow:refactor` `workflow:modernize` `workflow:task` | Yes |
| Priority | `priority:critical` `priority:high` `priority:normal` `priority:low` | Yes |
| Status | `status:ready` (to start) | Yes |
| Type | `type:feature` `type:bug` `type:chore` `type:security` etc. | Recommended |

## Complexity Guide

| Size | Criteria | Typical estimate |
|------|---------|----------------|
| `small` | Single task, 1-4 files | < 45 min |
| `medium` | Multiple tasks, 4-12 files | 45 min – 2h |
| `large` | Many tasks, 12+ files | > 2h → consider splitting |
