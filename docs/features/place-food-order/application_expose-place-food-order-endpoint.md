# [Application] Expose place food order endpoint

**Layer**
Application

**Context**
The application layer must expose an endpoint to place food orders and map request payloads into the domain command. It validates request structure, forwards the command to the domain use case, and maps errors to API responses.

**Acceptance Criteria**
- Endpoint accepts a festival goer identifier and a list of food items.
- Request validation rejects malformed item payloads.
- Success responses include order confirmation and resulting food token balance.
- Domain insufficent-balance errors are mapped to a stable API error contract.

```gherkin
Feature: Place food order API endpoint

Scenario: 1 - Place valid food order through API
  Given a valid festival goer and valid food order payload
  When the client calls the place food order endpoint
  Then the API responds with an order confirmation payload

Scenario: 2 - Map domain insufficient balance to API error
  Given the requested food order exceeds available tokens
  When the client calls the place food order endpoint
  Then the API responds with a documented insufficient-balance error
```

**Notes**
- Related feature: place-food-order
- Related issues: domain_implement-place-food-order-use-case, infrastructure_persist-food-order-and-check-stock
