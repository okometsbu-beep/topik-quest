'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const languages = ['ko', 'ja', 'en', 'zh'];
function load() {
  const window = {};
  const context = vm.createContext({ window });
  vm.runInContext(fs.readFileSync(path.join(root, 'data/writing-curriculum.js'), 'utf8'), context);
  const before = JSON.stringify(window.HARUMAL_WRITING_DATA);
  vm.runInContext(fs.readFileSync(path.join(root, 'data/writing-curriculum-locales.js'), 'utf8'), context);
  return { data: window.HARUMAL_WRITING_DATA, catalog: window.HARUMAL_WRITING_CONTENT_I18N, before };
}
function inventory(data) {
  const entries = [];
  const add = (source, field, originalKorean = false) => {
    if (source) entries.push({ source, field, originalKorean });
  };
  for (const n of data.nodes) for (const key of ['title', 'summary', 'prerequisiteNote']) add(n[key + 'Ko'], `node.${n.id}.${key}`);
  for (const g of data.groups) for (const key of ['title', 'help', 'selection']) add(g[key + 'Ko'], `group.${g.id}.${key}`);
  for (const p of data.prerequisites) for (const key of ['title', 'help']) add(p[key + 'Ko'], `prerequisite.${p.id}.${key}`);
  for (const i of data.items) {
    for (const key of ['title', 'prompt']) add(i[key + 'Ko'], `item.${i.id}.${key}`);
    for (const c of i.choices || []) add(c.labelKo, `item.${i.id}.choice.${c.id}`, true);
    for (const rule of [...i.evaluation.required || [], ...i.evaluation.forbidden || []]) add(rule.messageKo, `item.${i.id}.feedback.${rule.id}`);
    for (const fact of i.facts || []) add(fact.ko, `item.${i.id}.fact`, true);
    for (const word of i.support?.vocabulary || []) add(word.ko, `item.${i.id}.word`, true);
    add(i.support?.helpKo, `item.${i.id}.help`);
    for (const key of ['meaningJa', 'lessonJa']) add(i.support?.[key], `item.${i.id}.${key}`);
  }
  add(data.scope.titleKo, 'scope.title');
  // This interpretation probe deliberately does not reveal the translated fact.
  add('文を読んで意味を選びましょう。', 'item.P04.neutralMeaningPrompt');
  return entries;
}

test('writing content catalog covers every learner-facing field in all four languages', () => {
  const { data, catalog } = load();
  assert.equal(data.nodes.length, 14);
  assert.equal(data.groups.length, 12);
  assert.equal(data.prerequisites.length, 8);
  assert.equal(data.items.length, 37);
  assert.equal(data.items.flatMap(i => i.choices || []).length, 6);
  const entries = inventory(data);
  assert.equal(new Set(entries.map(e => e.source)).size, 272);
  // Keep the old persisted P01 feedback key as well as its new bounded-check replacement.
  assert.equal(Object.keys(catalog).length, 273);
  assert.ok(catalog['공부하다를 해요체로 써 보세요.']);
  for (const { source, field } of entries) {
    assert.ok(catalog[source], `Missing source: ${field}: ${source}`);
    for (const lang of languages) {
      assert.equal(typeof catalog[source][lang], 'string', `${field}: ${lang}`);
      assert.ok(catalog[source][lang].trim(), `Empty translation: ${field}: ${lang}`);
    }
  }
});

test('localized metadata never mutates Korean facts, vocabulary, models, drafts, or checks', () => {
  const { data, catalog, before } = load();
  assert.equal(JSON.stringify(data), before);
  assert.ok(Object.isFrozen(catalog));
  for (const value of Object.values(catalog)) assert.ok(Object.isFrozen(value));
  for (const { source, originalKorean, field } of inventory(data)) {
    if (originalKorean) assert.equal(catalog[source].ko, source, field);
  }
  assert.equal(catalog['시간이 없어요.'].ja, '時間がありません。');
  assert.equal(catalog['文を読んで意味を選びましょう。'].en, 'Read the sentence and choose its meaning.');
});

test('independent and later-day translations do not add target forms or model answers', () => {
  const { data, catalog } = load();
  for (const i of data.items.filter(i => i.evidence.independent || i.evidence.delayed)) {
    const sources = [i.promptKo, i.support?.meaningJa,
      ...(i.facts || []).map(f => f.ko), ...(i.support?.vocabulary || []).map(w => w.ko)].filter(Boolean);
    for (const lang of languages) {
      const visibleSupport = sources.map(s => catalog[s][lang]).join('\n');
      assert.ok(!new RegExp(i.evaluation.targetPattern).test(visibleSupport), `${i.id}/${lang} adds a target reason form`);
      for (const model of i.models) assert.ok(!visibleSupport.includes(model), `${i.id}/${lang} leaks a full model`);
    }
    assert.ok(!i.support?.lessonKo && !i.support?.lessonJa, `${i.id} gained a form lesson`);
  }
});

test('plain-language explanations replace abstract learner-facing labels', () => {
  const { catalog } = load();
  assert.equal(catalog['서술어의 형태와 호응 유지하기'].ko, '문장 끝을 바꾸고 뜻 맞추기');
  assert.equal(catalog['원인과 결과의 뜻'].ko, '무엇이 이유이고 결과인지 구별하기');
  assert.match(catalog['이번에 배운 이유 연결형'].en, /link a reason/);
  for (const key of ['형태 연습 뒤 새 문장에서 연결 형태를 확인해요. 연습한 기록과 독립 사용 기록은 달라요.',
    '이 문단에 필요한 문장 기능을 독립적으로 사용한 경험을 확인해요. 모든 노드의 완벽한 완료를 요구하지 않아요.']) {
    assert.doesNotMatch(catalog[key].ko, /독립 사용|독립적으로|노드|하위 기능/);
    assert.match(catalog[key].ko, /도움 없이/);
  }
});
