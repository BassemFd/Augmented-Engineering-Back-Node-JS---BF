#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

const target = process.argv[2] ?? 'SKILL.md';
const content = fs.readFileSync(target, 'utf8');

const match = content.match(/^---\n([\s\S]*?)\n---\n/);
if (!match) {
  fail(`Missing YAML frontmatter in ${target}`);
  process.exit();
}

const yaml = match[1];
const required = ['name', 'description'];
const entries = new Map();

for (const rawLine of yaml.split('\n')) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  const sep = line.indexOf(':');
  if (sep === -1) continue;
  const key = line.slice(0, sep).trim();
  const value = line.slice(sep + 1).trim();
  entries.set(key, value);
}

for (const key of required) {
  if (!entries.has(key) || entries.get(key) === '') {
    fail(`Missing required frontmatter field: ${key}`);
  }
}

const skillName = entries.get('name')?.replace(/^['"]|['"]$/g, '');
const folderName = path.basename(path.dirname(path.resolve(target)));

if (skillName && skillName !== folderName) {
  fail(`Frontmatter name (${skillName}) must match folder name (${folderName})`);
}

if (process.exitCode !== 1) {
  console.log(`Frontmatter looks valid for ${target}`);
}
