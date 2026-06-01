# Change order

Description:
Allow modifications to an order (add/remove items or change quantities) before preparation starts, with validation and audit trail.

Acceptance criteria:
- Order modifications are allowed only in modifiable states.
- Changes update totals and token usages consistently.
- All changes are recorded for audit.

Scenario (Gherkin):
Given an order in a modifiable state
When the user submits a change (add/remove item)
Then the order is updated and change is recorded
