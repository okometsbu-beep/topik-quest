const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('Game Mode has one final visual owner and semantic UI tokens',()=>{
  const bootstrap=read('site-patch.js'),styles=read('styles.css'),visual=read('game-visual-system.js');
  assert.ok(bootstrap.indexOf("'game-visual-system.js'")>bootstrap.indexOf("'app-polish-v35.js'"));
  assert.ok(bootstrap.indexOf("'game-visual-system.js'")<bootstrap.indexOf("'vocab-editor.js'"));
  assert.match(visual,/style\.id='malbitGameVisualSystem'/);
  for(const token of ['--ui-space-1','--ui-touch','--ui-font-caption','--ui-page-pad','--ui-surface','--ui-ink','--ui-accent'])assert.match(styles,new RegExp(token));
  assert.match(visual,/--game-surface:var\(--ui-surface\)/);
  assert.match(visual,/\.t1GameGear[\s\S]*background:var\(--game-surface\)/);
  assert.match(visual,/\.tqGameStage[\s\S]*background:#e5ebf3/);
  assert.match(visual,/\.t1TrailNode[\s\S]*background:#e9f2f8/);
});

test('Game visual contract keeps readable copy and a fixed legacy bridge',()=>{
  const visual=read('game-visual-system.js');
  const sizes=[...visual.matchAll(/font-size:(\d+)px/g)].map(match=>Number(match[1]));
  assert.ok(sizes.length>0);
  assert.ok(sizes.every(size=>size>=10),`Game visual system contains sub-10px text: ${sizes.filter(size=>size<10)}`);
  assert.doesNotMatch(visual,/position:absolute/);
  assert.equal((visual.match(/!important/g)||[]).length,17,'legacy bridge must not grow without deliberate consolidation');
  assert.match(visual,/\.t1GameGear small\{[^}]*font-size:10px/);
  assert.match(visual,/\.t1RunRule\{[^}]*font-size:10px/);
  assert.match(visual,/\.t1RarityLegend span\{[^}]*font-size:10px/);
  assert.match(visual,/\.t1RunSlot small\{[^}]*font-size:10px/);
});
