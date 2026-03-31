# [Infrastructure] Refund tokens on order cancel

**Layer**
Infrastructure

**Context**
Infrastructure must persist cancellation status and token refunds in a consistent operation. The adapter should ensure that order state and wallet balances remain synchronized on cancel.

**Acceptance Criteria**
- Adapter marks order as canceled in persistence.
- Adapter applies token refunds to the correct wallet balances.
- Cancellation and refund updates are atomic.

```gherkin
Feature: Cancellation persistence and refund adapter

Scenario: 1 - Persist cancellation and refund atomically
  Given an eligible order cancellation command
  When the infrastructure adapter applies the cancellation
  Then the order is marked canceled
  And the reserved tokens are refunded in the same transaction

Scenario: 2 - Prevent partial cancellation updates
  Given a persistence failure occurs during refund update
  When the infrastructure adapter applies the cancellation
  Then no partial order status or refund changes are committed
```

**Notes**
- Related feature: cancel-order
- Related issues: domain_implement-cancel-order-rules, application_expose-cancel-order-endpoint
