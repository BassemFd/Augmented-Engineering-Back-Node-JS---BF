# [Application] Expose review change request endpoint

**Layer**
Application

**Context**
The application layer must expose a bartender endpoint to review acknowledged-order change requests. It maps review decisions to domain commands and returns accepted or rejected outcomes with optional updated ETA.

**Acceptance Criteria**
- Endpoint accepts change-request identifier and bartender decision.
- Accepted responses include updated readiness estimate when provided by domain.
- Rejected responses include a stable reason payload.

```gherkin
Feature: Review change request API endpoint

Scenario: 1 - Return acceptance response with updated ETA
  Given a valid review request and an accept decision
  When the bartender calls the review endpoint
  Then the API responds with accepted status and updated ETA

Scenario: 2 - Return rejection response
  Given a valid review request and a reject decision
  When the bartender calls the review endpoint
  Then the API responds with rejected status and rejection reason
```

**Notes**
- Related feature: review-acknowledged-order-change-request
- Related issues: domain_implement-review-change-request-rules, infrastructure_persist-change-review-and-updated-eta
