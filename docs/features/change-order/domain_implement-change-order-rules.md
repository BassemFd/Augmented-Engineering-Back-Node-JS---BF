# [Domain] Implement change order rules

**Layer**
Domain

**Context**
The domain must support order modification requests with different behavior depending on acknowledgement state. Unacknowledged orders can be updated directly, while acknowledged orders require bartender review and notification flow.

**Acceptance Criteria**
- Domain allows add/remove item changes for unacknowledged orders.
- Modified order totals must still satisfy drink and food token balance rules.
- Acknowledged orders cannot be directly changed and create a change-review request.

```gherkin
Feature: Change an order

Scenario: 1 - Change unacknowledged order within token limits
  Given an unacknowledged order exists for a festival goer
  When the festival goer requests to replace one item with another
  Then the order is updated
  And token totals remain valid

Scenario: 2 - Route acknowledged order change to review
  Given an acknowledged order exists for a festival goer
  When the festival goer requests to remove one item
  Then a change-review request is created
  And the order is not directly modified
```

**Notes**
- Related feature: change-order
- Related issues: application_expose-change-order-endpoint, infrastructure_store-order-revisions-and-notifications
