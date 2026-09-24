const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

function translationPolicy(){
  const context={window:{}};require('node:vm').runInNewContext(read('random-practice-translation.js'),context);
  return context.window.MALBIT_RANDOM_TRANSLATION;
}

test('Random Practice has one final visual owner for TOPIK I and II',()=>{
  const bootstrap=read('site-patch.js'),visual=read('random-practice-visual-system.js');
  assert.ok(bootstrap.indexOf("'random-practice-visual-system.js'")>bootstrap.indexOf("'shorts-visual-system.js'"));
  assert.ok(bootstrap.indexOf("'random-practice-visual-system.js'")<bootstrap.indexOf("'vocab-editor.js'"));
  assert.match(visual,/style\.id='malbitRandomPracticeVisualSystem'/);
  assert.match(visual,/view==='infinity'/);
  assert.match(visual,/view==='t1quiz'/);
  assert.match(visual,/storedSession\(\)\?\.mode==='random'/);
  assert.match(visual,/new MutationObserver\(sync\)/);
  for(const token of ['--ui-space-2','--ui-touch','--ui-radius-card','--ui-surface','--ui-border','--ui-ink'])assert.match(visual,new RegExp(`var\\(${token}\\)`));
  assert.match(visual,/--random-canvas:var\(--ui-canvas\)/);
  assert.match(visual,/html\[data-theme="light"\] body\.tq-random-practice-active/);
  assert.match(visual,/\.choice\{[^}]*background:var\(--random-surface-raised\)/);
});

test('Random Practice contract keeps readable learning surfaces and coaching',()=>{
  const visual=read('random-practice-visual-system.js'),feedback=read('app-polish-v24.js');
  const sizes=[...visual.matchAll(/font-size:(\d+)px/g)].map(match=>Number(match[1]));
  assert.ok(sizes.length>0);
  assert.ok(sizes.every(size=>size>=10),`Random Practice visual system contains sub-10px text: ${sizes.filter(size=>size<10)}`);
  assert.equal((visual.match(/!important/g)||[]).length,8,'Random Practice compatibility bridge must stay fixed');
  assert.match(visual,/\.tqRandomPracticeScreen button:not\(:disabled\)\{min-height:var\(--ui-touch\)\}/);
  assert.match(visual,/\.choice\{[^}]*min-height:52px/);
  assert.match(visual,/\.t1TutorCoach small\{font-size:10px/);
  assert.match(visual,/\.tqInlineExplanation p[^}]*white-space:pre-line/);
  assert.match(visual,/\.malbitExplanationToggle\{[^}]*min-height:48px/);
  assert.match(feedback,/x\?\.bankId&&window\.MALBIT_BANK\?window\.MALBIT_BANK\.present\(x\.bankId,x\.choiceOrder\)/);
  assert.match(feedback,/tutorCoach=strip\.querySelector\('\.t1TutorCoach'\)/);
  assert.match(feedback,/if\(tutorCoach\)strip\.appendChild\(tutorCoach\)/);
});

test('Random Practice never presents a Korean source fallback as a translation',async()=>{
  const policy=translationPolicy(),source='다음을 읽고 무엇에 대한 글인지 고르십시오.\n\n공사 중입니다. 오른쪽 출입구를 이용해 주세요.';
  const failed=await policy.resolve({source,target:'ja',translate:async value=>value});
  assert.equal(failed.status,'unavailable');
  assert.match(failed.text,/全文翻訳は現在利用できません/u);
  assert.notEqual(failed.text,source);
  const reviewed=await policy.resolve({source,target:'ja',reviewed:'工事中です。右側の出入口をご利用ください。'});
  assert.deepEqual({...reviewed},{status:'reviewed',text:'工事中です。右側の出入口をご利用ください。'});
  const automatic=await policy.resolve({source,target:'ja',translate:async()=> '次の文を読んでください。'});
  assert.deepEqual({...automatic},{status:'automatic',text:'次の文を読んでください。'});
  assert.equal(policy.usable(source,'공사 중입니다。','ja'),false,'Hangul-only fallback with changed punctuation is still unavailable');
  const falseReview=await policy.resolve({source,target:'ja',reviewed:source});
  assert.equal(falseReview.status,'unavailable','A reviewed label must not bypass source-echo rejection');
  const original=await policy.resolve({source,target:'ko'});
  assert.equal(original.status,'original');
  assert.equal(original.text,source);
});

test('all foreign-language translation paths reject punctuation and Unicode source echoes',async()=>{
  const policy=translationPolicy(),source='교통카드를 찍으세요.';
  const echoes=['교통카드를 찍으세요!','교통카드를\n찍으세요。',source.normalize('NFD'),'교통카드를\u200b 찍으세요.'];
  for(const target of ['ja','en','zh'])for(const value of echoes){
    assert.equal((await policy.resolve({source,target,reviewed:value})).status,'unavailable',`${target} reviewed echo: ${JSON.stringify(value)}`);
    assert.equal((await policy.resolve({source,target,translate:async()=>value})).status,'unavailable',`${target} automatic echo: ${JSON.stringify(value)}`);
  }
});

test('source-echo rejection preserves real translations and recovery without translating Korean',async()=>{
  const policy=translationPolicy(),source='교통카드를 찍으세요.';
  const translations={ja:'交通カードをタッチしてください。',en:'Tap your transit card.',zh:'请刷交通卡。'};
  for(const [target,value] of Object.entries(translations)){
    assert.equal((await policy.resolve({source,target,reviewed:value})).status,'reviewed');
    const recovered=await policy.resolve({source,target,reviewed:source+'!',translate:async()=>value});
    assert.equal(recovered.status,'automatic');
    assert.equal(recovered.text,value);
    assert.equal((await policy.resolve({source,target,translate:async()=>{throw new Error('offline')}})).status,'unavailable');
  }
  let calls=0;
  const original=await policy.resolve({source,target:'ko',translate:async()=>{calls++;return 'unexpected'}});
  assert.equal(original.status,'original');assert.equal(original.text,source);assert.equal(calls,0);
  assert.equal(policy.usable('교통카드를 찍으세요.','“찍다” means to tap here.','en'),true,'Korean quotations in a translation must remain valid');
});


test('reported preparation-item translations preserve grammatical meaning and shuffled option alignment',async()=>{
  const context={window:{}};require('node:vm').runInNewContext(read('data/explanations-i18n.js'),context);
  const policy=translationPolicy(),question={choices:['바람에','뿐더러','듯이','것에 대비해']};
  for(const id of ['M04-II-R-02','M05-II-R-01','M10-II-R-02','M11-II-R-01'])for(const lang of ['ja','en','zh']){
    const translation=context.window.MALBIT_EXPLANATIONS.bankCoach[id][lang].translation;
    const text=policy.formatReviewedQuestion(question,translation);
    assert.ok(text.includes(translation.sentence));
    question.choices.forEach((choice,index)=>assert.ok(text.includes(`${index+1}. ${choice} — ${translation.glosses[choice]}`)));
    assert.doesNotMatch(text,/風の中|in the wind|风中/u);
    let calls=0;const resolved=await policy.resolve({source:'회의가 길어질 ( ) 미리 필요한 자료를 모두 준비해 두었다.',target:lang,reviewed:text,translate:async()=>{calls++;throw new Error('must use the authored context')}});
    assert.equal(resolved.status,'reviewed');assert.equal(calls,0);
    assert.equal(policy.formatReviewedQuestion({choices:['unmapped']},translation),'','incomplete mappings must not invent glosses');
  }
});
