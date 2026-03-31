# [Application] Expose token balance endpoint

**Layer**
Application

**Context**
The application layer must expose a read endpoint that returns a festival goer's current day drink and snack token balances. The endpoint validates input, invokes the domain use case, and maps domain outcomes to stable API responses.

**Acceptance Criteria**
- An endpoint accepts a festival goer identifier and festival day.
- Valid requests return both drink and snack token balances.
- Invalid identifiers or missing required parameters are rejected with validation errors.
- Unknown festival goers are mapped to a documented not-found API response.

```gherkin
Feature: Token balance API endpoint

Scenario: 1 - Return current token balances for a valid festival goer
  Given a festival goer exists with current balances
  When the client calls the token balance endpoint with valid parameters
  Then the API responds with drink and snack token balances

Scenario: 2 - Reject malformed balance request
  Given a malformed festival goer identifier
  When the client calls the token balance endpoint
  Then the API responds with a validation error
```

**Notes**
- Related feature: consult-token-balance
- Related issues: domain_define-token-balance-rules, infrastructure_read-token-balances-from-store
