# [Domain] Define hydration notification policy

**Layer**
Domain

**Context**
The domain must define the policy deciding hydration reminder frequency and sending window. Baseline reminders are hourly, heavy drinkers in the last hour receive reminders every 30 minutes, and reminders are only allowed between 11:00 and 19:00.

**Acceptance Criteria**
- Policy returns hourly notification cadence by default.
- Policy returns 30-minute cadence when alcoholic drink count in last hour is greater than three.
- Policy disables reminders outside 11:00 to 19:00 inclusive window.
- Policy output is deterministic from current time and recent drinking metrics.

```gherkin
Feature: Hydration notification policy

Scenario: 1 - Use default hourly cadence
  Given a festival goer consumed 2 alcoholic drinks in the last hour
  And current time is 14:00
  When the notification policy is evaluated
  Then reminder cadence is every 60 minutes

Scenario: 2 - Use accelerated cadence for heavy drinking
  Given a festival goer consumed 4 alcoholic drinks in the last hour
  And current time is 16:30
  When the notification policy is evaluated
  Then reminder cadence is every 30 minutes
```

**Notes**
- Related feature: hydrate-notifications
- Related issues: application_schedule-hydration-notifications, infrastructure_send-hydration-notifications
