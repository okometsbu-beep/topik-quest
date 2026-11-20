// S01–S06 each run a full unit: form practice → mixed → variation → correction → expansion →
// independent → delayed. They stay outside the S07 guided stage order and keep their own storage.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
const STAGES=['form','mixed','variation','correction','expansion','independent','delayed'];
const NODES=['S01','S02','S03','S04','S05','S06'];
function boot(lang='ko'){
  const values=new Map(),storage={getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const screen={className:'',dataset:{},innerHTML:'',querySelector:()=>null};
  const c={console,Date,localStorage:storage,S:{view:'learn',lang},document:{body:{classList:{add(){},remove(){}}},getElementById:id=>id==='screen'?screen:null,querySelector:()=>null,addEventListener(){}},history:{state:null,pushState(){},replaceState(){}},requestAnimationFrame:fn=>fn(),scrollTo(){},renderShell(){},hideSelection(){},setView(v){c.S.view=v;c.render()},render(){screen.innerHTML=''}};
  c.window=c;vm.createContext(c);
  for(const file of ['data/writing-curriculum.js','data/writing-curriculum-locales.js','writing-curriculum-i18n.js','writing-curriculum-engine.js','writing-curriculum.js'])vm.runInContext(read(file),c);
  return {c,screen,data:c.HARUMAL_WRITING_DATA,engine:c.HARUMAL_WRITING.engine};
}
test('each foundation node runs the seven-stage unit with practice and independent evidence',()=>{
  const {data}=boot();
  for(const id of NODES){
    const node=data.nodes.find(node=>node.id===id);
    assert.equal(node.status,'partial',id+' is open for practice');
    const groups=data.groups.filter(group=>group.nodeId===id);
    assert.deepEqual(Array.from(groups,group=>group.stage),STAGES,id+' keeps the unit stage order');
    assert.deepEqual(Array.from(node.availableGroupIds),Array.from(groups,group=>group.id),id+' exposes every stage');
    const items=data.items.filter(item=>groups.some(group=>group.itemIds.includes(item.id)));
    assert.ok(items.length>=11,id+' offers at least eleven items');
    assert.ok(items.filter(item=>item.evidence.independent).length>=2,id+' keeps independent transfer items');
    assert.ok(items.some(item=>item.evidence.delayed&&item.delayedOnly),id+' keeps a later-day item');
    assert.ok(items.some(item=>item.draftKo),id+' offers a repair item with the original draft');
    assert.ok(items.every(item=>item.evaluation.meaningPolicy!=='verified'),id+' never certifies meaning');
    assert.ok(items.every(item=>item.promptJa&&item.support.meaningJa&&item.facts.length),id+' keeps Japanese meaning support');
    for(const group of groups.filter(group=>group.stage!=='form')){
      assert.ok(group.helpKo&&group.helpJa,id+' '+group.id+' explains the stage');
    }
  }
});
test('nodes without content still report their gap instead of opening',()=>{
  const {data}=boot();
  for(const id of ['S08','S09','S10','S11','S12','D01','D02']){
    const node=data.nodes.find(node=>node.id===id);
    assert.equal(node.status,'planned',id+' stays planned');
    assert.equal(node.availableGroupIds.length,0,id+' exposes no group');
  }
});
test('model answers pass their own component checks',()=>{
  const {c,data}=boot();
  const ids=['S01a','S01m1','S01r1','S01x1','S02b','S02r2','S03a','S03r2','S04a','S04v2','S05e','S05r1','S06e','S06m2','S06x1'];
  for(const id of ids){
    const item=data.items.find(item=>item.id===id);
    for(const model of item.models){
      const result=c.HARUMAL_WRITING_ENGINE.evaluate(item,model);
      assert.notEqual(result.status,'needs_practice',`${id}: ${model}`);
      assert.notEqual(result.status,'review_needed',`${id}: ${model}`);
      assert.equal(result.meaning,'unreviewed',`${id}: meaning stays unreviewed`);
    }
  }
});
test('the unit page lists every stage and the guided course keeps its own order',()=>{
  const {c,screen,data}=boot('ko');
  c.harumalWritingGo('node','S02');
  assert.match(screen.innerHTML,/harumalWritingGo\('nodeunit','S02'\)/);
  c.harumalWritingGo('nodeunit','S02');
  const html=screen.innerHTML;
  assert.match(html,/본격 단원/);
  for(const group of data.groups.filter(group=>group.nodeId==='S02')){
    assert.ok(html.includes(`harumalWritingGo('group','${group.id}')`),'stage link '+group.id);
  }
  const order=[...new Set([...html.matchAll(/harumalWritingGo\('group','(s02-[a-z]+)'\)/g)].map(match=>match[1]))];
  assert.deepEqual(order,['s02-practice','s02-mixed','s02-vary','s02-repair','s02-expand','s02-independent','s02-delayed']);
  c.harumalWritingGo('course');
  for(const id of NODES)assert.match(screen.innerHTML,new RegExp(`nodeunit','${id}'`));
  assert.equal(data.groups.filter(group=>group.nodeId==='S07').length,12,'the guided stage order stays the cause-writing unit');
});
test('opening a foundation item does not start or alter the guided course',()=>{
  const {c,engine}=boot('ko');
  c.harumalWritingGo('item','S01m1');
  c.harumalWritingDraft('S01m1','동생이 방에서 자요.');
  c.harumalWritingSubmit('S01m1');
  const progress=engine.guidedProgress();
  assert.equal(progress.started,false);
  assert.equal(engine.getState().route.page,'feedback');
  assert.equal(engine.getState().attempts.length,1);
  assert.equal(engine.getState().attempts[0].mode,'practice');
});
test('a foundation stage still blocks a later-day item until a day has passed',()=>{
  const {c,engine,screen}=boot('ko');
  assert.equal(engine.eligible('S01d1'),false,'delayed item stays closed');
  c.harumalWritingGo('group','s01-delayed');
  assert.match(screen.innerHTML,/최소 24시간|다른 날|열려요/);
  assert.equal(engine.eligible('S01e'),true,'same-day practice stays open');
});
test('a missing component returns the node-specific guidance, not a mastery verdict',()=>{
  const {c,data}=boot('ko');
  const item=data.items.find(item=>item.id==='S02a');
  const result=c.HARUMAL_WRITING_ENGINE.evaluate(item,'학교에 가요.');
  assert.equal(result.status,'review_needed');
  assert.match(result.messages[0],/조사를 붙였는지/);
  assert.equal(result.meaning,'unreviewed');
});
test('a foundation repair keeps the draft visible and its feedback routes to the node form group',()=>{
  const {c,screen,data}=boot('ko');
  c.harumalWritingGo('item','S02r1');
  assert.match(screen.innerHTML,/저는 학교 가요\./,'the original draft stays visible');
  c.harumalWritingDraft('S02r1','저는 학교에 가요.');
  c.harumalWritingSubmit('S02r1');
  assert.match(screen.innerHTML,/harumalWritingGo\('group','s02-practice'\)/,'supplement link stays inside the node');
  assert.equal(data.items.find(item=>item.id==='S02r1').draftKo,'저는 학교 가요.');
});

test('a foundation delayed item opens only after a day and a later local date',()=>{
  const NOW=Date.parse('2026-11-20T10:00:00Z');
  const {c,data}=boot('ko');
  const seed=c.HARUMAL_WRITING_ENGINE.create(c.localStorage,data,()=>NOW-49*60*60*1000);
  const first=seed.submit('S02i1','동생은 주말에 친구를 만나요.');
  assert.equal(first.attempt.mode,'independent','the first unhinted answer is independent evidence');
  const later=c.HARUMAL_WRITING_ENGINE.create(c.localStorage,data,()=>NOW);
  assert.equal(later.delayedReady(),true);
  assert.equal(later.eligible('S02d1'),true,'the later-day item opens for the same node');
  const sameDay=c.HARUMAL_WRITING_ENGINE.create(c.localStorage,data,()=>NOW-48*60*60*1000);
  assert.equal(sameDay.delayedReady(),false,'under 24 hours stays closed');
  assert.equal(sameDay.eligible('S02d1'),false);
});
