# [Domain] Implement token transfer rules

**Layer**
Domain

**Context**
The domain must support transferring tokens between festival goers under explicit constraints: a sender can transfer up to three tokens per type, recipient confirmation is required, and sender balance cannot become negative.

**Acceptance Criteria**
- Domain validates per-type transfer limit of three tokens.
- Domain rejects any transfer that would make sender balance negative.
- Transfer remains pending until recipient confirms.
- Confirmed transfer updates both sender and recipient balances.

```gherkin
Feature: Transfer tokens between festival goers

Scenario: 1 - Confirm transfer within limits
  Given a sender has 5 drink tokens and 5 food tokens
  And a transfer request of 2 drink tokens and 3 food tokens
  When the recipient confirms the transfer
  Then the transfer is completed
  And sender and recipient balances are updated

Scenario: 2 - Reject transfer above per-type limit
  Given a sender requests to transfer 4 drink tokens
  When the domain validates the transfer request
  Then the request is rejected
  And the rejection reason is transfer limit exceeded
```

**Notes**
- Related feature: transfer-tokens
- Related issues: application_expose-token-transfer-endpoint, infrastructure_persist-token-transfer-and-confirmation
