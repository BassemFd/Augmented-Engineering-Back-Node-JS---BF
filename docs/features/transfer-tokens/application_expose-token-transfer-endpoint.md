# [Application] Expose token transfer endpoint

**Layer**
Application

**Context**
The application layer must expose endpoints to request token transfer and to confirm transfer by recipient. It validates payloads and maps pending/confirmed/rejected outcomes to API responses.

**Acceptance Criteria**
- Request endpoint accepts sender, recipient, and transfer amounts.
- Confirm endpoint accepts transfer identifier and recipient confirmation action.
- API returns pending status until recipient confirms.
- Validation rejects malformed amounts and identifiers.

```gherkin
Feature: Token transfer API endpoints

Scenario: 1 - Create pending transfer request
  Given a valid transfer request payload
  When the client calls the transfer request endpoint
  Then the API responds with pending transfer status

Scenario: 2 - Confirm transfer as recipient
  Given a pending transfer exists
  When the recipient calls the transfer confirmation endpoint
  Then the API responds with completed transfer status
```

**Notes**
- Related feature: transfer-tokens
- Related issues: domain_implement-token-transfer-rules, infrastructure_persist-token-transfer-and-confirmation
