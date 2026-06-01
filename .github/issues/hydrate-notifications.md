# Hydrate notifications

Description:
Send notifications to remind users to hydrate at configured intervals or triggers.

Acceptance criteria:
- Users can opt-in/out of hydrate notifications.
- Notifications are scheduled and delivered reliably.

Scenario (Gherkin):
Given a user opted into notifications
When the notify trigger occurs
Then the user receives a hydrate notification
