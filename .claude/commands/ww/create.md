# ww:create

> Generate skills, agents, or issues with validation. Enforces three-layer model rules.

**Usage:**
- `/ww:create skill <name>` — create a new skill
- `/ww:create skill <name> --global` — install to ~/.claude/skills/
- `/ww:create agent <name>` — create a new agent
- `/ww:create agent <name> --global` — install to ~/.claude/agents/
- `/ww:create issue` — create GitHub issue from context
- `/ww:create issue --plan` — create from PLAN.md
- `/ww:create issue --adr` — create from latest ADR
- `/ww:create issue --patch <file>` — create from patch
- `/ww:create issue --execute` — create and immediately run `/ww:do N`

## Create Skill

1. **Validate type** (grill)
   ```
   "Does this need to think?"
   → No = pipeline step. REJECT: "This belongs in command logic, not a skill."
   → Yes, depends on context = agent. REDIRECT: "This sounds like an agent. Use /ww:create agent <name>."
   → Yes, always same way = skill. PROCEED.

   "Does this change how things are done, or does it do a thing?"
   → Does a thing = agent. REDIRECT.
   → Changes behavior = skill. PROCEED.
   ```

2. **Determine skill category**
   - Stack-specific (laravel, vue, react, nextjs) → `skills/stack/`
   - Workflow behavior → `skills/workflow/`
   - General tool/pattern → `skills/tools/`

3. **Fetch existing boilerplates from VoltAgent** (ALWAYS)
   - Search VoltAgent awesome-claude-code-subagents for relevant skills:
     `https://github.com/VoltAgent/awesome-claude-code-subagents`
   - Fetch README.md to find categories and available skills
   - Look for matching or related skills by name/domain
   - If matches found:
     ```
     Found existing boilerplates on VoltAgent:
     1. [name] — [description] (category: [cat])
     2. [name] — [description] (category: [cat])

     Use as starting point?
     → Use #1 | Use #2 | Start fresh | Cancel
     ```
   - If no matches: proceed to step 5 with template only

4. **Fetch and analyze the selected boilerplate**
   - Download the raw .md file from VoltAgent
   - Read its content — identify useful patterns vs noise
   - Note what's reusable and what needs to be rewritten

5. **Read project context for adaptation**
   - `.claude/rules/project/stack.md` → stack details
   - `docs/planning/project-description.md` → what the project is
   - `docs/planning/discovery.md` → constraints, goals, technical choices
   - Existing `.claude/skills/` → avoid duplication

6. **Generate high-quality skill using template structure**
   - Read `.claude/templates/skill-template.md` as structure guide
   - Start from VoltAgent boilerplate (if available)
   - Adapt to project context:
     - Remove irrelevant patterns (e.g., remove React patterns from Laravel skill)
     - Add project-specific patterns from discovery/description
     - Ensure every pattern is actionable, not generic
   - Quality bar: every skill MUST have:
     - Core Patterns (specific, actionable, with "when" and "why")
     - Anti-Patterns (table: Don't / Do Instead / Why)
     - Quality Bar (measurable expectations)
     - File Conventions (naming, directory structure)
   - Description must be specific enough for correct auto-loading

7. **Show draft for approval**
   ```
   Skill draft (based on [VoltAgent source / template]):
   [show full content]

   Write to .claude/skills/{category}/{name}/SKILL.md?
   → Approve | Edit | Cancel
   ```

8. **Offer global install for reusability**
   ```
   Also install globally for reuse in other projects?
   → Yes (install to ~/.claude/skills/) | No (project only)
   ```

9. **Write file**

## Create Agent

1. **Validate type** (grill)
   ```
   "Does this need to think?"
   → No = pipeline step. REJECT.
   → Yes, always same way = skill. REDIRECT to /ww:create skill.
   → Yes, depends on context = agent. PROCEED.

   "Does this do a thing and return a result?"
   → No = not an agent. REJECT.
   → Yes = agent. PROCEED.
   ```

2. **Fetch existing boilerplates from VoltAgent** (ALWAYS)
   - Search VoltAgent awesome-claude-code-subagents for relevant agents:
     `https://github.com/VoltAgent/awesome-claude-code-subagents`
   - Fetch README.md to find categories and available agents
   - Look for matching or related agents by name/domain
   - If matches found: present list, ask user to pick one or start fresh
   - If no matches: proceed with template only

3. **Fetch and analyze the selected boilerplate**
   - Download raw .md file from VoltAgent
   - Identify: clear deliverable, input/output contract, useful patterns
   - Note what to keep vs remove

4. **Read project context for adaptation**
   - `.claude/rules/project/stack.md` → stack details
   - `docs/planning/project-description.md` → what the project is
   - `docs/planning/discovery.md` → constraints, goals, technical choices
   - Check which skills exist (agent may declare skill dependencies)

5. **Generate high-quality agent using template structure**
   - Read `.claude/templates/agent-template.md` as structure guide
   - Start from VoltAgent boilerplate (if available)
   - Adapt to project:
     - Clear input/output contract
     - Correct model selection (haiku for fast/simple, sonnet for analysis, opus for complex)
     - Skill dependencies that actually exist
     - Project-specific focus areas
   - Quality bar: every agent MUST have:
     - Clear job description (one sentence)
     - Input contract (what it receives)
     - Output format (structured report)
     - Scope boundaries (what it does NOT do)
     - Model selection with reasoning

6. **Show draft for approval**

7. **Offer global install for reusability**
   ```
   Also install globally for reuse in other projects?
   → Yes (install to ~/.claude/agents/) | No (project only)
   ```

8. **Write file** to `.claude/agents/{name}.md`

## Create Issue

1. **Determine source**
   - If `--plan`: read `.workflow/core/PLAN.md`
   - If `--adr`: read latest `.workflow/decisions/ADRs/*.md`
   - If `--patch <file>`: read specified patch file
   - If no flag: determine from recent work context

2. **Format issue body**
   ```markdown
   ## Summary
   [What needs to be done]

   ## Context
   [Why this matters]

   ## Acceptance Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2

   ## Technical Notes
   [Stack details, constraints]

   ## Definition of Done
   - [ ] Code written and tested
   - [ ] Docs updated
   - [ ] Issue closed with summary
   ```

3. **Apply labels**
   - Detect type from content: `type:feature`, `type:bug`, etc.
   - Set priority
   - Set `status:ready`

4. **Show for approval**
   ```
   Create this issue?
   → Create | Edit | Cancel
   ```

5. **Create via GitHub**
   - `gh issue create --repo {owner}/{repo} --title "..." --body "..." --label "..."`
   - Report issue number

6. **If --execute:** immediately run `/ww:do N` with new issue number
