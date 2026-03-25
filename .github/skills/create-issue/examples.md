# Examples

## Example 1

Input:
"Create issues for adding contact export to CSV."

Expected behavior:
- The agent identifies that the feature impacts multiple layers.
- The agent creates one markdown issue per impacted layer.
- The files are created under `docs/features/export-contacts/`.

Example output files:
- `docs/features/export-contacts/domain_implement_contact_export_use_case.md`
- `docs/features/export-contacts/application_add_contact_export_endpoint.md`
- `docs/features/export-contacts/infrastructure_generate_csv_from_export_result.md`

### Domain Layer Issue Example

File: `docs/features/export-contacts/domain_implement_contact_export_use_case.md`

```markdown
# [Domain] Implement contact export use case

**Layer**
Domain

**Context**
The contact export feature requires a domain use case capable of retrieving the current user's contacts and returning an exportable result without leaking infrastructure concerns.

**Acceptance Criteria**
- A domain use case returns all contacts that belong to the requesting user.
- The use case returns an empty result when the user has no contacts.
- The domain contract remains independent from CSV formatting concerns.

```gherkin
Feature: Contact export

Scenario: Export contacts for a user with existing contacts
  Given a user with 20 contacts
  When the contact export use case is executed
  Then it returns an export result containing 20 contacts

Scenario: Export contacts for a user with no contacts
  Given a user with no contacts
  When the contact export use case is executed
  Then it returns an empty export result
```

**Notes**
- Related feature: export-contacts
- Related issues: application_add_contact_export_endpoint, infrastructure_generate_csv_from_export_result
```

### Application Layer Issue Example

File: `docs/features/export-contacts/application_add_contact_export_endpoint.md`

```markdown
# [Application] Add contact export endpoint

**Layer**
Application

**Context**
The application layer must expose a public API endpoint that allows authenticated users to export their contacts as CSV while validating input and mapping the domain result into an HTTP response.

**Acceptance Criteria**
- An endpoint at `GET /contacts/export` returns contact data in CSV format for authenticated users.
- Invalid or missing authentication is rejected with 401 Unauthorized.
- The response headers include `Content-Type: text/csv` and proper caching headers.

```gherkin
Feature: Contact export endpoint

Scenario: Export contacts for authenticated user
  Given an authenticated user with 5 contacts
  When calling GET /contacts/export with Accept: text/csv
  Then the response is 200 OK
  And the body contains valid CSV data with all contacts

Scenario: Export contacts without authentication
  Given an unauthenticated client
  When calling GET /contacts/export
  Then the response is 401 Unauthorized
```

**Notes**
- Related feature: export-contacts
- Related issues: domain_implement_contact_export_use_case, infrastructure_generate_csv_from_export_result
```

## Example 2

Input:
"Create an issue for adding a drink availability endpoint."

Expected behavior:
- The agent checks whether the request is limited to the application layer or also affects domain and infrastructure.
- If the request is still ambiguous, the agent asks clarifying questions.
- Once clarified, the agent creates the corresponding issue file or files.