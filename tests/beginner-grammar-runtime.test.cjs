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
    let source = fs.readFileSync(path.join(root, file), 'utf8');
    if (file === 'beginner-grammar.js') {
      source = source.replace(
        'refreshCompletion};',
        'refreshCompletion,nextIncomplete,draftResume,currentWritingIndex:()=>writingIndex};'
      );
    }
    vm.runInContext(source, context, { filename: file });
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

test('a completed first lesson resumes at the next grammar item', () => {
  const firstLessonComplete = {
    grammarV1: {
      completed: ['sentence-order'],
      quizCorrect: { 'sentence-order': true },
      writingDone: { 'sentence-order': true },
      lastLesson: 'sentence-order',
      drafts: {}
    }
  };
  const { context } = runtime({ malbitBeginnerV1: JSON.stringify(firstLessonComplete) });
  const api = context.MALBIT_BEGINNER_GRAMMAR_INTERNALS;

  assert.equal(api.nextIncomplete().id, 'sentence-omission');
  assert.equal(api.draftResume().id, 'sentence-omission');
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

test('an unfinished transformation draft survives exit and a fresh runtime', () => {
  const first = runtime({
    malbitBeginnerV1: JSON.stringify({
      activeTab: 'consonants',
      known: ['c:ㄱ'],
      legacyScore: 7
    })
  });
  first.context.malbitGrammarLesson('sentence-order');
  first.context.malbitGrammarDraft('저는 한국어');

  const stored = JSON.parse(first.values.get('malbitBeginnerV1'));
  assert.equal(stored.grammarV1.lastLesson, 'sentence-order');
  assert.equal(stored.grammarV1.drafts['sentence-order'], '저는 한국어');
  assert.equal(stored.activeTab, 'consonants');
  assert.deepEqual(stored.known, ['c:ㄱ']);
  assert.equal(stored.legacyScore, 7);

  const second = runtime(Object.fromEntries(first.values));
  second.context.malbitGrammarLesson('sentence-order');
  assert.equal(second.context.MALBIT_BEGINNER_GRAMMAR_INTERNALS.currentDraft(), '저는 한국어');

  second.context.malbitGrammarDraft('저는 한국어를 공부해요');
  assert.equal(second.context.malbitGrammarSubmit(), true);
  const completed = JSON.parse(second.values.get('malbitBeginnerV1'));
  assert.equal(completed.grammarV1.drafts['sentence-order'], undefined);
  assert.equal(completed.grammarV1.quizCorrect['sentence-order'], true);
});

test('completed handwriting units and the next position survive a fresh runtime', () => {
  const previous = {
    activeTab: 'writing',
    known: ['c:ㄱ'],
    legacyScore: 7,
    grammarV1: {
      completed: [],
      quizCorrect: { 'sentence-order': true },
      writingDone: {},
      writingUnits: { 'sentence-order': [0] },
      writingCount: { 'sentence-order': 1 },
      lastLesson: 'sentence-order'
    }
  };
  const first = runtime({ malbitBeginnerV1: JSON.stringify(previous) });
  first.context.malbitGrammarLesson('sentence-order');
  assert.equal(first.context.MALBIT_BEGINNER_GRAMMAR_INTERNALS.currentWritingIndex(), 1);

  const second = runtime(Object.fromEntries(first.values));
  second.context.malbitGrammarLesson('sentence-order');
  assert.equal(second.context.MALBIT_BEGINNER_GRAMMAR_INTERNALS.currentWritingIndex(), 1);

  const restored = JSON.parse(second.values.get('malbitBeginnerV1'));
  assert.deepEqual(restored.grammarV1.writingUnits['sentence-order'], [0]);
  assert.equal(restored.grammarV1.writingCount['sentence-order'], 1);
  assert.equal(restored.grammarV1.writingDone['sentence-order'], undefined);
  assert.equal(restored.activeTab, 'writing');
  assert.deepEqual(restored.known, ['c:ㄱ']);
  assert.equal(restored.legacyScore, 7);
});

test('example translations and teaching notes render as separate fields', () => {
  const source = fs.readFileSync(path.join(root, 'beginner-grammar.js'), 'utf8');
  assert.match(source, /class="bgExampleMeaning"/u);
  assert.match(source, /class="bgExampleNote"/u);
  assert.match(source, /講師メモ/u);
});
