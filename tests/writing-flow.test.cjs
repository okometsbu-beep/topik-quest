const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const KEY='harumalWritingCurriculumV1';
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));

function setup(seed={}){
 const values=new Map(Object.entries(seed));
 const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 const context={console,Date};context.window=context;vm.createContext(context);
 vm.runInContext(read('data/writing-curriculum.js'),context);
 vm.runInContext(read('writing-curriculum-engine.js'),context);
 const data=context.HARUMAL_WRITING_DATA,engine=context.HARUMAL_WRITING_ENGINE;
 let time=Date.parse('2026-10-07T10:00:00Z');
 const create=()=>engine.create(storage,data,()=>time),E=create();
 return{E,data,engine,storage,values,create,setTime:value=>{time=Date.parse(value)}};
}
function answer(E,id,text){
 const item=E.itemById(id),value=text??(item.kind==='relation'?item.evaluation.correctChoiceId:item.models[0]);
 E.setDraft(id,value);const result=E.submit(id);
 assert.ok(result.attempt,`${id} submission is available`);
 E.setGuidedRoute({page:'feedback',itemId:id});
 return result;
}
function finishStage(E,g){
 for(const id of g.itemIds){answer(E,id);E.continueGuided(id)}
 assert.deepEqual(plain(E.guidedProgress().route),{page:'stage-done',groupId:g.id});
}
function finishCore(env){
 env.E.startGuided();
 for(const g of env.data.groups.filter(g=>!g.delayedOnly)){finishStage(env.E,g);env.E.continueGuided(g.id)}
}

test('guided flow starts at one stage and menu visits create no progress or unlocks',()=>{
 const{E}=setup();
 assert.equal(E.guidedProgress().started,false);
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics']);
 assert.deepEqual(plain(E.startGuided()),{page:'item',itemId:'P01'});
 for(const page of ['course','map','records','unit'])E.route({page});
 assert.deepEqual(plain(E.guidedProgress().route),{page:'item',itemId:'P01'});
 E.setGuidedRoute({page:'item',itemId:'R01'});
 assert.equal(E.guidedProgress().itemId,'P01');
 assert.equal(E.getState().attempts.length,0);
 assert.deepEqual(plain(E.guidedProgress().completedIds),[]);
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics']);
});

test('submitting is not continuing; empty work and premature completion pages cannot unlock stages',()=>{
 const{E,data}=setup();E.startGuided();
 assert.equal(E.submit('P01','').empty,true);
 E.continueGuided('P01');
 assert.equal(E.guidedProgress().itemId,'P01');
 answer(E,'P01');
 assert.deepEqual(plain(E.guidedProgress().completedItemIds),[]);
 assert.deepEqual(plain(E.continueGuided('P01')),{page:'item',itemId:'P02'});
 E.setGuidedRoute({page:'stage-done',groupId:data.groups[0].id});
 assert.equal(E.guidedProgress().route.page,'item');
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics']);
});

test('stage end is its own durable page and the next stage needs a separate explicit continue',()=>{
 const env=setup(),{E,data}=env;E.startGuided();finishStage(E,data.groups[0]);
 assert.deepEqual(plain(E.guidedProgress().completedIds),['probe-basics']);
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics']);
 const restored=env.create();
 assert.deepEqual(plain(restored.resumeGuided()),{page:'stage-done',groupId:'probe-basics'});
 assert.deepEqual(plain(restored.continueGuided('probe-basics')),{page:'item',itemId:'R01'});
 assert.deepEqual(plain(restored.guidedProgress().unlockedIds),['probe-basics','form-aseo']);
});

test('duplicate submit and stale repeated continue clicks are idempotent',()=>{
 const{E,data}=setup();E.startGuided();answer(E,'P01');
 assert.equal(E.submit('P01').duplicate,true);
 const next=E.continueGuided('P01'),count=E.getState().attempts.length;
 assert.deepEqual(plain(E.continueGuided('P01')),plain(next));
 assert.equal(E.getState().attempts.length,count);
 for(const id of data.groups[0].itemIds.slice(1)){answer(E,id);E.continueGuided(id)}
 const done=E.guidedProgress().route;
 assert.deepEqual(plain(E.continueGuided(data.groups[0].itemIds.at(-1))),plain(done));
 assert.deepEqual(plain(E.continueGuided()),plain(done));
 const first=E.continueGuided('probe-basics');
 assert.deepEqual(plain(E.continueGuided('probe-basics')),plain(first));
 assert.deepEqual(plain(E.advanceGuided()),plain(first));
});

