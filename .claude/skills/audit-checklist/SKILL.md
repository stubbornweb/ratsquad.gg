---
name: audit-checklist
description: "Comprehensive audit checklist for codebase-auditor. Used during /workflow:audit and /workflow:discover."
---

# Audit Checklist

Reference for `codebase-auditor`. Check each section during every audit.

## Architecture

- [ ] Controllers are thin (< 20 lines per method)
- [ ] Business logic is in services, not controllers
- [ ] No raw queries in controllers
- [ ] Repository/model access is consistent (pick one pattern per domain)
- [ ] No circular dependencies between modules
- [ ] Domain boundaries are clear and respected
- [ ] No framework-specific code in domain/business logic

## Code Quality

- [ ] No files > 300 lines
- [ ] No methods > 30 lines
- [ ] No functions with cyclomatic complexity > 10
- [ ] No dead code (unreachable methods, unused imports)
- [ ] No commented-out code blocks
- [ ] No `TODO` older than 6 months without an issue linked
- [ ] Consistent naming conventions across codebase

## PHP-Specific

- [ ] `declare(strict_types=1)` in all PHP files
- [ ] Explicit return types on all methods
- [ ] No untyped class properties
- [ ] No `mixed` without explanation comment
- [ ] `final` on classes that shouldn't be extended
- [ ] Constructor injection only (no `app()` or `resolve()` calls in logic)
- [ ] No `static` methods in business logic

## JavaScript/TypeScript-Specific

- [ ] No `any` type — use `unknown` or proper types
- [ ] No `var` — use `const` or `let`
- [ ] All functions have return types
- [ ] No implicit `any` from untyped parameters

## Security

- [ ] No secrets or credentials in code (check `.env.example` is clean)
- [ ] Input validation on all user-provided data
- [ ] Output escaping at point of rendering
- [ ] No SQL string interpolation (parameterised queries only)
- [ ] Authentication on all private routes
- [ ] No `eval()` or `exec()` in application code
- [ ] File upload validation (type, size, virus scan if applicable)
- [ ] CSRF protection on state-changing endpoints
- [ ] Dependency vulnerability scan clean

## Testing

- [ ] Overall coverage ≥ 80%
- [ ] All public methods have at least one test
- [ ] Critical paths have ≥ 95% coverage
- [ ] No test files with commented-out tests
- [ ] No tests using `sleep()` (use fakes/mocks)
- [ ] Feature tests use transactions or `RefreshDatabase`
- [ ] Factory definitions are complete

## Dependencies

- [ ] No known CVEs (run `composer audit` / `npm audit`)
- [ ] No packages abandoned for > 2 years
- [ ] No packages outdated by > 2 major versions
- [ ] No unused packages in require/dependencies

## Documentation

- [ ] README has accurate setup instructions
- [ ] CHANGELOG is up to date
- [ ] Complex public methods have docblocks
- [ ] API endpoints are documented
- [ ] Environment variables documented in `.env.example`
