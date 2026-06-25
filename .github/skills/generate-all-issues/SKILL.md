---
name: generate-all-issues
description: Generate layered GitHub issue files for every feature listed in FEATURES.md, validate each one, and commit the result. Use when you want to bootstrap the full docs/features/ folder from the feature backlog.
argument-hint: Generate all issues from FEATURES.md
---

# Purpose
Batch-generate all layered implementation issue files for every feature defined in `FEATURES.md`.
Each feature produces one issue file per impacted architectural layer (domain, application, infrastructure).
Every file is validated and the result is committed to the repository.

# Activation Cues
Use this skill when the user asks to:
- generate all issues from FEATURES.md
- bootstrap docs/features/ from the feature backlog
- create issues for all features
- populate docs/features/ with issue files

# Procedure

## Step 1 — Read FEATURES.md
- Read `FEATURES.md` in full.
- Extract every named feature (one entry per `###` heading).
- Build a list: `feature_name` (slugified), raw description, and business rules.

## Step 2 — Check existing coverage
- For each feature, check whether `docs/features/{feature_name}/` already exists and contains issue files.
- Skip features that are already fully covered (all three layers present).
- Report skipped features to the user.

## Step 3 — Generate issues per feature
For each uncovered feature, apply the `create-issue` skill logic:
1. Identify which architectural layers are impacted (domain, application, infrastructure).
2. For each impacted layer, produce a single markdown issue file following the template in `.github/skills/create-issue/templates/issue.md`.
3. Save the file at `docs/features/{feature_name}/{layer_name}_{issue_title}.md`.
4. Naming rules:
   - `{feature_name}`: lowercase, hyphen-separated slug derived from the feature heading
   - `{layer_name}`: one of `domain`, `application`, `infrastructure`
   - `{issue_title}`: short slug describing the work for that layer

## Step 4 — Validate each file
- For each created file, run:
  ```
  python3 .github/skills/create-issue/scripts/validate_issue_format.py <file>
  ```
- If a file fails validation, fix it and re-validate before moving on.
- Do not proceed to commit if any file is INVALID.

## Step 5 — Improve create-issue skill if needed
- If during generation you encounter a gap in the `create-issue` skill (missing rule, unclear scope boundary, edge case not covered), update `.github/skills/create-issue/SKILL.md` accordingly.
- Document what was changed and why in the commit message.

## Step 6 — Commit
- Stage all new and modified files under `docs/features/` and `.github/skills/create-issue/`.
- Commit with a message in the form:
  ```
  docs(features): generate layered issue files for all FEATURES.md features

  - <feature-slug>: domain, application, infrastructure issues created
  - ...

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
  ```

# Output Contract
- One markdown issue file per layer per feature, saved under `docs/features/`.
- All files pass `validate_issue_format.py` with `VALID`.
- A single git commit containing all new files (and any create-issue skill improvements).
- A summary report listing: features covered, files created, files skipped, any fixes made to the create-issue skill.

# Quality Checks
Before committing, verify:
- [ ] Every feature in FEATURES.md has at least one issue file.
- [ ] No file was skipped without an explicit reason communicated to the user.
- [ ] All files pass validation.
- [ ] Filenames follow the naming convention exactly.
- [ ] No issue file merges concerns from multiple layers.
- [ ] Commit message lists all features processed.

# Fallback Rules
- If a feature is too broad to map cleanly to three layers (e.g., it involves cross-cutting concerns), create the domain issue and flag the application/infrastructure split as a noted open question in the Notes section.
- If `validate_issue_format.py` does not exist, still create the files and report the missing validator.
- If a feature already has partial coverage (e.g., domain only), generate only the missing layers.

# Example Prompts
- `#generate-all-issues Generate all issues from FEATURES.md`
- `@workspace #generate-all-issues Bootstrap docs/features/ from the feature backlog`
