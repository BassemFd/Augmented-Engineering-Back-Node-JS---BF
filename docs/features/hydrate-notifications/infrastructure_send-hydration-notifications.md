# [Infrastructure] Send hydration notifications

**Layer**
Infrastructure

**Context**
Infrastructure must implement the outbound channel that sends hydration reminders to festival goers. The adapter handles message formatting, delivery attempts, and delivery-failure observability.

**Acceptance Criteria**
- Adapter sends reminder messages to all targeted festival goers.
- Message payload includes a friendly hydration reminder.
- Delivery failures are logged or queued for retry according to infrastructure policy.

```gherkin
Feature: Hydration notification delivery adapter

Scenario: 1 - Send hydration reminder to target audience
  Given a hydration reminder dispatch command for eligible festival goers
  When the infrastructure adapter processes the command
  Then reminder messages are sent to all recipients

Scenario: 2 - Record delivery failures for retry
  Given one recipient channel is temporarily unavailable
  When the infrastructure adapter sends reminders
  Then the failed delivery is recorded for retry or monitoring
```

**Notes**
- Related feature: hydrate-notifications
- Related issues: domain_define-hydration-notification-policy, application_schedule-hydration-notifications
