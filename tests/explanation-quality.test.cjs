const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { console, localStorage: { getItem: () => null, setItem() {} } };
context.window = context;
vm.createContext(context);
for (const file of [
  'data/explanations-i18n.js',
  ...Array.from({ length: 4 }, (_, i) => `data/question-bank-v1-part${i + 1}.js`),
  'data/question-bank-practice-v1.js', 'question-bank-engine.js'
]) vm.runInContext(fs.readFileSync(file, 'utf8'), context);
const bank = context.MALBIT_BANK;
const languages = ['ko', 'ja', 'en', 'zh'];

test('notice explanations preserve colon-separated hours, labels, and prices', () => {
  const question = bank.present('M01-I-R-40', [3, 0, 2, 1]);
  for (const lang of languages) {
    assert.match(question.explanationI18n[lang], /이용 시간: 07:00~21:00/u);
    assert.match(question.explanationI18n[lang], /요금: 1시간 1,000원/u);
    for (const reason of question.choiceExplanationsI18n[lang]) assert.match(reason, /07:00~21:00/u);
  }
  const synthetic = {
    ...bank.byId('M01-I-R-40'), id: 'test-hours', coach: null,
    passage: '예약 안내\n접수: 09:30~17:45\n문의: 02-123-4567\n준비물: 신분증',
    options: ['오전 아홉 시 삼십 분부터 접수합니다.', '오후 다섯 시 사십오 분까지 접수합니다.', '신분증이 필요합니다.', '밤 여덟 시에도 접수합니다.'], answerIndex: 3
  };
  for (const lang of languages) assert.match(bank.explain(synthetic)[lang], /09:30~17:45 문의: 02-123-4567 준비물: 신분증/u);
});

test('causal reason guidance does not substitute final communicative purpose', () => {
  const question = bank.present('M01-I-L-29', [3, 2, 1, 0]);
  assert.match(question.explanationI18n.ja, /友|친구의 권유/u);
  assert.match(question.explanationI18n.ja, /原因・きっかけ/u);
  assert.doesNotMatch(question.explanationI18n.ja, /最後の一、二文|依頼・提案・主張が目的/u);
  assert.doesNotMatch(question.explanationI18n.ko, /마지막 한두 문장|마지막 요청/u);
  assert.doesNotMatch(question.explanationI18n.en, /last one or two|final request/u);
  assert.doesNotMatch(question.explanationI18n.zh, /最后一两句|最后的请求/u);
  const purpose = bank.items.find(item => item.itemType === 'speaker_purpose' && !item.coach);
  assert.match(bank.explain(purpose).ja, /依頼・提案・主張が目的/u);
  const cause = { ...bank.byId('M01-II-R-44'), prompt: '글에서 제시한 원인을 고르십시오.' };
  assert.match(bank.explain(cause).ja, /原因・きっかけ/u);
});

test('each shuffled distractor retrieves the fact relevant to that choice', () => {
  for (const order of [[0, 1, 2, 3], [3, 2, 1, 0], [2, 0, 3, 1]]) {
    const question = bank.present('M01-I-L-18', order);
    const distractor = question.choices.indexOf('정류장 위치가 바뀌었습니다.');
    for (const lang of languages) {
      assert.match(question.choiceExplanationsI18n[lang][distractor], /정류장 위치는 그대로입니다\./u);
      assert.doesNotMatch(question.choiceExplanationsI18n[lang][distractor], /마지막 운행 시간이 밤 열 시/u);
      assert.doesNotMatch(question.explanationI18n[lang], /지훈\(한빛센터\):/u);
    }
  }
});

test('inference without a blank uses factual support and keeps the actual conclusion', () => {
  const question = bank.present('M01-II-R-47', [2, 3, 0, 1]);
  for (const lang of languages) assert.match(question.explanationI18n[lang], /실제 행동이 어떻게 변했는지를 살펴야 한다/u);
  assert.doesNotMatch(question.explanationI18n.ko, /빈칸/u);
  assert.doesNotMatch(question.explanationI18n.ja, /空欄/u);
  assert.doesNotMatch(question.explanationI18n.en, /blank/u);
  assert.doesNotMatch(question.explanationI18n.zh, /空前|空后|空格/u);
  const blank = bank.present('M01-II-R-28', [0, 1, 2, 3]);
  assert.match(blank.explanationI18n.ja, /空欄前後/u);
  assert.doesNotMatch(blank.explanationI18n.ja, /後ろを「結論」/u);
  assert.match(blank.explanationI18n.ja, /同|동일 품목의 평균 배출량과 함께 표시하는 방식을 생각할 수 있다\./u);
});

test('insertion guidance allows demonstratives to refer to a whole preceding situation', () => {
  const explanation = bank.explain('M01-II-R-18');
  assert.match(explanation.ja, /前の文の内容全体/u);
  assert.doesNotMatch(explanation.ja, /名詞は、必ず前/u);
});

