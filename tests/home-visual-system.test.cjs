const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('Home has one final visual owner built on semantic UI tokens',()=>{
  const bootstrap=read('site-patch.js'),visual=read('home-visual-system.js');
  assert.ok(bootstrap.indexOf("'home-visual-system.js'")>bootstrap.indexOf("'game-visual-system.js'"));
  assert.ok(bootstrap.indexOf("'home-visual-system.js'")<bootstrap.indexOf("'vocab-editor.js'"));
  assert.match(visual,/style\.id='malbitHomeVisualSystem'/);
  for(const token of ['--ui-space-2','--ui-touch','--ui-radius-card','--ui-surface','--ui-border','--ui-ink'])assert.match(visual,new RegExp(`var\\(${token}\\)`));
  assert.match(visual,/\.tqV9Mode\{[^}]*background:var\(--home-surface\)/);
  assert.match(visual,/\.tqV9Week\{[^}]*background:var\(--home-surface\)/);
  assert.match(visual,/--home-canvas:var\(--ui-canvas\)/);
  assert.match(visual,/html\[data-theme="light"\] body\.tq-home-active/);
  assert.match(visual,/\.bottom\{[^}]*background:color-mix\(in srgb,var\(--home-canvas\) 96%,transparent\)/);
});

test('Home visual contract keeps readable copy and a fixed compatibility bridge',()=>{
  const visual=read('home-visual-system.js');
  const sizes=[...visual.matchAll(/font-size:(\d+)px/g)].map(match=>Number(match[1]));
  assert.ok(sizes.length>0);
  assert.ok(sizes.every(size=>size>=10),`Home visual system contains sub-10px text: ${sizes.filter(size=>size<10)}`);
  assert.doesNotMatch(visual,/position:absolute/);
  assert.equal((visual.match(/!important/g)||[]).length,7,'Home compatibility bridge must stay fixed');
  assert.match(visual,/\.tqHomeScreen button\{min-height:var\(--ui-touch\)\}/);
  assert.match(visual,/\.tqV9Mode small\{[^}]*font-size:10px/);
  assert.match(visual,/\.tqV9Utility small\{font-size:10px/);
});
