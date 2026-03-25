# wws:describe

> Generate project-description.md from docs/planning/discovery.md.

**Usage:**
- `/wws:describe` — generate from existing docs/planning/discovery.md
- `/wws:describe --force` — overwrite existing project-description.md

**Input:** `docs/planning/discovery.md`
**Output:** `docs/planning/project-description.md`

## Steps

1. **Check prerequisites**
   - Verify `docs/planning/discovery.md` exists
   - If missing: error "Run /ww:discover first to create docs/planning/discovery.md"
   - If `docs/planning/project-description.md` exists and no `--force`: warn and exit

2. **Read discovery**
   - Parse all answered questions from `docs/planning/discovery.md`
   - Identify which sections are filled vs blank

3. **Extract and distill**

   **Overview section:**
   - Name: from "Business/Project Name"
   - One-liner: distill "What is your business/project" into 2-3 sentences
   - Version: "0.x (Pre-release)" or detect from existing docs
   - License: infer or "MIT"
   - Repo: from git remote or infer

   **The Problem:**
   - Extract "What specific problem are you trying to solve"
   - Remove subjective language ("we hate", "frustrating") — keep factual
   - 3-5 sentences max

   **The Solution:**
   - From "What would success look like" — describe the solution
   - Key interactions and commands (if software product)
   - The "aha" moment

   **Target Audience:**
   - From "Who will use this solution" and "User technical skill level"
   - Who, skill level, prerequisites

   **Features:**
   - From "Must-have features" in discovery — list as features
   - Group by domain (Installation, Core Functionality, etc.)
   - No [x]/[ ] status markers — that's user-stories
   - "Planned" vs "Implemented" split NOT shown here — that lives in user-stories

   **Architecture:**
   - Stack: infer from codebase analysis or "to be determined"
   - Design principles: infer from constraints and patterns
   - High-level diagram: text-based architecture description
   - Data storage: from "What data do you work with" + "Where is this stored"
   - Platform/OS support: from technical constraints

   **Competitive Landscape:**
   - From "Reference examples" — what did they like/dislike
   - Comparison table: your solution vs competitors mentioned
   - What you do better

   **Contributing:**
   - Infer from stack (coding standards, test requirements)

4. **Validate against discovery** (light grill)
   - Check for contradictions between sections (e.g., constraints vs features)
   - Flag anything in discovery marked "unknown" that affects architecture
   - If issues found:
     ```
     Found [N] issues in discovery → description mapping:
     - [issue 1]
     - [issue 2]

     Resolve before generating? → Fix now | Proceed anyway | Cancel
     ```

5. **Write project-description.md**

   ```markdown
   # [Project Name]

   **Version:** 0.x
   **License:** MIT
   **Repository:** [owner/repo]

   ---

   ## Overview

   [2-3 sentences on what this is]

   ## The Problem

   [What pain exists]

   ## The Solution

   [How it solves it, key interactions]

   ## Target Audience

   [Who, skill level, prerequisites]

   ## Features

   ### [Domain 1]
   - [Feature description]

   ### [Domain 2]
   - [Feature description]

   ## Architecture

   ### Stack
   [Technologies used to build it]

   ### Design Principles
   [Key architectural decisions]

   ### Data Storage
   [How data is stored and where]

   ### Platform Support
   [OS/environment support]

   ## Competitive Landscape

   | Tool | [Competitor 1] | [Competitor 2] |
   |------|-----------------|-----------------|
   | Feature A | Yes | No |
   | Feature B | No | Yes |

   ## Contributing

   [Coding standards, testing requirements]
   ```

6. **Checkpoint**
   ```
   docs/planning/project-description.md generated from discovery.

   Review and edit? Changes will be captured in pending-sync.

   Next: /wws:stories — generate user stories from description
   ```
