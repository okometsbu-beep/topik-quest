#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const existing = (file) => fs.existsSync(path.join(root, file.replace(/^\.\//, '')));

function versionOf(source, expression, label) {
  const match = source.match(expression);
  assert.ok(match, `${label} version is missing`);
  return match[1];
}

function frozenList(source, name) {
  const match = source.match(new RegExp(`const ${name}=Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\);`));
  assert.ok(match, `${name} is missing`);
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]);
}

function unique(items, label) {
  assert.equal(new Set(items).size, items.length, `${label} contains duplicate entries`);
}

function before(items, first, second) {
  assert.ok(items.indexOf(first) >= 0, `${first} is missing from runtime`);
  assert.ok(items.indexOf(second) >= 0, `${second} is missing from runtime`);
  assert.ok(items.indexOf(first) < items.indexOf(second), `${first} must load before ${second}`);
}

const index = read('index.html');
const bootstrap = read('site-patch.js');
const worker = read('sw.js');
const versions = {
  index: versionOf(index, /const appVersion=['"](\d+)['"]/, 'index.html'),
  bootstrap: versionOf(bootstrap, /const VERSION=['"](\d+)['"]/, 'site-patch.js'),
  worker: versionOf(worker, /const VERSION=['"](\d+)['"]/, 'sw.js')
};
assert.equal(new Set(Object.values(versions)).size, 1, `release versions disagree: ${JSON.stringify(versions)}`);
const releaseVersion = versions.index;
const literalAssetVersions = [...index.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert.ok(literalAssetVersions.length >= 3, 'versioned base asset URLs are missing from index.html');
assert.ok(literalAssetVersions.every((version) => version === releaseVersion), 'index.html contains a stale literal asset version');
for (const file of ['styles.css', 'legacy-data.js', 'legacy-core.js']) {
  assert.ok(index.includes(`${file}?v=${releaseVersion}`), `${file} is missing from the versioned HTML shell`);
}

const runtime = frozenList(bootstrap, 'RUNTIME_FILES');
const shell = frozenList(worker, 'SHELL');
unique(runtime, 'RUNTIME_FILES');
unique(shell, 'SHELL');
for (const file of [...runtime, ...shell]) assert.ok(existing(file), `runtime target does not exist: ${file}`);

for (let part = 1; part <= 4; part++) before(runtime, `data/question-bank-v1-part${part}.js`, 'question-bank-engine.js');
before(runtime, 'site-patch-core.js', 'tts-quality.js');
before(runtime, 'tts-quality.js', 'topik1.js');
before(runtime, 'tts-quality.js', 'learning-features.js');
before(runtime, 'question-bank-engine.js', 'topik1.js');
before(runtime, 'topik1.js', 'learning-features.js');
before(runtime, 'data/story-pack-001.js', 'story-mode.js');
before(runtime, 'question-bank-engine.js', 'story-mode.js');
before(runtime, 'learning-features.js', 'story-mode.js');
before(runtime, 'story-mode.js', 'product-polish.js');
for (const [first, second] of [['app-polish-v22.js', 'app-polish-v24.js'], ['app-polish-v24.js', 'app-polish-v33.js'], ['app-polish-v33.js', 'app-polish-v34.js'], ['app-polish-v34.js', 'app-polish-v35.js']]) before(runtime, first, second);
before(runtime, 'app-polish-v35.js', 'vocab-editor.js');

const allowedPatches = new Set(['app-polish-v22.js', 'app-polish-v24.js', 'app-polish-v33.js', 'app-polish-v34.js', 'app-polish-v35.js']);
const numberedPatches = fs.readdirSync(root).filter((file) => /^app-polish-v\d+\.js$/.test(file));
assert.deepEqual(new Set(numberedPatches), allowedPatches, 'do not add another numbered patch; use an owning or purpose-named module');

const manifest = JSON.parse(read('data/question-bank-manifest.json'));
assert.equal(manifest.total_items, 2088, 'question-bank manifest item count changed');
for (const output of manifest.outputs) {
  const bytes = fs.readFileSync(path.join(root, output.file));
  assert.equal(bytes.length, output.bytes, `${output.file} byte count differs from manifest`);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), output.sha256, `${output.file} hash differs from manifest`);
}

const runtimeBytes = runtime.reduce((sum, file) => sum + fs.statSync(path.join(root, file)).size, 0);
console.log(`runtime contract: v${releaseVersion}, ${runtime.length} ordered files, ${(runtimeBytes / 1024 / 1024).toFixed(2)} MiB, bank hashes valid`);
