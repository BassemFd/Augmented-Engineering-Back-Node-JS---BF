# [Application] Expose group order endpoint

**Layer**
Application

**Context**
The application layer must provide an endpoint for creating a group order with participant contributions. It validates participant and contribution payloads, invokes the domain use case, and maps business failures to API responses.

**Acceptance Criteria**
- Endpoint accepts participants, per-participant token contributions, and order items.
- Validation rejects malformed participant contribution data.
- Insufficient pooled token errors are mapped to a documented API error response.

```gherkin
Feature: Group order API endpoint

Scenario: 1 - Submit valid group order request
  Given a request with valid contributors, contributions, and items
  When the client calls the group order endpoint
  Then the API responds with a confirmed group order payload

Scenario: 2 - Reject invalid contribution payload
  Given a request where one contribution is negative
  When the client calls the group order endpoint
  Then the API responds with a validation error
```

**Notes**
- Related feature: group-order-token-pooling
- Related issues: domain_implement-group-order-token-pooling-use-case, infrastructure_persist-group-order-and-token-contributions
