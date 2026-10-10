const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.createContext(context);
for (const file of ['legacy-data.js', 'data/topik1-listening.js', 'data/topik1-reading.js', 'data/explanations-i18n.js', 'data/travel-adventure-seoul-v1.js', 'data/travel-pack-seoul-001.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context);
}
const { RW, LS } = vm.runInContext('({ RW, LS })', context);
const ex = context.window.MALBIT_EXPLANATIONS;
const languages = ['ko', 'ja', 'en', 'zh'];

test('all 174 legacy authored questions have nonempty four-language explanations', () => {
  const sets = [ex.topik1Listening, ex.topik1Reading, ex.topik2Listening, ex.topik2Reading, ex.topik2Writing];
  assert.deepEqual(sets.map(set => Object.keys(set).length), [30, 40, 50, 50, 4]);
  for (const set of sets) for (const value of Object.values(set)) for (const lang of languages) assert.ok(value[lang]?.trim());
});

test('continuation explanations use the heard problem, rather than claiming the answer was heard', () => {
  assert.match(LS.find(q => q.id === 4).script, /표를 아직 못 넣었어요/u);
  assert.match(ex.topik2Listening[4].ko, /아직 넣지 못/u);
  assert.match(ex.topik2Listening[4].ja, /まだ入れていません/u);
  assert.doesNotMatch(ex.topik2Listening[4].ko, /남자가 표를 만들겠다고 했/u);
  assert.match(ex.topik2Listening[5].ja, /週末の混雑/u);
  assert.match(ex.topik2Listening[6].ja, /住所を見つけられず/u);
  assert.match(ex.topik2Listening[7].ja, /昨日予約/u);
  assert.match(ex.topik2Listening[8].ja, /重複部分を削除/u);
  for (const id of [4, 5, 6, 7, 8]) assert.ok(ex.topik2Listening[id].en.length > 100);
});

test('commuting evidence does not add school travel absent from either source', () => {
  assert.match(LS.find(q => q.id === 3).script, /출퇴근이 40%/u);
  assert.match(RW.find(q => q.id === 53).stem, /출퇴근: 38% → 52%/u);
  assert.doesNotMatch(JSON.stringify(ex.topik2Listening[3]), /통학|通学|上学/u);
  assert.doesNotMatch(ex.topik2Writing[53].ja, /通学/u);
});

test('grammar explanations state the correct construction and its contextual meaning', () => {
  for (const [id, pattern] of [[1, /정리해 놓아야 한다/u], [2, /-기 마련이다/u], [3, /-ㄴ 탓에/u], [4, /설명하기 나름이라서/u]]) {
    assert.match(ex.topik2Reading[id].ko, pattern);
    assert.match(ex.topik2Reading[id].ja, pattern);
  }
});

test('reading explanations identify concrete source facts instead of bare option agreement', () => {
  for (const [id, pattern] of [[19, /比較/u], [22, /使いやすさ/u], [24, /おつり|小銭/u], [26, /週末/u], [28, /小さな目標/u], [30, /起床時刻/u], [32, /樹種/u], [34, /技術や経験/u], [35, /縦軸/u], [38, /提出/u], [41, /辞書/u], [42, /ミシン/u], [43, /制服/u], [45, /オンライン/u]]) assert.match(ex.topik2Reading[id].ja, pattern);
  assert.doesNotMatch(ex.topik1Reading[60].ja, /おいし/u);
  assert.match(ex.topik1Reading[32].en, /open umbrella/u);
});

test('writing guidance distinguishes prompt requirements from model-answer examples', () => {
  assert.doesNotMatch(RW.find(q => q.id === 51).stem, /금요일/u);
  assert.match(ex.topik2Writing[51].ko, /필수 조건이 아닙니다/u);
  assert.match(ex.topik2Writing[51].ja, /必須条件ではありません/u);
  assert.match(ex.topik2Writing[51].en, /not required/u);
  assert.match(ex.topik2Writing[51].zh, /不是必要条件/u);
  assert.match(ex.topik2Writing[54].ja, /自分の考えと根拠/u);
  assert.match(ex.topik2Writing[54].en, /not mandatory positions/u);
});

test('scarf collocation has no second naturally correct wear-scarf option', () => {
  const q = context.window.TOPIK1_READING_DATA.find(q => q.id === 50);
  assert.equal(q.answerIndex, 1);
  assert.equal(q.choices[q.answerIndex], '매세요');
  assert.equal(q.choices[0], '푸세요');
  assert.ok(!q.choices.includes('하세요'));
  for (const lang of languages) assert.match(q.explanationI18n[lang], /푸세요/u);
});

test('purpose guidance distinguishes purpose from reason without an inaccurate past-only rule', () => {
  const coach = ex.bankCoach['M09-I-R-34'];
  assert.doesNotMatch(coach.ko.strategy, /이미 생긴/u);
  assert.doesNotMatch(coach.ja.strategy, /すでに生じた/u);
  assert.doesNotMatch(coach.en.strategy, /already in effect/u);
  assert.doesNotMatch(coach.zh.strategy, /已经发生/u);
  for (const lang of languages) assert.match(coach[lang].strategy, /-기 때문에/u);
  assert.match(ex.bankCoach['M11-I-R-37'].ja.reason, /出入口の案内/u);
});

test('travel explanation coverage counts authored prompts separately from navigation scenes', () => {
  const adventure = Object.values(context.window.HARUMAL_ADVENTURE_DATA.levels).flat();
  const scenes = context.window.MALBIT_TRAVEL_PACKS[0].scenes;
  const questions = scenes.flatMap(scene => [scene.question, ...Object.values(scene.routeVariants || {}).map(v => v.question)].filter(Boolean));
  assert.equal(adventure.length, 8);
  assert.equal(scenes.length, 12);
  assert.equal(questions.length, 8);
  assert.equal(new Set(questions.map(q => q.bankId)).size, 8);
  for (const q of adventure) for (const lang of languages) {
    assert.ok(q.evidence[lang]);
    assert.equal(q.traps[q.answer], null);
    for (let i = 0; i < q.choices.length; i++) if (i !== q.answer) assert.ok(q.traps[i][lang]);
  }
  for (const q of questions) for (const lang of languages) {
    assert.ok(q.explanationI18n[lang]);
    assert.ok(q.coach.evidence[lang]);
    assert.equal(q.coach.traps[q.answerIndex], null);
    for (let i = 0; i < q.choices.length; i++) if (i !== q.answerIndex) assert.ok(q.coach.traps[i][lang]);
  }
});

test('ordering repairs provide antecedents that uniquely support the unchanged keyed order', () => {
  const cases = [
    { id: 13, before: '가', after: '나', intro: '다', cue: /이처럼 텃밭을 가꾸는 사람이 늘어나는/u, key: 0 },
    { id: 46, before: '가', after: '다', intro: '나', cue: /이처럼 종류별로 온도와 습도를 조절해 보관한 씨앗/u, key: 1 }
  ];
  for (const item of cases) {
    const q = RW.find(q => q.id === item.id);
    assert.equal(q.answerIndex, item.key);
    assert.match(q.stem, item.cue);
    const candidates = q.choices.map((choice, index) => ({ index, order: [...choice.matchAll(/\(([가-힣])\)/gu)].map(match => match[1]) }))
      .filter(({ order }) => order[0] === item.intro && order.indexOf(item.before) < order.indexOf(item.after));
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0].index, item.key);
  }
});

test('insertion repair requires both prior temperature evidence and the following rainwater description', () => {
  const q = RW.find(q => q.id === 18);
  assert.equal(q.answerIndex, 2);
  const insert = q.stem.match(/<([^>]+)>/u)[1];
  assert.match(insert, /이러한 온도 조절 효과/u);
  assert.match(insert, /다음과 같은 빗물 관리 효과/u);
  const passage = q.stem.split('>\n\n')[1];
  const slots = [...passage.matchAll(/\( (㉠|㉡|㉢|㉣) \)/gu)];
  const candidates = slots.filter(slot => {
    const before = passage.slice(0, slot.index);
    const after = passage.slice(slot.index + slot[0].length);
    return /식물이 햇빛을 흡수/u.test(before) && /옥상 정원은 빗물을 잠시 저장/u.test(after);
  });
  assert.deepEqual(candidates.map(slot => slot[1]), ['㉢']);
  assert.match(q.why, /次のような雨水管理/u);
});

test('legacy writing study fields also translate work commuting consistently', () => {
  const q = RW.find(q => q.id === 53);
  assert.match(q.vocab, /출퇴근=通勤/u);
  assert.doesNotMatch(q.jp + q.vocab, /通学/u);
});
