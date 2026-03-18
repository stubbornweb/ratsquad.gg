# Testing Rules

> Base layer — testing standards for all stacks.
> Stack-specific test commands live in `CLAUDE.md quality config`.
> Critical path definitions live in `.claude/rules/project/conventions.md`.

---

## Coverage Thresholds

| Scope | Minimum |
|-------|---------|
| Overall project | 80% |
| New code in any PR | 90% |
| Critical paths (see below) | 95% |

### What counts as a critical path
- Authentication and authorisation logic
- Any method that creates, updates, or deletes data
- Payment processing or financial calculations
- Anything marked with `// @critical`
- Security-sensitive operations (password hashing, token generation)

---

## Test Naming

Every test name must complete the sentence: **"it [does something]"**

```php
// ✅ Good
it('returns 404 when user does not exist')
it('creates a stripe customer on registration')
it('throws InvalidArgumentException when email is malformed')

// ❌ Bad
it('test user')
it('works correctly')
it('UserService')
```

---

## Test Structure — Arrange / Act / Assert

Every test follows the AAA pattern with a blank line between each section:

```php
it('sends welcome email after registration', function () {
    // Arrange
    Mail::fake();
    $data = CreateUserDTO::make(email: 'user@example.com', name: 'Test');

    // Act
    $user = $this->userService->create($data);

    // Assert
    Mail::assertSent(WelcomeEmail::class, fn ($mail) => $mail->hasTo($user->email));
});
```

---

## No Mocks Policy

- **Never** mock classes you own — test the real implementation
- **Always** mock external services (Stripe, Mailgun, S3) and third-party HTTP
- Use Laravel fakes for framework services: `Mail::fake()`, `Queue::fake()`, `Storage::fake()`
- Use in-memory databases (SQLite `:memory:`) or database transactions for persistence tests

```php
// ❌ Never mock your own service
$userService = Mockery::mock(UserService::class);
$userService->shouldReceive('create')->andReturn($fakeUser);

// ✅ Test the real service with a fake external dependency
Mail::fake();
$user = $this->userService->create($data); // real service runs
Mail::assertSent(WelcomeEmail::class);
```

---

## Test Organisation

```
tests/
├── Unit/          ← pure logic, no database, no HTTP
│   └── Services/
│   └── DTOs/
│   └── Helpers/
├── Feature/       ← full stack with database
│   └── Commands/
│   └── API/
│   └── Http/
└── Integration/   ← external services (run separately, require credentials)
```

- Unit tests must never touch the database
- Feature tests use `RefreshDatabase` or transactions
- Integration tests are tagged and excluded from CI default run

---

## What Must Always Be Tested

Every PR that ships code must include tests for:

1. **Happy path** — the expected correct outcome
2. **Validation failures** — invalid input rejected correctly
3. **Edge cases** — empty collections, null values, boundary values
4. **Exception paths** — correct exception thrown for error conditions
5. **Side effects** — emails sent, jobs dispatched, events fired

---

## Test Data

- **Always** use factories for model creation in tests
- **Never** hardcode IDs — let factories generate them
- **Never** share test state between tests — each test is independent
- Use `beforeEach` for common setup, never class-level state

---

## JavaScript / TypeScript Testing

- Use Vitest for unit and component tests
- Use Playwright for end-to-end tests
- Component tests use the testing-library pattern: test behaviour, not implementation
- **Never** snapshot-test component output — it breaks on every style change

```typescript
// ❌ Never test implementation details
expect(wrapper.find('.btn-primary').exists()).toBe(true)

// ✅ Test user-facing behaviour
expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
```

---

## Forbidden Testing Patterns

```php
// ❌ Never skip test body
it('does something') // no callback — test never runs

// ❌ Never comment out tests
// it('broken test', function () { ... })

// ❌ Never use sleep() in tests
sleep(2); // use fake timers or queue fakes

// ❌ Never test implementation details
expect($service->internalProperty)->toBe('value')
```
