# Development Workflow Instructions

## Project Context & Principles

This project is a TypeScript/Node.js backend, structured as a pnpm monorepo and following hexagonal architecture. All development practices are guided by clarity, maintainability, and robustness. Code reviews, testing, and documentation are mandatory for all contributions.

---

## Branching & Commit Strategy

- Use the Git flow model: main branch for production, develop for integration, feature branches for new work, and hotfix branches for urgent fixes.
- All commits must follow the Conventional Commits standard for clarity and automation.
- Pull requests are required for all changes; ensure your branch is up to date with develop before opening a PR.
- Each PR must reference the relevant issue or feature and include a clear description of the changes.

---

## Development & Review Process

- All code must be written in TypeScript and follow the project's [coding guidelines here](./coding/typescript-coding-guidelines.md).
- Tests are mandatory for all new features and bug fixes; use unit, integration, and E2E tests as appropriate.
- Run linting and formatting tools before committing (eslint, prettier).
- Submit a pull request for review; at least one approval is required before merging.
- Reviewers use the code review checklist [here](./coding/code-review-guidelines.md) to ensure quality, clarity, and maintainability.
- Update documentation for any new features, changes, or architectural decisions.

---

## Testing & Quality Assurance

- Follow the testing guidelines for all test code [here](./testing/testing-guidelines.md).
- Ensure coverage of critical business logic, edge cases, and integrations.
- Use mocks and test doubles to isolate dependencies.
- Run tests locally and verify CI passes before merging.
- Maintain fast, reliable, and reproducible tests.
- Update tests and documentation with every code change.

---

## Continuous Improvement & Feedback

- Regularly review and refine development, testing, and documentation practices.
- Share feedback and suggestions via pull requests or direct communication with maintainers.
- Participate in retrospectives and team discussions to improve workflow and code quality.
- Keep guidelines and instructions up to date as the project evolves.

---
