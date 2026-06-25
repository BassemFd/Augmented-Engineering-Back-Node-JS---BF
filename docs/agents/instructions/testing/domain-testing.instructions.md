# Domain Testing Instructions

These guidelines define how to test the domain layer in Bel'Air's Buvette (TypeScript, pnpm monorepo, hexagonal architecture).

## Scope

Domain tests validate pure business behavior:

- entities and value objects
- use cases and business rules
- domain exceptions and invariants
- domain port contracts (as interfaces)

They must not depend on HTTP, ORM, framework decorators, or infrastructure wiring.

## Goals

- Prove business rules are correct and stable.
- Prevent regressions in core use cases.
- Keep domain independent from technical concerns.
- Keep tests fast, deterministic, and highly readable.

## Architecture Boundaries (Mandatory)

- Domain tests must run without real DB/network/framework runtime.
- Domain code must not import application or infrastructure modules.
- Domain models must remain framework-agnostic (no ORM/controller annotations).
- Infrastructure behavior belongs in infrastructure tests, not domain tests.

## Test Levels For Domain

### 1) Use Case Behavior Tests (required)

For each use case:

- verify nominal business flow
- verify edge cases and invalid inputs
- verify business error cases (typed exceptions)
- verify returned domain output contract

### 2) Invariant Tests (required)

For entities/value objects/policies:

- creation constraints
- transitions/status rules
- calculation rules
- immutability/consistency expectations when relevant

### 3) Domain Port Interaction Tests (required)

Use lightweight in-memory fakes for secondary ports:

- ensure use case invokes expected port methods
- ensure side effects are coherent with business rules
- keep fakes simple and explicit (no mocking framework needed)

## Fake Strategy (Recommended)

- Prefer in-process fakes over heavy mocks.
- Keep fake state local to the test fixture.
- Reset state per test (`beforeEach`).
- Avoid hidden behavior in fakes; keep behavior obvious and minimal.

## TDD Micro-step Workflow (HARD STOPS)

Always evolve in micro-steps:

1. Add/adjust one domain test for one behavior.
2. Implement minimal domain change.
3. Run targeted test.
4. Keep green, then continue.

Do not batch unrelated rules in one change.

Forbidden in one big jump:

- adding multiple business rules + broad refactor + naming cleanup at once

Preferred sequence:

1. nominal rule
2. error rule
3. edge case
4. cleanup/refactor

If target test turns red during refactor, stop and fix before any further change.

## Exceptions And Contract Rules

- Domain errors should be typed and expressive.
- Error semantics must be stable and test-covered.
- Public use case contracts should be explicit and tested at boundaries.
- Do not leak technical error types from infrastructure/framework into domain.

## Naming And File Placement

- Domain tests: `src/domain/use-cases/__tests__/**/*.test.ts` (and equivalent domain test folders)
- Domain source: `src/domain/src/**`
- Use explicit test names describing context + expected business outcome.
- Prefer one clear behavior per test.

## Review Checklist (Domain)

- [ ] Nominal, edge, and error paths are covered
- [ ] Typed domain exceptions are asserted where relevant
- [ ] No application/infrastructure dependency leaked into domain tests
- [ ] Fakes are simple, deterministic, and reset between tests
- [ ] Test names reflect business behavior, not technical details
- [ ] No out-of-scope refactor included

## Suggested Validation Commands

From repository root:

```bash
if [[ -f .nvmrc ]]; then nvm use; fi
cd src/domain && pnpm test
cd ../application && pnpm test
cd ../infrastructure && pnpm test
```

For targeted TDD loops:

```bash
if [[ -f .nvmrc ]]; then nvm use; fi
cd src/domain && pnpm exec vitest run use-cases/__tests__/<target-file>.test.ts -t "<target test name>"
```

## Anti-patterns (Do Not Do)

- Adding ORM/framework annotations to domain models.
- Depending on real database/network in domain tests.
- Re-testing HTTP/transport behavior in domain tests.
- Making tests pass by weakening business assertions.
- Bundling unrelated business-rule refactors in one commit.