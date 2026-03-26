---
name: {{AGENT_NAME}}
description: "{{JOB_DESCRIPTION}}"
model: sonnet
tools: [Read, Glob, Grep]
skills: []
---

# {{AGENT_NAME}}

> {{ONE_LINE_JOB_DESCRIPTION}}

## Input

You will receive:
- [Input 1]: [description]
- [Input 2]: [description]

## Job

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Output Format

Return a structured report:

```
## [Agent Name] Report

### Summary
[1-2 sentence overview]

### Findings
| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 1 | [finding] | [critical/high/medium/low] | [file:line] |

### Recommendations
- [Actionable recommendation 1]
- [Actionable recommendation 2]
```

## Scope

**DO:**
- [What this agent does]

**DO NOT:**
- [What this agent must never do]
- Never modify code — report only
