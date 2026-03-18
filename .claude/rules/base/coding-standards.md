# Coding Standards

> Base layer — applies to every project regardless of stack.
> Specific stack overrides live in `.claude/rules/project/conventions.md`.

---

## PHP Standards

### Types
- **Always** use strict types: `declare(strict_types=1);` at top of every file
- **Always** add explicit return types on every method and function
- **Always** add property types — never untyped class properties
- **Never** use `mixed` unless absolutely unavoidable — if used, add a comment explaining why

### Classes
- **Always** declare classes `final` unless inheritance is explicitly intended
- **Never** use `abstract` classes — prefer interfaces + concrete implementations
- **Always** use constructor property promotion for simple DTOs and value objects
- **Never** use static methods for business logic — they cannot be injected or tested

### Dependency Injection
- **Always** inject via constructor — never use `app()`, `resolve()`, or `Container::make()` in application code
- **Never** use `new ClassName()` inside methods — always inject the dependency
- Exception: value objects and DTOs may use `new` internally

### Arrays
- **Always** use `Arr::` Laravel helpers — never native PHP array functions in application code
  - `Arr::get()` not `$array['key'] ?? null`
  - `Arr::has()` not `isset($array['key'])` or `array_key_exists()`
  - `Arr::first()` not `reset()` or `array_shift()`
  - `Arr::wrap()` not `is_array() ? ... : [...]`
- Exception: raw loops and native functions are acceptable in performance-critical paths with a comment

### Naming
- **Classes:** PascalCase — `UserAuthService`
- **Methods/functions:** camelCase — `getUserById()`
- **Variables:** camelCase — `$userId`
- **Constants:** SCREAMING_SNAKE — `MAX_RETRY_COUNT`
- **Interfaces:** PascalCase + `Interface` suffix — `UserRepositoryInterface`
- **Enums:** PascalCase + `Enum` suffix — `PaymentStatusEnum`, `UserRoleEnum`
  - **Never** use bare names: `Status`, `Type`, `Role` are forbidden as enum names

### Enums
- **Always** use backed enums with explicit string values — never int-backed or pure enums
- **Always** suffix enum names with `Enum` — `PaymentStatusEnum` not `PaymentStatus`
- **Always** use descriptive case names — `PaymentStatusEnum::Pending` not `PaymentStatusEnum::P`

---

## JavaScript / TypeScript Standards

### Types
- **Always** use TypeScript — never plain JavaScript in application code
- **Never** use `any` — use `unknown` and narrow it, or define a proper type
- **Always** define return types on functions
- **Prefer** `interface` over `type` for object shapes that may be extended

### Imports
- **Always** use named imports — avoid default imports except for framework components
- **Always** group imports: external packages → internal modules → relative paths
- **Never** use barrel files (`index.ts` re-exports) in large modules — they hide dependencies

### Variables
- **Always** use `const` — use `let` only when reassignment is truly needed
- **Never** use `var`

---

## Universal Standards (all stacks)

### Comments
- **Never** add comments that describe *what* code does — the code should be self-explanatory
- **Always** add comments that explain *why* — non-obvious decisions, tradeoffs, workarounds
- Mark critical paths with `// @critical` for coverage enforcement

### Error handling
- **Never** silently swallow exceptions — always log or rethrow
- **Never** use empty catch blocks
- **Always** use specific exception types — never catch `\Exception` or `\Throwable` at business logic level

### File organisation
- One class/interface/enum per file
- File name must match class name exactly
- Keep files under 300 lines — if longer, extract responsibilities

---

## Forbidden Patterns

```php
// ❌ Never
$arr['key'] ?? null;           // use Arr::get()
array_key_exists('k', $arr);   // use Arr::has()
reset($arr);                   // use Arr::first()
new Service();                 // inject it
app(Service::class);           // inject it
static::doSomething();         // inject and call

// ✅ Always
Arr::get($arr, 'key');
Arr::has($arr, 'k');
Arr::first($arr);
```

```typescript
// ❌ Never
const x: any = getValue();
var count = 0;
import DefaultExport from './module';

// ✅ Always
const x: unknown = getValue();
const count = 0;
import { NamedExport } from './module';
```
