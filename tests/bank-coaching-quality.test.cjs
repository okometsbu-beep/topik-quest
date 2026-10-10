const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const test = require('node:test');

const context = { console, window: {}, localStorage: { getItem: () => null, setItem() {}, removeItem() {} } };
context.window.window = context.window;
context.window.localStorage = context.localStorage;
vm.createContext(context);
for (let part = 1; part <= 4; part++) vm.runInContext(fs.readFileSync(`data/question-bank-v1-part${part}.js`, 'utf8'), context);
for (const file of ['data/question-bank-practice-v1.js', 'data/explanations-i18n.js', 'question-bank-engine.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context);
}
const bank = context.window.MALBIT_BANK;
const practice = bank.items.filter(item => /^P01-/u.test(item.id));
const coached = bank.items.filter(item => item.coach);
const hash = rows => crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
const permutations = values => values.length === 0 ? [[]] : values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map(rest => [value, ...rest]));

// These tests guard reviewed claims and immutable content. Passing them alone is
// not a claim of native-speaker or educator certification of the question bank.
test('coaching revision preserves all 56 practice keys/options and all 8 listening scripts', () => {
  assert.equal(practice.length, 56);
  assert.equal(coached.length, 71);
  assert.equal(hash(practice.map(({ id, options, answerIndex }) => ({ id, options, answerIndex }))), '227bbdf607fe80b6d553e4c93af029041fe804b3f506948bed0a72c3e205e8af');
  assert.equal(hash(practice.filter(item => item.section === 'listening').map(({ id, script }) => ({ id, script }))), '6bafa1ea7f346e90ffaf78fe2b4d635dae60df17f1d99bb570dad7a9914b2b2d');
  assert.equal(hash(practice.filter(item => !['P01-I-R-09', 'P01-I-R-16', 'P01-I-R-17', 'P01-I-R-27', 'P01-II-R-15'].includes(item.id)).map(({ id, passage, script, prompt }) => ({ id, passage, script, prompt }))), 'bf8b5ba592386602200af500d49c961ab166910cb197864c661c7884be47621a');
  assert.match(bank.byId('P01-I-R-09').passage, /자신의 옷장에 있는 두꺼운 옷/u);
  assert.equal(bank.byId('P01-I-R-17').prompt, '빈칸에 들어갈 목적을 나타내는 표현을 고르십시오.');
  assert.match(bank.byId('P01-I-R-16').prompt, /행동을 끝낸 뒤/u);
  assert.match(bank.byId('P01-I-R-27').prompt, /집을 나가는 행동보다 먼저/u);
  assert.match(bank.byId('P01-II-R-15').prompt, /양보 관계/u);
});

test('reviewed practice claims follow the actual evidence without invented restrictions', () => {
  const checks = {
    'P01-I-L-03': { ko: ['처방전', '핵심 단서'], ja: ['処方箋', '決め手'] },
    'P01-I-L-04': { ko: ['바뀌지 않은 장소', '세 시에서 네 시로'], ja: ['場所に変更がない', '3時から4時'] },
    'P01-I-R-09': { ko: ['자신의 옷장', '가능한 표현'], ja: ['自分のクローゼット', 'も使える表現'] },
    'P01-I-R-13': { ko: ['“걷기를 잊다”는 가능한 표현', '자동사'], ja: ['歩くことを忘れる', '自動詞'] },
    'P01-I-R-14': { ko: ['진동 상태'], ja: ['バイブレーション'] },
    'P01-I-R-16': { ko: ['문제는 숙제를 끝낸 뒤', '가능한 문장'], ja: ['設問は宿題を終えてから', '文として成立'] },
    'P01-I-R-17': { ko: ['목적을 나타내는 표현을 요구', '공부의 이유'], ja: ['設問は勉強する目的', '勉強の理由'] },
    'P01-I-R-18': { ko: ['ㅂ 불규칙', '매우니까'], ja: ['ㅂ変則活用', '매우니까'] },
    'P01-I-R-21': { ko: ['종이컵 사용', '할인'], ja: ['紙コップの使用', '割引'] },
    'P01-I-R-22': { ko: ['가까운 길'], ja: ['近い場所へ歩いて行く'] },
    'P01-I-R-24': { ko: ['환승 없이', '실제 출근 시간'], ja: ['乗り換えなしで', '実際の通勤時間'] },
    'P01-I-R-26': { ko: ['다른 일을 할 여유 시간'], ja: ['何かをするための時間の余裕'] },
    'P01-I-R-27': { ko: ['직후', '나가는 동안', '출발 전의'], ja: ['直後', '出発前'] },
    'P01-II-L-03': { ko: ['시간을 내기 어려워'], ja: ['時間を取るのが難しい'] },
    'P01-II-R-08': { ko: ['중요성을 마련하다·유지하다', '강조하지 말라는'], ja: ['重要性を用意する・維持する', '強調してはいけない'] },
    'P01-II-R-15': { ko: ['배경이나 원인', '요구한 양보'], ja: ['背景や原因', '求められた譲歩'] },
    'P01-II-R-20': { ko: ['회수율 낮아', '운영 지속에 난항'], ja: ['返却されない', '運営の継続'] },
    'P01-II-R-22': { ko: ['과장', '언급되지 않았으며'], ja: ['完全な解決', '書かれておらず'] },
    'P01-II-R-23': { ko: ['근거가 없는 조건'], ja: ['本文に根拠のない条件'] },
    'P01-II-R-27': { ko: ['최근 2년', '한 편'], ja: ['最近2年以内', '作品1点'] },
    'P01-II-R-28': { ko: ['음식물 반입 금지', '예약 기한'], ja: ['飲食物の持ち込み禁止', '予約期限'] }
  };
  assert.equal(Object.keys(checks).length, 21);
  for (const [id, languages] of Object.entries(checks)) {
    for (const [lang, needles] of Object.entries(languages)) {
      const coach = bank.byId(id).coach[lang];
      const text = `${coach.reason}\n${coach.trap}`;
      for (const needle of needles) assert.ok(text.includes(needle), `${id}/${lang} should retain reviewed claim ${needle}`);
    }
  }
  assert.doesNotMatch(bank.byId('P01-I-L-04').coach.ja.trap, /繰り返し確認/u);
  assert.doesNotMatch(bank.byId('P01-II-L-03').coach.ko.reason, /시간이 없/u);
  assert.doesNotMatch(bank.byId('P01-II-R-28').coach.ja.trap, /時間表の正しい情報三つ/u);
});

