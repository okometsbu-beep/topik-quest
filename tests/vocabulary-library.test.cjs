const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/shorts-levels.js'), 'utf8'), context);

test('TOPIK study library is complete, multilingual, and organized by level', () => {
  const decks = context.window.MALBIT_SHORTS_DECKS;
  assert.equal(decks[1].length, 116);
  assert.equal(decks[2].length, 130);
  assert.deepEqual([...new Set(decks[1].map(item => item.type))].sort(), ['expression', 'grammar', 'word']);
  assert.deepEqual([...new Set(decks[2].map(item => item.type))].sort(), ['grammar', 'idiom', 'word']);
  for (const level of [1, 2]) {
    assert.equal(new Set(decks[level].map(item => item.term)).size, decks[level].length, `TOPIK ${level} terms should be unique`);
    assert.ok(decks[level].every(item => item.term && item.example && ['ko', 'ja', 'en', 'zh'].every(lang => item.meaning[lang])));
    assert.ok(decks[level].every(item => ['ko', 'ja', 'en', 'zh'].every(lang => item.explanationI18n[lang])));
    assert.ok(decks[level].every(item => /【意味】[\s\S]*【文脈】[\s\S]*【覚え方】/u.test(item.explanationI18n.ja)||/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u.test(item.explanationI18n.ja)));
  }
});

