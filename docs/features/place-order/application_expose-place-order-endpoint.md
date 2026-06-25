# [Application] Expose place order endpoint

**Layer**
Application

**Context**
The application layer must expose an HTTP endpoint that allows a festival goer to submit an order for multiple items. It is responsible for deserializing the incoming request, performing structural validation (required fields, non-empty item list), delegating to the domain use case, and mapping the domain result—including domain errors—into appropriate HTTP responses.

**Acceptance Criteria**
- A `POST /orders` endpoint accepts a JSON body containing a customer identifier and a non-empty list of items.
- A 201 Created response is returned on success, with the confirmed order in the response body.
- A 422 Unprocessable Entity is returned when the request body is structurally invalid (e.g., missing fields, empty item list).
- A 409 Conflict is returned when the domain rejects the order due to an out-of-stock item or insufficient token balance, with a descriptive error message.
- A 422 Unprocessable Entity is returned when the domain rejects the order because a referenced item identifier does not exist.
- The endpoint does not duplicate domain business rules; it delegates entirely to the use case.

```gherkin
Feature: Place order endpoint

  Scenario: 1 — Valid order is accepted and returns 201
    Given a festival goer with sufficient tokens for all requested items
    And all requested items are in stock
    When a POST request is sent to /orders with a valid customer id and item list
    Then the response status is 201 Created
    And the response body contains the confirmed order with remaining balances

  Scenario: 2 — Request with an empty item list is rejected with 422
    Given a festival goer
    When a POST request is sent to /orders with an empty item list
    Then the response status is 422 Unprocessable Entity
    And the response body describes the validation error

  Scenario: 3 — Request with a missing customer id is rejected with 422
    Given a POST request body with a valid item list but no customer id
    When the request is sent to POST /orders
    Then the response status is 422 Unprocessable Entity

  Scenario: 4 — Domain rejects the order due to an out-of-stock item, endpoint returns 409
    Given a festival goer
    And one of the requested items is out of stock
    When a POST request is sent to /orders with that item list
    Then the response status is 409 Conflict
    And the response body contains the reason "item out of stock"

  Scenario: 5 — Domain rejects the order because an item id does not exist, endpoint returns 422
    Given a festival goer
    And one of the requested item identifiers does not exist in the catalogue
    When a POST request is sent to /orders with that item list
    Then the response status is 422 Unprocessable Entity
    And the response body contains the reason "item not found"

  Scenario: 6 — Domain rejects the order due to insufficient tokens, endpoint returns 409
    Given a festival goer with an insufficient token balance for the requested items
    When a POST request is sent to /orders
    Then the response status is 409 Conflict
    And the response body contains the reason "insufficient token balance"
```

**Notes**
- Related feature: place-order
- Related issues: domain_implement-place-order-use-case, infrastructure_persist-order-and-check-stock
