
---

# Git Guidelines

These guidelines apply to the use of git in the Bel'Air's Buvette project (pnpm monorepo, TypeScript, hexagonal architecture). Their purpose is to ensure collaborative, readable, and reliable code management.

## Objectives

- Ensure traceability and clarity of the project's history.
- Facilitate review, collaboration, and conflict resolution.
- Minimize the risk of regressions and code loss.

---


## Branching Model

- **Trunk-based development**: everyone works on a shared main branch (`main`).
- **Short-lived branches**: create a branch per feature, bugfix, or refactor, and merge it as soon as possible (a few hours to 2-3 days max).
- **Feature flags**: for unfinished work, use feature flags rather than leaving branches open for a long time.
- **Naming conventions**: name branches explicitly: `FEAT-BACK-<num>-<slug>`, `FIX-BACK-<num>-<slug>`, `CHORE-BACK-<slug>`, etc.
- **No merge without review**: every branch must be reviewed and approved before being merged into `main`.
- **Regular sync**: rebase or merge frequently with `main` to limit conflicts.

---

## Conventional Commits

Adopt the Conventional Commits format for all commit messages:

```
<type>(<scope>): <short description>

<optional body>

<optional footer>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`.

Examples:

```
feat(order): add VAT calculation
fix(auth): fix handling of expired refresh token
docs(readme): update installation section
```

- Subject line: imperative, present tense, max 72 characters.
- Body: explains motivation, context, impacts.
- Footer: references issues or breaking changes.

Checklist:
- [ ] Type and scope are appropriate
- [ ] Description is concise and explicit
- [ ] Body details the “why” if needed
- [ ] Breaking changes are signaled in the footer

---

## Commit and PR Workflow

1. **Before committing**
   - Ensure the code compiles, passes tests, and respects linting.
   - Split commits by intent (one commit = one logical change).
   - Write each message following Conventional Commits.

2. **Before opening a PR**
   - Update your branch with `main` (rebase or merge).
   - Ensure the PR is clear, well described, and linked to an issue if needed.
   - Add relevant reviewers.

3. **During review**
   - Address all important feedback.
   - Resolve any conflicts.

4. **Before merging**
   - Ensure CI is green.
   - Squash commits if the PR contains "fixup" or minor corrections.
   - Squash minor translation commits if present.

Checklist:
- [ ] Commits are clean, logical, and well written
- [ ] PR is clear, documented, and reviewed
- [ ] CI passes without errors
- [ ] Conflicts are resolved
- [ ] Branch is deleted after merge

---

## Best Practices and Tips

- Favor clarity and simplicity in git history: avoid “catch-all” or overly large commits.
- Don’t hesitate to use git tools (interactive rebase, amend, squash) to improve readability before merging.
- Document important choices in commit messages or PRs.
- Take time to review others’ PRs and request feedback on yours.
- If in doubt about a git workflow, ask the team or propose an improvement.
- Remember git is a collaboration tool: quality history eases maintenance and onboarding.

---
For any questions or suggestions to improve these guidelines, propose a PR or contact the maintainers.