test('failed form checks, hints, models and self-review never revoke open stages or invent mastery',()=>{
 const{E,data}=setup();E.startGuided();finishStage(E,data.groups[0]);E.continueGuided('probe-basics');
 E.help('R01','meaning');const a=answer(E,'R01','일이 많아요서 늦게 퇴근해요.').attempt;
 assert.equal(a.evaluation.status,'needs_practice');
 E.selfCheck(a.id,'needs_review');E.revealModel('R01');
 assert.deepEqual(plain(E.continueGuided('R01')),{page:'item',itemId:'R02'});
 E.readiness('reason_form','needs_help');
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics','form-aseo']);
 assert.equal(E.evidence().meaningReviewed,0);
 assert.equal(E.getState().attempts.find(x=>x.id===a.id).helpUsed,true);
});

test('draft, hint/model/self-check and exact feedback or retry route survive menus, leave and reload',()=>{
 const env=setup(),{E}=env;E.startGuided();E.setDraft('P01','내가 작성하던 글');E.help('P01','meaning');
 const a=answer(E,'P01').attempt;E.revealModel('P01');E.selfCheck(a.id,'checked');
 const retry={page:'item',itemId:'P01',phase:'inline-retry',selectionStart:2};
 E.setDraft('P01','수정 중인 문장');E.setGuidedRoute(retry);E.route({page:'records'});E.leaveGuided();
 E.route({page:'item',itemId:'R18'});E.setGuidedRoute({page:'item',itemId:'P02'});
 let restored=env.create();assert.equal(restored.guidedProgress().active,false);
 assert.deepEqual(plain(restored.resumeGuided()),retry);
 assert.equal(restored.draft('P01').text,'수정 중인 문장');
 assert.equal(restored.draft('P01').helpOpened,true);assert.equal(restored.draft('P01').modelViewed,true);
 assert.equal(restored.getState().attempts[0].selfCheck.value,'checked');
 restored.setGuidedRoute({page:'feedback',itemId:'P01'});restored.route({page:'course'});
 restored=env.create();assert.deepEqual(plain(restored.resumeGuided()),{page:'feedback',itemId:'P01'});
 assert.equal(restored.guidedProgress().active,true);
});

test('35 submitted and continued core items complete the available unit without waiting for delayed work',()=>{
 const env=setup();finishCore(env);const{E,data}=env,p=E.guidedProgress();
 assert.equal(p.complete,true);assert.equal(p.delayedComplete,false);assert.equal(p.delayedReady,false);
 assert.equal(E.getState().attempts.length,35);assert.equal(p.completedItemIds.length,35);
 assert.equal(p.completedIds.length,data.groups.length-1);
 assert.deepEqual(plain(p.route),{page:'course'});assert.equal(p.active,false);
 assert.ok(p.unlockedIds.includes('delayed-new'));
 assert.deepEqual(plain(E.startGuided('delayed-new')),{page:'group',groupId:'delayed-new'});
 assert.equal(E.submit('D01','영화가 재미있어서 다시 봐요.').blocked,true);
 assert.equal(E.evidence().meaningReviewed,0);
});

test('delayed work still needs 24 hours and a later local day and remains separate from core completion',()=>{
 const env=setup();finishCore(env);const{E,data,setTime}=env;
 setTime('2026-10-08T09:59:59Z');assert.equal(E.delayedReady(),false);
 setTime('2026-10-08T10:00:01Z');assert.equal(E.delayedReady(),true);
 assert.deepEqual(plain(E.startGuided('delayed-new')),{page:'item',itemId:'D01'});
 finishStage(E,data.groups.at(-1));
 assert.equal(E.guidedProgress().complete,true);assert.equal(E.guidedProgress().delayedComplete,true);
 E.continueGuided('delayed-new');assert.equal(E.guidedProgress().route.page,'course');
 assert.equal(E.evidence().delayed,2);
});

