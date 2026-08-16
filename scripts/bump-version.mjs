#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['index.html', 'site-patch.js', 'sw.js'];
const sources = Object.fromEntries(files.map((file) => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
const current = {
  'index.html': sources['index.html'].match(/const appVersion='(\d+)'/)?.[1],
  'site-patch.js': sources['site-patch.js'].match(/const VERSION='(\d+)'/)?.[1],
  'sw.js': sources['sw.js'].match(/const VERSION='(\d+)'/)?.[1]
};
assert.ok(Object.values(current).every(Boolean), 'one or more release versions are missing');
assert.equal(new Set(Object.values(current)).size, 1, `release versions disagree: ${JSON.stringify(current)}`);

const previous = Number(current['index.html']);
const argument = process.argv[2] || 'next';
const next = argument === 'next' ? previous + 1 : Number(argument);
assert.ok(Number.isInteger(next) && next > previous, `new version must be an integer greater than ${previous}`);

const replacements = {
  'index.html': sources['index.html']
    .replace(/const appVersion='\d+'/, `const appVersion='${next}'`)
    .replace(/\?v=\d+/g, `?v=${next}`),
  'site-patch.js': sources['site-patch.js']
    .replace(/\/\/ MALBIT bootstrap v\d+/, `// MALBIT bootstrap v${next}`)
    .replace(/const VERSION='\d+'/, `const VERSION='${next}'`),
  'sw.js': sources['sw.js'].replace(/const VERSION='\d+'/, `const VERSION='${next}'`)
};
for (const file of files) {
  assert.notEqual(replacements[file], sources[file], `${file} was not updated`);
  fs.writeFileSync(path.join(root, file), replacements[file]);
}
console.log(`MALBIT release version: v${previous} -> v${next}`);
