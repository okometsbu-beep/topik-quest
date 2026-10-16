const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { build } = require('../scripts/build-listening-register-corrections.cjs');
const read = file => fs.readFileSync(file, 'utf8');
const json = file => JSON.parse(read(file));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const clone = data => JSON.parse(JSON.stringify(data));
const source = json('content/listening-register-repairs-v1.json');
const base = json('audio/listening/v1/corpus.json');
const spec = json('audio/listening/register-v1/corpus.json');

function boot() {
  const storage = new Map([['malbitNextMockSet:2', '7']]);
  const context = { console, window: {}, localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)), removeItem: key => storage.delete(key) } };
  context.window.window = context.window;
  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  for (let part = 1; part <= 4; part++) vm.runInContext(read(`data/question-bank-v1-part${part}.js`), context);
  const rows = clone(context.window.MALBIT_QUESTION_BANK_PARTS.flat());
  vm.runInContext(read('data/question-bank-practice-v1.js'), context);
  vm.runInContext(read('data/listening-register-corrections-v1.js'), context);
  vm.runInContext(read('question-bank-engine.js'), context);
  return { context, rows, storage, overlay: context.window.HARUMAL_LISTENING_REGISTER_CORRECTIONS, bank: context.window.MALBIT_BANK };
}

test('the repair layer is limited to 144 stable IDs and 60 independently reviewed utterances', () => {
  const { overlay, rows } = boot();
  const expectedIds = Array.from({ length: 12 }, (_, index) => Array.from({ length: 12 }, (_, number) => `M${String(index + 1).padStart(2, '0')}-II-L-${String(number + 9).padStart(2, '0')}`)).flat();
  assert.deepEqual(Object.keys(overlay.byId).sort(), expectedIds.sort());
  assert.equal(spec.questionCount, 144);
  assert.equal(spec.textCount, 60);
  assert.equal(spec.clipCount, 60);
  assert.equal(source.excludedContextualQuestionCount, 360);
  assert.equal(source.excludedContextualUtteranceCount, 20);
  assert.equal(source.reviewStatus, 'approved');
  assert.equal(source.reviewRecord.scope, 'independent AI text review; not native-speaker or listening QA');
  assert.deepEqual(clone(build(source, base, rows).spec), spec);
  assert.ok(Object.isFrozen(overlay) && Object.isFrozen(overlay.byId));
  for (const repair of Object.values(overlay.byId)) {
    assert.ok(Object.isFrozen(repair));
    assert.equal(repair.originalScriptSha256, hash(repair.originalScript));
    assert.equal(repair.scriptSha256, hash(repair.script));
  }
});

test('pending audio never changes current question text, answers, IDs, or saved progress', () => {
  const { overlay, bank, rows, storage } = boot();
  assert.equal(overlay.audioReady, false);
  assert.equal(overlay.activationAllowed, false);
  assert.equal(bank.total, 2144);
  for (const [id, repair] of Object.entries(overlay.byId)) {
    const original = rows.find(row => row[0] === id);
    const question = bank.byId(id);
    assert.equal(repair.audioReady, false);
    assert.equal(question.script, original[9]);
    assert.equal(question.passage, original[8]);
    assert.equal(question.instruction, original[7]);
    assert.deepEqual(clone(question.options), original[11]);
    assert.equal(question.answerIndex, original[12]);
    assert.equal(question.explanationKo, original[13]);
    assert.equal(question.explanationJa, original[14]);
  }
  assert.deepEqual([...storage], [['malbitNextMockSet:2', '7']]);
});

test('every corrected script has exact segment hashes and old audio remains separate', () => {
  const newTexts = new Map(spec.corpus.map(row => [row.id, row]));
  const oldTexts = new Map(base.corpus.map(row => [row.id, row]));
  for (const row of spec.corpus) {
    assert.equal(hash(row.text).slice(0, 16), row.id);
    assert.ok(!oldTexts.has(row.id));
    for (const sentence of row.text.split(/(?<=[.!?])\s+/)) assert.ok(sentence === '네.' || /니다\.$/.test(sentence), sentence);
    for (const file of row.retainedOriginalFiles) assert.ok(fs.existsSync(file), file);
  }
  for (const question of spec.coverage) {
    const original = base.scripts[question.originalScript];
    const corrected = spec.scripts[question.script];
    assert.equal(corrected.length, original.length);
    assert.notEqual(question.script, question.originalScript);
    for (const segment of corrected) {
      if (segment.pause) continue;
      const repaired = newTexts.has(segment.id);
      assert.equal(segment.text, (repaired ? newTexts : oldTexts).get(segment.id).text);
      assert.equal(segment.file, `audio/listening/${repaired ? 'register-v1' : 'v1'}/${segment.voice}/${segment.id}.mp3`);
      assert.equal(hash(segment.text).slice(0, 16), segment.id);
    }
  }
});

