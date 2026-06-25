# [Infrastructure] Store order revisions and notifications

**Layer**
Infrastructure

**Context**
Infrastructure must persist order revisions and change-review requests, and publish notifications when bartender intervention is required. The adapter should guarantee consistent persistence of the change request and notification intent.

**Acceptance Criteria**
- Adapter stores revision history for unacknowledged order updates.
- Adapter stores pending change-review requests for acknowledged orders.
- Adapter publishes or queues notification events for bartender review and requester updates.

```gherkin
Feature: Change order persistence and notification adapter

Scenario: 1 - Persist direct revision for unacknowledged order
  Given a validated direct order revision
  When the infrastructure adapter persists the change
  Then the order revision is recorded in persistence

Scenario: 2 - Persist review request and notification intent
  Given a validated change request for an acknowledged order
  When the infrastructure adapter handles the request
  Then a pending review record is stored
  And a notification event is queued for bartender review
```

**Notes**
- Related feature: change-order
- Related issues: domain_implement-change-order-rules, application_expose-change-order-endpoint
