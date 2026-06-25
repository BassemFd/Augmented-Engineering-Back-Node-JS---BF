# Drink availability

Description:
Provide an API to query available drinks (by location/time) and mark items as out-of-stock.

Acceptance criteria:
- API lists available drinks with stock and metadata.
- Admins can mark items out-of-stock which hides them from user menus.

Scenario (Gherkin):
Given a drink is out of stock
When a user queries available drinks
Then that drink is not listed
