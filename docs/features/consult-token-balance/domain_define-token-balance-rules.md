# [Domain] Define token balance rules

**Layer**
Domain

**Context**
The domain must represent a festival goer's drink and snack token balances and enforce balance invariants. The model must guarantee balances never go negative, grant daily allowances, and prevent carry-over from previous festival days.

**Acceptance Criteria**
- A domain model represents drink token and snack token balances for one festival day.
- Balances cannot become negative through any domain operation.
- A policy computes daily allowance as 6 drink tokens and 9 snack tokens per day.
- Unspent tokens from a previous day are not carried over.

```gherkin
Feature: Consult remaining token balance

Scenario: 1 - Daily balance is initialized from festival day allowance
  Given a festival goer starts a new festival day
  When the domain initializes that day's token wallet
  Then the wallet contains 6 drink tokens and 9 snack tokens

Scenario: 2 - Remaining balance cannot be negative
  Given a festival goer has 1 drink token
  When a domain operation attempts to subtract 2 drink tokens
  Then the operation is rejected
  And the festival goer's balance remains unchanged
```

**Notes**
- Related feature: consult-token-balance
- Related issues: application_expose_token-balance-endpoint, infrastructure_read-token-balances-from-store
