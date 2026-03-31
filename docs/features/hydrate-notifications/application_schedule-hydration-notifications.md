# [Application] Schedule hydration notifications

**Layer**
Application

**Context**
The application layer must orchestrate periodic evaluation of hydration notification policy and schedule reminder dispatches accordingly. It coordinates user metrics retrieval, policy execution, and dispatch commands.

**Acceptance Criteria**
- Application triggers policy evaluation on a recurring schedule.
- It requests recent drinking metrics per festival goer.
- It schedules notification dispatch only when policy allows current time window.
- It selects cadence according to policy output.

```gherkin
Feature: Hydration reminder scheduling

Scenario: 1 - Schedule default cadence reminders during allowed hours
  Given current time is within the allowed sending window
  And a festival goer is eligible for hourly reminders
  When the scheduler runs
  Then a hydration reminder dispatch is scheduled at hourly cadence

Scenario: 2 - Do not schedule reminders outside allowed hours
  Given current time is 21:00
  When the scheduler runs
  Then no hydration reminder dispatch is scheduled
```

**Notes**
- Related feature: hydrate-notifications
- Related issues: domain_define-hydration-notification-policy, infrastructure_send-hydration-notifications
