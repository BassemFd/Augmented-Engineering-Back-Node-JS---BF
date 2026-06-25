# Cancel order

Description:
Support canceling orders that are not yet prepared. The API should validate cancelability and refund tokens if applicable.

Acceptance criteria:
- Orders can be canceled when in cancellable states.
- Cancellation triggers token refund where business rules require.
- Cancellation records who canceled and why.

Scenario (Gherkin):
Given an order in "placed" state
When the user requests cancellation
Then the order status becomes "canceled" and refunds are processed if applicable
