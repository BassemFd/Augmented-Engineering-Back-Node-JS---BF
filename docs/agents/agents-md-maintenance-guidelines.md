
---
description: 'Guidelines for creating, maintaining, and reviewing high-quality agent markdown files (.agent.md, .instructions.md, .prompt.md) for Copilot and LLM-based systems.'
applyTo: '**/agents/**/*.md'
---

# Agent Markdown Maintenance Guidelines

Comprehensive instructions for authoring, maintaining, and reviewing agent-related markdown files. These guidelines ensure clarity, safety, effectiveness, and responsible AI usage in all agent documentation and prompt engineering.

## Scope and Principles
- **Audience:** Maintainers and contributors working on agent configuration, instructions, and prompt files.
- **Goals:** Predictable agent behavior, clear expectations, minimal permissions, safety, and portability across repositories.
- **References:** Copilot prompt file documentation, AI safety best practices, and organization-specific conventions.

## Frontmatter Requirements
Every agent-related markdown file should include YAML frontmatter with the following fields:

| Field         | Required    | Description                                                        |
|-------------- |------------|--------------------------------------------------------------------|
| `description` | Recommended| Short, actionable summary of the file's purpose                    |
| `applyTo`     | Required   | Glob pattern for file applicability                                 |
| `agent`       | Optional   | Agent name or type (e.g., `ask`, `edit`, custom)                   |
| `model`       | Optional   | Language model to use                                               |
| `tools`       | Optional   | List of tools or toolsets available                                |
| `argument-hint`| Optional  | Input guidance for users                                            |

**Guidelines:**
- Use single quotes and one field per line for clarity and version control.
- Preserve additional metadata (e.g., `language`, `tags`, `visibility`) as needed.

## File Naming and Placement
- Use descriptive, kebab-case filenames (e.g., `summarize-code.agent.md`).
- Store agent files in a dedicated `agents/` or `.github/agents/` directory, unless otherwise specified.
- Name files to reflect their intent and action.

## Body Structure
- Start with an `#` heading matching the file's intent.
- Organize content with clear sections: `Mission`, `Scope & Preconditions`, `Inputs`, `Workflow`, `Output Expectations`, `Quality Assurance`.
- Adjust section names as needed, but maintain logical flow: why → context → inputs → actions → outputs → validation.
- Reference related files using relative links.

## Input and Context Handling
- Use `${input:variableName[:placeholder]}` for required values; explain when user input is needed.
- Clearly document contextual variables (e.g., `${selection}`, `${file}`) and their interpretation.
- Specify fallback or error-handling steps for missing context.

## Tool and Permission Guidance
- Limit `tools` to the minimum required for the task; list in preferred order if sequence matters.
- Warn about destructive operations and include confirmation steps.
- Document inherited tools and critical behaviors.

## Instruction Tone and Style
- Use direct, imperative sentences (e.g., "Analyze", "Generate").
- Keep language clear, concise, and neutral; avoid idioms or culturally specific references.
- Follow best practices for localization and accessibility.

## Output Definition
- Specify output format, structure, and location (e.g., "Create `docs/adr/adr-XXXX.md` using the template below").
- Define success criteria, failure triggers, and validation steps.

## Examples and Reusable Assets
- Embed good/bad examples, templates, and reference tables inline.
- Link to authoritative documentation rather than duplicating lengthy guidance.

## Quality Assurance Checklist
- [ ] Frontmatter fields are complete and accurate.
- [ ] Inputs and context are clearly defined with fallbacks.
- [ ] Workflow covers preparation, execution, and post-processing.
- [ ] Output expectations and validation steps are explicit.
- [ ] Security, compliance, and privacy policies are referenced and current.
- [ ] File executes successfully in representative scenarios.

## Maintenance Guidance
- Version-control agent files alongside related code; update with dependency or process changes.
- Review files periodically for tool lists, model requirements, and linked resources.
- Extract broadly useful guidance into shared instruction files or prompt packs.

## AI Safety & Responsible Usage

### Prompt Engineering Fundamentals
- State tasks clearly and concisely; provide context and constraints.
- Specify output format, style, and scope.
- Use prompt patterns (zero-shot, few-shot, chain-of-thought, role prompting) as appropriate.
- Avoid ambiguity, verbosity, prompt injection, and overfitting.

### Safety & Bias Mitigation
- Red-team and adversarially test prompts for harmful or biased outputs.
- Use inclusive, neutral language; avoid assumptions.
- Integrate moderation APIs and human-in-the-loop review for sensitive content.

### Responsible AI Usage
- Document prompt intent, limitations, and expected behavior.
- Avoid including or echoing sensitive data; sanitize all user inputs.
- Maintain audit logs and comply with privacy, security, and regulatory requirements.

### Security
- Never interpolate untrusted input directly; always sanitize and validate.
- Prevent prompt injection and data leakage.
- Use secure prompt construction and data handling practices.

### Testing & Validation
- Define test cases, expected outputs, and edge conditions.
- Use automated and human-in-the-loop review processes.
- Track metrics (usage, success rate, safety incidents, user satisfaction).

### Documentation & Support
- Clearly document purpose, usage, inputs, outputs, and limitations.
- Provide issue reporting and support channels.
- Maintain up-to-date references to official guidelines and resources.

## Templates & Checklists

### Agent File Design Checklist
- [ ] Task and scope are clearly stated
- [ ] Inputs, outputs, and constraints are defined
- [ ] Safety, bias, and security considerations are addressed
- [ ] Examples and validation steps are included
- [ ] Documentation is complete and current

### Safety Review Checklist
- [ ] Outputs tested for harmful content and bias
- [ ] Moderation and review processes in place
- [ ] Input validation and prompt injection prevention implemented
- [ ] Compliance and privacy requirements met

## Example Agent File Snippets

**Good Agent File:**
```
---
description: 'Summarize code changes for pull requests.'
applyTo: '**/agents/summarize-changes.agent.md'
agent: 'ask'
tools: ['diff', 'summarize']
---

# Summarize Code Changes

## Mission
Summarize the key changes in a pull request for reviewer context.

## Inputs
- Pull request diff
- Repository context

## Workflow
1. Analyze the diff for added, removed, and modified files.
2. Summarize changes in clear, bullet-point format.
3. Highlight breaking changes and new features.

## Output Expectations
- Markdown summary with sections for features, fixes, and breaking changes.

## Validation
- Reviewer confirms summary accuracy and completeness.
```

**Bad Agent File:**
```
---
description: 'Does stuff.'
---

# Untitled

Summarize.
```

## References
- [Copilot Prompt Files Documentation](https://code.visualstudio.com/docs/copilot/customization/prompt-files#_prompt-file-format)
- [AI Prompt Engineering & Safety Best Practices](https://github.com/github/awesome-copilot/blob/main/instructions/ai-prompt-engineering-safety-best-practices.instructions.md)
- [Microsoft Responsible AI](https://www.microsoft.com/en-us/ai/responsible-ai)
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google AI Principles](https://ai.google/principles/)
