# [Domain] Implement mark order ready use case

**Layer**
Domain

**Context**
The domain must allow bartenders to mark an order as ready only when enough prepared items are available. Once ready, the system transitions order state and triggers festival-goer notification.

**Acceptance Criteria**
- Domain checks prepared item quantities before allowing ready transition.
- Order is marked ready only if all required prepared items are sufficient.
- Successful transition emits a domain signal that the festival goer must be notified.

```gherkin
Feature: Mark order as ready

Scenario: 1 - Mark order ready when prepared items are sufficient
  Given an acknowledged order with all required items prepared
  When the bartender marks the order as ready
  Then the order status becomes ready

Scenario: 2 - Reject ready transition when prepared items are insufficient
  Given an acknowledged order missing some prepared items
  When the bartender marks the order as ready
  Then the transition is rejected
  And the order status remains acknowledged
```

**Notes**
- Related feature: mark-order-ready
- Related issues: application_expose-mark-order-ready-endpoint, infrastructure_check-prepared-items-before-ready
