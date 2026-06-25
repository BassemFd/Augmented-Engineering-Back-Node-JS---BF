# [Infrastructure] Publish acknowledgement and ETA notifications

**Layer**
Infrastructure

**Context**
Infrastructure must persist acknowledgement status and publish notifications that include the estimated readiness time. This adapter bridges domain acknowledgement outcomes to persistence and messaging mechanisms.

**Acceptance Criteria**
- Adapter persists acknowledged status and estimated readiness time for the order.
- Adapter publishes a notification event for the festival goer with the ETA payload.
- Persistence and event publishing are coordinated to avoid lost updates.

```gherkin
Feature: Acknowledgement persistence and notification adapter

Scenario: 1 - Persist acknowledgement and publish ETA notification
  Given a domain acknowledgement result with an ETA value
  When the infrastructure adapter handles the result
  Then the order acknowledgement is persisted
  And an ETA notification event is published

Scenario: 2 - Handle notification publishing failure safely
  Given persistence succeeds but notification publishing fails
  When the infrastructure adapter handles the result
  Then retry or compensation is recorded according to reliability policy
```

**Notes**
- Related feature: acknowledge-order-and-estimate-readiness
- Related issues: domain_calculate-order-readiness-estimate, application_expose-acknowledge-order-endpoint
