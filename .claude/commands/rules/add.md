# rules:add

> Add a rule to a specific layer. Writes the rule and re-syncs active-rules.md.

**Usage:**
- `/rules:add base "<rule text>"` — add to global base layer
- `/rules:add project "<rule text>"` — add to this project's layer
- `/rules:add features/<name> "<rule text>"` — add to a specific feature's rules

**Examples:**
```
/rules:add project "Always use Arr:: helpers, never native PHP array functions"
/rules:add project "Enum names must be suffixed with Enum — PaymentStatusEnum not PaymentStatus"
/rules:add features/auth "Only use Laravel Sanctum — never raw session auth"
/rules:add features/payments "Always pass idempotency key to Stripe — never omit it"
/rules:add base "Never use abstract classes — prefer interfaces + concrete implementations"
```

**When to use:**
- You catch Claude doing something wrong mid-session → add the rule immediately
- You made a stack decision that Claude should always respect
- An ADR was written → `/arch:decide` calls this automatically
- Any time you think "Claude keeps forgetting to..."

**What it does:**
1. Determines target file based on layer argument
   - `base` → `.claude/rules/base/conventions.md` (creates if absent)
   - `project` → `.claude/rules/project/conventions.md` (creates if absent)
   - `features/<name>` → `.claude/rules/features/<name>.md` (creates if absent)
2. Appends the rule to the appropriate section in the target file
3. Runs `/workflow:sync` automatically to rebuild `active-rules.md`
4. Confirms: "Rule saved to [layer]. Active rules updated."

**Shorthand for mid-session catches:**
```
/rules:add project "Always use Carbon::parse() not new Carbon() — consistent timezone handling"
```
Claude fixes the current code, adds the rule, syncs, and continues. The rule is now permanent.

Invoke directly — read CLAUDE.md for rules paths, append rule to correct file, then run /workflow:sync:
> "The user wants to add a rule: '$ARGUMENTS'. Parse the layer from the first argument (base|project|features/<name>). Determine the target file path from CLAUDE.md rules config. If the file does not exist, create it with a basic header. Append the rule as a bullet point under a '## Convention' or '## Rules' section. Then run /workflow:sync to rebuild active-rules.md. Confirm with: 'Rule added to [layer/file]. Active rules rebuilt.'"
