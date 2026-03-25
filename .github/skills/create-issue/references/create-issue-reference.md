# Reference — create-issue

## Output format

Each issue is a standalone Markdown file with: `# Title`, `**Context**`, `**Acceptance Criteria**` (Gherkin), `**Notes**` (optional).

## File naming convention

Examples:
- `docs/features/export-contacts/domain_export-contacts-issue.md`
- `docs/features/export-contacts/application_export-contacts-issue.md`
- `docs/features/export-contacts/infrastructure_export-contacts-issue.md`

Pattern: `docs/features/{feature_name}/{layer_name}_{issue_title}.md`

Where:
- `{feature_name}` is a stable, slugified feature identifier
- `{layer_name}` is one of `domain`, `application`, `infrastructure`
- `{issue_title}` is a short slugified description of the work

## Gherkin rules

- Every scenario must include `Given`, `When`, `Then` steps.
- Cover at least one negative scenario.
- Keep them behaviour-focused, not implementation-focused.

## Scope rules

- One issue = one layer.
- If a feature spans multiple layers (domain, application, infrastructure), generate one file per layer.
- If the scope is too broad, ask the user to break it down.
