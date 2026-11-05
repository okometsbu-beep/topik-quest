const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function element() {
  return {
    style: {}, dataset: {}, textContent: '', innerHTML: '',
    classList: { add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, appendChild() {}, insertAdjacentHTML() {}, insertAdjacentElement() {},
    querySelector() { return null; }, querySelectorAll() { return []; }
  };
}

test('v33 initializes safely and persists the listening policy', () => {
  const storage = new Map();
  const document = {
    head: element(), body: element(), documentElement: element(),
    createElement: element, getElementById() { return null; },
    querySelector() { return null; }, querySelectorAll() { return []; }
  };
  const context = {
    console, document, localStorage: {
      getItem: key => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, String(value))
    },
    S: { view: 'home', lang: 'en', vocab: [] },
    LANGS: { en: { flag: '🇺🇸' } },
    setTimeout, clearTimeout,
    speechSynthesis: { cancel() {}, speak() {} },
    SpeechSynthesisUtterance: function(value) { this.text = value; }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app-polish-v33.js', 'utf8'), context);

  assert.equal(context.MALBIT_LISTENING_ENABLED(), true, 'ask mode initially allows a gated listening choice');
  context.malbitSetListeningMode('off');
  assert.equal(context.MALBIT_LISTENING_ENABLED(), false);
  context.malbitSetListeningMode('on');
  assert.equal(context.MALBIT_LISTENING_ENABLED(), true);
  assert.equal(typeof context.malbitBeginnerTab, 'function');
  assert.equal(typeof context.malbitBeginnerAnswer, 'function');

  context.malbitBeginnerTab('consonants');
  assert.equal(
    JSON.parse(storage.get('malbitBeginnerV1')).activeTab,
    'consonants',
    'the last beginner step must survive a reload so Continue returns to the same place'
  );
});

test('v33 restores the last Hangul step after a browser reload', () => {
  const screen = element();
  const storage = new Map([
    ['malbitBeginnerV1', JSON.stringify({ known: ['c:ㄱ'], activeTab: 'consonants' })]
  ]);
  const document = {
    head: element(), body: element(), documentElement: element(),
    createElement: element,
    getElementById(id) { return id === 'screen' ? screen : null; },
    querySelector() { return null; }, querySelectorAll() { return []; }
  };
  const context = {
    console, document, localStorage: {
      getItem: key => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, String(value))
    },
    S: { view: 'beginner', lang: 'ja', vocab: [] },
    LANGS: { ja: { flag: '🇯🇵' } },
    navActive() {}, setProgress() {}, setTimeout, clearTimeout,
    speechSynthesis: { cancel() {}, speak() {} },
    SpeechSynthesisUtterance: function(value) { this.text = value; }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app-polish-v33.js', 'utf8'), context);

  assert.match(screen.innerHTML, /class="on" onclick="malbitBeginnerTab\('consonants'\)">2\. 子音/);
  assert.match(screen.innerHTML, /子音の名前と音/);
  assert.match(screen.innerHTML, /文字 1\/40 習得/);
});

test('v33 beginner step tabs keep a 44px touch target', () => {
  const source = fs.readFileSync('app-polish-v33.js', 'utf8');
  assert.match(source, /\.v33BeginnerTabs button\{min-height:44px/);
});

test('fresh-profile review waits for the real listening dialog button, then opens that exact retry once', () => {
  const storage = new Map(), elements = new Map(), calls = [];
  function node() {
    const out = element(), classes = new Set();
    out.classList = {add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x)};
    return out;
  }
  const document = {head: node(), body: node(), documentElement: node(), createElement: node,
    getElementById: id => elements.get(id) || null, querySelector: () => null, querySelectorAll: () => []};
  document.body.appendChild = item => elements.set(item.id, item);
  const context = {console, document, S: {view: 'home', lang: 'en'},
    localStorage: {getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value))},
    openReviewRetry: key => calls.push(key), setTimeout, clearTimeout};
  context.window = context;vm.createContext(context);
  vm.runInContext(fs.readFileSync('app-polish-v33.js', 'utf8'), context);
  const key = '2:listen:O01-II-L-01';context.openReviewRetry(key);
  const dialog = elements.get('malbitListeningDialog');
  assert.equal(dialog.classList.contains('open'), true);
  assert.deepEqual(calls, [], 'the review renderer has not run while consent is pending');
  const onClick = dialog.innerHTML.match(/class="on" onclick="([^"]+)"/)[1];
  vm.runInContext(onClick, context);
  assert.equal(dialog.classList.contains('open'), false);
  assert.deepEqual(calls, [key]);
  assert.equal(JSON.parse(storage.get('malbitProductPrefsV1')).listeningMode, 'on');
  context.openReviewRetry('1:listen:M01-I-L-15');
  assert.deepEqual(calls, [key, '1:listen:M01-I-L-15']);
  assert.equal(dialog.classList.contains('open'), false);
});

test('image browser review fixture clicks consent and requires nonempty exact retry DOM, including alias fallback', () => {
  const source = fs.readFileSync('scripts/check-question-image-release.mjs', 'utf8');
  assert.match(source, /#malbitListeningDialog\.open button\.on/);
  assert.match(source, /button\.click\(\)/);
  assert.match(source, /assert\.equal\(last\.choiceCount,4/);
  assert.match(source, /assert\.equal\(last\.images\.length,4/);
  assert.match(source, /await review\('M04-I-L-16',1,0\)/);
  assert.match(source, /migrationStates,reviewStates,failureState/);
});
