# [Infrastructure] Persist order and check stock from data source

**Layer**
Infrastructure

**Context**
The infrastructure layer must provide concrete adapters that implement the domain ports required by the place-order use case. This includes: a stock-checking adapter that reads real-time item availability from the data source, and an order repository adapter that persists confirmed orders. Both adapters must implement domain-defined interfaces and must not bleed persistence details into the domain.

**Acceptance Criteria**
- A stock adapter implementing the domain's stock-check port returns whether an item is available, or raises an item-not-found error when the identifier does not exist in the data source.
- An order repository adapter implementing the domain's order persistence port saves a confirmed order and its items durably.
- Both adapters are wired into the dependency injection container and are the only implementations of their respective domain ports.
- Adapter failures (e.g., database errors) are propagated as infrastructure errors, not as domain errors.

```gherkin
Feature: Stock check and order persistence adapters

  Scenario: 1 — Stock adapter reports an in-stock item correctly
    Given an item "Mojito" exists in the data source with stock > 0
    When the stock adapter is asked to check availability for "Mojito"
    Then it returns available

  Scenario: 2 — Stock adapter reports an out-of-stock item correctly
    Given an item "Lemonade" exists in the data source with stock = 0
    When the stock adapter is asked to check availability for "Lemonade"
    Then it returns not available

  Scenario: 3 — Stock adapter raises item-not-found for an unknown item identifier
    Given no item exists in the data source for identifier "ghost-item-id"
    When the stock adapter is asked to check availability for "ghost-item-id"
    Then it raises an item-not-found error

  Scenario: 4 — Order repository adapter persists a confirmed order
    Given a confirmed order containing two items
    When the order repository adapter saves the order
    Then the order and its items are retrievable from the data source

  Scenario: 5 — Infrastructure error is propagated when the data source is unavailable
    Given the data source is unavailable
    When the stock adapter is asked to check availability
    Then an infrastructure error is raised
    And no domain order error is raised
```

**Notes**
- Related feature: place-order
- Related issues: domain_implement-place-order-use-case, application_expose-place-order-endpoint