test('missing recordings and unperformed listening QA are never labelled complete', () => {
  const manifest = json('audio/listening/register-v1/manifest.json');
  assert.equal(manifest.corpusSha256, hash(read('audio/listening/register-v1/corpus.json')));
  assert.equal(manifest.expectedFileCount, 60);
  assert.equal(manifest.fileCount + manifest.missingFileCount, 60);
  assert.equal(manifest.invalidFileCount || 0, 0);
  assert.equal(manifest.activationAllowed, false);
  assert.equal(manifest.decodeVerified, manifest.missingFileCount === 0);
  assert.equal(manifest.scriptToAudioMeaningVerified, false);
  assert.equal(manifest.humanPronunciationReview, false);
  assert.equal(manifest.physicalDevicePlaybackVerified, false);
  for (const missing of manifest.missing) assert.equal(fs.existsSync(missing.file), false);
  for (const file of manifest.files) {
    assert.equal(hash(fs.readFileSync(file.file)), file.sha256);
    assert.ok(file.duration > .2 && file.peak < 1 && file.rms > .001);
    assert.ok(Number.isFinite(file.integratedLufs) && file.integratedLufs > -30 && file.integratedLufs < -8);
    assert.ok(Number.isFinite(file.truePeakDb) && file.truePeakDb < 0);
  }
});

test('the female-targeted single-speaker prompts use F1 in new metadata while old M1 files remain', () => {
  const { rows } = boot();
  const repairs = spec.corpus.filter(row => row.castingCorrection);
  assert.equal(repairs.length, 20);
  assert.equal(new Set(repairs.flatMap(row => row.sources)).size, 48);
  assert.equal(source.castingReviewRecord.actualAudioListeningPerformed, false);
  for (const row of spec.corpus) assert.deepEqual(row.voices, ['F1']);
  for (const row of repairs) {
    assert.deepEqual(row.originalVoices, ['M1']);
    assert.ok(row.retainedOriginalFiles.every(file => /\/v1\/M1\//.test(file)));
    for (const id of row.sources) {
      const original = rows.find(row => row[0] === id);
      assert.match(original[7], /여자의 중심 생각/);
      assert.equal(original[9].split('\n').length, 1);
      assert.equal(base.scripts[original[9]][0].voice, 'M1');
      const corrected = spec.scripts[spec.coverage.find(row => row.id === id).script];
      assert.equal(corrected.length, 1);
      assert.equal(corrected[0].voice, 'F1');
    }
  }
});

test('original corpus, audio manifest, recordings, and generated bank bytes are preserved', () => {
  assert.equal(hash(read('audio/listening/v1/corpus.json')), source.sourceCorpusSha256);
  assert.equal(hash(read('audio/listening/v1/manifest.json')), source.sourceManifestSha256);
  for (const output of json('data/question-bank-manifest.json').outputs) {
    const bytes = fs.readFileSync(output.file);
    assert.equal(hash(bytes), output.sha256);
    assert.equal(bytes.length, output.bytes);
  }
  const manifest = json('audio/listening/v1/manifest.json');
  assert.equal(manifest.files.length, 363);
  assert.equal(manifest.retainedLegacyFiles.length, 10);
  for (const entry of [...manifest.files, ...manifest.retainedLegacyFiles]) assert.equal(hash(fs.readFileSync(entry.file)), entry.sha256);
});

test('builders reject drift, unknown IDs, broad replacements, and unreviewed text changes', () => {
  const { rows } = boot();
  const badText = clone(source); badText.utterances[0].text += ' 다른 주장입니다.';
  assert.throws(() => build(badText, base, rows), /Text changed since independent review/);
  const badId = clone(source); badId.questions[0].id = 'M99-II-L-09';
  assert.throws(() => build(badId, base, rows), /Unknown original question/);
  const changedRows = clone(rows); changedRows.find(row => row[0] === source.questions[0].id)[9] += ' 변경';
  assert.throws(() => build(source, base, changedRows));
  const activation = clone(source); activation.activationAllowed = true;
  assert.throws(() => build(activation, base, rows), /Activation requires separate reviewed audio integration/);
});

test('the checked-in correction data is reproducible without any model or network', () => {
  assert.match(execFileSync(process.execPath, ['scripts/build-listening-register-corrections.cjs', '--check'], { encoding: 'utf8' }), /144 unchanged IDs, 60 repair clips, runtime activation disabled/);
});
