
# Code Review Guidelines

These guidelines apply to all code reviews in the Bel'Air's Buvette project (TypeScript/Node.js backend, hexagonal architecture, pnpm monorepo). Their purpose is to ensure code quality, security, maintainability, and consistency.

## Code Review Objectives

- Detect bugs, security issues, and design problems before production.
- Improve code readability, clarity, and documentation.
- Ensure compliance with project conventions (architecture, naming, TypeScript style, tests).
- Foster knowledge sharing and team skill growth.

---

## Best Practices and Advice

- Prioritize kindness and active listening in your feedback: the goal is to improve the code, not judge the person.
- Don't hesitate to ask questions if a technical choice is unclear.
- Highlight good ideas and progress, not just points to fix.
- Propose concrete alternatives and explain the "why" behind your suggestions.
- Take context into account (urgency, technical debt, MVP, etc.) in your comments.
- Encourage documenting important decisions directly in the code or PRs.
- If you spot a recurring problem, propose a global improvement (tool, doc, process).
- Remember that review is a moment of mutual learning and sharing best practices.

---
_For any question or suggestion to improve these guidelines, submit a PR or contact the maintainers._

## Review Process

1. **Understand the context**
    - Read the PR description, related issue, and comments.
    - Understand the business need and the impact of the changes.

2. **Analyze the changes**
    - Go through the commits and modified files.
    - Identify critical areas (domain, application, infrastructure).

3. **Check for convention compliance**
    - Respect naming, architecture, and TypeScript style conventions ([see guide](./typescript-coding-guidelines.md)).
    - Folder and file structure matches the hexagonal architecture.

4. **Control code quality**
    - Readability, clarity, relevant comments.
    - Logical structure, short functions, single responsibility.
    - No dead code or unnecessary duplication.

5. **Security and robustness**
    - Proper error and exception handling.
    - Validation of user input and external data.
    - Follow security best practices (no plain secrets, etc.).

6. **Tests**
    - Presence and relevance of unit and integration tests ([see test guidelines](../testing/)).
    - Coverage of critical and edge cases.

7. **Documentation**
    - Update comments, README, and technical documentation if needed. [See documentation guidelines](./documentation-guidelines.md)

8. **Constructive feedback**
    - Give clear, kind, and well-argued feedback.
    - Propose concrete improvements and highlight positive points.

9. **Final validation**
    - Ensure all important comments are addressed.
    - Approve the PR or request changes if needed.

---

## Review Checklist

Use this checklist for every code review. Check each point before approving a PR:

- [ ] The PR clearly addresses the business need or related issue
- [ ] The code follows naming, architecture, and TypeScript style conventions
- [ ] Responsibilities are well separated (domain, application, infrastructure)
- [ ] The code is readable, clear, with no duplication or dead code
- [ ] Inputs/outputs are validated and secure
- [ ] Errors are properly handled and reported
- [ ] Tests cover critical and edge cases, pass locally and on CI
- [ ] Documentation (comments, README, guides) is up to date if needed
- [ ] Added dependencies are justified and controlled
- [ ] No secret, password, or sensitive data is present in code or config
- [ ] Feedback from the previous review has been addressed
---

