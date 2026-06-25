# [Infrastructure] Read drink availability from data source

**Layer**
Infrastructure

**Context**
The infrastructure layer must provide an adapter capable of retrieving drink availability information from the underlying data source and exposing it through the domain port.

**Acceptance Criteria**
- A repository or adapter can retrieve drink availability by drink identifier.
- Missing drinks are handled without leaking persistence-specific errors into the domain layer.
- The adapter contract remains compatible with the domain availability use case.

```gherkin
Feature: Drink availability persistence

Scenario: Read an available drink from the data source
  Given a drink is stored as available in the data source
  When the adapter loads the drink by identifier
  Then it returns an available drink result to the domain layer

Scenario: Read a missing drink from the data source
  Given no drink exists in the data source for the identifier
  When the adapter loads the drink by identifier
  Then it returns an explicit missing result to the domain layer
```

## Notes
- Related feature: drink-availability
- Related issues: domain_define_drink_availability_use_case, application_add_drink_availability_endpoint