test('presentation structure and passage-wide expressions do not invent an attitude or target idiom', () => {
  const method = bank.explain('M01-II-L-50');
  assert.match(method.ja, /各文の役割/u);
  assert.doesNotMatch(method.ja, /筆者の最終的な態度|容認・批判・代案のどれか/u);
  const expression = bank.explain('M01-II-R-21');
  assert.match(expression.ja, /要約/u);
  assert.doesNotMatch(expression.ja, /その語彙|慣用句全体/u);
});

test('headline and sentence-order methods do not assume a causal story in every source', () => {
  const headline = bank.explain('M03-II-R-27');
  assert.match(headline.ja, /因果関係は見出しに示されている場合だけ/u);
  assert.doesNotMatch(headline.ja, /見出し「[^」]+」の原因と結果/u);
  const order = bank.explain('M01-II-R-13');
  assert.match(order.ja, /説明・根拠・結論のつながり/u);
  assert.doesNotMatch(order.ja, /出来事の開始から変化・結果/u);
  const response = bank.explain('M01-I-L-05');
  assert.match(response.ja, /状況説明/u);
});

test('all bank rows keep localized explanations and stable answers after evidence repairs', () => {
  assert.equal(bank.items.length, 2144);
  let mcq = 0, writing = 0, timedNotices = 0, quotedEvidenceChecked = 0;
  const normalize = value => String(value || '').replace(/(^|\n)\s*(?:[가-힣]{2,8}\([^()\n]{1,40}\)|남자|여자|직원|손님|사회자|학생|교사|A|B)\s*:\s*/gu, '$1').replace(/\s+/gu, ' ').trim();
  for (const item of bank.items) {
    const question = bank.present(item, [2, 0, 3, 1]);
    for (const lang of languages) {
      assert.ok(question.explanationI18n[lang], `${item.id}/${lang}`);
      assert.doesNotMatch(question.explanationI18n[lang], /undefined|\[object Object\]/u);
    }
    if (item.section === 'writing') { writing++; continue; }
    mcq++;
    assert.equal(question.choices[question.answerIndex], item.options[item.answerIndex], item.id);
    assert.equal(new Set(item.options).size, 4, `${item.id} distinct choices`);
    for (const lang of languages) {
      assert.ok(question.explanationI18n[lang].includes(question.choices[question.answerIndex]), `${item.id}/${lang} correct expression`);
      assert.equal(question.choiceExplanationsI18n[lang].length, 4);
      assert.ok(question.choiceExplanationsI18n[lang].every(Boolean));
    }
    if (!item.coach) {
      const source = normalize(item.script || item.passage || item.prompt || item.instruction);
      const answer = question.choices[question.answerIndex];
      const completed = normalize(item.passage || item.prompt).replace(/\(\s*(?:㉠|㉡)?\s*\)/u, answer);
      const reason = question.explanationI18n.ja.split('【ひっかけ分析】')[0];
      for (const match of reason.matchAll(/「([^」]+)」/gu)) {
        const quote = match[1];
        if (!/[가-힣]/u.test(quote)) continue;
        assert.ok([source, completed, answer, normalize(item.prompt)].some(text => text.includes(quote)), `${item.id} quote must come from the source, inserted answer, or actual choice: ${quote}`);
        quotedEvidenceChecked++;
      }
    }
    if (item.itemType === 'notice_mismatch' && !item.coach) {
      const times = item.passage.match(/\d{1,2}:\d{2}/gu) || [];
      if (times.length) timedNotices++;
      for (const time of times) for (const lang of languages) assert.ok(question.explanationI18n[lang].includes(time), `${item.id}/${lang} preserves ${time}`);
    }
  }
  assert.equal(mcq, 2096);
  assert.equal(writing, 48);
  assert.ok(timedNotices > 0);
  assert.ok(quotedEvidenceChecked > 3000);
});

test('dialogue-situation coaching retains the actual request and conditional reply',()=>{
  const question=bank.present('M01-II-L-04',[3,2,1,0]);
  for(const lang of languages){
    assert.match(question.explanationI18n[lang],/수정할 수 있을까요\?/u);
    assert.match(question.explanationI18n[lang],/신분증을 보여 주시면/u);
  }
  assert.match(question.explanationI18n.ja,/依頼・予定・進行・完了/u);
});

test('English coaching does not double the punctuation of Korean answer or evidence quotes',()=>{
  for(const id of ['P01-I-R-24','M01-I-L-18','M01-II-L-04']){
    const question=bank.present(id,[3,2,1,0]);
    assert.doesNotMatch(question.explanationI18n.en,/\.\.[”]/u,id);
    for(const detail of question.choiceExplanationsI18n.en)assert.doesNotMatch(detail,/\.\.[”]/u,id);
  }
});
