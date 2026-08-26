const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('runtime contract validates versions, loader files and generated bank hashes', () => {
  const output = execFileSync(process.execPath, ['scripts/check-runtime.mjs'], { cwd: root, encoding: 'utf8' });
  assert.match(output, /runtime contract: v\d+/);
  assert.match(output, /bank hashes valid/);
});

test('bootstrap preloads in parallel and executes in the declared order', () => {
  const bootstrap = read('site-patch.js');
  assert.match(bootstrap, /const RUNTIME_FILES=Object\.freeze/);
  assert.match(bootstrap, /RUNTIME_FILES\.forEach\(preload\)/);
  assert.match(bootstrap, /await loadSeries\(RUNTIME_FILES\)/);
  assert.doesNotMatch(bootstrap, /\.then\(\(\)=>load/);
});

test('the HTML shell keeps cacheable base assets outside the document', () => {
  const index = read('index.html');
  const version = index.match(/const appVersion='(\d+)'/)?.[1];
  assert.ok(version);
  assert.ok(Buffer.byteLength(index) < 10_000, 'index.html should remain a small shell');
  for (const file of ['styles.css', 'legacy-data.js', 'legacy-core.js']) {
    assert.match(index, new RegExp(`${file.replace('.', '\\.')}\\?v=${version}`));
  }
  assert.doesNotMatch(index, /<style>/);
  assert.match(read('legacy-data.js'), /^const RW=/);
  assert.match(read('legacy-core.js'), /^const \$=/);
});

test('service worker installs a small shell and deletes only MALBIT caches', () => {
  const worker = read('sw.js');
  assert.match(worker, /const SHELL=Object\.freeze/);
  for (const file of ['./styles.css', './legacy-data.js', './legacy-core.js']) assert.match(worker, new RegExp(file.replace('.', '\\.')));
  assert.match(worker, /key\.startsWith\(CACHE_PREFIX\)/);
  assert.doesNotMatch(worker, /keys\.filter\(key=>key!==CACHE\)/);
});

test('game feedback stays scroll-stable and teaches a repeatable solving method', () => {
  const growth = read('product-growth.js');
  const topik = read('topik1.js');
  const styles = read('styles.css');
  const focus = growth.match(/function focusBattleCard\(\)\{[^\n]*/)?.[0] || '';
  assert.ok(focus, 'battle focus hook should remain explicit');
  assert.doesNotMatch(focus, /scrollIntoView|scrollTo/,'rendering a battle must not move the page automatically');
  assert.match(topik, /function gameTutorMarkup/);
  assert.match(topik, /gameTutorMarkup\(q,sel\)/);
  assert.match(topik, /시간이 끝나 보기를 고르지 못했습니다/);
  assert.match(topik, /時間切れで選択できませんでした/);
  assert.match(styles, /body\.tq-game-active #screen[\s\S]{0,180}overflow-anchor:none/);
});

test('one command bumps bootstrap, worker, and every literal asset URL', () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'malbit-version-'));
  try {
    fs.mkdirSync(path.join(temporaryRoot, 'scripts'));
    for (const file of ['index.html', 'site-patch.js', 'sw.js']) fs.copyFileSync(path.join(root, file), path.join(temporaryRoot, file));
    fs.copyFileSync(path.join(root, 'scripts/bump-version.mjs'), path.join(temporaryRoot, 'scripts/bump-version.mjs'));
    const current = Number(read('index.html').match(/const appVersion='(\d+)'/)[1]);
    execFileSync(process.execPath, ['scripts/bump-version.mjs', String(current + 1)], { cwd: temporaryRoot });
    const bumpedIndex = fs.readFileSync(path.join(temporaryRoot, 'index.html'), 'utf8');
    assert.match(bumpedIndex, new RegExp(`const appVersion='${current + 1}'`));
    assert.ok([...bumpedIndex.matchAll(/\?v=(\d+)/g)].every((match) => Number(match[1]) === current + 1));
    assert.match(fs.readFileSync(path.join(temporaryRoot, 'site-patch.js'), 'utf8'), new RegExp(`const VERSION='${current + 1}'`));
    assert.match(fs.readFileSync(path.join(temporaryRoot, 'sw.js'), 'utf8'), new RegExp(`const VERSION='${current + 1}'`));
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
