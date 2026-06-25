# Mark order ready

Description:
Allow staff to mark orders as ready for pickup and notify the customer.

Acceptance criteria:
- Orders can be marked as "ready" by staff.
- Customers receive a notification when their order is ready.

Scenario (Gherkin):
Given an acknowledged order being prepared
When staff marks the order as ready
Then the order status is "ready" and the customer is notified
