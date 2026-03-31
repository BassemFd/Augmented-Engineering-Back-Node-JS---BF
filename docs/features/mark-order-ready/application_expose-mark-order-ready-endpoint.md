# [Application] Expose mark order ready endpoint

**Layer**
Application

**Context**
The application layer must expose an endpoint for bartenders to mark an order as ready. The endpoint validates request data, delegates state transition to the domain, and maps readiness outcomes into API responses.

**Acceptance Criteria**
- Endpoint accepts order identifier and bartender ready action.
- Successful response returns ready status for the order.
- Insufficient prepared-item conditions are mapped to a documented API rejection.

```gherkin
Feature: Mark order ready API endpoint

Scenario: 1 - Return success for eligible order ready action
  Given an order is eligible to be marked ready
  When the bartender calls the mark order ready endpoint
  Then the API responds with ready order status

Scenario: 2 - Return error for ineligible ready action
  Given an order is not eligible to be marked ready
  When the bartender calls the mark order ready endpoint
  Then the API responds with a business rejection error
```

**Notes**
- Related feature: mark-order-ready
- Related issues: domain_implement-mark-order-ready-use-case, infrastructure_check-prepared-items-before-ready
