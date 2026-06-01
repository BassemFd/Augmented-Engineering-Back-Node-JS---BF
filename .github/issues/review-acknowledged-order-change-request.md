# Review acknowledged order change request

Description:
When an order change is requested after acknowledgment, staff should review and accept/reject the change with reasons.

Acceptance criteria:
- Changes requested after acknowledgment go into a review workflow.
- Staff can accept/reject with comments; user is notified of the outcome.

Scenario (Gherkin):
Given an acknowledged order with a change request
When staff reviews the request
Then the request is accepted or rejected and the user is notified
