const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function runtime(seed = {}) {
  const values = new Map(Object.entries(seed));
  const context = {
    console,
    setTimeout,
    clearTimeout,
    S: { view: 'home', lang: 'ja' },
    localStorage: {
      getItem: key => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value))
    },
    document: {
      head: { appendChild() {} },
      createElement: tag => ({ tagName: tag.toUpperCase(), style: {}, className: '', appendChild() {} }),
      getElementById: () => null
    },
    render() {},
    setView() {},
    speechSynthesis: { cancel() {}, speak() {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance(text) { this.text = text; }
  };
  context.window = context;
  vm.createContext(context);
  for (const file of ['data/beginner-grammar-v1.js', 'beginner-grammar.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  }
  return { context, values };
}

test('beginner grammar runtime exposes the complete course and Hangul units', () => {
  const { context } = runtime();
  const api = context.MALBIT_BEGINNER_GRAMMAR_INTERNALS;
  assert.equal(api.lessonCount, 64);
  assert.equal(Object.keys(api.chapterCounts).length, 9);
  assert.equal(Object.values(api.chapterCounts).reduce((sum, count) => sum + count, 0), 64);
  assert.deepEqual(Array.from(api.hangulUnits('한국어 1!')), ['한', '국', '어']);
  assert.equal(api.normalize('  학생이에요！ '), '학생이에요');
});

test('grammar completion requires both transformation and handwriting', () => {
  const { context } = runtime();
  const api = context.MALBIT_BEGINNER_GRAMMAR_INTERNALS;
  const value = {
    legacyReadingProgress: ['r1'],
    known: ['v:ㅏ'],
    grammarV1: { completed: [], quizCorrect: {}, writingDone: {} }
  };
  assert.equal(api.refreshCompletion(value, 'copula'), false);
  value.grammarV1.quizCorrect.copula = true;
  assert.equal(api.refreshCompletion(value, 'copula'), false);
  value.grammarV1.writingDone.copula = true;
  assert.equal(api.refreshCompletion(value, 'copula'), true);
  assert.deepEqual(Array.from(value.grammarV1.completed), ['copula']);
  assert.deepEqual(value.legacyReadingProgress, ['r1']);
  assert.deepEqual(value.known, ['v:ㅏ']);
});

test('opening the course preserves old beginner data', () => {
  const previous = {
    tab: 'writing',
    known: ['c:ㄱ'],
    attempts: { old: 3 }
  };
  const { context, values } = runtime({ malbitBeginnerV1: JSON.stringify(previous) });
  context.malbitOpenGrammar();
  const stored = JSON.parse(values.get('malbitBeginnerV1') || JSON.stringify(previous));
  assert.equal(stored.tab, 'writing');
  assert.deepEqual(stored.known, ['c:ㄱ']);
  assert.deepEqual(stored.attempts, { old: 3 });
});
