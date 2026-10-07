'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {} };
vm.createContext(context);
for (const file of ['data/writing-curriculum.js', 'writing-curriculum-engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
}
const data = context.window.HARUMAL_WRITING_DATA;
const item = data.items.find(value => value.id === 'P01');
const evaluate = text => context.window.HARUMAL_WRITING_ENGINE.evaluate(item, text);

function permutations(parts) {
  if (parts.length < 2) return [parts];
  return parts.flatMap((part, index) => permutations(parts.filter((_, i) => i !== index))
    .map(rest => [part, ...rest]));
}

test('P01 observes the reported present-progressive answer without claiming meaning or mastery', () => {
  const result = evaluate('저는 지금 도서관에서 공부하고 있어요.');
  assert.equal(result.status, 'components_observed');
  assert.equal(result.form, 'components_only');
  assert.equal(result.meaning, 'unreviewed');
  assert.equal(result.issues, undefined);
  assert.equal(item.evaluation.meaningPolicy, 'not_automatically_verified');
  assert.equal(data.scope.automaticMeaningPolicy, 'never_certify');
  assert.equal(item.evidence.independent, false);
});

test('P01 accepts only the bounded present/present-progressive matrix across reviewed word orders', () => {
  const variants = new Set();
  for (const subject of ['', '저는', '제가']) {
    for (const time of ['', '지금', '지금은']) {
      for (const prefix of permutations([subject, time, '도서관에서'].filter(Boolean))) {
        for (const action of ['공부해요', '공부를 해요', '공부하고 있어요', '공부를 하고 있어요']) {
          variants.add([...prefix, action].join(' ') + '.');
        }
      }
    }
  }
  assert.equal(variants.size, 132);
  for (const text of variants) {
    const result = evaluate(text);
    assert.equal(result.status, 'components_observed', text);
    assert.equal(result.meaning, 'unreviewed', text);
    // Data consumers that do not strip whitespace must agree with the engine.
    for (const rule of item.evaluation.required) assert.match(text, new RegExp(rule.pattern, 'u'), text);
  }
  for (const text of [
    '도서관에서 공부하고 있어요',
    '  저는 지금 도서관에서 공부를 하고 있어요.  ',
    '지금\n도서관에서\t제가 공부하고 있어요!',
    '저는지금도서관에서공부하고있어요。',
    '제가 도서관에서 지금 공부를 해요.'.normalize('NFD')
  ]) assert.equal(evaluate(text).status, 'components_observed', text);
});

const rejected = {
  negation: [
    '저는 지금 도서관에서 안 공부해요.',
    '저는 지금 도서관에서 공부를 안 해요.',
    '저는 지금 도서관에서 공부 안 하고 있어요.',
    '저는 지금 도서관에서 공부하고 있지 않아요.',
    '저는 지금 도서관에서 공부하지 않아요.',
    '저는 지금 도서관에서 못 공부해요.',
    '저는 지금 도서관에서 공부를 못 해요.',
    '저는 지금 도서관에서 공부하지 못해요.'
  ],
  past: [
    '저는 도서관에서 공부했어요.',
    '저는 도서관에서 공부하고 있었어요.',
    '어제 도서관에서 공부해요.',
    '저는 어제 도서관에서 공부하고 있어요.'
  ],
  future: [
    '저는 도서관에서 공부할 거예요.',
    '저는 도서관에서 공부하려고 해요.',
    '내일 도서관에서 공부해요.',
    '저는 내일 도서관에서 공부하고 있어요.'
  ],
  action: [
    '저는 지금 도서관에서 운동해요.',
    '저는 지금 도서관에서 공부를 보고 있어요.',
    '저는 지금 도서관에서 공부하고 놀아요.',
    '저는 지금 도서관에서 공부하고 있어.',
    '저는 지금 도서관에서 공부해요요.',
    '도서관에서 공부를 해요를 읽어요.'
  ],
  location: [
    '저는 지금 집에서 공부해요.',
    '저는 지금 도서관에 공부하고 있어요.',
    '저는 지금 공부하고 있어요.',
    '저는 지금 도서관에서가 아니라 집에서 공부해요.',
    '도서관에서 집에 가서 공부하고 있어요.',
    '도서관에서 공부해요. 집에서 공부해요.',
    '지금 도서관에서요. 저는 집에서 공부해요.',
    '저는 지금 작은도서관에서 공부하고 있어요.'
  ],
  fragments: [
    '친구는 지금 도서관에서 공부해요.',
    '저는 저는 도서관에서 공부해요.',
    '지금 지금 도서관에서 공부해요.',
    '도서관에서 도서관에서 공부해요.',
    '안저는 도서관에서 공부해요.',
    '저는 도서관에서 공부해요. 안 해요.',
    '아니요. 저는 도서관에서 공부하고 있어요.',
    '저는 도서관에서 공부하고 있어요. 저는 집에 있어요.',
    '저는 도서관에서 공부해요서 집에 가요.',
    '도서관에서 공부해요 도서관에서 공부하고 있어요.'
  ]
};
for (const [category, texts] of Object.entries(rejected)) {
  test(`P01 does not observe ${category} outside the bounded present study sentence`, () => {
    for (const text of texts) {
      const result = evaluate(text);
      assert.equal(result.status, 'review_needed', text);
      assert.equal(result.form, 'not_observed', text);
      assert.equal(result.meaning, 'unreviewed', text);
      assert.ok(result.issues.includes('simple_predicate'), text);
    }
  });
}

test('P01 feedback distinguishes a missing place from an unsupported sentence without a grammar verdict', () => {
  const missingPlace = evaluate('저는 지금 집에서 공부하고 있어요.');
  assert.equal(missingPlace.messages[0], item.evaluation.required.find(rule => rule.id === 'action_place').messageKo);
  const unsupported = evaluate('저는 지금 도서관에서 열심히 공부하고 있어요.');
  assert.equal(unsupported.status, 'review_needed');
  assert.match(unsupported.messages[0], /자동 확인 범위/);
  assert.match(unsupported.messages[0], /다른 자연스러운 표현/);
  assert.doesNotMatch(unsupported.messages[0], /해요체로 써|틀렸|잘못/);
});
