# [Domain] Implement review change request rules

**Layer**
Domain

**Context**
For acknowledged orders, the bartender must review requested changes and accept only when at least one already prepared item can be transferred to another order. Accepted changes must produce an updated readiness estimate.

**Acceptance Criteria**
- Domain accepts or rejects acknowledged-order change requests.
- Acceptance requires at least one prepared item to be transferable.
- Accepted requests produce a recalculated readiness estimate.
- Rejected requests preserve the original acknowledged order unchanged.

```gherkin
Feature: Review acknowledged order change request

Scenario: 1 - Accept change request when prepared item transfer is possible
  Given an acknowledged order with at least one transferable prepared item
  When the bartender reviews and accepts the change request
  Then the request is accepted
  And a new readiness estimate is produced

Scenario: 2 - Reject change request when no transfer is possible
  Given an acknowledged order with no transferable prepared items
  When the bartender reviews the change request
  Then the request is rejected
  And the original order remains unchanged
```

**Notes**
- Related feature: review-acknowledged-order-change-request
- Related issues: application_expose-review-change-request-endpoint, infrastructure_persist-change-review-and-updated-eta
