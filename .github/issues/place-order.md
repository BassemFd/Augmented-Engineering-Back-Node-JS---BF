# Place order

Description:
General place-order flow that supports drinks, food, and group pooling with validation and receipts.

Acceptance criteria:
- Orders can be placed for supported item types.
- The API returns an order receipt with status and ETA.

Scenario (Gherkin):
Given user selects items and confirms
When the user places the order
Then the order is created and a receipt returned
