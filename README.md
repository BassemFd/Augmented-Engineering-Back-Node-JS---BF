# Bel'Air's Buvette — Backend

Backend (TypeScript / Node.js) for a festival food & drink ordering service. Festival-goers spend daily **food** and **drink** tokens to order from the buvette; staff acknowledge, prepare and hand over orders.

The repo is also a testbed for **AI-assisted engineering**: strict hexagonal architecture, a TDD cycle driven by agents, and a GitHub issue → implementation pipeline.

> Status: early stage. Only a subset of the scenarios is implemented — see [FEATURES_IMPLEMENTATION_STATUS.md](./FEATURES_IMPLEMENTATION_STATUS.md).

## Architecture

Hexagonal (ports & adapters), one folder per layer in `src/`. Dependencies point inward, toward `domain`.

| Layer | Path | Role |
|---|---|---|
| Domain | `src/domain/` | Use cases, business rules, port interfaces. No framework or infra coupling. |
| Application | `src/application/` | HTTP entrypoint (router, controllers, DTOs); wires use cases to adapters. |
| Infrastructure | `src/infrastructure/` | Adapters implementing domain ports (order and stock repositories). |

Entrypoint: `src/main.ts`. Details: [architecture guidelines](./docs/agents/instructions/coding/architecture-guidelines.md).

## Prerequisites

- Node.js `>=24.14.0` (run `nvm use` first if an `.nvmrc` exists)
- pnpm `>=9.0.0`

## Commands

Per [AGENTS.md](./AGENTS.md), at the root and in each package (`src/domain`, `src/application`, `src/infrastructure`):

```bash
pnpm install
pnpm build
pnpm test
pnpm test:watch
```

`src/application` also exposes `pnpm dev` and `pnpm start`.

> ⚠️ The `package.json` files these scripts depend on are **not committed yet**, so the commands above do not run from a fresh clone. Remove this note once they are.

## API

| Method | Path | Description |
|---|---|---|
| `POST` | `/commandes` | Place an order. Returns `401` if an authenticator is configured and rejects the request. |

Any other route returns `404`.

## Feature scenarios

12 scenarios (token balance, drink/food/multi-item orders, group pooling, change/cancel order, acknowledge with ETA, mark ready, review change request, transfer tokens, hydration notifications). Each is split into domain / application / infrastructure slices in [`docs/features/`](./docs/features/), with matching issue drafts in [`.github/issues/`](./.github/issues/).

Currently: cancel order is the most complete; token balance, place order (drink/food) and multi-item order are partial; the rest are not started. Source of truth is [FEATURES_IMPLEMENTATION_STATUS.md](./FEATURES_IMPLEMENTATION_STATUS.md).

## AI-assisted workflow

- **TDD agents** (`.github/agents/`): `TDD Cycle` orchestrates Red → Green → Refactor steps (also available as prompts in `.github/prompts/`).
- **Issue pipeline**: `create-or-push-issues` turns feature docs into GitHub issues; `implement-issue` implements one with the TDD cycle.
- **Skills** (`.github/skills/`): `create-issue`, `generate-all-issues`, `create-skill`.
- **CI**: labelling an issue `Assign-to-Claude` triggers [`assign-to-claude.yml`](./.github/workflows/assign-to-claude.yml) to implement it.
- **Agent guidelines**: [AGENTS.md](./AGENTS.md) and [`docs/agents/`](./docs/agents/).

## Contributing

- Conventional Commits, Git flow, PR + review required: [development workflow](./docs/agents/instructions/development-workflow.instructions.md), [git guidelines](./docs/agents/instructions/coding/git-guidelines.md).
- TypeScript style: [typescript-coding-guidelines.md](./docs/agents/instructions/coding/typescript-coding-guidelines.md).
- Tests are mandatory, per layer: [testing guidelines](./docs/agents/instructions/testing/testing-guidelines.md).
- Review checklist: [code-review-guidelines.md](./docs/agents/instructions/coding/code-review-guidelines.md).
