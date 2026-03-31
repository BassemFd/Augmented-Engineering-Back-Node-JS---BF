# [Infrastructure] Check prepared items before ready

**Layer**
Infrastructure

**Context**
Infrastructure must provide prepared-item inventory data needed by the mark-ready domain use case and persist state changes on success. The adapter also supports notification dispatch once the order becomes ready.

**Acceptance Criteria**
- Adapter retrieves prepared-item counts for an order.
- Adapter persists ready state transition for eligible orders.
- Adapter publishes a pickup-ready notification event after successful transition.

```gherkin
Feature: Mark-ready infrastructure adapter

Scenario: 1 - Load prepared-item counts and persist ready transition
  Given prepared-item counts satisfy order requirements
  When the infrastructure adapter executes mark-ready persistence flow
  Then the order is stored as ready

Scenario: 2 - Keep state unchanged when prepared items are insufficient
  Given prepared-item counts do not satisfy order requirements
  When the infrastructure adapter executes mark-ready flow
  Then no ready status is persisted
```

**Notes**
- Related feature: mark-order-ready
- Related issues: domain_implement-mark-order-ready-use-case, application_expose-mark-order-ready-endpoint
