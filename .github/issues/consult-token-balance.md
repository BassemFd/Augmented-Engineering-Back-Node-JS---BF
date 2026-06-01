# Consult token balance

Description:
Expose an endpoint to check a user's token balance and history for payments and transfers.

Acceptance criteria:
- Endpoint returns current balance and recent transactions.
- Secure: only the owner or authorized staff can view balances.

Scenario (Gherkin):
Given a user with token transactions
When the user requests their token balance
Then the API returns the current balance and recent activity
