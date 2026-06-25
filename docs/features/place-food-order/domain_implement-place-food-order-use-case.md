# [Domain] Implement place food order use case

**Layer**
Domain

**Context**
The domain must support food ordering with explicit token rules: snacks cost 1 food token and meals cost 3 food tokens. The use case validates cost against available food tokens and rejects orders that exceed balance.

**Acceptance Criteria**
- A domain use case accepts a festival goer and requested food items.
- Snack items cost exactly 1 food token each.
- Meal items cost exactly 3 food tokens each.
- The order is rejected when total food cost exceeds available food tokens.
- Successful orders return updated food token balance.

```gherkin
Feature: Place an order for food

Scenario: 1 - Successful order with snacks and meals
  Given a festival goer with 7 food tokens
  And a snack costs 1 food token
  And a meal costs 3 food tokens
  When the festival goer orders 1 snack and 2 meals
  Then the order is confirmed
  And the resulting food token balance is 0

Scenario: 2 - Reject food order that exceeds balance
  Given a festival goer with 2 food tokens
  And a meal costs 3 food tokens
  When the festival goer orders 1 meal
  Then the order is rejected
  And the rejection reason is insufficient food token balance
```

**Notes**
- Related feature: place-food-order
- Related issues: application_expose-place-food-order-endpoint, infrastructure_persist-food-order-and-check-stock
