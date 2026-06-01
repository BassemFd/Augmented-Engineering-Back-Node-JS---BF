# Place food order

Description:
API endpoint to place food orders, validate availability, reserve stock, and charge tokens.

Acceptance criteria:
- Endpoint validates item availability and user token balance.
- Successful placements reserve stock and deduct tokens.
- Failure returns clear error reasons.

Scenario (Gherkin):
Given items available and sufficient tokens
When the user places a food order
Then the order is created, stock reserved, and tokens deducted
