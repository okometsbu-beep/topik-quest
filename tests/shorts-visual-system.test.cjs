const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('Shorts has one final visual owner built on semantic UI tokens',()=>{
  const bootstrap=read('site-patch.js'),visual=read('shorts-visual-system.js');
  assert.ok(bootstrap.indexOf("'shorts-visual-system.js'")>bootstrap.indexOf("'home-visual-system.js'"));
  assert.ok(bootstrap.indexOf("'shorts-visual-system.js'")<bootstrap.indexOf("'vocab-editor.js'"));
  assert.match(visual,/style\.id='malbitShortsVisualSystem'/);
  for(const token of ['--ui-space-2','--ui-touch','--ui-radius-card','--ui-surface','--ui-border','--ui-ink'])assert.match(visual,new RegExp(`var\\(${token}\\)`));
  assert.match(visual,/\.shortsCard\{[^}]*background:var\(--shorts-surface\)/);
  assert.match(visual,/\.shortsChoice\{[^}]*min-height:52px/);
  assert.match(visual,/\.shortsFeedback small\{[^}]*font-size:11px/);
  assert.match(visual,/--shorts-canvas:var\(--ui-canvas\)/);
  assert.match(visual,/html\[data-theme="light"\] body\.tq-shorts-active/);
  assert.match(visual,/\.shortsChoice\{[^}]*background:var\(--shorts-surface-raised\)/);
});

test('Shorts visual contract keeps readable copy and a fixed compatibility bridge',()=>{
  const visual=read('shorts-visual-system.js');
  const sizes=[...visual.matchAll(/font-size:(\d+)px/g)].map(match=>Number(match[1]));
  assert.ok(sizes.length>0);
  assert.ok(sizes.every(size=>size>=10),`Shorts visual system contains sub-10px text: ${sizes.filter(size=>size<10)}`);
  assert.equal((visual.match(/!important/g)||[]).length,3,'Shorts compatibility bridge must stay fixed');
  assert.match(visual,/\.tqShortsScreen button\{min-height:var\(--ui-touch\)\}/);
  assert.match(visual,/\.malbitShortTools button\{[^}]*min-height:var\(--ui-touch\)/);
  assert.match(visual,/\.malbitShortProposal>button\{[^}]*min-height:var\(--ui-touch\)/);
  assert.match(visual,/\.shortsFeedback small\{[^}]*white-space:pre-line/);
});
