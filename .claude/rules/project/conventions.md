# Project Conventions

> Manually maintained — add rules here as you make stack decisions.
> Use `/rules:add project "..."` to add rules mid-session.
> Auto-populated partially by `project-analyst` during `/workflow:init` or `/workflow:discover`.

---

## How to Use This File

This file is your "remember this" list for Claude. Every time Claude writes code
the wrong way and you correct it, add the correction here as a rule.

**Adding a rule mid-session:**
```bash
/rules:add project "Always use Arr::get() not array access on request data"
```

**Editing this file directly:**
```bash
/rules:edit project/conventions
```

**After editing manually, always sync:**
```bash
/workflow:sync
```

---

## Conventions

<!-- Add your project conventions below. Examples shown as comments. -->

<!-- ## PHP / Laravel Conventions -->
<!-- - Always use Arr:: helpers — never native PHP array functions in application code -->
<!-- - Enum names must be suffixed with Enum — PaymentStatusEnum not PaymentStatus -->
<!-- - Prefer Inertia for form submissions — never use axios for page-level navigation -->

<!-- ## Vue / React Conventions -->
<!-- - Always use TypeScript — never plain JS files in src/ -->
<!-- - Custom hooks must be prefixed with use — useUser, usePayment -->
<!-- - Never import directly from node_modules in components — use composables/hooks -->

<!-- ## API Conventions -->
<!-- - All responses must use ResourceCollection format — never raw arrays -->
<!-- - Error responses always include: message, errors, status_code -->

<!-- ## Testing Conventions -->
<!-- - Test files must mirror src directory structure exactly -->
<!-- - All factories must define all fillable fields -->

---

## Forbidden Patterns

<!-- List patterns that Claude must never use in this project. -->

<!-- - Never use $request->all() — always use $request->validated() -->
<!-- - Never use DB::statement() directly — use migrations -->
<!-- - Never commit .env values — use .env.example only -->
