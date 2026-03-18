# Architecture Rules

> Base layer — structural patterns used across all projects.
> Project-specific ADR outcomes live in `.claude/rules/project/architecture.md`.

---

## Layered Architecture

### Controllers / Route Handlers
- **Never** put business logic in controllers
- Controllers are allowed to: validate input, call one service, return response
- Maximum method length in a controller: 20 lines
- **Never** query the database from a controller directly

### Services
- Business logic lives in service classes — one responsibility per service
- Services may call repositories, other services, or external APIs
- Services must be injectable (constructor injection)
- **Never** make services static

### Repositories
- All database queries go through repository classes or Eloquent scopes
- **Never** write raw SQL in controllers or services — use the query builder via a repository
- Repository interface goes in a contracts/interfaces directory
- Concrete implementation is bound in a service provider

### Models / Entities
- Models hold data shape and relationships only
- **Never** add business logic to models
- Accessors/mutators are acceptable for simple transformations
- Scopes are acceptable for reusable query constraints

---

## Dependency Direction

```
Controller / Handler
        ↓
    Service
        ↓
  Repository / External API
        ↓
    Database / Third Party
```

Dependencies always point downward. Lower layers never know about upper layers.

---

## Boundaries

- **Never** import framework-specific code into domain/business logic classes
- Framework integration happens at the outer layer (controllers, providers, middleware)
- Domain logic must be testable without booting the framework

---

## Module Structure (for larger projects)

When a project has multiple domains, each domain follows this structure:

```
app/
├── [Domain]/
│   ├── Actions/       ← single-purpose action classes
│   ├── DTOs/          ← data transfer objects
│   ├── Services/      ← business logic
│   ├── Repositories/  ← data access
│   ├── Events/        ← domain events
│   └── Exceptions/    ← domain-specific exceptions
```

Cross-domain communication happens via events or shared service interfaces — never via direct class imports across domain boundaries.

---

## Forbidden Architectural Patterns

```php
// ❌ Never — business logic in controller
public function store(Request $request)
{
    $user = User::where('email', $request->email)->first();
    $user->stripe_id = Stripe::createCustomer($user);
    $user->save();
    Mail::send(new WelcomeEmail($user));
    return response()->json($user);
}

// ✅ Always — controller delegates to service
public function store(StoreUserRequest $request): JsonResponse
{
    $user = $this->userService->createFromRequest($request->validated());
    return response()->json(UserResource::make($user));
}
```

```php
// ❌ Never — service knows about HTTP
class UserService
{
    public function create(Request $request): User { ... }
}

// ✅ Always — service works with plain data
class UserService
{
    public function create(CreateUserDTO $data): User { ... }
}
```
