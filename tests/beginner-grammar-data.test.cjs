const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadData() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'data/beginner-grammar-v1.js'), 'utf8'), context);
  return context.window.MALBIT_BEGINNER_GRAMMAR_V1;
}

const requiredLanguages = ['ko', 'ja', 'en', 'zh'];
const localized = (value, label) => {
  for (const language of requiredLanguages) {
    assert.equal(typeof value?.[language], 'string', `${label}.${language} must be a string`);
    assert.ok(value[language].trim().length >= 2, `${label}.${language} must not be empty`);
  }
};

test('beginner grammar is a complete nine-chapter, 64-lesson curriculum', () => {
  const data = loadData();
  assert.equal(data.version, 1);
  assert.equal(data.level, 'absolute-beginner');
  assert.equal(data.chapters.length, 9);
  assert.equal(data.lessons.length, 64);
  assert.equal(new Set(data.chapters.map(item => item.id)).size, data.chapters.length);
  assert.equal(new Set(data.lessons.map(item => item.id)).size, data.lessons.length);

  for (const chapter of data.chapters) {
    localized(chapter.title, `chapter.${chapter.id}.title`);
    localized(chapter.summary, `chapter.${chapter.id}.summary`);
    assert.ok(data.lessons.filter(item => item.chapter === chapter.id).length >= 5, `${chapter.id} is too small`);
  }
});

test('every lesson teaches the condition, form, examples, trap, transformation, and handwriting', () => {
  const data = loadData();
  for (const item of data.lessons) {
    localized(item.title, `${item.id}.title`);
    localized(item.goal, `${item.id}.goal`);
    localized(item.trap, `${item.id}.trap`);
    assert.ok(item.formula.trim().length >= 2, `${item.id} formula is missing`);
    assert.ok(item.variants.length >= 2, `${item.id} needs at least two rule branches`);
    assert.ok(item.examples.length >= 2, `${item.id} needs at least two original examples`);
    for (const [index, variant] of item.variants.entries()) {
      localized(variant.when, `${item.id}.variants.${index}.when`);
      assert.ok(variant.form.trim(), `${item.id}.variants.${index}.form is missing`);
      assert.ok(variant.example.trim(), `${item.id}.variants.${index}.example is missing`);
    }
    for (const [index, example] of item.examples.entries()) {
      assert.match(example.korean, /[가-힣]/u, `${item.id}.examples.${index} needs Korean`);
      localized(example.meaning, `${item.id}.examples.${index}.meaning`);
    }
    assert.match(item.drill.source, /[가-힣]/u, `${item.id} drill source needs Korean`);
    localized(item.drill.task, `${item.id}.drill.task`);
    localized(item.drill.coach, `${item.id}.drill.coach`);
    assert.ok(item.drill.accepted.length >= 1, `${item.id} needs an accepted answer`);
    assert.ok(item.drill.accepted.includes(item.drill.answer), `${item.id} model answer must be accepted`);
    assert.match(item.drill.writing, /[가-힣]/u, `${item.id} needs a handwriting phrase`);
  }
});

test('high-risk conjugations keep reviewed answers and exceptions explicit', () => {
  const byId = Object.fromEntries(loadData().lessons.map(item => [item.id, item]));
  const answers = {
    copula: '학생이에요',
    'present-haeyo': '먹어요',
    'future-plan': '읽을 거예요',
    'polite-command': '읽으세요',
    'vowel-contraction': '배워요',
    'bieup-irregular': '어려워요',
    'digeut-irregular': '들어요',
    'reu-irregular': '몰라요',
    'siot-irregular': '지어요',
    'hieut-irregular': '파래요',
    'eu-irregular': '써요',
    'rieul-drop': '만드는',
    'hada-doeda': '준비해요'
  };
  for (const [id, answer] of Object.entries(answers)) {
    assert.equal(byId[id].drill.answer, answer, `${id} answer changed`);
  }
  assert.doesNotMatch(byId['sentence-order'].trap.ko, /일본어와 달리/u);
  assert.match(byId['bieup-irregular'].trap.ko, /입다|잡다/u);
  assert.match(byId['digeut-irregular'].trap.ko, /받다|닫다/u);
  assert.match(byId['siot-irregular'].trap.ko, /웃다|씻다|벗다/u);
  assert.match(byId['hieut-irregular'].trap.ko, /좋다|놓다|넣다/u);
  assert.match(byId['hada-doeda'].trap.ko, /되요/u);
});
