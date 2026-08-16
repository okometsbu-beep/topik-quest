#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extensions = new Set(['.js', '.mjs', '.cjs']);
const files = [];

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(absolute);
    else if (extensions.has(path.extname(entry.name))) files.push(path.relative(root, absolute));
  }
}

visit(root);
files.sort();
for (const file of files) execFileSync(process.execPath, ['--check', file], { cwd: root, stdio: 'pipe' });
console.log(`syntax check: ${files.length} JavaScript files parsed`);
