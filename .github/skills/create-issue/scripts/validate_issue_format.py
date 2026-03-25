import re
import sys


def validate_issue_format(content):
    """
    Validate high-level issue structure and basic Gherkin syntax.
    Returns (is_valid: bool, errors: list[str]).
    """
    errors = []

    if not re.search(r'(?m)^#\s+.+', content):
        errors.append("Title is missing or malformed. Expect a top-level markdown title starting with '# '.")

    if not re.search(r'\*\*(Context|Contexte)\*\*\s*\n\s*.+', content):
        errors.append("Context section is missing or malformed. Expect a '**Context**' section with at least one non-empty line.")

    if not re.search(r'\*\*(Acceptance Criteria|Critères d\'acceptation|Acceptance)\*\*', content):
        errors.append("Acceptance Criteria section is missing or malformed. Expect '**Acceptance Criteria**' header.")

    if not re.search(r'(?m)^\s*Feature:.*$', content):
        errors.append("Gherkin 'Feature:' is missing.")

    scenarios = list(re.finditer(r'(?m)^\s*Scenario:\s*(.+)$', content))
    if not scenarios:
        errors.append("No 'Scenario:' found in Gherkin.")
    else:
        for i, match in enumerate(scenarios):
            title = match.group(1).strip()
            start = match.end()
            end = scenarios[i + 1].start() if i + 1 < len(scenarios) else len(content)
            block = content[start:end]

            has_given = re.search(r'(?m)^\s*Given\b', block)
            has_when = re.search(r'(?m)^\s*When\b', block)
            has_then = re.search(r'(?m)^\s*Then\b', block)

            missing = []
            if not has_given:
                missing.append("Given")
            if not has_when:
                missing.append("When")
            if not has_then:
                missing.append("Then")

            if missing:
                errors.append(f"Scenario '{title}' is missing steps: {', '.join(missing)}.")
            elif not (has_given.start() < has_when.start() < has_then.start()):
                errors.append(f"Scenario '{title}' steps ordering seems incorrect. Expect Given -> When -> Then.")

            bad_steps = []
            for line in block.splitlines():
                if re.match(r'^\s*(Given|When|Then|And)\b', line) and not re.match(r'^\s*(Given|When|Then|And)\s+\S', line):
                    bad_steps.append(line.strip())

            if bad_steps:
                errors.append(f"Scenario '{title}' has malformed step lines: {bad_steps}")

    return (len(errors) == 0, errors)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("INVALID: Usage: python validate_issue_format.py <issue_file>")
        sys.exit(2)

    issue_file = sys.argv[1]
    try:
        with open(issue_file, "r", encoding="utf-8") as file:
            content = file.read()
    except Exception as error:
        print(f"INVALID: Could not read file '{issue_file}': {error}")
        sys.exit(2)

    is_valid, errors = validate_issue_format(content)
    if is_valid:
        print("VALID")
        sys.exit(0)

    print("INVALID: Validation failed with the following errors:")
    for error in errors:
        print(f"- {error}")
    sys.exit(2)