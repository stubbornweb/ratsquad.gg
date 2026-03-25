# ww:recommend

> Fetch VoltAgent agents and recommend the best matches for your project.

**Usage:**
- `/ww:recommend` — fetch VoltAgent catalog + recommend based on project context
- `/ww:recommend --stack-only` — skip discovery scan, recommend by stack only
- `/ww:recommend --list-all` — show all available VoltAgent agents without filtering

**Prerequisites:**
- `/ww:setup` should have run (stack detected in .claude/rules/project/stack.md)
- `/ww:discover` recommended but optional (goals improve recommendations)

## Steps

1. **Gather project context**
   - Read `.claude/rules/project/stack.md` → detected stack
   - Read `docs/planning/discovery.md` → project goals, status, pain points (if exists)
   - Scan codebase for tech signals:
     - `Dockerfile` / `docker-compose.yml` → Docker
     - `.github/workflows/` / `Jenkinsfile` / `.gitlab-ci.yml` → CI/CD
     - `*.graphql` / graphql in deps → GraphQL
     - `terraform/` / `*.tf` → Terraform
     - `k8s/` / `kubernetes/` → Kubernetes
     - `*.sql` / heavy ORM usage → SQL
     - `ios/` / `android/` / React Native / Flutter deps → mobile
     - PostgreSQL in config/deps → PostgreSQL
   - List already installed: scan `.claude/agents/`

2. **Fetch VoltAgent catalog**
   - Fetch: `https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/README.md`
   - Parse all agents from the 10 categories into a flat list: name, category, description
   - If fetch fails: show error and abort

3. **Score each agent against project context**

   Scoring is additive — an agent can match multiple criteria.

   **Stack match (+30 points):**
   - `laravel-specialist` → detected stack is laravel
   - `php-pro` → detected stack is php or laravel
   - `react-specialist` → detected stack is react
   - `vue-expert` → detected stack is vue or nuxt
   - `nextjs-developer` → detected stack is next
   - `wordpress-master` → detected stack is wordpress
   - `python-pro` → detected stack is python
   - `django-developer` → detected stack is python AND "django" in deps
   - `fastapi-developer` → detected stack is python AND "fastapi" in deps
   - `javascript-pro` → detected stack is node
   - `typescript-pro` → detected stack is typescript or ts in package.json
   - `golang-pro` → detected stack is go
   - `rust-engineer` → detected stack is rust
   - `swift-expert` → detected stack is swift
   - `kotlin-specialist` → detected stack is kotlin
   - `java-architect` → detected stack is java
   - `csharp-developer` → detected stack is csharp or dotnet
   - `laravel-specialist` → detected stack is laravel

   **Goal/status match (+20 points):**
   - `qa-expert` / `test-automator` → "test" or "coverage" in discovery pain points
   - `security-auditor` / `penetration-tester` → "security" or "vulnerability" in discovery
   - `performance-engineer` / `database-optimizer` → "performance" or "slow" in discovery
   - `legacy-modernizer` / `refactoring-specialist` → "legacy" or "modernize" or "debt" in discovery
   - `error-detective` / `debugger` → "bug" or "fix" or "stabilize" in goals
   - `code-reviewer` → "features" or "ship" in goals
   - `documentation-engineer` → "documentation" or "docs" in discovery
   - `api-designer` → "api" in goals OR greenfield project
   - `database-administrator` → greenfield project
   - `devops-engineer` → "deploy" or "ci" or "infrastructure" in discovery

   **Tech signal match (+15 points):**
   - `docker-expert` → Dockerfile or docker-compose found
   - `devops-engineer` → CI/CD config found
   - `graphql-architect` → GraphQL detected
   - `terraform-engineer` → Terraform detected
   - `kubernetes-specialist` → Kubernetes detected
   - `sql-pro` → SQL files or heavy ORM usage
   - `postgres-pro` → PostgreSQL detected
   - `mobile-developer` → mobile directories or deps detected
   - `cloud-architect` → multi-cloud signals detected

   **Universal (+5 points, always added):**
   - `git-workflow-manager`
   - `refactoring-specialist` (only if not already installed)

   **Already installed → mark as skipped, do not score**

4. **Sort by score descending**

5. **Present top recommendations**

   ```
   Fetched [N] agents from VoltAgent.
   Top recommendations for your project:
   (Laravel + "ship features + stabilize" goals + Dockerfile detected)

   CRITICAL (score 50+):
    1. [agent] laravel-specialist — Laravel 10+ patterns, Eloquent, middleware
    2. [agent] qa-expert — test coverage gaps in your goals

   HIGH (score 30-49):
    3. [agent] error-detective — bug fixing in your goals
    4. [agent] code-reviewer — shipping features in your goals
    5. [agent] docker-expert — Dockerfile detected

   MEDIUM (score 15-29):
    6. [agent] documentation-engineer — keep docs current
    7. [agent] git-workflow-manager — universal recommendation

   Already installed (skipped): security-auditor, architect-reviewer

   Select: numbers (e.g. "1,2,4"), "all critical", "all high+", "all", or "skip"
   ```

6. **Install selected**
   - For each selected item, run:
     - `/ww:create agent <name> --from <voltagent-name>`
   - Show progress: "Installing 1/N: laravel-specialist..."
   - `/ww:create` handles fetching from VoltAgent, rewriting for project, validation, writing file

7. **Checkpoint**
   ```
   Installed [N] agents.

   Agents: laravel-specialist, qa-expert, error-detective, code-reviewer

   These are now active in your project.
   Run /ww:status to see full configuration.
   ```
