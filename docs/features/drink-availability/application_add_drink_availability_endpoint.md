# [Application] Add drink availability endpoint

**Layer**
Application

**Context**
The application layer must expose a public API endpoint that allows clients to query whether a drink is currently available, while validating input and mapping the domain result into an HTTP response.

**Acceptance Criteria**
- An endpoint accepts a drink identifier and returns its availability status.
- Invalid input is rejected with the appropriate validation response.
- Unknown drinks are mapped to a stable, documented API response.

```gherkin
Feature: Drink availability endpoint

Scenario: Query availability for an existing available drink
  Given an available drink exists
  When the client calls the drink availability endpoint with its identifier
  Then the API responds with a success status and an available result

Scenario: Query availability for an unknown drink
  Given no drink exists for the requested identifier
  When the client calls the drink availability endpoint
  Then the API responds with a not found or unavailable result according to the API contract
```

## Notes
- Related feature: drink-availability
- Related issues: domain_define_drink_availability_use_case, infrastructure_read_drink_availability_from_data_source
