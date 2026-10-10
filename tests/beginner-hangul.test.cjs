const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const KEY = 'malbitBeginnerV1';
function element() {
  return {
    style: {}, dataset: {}, textContent: '', innerHTML: '',
    classList: { add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, appendChild() {}, insertAdjacentHTML() {}, insertAdjacentElement() {},
    querySelector() { return null; }, querySelectorAll() { return []; }
  };
}
function runtime(seed = {}, lang = 'ko') {
  const screen = element(), storage = new Map([[KEY, JSON.stringify(seed)]]), spoken = [];
  const context = {
    console, S: { view: 'beginner', lang, vocab: [] },
    document: {
      head: element(), body: element(), documentElement: element(), createElement: element,
      getElementById(id) { return id === 'screen' ? screen : null; },
      querySelector() { return null; }, querySelectorAll() { return []; }
    },
    localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
    malbitSpeak: text => spoken.push(text), navActive() {}, setProgress() {}, render() {}, setTimeout, clearTimeout
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app-polish-v33.js', 'utf8'), context);
  return { context, screen, spoken, storage, saved: () => JSON.parse(storage.get(KEY)) };
}

test('Hangul course includes exactly all 40 modern jamo with official consonant names', () => {
  const { context } = runtime();
  const i = context.HARUMAL_BEGINNER.inventory;
  assert.equal(i.basicVowels.map(r => r[0]).join(''), 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ');
  assert.equal(i.furtherVowels.map(r => r[0]).join(''), 'ㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ');
  assert.equal(i.basicConsonants.map(r => r[0]).join(''), 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ');
  assert.equal(i.doubleConsonants.map(r => r[0]).join(''), 'ㄲㄸㅃㅆㅉ');
  assert.equal(i.basicConsonants.map(r => r[1]).join(','), '기역,니은,디귿,리을,미음,비읍,시옷,이응,지읒,치읓,키읔,티읕,피읖,히읗');
  assert.equal(i.doubleConsonants.map(r => r[1]).join(','), '쌍기역,쌍디귿,쌍비읍,쌍시옷,쌍지읒');
  assert.equal(new Set(Object.values(i).flat().map(r => r[0])).size, 40);
});

test('letter name and example audio are distinct; progress counts only unique jamo IDs', () => {
  const old = { known: ['c:ㄱ', 'c:ㄱ', 'v:ㅏ', 'w:가구', 'unknown'], quiz: 9, correct: 7, writing: { ㄱ: 2 }, writingV35: { completed: { letters: { ㄱ: 3 } } }, grammarV1: { lastLesson: 'word-order' } };
  const app = runtime(old);
  app.context.malbitBeginnerTab('consonants');
  assert.match(app.screen.innerHTML, /글자 2\/40 익힘/);
  assert.equal((app.screen.innerHTML.match(/class="hbLetterName/g) || []).length, 19);
  assert.match(app.screen.innerHTML, /이름 기역 듣기/);
  assert.match(app.screen.innerHTML, /malbitBeginnerSpeak\("가"\)/);
  assert.match(app.screen.innerHTML, /첫소리의 ㅇ은 소리가 없어요/);
  app.context.malbitBeginnerLearn('c:ㅋ', '키읔');
  app.context.malbitBeginnerLearn('c:ㅋ', '키읔');
  app.context.malbitBeginnerSpeak('카');
  assert.deepEqual(app.spoken, ['키읔', '키읔', '카']);
  assert.equal(app.saved().known.filter(id => id === 'c:ㅋ').length, 1);
  assert.match(app.screen.innerHTML, /글자 3\/40 익힘/);
  for (const key of ['quiz', 'correct', 'writing', 'writingV35', 'grammarV1']) assert.deepEqual(app.saved()[key], old[key]);
  app.context.malbitBeginnerLearn('invalid', 'never');
  assert.equal(app.spoken.length, 3);
});

test('syllable construction teaches vertical, horizontal, compound and final-consonant layouts', () => {
  const app = runtime();
  app.context.malbitBeginnerTab('reading');
  assert.match(app.screen.innerHTML, /hbBlock vertical/);
  assert.doesNotMatch(app.screen.innerHTML, /isBuilt/);
  app.context.malbitBeginnerBuild('wrong-id');
  assert.equal(app.saved().blocksV1, undefined);
  app.context.malbitBeginnerBuild('vertical');
  assert.match(app.screen.innerHTML, /ㄴ \+ ㅏ = 나/);
  app.context.malbitBeginnerBlock(1);
  app.context.malbitBeginnerBuild('horizontal');
  assert.match(app.screen.innerHTML, /ㄴ \+ ㅗ = 노/);
  app.context.malbitBeginnerBlock(2);
  app.context.malbitBeginnerBuild('compound');
  assert.match(app.screen.innerHTML, /ㄱ \+ ㅘ = 과/);
  assert.match(app.screen.innerHTML, /hbBelow isVisible/);
  app.context.malbitBeginnerBlock(3);
  app.context.malbitBeginnerBuild('coda');
  assert.match(app.screen.innerHTML, /받침 붙이기/);
  app.context.malbitBeginnerBuild('coda');
  assert.match(app.screen.innerHTML, /ㅁ \+ ㅜ \+ ㄴ = 문/);
  const reloaded = runtime(app.saved());
  assert.match(reloaded.screen.innerHTML, /ㅁ \+ ㅜ \+ ㄴ = 문/);
});

test('picture reading localizes the single gloss and uses self-completion rather than correctness', () => {
  const expected = { ko: '나무', ja: '木', en: 'tree', zh: '树' };
  for (const [lang, meaning] of Object.entries(expected)) {
    const app = runtime({ activeTab: 'reading', readingStep: 'words' }, lang);
    assert.match(app.screen.innerHTML, new RegExp(`class="hbWordMeaning" lang="${lang}">${meaning}</p>`));
    assert.match(app.screen.innerHTML, /data-picture="tree" role="img"/);
    assert.match(app.screen.innerHTML, /malbitBeginnerReadDone\('tree'\)/);
    assert.doesNotMatch(app.screen.innerHTML, /v33ReadingChoices|malbitBeginnerAnswer\(|Correct!|정답이에요/);
  }
  const css = fs.readFileSync('beginner-hangul.css', 'utf8');
  assert.match(css, /background-size:400% 300%/);
  assert.ok(fs.existsSync('assets/art/beginner/beginner-objects-sprite-v1.png'));
});

test('word completion is idempotent, survives reload, and never changes legacy quiz correctness', () => {
  const old = { activeTab: 'reading', readingStep: 'words', known: ['c:ㄱ'], quiz: 19, correct: 15, writing: { 가: 8 }, grammarV1: { completed: ['a'] } };
  let app = runtime(old);
  app.context.malbitBeginnerReadNext('tree');
  assert.equal(app.saved().readingV2, undefined, 'cannot advance before self-check');
  app.context.malbitBeginnerReadDone('banana');
  assert.equal(app.saved().readingV2, undefined, 'stale word does not count');
  app.context.malbitBeginnerReadDone('tree');
  app.context.malbitBeginnerReadDone('tree');
  assert.deepEqual(app.saved().readingV2, { index: 0, completed: ['tree'], confirmed: true });
  app = runtime(app.saved());
  assert.match(app.screen.innerHTML, /hbSelfConfirmed/);
  app.context.malbitBeginnerReadNext('tree');
  app.context.malbitBeginnerReadNext('tree');
  assert.equal(app.saved().readingV2.index, 1, 'double next cannot skip a word');
  assert.match(app.screen.innerHTML, /data-picture="banana"/);
  for (const word of app.context.HARUMAL_BEGINNER.words.slice(1)) {
    app.context.malbitBeginnerReadDone(word.id);
    app.context.malbitBeginnerReadNext(word.id);
  }
  assert.equal(app.saved().readingV2.index, 12);
  assert.equal(app.saved().readingV2.completed.length, 12);
  assert.match(app.screen.innerHTML, /hbReadingComplete/);
  app.context.malbitBeginnerReadDone('ball');
  app.context.malbitBeginnerAnswer(0, 0);
  for (const key of ['known', 'quiz', 'correct', 'writing', 'grammarV1']) assert.deepEqual(app.saved()[key], old[key]);
  app.context.malbitBeginnerReadRestart();
  assert.equal(app.saved().readingV2.index, 0);
  assert.equal(app.saved().readingV2.completed.length, 12, 'review keeps earned practice history');
  app.context.S.view = 'home';
  app.context.malbitBeginnerReadDone('tree');
  assert.equal(app.saved().readingV2.confirmed, false, 'a stale confirmation after leaving cannot count');
});

test('reading resumes safely with malformed state and does not infer completion from old quiz scores', () => {
  const app = runtime({ activeTab: 'reading', readingStep: 'words', quiz: 200, correct: 180, readingV2: { index: -500, completed: 'all', confirmed: 'yes' } });
  assert.match(app.screen.innerHTML, /data-picture="tree"/);
  assert.deepEqual(JSON.parse(JSON.stringify(app.context.HARUMAL_BEGINNER.getReading())), { index: 0, completed: [], confirmed: false });
});

test('handwriting keeps the original 24 positions and completes the same 40-letter inventory', () => {
  const source = fs.readFileSync('app-polish-v35.js', 'utf8');
  const rows = [...source.match(/const LETTERS=\[([\s\S]*?)\n\];/)[1].matchAll(/\['([^']+)','([^']+)'\]/g)].map(match => [match[1], match[2]]);
  assert.equal(rows.length, 40);
  assert.equal(rows.slice(0, 24).map(r => r[0]).join(''), 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ');
  assert.equal(rows.find(r => r[0] === 'ㄱ')[1], '기역');
  const { context } = runtime();
  const expected = Object.values(context.HARUMAL_BEGINNER.inventory).flat().map(r => r[0]).sort();
  assert.equal(rows.map(r => r[0]).sort().join(''), expected.join(''));
  assert.match(source, /const vowels='ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ'/);
  assert.match(source, /consonants='ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ'/);
});

test('legacy handwriting fallback also keeps its old order and covers all 40 named jamo', () => {
  const source = fs.readFileSync('app-polish-v34.js', 'utf8');
  const rows = [...source.match(/const WRITE_TARGETS=\[([\s\S]*?)\n\];/)[1].matchAll(/\['([^']+)','([^']+)','([^']+)'\]/g)].map(match => [match[1], match[2], match[3]]);
  assert.equal(rows.length, 40);
  assert.equal(rows.slice(0, 20).map(r => r[0]).join(''), 'ㅏㅓㅗㅜㅡㅣㅑㅕㅛㅠㄱㄴㄷㄹㅁㅂㅅㅇㅈㅎ');
  const { context } = runtime();
  const groups = context.HARUMAL_BEGINNER.inventory;
  for (const group of Object.values(groups)) for (const row of group) {
    const fallback = rows.find(r => r[0] === row[0]);
    assert.equal(fallback[1], row[1]);
    assert.equal(fallback[2], `${row[0] >= 'ㅏ' ? 'v' : 'c'}:${row[0]}`);
  }
});

test('home Continue recognizes meaningful reading-only and syllable-only progress', () => {
  const source = fs.readFileSync('learning-hub.js', 'utf8');
  const helper = source.slice(source.indexOf('function hasResume(){'), source.indexOf('function continueLabel(){'));
  function canResume(record) {
    return vm.runInNewContext(`${helper};hasResume()`, { prefs: () => ({ stage: 'hangul' }), localStorage: { getItem: () => JSON.stringify(record) } });
  }
  for (const record of [{ known: ['c:ㄱ'] }, { quiz: 2 }, { readingV2: { completed: ['tree'] } }, { readingV2: { index: 1 } }, { readingV2: { confirmed: true } }, { blocksV1: { index: 1, reveal: 1 } }, { blocksV1: { index: 0, reveal: 2 } }]) assert.equal(canResume(record), true);
  for (const record of [{}, { readingV2: { index: 0, completed: [], confirmed: false } }, { blocksV1: { index: 0, reveal: 1 } }]) assert.equal(canResume(record), false);
});

test('queued build, next and restart actions cannot change saved progress after navigation', () => {
  const seed = { activeTab: 'reading', readingStep: 'words', blocksV1: { index: 0, reveal: 1 }, readingV2: { index: 1, completed: ['tree', 'banana'], confirmed: true } };
  const app = runtime(seed);
  app.context.S.view = 'home';
  app.context.malbitBeginnerBuild('vertical');
  app.context.malbitBeginnerReadNext('banana');
  app.context.malbitBeginnerReadRestart();
  assert.deepEqual(app.saved(), seed, 'every stale mutation leaves the entire learner record unchanged');
  app.context.S.view = 'beginner';
  app.context.malbitBeginnerBuild('vertical');
  assert.equal(app.saved().blocksV1.reveal, 2);
  app.context.malbitBeginnerReadNext('banana');
  assert.equal(app.saved().readingV2.index, 2);
  app.context.malbitBeginnerReadRestart();
  assert.equal(app.saved().readingV2.index, 0);
});
