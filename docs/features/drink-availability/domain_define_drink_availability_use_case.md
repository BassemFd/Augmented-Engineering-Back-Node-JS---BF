# [Domain] Define drink availability use case

**Layer**
Domain

**Context**
The drink availability feature requires domain logic able to determine whether a drink can be ordered based on business rules, without depending on transport or persistence details.

**Acceptance Criteria**
- A domain use case can evaluate the availability of a drink by its identifier.
- The use case returns a clear unavailable result when the drink is unknown.
- The domain contract expresses availability independently from HTTP and storage concerns.

```gherkin
Feature: Drink availability

Scenario: Drink is available
  Given a drink exists and is marked as available
  When the drink availability use case is executed for that drink
  Then it returns that the drink is available

Scenario: Drink is unknown
  Given no drink exists for the requested identifier
  When the drink availability use case is executed
  Then it returns that the drink is unavailable
```

## Notes
- Related feature: drink-availability
- Related issues: application_add_drink_availability_endpoint, infrastructure_read_drink_availability_from_data_source
