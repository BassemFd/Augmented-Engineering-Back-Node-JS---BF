---
name: create-skill
description: Create reusable SKILL.md files for VS Code agent workflows. Use when users ask to create, package, or formalize a repeatable process into a skill, with concise coaching and quality checks.
argument-hint: What should this skill produce?
---

# Purpose
Use this skill to turn a repeatable workflow into a reusable SKILL.md artifact with a concise, coaching-first checklist.

# When To Use
Use this skill when the user asks to:
- create a new skill
- formalize a recurring workflow
- package a checklist or method into a SKILL.md
- convert an ad hoc process into a reusable slash command workflow

# Scope Decision
1. Decide scope with the user before finalizing:
   - Workspace skill: save to `.github/skills/<skill-name>/SKILL.md`
   - Personal skill: save to `~/.copilot/skills/<skill-name>/SKILL.md` (or equivalent personal skills location)
2. If scope is not specified, default to workspace scope and state that assumption.

# Creation Procedure
1. Extract workflow:
   - Outcome to produce
   - Step sequence
   - Decision points
   - Quality/completion checks
2. Clarify the minimum unknowns:
   - Outcome
   - Scope (workspace or personal)
   - Depth (checklist or full workflow)
3. Draft and save SKILL.md:
   - Valid frontmatter
   - Folder/name match
   - Keyword-rich description
4. Tighten weak spots:
   - Ask focused follow-up questions only for high-impact ambiguity.
5. Finalize:
   - Explain what the skill produces
   - Suggest test prompts
   - Propose related customizations

# Quick Checklist
- Workflow extracted from conversation or user-provided method
- Scope confirmed
- Frontmatter valid and folder/name aligned
- Procedure actionable
- Output contract clear
- Example prompts included

# Required SKILL.md Format
- Frontmatter must include:
  - `name`
  - `description`
- Optional but recommended:
  - `argument-hint`
- Body should include:
  - Purpose
  - Activation cues or when-to-use triggers
  - Step-by-step procedure
  - Output contract and quality checks

# Output Contract
When using this skill, the assistant must produce:
- A saved SKILL.md at the chosen location.
- A short list of unresolved ambiguities (if any).
- Final usage guidance including sample prompts.

# Quality Checks
Before finalizing, verify:
- `name` equals folder name exactly.
- Description contains practical trigger keywords.
- Procedure is actionable and testable.
- Scope and file path are explicit.
- No references to missing files unless clearly marked optional.

# Companion Assets
- Prompt scaffold: [./assets/create-skill.prompt.md](./assets/create-skill.prompt.md)
- Frontmatter validator: [./scripts/validate_skill_frontmatter.mjs](./scripts/validate_skill_frontmatter.mjs)
- Naming and description examples: [./references/skill-writing-reference.md](./references/skill-writing-reference.md)

# Example Prompts
- Create a skill that turns bug investigations into reproducible debug checklists.
- Build a skill for writing layered backend issues with acceptance criteria.
- Package my code review workflow into a reusable SKILL.md.

# Related Next Customizations
- Add a paired prompt file for quick skill scaffolding.
- Add a validation script to enforce SKILL.md frontmatter conventions.
- Add project-wide instructions for when to choose prompt vs skill vs custom agent.
