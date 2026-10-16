'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));

function bootRegister(change = () => {}) {
  const c = { window: {}, console, localStorage: { getItem: () => null, setItem() {} } };
  vm.createContext(c);
  for (let part = 1; part <= 4; part++) vm.runInContext(read(`data/question-bank-v1-part${part}.js`), c);
  for (const file of ['data/question-bank-practice-v1.js', 'data/listening-register-corrections-v1.js', 'data/listening-register-audio-v1.js']) vm.runInContext(read(file), c);
  change(c.window);
  vm.runInContext(read('data/listening-register-release-v1.js'), c);
  vm.runInContext(read('question-bank-engine.js'), c);
  return c.window;
}

test('release pins approved text and the complete ordered audio mapping, not claimed hashes alone', () => {
  const corpus = json('audio/listening/register-v1/corpus.json');
  const q = corpus.coverage.find(q => corpus.scripts[q.script].length === 2);
  assert.ok(q);
  const changes = {
    'reordered segments': w => w.HARUMAL_LISTENING_REGISTER_AUDIO.scripts[q.script].reverse(),
    'extra segment': w => w.HARUMAL_LISTENING_REGISTER_AUDIO.scripts[q.script].push({ id: 'wrong', voice: 'M1', file: 'audio/listening/v1/wrong.mp3', text: 'Wrong audio' }),
    'changed unrepaired segment': w => { w.HARUMAL_LISTENING_REGISTER_AUDIO.scripts[q.script].find(s => s.file.includes('/v1/')).file = 'audio/listening/v1/wrong.mp3'; },
    'changed segment text': w => { w.HARUMAL_LISTENING_REGISTER_AUDIO.scripts[q.script][0].text += ' Unreviewed.'; },
    'new script with copied segments': w => {
      const pending = clone(w.HARUMAL_LISTENING_REGISTER_CORRECTIONS);
      pending.byId[q.id].script += ' Unreviewed sentence.';
      w.HARUMAL_LISTENING_REGISTER_AUDIO.scripts[pending.byId[q.id].script] = w.HARUMAL_LISTENING_REGISTER_AUDIO.scripts[q.script];
      w.HARUMAL_LISTENING_REGISTER_CORRECTIONS = pending;
    },
    'changed original script hash': w => {
      const pending = clone(w.HARUMAL_LISTENING_REGISTER_CORRECTIONS);
      pending.byId[q.id].originalScriptSha256 = '0'.repeat(64);
      w.HARUMAL_LISTENING_REGISTER_CORRECTIONS = pending;
    }
  };
  for (const [label, change] of Object.entries(changes)) {
    const w = bootRegister(change);
    assert.equal(w.HARUMAL_LISTENING_REGISTER_CORRECTIONS.activationAllowed, false, label);
    assert.equal(w.MALBIT_BANK.byId(q.id).script, q.originalScript, label);
    assert.notEqual(w.MALBIT_BANK.byId(q.id).audioStatus, 'recorded', label);
  }
  const w = bootRegister();
  assert.equal(w.MALBIT_BANK.byId(q.id).script, q.script);
  assert.equal(w.HARUMAL_LISTENING_REGISTER_CORRECTIONS.release.humanPronunciationReview, false);
});

test('a copied casting approval cannot authorize another ID or a changed speaker prompt after rehashing', async () => {
  const { buildCorpus } = await import('../scripts/build-original-listening-corpus.mjs');
  const { reviewHash } = await import('../scripts/build-original-exams.mjs');
  const base = 'audio/listening/original-v9/';
  for (const target of ['other-id', 'speaker-prompt']) {
    const snapshot = json(base + 'source-snapshot.json');
    const review = json(base + 'gender-reference-review.json');
    snapshot.items = snapshot.items.filter(q => q.id === 'O08-II-L-48');
    delete snapshot.reusePacks;
    const q = snapshot.items[0], row = review.items[0];
    if (target === 'other-id') q.id = 'O08-II-L-47';
    else q.prompt = '남자가 강조하는 생각은 무엇입니까?';
    q.qa.contentSha256 = reviewHash(q);
    Object.assign(row, { id: q.id, sourceContentSha256: q.qa.contentSha256, sourceScriptSha256: hash(q.script), promptSha256: hash(q.prompt), instructionSha256: hash(q.instruction) });
    const reviewBytes = JSON.stringify(review);
    snapshot.genderReferenceReviewSha256 = hash(reviewBytes);
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'harumal-integrity-review-'));
    const folder = path.join(temp, base);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'source-snapshot.json'), JSON.stringify(snapshot));
    fs.writeFileSync(path.join(folder, 'gender-reference-review.json'), reviewBytes);
    try { assert.throws(() => buildCorpus(temp, 'original-v9'), /Only the independently approved L48 exception/, target); }
    finally { fs.rmSync(temp, { recursive: true, force: true }); }
  }
});

