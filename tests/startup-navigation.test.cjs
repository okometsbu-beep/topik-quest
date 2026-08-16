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

test('v33 cache bust reaches returning mobile users', () => {
  assert.match(read('sw.js'), /VERSION='33'/);
  assert.match(read('sw.js'), /app-polish-v33\.js/);
  assert.match(read('site-patch.js'), /const v='33'/);
  assert.match(read('site-patch.js'), /load\('app-polish-v33\.js'\)/);
  assert.match(read('index.html'), /site-patch\.js\?v=33/);
});

test('v33 supplies theme, listening, stable trail, language and beginner affordances', () => {
  const v33 = read('app-polish-v33.js');
  assert.match(v33, /MALBIT_LISTENING_ENABLED/);
  assert.match(v33, /malbitSetListeningMode/);
  assert.match(v33, /patchStatsLanguage/);
  assert.match(v33, /tqReviewScreen\{background:#071321/);
  assert.match(v33, /t1TrailRoute\{height:774px.*overflow:hidden/);
  assert.match(v33, /t1TrailToast\{position:fixed/);
  assert.match(v33, /HANGUL START/);
  assert.match(v33, /qno\{box-sizing:border-box/);
});
