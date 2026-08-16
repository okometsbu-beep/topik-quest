#!/usr/bin/env node
import assert from 'node:assert/strict';

const rawBase = process.argv[2] || process.env.MALBIT_SMOKE_URL || 'http://127.0.0.1:4173/';
const base = new URL(rawBase.endsWith('/') ? rawBase : `${rawBase}/`);
const started = Date.now();

async function text(url, label) {
  const response = await fetch(url, { cache: 'no-store' });
  assert.equal(response.status, 200, `${label} returned HTTP ${response.status}`);
  return response.text();
}

function frozenList(source, name) {
  const match = source.match(new RegExp(`const ${name}=Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\);`));
  assert.ok(match, `${name} is missing from fetched bootstrap`);
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]);
}

const indexUrl = new URL(`index.html?smoke=${Date.now()}`, base);
const index = await text(indexUrl, 'index.html');
assert.match(index, /<title>MALBIT · Korean Learning<\/title>/);
const version = index.match(/const appVersion=['"](\d+)['"]/)?.[1];
assert.ok(version, 'index release version is missing');

const baseFiles = ['styles.css', 'legacy-data.js', 'legacy-core.js'];
const basePayloads = await Promise.all(baseFiles.map(async (file) => {
  assert.ok(index.includes(`${file}?v=${version}`), `${file} is missing from index.html`);
  const response = await fetch(new URL(`${file}?v=${version}`, base), { cache: 'no-store' });
  assert.equal(response.status, 200, `${file} returned HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  if (file.endsWith('.css')) assert.match(contentType, /^text\/css\b/, `${file} has an unsafe MIME type`);
  else assert.match(contentType, /javascript/, `${file} has an unsafe MIME type`);
  return Number(response.headers.get('content-length')) || (await response.arrayBuffer()).byteLength;
}));

const bootstrap = await text(new URL(`site-patch.js?v=${version}`, base), 'site-patch.js');
assert.equal(bootstrap.match(/const VERSION=['"](\d+)['"]/)?.[1], version, 'bootstrap version differs from index');
const runtime = frozenList(bootstrap, 'RUNTIME_FILES');

const payloads = await Promise.all(runtime.map(async (file) => {
  const response = await fetch(new URL(`${file}?v=${version}`, base), { cache: 'no-store' });
  assert.equal(response.status, 200, `${file} returned HTTP ${response.status}`);
  assert.match(response.headers.get('content-type') || '', /javascript/, `${file} has an unsafe MIME type`);
  return Number(response.headers.get('content-length')) || (await response.arrayBuffer()).byteLength;
}));

const worker = await text(new URL(`sw.js?v=${version}`, base), 'sw.js');
assert.equal(worker.match(/const VERSION=['"](\d+)['"]/)?.[1], version, 'service-worker version differs from index');
const totalBytes = [...basePayloads, ...payloads].reduce((sum, bytes) => sum + bytes, 0);
console.log(`HTTP smoke: ${base.href} v${version}, ${baseFiles.length} base + ${runtime.length} runtime files, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB, ${Date.now() - started} ms`);
