const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'data/writing-curriculum.js'), 'utf8'), context);
const data = context.window.HARUMAL_WRITING_DATA;
const items = Object.fromEntries(data.items.map(item => [item.id, item]));
const countStage = stage => data.items.filter(item => data.groups.find(group => group.id === item.groupId).stage === stage).length;
const matches = (pattern, text) => new RegExp(pattern, 'u').test(text);
function checksPass(item, text) {
  return item.evaluation.required.every(check => matches(check.pattern, text))
    && item.evaluation.forbidden.every(check => !matches(check.pattern, text))
    && (!item.evaluation.targetPattern || matches(item.evaluation.targetPattern, text));
}
function learnerText(item) {
  return JSON.stringify({ promptKo: item.promptKo, promptJa: item.promptJa, facts: item.facts, support: item.support, draftKo: item.draftKo });
}

test('writing content exposes an immutable honest 14-node curriculum map', () => {
  assert.equal(data.version, 1);
  assert.equal(data.nodes.length, 14);
  assert.equal(data.groups.length, 12);
  assert.equal(data.items.length, 37);
  assert.deepEqual(Array.from(data.nodes, node => node.id), Array.from({ length: 12 }, (_, n) => `S${String(n + 1).padStart(2, '0')}`).concat(['D01', 'D02']));
  assert.equal(data.nodes.find(node => node.id === 'S07').status, 'partial');
  assert.ok(data.nodes.filter(node => node.id !== 'S07').every(node => node.status === 'planned' && node.availableGroupIds.length === 0));
  assert.ok(data.nodes.every(node => node.subskills.length >= 3 && node.prerequisiteNoteKo && node.summaryKo && node.titleJa));
  assert.equal(data.scope.automaticMeaningPolicy, 'never_certify');
  assert.equal(data.scope.selfDeclarationPolicy, 'readiness_not_mastery');
  assert.match(data.scope.verifiedRangeKo, /먹어서·사서·와서/);
  const walk = value => {
    if (value && typeof value === 'object') {
      assert.ok(Object.isFrozen(value));
      Object.values(value).forEach(walk);
    }
  };
  walk(data);
});

test('the complete first atomic unit retains every practice and evidence category', () => {
  assert.equal(countStage('probe'), 6);
  assert.equal(countStage('form'), 9);
  assert.equal(countStage('mixed'), 6);
  assert.equal(countStage('variation'), 6);
  assert.equal(countStage('correction'), 4);
  assert.equal(countStage('expansion'), 1);
  assert.equal(countStage('independent'), 3);
  assert.equal(countStage('delayed'), 2);
  for (const form of ['form-aseo', 'form-eoseo', 'form-haeseo']) {
    assert.equal(data.groups.find(group => group.id === form).itemIds.length, 3);
  }
  assert.equal(items.R01.evidence.modelReconstruction, true);
  assert.equal(items.R01.evidence.assistedByDesign, true);
  assert.equal(items.R01.evidence.independent, false);
  assert.equal(items.I03.kind, 'free');
  assert.equal(items.I03.evaluation.reviewRequired, true);
  assert.equal(items.I03.evidence.personalDisclosureOptional, true);
  assert.equal(items.I03.evaluation.meaningPolicy, 'human_review_required');
});

test('all cross-references and prerequisite-specific routes are valid', () => {
  for (const collection of [data.nodes, data.groups, data.items, data.prerequisites]) {
    assert.equal(new Set(collection.map(item => item.id)).size, collection.length);
  }
  const nodes = new Set(data.nodes.map(node => node.id));
  const features = new Set(data.prerequisites.map(feature => feature.id));
  for (const node of data.nodes) node.prerequisites.forEach(id => assert.ok(nodes.has(id), `${node.id}: ${id}`));
  for (const group of data.groups) {
    assert.ok(nodes.has(group.nodeId));
    group.prerequisites.forEach(id => assert.ok(features.has(id), `${group.id}: ${id}`));
    for (const id of group.itemIds) assert.equal(items[id].groupId, group.id);
  }
  for (const item of data.items) {
    assert.ok(nodes.has(item.nodeId));
    item.prerequisites.forEach(id => assert.ok(features.has(id), `${item.id}: ${id}`));
    assert.ok(item.promptKo && item.promptJa && item.support.meaningJa, item.id);
    assert.ok([null, 'work', 'study', 'park', 'movie', 'rain'].includes(item.image));
  }
  for (const prerequisite of data.prerequisites) {
    prerequisite.probeItemIds.forEach(id => assert.ok(items[id]));
  }
  assert.ok(!data.groups.find(group => group.id === 'form-aseo').prerequisites.includes('reason_form'), 'new form cannot be its own prerequisite');
  assert.ok(items.R24.prerequisites.includes('negation'), 'precision repair needs inability meaning');
  assert.ok(items.R24.prerequisites.includes('past'), 'past repair needs past');
  assert.ok(items.E01.prerequisites.includes('time_info'));
  assert.ok(!items.E01.prerequisites.includes('subject'), 'first expansion changes time only');
});

