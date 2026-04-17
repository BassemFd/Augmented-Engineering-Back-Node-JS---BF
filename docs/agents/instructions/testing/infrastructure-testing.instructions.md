# Infrastructure Testing Instructions

These guidelines define how to test the infrastructure layer in Bel'Air's Buvette (TypeScript, pnpm monorepo, hexagonal architecture).

## Scope

Infrastructure tests validate adapters that implement domain ports:

- persistence repositories
- external service clients
- message publishers/subscribers
- technical mappers (domain <-> persistence)

They must not duplicate domain business-rule tests.

## Goals

- Prove infrastructure adapters satisfy domain contracts.
- Catch regressions in persistence, serialization, and external integrations.
- Keep domain free from infrastructure dependencies.
- Keep tests deterministic, isolated, and fast.

## Architecture Boundaries (Mandatory)

- Domain layer must not import infrastructure code.
- Domain entities/use cases must not contain ORM annotations or framework decorators.
- Infrastructure-specific schemas/entities stay in infrastructure.
- Mapping between domain models and persistence models must be explicit and tested.

## Test Levels For Infrastructure

### 1) Adapter Contract Tests (required)

For each adapter implementing a domain port:

- Verify required port methods exist and return expected shape.
- Verify error mapping from technical failures to expected adapter behavior.
- Verify side effects (save, update, publish, call count).

Example: repository implementing `IOrderRepository` must prove `save(order)` contract behavior with realistic data.

### 2) Mapping Tests (required)

Test both directions:

- domain -> persistence
- persistence -> domain

Cover:

- nominal fields
- optional fields
- enum/status conversion
- null/empty collections

### 3) Integration Tests With Simulated Infra (recommended)

Use in-memory DB/fake service/testcontainer as needed to validate adapter wiring.

- Prefer in-memory for speed during TDD micro-steps.
- Add higher-fidelity integration (container/real engine) when adapter behavior depends on DB/driver specifics.

## TDD Micro-step Workflow (HARD STOPS)

Always work in micro-steps:

1. Move or create minimal adapter code.
2. Run only target test.
3. Keep green.
4. Continue to next micro-step.

Do not combine all actions in one change.

Forbidden in one big jump:

- move code + add ORM + add custom queries + refactor everything

Required sequence:

1. contract alignment
2. ORM wiring
3. specific queries

If target test becomes red during refactor, stop and fix immediately before any further change.

## ORM Rules

- ORM config must stay in infrastructure layer only.
- Domain must remain plain TypeScript (no ORM decorators/annotations).
- If ORM needs extra fields/tables, model them as infrastructure persistence entities.
- Add mapping tests to prove translation with domain models.

## Naming And File Placement

- Infrastructure test files: `src/infrastructure/test/**/*.test.ts`
- Infrastructure source files: `src/infrastructure/src/**`
- Keep one clear behavior per test.
- Use explicit test names with context + expected result.

## Review Checklist (Infrastructure)

- [ ] Adapter behavior matches domain port contract
- [ ] Domain layer has no infrastructure import/decorator leakage
- [ ] Mapping tests cover both directions and edge cases
- [ ] Integration tests use controlled test doubles/containers
- [ ] Shared state is reset between tests
- [ ] Failures are actionable and deterministic
- [ ] No out-of-scope refactor included

## Suggested Validation Commands

From repository root:

```bash
if [[ -f .nvmrc ]]; then nvm use; fi
cd src/infrastructure && pnpm test
cd ../domain && pnpm test
cd ../application && pnpm test
```

For targeted TDD loops:

```bash
if [[ -f .nvmrc ]]; then nvm use; fi
cd src/infrastructure && pnpm exec vitest run test/<target-file>.test.ts -t "<target test name>"
```

## Anti-patterns (Do Not Do)

- Adding ORM annotations in domain entities.
- Importing infrastructure modules from domain.
- Making tests pass by changing test intent instead of fixing adapter behavior.
- Coupling multiple unrelated refactors into one commit.
