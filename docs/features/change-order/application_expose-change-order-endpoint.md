# [Application] Expose change order endpoint

**Layer**
Application

**Context**
The application layer must expose an endpoint that accepts requested changes to an existing order. It validates payloads, invokes the domain behavior for acknowledged vs unacknowledged orders, and returns explicit response states.

**Acceptance Criteria**
- Endpoint accepts order identifier and change instructions.
- Validation rejects malformed item operations.
- Response distinguishes between immediate update and pending bartender review.

```gherkin
Feature: Change order API endpoint

Scenario: 1 - Immediate success for unacknowledged order update
  Given an unacknowledged order and a valid change payload
  When the client calls the change order endpoint
  Then the API responds with an updated order representation

Scenario: 2 - Pending-review response for acknowledged order
  Given an acknowledged order and a valid change payload
  When the client calls the change order endpoint
  Then the API responds with a pending review status
```

**Notes**
- Related feature: change-order
- Related issues: domain_implement-change-order-rules, infrastructure_store-order-revisions-and-notifications
