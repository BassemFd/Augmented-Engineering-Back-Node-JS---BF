#!/usr/bin/env node
import fs from 'node:fs';

function validateIssueFormat(content) {
  const errors = [];

  if (!/^#\s+.+/m.test(content)) {
    errors.push("Title is missing or malformed. Expect a top-level markdown title starting with '# '.");
  }

  if (!/\*\*(Context|Contexte)\*\*\s*\n\s*.+/.test(content)) {
    errors.push("Context section is missing or malformed. Expect a '**Context**' section with at least one non-empty line.");
  }

  if (!/\*\*(Acceptance Criteria|Critères d'acceptation|Acceptance)\*\*/.test(content)) {
    errors.push("Acceptance Criteria section is missing or malformed. Expect '**Acceptance Criteria**' header.");
  }

  if (!/^\s*Feature:.*$/m.test(content)) {
    errors.push("Gherkin 'Feature:' is missing.");
  }

  const scenarioRegex = /^\s*Scenario:\s*(.+)$/gm;
  const scenarios = Array.from(content.matchAll(scenarioRegex));

  if (scenarios.length === 0) {
    errors.push("No 'Scenario:' found in Gherkin.");
  } else {
    for (let i = 0; i < scenarios.length; i += 1) {
      const title = scenarios[i][1].trim();
      const scenarioHeader = scenarios[i][0];
      const start = (scenarios[i].index ?? 0) + scenarioHeader.length;
      const end = i + 1 < scenarios.length ? scenarios[i + 1].index ?? content.length : content.length;
      const block = content.slice(start, end);

      const given = block.match(/^\s*Given\b/m);
      const when = block.match(/^\s*When\b/m);
      const then = block.match(/^\s*Then\b/m);

      const missing = [];
      if (!given) missing.push('Given');
      if (!when) missing.push('When');
      if (!then) missing.push('Then');

      if (missing.length > 0) {
        errors.push(`Scenario '${title}' is missing steps: ${missing.join(', ')}.`);
      } else {
        const g = given.index ?? -1;
        const w = when.index ?? -1;
        const t = then.index ?? -1;

        if (!(g < w && w < t)) {
          errors.push(`Scenario '${title}' steps ordering seems incorrect. Expect Given -> When -> Then.`);
        }
      }

      const badSteps = [];
      for (const line of block.split('\n')) {
        if (/^\s*(Given|When|Then|And)\b/.test(line) && !/^\s*(Given|When|Then|And)\s+\S/.test(line)) {
          badSteps.push(line.trim());
        }
      }

      if (badSteps.length > 0) {
        errors.push(`Scenario '${title}' has malformed step lines: ${JSON.stringify(badSteps)}`);
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

if (process.argv.length !== 3) {
  console.log('INVALID: Usage: node validate_issue_format.mjs <issue_file>');
  process.exit(2);
}

const issueFile = process.argv[2];
let content;

try {
  content = fs.readFileSync(issueFile, 'utf8');
} catch (error) {
  console.log(`INVALID: Could not read file '${issueFile}': ${error.message}`);
  process.exit(2);
}

const { isValid, errors } = validateIssueFormat(content);
if (isValid) {
  console.log('VALID');
  process.exit(0);
}

console.log('INVALID: Validation failed with the following errors:');
for (const error of errors) {
  console.log(`- ${error}`);
}

process.exit(2);