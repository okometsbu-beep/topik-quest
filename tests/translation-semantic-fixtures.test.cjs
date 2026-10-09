const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Offline fixture validation only. No Worker, fetch, model, or learner storage is used.
const root = path.resolve(__dirname, '..');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/translation-semantic-evaluation.json'), 'utf8'));
const expectedInputs = [
  ['켠 채로', '불을 켠 채로 잠이 들었어요.', 'ja', 'grammar'],
  ['누르기만 하면', '이 버튼을 누르기만 하면 문이 열려요.', 'ja', 'grammar'],
  ['읽다가', '책을 읽다가 잠이 들었어요.', 'ja', 'grammar'],
  ['좋기에', '날씨가 좋기에 산책을 나갔어요.', 'ja', 'grammar'],
  ['공부하기에 좋은', '이 도서관은 조용해서 공부하기에 좋은 장소예요.', 'ja', 'grammar'],
  ['아낀 셈이다', '택시 대신 걸어왔으니 돈을 아낀 셈이다.', 'ja', 'grammar'],
  ['배', '잘 익은 배를 깎아서 접시에 담았어요.', 'ja', 'word'],
  ['배', '배를 타고 섬으로 건너갔어요.', 'ja', 'word'],
  ['밥은커녕 물도', '너무 바빠서 밥은커녕 물도 못 마셨어요.', 'en', 'grammar'],
  ['쓰다', '여기서 쓰다는 종이에 글자를 적는다는 뜻이에요.', 'en', 'word'],
  ['쓰다', '이 약은 맛이 쓰다.', 'zh', 'word'],
  ['갈 셈이다', '나는 내년에 한국에 갈 셈이다.', 'zh', 'grammar']
];
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

test('synthetic fixture remains explicitly unrun and contains no model result evidence', () => {
  assert.equal(fixture.schemaVersion, 1);
  assert.equal(fixture.syntheticOnly, true);
  assert.ok(nonempty(fixture.provenance));
  assert.deepEqual(fixture.evaluation, {status: 'unrun', actualModelRequests: 0, records: []});
  assert.equal(fixture.referenceModel.referenceOnly, true);
  assert.equal(fixture.referenceModel.provider, 'cloudflare');
  assert.ok(nonempty(fixture.referenceModel.model));
});

test('all twelve exact synthetic inputs, order, target languages, and kinds match the plan', () => {
  assert.equal(fixture.cases.length, 12);
  assert.deepEqual(fixture.cases.map(item => item.id), Array.from({length: 12}, (_, i) => i + 1));
  assert.deepEqual(fixture.cases.map(({input}) => [input.term, input.context, input.target, input.kind]), expectedInputs);
  for (const {id, input} of fixture.cases) {
    assert.deepEqual(Object.keys(input).sort(), ['context', 'kind', 'target', 'term']);
    assert.ok(nonempty(input.term) && input.term.length <= 500, `case ${id}: bounded term`);
    assert.ok(nonempty(input.context) && input.context.length <= 700, `case ${id}: bounded context`);
    assert.ok(input.context.includes(input.term), `case ${id}: preserve the selected range`);
    assert.equal(input.term.normalize('NFC'), input.term);
    assert.equal(input.context.normalize('NFC'), input.context);
    assert.doesNotMatch(input.term + ' ' + input.context, /https?:\/\/|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|[<>\u0000-\u0008]/);
  }
});

test('every fixture contains semantic acceptance guidance and explicit failure examples', () => {
  const scripts = {ja: /[ぁ-ゖァ-ヺ一-龯]/, en: /[A-Za-z]/, zh: /[一-龯]/};
  for (const {id, input, expected} of fixture.cases) {
    assert.ok(nonempty(expected.primarySense), `case ${id}: primary sense`);
    assert.ok(nonempty(expected.requiredInterpretation), `case ${id}: semantic requirement`);
    assert.ok(Array.isArray(expected.acceptableParaphrases) && expected.acceptableParaphrases.length > 0);
    assert.ok(Array.isArray(expected.clearFailures) && expected.clearFailures.length > 0);
    assert.ok(expected.acceptableParaphrases.every(value => nonempty(value) && scripts[input.target].test(value)));
    assert.ok(expected.clearFailures.every(nonempty));
  }
  // This checks rubric completeness, not the correctness of a translation model.
  assert.equal(fixture.rubric.requiresHumanSemanticReview, true);
  assert.equal(fixture.rubric.allowEquivalentParaphrases, true);
  assert.equal(fixture.rubric.exactStringMatchIsSufficient, false);
  assert.equal(fixture.rubric.requirements.length, 5);
  assert.ok(fixture.rubric.requirements.every(nonempty));
});

test('contrasts preserve different primary senses and context-sensitive input identities', () => {
  assert.deepEqual(fixture.contrasts.map(pair => pair.caseIds), [[4, 5], [6, 12], [7, 8], [10, 11]]);
  for (const {caseIds} of fixture.contrasts) {
    const [a, b] = caseIds.map(id => fixture.cases.find(item => item.id === id));
    assert.ok(a && b);
    assert.notEqual(a.expected.primarySense, b.expected.primarySense);
  }
  const [pear, boat] = [fixture.cases[6], fixture.cases[7]];
  assert.equal(pear.input.term, boat.input.term);
  assert.equal(pear.input.target, boat.input.target);
  assert.equal(pear.input.kind, boat.input.kind);
  assert.notEqual(pear.input.context, boat.input.context);
  // These are expected input identities, not proof of runtime cache implementation.
  const identity = ({input}) => JSON.stringify([input.term, input.context, input.target, input.kind]);
  assert.notEqual(identity(pear), identity(boat));
});

test('expanded grammar fixtures cannot be mistaken for the seven exact local grammar aliases', () => {
  const context = {window: {}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'vocabulary-grammar.js'), 'utf8'), context);
  for (const item of fixture.cases.filter(item => item.input.kind === 'grammar')) {
    assert.equal(context.window.MALBIT_VOCAB_GRAMMAR.lookup(item.input.term), null, `case ${item.id} must not be an exact authored grammar alias`);
  }
});

test('evaluation contract separates model evidence, cache/local/mock results, and incomplete answers', () => {
  assert.deepEqual(fixture.rubric.routes, ['grammar', 'authored', 'cache', 'mock', 'machine']);
  assert.deepEqual(fixture.rubric.outcomes, ['pass', 'fail', 'safe_incomplete', 'unrun']);
  for (const field of ['caseId', 'input', 'codeVersion', 'model', 'promptVersion', 'route', 'workerRequestOccurred', 'modelInferenceOccurred', 'rawResponse', 'outcome', 'rationale']) {
    assert.ok(fixture.rubric.requiredRecordFields.includes(field), `missing evidence field: ${field}`);
  }
  assert.ok(nonempty(fixture.rubric.safeIncomplete));
  assert.ok(nonempty(fixture.rubric.liveModelEvidence));
  assert.ok(nonempty(fixture.rubric.aggregation));
});
