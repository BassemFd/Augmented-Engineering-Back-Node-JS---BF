# [Infrastructure] Persist group order and token contributions

**Layer**
Infrastructure

**Context**
Infrastructure must persist group orders and each participant's token contribution in a consistent transaction. The adapter should support reconstructing who contributed what and how balances were updated.

**Acceptance Criteria**
- Adapter persists group order aggregate and per-participant contributions.
- Adapter ensures order and contributions are saved atomically.
- Read model support exists for later auditing of contributions.

```gherkin
Feature: Group order persistence adapter

Scenario: 1 - Persist group order with contributions atomically
  Given a confirmed group order with three participant contributions
  When the infrastructure adapter persists the order
  Then the group order and all contributions are stored in one transaction

Scenario: 2 - Roll back when contribution persistence fails
  Given a storage failure occurs while saving one contribution
  When the adapter persists the group order
  Then no partial group order data is committed
```

**Notes**
- Related feature: group-order-token-pooling
- Related issues: domain_implement-group-order-token-pooling-use-case, application_expose-group-order-endpoint
