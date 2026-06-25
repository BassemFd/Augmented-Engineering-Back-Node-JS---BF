# [Infrastructure] Load item catalog and stock for multi-item order

**Layer**
Infrastructure

**Context**
Infrastructure must efficiently load catalog and stock data for all items in a multi-item order. The adapter should minimize round trips and return deterministic results suitable for domain validation.

**Acceptance Criteria**
- Adapter resolves multiple item identifiers in one operation.
- Adapter returns stock and pricing data required for token computation.
- Missing items are surfaced in a domain-compatible format.

```gherkin
Feature: Multi-item catalog and stock adapter

Scenario: 1 - Load data for all requested items
  Given a multi-item order with three existing item identifiers
  When the infrastructure adapter loads item data
  Then it returns stock and token-cost data for all three items

Scenario: 2 - Surface missing items during lookup
  Given one item identifier does not exist in the catalog
  When the infrastructure adapter loads item data
  Then the adapter returns a domain-compatible missing-item result
```

**Notes**
- Related feature: multi-item-order
- Related issues: domain_support-multi-item-order-token-calculation, application_accept-multi-item-order-payload
