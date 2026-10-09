const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function harness(seed){
 const storage=new Map(),screen={innerHTML:'',className:'',insertAdjacentHTML(_at,s){this.innerHTML=s+this.innerHTML}};if(seed!==undefined)storage.set('malbitStoryV1',typeof seed==='string'?seed:JSON.stringify(seed));
 const ctx={S:{lang:'ja',view:'home'},console,Date,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))},document:{body:{classList:{remove(){},toggle(){}}},getElementById:()=>screen,querySelector:()=>null},renderShell(){},hideSelection(){},render(){},scrollTo(){}};
 ctx.window=ctx;ctx.setView=view=>{ctx.S.view=view;ctx.render()};vm.createContext(ctx);vm.runInContext(read('data/travel-pack-seoul-001.js'),ctx);ctx.MALBIT_TRAVEL={packs:ctx.MALBIT_TRAVEL_PACKS};vm.runInContext(read('data/travel-adventure-seoul-v1.js'),ctx);vm.runInContext(read('travel-adventure.js'),ctx);
 return {ctx,storage,screen,store:()=>JSON.parse(storage.get('malbitStoryV1')),p:level=>JSON.parse(storage.get('malbitStoryV1')).adventureV1.levels[level]};
}
function ready(c){c.harumalAdventureNextLine();c.harumalAdventureNextLine();c.harumalAdventureNextLine()}
function solve(c,answer){ready(c);c.harumalAdventureChoose(answer);c.harumalAdventureSubmit()}
test('both adventure levels have four original scenes with localized evidence and distinct distractor reasons',()=>{
 const {ctx}=harness(),ids=[];
 for(const [level,scenes] of Object.entries(ctx.HARUMAL_ADVENTURE_DATA.levels)){
  assert.equal(scenes.length,4);
  for(const q of scenes){ids.push(q.id);assert.equal(q.dialogue.length,3);assert.equal(q.choices.length,4);assert.equal(q.traps[q.answer],null);assert.equal(q.traps.filter(Boolean).length,3);assert.ok(q.recall.model.length>10);
   for(const lang of ['ko','ja','en','zh']){for(const t of [q.title,q.clue,q.prompt,q.evidence,q.method,q.recall.prompt,...q.choices,...q.traps.filter(Boolean),...q.dialogue.map(d=>d.text)])assert.ok(t[lang]?.trim(),`${q.id} ${lang}`);assert.equal(new Set(q.traps.filter(Boolean).map(t=>t[lang])).size,3);if(lang!=='ko')assert.notEqual(q.evidence[lang],q.evidence.ko)}
   assert.ok(q.id.startsWith('ADV-'));assert.ok(q.clue.ko.length>20);assert.ok(q.evidence.ko.length>30,level);
  }
 }
 assert.equal(new Set(ids).size,8);
});
test('travel defaults to a scene hub and gates responses on three dialogue turns',()=>{
 const {ctx:c,screen,p}=harness();c.setView('travel');assert.match(screen.innerHTML,/TOPIK I/);assert.match(screen.innerHTML,/TOPIK II/);assert.doesNotMatch(screen.innerHTML,/travelRpg|travelWallet|travelMetrics/);
 c.harumalAdventureStart(1);c.harumalAdventureChoose(2);c.harumalAdventureSubmit();assert.equal(p(1).selected,null);assert.equal(p(1).result,null);
 ready(c);assert.doesNotMatch(screen.innerHTML,/A ticket for one-ten|1時10分の列車の切符/);c.harumalAdventureChoose(1);c.harumalAdventureSubmit();assert.equal(p(1).answers['ADV-I-01'].solved,false);c.harumalAdventureAdvance();assert.equal(p(1).index,0);
 c.harumalAdventureSubmit();assert.equal(p(1).answers['ADV-I-01'].attempts.length,1);assert.match(screen.innerHTML,/15分遅れ/);
 c.harumalAdventureRetry();c.harumalAdventureChoose(2);c.harumalAdventureSubmit();assert.equal(p(1).answers['ADV-I-01'].attempts.length,2);assert.equal(p(1).answers['ADV-I-01'].solved,true);c.harumalAdventureAdvance();assert.equal(p(1).index,1);
});
test('independent levels, reload and repeated actions preserve previous travel and all answer attempts',()=>{
 const legacy={version:1,episodes:{old:{wallet:100,inventory:['ticket'],practice:{saved:true}}},avatar:'blue',metrics:{routeStarts:3}};
 const {ctx:c,store,p}=harness(legacy);c.harumalAdventureStart(1);solve(c,2);c.harumalAdventureAdvance();c.harumalAdventureNextLine();c.harumalAdventureStart(2);solve(c,2);c.harumalAdventureStart(1);assert.equal(p(1).index,1);assert.equal(p(1).turn,1);assert.equal(p(2).index,0);assert.equal(p(2).result,2);
 const restored=harness(store());restored.ctx.harumalAdventureStart(2);assert.equal(restored.p(2).result,2);assert.match(restored.screen.innerHTML,/物語が進みます/);assert.deepEqual(store().episodes,legacy.episodes);assert.deepEqual(store().metrics,legacy.metrics);assert.equal(store().avatar,legacy.avatar);
});
test('all eight answers complete a course and recall stores self-assessment separately from correctness',()=>{
 const {ctx:c,p,screen,store}=harness();
 for(const level of [1,2]){c.harumalAdventureStart(level);for(const q of c.HARUMAL_ADVENTURE_DATA.levels[level]){solve(c,q.answer);c.harumalAdventureAdvance()}assert.equal(p(level).index,4);assert.match(screen.innerHTML,/4\/4/)}
 const before=structuredClone(store().adventureV1.levels[1].answers);c.harumalAdventureReview(1);assert.doesNotMatch(screen.innerHTML,/서울역에 두 시까지 가야 해요\./);c.harumalAdventureDraft('<img src=x onerror=alert(1)>');c.render();assert.match(screen.innerHTML,/&lt;img/);assert.doesNotMatch(screen.innerHTML,/<img src=x/);c.harumalAdventureReveal();assert.match(screen.innerHTML,/서울역에 두 시까지 가야 해요\./);
 c.harumalAdventureRate(false);assert.ok(p(1).recall['ADV-I-01'].nextDueAt>Date.now()+590000);assert.equal(p(1).recall['ADV-I-01'].selfReportedRecall,false);assert.deepEqual(p(1).answers,before);
 c.harumalAdventurePickReview('ADV-I-03');c.harumalAdventureDraft('호텔은 어디예요?');const reload=harness(store());reload.ctx.harumalAdventureReview(1);assert.match(reload.screen.innerHTML,/호텔은 어디예요/);assert.match(reload.screen.innerHTML,/ホテルへ行く出口/);assert.ok(!reload.screen.innerHTML.includes('onerror=alert(1)'));
});
test('unreadable existing storage is never overwritten by starting an adventure',()=>{
 const {ctx:c,storage,screen}=harness('{broken');c.harumalAdventureStart(1);assert.equal(storage.get('malbitStoryV1'),'{broken');c.setView('travel');assert.match(screen.innerHTML,/上書きしていません/);
});

