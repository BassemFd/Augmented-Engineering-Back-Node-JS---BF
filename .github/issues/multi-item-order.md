# Multi-item order

Description:
Support orders that contain multiple items with individual preparation statuses and aggregated totals.

Acceptance criteria:
- Orders can include multiple line items with quantities.
- Each item may have its own preparation lifecycle.
- Totals and token calculations reflect all items.

Scenario (Gherkin):
Given a multi-item order
When items are updated or prepared
Then order totals and statuses reflect the changes
