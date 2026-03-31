# [Infrastructure] Persist token transfer and confirmation

**Layer**
Infrastructure

**Context**
Infrastructure must persist token transfer requests, confirmation status, and final wallet updates for both parties. The adapter should support querying pending transfers awaiting recipient confirmation.

**Acceptance Criteria**
- Adapter stores pending transfer requests with sender and recipient references.
- Adapter updates transfer status on recipient confirmation.
- Adapter applies sender and recipient balance updates atomically on confirmation.

```gherkin
Feature: Token transfer persistence adapter

Scenario: 1 - Persist pending transfer request
  Given a valid transfer request command
  When the infrastructure adapter saves the transfer
  Then the transfer is stored with pending confirmation status

Scenario: 2 - Apply confirmed transfer atomically
  Given a pending transfer is confirmed by recipient
  When the infrastructure adapter finalizes the transfer
  Then sender and recipient balances are updated atomically
```

**Notes**
- Related feature: transfer-tokens
- Related issues: domain_implement-token-transfer-rules, application_expose-token-transfer-endpoint
