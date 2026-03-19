# Testing Guidelines

These guidelines apply to writing and reviewing tests in the Bel'Air's Buvette project (TypeScript/Node.js backend, hexagonal architecture, pnpm monorepo). They aim to ensure the robustness, maintainability, and relevance of tests.


## Test Objectives

- Verify the correct functioning of business logic and technical integrations.
- Prevent regressions during code evolution.
- Document expected behaviors and edge cases.
- Foster confidence in deployments and maintenance.

---

## Best Practices and Tips

- Prioritize clarity and simplicity in tests: one test = one verified behavior.
- Feel free to factor out common setup/reset code into helpers.
- Be rigorous in managing shared state (databases, global mocks, etc.).
- Use coverage tools to identify untested areas.
- Encourage cross-review of tests to share best practices.
- Update test documentation and strategies whenever a major change occurs.
- If you encounter a difficult case to test, document it and propose a solution or architectural improvement.
- Remember that reliable tests are the best assurance against regressions and facilitate project evolution.

---
_For any questions or suggestions to improve these guidelines, submit a PR or contact the maintainers._
_Pour toute question ou suggestion d’amélioration de ces guidelines, propose une PR ou contacte les mainteneurs._


## Types of Tests and Scope

The project favors a test pyramid adapted to the hexagonal architecture:

- **Unit tests**: Verify the isolated behavior of functions, classes, and domain use cases. Fast, numerous, covering edge and error cases.
- **Integration tests**: Validate interactions between multiple modules (e.g., application ↔ domain, domain ↔ infrastructure). Use simulated databases or services (Testcontainers, mocks).
- **End-to-end (E2E) tests**: Check the overall functioning of the application via API or user interface. Few in number, but essential for critical workflows.

Each test must have a clear objective and controlled scope. Favor fast execution and test independence.


---

## Best Practices for Writing Tests

- Write readable, explicit, and independent tests.
- Use descriptive test names (what is tested, in what context, expected result).
- Isolate dependencies with mocks or test doubles when necessary.
- Prioritize clarity over quantity: fewer well-targeted tests are better than many redundant ones.
- Cover nominal, edge, and error cases.
- Check side effects (state changes, external calls, etc.).
- Clean up the test environment after each run (databases, temporary files, etc.).
- Document complex or non-trivial cases directly in the test.
- Update tests whenever the code or expected behavior changes.

---

## Test Review Checklist

Use this checklist when reviewing tests:

- [ ] Tests cover nominal, edge, and error cases
- [ ] Test names are explicit and reflect expected behavior
- [ ] Dependencies are isolated (mocks, test doubles) if needed
- [ ] Side effects are checked and cleaned up
- [ ] Tests are independent and reproducible
- [ ] Tests fail in case of regression or bug
- [ ] Code coverage is sufficient for critical parts
- [ ] Tests are fast and stable on CI
- [ ] Documentation for complex cases is present
- [ ] Tests are updated with every code change
- [ ] Les tests sont mis à jour lors de chaque évolution du code





