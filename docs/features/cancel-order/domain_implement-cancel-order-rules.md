# [Domain] Implement cancel order rules

**Layer**
Domain

**Context**
The domain must handle order cancellation while respecting acknowledgement status. Only unacknowledged orders can be canceled immediately, and cancellation refunds previously reserved tokens to the festival goer.

**Acceptance Criteria**
- A domain use case cancels only unacknowledged orders.
- Cancellation refunds drink and food tokens consumed by the order.
- Canceling an acknowledged order returns a business rejection.

```gherkin
Feature: Cancel an order

Scenario: 1 - Cancel unacknowledged order and refund tokens
  Given an unacknowledged order reserved 2 drink tokens and 1 food token
  When the festival goer cancels the order
  Then the order status becomes canceled
  And 2 drink tokens and 1 food token are refunded

Scenario: 2 - Reject cancellation of acknowledged order
  Given an order has already been acknowledged by the bartender
  When the festival goer cancels the order
  Then the cancellation is rejected
  And the order status remains acknowledged
```

**Notes**
- Related feature: cancel-order
- Related issues: application_expose-cancel-order-endpoint, infrastructure_refund-tokens-on-order-cancel
