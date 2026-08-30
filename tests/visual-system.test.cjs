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
  for(const token of ['--ui-space-1','--ui-touch','--ui-font-caption','--ui-page-pad','--ui-canvas','--ui-surface','--ui-surface-raised','--ui-ink','--ui-accent','--ui-success-soft','--ui-shadow'])assert.match(styles,new RegExp(token));
  assert.match(visual,/--game-surface:var\(--ui-surface\)/);
  assert.match(visual,/\.t1GameGear[\s\S]*background:var\(--game-surface\)/);
  assert.match(visual,/\.tqGameStage[\s\S]*background:var\(--game-stage\)/);
  assert.match(visual,/\.t1TrailNode[\s\S]*background:var\(--game-node\)/);
  assert.match(visual,/html\[data-theme="light"\] body\.tq-game-active/);
});

test('shared learning surfaces resolve to complete dark and light themes',()=>{
  const styles=read('styles.css');
  assert.match(styles,/html\[data-theme="dark"\]\{[^}]*--ui-canvas:#071321[^}]*--ui-surface:#0e2037[^}]*--ui-ink:#f4f8ff/);
  assert.match(styles,/html\[data-theme="light"\]\{[^}]*--ui-canvas:#edf3fa[^}]*--ui-surface:#fff[^}]*--ui-ink:#18273d/);
  assert.match(styles,/html\[data-theme="dark"\] \.card[^}]*background:var\(--ui-surface\)/);
  for(const [file,prefix] of [['home-visual-system.js','home'],['game-visual-system.js','game'],['shorts-visual-system.js','shorts'],['random-practice-visual-system.js','random'],['review-visual-system.js','review']]){
    const visual=read(file);
    assert.match(visual,new RegExp(`--${prefix}-canvas:var\\(--ui-canvas\\)`));
  }
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
  assert.match(visual,/\.t1TrailScreen button:not\(\.t1TrailNode\)\{min-height:var\(--ui-touch\)\}/);
  assert.match(visual,/\.t1TrailSceneCopy b\{color:#fff/);
  assert.match(visual,/\.malbitMapTools\{[^}]*background:color-mix\(in srgb,var\(--game-surface-raised\) 96%,transparent\)/);
});