test('importing a pre-adventure travel backup retains the newer adventure record',()=>{
 const {ctx:c,store}=harness();c.harumalAdventureStart(1);solve(c,2);const progress=store().adventureV1;const restored=JSON.parse(c.HARUMAL_ADVENTURE.mergeImport(JSON.stringify({version:1,episodes:{old:{wallet:4}}})));assert.deepEqual(restored.adventureV1,progress);assert.equal(restored.episodes.old.wallet,4);
 const supplied={version:1,activeLevel:2,levels:{}};assert.deepEqual(JSON.parse(c.HARUMAL_ADVENTURE.mergeImport(JSON.stringify({version:1,episodes:{},adventureV1:supplied}))).adventureV1,supplied);
});


test('scene Back calls the actual travel route, not a bottom-tab-only dispatcher',()=>{
 const {ctx:c,screen,p}=harness();c.harumalAdventureStart(1);const saved=JSON.stringify(p(1));
 assert.match(screen.innerHTML,/onclick="setView\('travel'\)"/);assert.doesNotMatch(screen.innerHTML,/harumalGo\('travel'\)/);
 c.setView('travel');assert.equal(c.S.view,'travel');assert.match(screen.innerHTML,/TOPIK I/);assert.equal(JSON.stringify(p(1)),saved);
});
