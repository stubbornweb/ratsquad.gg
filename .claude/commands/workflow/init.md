# workflow:init

> Bootstrap tuti-kit into a new project from scratch.

**Usage:**
- `/workflow:init` — interactive setup for a new project

**When to use:**
- Starting a brand new project
- Adding tuti-kit to an existing project that has no CLAUDE.md yet
- Re-initialising after changing stack or provider

**What it does:**
1. Invokes `project-analyst` in init mode
2. Asks: stack, extras, GitHub owner, repo name
3. Writes complete `CLAUDE.md` config block
4. Creates `.claude/rules/project/` starter files
5. Installs stack-appropriate agents via agent-installer
6. Sets `workflow_mode: scratch`
7. Runs `/workflow:sync` to build `active-rules.md`
8. Invokes `description-writer` to create `.workflow/PROJECT.md`
9. Prints setup summary with next steps

**After init:**
```
→ /workflow:plan       — plan your first feature
→ /rules:add project   — add your coding conventions
→ /rules:show          — audit what Claude will see
→ /workflow:mode set issues  — when project grows
```

**Related:**
- `/workflow:discover` — for onboarding an existing codebase
- `/workflow:mode set` — to change mode later

Invoke `project-analyst` in init mode:
> "Run in /workflow:init mode. This is a new project. Ask the user for: stack (laravel|vue|react|wordpress|next|nuxt), any extras (inertia|livewire|filament|tailwind|alpine — multi-select), GitHub owner, and repository name. Then write CLAUDE.md, create project rules starter files, install stack agents via agent-installer, set workflow_mode to scratch, run /workflow:sync, invoke description-writer for PROJECT.md, and print setup summary."
