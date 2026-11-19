// S01–S06 each expose one bounded sub-unit; they are reachable from the map and the course page and
// stay outside the S07 guided stage order.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
function boot(lang='ko'){
  const values=new Map(),storage={getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const screen={className:'',dataset:{},innerHTML:'',querySelector:()=>null};
  const c={console,Date,localStorage:storage,S:{view:'learn',lang},document:{body:{classList:{add(){},remove(){}}},getElementById:id=>id==='screen'?screen:null,querySelector:()=>null,addEventListener(){}},history:{state:null,pushState(){},replaceState(){}},requestAnimationFrame:fn=>fn(),scrollTo(){},renderShell(){},hideSelection(){},setView(v){c.S.view=v;c.render()},render(){screen.innerHTML=''}};
  c.window=c;vm.createContext(c);
  for(const file of ['data/writing-curriculum.js','data/writing-curriculum-locales.js','writing-curriculum-i18n.js','writing-curriculum-engine.js','writing-curriculum.js'])vm.runInContext(read(file),c);
  return {c,screen,data:c.HARUMAL_WRITING_DATA,engine:c.HARUMAL_WRITING.engine};
}
test('each foundation node owns one practice unit and one independent item',()=>{
  const {data}=boot();
  for(const id of ['S01','S02','S03','S04','S05','S06']){
    const node=data.nodes.find(node=>node.id===id);
    assert.equal(node.status,'partial',id+' is open for practice');
    const groups=data.groups.filter(group=>group.nodeId===id);
    assert.equal(groups.length,2,id+' has a practice group and an independent group');
    assert.deepEqual(node.availableGroupIds,groups.map(group=>group.id));
    const items=data.items.filter(item=>groups.some(group=>group.itemIds.includes(item.id)));
    assert.ok(items.length>=3,id+' offers at least three items');
    assert.ok(items.some(item=>item.evidence.independent),id+' keeps an independent transfer item');
    assert.ok(items.every(item=>item.evaluation.meaningPolicy!=='verified'),id+' never certifies meaning');
    assert.ok(items.every(item=>item.promptJa&&item.support.meaningJa&&item.facts.length),id+' keeps Japanese meaning support');
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
  for(const id of ['S01a','S02b','S03a','S04a','S05e','S06e']){
    const item=data.items.find(item=>item.id===id);
    for(const model of item.models){
      const result=c.HARUMAL_WRITING_ENGINE.evaluate(item,model);
      assert.notEqual(result.status,'needs_practice',`${id}: ${model}`);
      assert.notEqual(result.status,'review_needed',`${id}: ${model}`);
    }
  }
});
test('the map and course page open a foundation unit and the guided course keeps its own order',()=>{
  const {c,screen,data}=boot('ko');
  c.harumalWritingGo('node','S02');
  assert.match(screen.innerHTML,/harumalWritingGo\('nodeunit','S02'\)/);
  c.harumalWritingGo('nodeunit','S02');
  assert.match(screen.innerHTML,/조사로 역할을/);
  assert.match(screen.innerHTML,/harumalWritingGo\('group','s02-practice'\)/);
  c.harumalWritingGo('course');
  for(const id of ['S01','S02','S03','S04','S05','S06'])assert.match(screen.innerHTML,new RegExp(`nodeunit','${id}'`));
  const guided=data.groups.filter(group=>group.nodeId==='S07');
  assert.equal(guided.length,12,'the guided stage order stays the cause-writing unit');
  assert.ok(data.groups.filter(group=>group.nodeId!=='S07').every(group=>group.nodeId!=='S07'));
});
test('opening a foundation item does not start or alter the guided course',()=>{
  const {c,engine}=boot('ko');
  c.harumalWritingGo('item','S01a');
  c.harumalWritingDraft('S01a','오늘은 날씨가 좋아요.');
  c.harumalWritingSubmit('S01a');
  const progress=engine.guidedProgress();
  assert.equal(progress.started,false);
  assert.equal(engine.getState().route.page,'feedback');
  assert.equal(engine.getState().attempts.length,1);
});
test('a missing component returns the node-specific guidance, not a mastery verdict',()=>{
  const {c,data}=boot('ko');
  const item=data.items.find(item=>item.id==='S02a');
  const result=c.HARUMAL_WRITING_ENGINE.evaluate(item,'학교에 가요.');
  assert.equal(result.status,'review_needed');
  assert.match(result.messages[0],/조사를 붙였는지/);
  assert.equal(result.meaning,'unreviewed');
});
