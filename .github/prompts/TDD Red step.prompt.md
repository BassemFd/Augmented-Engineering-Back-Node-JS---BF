---
agent: agent
name: TDD Red step
description: This prompt is used to implement one test scenario that fails in a TDD workflow for an AI agent
argument-hint: Implement the following test scenario in a TDD workflow for an AI agent: {scenario_description}
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/problems', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search', 'context7/*', 'todo']
model: GPT-5 mini (copilot)
---

# Red TDD step prompt

## Instructions
1. Analyze the provided scenario description carefully.
    - If the scenario description is provided as an issue reference, retrieve the issue content and extract the specified scenario.
    - If the scenario description is provided directly, use it as is.
2. Check if a test file already exists for the scope of this test scenario. 
   - If it exists, append the new test case to the existing file.
   - If it does not exist, create a new test file in the appropriate directory:
     - Domain use-case tests → `src/domain/use-cases/__tests__/`
     - Application layer tests → `test/application/`
     - Infrastructure tests → `test/infrastructure/`
3. Write the test so it accurately reflects the scenario and is expected to fail initially. Follow the testing guidelines:
    - for the domain layer: `docs/agents/instructions/domain-testing.instructions.md`
    - for the application layer: `docs/agents/instructions/application-testing.instructions.md`
    - for the infrastructure layer: `docs/agents/instructions/infrastructure-testing.instructions.md`
4. Run the test to confirm it fails: `pnpm vitest run <test-file-path>`.

## Requirements
- **NEVER** implement any production code. Your ONLY goal is to write a failing test.
- Use Vitest with `describe`/`it`/`expect`.
- Use `FakeRepository` pattern for domain tests (no mocking frameworks).

## Examples

### Domain test example

Input:
Scenario: Successfully export contacts
Given a user with 20 contacts
When ExportContactsUseCase is executed
Then it returns a result with all 20 contacts

Expected Output — new file `src/domain/use-cases/__tests__/export-contacts.use-case.test.ts`:


```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ExportContactsUseCase } from '../export-contacts.use-case';
import { FakeContactRepository } from '../../__test-helpers__/fake-contact.repository';

describe('ExportContactsUseCase', () => {
  let fakeRepository: FakeContactRepository;
  let useCase: ExportContactsUseCase;

  beforeEach(() => {
    fakeRepository = new FakeContactRepository();
    useCase = new ExportContactsUseCase(fakeRepository);
  });

  it('given 20 contacts, when use case executes, then returns all contacts', async () => {
    // Given
    for (let i = 0; i < 20; i++) {
      fakeRepository.add({ id: `c-${i}`, name: `Contact ${i}`, email: `c${i}@example.com` });
    }
    // When
    const result = await useCase.execute({ userId: 'user-1' });
    // Then
    expect(result).toBeDefined();
    expect(result.contacts).toHaveLength(20);
  });
});
```



---

## Notes :
- Ensure the test actually executes (imports must resolve) so failure is due to assertions or explicit thrown errors, not missing modules.
- Use lightweight stubs only when necessary to allow the test process to run; avoid adding business logic.
- When a missing implementation blocks the test runner, create a minimal placeholder that throws `Not implemented` so the test run executes and fails cleanly.
-Don't use "any" for ts, make sure to define appropriate types for test inputs and expected outputs, even if they are minimal interfaces or type aliases.

---