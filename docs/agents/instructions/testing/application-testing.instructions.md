# Application Testing Instructions

These guidelines define how to test the application layer in Bel'Air's Buvette (TypeScript, pnpm monorepo, hexagonal architecture).

## Scope

Application tests validate orchestration and delivery concerns:

- request/response handling (controllers, routers, handlers)
- DTO validation and mapping
- authentication/authorization gates at entry points
- use case wiring through ports
- error-to-HTTP/status translation

They must not re-test domain business rules in depth.

## Goals

- Prove endpoints/use-case entry points behave as expected.
- Ensure application layer correctly translates external inputs to domain calls.
- Verify error handling and status codes are stable.
- Keep tests deterministic, focused, and fast.

## Architecture Boundaries (Mandatory)

- Application depends on domain ports/use cases, not infrastructure implementations.
- Application tests should use fakes/stubs for domain ports when possible.
- No persistence/ORM logic in application layer.
- HTTP concerns stay in application, business invariants stay in domain.

## Test Levels For Application

### 1) Endpoint/Handler Behavior Tests (required)

For each route or application entry point:

- Verify success status and response payload shape.
- Verify invalid payload handling (400/validation errors).
- Verify unknown route/path handling if routing is in scope.
- Verify auth/permission outcomes when applicable.

### 2) Orchestration Tests (required)

Validate that application layer correctly orchestrates domain calls:

- input mapping (DTO -> domain input)
- output mapping (domain output -> DTO)
- expected call timing and branching behavior
- error translation (domain/application errors -> API responses)

### 3) Integration-like Application Tests (recommended)

Test app wiring with in-memory stubs/fakes:

- router + controller + application use case adapter
- no real DB/network required for standard app tests

Use higher-level integration only when required for adapter boundaries.

## TDD Micro-step Workflow (HARD STOPS)

Always evolve in micro-steps:

1. Add/adjust one test for one behavior.
2. Implement minimal app-layer change.
3. Run targeted test.
4. Keep green, then continue.

Do not batch unrelated changes.

Forbidden in one big jump:

- adding route + auth + validation + global error refactor together

Preferred sequence:

1. route/handler happy path
2. validation/error path
3. auth/authorization branch
4. edge cases

If target test turns red during refactor, stop and fix before any additional change.

## Contracts And Error Mapping Rules

- Application contracts (request/response DTOs) must be explicit.
- Domain errors should be mapped deterministically to application errors/statuses.
- Do not leak framework-specific internals into domain models.
- Keep translation logic close to controller/adapter boundaries and cover it with tests.

## Naming And File Placement

- Application tests: `src/application/test/**/*.test.ts`
- Application source: `src/application/src/**`
- Use explicit test names describing context + expected outcome.
- Prefer one behavior assertion focus per test.

## Review Checklist (Application)

- [ ] Success path returns expected status + payload
- [ ] Invalid input path is covered and stable
- [ ] Auth/permission behavior is covered (if applicable)
- [ ] DTO <-> domain mapping is covered
- [ ] Domain errors are translated correctly
- [ ] No infrastructure details leaked into application tests
- [ ] No out-of-scope refactor included

## Suggested Validation Commands

From repository root:

```bash
if [[ -f .nvmrc ]]; then nvm use; fi
cd src/application && pnpm test
cd ../domain && pnpm test
cd ../infrastructure && pnpm test
```

For targeted TDD loops:

```bash
if [[ -f .nvmrc ]]; then nvm use; fi
cd src/application && pnpm exec vitest run test/<target-file>.test.ts -t "<target test name>"
```

## Anti-patterns (Do Not Do)

- Testing domain invariants deeply in application tests (duplication).
- Calling real database/network in standard application unit tests.
- Asserting only status code without payload/contract checks.
- Making tests pass by changing test intent instead of fixing orchestration.
- Bundling unrelated endpoint refactors in one commit.
