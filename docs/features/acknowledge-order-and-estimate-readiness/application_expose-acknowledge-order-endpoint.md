# [Application] Expose acknowledge order endpoint

**Layer**
Application

**Context**
The application layer must provide an endpoint for bartenders to acknowledge orders and return estimated readiness time. It validates bartender action input and maps domain estimate results into API responses.

**Acceptance Criteria**
- Endpoint accepts an order identifier and bartender acknowledgement action.
- Successful response returns order status acknowledged and estimated readiness time.
- Invalid order identifiers are mapped to a stable API error response.

```gherkin
Feature: Acknowledge order API endpoint

Scenario: 1 - Acknowledge order and return readiness estimate
  Given a pending order exists
  When the bartender calls the acknowledge order endpoint
  Then the API returns acknowledged status and estimated readiness time

Scenario: 2 - Reject acknowledgement for unknown order
  Given no order exists for the requested identifier
  When the bartender calls the acknowledge order endpoint
  Then the API responds with a not-found error
```

**Notes**
- Related feature: acknowledge-order-and-estimate-readiness
- Related issues: domain_calculate-order-readiness-estimate, infrastructure_publish-acknowledgement-and-eta-notifications
