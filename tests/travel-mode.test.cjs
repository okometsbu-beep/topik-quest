const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const storage = new Map();
const context = {
  console,
  window: {},
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  }
};
context.window.window = context.window;
context.window.localStorage = context.localStorage;
vm.createContext(context);
for (let part = 1; part <= 4; part++) vm.runInContext(read(`data/question-bank-v1-part${part}.js`), context);
vm.runInContext(read('question-bank-engine.js'), context);
vm.runInContext(read('data/travel-pack-seoul-001.js'), context);

const bank = context.window.MALBIT_BANK;
const packs = context.window.MALBIT_TRAVEL_PACKS;
const languages = ['ko', 'ja', 'en', 'zh'];

function assertI18n(value, label) {
  for (const language of languages) assert.ok(String(value?.[language] || '').trim(), `${label}.${language} is missing`);
}

test('the first travel route is a complete, reachable six-question journey', () => {
  assert.equal(packs.length, 1);
  const pack = packs[0];
  assert.equal(pack.id, 'case-001-missing-ticket');
  assert.equal(pack.questionCount, 6);
  assert.equal(pack.scenes.filter(scene => scene.type === 'question').length, 6);
  assert.deepEqual(Array.from(pack.map.stops, stop => stop.id), ['seoul-station', 'city-hall', 'gwanghwamun']);
  assert.deepEqual(Array.from(pack.map.stops, stop => stop.unlockAt), [0, 2, 4]);
  assert.deepEqual(Array.from(pack.skins, skin => skin.unlock), ['default', 'clear', 'perfect']);
  const approach = pack.scenes.find(scene => scene.id === 'approach');
  const visibleChoices = approach.choices.filter(choice => !choice.legacy);
  assert.deepEqual(Array.from(visibleChoices, choice => choice.id), ['listener', 'reader']);
  assert.deepEqual(Array.from(visibleChoices, choice => choice.next), ['q-topic', 'q-checklist']);
  assert.equal(approach.choices.find(choice => choice.id === 'tracker').legacy, true, 'old tracker saves stay readable');

  const ids = pack.scenes.map(scene => scene.id);
  assert.equal(new Set(ids).size, ids.length, 'scene IDs must be unique');
  const reached = new Set();
  let scene = pack.scenes[0];
  while (scene && !reached.has(scene.id)) {
    reached.add(scene.id);
    scene = scene.next ? pack.scenes.find(candidate => candidate.id === scene.next) : null;
  }
  assert.equal(reached.size, pack.scenes.length, 'the complete episode must be reachable from its first scene');
  assert.equal(pack.scenes.at(-1).type, 'ending');
});

test('travel questions reuse valid original TOPIK I bank items', () => {
  const pack = packs[0];
  for (const scene of pack.scenes.filter(item => item.type === 'question')) {
    const question = bank.byId(scene.bankId);
    assert.ok(question, `${scene.id} references missing bank item ${scene.bankId}`);
    assert.equal(question.level, pack.level, `${scene.bankId} should match the episode level`);
    assert.notEqual(question.section, 'writing');
    assert.equal(question.options.length, 4);
  }
});

test('travel UI copy is complete in Korean, Japanese, English, and Chinese', () => {
  const pack = packs[0];
  for (const field of ['title', 'subtitle', 'description', 'duration']) assertI18n(pack[field], `pack.${field}`);
  for (const scene of pack.scenes) {
    assertI18n(scene.location, `${scene.id}.location`);
    assertI18n(scene.title, `${scene.id}.title`);
    if (scene.support) assertI18n(scene.support, `${scene.id}.support`);
    if (scene.context) assertI18n(scene.context, `${scene.id}.context`);
    for (const choice of scene.choices || []) {
      assertI18n(choice.label, `${scene.id}.${choice.id}.label`);
      assertI18n(choice.detail, `${scene.id}.${choice.id}.detail`);
      assertI18n(choice.title, `${scene.id}.${choice.id}.title`);
    }
    if (scene.clue) {
      assertI18n(scene.clue.label, `${scene.id}.clue.label`);
      assertI18n(scene.clue.detail, `${scene.id}.clue.detail`);
    }
  }
  for (const [key, ending] of Object.entries(pack.endings)) {
    assertI18n(ending.title, `ending.${key}.title`);
    assertI18n(ending.detail, `ending.${key}.detail`);
  }
  for (const stop of pack.map.stops) assertI18n(stop.name, `stop.${stop.id}.name`);
  for (const skin of pack.skins) assertI18n(skin.name, `skin.${skin.id}.name`);
});

