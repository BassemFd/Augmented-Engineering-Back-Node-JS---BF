# [Infrastructure] Persist food order and check stock

**Layer**
Infrastructure

**Context**
Infrastructure adapters must provide persistence and stock lookup required by the food order domain use case. The adapter verifies item existence/availability in storage and persists confirmed food orders.

**Acceptance Criteria**
- An adapter returns food item availability from the catalog.
- Missing or out-of-stock items are translated to domain errors.
- Confirmed food orders are persisted with enough data to reconstruct order details.

```gherkin
Feature: Food order persistence and stock adapter

Scenario: 1 - Persist confirmed food order
  Given all requested food items are available
  When the domain confirms a food order
  Then the infrastructure adapter saves the order in persistence

Scenario: 2 - Report out-of-stock food item
  Given one requested food item has zero stock
  When the infrastructure adapter checks stock
  Then it returns a domain-compatible out-of-stock result
```

**Notes**
- Related feature: place-food-order
- Related issues: domain_implement-place-food-order-use-case, application_expose-place-food-order-endpoint
