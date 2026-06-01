# Group order token pooling

Description:
Support pooling of tokens for group orders so multiple users can contribute tokens to a shared order.

Acceptance criteria:
- Users can contribute tokens to a group order pool.
- Pool balance is tracked and consumed when placing the group order.
- Contributors can see their contributions and refunds if applicable.

Scenario (Gherkin):
Given a group order pool
When users contribute tokens
Then the pool balance increases by contributions and can be used to pay the order
