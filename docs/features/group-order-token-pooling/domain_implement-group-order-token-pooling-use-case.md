# [Domain] Implement group order token pooling use case

**Layer**
Domain

**Context**
The domain must support group orders where several festival goers contribute tokens. The pooled drink and food tokens must be sufficient for the order, and each contributor can choose how many tokens of each type to provide.

**Acceptance Criteria**
- A domain command accepts group participants, contributions, and requested items.
- The order is confirmed only if pooled drink and food tokens cover the total costs.
- Individual contributions are validated against each contributor's available balances.
- The resulting group order follows the same base ordering rules as single-party orders.

```gherkin
Feature: Group order token pooling

Scenario: 1 - Confirm group order with sufficient pooled tokens
  Given two festival goers contribute enough drink and food tokens
  When they place a group order
  Then the order is confirmed as a single group order

Scenario: 2 - Reject group order with insufficient pooled tokens
  Given contributors provide fewer pooled drink tokens than required
  When they place a group order
  Then the order is rejected
  And the rejection reason is insufficient pooled tokens
```

**Notes**
- Related feature: group-order-token-pooling
- Related issues: application_expose-group-order-endpoint, infrastructure_persist-group-order-and-token-contributions