// Intercept reads only inside a fresh process. Never modify shared release inputs,
// generated app data, or audio assets when exercising the release gate.
function runGate(change = '') {
  const code = `
    const fs = require('node:fs'), vm = require('node:vm'), crypto = require('node:crypto');
    const root = process.cwd(), originalRead = fs.readFileSync;
    const overrides = new Map();
    const read = file => originalRead(file, 'utf8');
    const json = file => JSON.parse(read(file));
    const hash = value => crypto.createHash('sha256').update(value).digest('hex');
    ${change}
    fs.readFileSync = function(file, options) {
      let key = String(file);
      if (key.startsWith(root + '/')) key = key.slice(root.length + 1);
      if (!overrides.has(key)) return originalRead.apply(this, arguments);
      const value = overrides.get(key);
      return typeof options === 'string' || options?.encoding ? value : Buffer.from(value);
    };
    import('./scripts/check-original-exams.mjs').catch(error => {
      console.error(error.message.split('\\n')[0]);
      process.exitCode = 1;
    });
  `;
  const result = spawnSync(process.execPath, ['-e', code], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  assert.ifError(result.error);
  return result;
}

test('partial release gate accepts the exact frozen reviewed subset and rejects stale scope bindings', () => {
  const clean = runGate();
  assert.equal(clean.status, 0, clean.stderr);
  assert.match(clean.stdout, /1668\/2088 reviewed items; 1548 four-language items; 730 source-matched listening/);
  for (const source of Object.keys(json('content/original-release-scope.json').sourceHashes)) {
    const result = runGate(`overrides.set(${JSON.stringify(source)}, read(${JSON.stringify(source)}) + ' ');`);
    assert.notEqual(result.status, 0, source);
    assert.match(result.stderr, /Release input changed/, source);
  }
  for (const change of ['scope.releaseVersion++;', 'scope.approvedItems++;', 'scope.fourLanguageItems++;', "delete scope.sourceHashes['content/original-listening-support.json'];"]) {
    const result = runGate(`const scope = json('content/original-release-scope.json'); ${change} overrides.set('content/original-release-scope.json', JSON.stringify(scope));`);
    assert.notEqual(result.status, 0, change);
  }
});

test('partial release gate rejects generated answer drift even with a freshly rehashed manifest', () => {
  const result = runGate(`
    const file = 'data/original-exams-v1-part1.js', code = read(file), c = {window:{}};
    vm.runInNewContext(code, c);
    const rows = c.window.MALBIT_ORIGINAL_EXAM_PARTS[0], before = JSON.stringify(rows);
    const q = rows.find(q => q.section === 'reading');
    q.answerIndex = (q.answerIndex + 1) % q.options.length;
    const patched = code.replace(before, JSON.stringify(rows));
    if (patched === code) throw Error('Test mutation did not alter the payload');
    const manifest = json('data/original-exams-manifest.json');
    manifest.files.find(f => f.file === file).sha256 = hash(patched);
    overrides.set(file, patched);
    overrides.set('data/original-exams-manifest.json', JSON.stringify(manifest));
  `);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Generated original core payload differs from the approved source/);
});

test('partial release gate rejects changed runtime localization even when its output hash is refreshed', () => {
  const result = runGate(`
    const file = 'data/original-support-v1.js', c = {window:{}};
    vm.runInNewContext(read(file), c);
    const support = c.window.HARUMAL_ORIGINAL_SUPPORT;
    Object.values(support.byId).find(row => row.coach?.en).coach.en.reason += ' Unreviewed text.';
    const patched = 'window.HARUMAL_ORIGINAL_SUPPORT=' + JSON.stringify(support) + ';';
    const manifest = json('data/original-support-manifest.json');
    manifest.outputSha256 = hash(patched);
    overrides.set(file, patched);
    overrides.set('data/original-support-manifest.json', JSON.stringify(manifest));
  `);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Runtime localization differs from independently approved source/);
});

test('partial release gate keeps locale-specific locked sets and exact listening coverage', () => {
  for (const [change, message] of [
    ['scope.listeningItems++;', /Original listening collection is incomplete/],
    ["scope.readySets['en-1'].push(11);", /Locale set readiness must match the frozen approved release/]
  ]) {
    const result = runGate(`const scope = json('content/original-release-scope.json'); ${change} overrides.set('content/original-release-scope.json', JSON.stringify(scope));`);
    assert.notEqual(result.status, 0, change);
    assert.match(result.stderr, message, change);
  }
});
