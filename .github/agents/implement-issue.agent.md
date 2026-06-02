---
name: implement-issue
description: 'Implement a GitHub issue using the project TDD cycle (Red → Green → Refactor). Use when an issue is assigned via the Assign-to-Claude label or when asked to implement a specific issue number.'
argument-hint: 'issue_reference={issue_number} or scenario_description={scenario}'
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/readFile', 'edit/createFile', 'edit/editFiles', 'search']
handoffs:
  - label: Run TDD Red step
    agent: TDD Red step
    prompt: Écris le test Red pour ce scénario issu de l'issue.
    send: false
  - label: Run TDD Green step
    agent: TDD Green step
    prompt: Fais passer le test Red en Green (minimum de code dans le test).
    send: false
  - label: Run TDD Refactor step
    agent: TDD Refactor step
    prompt: Refactor à partir du JSON Green — déplace le code de production hors du test.
    send: false
---

# Implement Issue Agent

## Mission

Autonomously implement a single GitHub issue in this repository from the domain layer outward,
following TDD (Red → Green → Refactor) and the project's hexagonal architecture conventions.

## Architecture Reference

```
src/
├── domain/
│   ├── src/
│   │   ├── index.ts                          ← export everything here
│   │   └── use-cases/
│   │       └── <feature>.use-case.ts         ← real implementation
│   └── use-cases/
│       ├── __tests__/
│       │   └── <feature>.use-case.test.ts    ← tests import from ../
│       └── <feature>.use-case.ts             ← re-export shim only
├── application/                              ← HTTP wiring (out of scope)
└── infrastructure/                           ← repository impls (out of scope)
```

## TDD Cycle

### Red — Write a failing test first
- File: `src/domain/use-cases/__tests__/<feature>.use-case.test.ts`
- Import from `'../<feature>.use-case'` (the re-export shim)
- Use Vitest: `describe`, `it`, `expect`, `beforeEach`
- Name each test: `given <state>, when <action>, then <outcome>`
- Define an in-test fake repository (no mocks — implement the interface directly)
- Run `pnpm --filter domain test` — the new test must fail

### Green — Minimum production code
- File: `src/domain/src/use-cases/<feature>.use-case.ts`
- Export: types, repository interfaces, exception classes, the use-case class
- The use case class has one public `async execute({...})` method
- Inject all dependencies via constructor (repository interfaces)
- Run `pnpm --filter domain test` — all tests must pass

### Refactor — Clean up (if needed)
- No dead code, no duplication, no unnecessary complexity
- Re-run tests to confirm they still pass

## Use-Case File Template

```typescript
import { TokenRepository, TokenAmount } from './token-summary.use-case.ts';

// Domain types specific to this use case
export type MyInput = { ... };

// Repository interface (defined here, implemented in infrastructure)
export interface MyRepository {
  method(...): Promise<...> | ...;
}

// Exception classes
export class MyException extends Error {
  constructor() {
    super('MY_ERROR_CODE');
    this.name = 'MyException';
  }
}

// The use case
export class MyUseCase {
  constructor(
    private myRepo: MyRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(input: MyInput): Promise<{ status: string; ... }> {
    // business logic
  }
}
```

## Re-export Shim Template

```typescript
// src/domain/use-cases/<feature>.use-case.ts
export * from '../src/use-cases/<feature>.use-case.ts';
```

## Index Export

Add to `src/domain/src/index.ts`:
```typescript
export * from './use-cases/<feature>.use-case.ts';
```

## Test File Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { MyUseCase, MyException } from '../<feature>.use-case';

type TokenAmount = { drink: number; food: number };

class FakeMyRepository implements MyRepository {
  // in-memory store, no external deps
}

describe('MyUseCase', () => {
  let repo: FakeMyRepository;
  let useCase: MyUseCase;

  beforeEach(() => {
    repo = new FakeMyRepository();
    useCase = new MyUseCase(repo);
  });

  it('given <state>, when <action>, then <outcome>', async () => {
    // Given
    // When
    // Then
    expect(result).toMatchObject({ status: 'SOME_STATUS' });
  });

  it('given <error state>, when <action>, then exception is thrown', async () => {
    await expect(useCase.execute(...)).rejects.toThrow(MyException);
  });
});
```

## Acceptance Criteria Mapping

Each item in the issue's **Acceptance Criteria** should map to at least one test case.
Each item in the issue's **Scenario (Gherkin)** should map to at least one test case.

## Conventions

| Rule | Detail |
|------|--------|
| Token model | `TokenAmount = { drink: number; food: number }` |
| Import tokens | From `./token-summary.use-case.ts` |
| Error messages | ALL_CAPS string (e.g. `'INSUFFICIENT_TOKENS'`) |
| Error assertion | `.rejects.toThrow(MyExceptionClass)` not string |
| Status strings | SCREAMING_SNAKE_CASE (e.g. `'CONFIRMED'`, `'CANCELED'`) |
| Async | Always `async/await`, never `.then()` |
| Balance guards | Always validate before mutating state |

## Commit Convention

```
feat(domain): implement <feature name> (closes #<issue_number>)
```
