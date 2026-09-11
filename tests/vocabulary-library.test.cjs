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
  assert.equal(decks[1].length, 56);
  assert.equal(decks[2].length, 66);
  assert.deepEqual([...new Set(decks[1].map(item => item.type))].sort(), ['expression', 'grammar', 'word']);
  assert.deepEqual([...new Set(decks[2].map(item => item.type))].sort(), ['grammar', 'idiom', 'word']);
  for (const level of [1, 2]) {
    assert.equal(new Set(decks[level].map(item => item.term)).size, decks[level].length, `TOPIK ${level} terms should be unique`);
    assert.ok(decks[level].every(item => item.term && item.example && ['ko', 'ja', 'en', 'zh'].every(lang => item.meaning[lang])));
    assert.ok(decks[level].every(item => ['ko', 'ja', 'en', 'zh'].every(lang => item.explanationI18n[lang])));
    assert.ok(decks[level].every(item => /【意味】[\s\S]*【文脈】[\s\S]*【覚え方】/u.test(item.explanationI18n.ja)||/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u.test(item.explanationI18n.ja)));
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
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【오답 함정】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
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
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【오답 함정】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
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
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【오답 함정】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
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
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【오답 함정】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
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
    assert.match(item.explanationI18n.ko,/【정답 근거】[\s\S]*【오답 함정】[\s\S]*【재사용 풀이】/u);
    assert.match(item.explanationI18n.ja,/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
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
