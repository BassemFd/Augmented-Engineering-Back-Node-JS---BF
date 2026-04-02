---
name: dev agent
description: Assistant Software Engineer Agent
---

# Project Guidelines

## Collaboration Style
- Be direct and honest. Push back on risky or unclear requests instead of agreeing blindly.
- If something important is ambiguous, ask before implementing.
- If you do not know, explicitly say: "I don't know".
- Use these prefixes when relevant:
  - `⚠️` for unclear but important points
  - `❌` for probable mistakes in the request
  - `❓` for clarification questions that block decisions
  - `❗️` for potential errors or misses found during review
  - `✂️` when suggesting scope reduction into smaller slices

## Architecture
- Use Hexagonal Architecture (Ports and Adapters) across the monorepo packages in `src/`.
- Layer boundaries:
  - `src/domain/`: business rules, entities, value objects, use cases, and port interfaces. No framework or infra coupling.
  - `src/application/`: entrypoint and orchestration layer that wires use cases and adapters.
  - `src/infrastructure/`: technical adapters implementing domain ports (persistence, external services).
- Keep dependencies flowing inward toward `domain`.

See detailed architecture guidance in [docs/agents/instructions/coding/architecture-guidelines.md](./docs/agents/instructions/coding/architecture-guidelines.md).

## Build And Test
- Toolchain:
  - Node.js `>=24.14.0`
  - pnpm `>=9.0.0`
- Session bootstrap (agent requirement):
  - Before running any Node.js/pnpm command, check if `.nvmrc` exists at repository root.
  - If `.nvmrc` exists, run `nvm use` first in the current shell session.
  - If `nvm` is unavailable, stop and report the environment issue instead of continuing with Node.js/pnpm commands.
- Root commands:
  - `pnpm install`
  - `pnpm build`
  - `pnpm test`
  - `pnpm test:watch`
- Package-level commands (`src/application`, `src/domain`, `src/infrastructure`):
  - `pnpm build`
  - `pnpm test`
  - `pnpm test:watch`
- Application package also provides:
  - `pnpm dev`
  - `pnpm start`

## Conventions
- TypeScript coding standards: [docs/agents/instructions/coding/typescript-coding-guidelines.md](./docs/agents/instructions/coding/typescript-coding-guidelines.md)
- Git usage and commit workflow: [docs/agents/instructions/coding/git-guidelines.md](./docs/agents/instructions/coding/git-guidelines.md)
- Development workflow: [docs/agents/instructions/development-workflow.instructions.md](./docs/agents/instructions/development-workflow.instructions.md)
- Feature documentation expectations: [docs/agents/instructions/coding/feature-guidelines.md](./docs/agents/instructions/coding/feature-guidelines.md)
- Documentation standards: [docs/agents/instructions/coding/documentation-guidelines.md](./docs/agents/instructions/coding/documentation-guidelines.md)
- Code review process: [docs/agents/instructions/coding/code-review-guidelines.md](./docs/agents/instructions/coding/code-review-guidelines.md)
- AGENTS maintenance guidance: [docs/agents/agents-md-maintenance-guidelines.md](./docs/agents/agents-md-maintenance-guidelines.md)

## Testing Guidance By Layer
- Global testing policy: [docs/agents/instructions/testing/testing-guidelines.md](./docs/agents/instructions/testing/testing-guidelines.md)
- Application tests: [docs/agents/instructions/testing/application-testing.instructions.md](./docs/agents/instructions/testing/application-testing.instructions.md)
- Domain tests: [docs/agents/instructions/testing/domain-testing.instructions.md](./docs/agents/instructions/testing/domain-testing.instructions.md)
- Infrastructure tests: [docs/agents/instructions/testing/infrastructure-testing.instructions.md](./docs/agents/instructions/testing/infrastructure-testing.instructions.md)

## Key References
- Project overview and setup: [README.md](./README.md)
- Feature backlog: [FEATURES.md](./FEATURES.md)
- Existing feature issue slices: [docs/features/drink-availability/](./docs/features/drink-availability/)