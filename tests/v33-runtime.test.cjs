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
  assert.match(screen.innerHTML, /音と一緒に覚える子音/);
  assert.match(screen.innerHTML, /文字 1\/20 習得/);
});
