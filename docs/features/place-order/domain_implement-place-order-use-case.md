# [Domain] Implement place order use case

**Layer**
Domain

**Context**
The "place order" feature requires a domain use case that accepts a list of items requested by a festival goer and produces a confirmed order. The use case must enforce two critical invariants: every item in the order must be in stock, and the total token cost (drink tokens and food tokens counted separately) must not exceed the customer's available balance. The domain must express these rules independently from HTTP transport or persistence technology.

**Acceptance Criteria**
- A domain use case accepts a customer identifier and a list of ordered items.
- The use case fails with an explicit out-of-stock error when at least one item exists but has no remaining stock.
- The use case fails with an explicit item-not-found error when at least one item identifier does not exist in the catalogue.
- The use case fails when the total drink token cost exceeds the customer's drink token balance.
- The use case fails when the total food token cost exceeds the customer's food token balance.
- A successful use case returns a confirmed order containing all requested items and the resulting token balances.
- The domain ports for stock checking and order persistence are expressed as interfaces with no infrastructure coupling.

```gherkin
Feature: Place an order

  Scenario: 1 — Successful order with multiple items all in stock
    Given a festival goer with 4 drink tokens and 6 food tokens
    And a drink "Mojito" in stock costing 1 drink token
    And a snack "Chips" in stock costing 1 food token
    When the festival goer places an order for 1 "Mojito" and 1 "Chips"
    Then the order is confirmed
    And the festival goer's drink token balance is 3
    And the festival goer's food token balance is 5

  Scenario: 2 — Order fails when one item exists but is out of stock
    Given a festival goer with 4 drink tokens and 6 food tokens
    And a drink "Mojito" exists in the catalogue with stock > 0
    And a drink "Lemonade" exists in the catalogue with stock = 0
    When the festival goer places an order for 1 "Mojito" and 1 "Lemonade"
    Then the order is rejected
    And the rejection reason is "item out of stock: Lemonade"
    And the festival goer's token balances are unchanged

  Scenario: 3 — Order fails when one item identifier does not exist
    Given a festival goer with 4 drink tokens and 6 food tokens
    And a drink "Mojito" exists in the catalogue with stock > 0
    And an item identifier "ghost-item-id" that does not exist in the catalogue
    When the festival goer places an order for 1 "Mojito" and 1 "ghost-item-id"
    Then the order is rejected
    And the rejection reason is "item not found: ghost-item-id"
    And the festival goer's token balances are unchanged

  Scenario: 4 — Order fails when drink token balance is insufficient
    Given a festival goer with 1 drink token and 6 food tokens
    And a premium drink "Craft Beer" in stock costing 2 drink tokens
    When the festival goer places an order for 1 "Craft Beer"
    Then the order is rejected
    And the rejection reason is "insufficient drink token balance"

  Scenario: 5 — Order fails when food token balance is insufficient
    Given a festival goer with 4 drink tokens and 2 food tokens
    And a meal "Burger" in stock costing 3 food tokens
    When the festival goer places an order for 1 "Burger"
    Then the order is rejected
    And the rejection reason is "insufficient food token balance"

  Scenario: 6 — Order with a non-alcoholic drink costs no drink tokens
    Given a festival goer with 0 drink tokens and 6 food tokens
    And a non-alcoholic drink "Water" in stock costing 0 drink tokens
    When the festival goer places an order for 1 "Water"
    Then the order is confirmed
    And the festival goer's drink token balance remains 0
```

**Notes**
- Related feature: place-order
- Related issues: application_expose-place-order-endpoint, infrastructure_persist-order-and-check-stock
