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
vm.runInContext(read('data/story-pack-001.js'), context);

const bank = context.window.MALBIT_BANK;
const packs = context.window.MALBIT_STORY_PACKS;
const languages = ['ko', 'ja', 'en', 'zh'];

function assertI18n(value, label) {
  for (const language of languages) assert.ok(String(value?.[language] || '').trim(), `${label}.${language} is missing`);
}

test('the first story pack is a complete, reachable six-question case', () => {
  assert.equal(packs.length, 1);
  const pack = packs[0];
  assert.equal(pack.id, 'case-001-missing-ticket');
  assert.equal(pack.questionCount, 6);
  assert.equal(pack.scenes.filter(scene => scene.type === 'question').length, 6);

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

test('story questions reuse valid original TOPIK I bank items', () => {
  const pack = packs[0];
  for (const scene of pack.scenes.filter(item => item.type === 'question')) {
    const question = bank.byId(scene.bankId);
    assert.ok(question, `${scene.id} references missing bank item ${scene.bankId}`);
    assert.equal(question.level, pack.level, `${scene.bankId} should match the episode level`);
    assert.notEqual(question.section, 'writing');
    assert.equal(question.options.length, 4);
  }
});

test('story UI copy is complete in Korean, Japanese, English, and Chinese', () => {
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
});

test('Story Mode is independent from Full Mock and wired into the ordered runtime', () => {
  const topik = read('topik1.js');
  const bootstrap = read('site-patch.js');
  const runtime = read('story-mode.js');

  assert.match(topik, /mode==='story'/);
  assert.match(topik, /class="tqV9Mode story"/);
  assert.match(topik, /<button onclick="tqStartMode\('real'\)">[\s\S]{0,500}전체 모의고사/);
  assert.match(topik, /class="tqV9Mode story" onclick="tqStartMode\('story'\)"/);
  assert.ok(bootstrap.indexOf("'data/story-pack-001.js'") < bootstrap.indexOf("'story-mode.js'"));
  assert.ok(bootstrap.indexOf("'question-bank-engine.js'") < bootstrap.indexOf("'story-mode.js'"));
  assert.ok(bootstrap.indexOf("'topik1.js'") < bootstrap.indexOf("'story-mode.js'"));
  assert.match(runtime, /const STORAGE_KEY='malbitStoryV1'/);
  assert.match(runtime, /MALBIT_REVIEW\?\.record/);
  assert.match(runtime, /function cleanScript/);
  assert.match(runtime, /replace\(\/\(\^\|\\n\)\[\^:\\n\]/);
  assert.match(runtime, /S\.view==='story'\|\|S\.view==='storyPlay'/);
});

test('the story runtime can complete, resume, replay, and record a wrong answer', () => {
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
  vm.runInContext(read('data/story-pack-001.js'), runtime);
  runtime.MALBIT_REVIEW = { record: (...args) => reviews.push(args) };
  vm.runInContext(read('story-mode.js'), runtime);

  runtime.malbitStoryOpen();
  assert.equal(runtime.S.view, 'story');
  assert.match(screen.innerHTML, /스토리 모드/);
  runtime.malbitStoryStart('case-001-missing-ticket', false);
  assert.match(screen.innerHTML, /긴급 메시지/);
  runtime.malbitStoryNext();
  assert.match(screen.innerHTML, /어떻게 시작할까/);
  runtime.malbitStoryChoose('reader');
  assert.match(screen.innerHTML, /CLUE 1 \/ 6/);
  runtime.malbitStoryToggleTranscript();
  assert.match(screen.innerHTML, /시험이 다음 주죠/);
  assert.doesNotMatch(screen.innerHTML, /지훈\(한빛센터\):/);

  const pack = runtime.MALBIT_STORY_PACKS[0];
  let guard = 0;
  while (guard++ < 30) {
    const store = JSON.parse(runtimeStorage.get('malbitStoryV1'));
    const state = store.episodes[pack.id];
    const scene = pack.scenes.find(item => item.id === state.sceneId);
    if (scene.type === 'ending') break;
    if (scene.type === 'narrative') runtime.malbitStoryNext();
    else if (scene.type === 'choice') runtime.malbitStoryChoose(scene.choices[0].id);
    else if (scene.type === 'question') {
      if (!state.answers[scene.id]) {
        const question = runtime.MALBIT_BANK.present(scene.bankId, state.orders[scene.id]);
        runtime.malbitStorySelect(question.answerIndex);
        runtime.malbitStorySubmit();
      }
      runtime.malbitStoryNext();
    }
  }
  const completed = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(completed.completed, true);
  assert.equal(completed.bestScore, 6);
  assert.equal(Object.keys(completed.answers).length, 6);
  assert.match(screen.innerHTML, /CASE CLOSED/);

  runtime.malbitStoryBack();
  runtime.malbitStoryStart(pack.id, false);
  const resumed = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(resumed.completed, true, 'viewing a result must not reset a completed case');
  assert.match(screen.innerHTML, /CASE CLOSED/);

  runtime.malbitStoryRestart(pack.id);
  runtime.malbitStoryNext();
  runtime.malbitStoryChoose('listener');
  const replay = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  const firstScene = pack.scenes.find(item => item.id === replay.sceneId);
  const firstQuestion = runtime.MALBIT_BANK.present(firstScene.bankId, replay.orders[firstScene.id]);
  runtime.malbitStorySelect((firstQuestion.answerIndex + 1) % 4);
  runtime.malbitStorySubmit();
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0][4], 'story');
  assert.equal(JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id].bestScore, 6, 'replay keeps the best score');
});
