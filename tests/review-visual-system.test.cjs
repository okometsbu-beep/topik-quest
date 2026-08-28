const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('Review has one final visual owner for queue and retry surfaces',()=>{
  const bootstrap=read('site-patch.js'),visual=read('review-visual-system.js'),features=read('learning-features.js');
  assert.ok(bootstrap.indexOf("'review-visual-system.js'")>bootstrap.indexOf("'random-practice-visual-system.js'"));
  assert.ok(bootstrap.indexOf("'review-visual-system.js'")<bootstrap.indexOf("'vocab-editor.js'"));
  assert.match(visual,/style\.id='malbitReviewVisualSystem'/);
  assert.match(visual,/S\?\.view==='review'/);
  assert.match(visual,/tqReviewRetrySheet/);
  assert.match(visual,/new MutationObserver\(sync\)/);
  assert.match(features,/let reviewFilter='all'/);
  assert.match(features,/class="tqReviewFilters"/);
  for(const token of ['--ui-space-2','--ui-touch','--ui-radius-card','--ui-surface','--ui-border','--ui-ink'])assert.match(visual,new RegExp(`var\\(${token}\\)`));
});

test('Review contract keeps readable bright surfaces and a fixed compatibility bridge',()=>{
  const visual=read('review-visual-system.js');
  const sizes=[...visual.matchAll(/font-size:(\d+)px/g)].map(match=>Number(match[1]));
  assert.ok(sizes.length>0);
  assert.ok(sizes.every(size=>size>=10),`Review visual system contains sub-10px text: ${sizes.filter(size=>size<10)}`);
  assert.equal((visual.match(/!important/g)||[]).length,31,'Review compatibility bridge must stay fixed');
  assert.match(visual,/\.tqReviewScreen button:not\(:disabled\)[^}]*min-height:var\(--ui-touch\)/);
  assert.match(visual,/\.tqReviewFilters\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(visual,/\.tqReviewChoices \.choice\{[^}]*min-height:52px/);
  assert.match(visual,/\.tqReviewDeep p\{[^}]*white-space:pre-line/);
  assert.match(visual,/\.tqReviewChoiceAnalysis span\{[^}]*font-size:10px/);
});
