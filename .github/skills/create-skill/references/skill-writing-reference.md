# Skill Writing Reference

## Name Rules
- Lowercase letters, numbers, and hyphens
- Match folder name exactly
- Keep it short and specific

Good examples:
- create-skill
- create-issue
- api-review-checklist

Avoid:
- CreateSkill
- skill_for_everything

## Description Writing
Use practical trigger words so the assistant can discover the skill.

Strong pattern:
- What it does
- When to use it
- Common trigger verbs

Example:
Create structured GitHub issues from feature requests. Use when users ask to create, draft, or split implementation issues by layer.

Weak pattern:
- Helpful skill for many tasks.

## Procedure Writing
Prefer short, testable steps:
1. Extract context
2. Clarify gaps
3. Draft artifact
4. Validate quality
5. Finalize output

## Output Contract Pattern
State exactly what must be produced:
- Files created or updated
- Required sections in those files
- Completion checks