test('all 71 authored-coach items preserve correct answer feedback through every shuffle', () => {
  const fixedOrdinal = /(?:첫|두|세|네) 번째 보기|[1-4]番目|最初の選択肢/u;
  const numberText = {
    ko: n => `현재 보기 순서에서는 ${n}번이 정답입니다.`,
    ja: n => `現在の選択肢では${n}番が正解です。`,
    en: n => `option ${n} is correct.`,
    zh: n => `第${n}项是正确答案。`
  };
  for (const source of coached) {
    for (const lang of ['ko', 'ja']) assert.doesNotMatch(JSON.stringify(source.coach[lang]), fixedOrdinal, `${source.id}/${lang}: no original-slot ordinal in authored text`);
    for (const order of permutations([0, 1, 2, 3])) {
      const question = bank.present(source, order);
      const correct = source.options[source.answerIndex];
      assert.equal(question.choices[question.answerIndex], correct);
      for (const lang of ['ko', 'ja', 'en', 'zh']) {
        const explanation = question.explanationI18n[lang];
        assert.ok(explanation.includes(correct), `${source.id}/${lang}: actual answer text`);
        assert.ok(explanation.includes(numberText[lang](question.answerIndex + 1)), `${source.id}/${lang}: displayed ordinal`);
        assert.ok(question.choiceExplanationsI18n[lang][question.answerIndex].includes(correct), `${source.id}/${lang}: selected correct-choice rationale`);
      }
    }
  }
});

test('borrowed-clothes and reason-clause distractors retain contextual explanations when shuffled', () => {
  const cases = [
    ['P01-I-R-09', '빌려', /가능한 표현/u, /も使えます/u, /is valid/u, /可以说/u],
    ['P01-I-R-16', '하려고', /문법 오류는 아니지만/u, /文法的に誤りではありません/u, /is grammatical/u, /语法本身没有错误/u],
    ['P01-I-R-17', '가니까', /문법 오류는 아니지만/u, /文法的に誤りではありません/u, /is grammatical/u, /语法本身没有错误/u],
    ['P01-I-R-27', '자마자', /가능한 표현/u, /使える表現/u, /is valid/u, /可以表示/u],
    ['P01-II-R-15', '다 보니', /문법 오류는 아니지만/u, /文法的に誤りではありません/u, /is grammatical/u, /语法本身没有错误/u]
  ];
  for (const [id, choice, ko, ja, en, zh] of cases) {
    for (const order of permutations([0, 1, 2, 3])) {
      const question = bank.present(id, order);
      const index = question.choices.indexOf(choice);
      assert.match(question.choiceExplanationsI18n.ko[index], ko, `${id}: do not teach false grammar bans`);
      assert.match(question.choiceExplanationsI18n.ja[index], ja, `${id}: Japanese preserves valid usage`);
      assert.match(question.choiceExplanationsI18n.en[index], en, `${id}: English preserves valid usage`);
      assert.match(question.choiceExplanationsI18n.zh[index], zh, `${id}: Chinese preserves valid usage`);
      for (const lang of ['ko', 'ja', 'en', 'zh']) {
        const wrong = question.choiceExplanationsI18n[lang].filter((_, i) => i !== question.answerIndex);
        assert.equal(new Set(wrong).size, 3, `${id}/${lang}: each distractor has its own feedback`);
      }
    }
  }
});

test('all four languages cite online-only evidence for the actual in-person distractor', () => {
  for (const order of permutations([0, 1, 2, 3])) {
    const question = bank.present('P01-II-R-27', order);
    const inPerson = question.choices.indexOf('서류는 방문해서 제출해야 한다.');
    const twoWorks = question.choices.indexOf('신청자는 작품 두 편을 제출해야 한다.');
    const thisMonth = question.choices.indexOf('마감일은 이번 달 오 일이다.');
    for (const lang of ['ko', 'ja', 'en', 'zh']) {
      const feedback = question.choiceExplanationsI18n[lang];
      assert.match(feedback[inPerson], /접수는 온라인으로만 진행/u, `${lang}: cite the submission method, not the unrelated work requirement`);
      assert.match(feedback[twoWorks], /한 편/u, `${lang}: cite one work`);
      assert.match(feedback[thisMonth], /다음 달 5일/u, `${lang}: cite next month`);
      assert.equal(new Set(feedback.filter((_, index) => index !== question.answerIndex)).size, 3);
    }
  }
});