test('teacher models satisfy all observable checks without exact-string comparison', () => {
  for (const item of data.items) {
    for (const model of item.models) {
      assert.ok(checksPass(item, model), `${item.id} model fails: ${model}; checks ${JSON.stringify(item.evaluation)}`);
      if (item.kind !== 'free') assert.equal(item.evaluation.reviewRequired, false);
    }
    for (const check of [...item.evaluation.required, ...item.evaluation.forbidden]) {
      assert.doesNotThrow(() => new RegExp(check.pattern, 'u'), `${item.id}.${check.id}`);
      assert.ok(check.messageKo && check.messageJa);
    }
    if (item.evaluation.targetPattern) assert.doesNotThrow(() => new RegExp(item.evaluation.targetPattern, 'u'));
    if (item.evaluation.alternativePattern) assert.doesNotThrow(() => new RegExp(item.evaluation.alternativePattern, 'u'));
  }
  for (const [id, text] of [
    ['R01', '저는 일이 많아서 늦게 퇴근해요'],
    ['R02', '날씨는 좋아서 저는 공원에 가요!'],
    ['R08', '도서관은 조용해서 저는 여기서 공부를 해요.'],
    ['R12', '많이 공부하여서 답을 알아요.'],
    ['R15', '회의실은 작아서 다른 방을 써요.'],
    ['R20', '어제 시간이 없어서 영화를 못 봤어요.'],
    ['R21', '어제 돈이 없어서 책을 못 샀어요.'],
    ['R24', '시간이 없어서 저는 영화를 못 봤어요.'],
    ['E01', '오늘은 회의실이 작아서 다른 방을 사용해요.']
  ]) assert.ok(checksPass(items[id], text), `${id}: valid reviewed variation ${text}`);
});

test('wrong direction, malformed joins, loss of negative scope, and lost information are not confirmed', () => {
  for (const [id, text] of [
    ['R01', '일이 많아요서 늦게 퇴근해요.'],
    ['R23', '늦게 퇴근해서 일이 많아요.'],
    ['R25', '방이 깨끗해서 도서관에서 공부해요.'],
    ['R20', '어제 시간이 없어서 영화를 봤어요.'],
    ['R24', '시간이 없어서 영화를 보지 않았어요.'],
    ['R18', '도서관이 조용해서 여기에서 공부해요.'],
    ['R16', '어제 일이 많아서 늦게 퇴근해요.'],
    ['E01', '회의실이 작아서 다른 방을 사용해요.']
  ]) assert.equal(checksPass(items[id], text), false, `${id} incorrectly confirmed ${text}`);
  assert.match(items.R24.teacherNoteKo, /문법 오류나 상황 모순으로 단정하지/);
  assert.match(items.P05.teacherNoteKo, /비의도적인 비발생/);
  assert.equal(matches(items.R01.evaluation.targetPattern, '일이 많기 때문에 늦게 퇴근해요.'), false);
  assert.equal(matches(items.R01.evaluation.alternativePattern, '일이 많기 때문에 늦게 퇴근해요.'), true);
  assert.notEqual(items.R01.evaluation.meaningPolicy, 'verified');
});

test('independent models and delayed scenarios are not leaked into learner support', () => {
  for (const item of data.items.filter(item => item.evidence.independent)) {
    const text = learnerText(item);
    for (const model of item.models) assert.ok(!text.includes(model), `${item.id} leaks teacher model`);
    assert.ok(!matches(item.evaluation.targetPattern, text), `${item.id} leaks target-conjugated phrase`);
    assert.equal(item.support.helpKo, undefined);
    assert.equal(item.evidence.assistedByDesign, false);
  }
  const delayed = data.items.filter(item => item.delayedOnly);
  assert.deepEqual(Array.from(delayed, item => item.id), ['D01', 'D02']);
  const publicSameDay = data.items.filter(item => !item.delayedOnly).map(learnerText).join('\n');
  for (const item of delayed) {
    assert.equal(item.evidence.heldOut, true);
    assert.equal(item.evidence.newContext, true);
    for (const fact of item.facts) assert.ok(!publicSameDay.includes(fact.ko), `${item.id}: delayed fact reused`);
  }
  const group = data.groups.find(group => group.id === 'delayed-new');
  assert.equal(group.delayedOnly, true);
  assert.equal(group.previewPolicy, 'hide_items_until_due');
  assert.equal(group.releasePolicy, 'later_local_calendar_day');
  assert.ok(!/영화|날씨|재미|맑/.test(group.titleKo + group.helpKo));
});

test('prerequisite choices remain narrow interpretation evidence and do not imply mastery', () => {
  for (const item of data.items.filter(item => item.kind === 'relation')) {
    assert.ok(item.choices.some(choice => choice.id === item.evaluation.correctChoiceId));
    assert.equal(item.evidence.independent, false);
    assert.equal(item.evaluation.meaningPolicy, 'narrow_choice_only');
    assert.equal(item.evaluation.targetPattern, null);
  }
  assert.equal(items.P03.evidence.relationProvided, true);
  assert.equal(items.P04.evaluation.correctChoiceId, 'unavailable');
  assert.equal(items.P05.evaluation.correctChoiceId, 'unable');
});


test('supported form lessons match their actual predicate and never appear on fresh checks', () => {
  const expected = { R01: '많다 → 많아서', R02: '좋다 → 좋아서', R03: '많다 → 많아서', R04: '없다 → 없어서', R05: '멀다 → 멀어서', R06: '없다 → 없어서', R07: '복잡하다 → 복잡해서', R08: '조용하다 → 조용해서', R09: '깨끗하다 → 깨끗해서' };
  for (const item of data.items) {
    if (expected[item.id]) {
      assert.equal(item.support.lessonKo, expected[item.id]);
      assert.ok(item.support.lessonJa && item.support.helpKo && item.support.helpJa);
      assert.equal(item.evidence.assistedByDesign, true);
      assert.equal(item.evidence.independent, false);
    } else {
      assert.equal(item.support.lessonKo, undefined, `${item.id} unexpectedly displays morphology help`);
    }
  }
});
