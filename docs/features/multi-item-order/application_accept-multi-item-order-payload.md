# [Application] Accept multi-item order payload

**Layer**
Application

**Context**
The application layer must accept an order payload containing multiple item lines and convert it into the domain command. It must validate payload shape, item quantities, and identifiers before dispatching the use case.

**Acceptance Criteria**
- Endpoint accepts an array of item lines in a single request.
- Validation rejects empty orders and invalid quantities.
- The application maps domain token-insufficiency errors to stable API responses.

```gherkin
Feature: Multi-item order API payload

Scenario: 1 - Accept valid multi-item order payload
  Given a request with multiple valid item lines
  When the client calls the place order endpoint
  Then the application dispatches a single domain command containing all items

Scenario: 2 - Reject empty multi-item order
  Given a request with an empty item list
  When the client calls the place order endpoint
  Then the API responds with a validation error
```

**Notes**
- Related feature: multi-item-order
- Related issues: domain_support-multi-item-order-token-calculation, infrastructure_load-item-catalog-and-stock-for-multi-item-order
