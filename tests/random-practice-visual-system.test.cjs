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
});
