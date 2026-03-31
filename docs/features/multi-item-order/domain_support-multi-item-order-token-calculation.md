# [Domain] Support multi-item order token calculation

**Layer**
Domain

**Context**
The domain must support a single order containing multiple drinks and food items. Total drink and food token costs are calculated independently, and both totals must be within the festival goer's corresponding balances.

**Acceptance Criteria**
- A domain command accepts multiple heterogeneous items in one order.
- Total drink token cost is computed across all drink items.
- Total food token cost is computed across all food items.
- The order is rejected if either token total exceeds the corresponding balance.

```gherkin
Feature: Multiple items in one order

Scenario: 1 - Confirm multi-item order within both token balances
  Given a festival goer with 3 drink tokens and 5 food tokens
  And an order containing items costing 2 drink tokens and 4 food tokens total
  When the festival goer places the order
  Then the order is confirmed

Scenario: 2 - Reject multi-item order when one token type is exceeded
  Given a festival goer with 1 drink token and 5 food tokens
  And an order containing items costing 2 drink tokens and 1 food token total
  When the festival goer places the order
  Then the order is rejected
  And the rejection reason is insufficient drink token balance
```

**Notes**
- Related feature: multi-item-order
- Related issues: application_accept-multi-item-order-payload, infrastructure_load-item-catalog-and-stock-for-multi-item-order
