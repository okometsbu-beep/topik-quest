const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('startup opens the app directly without onboarding or level diagnostics', () => {
  const product = read('product-polish.js');
  const growth = read('product-growth.js');
  assert.doesNotMatch(product, /function showOnboarding|setTimeout\(showOnboarding/);
  assert.doesNotMatch(growth, /function startDiagnostic|function renderDiagnostic|diagnosticPending.*startDiagnostic/);
  assert.match(growth, /function retireStartupGates\(\)/);
});

test('bottom navigation routes are rendered and guarded against a frozen screen', () => {
  const index = read('index.html');
  const topik1 = read('topik1.js');
  const polish = read('app-polish-v22.js');
  for (const view of ['home', 'review', 'vocab', 'more']) {
    assert.match(index, new RegExp(`setView\\('${view}'\\)`));
  }
  assert.match(topik1, /setView\('stats'\)/);
  assert.match(polish, /\[MALBIT navigation\]/);
  assert.match(polish, /intro&&intro\.textContent!==introText/);
  assert.doesNotMatch(polish, /#malbitOnboarding,#malbitDiagnostic/);
});

test('v31 cache bust reaches returning mobile users', () => {
  assert.match(read('sw.js'), /VERSION='31'/);
  assert.match(read('site-patch.js'), /const v='31'/);
  assert.match(read('index.html'), /site-patch\.js\?v=31/);
});
