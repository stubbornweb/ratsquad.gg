# workflow:bugfix

> Bug fix pipeline with regression test enforcement and patch knowledge capture.

**Usage:**
- `/workflow:bugfix <N>` — fix issue #N with full bug pipeline
- `/workflow:bugfix <N> --quick` — skip review stage

**When to use:**
- Any issue labelled `workflow:bugfix` or `type:bug`
- When a bug needs a regression test + documented patch
- Use this instead of `/workflow:issue` for bugs — it adds patch writing

**What it does (extra steps vs normal issue pipeline):**
1. Runs standard issue pipeline (SETUP → IMPLEMENT → REVIEW+QUALITY → COMMIT → PR)
2. After fix is implemented: `error-detective` confirms root cause identified
3. Regression test written and verified passing before commit
4. `patch-writer` documents the fix in `.workflow/patches/`
5. `patch-writer` updates `.workflow/patches/INDEX.md`
6. If pattern warrants a rule: suggests `/rules:add` to developer
7. `issue-closer` includes "Bug Fix Details" section in closure summary

**Regression test requirement:**
Every bugfix commit MUST include a test that:
- Reproduces the exact bug scenario
- Fails without the fix
- Passes with the fix

No regression test = pipeline blocked at QUALITY stage.

**Patch file created:**
`.workflow/patches/YYYY-MM-DD-[slug].md` — documents problem, root cause, solution, prevention steps.

**Related:**
- `/workflow:issue` — general issue pipeline (no patch writing)
- `/workflow:gate` — run quality checks only
- `/workflow:evolve` — absorb accumulated patches into agent improvements

Invoke `issue-executor` then `master-orchestrator` in bugfix mode, then `patch-writer`:
> "Execute bugfix pipeline for issue #$ARGUMENTS. Read CLAUDE.md and PROVIDER.md. Invoke issue-executor to fetch and validate. In master-orchestrator, use 'error-detective' as primary agent. After implementation: verify regression test exists and passes — block commit if missing. Invoke patch-writer to document the fix with root cause, solution, prevention steps, and update INDEX.md. If patch-writer suggests a rule, surface it to developer. Then proceed with commit, PR, close."