test('assisted independent answers do not prevent completion or fabricate a delayed release anchor',()=>{
 const env=setup();for(const id of ['I01','I02','I03'])env.E.help(id,'meaning');finishCore(env);
 assert.equal(env.E.guidedProgress().complete,true);
 assert.equal(env.E.getState().firstIndependentAt,null);
 env.setTime('2026-10-10T12:00:00Z');assert.equal(env.E.delayedReady(),false);
});

test('two tabs merge monotonic unlocks with the newest resume pointer and never change legacy roots',()=>{
 const legacy='{"vocab":["여행"],"writing":{"54":"saved"}}',backup='{"keep":"snapshot"}';
 const env=setup({topikQuestV8:legacy,malbitRecoverySnapshotV1:backup}),{E,data}=env;
 const other=env.create();E.startGuided();finishStage(E,data.groups[0]);E.continueGuided('probe-basics');
 other.guidedProgress();other.setGuidedRoute({page:'item',itemId:'R02',phase:'draft'});
 assert.deepEqual(plain(E.guidedProgress().route),{page:'item',itemId:'R02',phase:'draft'});
 E.help('R01');E.route({page:'records'});
 assert.deepEqual(plain(other.guidedProgress().unlockedIds),['probe-basics','form-aseo']);
 assert.equal(other.guidedProgress().itemId,'R02');
 assert.equal(env.values.get('topikQuestV8'),legacy);assert.equal(env.values.get('malbitRecoverySnapshotV1'),backup);
 assert.equal(other.getState().attempts.length,6);
});

test('backup merge keeps the highest unlock, both histories and the newer pointer without resetting progress',()=>{
 const env=setup();env.E.startGuided();finishStage(env.E,env.data.groups[0]);env.E.continueGuided('probe-basics');
 const early=env.E.getState();answer(env.E,'R01');env.E.continueGuided('R01');
 const imported=plain(early);imported.guided.updatedAt='2026-10-06T00:00:00Z';imported.guided.unlockedIds=['probe-basics'];
 const merged=JSON.parse(env.E.mergeImport(JSON.stringify(imported)));
 assert.equal(merged.guided.route.itemId,'R02');assert.ok(merged.guided.unlockedIds.includes('form-aseo'));
 assert.ok(merged.guided.completedItemIds.includes('R01'));assert.equal(merged.attempts.length,7);
 const renewed=setup({[KEY]:JSON.stringify(merged)}).E;assert.equal(renewed.guidedProgress().itemId,'R02');
});

test('legacy migration preserves a contiguous attempted-stage prefix and current feedback without assigning mastery',()=>{
 const original=setup();for(const id of [...original.data.groups[0].itemIds,'R01','R02'])answer(original.E,id);
 const old=original.E.getState();delete old.guided;old.route={page:'feedback',itemId:'R02'};old.custom='keep';
 const{E}=setup({[KEY]:JSON.stringify(old)}),p=E.guidedProgress();
 assert.deepEqual(plain(p.unlockedIds),['probe-basics','form-aseo']);
 assert.deepEqual(plain(p.completedIds),['probe-basics']);assert.ok(p.completedItemIds.includes('R01'));
 assert.deepEqual(plain(E.resumeGuided()),{page:'feedback',itemId:'R02'});
 assert.deepEqual(plain(E.continueGuided('R02')),{page:'item',itemId:'R03'});
 assert.equal(E.getState().custom,'keep');assert.equal(E.getState().attempts.length,8);
 assert.equal(E.evidence().meaningReviewed,0);
});

test('legacy isolated draft resumes its exact old group without unlocking untouched intervening stages',()=>{
 const old={schema:1,attempts:[],drafts:{I02:{text:'아직 작성 중',updatedAt:'2026-10-06T00:00:00Z',helpOpened:true}},route:{page:'item',itemId:'I02'}};
 const{E}=setup({[KEY]:JSON.stringify(old)});
 assert.deepEqual(plain(E.resumeGuided()),{page:'item',itemId:'I02'});
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics','independent-new']);
 assert.deepEqual(plain(E.guidedProgress().completedIds),[]);
 assert.equal(E.draft('I02').text,'아직 작성 중');assert.equal(E.draft('I02').helpOpened,true);
});

