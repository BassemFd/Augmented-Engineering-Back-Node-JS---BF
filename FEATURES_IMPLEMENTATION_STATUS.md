# Feature Implementation Status

This file tracks implementation progress for scenarios defined in FEATURES.md.

Last reviewed: 2026-04-20
Source of truth for requirements: FEATURES.md

## Legend

- 🟢 Done: Scenario and rules are implemented.
- 🟡 Partial: Some rules are implemented, but important rules are still missing.
- 🔴 Not started: Scenario is not implemented yet.

## Scenario Status Table

| # | Scenario | Status | Notes |
|---|---|---|---|
| 1 | Consult remaining token balance | 🟡 Partial | Token read and non-negative clamp implemented. Daily allocation and day rollover rules missing. |
| 2 | Place an order for a drink | 🟡 Partial | Generic order flow exists, but drink type and token pricing rules are missing. |
| 3 | Place an order for food | 🟡 Partial | Food order flow exists, but snack/meal type and fixed cost rules are not enforced in domain logic. |
| 4 | Order multiple items in a single order | 🟡 Partial | API accepts multiple items, but domain currently processes only the first item. Cost/balance validation missing. |
| 5 | Group order token pooling | 🔴 Not started | No domain/application/infrastructure implementation yet. |
| 6 | Change order | 🔴 Not started | No implemented use case or endpoint yet. |
| 7 | Cancel order | 🟡 Partial | Cancel and refund rules are implemented in domain. Explicit festival-goer confirmation flow at application boundary is missing. |
| 8 | Acknowledge order with readiness ETA | 🔴 Not started | No implemented ETA calculation and acknowledgement workflow yet. |
| 9 | Mark order as ready | 🔴 Not started | No implemented prepared-items check and readiness notification workflow yet. |
| 10 | Review acknowledged order change request | 🔴 Not started | No implemented review/approve-reject workflow yet. |
| 11 | Transfer tokens | 🔴 Not started | No implemented transfer limits and recipient confirmation workflow yet. |
| 12 | Hydration notifications | 🔴 Not started | No scheduler/notification implementation yet. |

## Scenario Complexity Table

Complexity scale:
- 🪶 Small: single use case, limited edge cases
- 🧩 Medium: multiple business rules and validations
- 🏗️ Large: cross-layer workflow with several edge cases
- 🧠 Epic: complex orchestration and algorithmic decision logic

Priority scale:
- 🚨 Now: foundational or high-risk gaps that block core product behavior
- ⚡ Next: important and should follow once "Now" is stable
- 🧭 Later: valuable but can be scheduled after core flows

| # | Scenario | Complexity | Priority | Why |
|---|---|---|---|---|
| 1 | Consult remaining token balance | 🧩 Medium | 🚨 Now | Requires daily reset policy, rollover handling, and date-aware token lifecycle logic. |
| 2 | Place an order for a drink | 🧩 Medium | 🚨 Now | Needs drink-type modeling and pricing rules with token deduction checks. |
| 3 | Place an order for food | 🧩 Medium | 🚨 Now | Requires strict item typing (snack/meal), fixed pricing rules, and balance validation. |
| 4 | Order multiple items in a single order | 🏗️ Large | 🚨 Now | Requires aggregate pricing across item categories and consistent token constraints. |
| 5 | Group order token pooling | 🧠 Epic | ⚡ Next | Multi-user contributions, pooled validation, and transactional consistency concerns. |
| 6 | Change order | 🏗️ Large | ⚡ Next | Requires conditional updates by order state and pricing/token recalculation. |
| 7 | Cancel order | 🧩 Medium | 🚨 Now | Core flow is straightforward but includes state gating and refund correctness. |
| 8 | Acknowledge order with readiness ETA | 🧠 Epic | ⚡ Next | Rich ETA algorithm with mixed-item rules and parallel preparation semantics. |
| 9 | Mark order as ready | 🏗️ Large | ⚡ Next | Requires prepared-item availability checks and readiness notification workflow. |
| 10 | Review acknowledged order change request | 🧠 Epic | 🧭 Later | Involves prepared-item transfer rules, decisioning, and ETA recomputation. |
| 11 | Transfer tokens | 🏗️ Large | 🧭 Later | Requires transfer limits, recipient confirmation, and invariant preservation. |
| 12 | Hydration notifications | 🏗️ Large | 🧭 Later | Requires scheduling windows, adaptive cadence, and drink-history-based targeting. |

## Rule-Level Notes

### 1) Consult remaining token balance
- ✅ Two token types are represented.
- ✅ Non-negative balance is enforced in the returned summary.
- ❌ Daily grant of 9 food and 6 drink tokens is not implemented.
- ❌ Unspent token rollover reset by festival day is not implemented.

### 2) Place an order for a drink
- ✅ Basic order creation exists.
- ❌ Drink classification (non-alcoholic, normal alcoholic, premium alcoholic) is not implemented.
- ❌ Drink token costs by class (0, 1, 2) are not implemented.

### 3) Place an order for food
- ✅ Basic food order use case exists.
- ❌ Domain does not enforce item type as snack or meal.
- ❌ Domain does not enforce fixed costs meal=3 and snack=1.

### 4) Multiple items in one order
- ✅ Request DTO accepts multiple items.
- ❌ Domain use case currently processes only one item.
- ❌ Total cost vs drink/food token balances is not implemented.

### 5) Group order token pooling
- ❌ Entire scenario not implemented.

### 6) Change order
- ❌ Entire scenario not implemented.

### 7) Cancel order
- ✅ Cancel only if unacknowledged implemented.
- ✅ Token refund on cancellation implemented.
- ❌ Dedicated confirmation response flow at application/API boundary not implemented.

### 8) Acknowledge order + ETA
- ❌ Entire scenario not implemented.

### 9) Mark order ready
- ❌ Entire scenario not implemented.

### 10) Review acknowledged order change request
- ❌ Entire scenario not implemented.

### 11) Transfer tokens
- ❌ Entire scenario not implemented.

### 12) Hydration notifications
- ❌ Entire scenario not implemented.

## Update Protocol

Use this checklist whenever a feature PR is merged:

1. Update status in the Scenario Status Table.
2. Update impacted Rule-Level Notes with ✅ or ❌.
3. Re-evaluate and update Complexity when scope changes.
4. Re-evaluate and update Priority when dependencies or risks change.
5. Update Last reviewed date.
6. Add a short note in the PR description: "Updated FEATURES_IMPLEMENTATION_STATUS.md".

## Quick Consistency Rule

- If implementation differs from FEATURES.md, FEATURES.md remains the requirement source.
- This file reflects current code, not target behavior.
