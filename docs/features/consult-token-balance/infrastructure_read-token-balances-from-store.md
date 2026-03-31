# [Infrastructure] Read token balances from store

**Layer**
Infrastructure

**Context**
Infrastructure must implement the domain port used to fetch a festival goer's token balances for the current day. The adapter should query the persistence store and return data in the shape expected by the domain without leaking storage details.

**Acceptance Criteria**
- A repository adapter loads drink and snack balances by festival goer and day.
- Missing records are translated to the domain not-found result.
- Adapter mapping is deterministic and covered by adapter-level tests.

```gherkin
Feature: Token balance persistence adapter

Scenario: 1 - Read existing token balances
  Given balances are stored for a festival goer for a given day
  When the infrastructure adapter loads balances
  Then it returns the mapped drink and snack balances to the domain

Scenario: 2 - Return not found when no balance record exists
  Given no balance record exists for the requested festival goer and day
  When the infrastructure adapter loads balances
  Then it returns a domain-compatible not-found result
```

**Notes**
- Related feature: consult-token-balance
- Related issues: domain_define-token-balance-rules, application_expose_token-balance-endpoint