test('Travel Mode is independent from Full Mock and wired into the ordered runtime', () => {
  const topik = read('topik1.js');
  const bootstrap = read('site-patch.js');
  const runtime = read('travel-mode.js');

  assert.match(topik, /mode==='travel'/);
  assert.match(topik, /class="tqV9Mode travel"/);
  assert.match(topik, /<button onclick="tqStartMode\('real'\)">[\s\S]{0,500}전체 모의고사/);
  assert.match(topik, /class="tqV9Mode travel" onclick="tqStartMode\('travel'\)"/);
  assert.ok(bootstrap.indexOf("'data/travel-pack-seoul-001.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.ok(bootstrap.indexOf("'question-bank-engine.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.ok(bootstrap.indexOf("'topik1.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.match(runtime, /const STORAGE_KEY='malbitStoryV1'/);
  assert.match(runtime, /MALBIT_REVIEW\?\.record/);
  assert.match(runtime, /function cleanScript/);
  assert.match(runtime, /replace\(\/\(\^\|\\n\)\[\^:\\n\]/);
  assert.match(runtime, /S\.view==='travel'\|\|S\.view==='travelPlay'/);
  assert.match(runtime, /S\.view==='story'\|\|S\.view==='storyPlay'/);
  assert.doesNotMatch(topik, /스토리모드|ストーリーモード|Story Mode|故事模式/);
});

test('the travel runtime can complete, resume, replay, and record a wrong answer', () => {
  const runtimeStorage = new Map();
  const classes = new Set();
  const screen = { className: 'screen', innerHTML: '' };
  const reviews = [];
  const runtime = {
    console,
    S: { lang: 'ko', view: 'home' },
    localStorage: {
      getItem: key => runtimeStorage.has(key) ? runtimeStorage.get(key) : null,
      setItem: (key, value) => runtimeStorage.set(key, String(value)),
      removeItem: key => runtimeStorage.delete(key)
    },
    document: {
      body: {
        classList: {
          toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
          remove: (...names) => names.forEach(name => classes.delete(name))
        }
      },
      documentElement: { style: {} },
      getElementById: id => id === 'screen' ? screen : null,
      querySelector: () => null
    },
    renderShell: () => {},
    navActive: () => {},
    hideSelection: () => {},
    flagMenu: () => {},
    toast: () => {},
    confirm: () => true,
    speechSynthesis: { cancel: () => {}, getVoices: () => [], speak: () => {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance(value) { this.text = value; }
  };
  runtime.window = runtime;
  runtime.render = () => { screen.innerHTML = 'base'; };
  runtime.setView = view => { runtime.S.view = view; runtime.render(); };
  vm.createContext(runtime);
  for (let part = 1; part <= 4; part++) vm.runInContext(read(`data/question-bank-v1-part${part}.js`), runtime);
  vm.runInContext(read('question-bank-engine.js'), runtime);
  vm.runInContext(read('data/travel-pack-seoul-001.js'), runtime);
  runtime.MALBIT_REVIEW = { record: (...args) => reviews.push(args) };
  vm.runInContext(read('travel-mode.js'), runtime);

  runtime.malbitTravelOpen();
  assert.equal(runtime.S.view, 'travel');
  assert.match(screen.innerHTML, /여행모드/);
  assert.match(screen.innerHTML, /서울역/);
  assert.match(screen.innerHTML, /내 여행자/);
  runtime.malbitTravelStart('case-001-missing-ticket', false);
  assert.match(screen.innerHTML, /서울에 도착했다/);
  runtime.malbitTravelNext();
  assert.match(screen.innerHTML, /먼저 무엇을 확인할까/);
  assert.match(screen.innerHTML, /안내 방송 먼저 듣기/);
  assert.match(screen.innerHTML, /여행 메모 먼저 읽기/);
  assert.doesNotMatch(screen.innerHTML, /풍경을 기록하기/);
  runtime.malbitTravelChoose('reader');
  assert.match(screen.innerHTML, /MISSION 1 \/ 6/);
  assert.match(screen.innerHTML, /출발 전 체크리스트/);

  const pack = runtime.MALBIT_TRAVEL_PACKS[0];
  let state = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  let firstScene = pack.scenes.find(item => item.id === state.sceneId);
  let firstQuestion = runtime.MALBIT_BANK.present(firstScene.bankId, state.orders[firstScene.id]);
  runtime.malbitTravelSelect(firstQuestion.answerIndex);
  runtime.malbitTravelSubmit();
  runtime.malbitTravelNext();
  assert.match(screen.innerHTML, /MISSION 2 \/ 6/);
  assert.match(screen.innerHTML, /유나의 오늘 계획/);
  runtime.malbitTravelToggleTranscript();
  assert.match(screen.innerHTML, /시험이 다음 주죠/);
  assert.doesNotMatch(screen.innerHTML, /지훈\(한빛센터\):/);

  let guard = 0;
  while (guard++ < 30) {
    const store = JSON.parse(runtimeStorage.get('malbitStoryV1'));
    const state = store.episodes[pack.id];
    const scene = pack.scenes.find(item => item.id === state.sceneId);
    if (scene.type === 'ending') break;
    if (scene.type === 'narrative') runtime.malbitTravelNext();
    else if (scene.type === 'choice') runtime.malbitTravelChoose(scene.choices[0].id);
    else if (scene.type === 'question') {
      if (!state.answers[scene.id]) {
        const question = runtime.MALBIT_BANK.present(scene.bankId, state.orders[scene.id]);
        runtime.malbitTravelSelect(question.answerIndex);
        runtime.malbitTravelSubmit();
      }
      runtime.malbitTravelNext();
    }
  }
  const completed = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(completed.completed, true);
  assert.equal(completed.bestScore, 6);
  assert.equal(Object.keys(completed.answers).length, 6);
  assert.match(screen.innerHTML, /ROUTE CLEAR/);
  const completedStore = JSON.parse(runtimeStorage.get('malbitStoryV1'));
  assert.ok(completedStore.avatar.unlocked.includes('seoul-sunset'));
  assert.ok(completedStore.avatar.unlocked.includes('hanbok-night'));

  runtime.malbitTravelBack();
  runtime.malbitTravelStart(pack.id, false);
  const resumed = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(resumed.completed, true, 'viewing a result must not reset a completed case');
  assert.match(screen.innerHTML, /ROUTE CLEAR/);

  runtime.malbitTravelRestart(pack.id);
  runtime.malbitTravelNext();
  runtime.malbitTravelChoose('listener');
  const replay = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  firstScene = pack.scenes.find(item => item.id === replay.sceneId);
  firstQuestion = runtime.MALBIT_BANK.present(firstScene.bankId, replay.orders[firstScene.id]);
  assert.equal(firstScene.id, 'q-topic');
  assert.match(screen.innerHTML, /MISSION 1 \/ 6/);
  runtime.malbitTravelSelect((firstQuestion.answerIndex + 1) % 4);
  runtime.malbitTravelSubmit();
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0][4], 'travel');
  assert.equal(JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id].bestScore, 6, 'replay keeps the best score');
});

test('legacy Story view and progress migrate without changing the storage root', () => {
  const source=read('travel-mode.js');
  assert.match(source, /const STORAGE_KEY='malbitStoryV1'/);
  assert.match(source, /Compatibility aliases/);
  assert.match(source, /malbitStoryOpen=window\.malbitTravelOpen/);
  assert.match(source, /S\.view=S\.view==='storyPlay'\?'travelPlay':'travel'/);
});