test('legacy finished stages stay finished when work continued in a draft or a delayed answer',()=>{
 const initial=setup();for(const id of initial.data.groups[0].itemIds)answer(initial.E,id);
 initial.E.setDraft('R01','다음 단계의 초고');
 const old=initial.E.getState();delete old.guided;old.route={page:'item',itemId:'R01'};
 let restored=setup({[KEY]:JSON.stringify(old)}).E;
 assert.deepEqual(plain(restored.guidedProgress().completedIds),['probe-basics']);
 assert.deepEqual(plain(restored.resumeGuided()),{page:'item',itemId:'R01'});
 const all=setup();finishCore(all);all.setTime('2026-10-08T10:00:01Z');answer(all.E,'D01');
 const delayed=all.E.getState();delete delayed.guided;delayed.route={page:'feedback',itemId:'D01'};
 restored=setup({[KEY]:JSON.stringify(delayed)}).E;
 assert.equal(restored.guidedProgress().complete,true);
 assert.equal(restored.guidedProgress().completedItemIds.length,35);
 assert.deepEqual(plain(restored.resumeGuided()),{page:'feedback',itemId:'D01'});
});

test('a legacy menu click with no actual work cannot seed or unlock a later stage',()=>{
 const{E}=setup({[KEY]:JSON.stringify({schema:1,attempts:[],drafts:{},route:{page:'item',itemId:'I03'}})});
 assert.equal(E.guidedProgress().started,false);
 assert.deepEqual(plain(E.startGuided()),{page:'item',itemId:'P01'});
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics']);
});

test('read-only damaged or newer flow state preserves its source while in-memory drafts remain usable',()=>{
 for(const guided of [{version:8},{version:1,unlockedIds:'broken'},{version:1,updatedAt:'not-a-date'},{version:1,route:{page:7}},{version:1,route:{page:'item',itemId:'__proto__'}}]){
  const raw=JSON.stringify({schema:1,drafts:{},attempts:[],guided}),{E,values}=setup({[KEY]:raw});
  assert.ok(E.getStorageError());E.startGuided();E.setDraft('P01','임시 초고');
  assert.equal(values.get(KEY),raw);assert.equal(E.draft('P01').text,'임시 초고');
 }
});

test('partial flow objects and unknown routes normalize safely without making up progress',()=>{
 for(const guided of [{},{version:1,route:{page:'course'}},{version:1,route:{page:'unknown'}},{version:1,route:{page:'item',itemId:'unknown'}},{version:1,route:{page:'stage-done',groupId:'probe-basics'}}]){
  const{E}=setup({[KEY]:JSON.stringify({schema:1,attempts:[],drafts:{},guided})});
  assert.equal(E.getStorageError(),'');assert.deepEqual(plain(E.resumeGuided()),{page:'item',itemId:'P01'});
  assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics']);
  assert.deepEqual(plain(E.guidedProgress().completedIds),[]);assert.equal(E.getState().attempts.length,0);
 }
});

test('unsupported claimed completions without submissions cannot mark a stage complete on restore',()=>{
 const base=setup(),completedItemIds=base.data.items.map(i=>i.id);
 const{E}=setup({[KEY]:JSON.stringify({schema:1,attempts:[],drafts:{},guided:{version:1,completedItemIds,route:{page:'course'}}})});
 assert.equal(E.guidedProgress().complete,false);assert.deepEqual(plain(E.guidedProgress().completedItemIds),[]);
 assert.deepEqual(plain(E.startGuided()),{page:'item',itemId:'P01'});
});

test('progress and resume results are detached clones, not mutable internal state',()=>{
 const{E}=setup();const r=E.startGuided();r.itemId='I03';
 const p=E.guidedProgress();p.unlockedIds.push('independent-new');p.route.itemId='I03';p.completedItemIds.push('P01');
 assert.equal(E.guidedProgress().itemId,'P01');
 assert.deepEqual(plain(E.guidedProgress().unlockedIds),['probe-basics']);
 assert.deepEqual(plain(E.guidedProgress().completedItemIds),[]);
});
