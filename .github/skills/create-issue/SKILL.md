---
name: create-issue
description: Create structured GitHub issues with layer-specific contexts and Gherkin scenarios for Belair's Buvette backend project
---

# Purpose
This skill must be used when the user asks to turn a feature idea, bug report, or natural-language requirement into one or more implementation issues for the Belair's Buvette backend project.

# Activation Cues
Use this skill when the user asks to:
- create an issue
- draft an issue
- break down a feature into issues
- formalize a requirement into implementation work
- define acceptance criteria for a feature or fix

If the request is about creating implementation issues, prefer using this skill instead of answering generically.

# Required Behavior
1. Extract the feature context and success criteria from the request.
2. Ask 2 to 3 clarification questions only if the request is ambiguous or too broad.
3. Identify the impacted architectural layer or layers.
4. If more than one layer is impacted, create one issue per layer.
5. For each issue:
   1. Summarize the context specific to that layer.
   2. Identify precise success criteria for that layer.
   3. Generate a concise issue title.
   4. Write a structured issue description.
   5. Produce 1 to N Gherkin scenarios covering the happy path and relevant edge cases.
   6. Create the issue file in `docs/features/{feature_name}/{layer_name}_{issue_title}.md`.
   7. Validate the result with `.github/skills/create-issue/scripts/validate_issue_format.py` if the script exists.

# Output Contract
When this skill is used, the agent should produce a concrete issue artifact, not only advice.

The expected result is:
- one created markdown issue file if only one layer is impacted
- multiple created markdown issue files if several layers are impacted

Each issue should contain at least:
- a clear title
- a `**Context**` section
- a `**Acceptance Criteria**` section
- Gherkin scenarios with `Feature`, `Scenario`, `Given`, `When`, and `Then`

# Layer Rules
- Domain layer: business rules, entities, value objects, use cases, ports
- Application layer: controllers, DTOs, request and response contracts, validation
- Infrastructure layer: repositories, persistence, external services, adapters

If the request spans multiple layers, do not merge them into one issue.

# Fallback Rules
- If the request is too broad, ask the user to split it by layer or feature slice.
- If the expected template or validation script does not exist, still create a well-structured issue file and explicitly mention that the template or validator is missing.
- Do not invent repository files or scripts as if they already exist.

# Issue Writing Guidance
- Keep each issue focused and implementable.
- Prefer one issue per architectural concern.
- Make acceptance criteria testable.
- Use Gherkin syntax with `Feature`, `Scenario`, `Given`, `When`, `Then` when appropriate.
- Use a slugified filename.

# Example Trigger
User request:
"Create an issue for adding a drink availability endpoint."

Expected behavior:
- identify whether the work affects domain, application, infrastructure, or several of them
- ask clarifying questions if needed
- create the corresponding issue file or files under `docs/features/...`

# Notes
- This skill is intended to create manageable issues and should usually not span more than one layer per issue.
- If the request is too broad, propose a breakdown by domain, application, and infrastructure.