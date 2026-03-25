# Reference

## Expected Issue Structure
Each generated issue markdown file should contain:
- A clear title
- A `**Context**` section with at least one non-empty line
- An `**Acceptance Criteria**` section
- Gherkin acceptance scenarios
- Optional implementation notes or links to related issues

## File Naming Convention
Use:
`docs/features/{feature_name}/{layer_name}_{issue_title}.md`

Where:
- `{feature_name}` is a stable, slugified feature identifier
- `{layer_name}` is one of `domain`, `application`, `infrastructure`
- `{issue_title}` is a short slugified description of the work

## Writing Guidance
- Keep one issue focused on one layer only
- Prefer implementation-ready wording over vague product wording
- Acceptance criteria should be testable
- Gherkin scenarios should cover the main path and key edge cases

## Validation Guidance
Run `.github/skills/create-issue/scripts/validate_issue_format.py <issue-file>` after generating the issue files.
If the validator does not exist, ensure the markdown files still follow the structure defined in this reference.
