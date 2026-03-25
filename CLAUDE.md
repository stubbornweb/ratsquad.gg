# rats-site

## Repository
- owner: (no remote configured)
- repo: rats-site

## Stack
- framework: Next.js 16.1.7 (App Router)
- language: TypeScript 5.9.3
- runtime: Node.js 22, npm 10
- styling: Tailwind CSS 4.2.1
- lint: npm run lint
- typecheck: npx tsc --noEmit
- test: echo 'No tests configured'

## Workflow
- mode: scratch
- version: local

## Non-Negotiable Rules

### Quality
- Run `npm run lint` before every commit
- Run `echo 'No tests configured'` before every commit
- Never commit failing tests
- Never ship without tests for new code

### Git
- Conventional commits: `<type>(<scope>): <description>`
- Never commit directly to main
- Never force push without explicit approval
- Never commit secrets or credentials

### Workflow
- Plan before code — present plan, wait for approval
- Never create agents for pipeline steps
- Skills = instincts, Agents = workers, Pipelines = steps
- "Does this need to think?" — validation rule for all new components

### Security
- Array syntax for shell execution — never string interpolation
- Use `.env` for config, ensure in `.gitignore`

## Context
- Stack details: .workflow/core/STACK.md
- Product description: .workflow/core/PROJECT.md
- Current plan: .workflow/core/PLAN.md
- Tech debt: .workflow/analysis/TECH-DEBT.md
