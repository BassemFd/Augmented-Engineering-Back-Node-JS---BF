# Acknowledge order and estimate readiness

Description:
When a customer places an order, the backend should allow staff to acknowledge the order and provide an estimated ready time.

Acceptance criteria:
- Staff can mark an order as acknowledged.
- An estimated ready time (ETA) can be set and returned in the order response.
- ETA is validated (future timestamp, reasonable bounds).

Scenario (Gherkin):
Given an order exists
When staff acknowledges the order and sets an ETA
Then the order status becomes "acknowledged" and the ETA is recorded
