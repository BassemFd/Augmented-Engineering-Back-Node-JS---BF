# [Application] Expose cancel order endpoint

**Layer**
Application

**Context**
The application layer must expose an endpoint to request order cancellation and return a clear cancellation outcome. It validates identifiers, invokes the domain cancellation use case, and maps rejection reasons to API responses.

**Acceptance Criteria**
- Endpoint accepts an order identifier and requester identifier.
- Successful cancellation returns a confirmation payload with refunded tokens.
- Acknowledged-order cancellation attempts return a documented conflict-style error.

```gherkin
Feature: Cancel order API endpoint

Scenario: 1 - Return cancellation confirmation for eligible order
  Given an unacknowledged order exists
  When the client calls the cancel order endpoint
  Then the API responds with a cancellation confirmation

Scenario: 2 - Return error when order is already acknowledged
  Given an acknowledged order exists
  When the client calls the cancel order endpoint
  Then the API responds with a business rejection error
```

**Notes**
- Related feature: cancel-order
- Related issues: domain_implement-cancel-order-rules, infrastructure_refund-tokens-on-order-cancel