test('S04 time-adverb Shorts have stable IDs and reviewed fixed feedback in every language', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-TIME-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['벌써','아직','방금','곧']);
  for(const item of rows){
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II connector Shorts make one reviewed relation judgment in every language', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-W-LINK-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['따라서','반면에','게다가','다만']);
  for(const item of rows){
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II cause-concession Shorts separate result value and reality in every language', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-CAUSE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-(으)ㄴ 탓에','-(으)ㄴ 덕분에','-는데도','-(으)ㄹ지라도']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II inference-evidence Shorts separate clues, possibility, certainty, and intention in every language', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-INFER-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-나 보다','-(으)ㄹ지도 모르다','-(으)ㄹ 것이 틀림없다','-(으)ㄹ 테니']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II reported-speech Shorts separate statements, questions, commands, and suggestions in every language', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-REPORT-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-다고 하다','-냐고 하다','-(으)라고 하다','-자고 하다']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I location Shorts separate opposite, beside, between, and nearby in every language', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-PLACE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['건너편','옆','사이','근처']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I frequency Shorts separate every time, often, sometimes, and zero with a negative', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-FREQ-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['항상','자주','가끔','전혀']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I counter Shorts separate people, objects, bottles, and books in every language', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-COUNT-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['명','개','병','권']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I question-word Shorts separate people, places, times, and prices', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-QUESTION-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['누구','어디','언제','얼마']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I particle Shorts separate destination, action place, means, and recipient', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-G-PARTICLE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['에','에서','(으)로','에게']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I demonstrative Shorts separate speaker, listener, distance, and selection', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-DEMONSTRATIVE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['이것','그것','저것','어느 것']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I basic-tense Shorts separate present habit, completed past, current progress, and future plan', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-G-TENSE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-아/어요','-았/었어요','-고 있어요','-(으)ㄹ 거예요']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I polite-interaction Shorts separate item request, action request, prohibition, and suggestion', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-G-INTERACTION-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['주세요','-(으)세요','-지 마세요','-(으)ㄹ까요?']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I basic-negation Shorts separate simple negation, inability, noun identity, and absence', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-G-NEGATION-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['안','못','아니에요','없어요']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I basic-connective Shorts separate simultaneity, reason, movement purpose, and background', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-G-CONNECTIVE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-(으)면서','-(으)니까','-(으)러','-는데']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II state-change Shorts separate circumstance, quality, progress, and result state', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-STATE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-게 되다','-아/어지다','-고 있다','-아/어 있다']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II condition Shorts separate event, necessary, hypothetical, and warning conditions', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-COND-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-거든','-아/어야만','-(으)ㄴ/는다면','-다가는']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II completion-experience Shorts separate completion, long-process result, experience, and preparation', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-COMPLETE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-아/어 버리다','-(으)ㄴ 끝에','-아/어 본 적이 있다','-아/어 놓다']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II judgment-constraint Shorts separate no alternative, worth, need, and no need', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-JUDGMENT-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-(으)ㄹ 수밖에 없다','-(으)ㄹ 만하다','-(으)ㄹ 필요가 있다','-(으)ㄹ 필요가 없다']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II plan-stage Shorts separate intention, decision, consideration, and fixed schedule', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-PLAN-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-(으)ㄹ 생각이다','-기로 하다','-(으)ㄹ까 하다','-(으)ㄹ 예정이다']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II time-relation Shorts separate immediate, completed, overlapping, and prior actions', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-TIME-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-자마자','-고 나서','-는 동안','-기 전에']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II formal-relation Shorts separate source, standard, channel, and passive agent', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-RELATION-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-에 따르면','-에 따라(서)','-을/를 통해(서)','-에 의해(서)']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II degree-comparison Shorts separate baseline, no-less degree, equality, and result extent', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-DEGREE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-에 비해(서)','-에 못지않게','-만큼','-(으)ㄹ 정도로']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II scope-relation Shorts separate exclusion, substitution, irrelevance, and representative inclusion', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-G-SCOPE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['-을/를 제외하고','-을/를 대신해(서)','-에 관계없이','-을/를 비롯해(서)']);
  for(const item of rows){
    assert.equal(item.type,'grammar');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II stance-adverb Shorts separate narrow success, alternative, emphatic negation, and missed timing', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-W-STANCE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['간신히','차라리','도무지','미처']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II change-adverb Shorts separate gradual, temporary, continuous, and sharp change', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-W-CHANGE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['점차','일시적으로','지속적으로','급격히']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II analysis-noun Shorts separate tendency, factor, phenomenon, and outlook', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-W-ANALYSIS-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['경향','요인','현상','전망']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II argument-noun Shorts separate claim, evidence, rebuttal, and conclusion', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-W-ARGUMENT-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['주장','근거','반박','결론']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I wearing-action Shorts separate clothes, footwear, headwear, and gloves', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-WEAR-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['입다','신다','쓰다','끼다']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I transit-action Shorts separate boarding, exiting, transferring, and crossing', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-TRANSIT-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['타다','내리다','갈아타다','건너다']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I housework-action Shorts separate room, laundry, dishes, and cooking tasks', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-HOUSEWORK-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['청소하다','빨래하다','설거지하다','요리하다']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I directional-action Shorts separate vertical and inside/outside movement', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-DIRECTION-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['올라가다','내려가다','들어가다','나오다']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I object-action Shorts separate finding, losing, bringing, and taking', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-OBJECT-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['찾다','잃어버리다','가져오다','가져가다']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK I morning-routine Shorts separate getting up, washing, changing, and preparing', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.id?.startsWith('S04-I-W-ROUTINE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['일어나다','씻다','갈아입다','준비하다']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II policy-review nouns separate measures, effects, limitations, and future tasks', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-W-POLICY-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['대책','효과','한계','과제']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('S04 TOPIK II scale-state nouns separate expansion, reduction, maintenance, and suspension', () => {
  const rows=context.window.MALBIT_SHORTS_DECKS[2].filter(item=>item.id?.startsWith('S04-II-W-SCALE-'));
  assert.equal(rows.length,4);
  assert.deepEqual(Array.from(rows,item=>item.term),['확대','축소','유지','중단']);
  for(const item of rows){
    assert.equal(item.type,'word');
    assert.equal(item.shortsFastReview,true);
    assert.equal(item.shortChoices.length,4);
    assert.equal(item.shortChoices[item.answerIndex].meaning.ko,item.meaning.ko);
    for(const lang of ['ko','ja','en','zh']){
      assert.ok(item.exampleI18n[lang],`${item.id} must ship a reviewed ${lang} example translation`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.id} must have four distinct ${lang} choices`);
      assert.ok(item.shortChoices.every(choice=>choice.explanationI18n[lang]),`${item.id} must explain each ${lang} choice`);
      assert.ok(item.coach[lang].short,`${item.id} must have concise ${lang} feedback`);
    }
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【선택지 비교】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【選択肢の比較】[\s\S]*【再利用できる解き方】/u);
  }
});

test('reviewed Shorts example translations bypass the network translator', () => {
  const source=fs.readFileSync(path.join(root,'product-polish.js'),'utf8');
  assert.match(source,/const reviewed=item\.exampleI18n\?\.\[S\.lang\]/);
  assert.match(source,/if\(reviewed\)\{node\.textContent=reviewed;return\}/);
});

test('vocabulary screen exposes manual entry, search, filters, and save actions', () => {
  const source = fs.readFileSync(path.join(root, 'learning-features.js'), 'utf8');
  for (const handler of ['malbitAddManualVocab', 'malbitAddLibraryVocab', 'malbitSearchVocabLibrary', 'malbitSetVocabLibraryLevel', 'malbitSetVocabLibraryType']) {
    assert.match(source, new RegExp(`window\\.${handler}`));
  }
  assert.match(source, /TOPIK STUDY LIBRARY/);
  assert.match(source, /tqManualVocabTerm/);
  assert.match(source, /manual_vocab_v33/);
  assert.match(source, /translateCached\(`manual_vocab_v33_/);
  assert.match(source, /VOCAB_GROWTH_THRESHOLDS=\[0,1,3,6,10,16,24,35,50,75\]/);
  assert.match(source, /vocabGrowthSvg/);
  assert.match(source, /window\.malbitLearningVocabPage/);
  assert.match(source, /window\.malbitPracticeVocabLibrary/);
  assert.doesNotMatch(source, /class="tqLongPressDiscovery"/);
});

test('all 143 lexical Shorts show Japanese equivalents before plain-language glosses', () => {
  const rows=Object.values(context.window.MALBIT_SHORTS_DECKS).flat().filter(item=>item.type!=='grammar');
  assert.equal(rows.length,143);
  for(const item of rows){
    assert.match(item.meaning.ja,/^[^（）]+（[^（）]+）$/u,item.term);
    assert.doesNotMatch(item.meaning.ja,/[가-힣]/u,`${item.term}: choices must not reveal the Korean answer`);
    if(item.shortChoices) for(const choice of item.shortChoices) assert.match(choice.meaning.ja,/^[^（）]+（[^（）]+）$/u,item.term);
  }
  const rowsByTerm=Object.fromEntries(rows.map(item=>[item.term,item]));
  assert.equal(rowsByTerm['중단'].meaning.ja,'中断（続けていたことを途中でやめること）');
  assert.match(rowsByTerm['발이 넓다'].meaning.ja,/^顔が広い（/u);
  assert.match(rowsByTerm['반박'].meaning.ja,/^反論（/u);
});

test('all 144 fixed-choice Shorts explain the visible term before explicitly labelled examples', () => {
  const rows=Object.values(context.window.MALBIT_SHORTS_DECKS).flat().filter(item=>item.shortChoices);
  assert.equal(rows.length,144);
  const headers={ko:'【예문 속 쓰임】',ja:'【例文での使い方】',en:'[Example usage]',zh:'【例句中的用法】'};
  for(const item of rows){
    for(const lang of ['ko','ja','en','zh']){
      assert.equal(item.shortChoices[item.answerIndex].meaning[lang],item.meaning[lang],`${item.term}: ${lang} answer alignment`);
      assert.equal(item.coach[lang].short,item.shortChoices[item.answerIndex].explanationI18n[lang],`${item.term}: immediate feedback must define the term, not assume a hidden scene`);
      const detail=item.explanationI18n[lang];
      assert.ok(detail.indexOf(item.coach[lang].short)<detail.indexOf(headers[lang]),`${item.term}: definition before example`);
      assert.ok(detail.includes(headers[lang]+(lang==='en'?' ':'')+item.example),`${item.term}: Korean example shown with label`);
      assert.ok(detail.includes(item.exampleI18n[lang]),`${item.term}: translated example available`);
      assert.equal(new Set(item.shortChoices.map(choice=>choice.meaning[lang])).size,4,`${item.term}: distinct choices`);
    }
  }
  const suspension=rows.find(item=>item.term==='중단');
  assert.doesNotMatch(suspension.coach.ja.short,/雨|屋外/u);
  assert.doesNotMatch(suspension.coach.ko.short,/비 때문에|야외/u);
  assert.match(suspension.explanationI18n.ja,/【選択肢の比較】/u);
});

test('reviewed grammar explanations preserve clause direction and avoid false semantic restrictions', () => {
  const rows=Object.values(context.window.MALBIT_SHORTS_DECKS).flat();
  const degree=rows.find(item=>item.term==='-(으)ㄹ 정도로');
  assert.match(degree.coach.ko.short,/앞절에 정도를 보여 주는 기준/u);
  assert.match(degree.coach.ja.short,/前の節を程度の目安/u);
  assert.doesNotMatch(degree.meaning.en,/extreme/u);
  assert.doesNotMatch(degree.meaning.ja,/非常に/u);
  assert.match(rows.find(item=>item.term==='-는데도').meaning.ja,/予想に反する/u);
  assert.doesNotMatch(rows.find(item=>item.term==='-(으)ㄹ 생각이다').meaning.ja,/まだ確定していない/u);
  assert.match(rows.find(item=>item.term==='-는 대신에').example,/타는 대신에/u);
});

test('dynamic vocabulary choices exclude overlapping change/exchange meanings without changing the answer slot', () => {
  const source=fs.readFileSync(path.join(root,'topik1.js'),'utf8');
  const snippet=source.slice(source.indexOf('function shortsOptions('),source.indexOf('\nfunction shortType('));
  const deck=context.window.MALBIT_SHORTS_DECKS[1].filter(item=>item.type!=='grammar');
  const runtime={SH:{activeLevel:1},shortsDeck:()=>deck,level:()=>1};vm.createContext(runtime);vm.runInContext(snippet,runtime);
  for(const [term,excluded] of [['바꾸다','교환하다'],['교환하다','바꾸다']]){
    const index=deck.findIndex(item=>item.term===term),options=runtime.shortsOptions(index,1);
    assert.equal(options.items.length,4);assert.equal(options.correct,(index*3+1)%4);
    assert.equal(options.items[options.correct].term,term);
    assert.ok(!options.items.some(item=>item.term===excluded));
    assert.equal(new Set(options.items.map(item=>item.term)).size,4);
  }
});
