const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('Random Practice has one final visual owner for TOPIK I and II',()=>{
  const bootstrap=read('site-patch.js'),visual=read('random-practice-visual-system.js');
  assert.ok(bootstrap.indexOf("'random-practice-visual-system.js'")>bootstrap.indexOf("'shorts-visual-system.js'"));
  assert.ok(bootstrap.indexOf("'random-practice-visual-system.js'")<bootstrap.indexOf("'vocab-editor.js'"));
  assert.match(visual,/style\.id='malbitRandomPracticeVisualSystem'/);
  assert.match(visual,/view==='infinity'/);
  assert.match(visual,/view==='t1quiz'/);
  assert.match(visual,/storedSession\(\)\?\.mode==='random'/);
  for(const token of ['--ui-space-2','--ui-touch','--ui-radius-card','--ui-surface','--ui-border','--ui-ink'])assert.match(visual,new RegExp(`var\\(${token}\\)`));
});

test('Random Practice contract keeps readable learning surfaces and coaching',()=>{
  const visual=read('random-practice-visual-system.js');
  const sizes=[...visual.matchAll(/font-size:(\d+)px/g)].map(match=>Number(match[1]));
  assert.ok(sizes.length>0);
  assert.ok(sizes.every(size=>size>=10),`Random Practice visual system contains sub-10px text: ${sizes.filter(size=>size<10)}`);
  assert.equal((visual.match(/!important/g)||[]).length,8,'Random Practice compatibility bridge must stay fixed');
  assert.match(visual,/\.tqRandomPracticeScreen button:not\(:disabled\)\{min-height:var\(--ui-touch\)\}/);
  assert.match(visual,/\.choice\{[^}]*min-height:52px/);
  assert.match(visual,/\.t1TutorCoach small\{font-size:10px/);
  assert.match(visual,/\.tqInlineExplanation p[^}]*white-space:pre-line/);
  assert.match(visual,/\.malbitExplanationToggle\{[^}]*min-height:48px/);
});
