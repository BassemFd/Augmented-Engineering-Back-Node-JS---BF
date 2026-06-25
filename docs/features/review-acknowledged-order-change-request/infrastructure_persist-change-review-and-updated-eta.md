# [Infrastructure] Persist change review and updated ETA

**Layer**
Infrastructure

**Context**
Infrastructure must persist bartender review decisions for acknowledged-order change requests and publish updated ETA notifications when accepted. Persistence and notification intent should remain consistent.

**Acceptance Criteria**
- Adapter persists accepted/rejected decision for a change request.
- Adapter persists updated order details and ETA when accepted.
- Adapter emits requester notification event with decision outcome.

```gherkin
Feature: Change review persistence adapter

Scenario: 1 - Persist accepted review with updated ETA
  Given an accepted review result containing a new ETA
  When the infrastructure adapter applies the result
  Then the review decision and updated ETA are persisted
  And a notification event is emitted

Scenario: 2 - Persist rejected review decision
  Given a rejected review result
  When the infrastructure adapter applies the result
  Then the rejected decision is persisted
  And a rejection notification event is emitted
```

**Notes**
- Related feature: review-acknowledged-order-change-request
- Related issues: domain_implement-review-change-request-rules, application_expose-review-change-request-endpoint
