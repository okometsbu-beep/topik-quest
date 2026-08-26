const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function makeStorage(seed = {}) {
  const values = new Map(Object.entries(seed).map(([key, value]) => [key, String(value)]));
  return {
    values,
    api: {
      get length() { return values.size; },
      key: index => [...values.keys()][index] ?? null,
      getItem: key => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: key => values.delete(key)
    }
  };
}

function runGuard(seed) {
  const storage = makeStorage(seed);
  const context = {
    console,
    localStorage: storage.api,
    document: { visibilityState: 'visible', addEventListener: () => {} },
    setInterval: () => 1,
    addEventListener: () => {}
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read('storage-guard.js'), context);
  return { storage: storage.values, context };
}

test('an update recovers vocabulary, game, review, and travel roots from the durable snapshot', () => {
  const core = {
    lang: 'ja',
    view: 'vocab',
    gameUnlock: 17,
    gameAnswers: { 16: { clear: true } },
    vocab: [{ text: '여행', meanings: { ja: '旅行' }, repetitions: 3 }],
    transCache: { disposable: 'not copied into recovery' }
  };
  const travel = { version: 1, activePackId: 'case-001-missing-ticket', metrics: { version: 1, routeStarts: 3, routeCompletions: 2, myeongdongEntries: 2, exchangeSessions: 1 }, episodes: { 'case-001-missing-ticket': { completed: true, bestScore: 5 } } };
  const snapshot = {
    schema: 1,
    storage: {
      topikQuestV8: JSON.stringify(core),
      topikQuestTopik1GameV1: JSON.stringify({ profiles: { 1: { unlock: 6 } } }),
      malbitWrongReviewV3: JSON.stringify({ items: [{ id: 'M01-I-L-11' }] }),
      malbitStoryV1: JSON.stringify(travel)
    }
  };
  const { storage } = runGuard({ malbitRecoverySnapshotV1: JSON.stringify(snapshot) });
  const restoredCore = JSON.parse(storage.get('topikQuestV8'));

  assert.equal(restoredCore.vocab[0].text, '여행');
  assert.equal(restoredCore.gameUnlock, 17);
  assert.deepEqual(JSON.parse(storage.get('topikQuestTopik1GameV1')).profiles, { 1: { unlock: 6 } });
  assert.equal(JSON.parse(storage.get('malbitWrongReviewV3')).items.length, 1);
  assert.equal(JSON.parse(storage.get('malbitStoryV1')).episodes['case-001-missing-ticket'].bestScore, 5);
  assert.deepEqual(JSON.parse(storage.get('malbitStoryV1')).metrics, travel.metrics);
});

test('a suspicious empty core cannot overwrite a richer learner record', () => {
  const saved = JSON.stringify({ vocab: [{ text: '광화문' }], gameUnlock: 8, gameAnswers: { 7: { clear: true } } });
  const snapshot = JSON.stringify({ schema: 1, storage: { topikQuestV8: saved } });
  const { storage } = runGuard({
    malbitRecoverySnapshotV1: snapshot,
    topikQuestV8: JSON.stringify({ lang: 'ko', view: 'home', vocab: [], gameUnlock: 1, gameAnswers: {} })
  });

  assert.equal(JSON.parse(storage.get('topikQuestV8')).vocab[0].text, '광화문');
});

test('backup import preserves newer roots that are absent from an older file', () => {
  const source = read('product-polish.js');
  assert.match(source, /'malbitBeginnerV1','malbitStoryV1'/);
  assert.match(source, /MALBIT_STORAGE_GUARD\?\.capture\?\.\('before-import'\)/);
  assert.doesNotMatch(source, /for\(const key of PORTABLE_KEYS\)localStorage\.removeItem\(key\)/);
  assert.match(source, /MALBIT_STORAGE_GUARD\?\.clear\?\.\(\)/);
});

test('the airport route keeps the legacy storage root and leaves old episodes untouched', () => {
  const runtime = read('travel-mode.js');
  const pack = read('data/travel-pack-seoul-001.js');
  assert.match(runtime, /const STORAGE_KEY='malbitStoryV1'/);
  assert.doesNotMatch(runtime,/store\.episodes\s*=\s*\{\}/);
  for (const id of ['arrival', 'q-hello', 'q-station', 'q-myeongdong', 'transport', 'ride-all-stop', 'ride-express', 'ride-taxi', 'q-ticket', 'q-transfer', 'q-thanks', 'ending']) {
    assert.match(pack, new RegExp("id:'" + id + "'"));
  }
});
