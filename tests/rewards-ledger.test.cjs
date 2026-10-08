const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const ROOT='harumalRewardsV1',PREFIX='harumalRewardsEvent:';
const plain=value=>JSON.parse(JSON.stringify(value));

function hub(seed={}){
  const values=new Map(Object.entries(seed).map(([key,value])=>[key,String(value)])),tabs=[],queue=[];
  let failWrite=()=>false,failRead=false,beforeWrite=null,keyReads=0;
  function tab(options={}){
    const handlers={},toasts=[],microtasks=[],nodes=new Map();
    const storage={
      get length(){if(failRead)throw Error('denied');return values.size},
      key(i){keyReads++;return [...values.keys()][i]??null},
      getItem(key){if(failRead)throw Error('denied');return values.get(key)??null},
      setItem(key,value){
        if(failWrite(key))throw Error('quota');
        const oldValue=values.get(key)??null;
        if(beforeWrite)beforeWrite(key,String(value));
        values.set(key,String(value));
        for(const other of tabs)if(other.storage!==storage)queue.push(()=>other.fire('storage',{key,oldValue,newValue:String(value),storageArea:other.storage}));
      },
      removeItem(key){const oldValue=values.get(key)??null;values.delete(key);for(const other of tabs)if(other.storage!==storage)queue.push(()=>other.fire('storage',{key,oldValue,newValue:null,storageArea:other.storage}))}
    };
    const document={
      querySelectorAll:()=>[],getElementById:id=>nodes.get(id)||null,
      createElement:()=>({textContent:'',setAttribute(){}}),
      head:{appendChild:node=>nodes.set(node.id,node)},body:{appendChild:node=>nodes.set(node.id,node)},
      addEventListener(){},visibilityState:'visible'
    };
    const c={console,Date,Math,localStorage:storage,document,S:{lang:options.lang||'ko'},
      crypto:{randomUUID:()=>`uuid-${tabs.length}-${Math.random().toString(36).slice(2)}`},
      queueMicrotask:fn=>microtasks.push(fn),toast:value=>toasts.push(value),
      addEventListener:(name,fn)=>(handlers[name]??=[]).push(fn),
      dispatchEvent:event=>(handlers[event.type]||[]).forEach(fn=>fn(event)),
      CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail}},setInterval(){},
    };
    c.window=c;vm.createContext(c);
    if(options.guard)vm.runInContext(read('storage-guard.js'),c);
    vm.runInContext(read('learning-rewards.js'),c);
    const result={c,storage,R:c.HARUMAL_REWARDS,nodes,toasts,fire:(name,event)=>(handlers[name]||[]).forEach(fn=>fn(event)),flush:()=>{while(microtasks.length)microtasks.shift()()}};
    tabs.push(result);return result;
  }
  return {values,tab,flush:()=>{while(queue.length)queue.shift()();tabs.forEach(tab=>tab.flush())},failWrites:fn=>failWrite=fn,failReads:value=>failRead=value,beforeWrite:fn=>beforeWrite=fn,keyReads:()=>keyReads};
}
const answer=(R,sessionId='session-1',slot=0,difficulty='normal',extra={})=>R.answer({source:'random',sessionId,slot,question:{id:`q-${slot}`,difficulty},correct:true,...extra});

test('tier awards are explicit, incorrect answers do not award, and assistance is activity metadata',()=>{
  const {R}=hub().tab();
  assert.equal(answer(R,'s',0,'easy',{correct:false}).awarded,false);
  for(const [slot,difficulty,xp,coins] of [[0,'easy',10,2],[1,'medium',15,3],[2,'normal',15,3],[3,'hard',25,5],[4,'very_hard',40,8],[5,'very-hard',40,8]]){
    const result=answer(R,'s',slot,difficulty,{assisted:true});assert.equal(result.xp,xp);assert.equal(result.coins,coins);assert.equal(result.event.assisted,true);assert.equal(result.persisted,true);
  }
  assert.equal(R.getState().xp,145);assert.equal(R.getState().coins,29);
  assert.equal(R.answer({source:'a',sessionId:'s',slot:'rank',question:{difficultyRank:4},correct:true}).xp,40);
  assert.equal(R.answer({source:'a',sessionId:'s',slot:'fallback',question:{level:2},correct:true}).xp,15);
});

test('award identity prevents repeated taps and reload duplication while a deliberate new session earns again',()=>{
  const store=hub(),a=store.tab(),session=a.R.newSession('random');
  assert.equal(answer(a.R,session).awarded,true);
  assert.equal(answer(a.R,session).duplicate,true);
  assert.equal(answer(a.R,session,0,'very-hard').xp,0,'changing the question in the same slot must not earn again');
  const b=store.tab();assert.equal(answer(b.R,session).duplicate,true);assert.equal(b.R.getState().events.length,1);
  const next=b.R.newSession('random');assert.notEqual(next,session);assert.equal(answer(b.R,next).awarded,true);
  assert.equal(b.R.getState().xp,30);
  for(const input of [{source:'a',slot:0},{sessionId:'s',slot:0},{source:'a',sessionId:'s'}])assert.equal(b.R.answer({...input,correct:true}).reason,'missing-identity');
});

test('learn and transfer completion are separate one-time grants with fixed bonuses',()=>{
  const {R}=hub().tab();
  for(const phase of ['learn','transfer']){
    const value={source:'growth',sessionId:'s',stageId:'recipe1',phase,difficulty:'hard',assisted:true};
    const award=R.stage(value);assert.equal(award.xp,phase==='learn'?20:30);assert.equal(award.coins,phase==='learn'?4:6);assert.equal(award.event.assisted,true);assert.equal(R.stage(value).duplicate,true);
  }
  assert.equal(R.getState().xp,50);assert.equal(R.stage({source:'growth',stageId:'recipe1',phase:'learn'}).reason,'missing-identity');
});

test('level thresholds are cumulative, and status never labels activity as proficiency',()=>{
  const {R}=hub().tab();
  for(const [xp,level,next] of [[0,1,100],[99,1,100],[100,2,300],[299,2,300],[300,3,600],[599,3,600],[600,4,1000]]){
    const info=R.levelInfo(xp);assert.equal(info.level,level);assert.equal(info.nextThreshold,next);assert.equal(info.remaining,next-xp);
  }
  const html=R.renderStatus();assert.match(html,/활동 레벨 1/);assert.match(html,/이 브라우저에만/);assert.match(html,/인증이 아니/);assert.match(html,/<progress/);assert.match(html,/코인 0/);
});

test('concurrent tabs retain both immutable events even when a stale cache write wins',()=>{
  const store=hub(),a=store.tab(),b=store.tab();let interleaved=false;
  store.beforeWrite(key=>{if(key===ROOT&&!interleaved){interleaved=true;answer(b.R,'session-b')}});
  answer(a.R,'session-a');store.beforeWrite(null);
  assert.equal(JSON.parse(store.values.get(ROOT)).events.length,1,'test deliberately creates the stale-root overwrite');
  assert.equal([...store.values.keys()].filter(key=>key.startsWith(PREFIX)).length,2);
  store.flush();assert.equal(a.R.getState().xp,30);assert.equal(b.R.getState().xp,30);
  const reloaded=store.tab();assert.equal(reloaded.R.getState().xp,30);assert.equal(reloaded.R.getState().events.length,2);
  assert.equal(answer(reloaded.R,'session-b').duplicate,true);
});

test('event-key quota failures stay pending even when racing root writes succeed',()=>{
  const store=hub(),a=store.tab(),b=store.tab();let interleaved=false,resultB;
  store.failWrites(key=>key.startsWith(PREFIX));
  store.beforeWrite(key=>{if(key===ROOT&&!interleaved){interleaved=true;resultB=answer(b.R,'session-b')}});
  const resultA=answer(a.R,'session-a');store.beforeWrite(null);
  assert.equal(resultA.persisted,false);assert.equal(resultB.persisted,false);
  assert.ok(a.R.getState().pendingCount);assert.ok(b.R.getState().pendingCount);
  assert.match(a.R.renderStatus(),/저장하지 못했어요/);assert.equal(JSON.parse(b.R.exportState()).events.length,2);
  store.failWrites(()=>false);a.R.exportState();b.R.exportState();store.flush();
  assert.equal(store.tab().R.getState().xp,30);assert.equal(a.R.getState().pendingCount,0);assert.equal(b.R.getState().pendingCount,0);
});

test('a root-only legacy reward backup is materialized before being considered durable',()=>{
  const source=hub().tab();answer(source.R);const raw=source.R.exportState();
  const store=hub({[ROOT]:raw});store.failWrites(key=>key.startsWith(PREFIX));const tab=store.tab();
  assert.equal(tab.R.getState().xp,15);assert.equal(tab.R.getState().pendingCount,1);assert.ok(tab.R.getState().storageWarning);
  store.failWrites(()=>false);tab.R.exportState();assert.equal(tab.R.getState().pendingCount,0);
  assert.equal([...store.values.keys()].filter(key=>key.startsWith(PREFIX)).length,1);
});

test('old root overwrites, reloads and repeated backup imports union events without double grants',()=>{
  const store=hub(),{R}=store.tab();answer(R,'old');const old=R.exportState();answer(R,'new');
  store.values.set(ROOT,old);
  const reloaded=store.tab();assert.equal(reloaded.R.getState().xp,30);
  assert.equal(JSON.parse(reloaded.R.mergeImport(old)).events.length,2);
  assert.equal(JSON.parse(reloaded.R.mergeImport(old)).xp,30);
  const remote=hub().tab();answer(remote.R,'other-device',0,'hard');const imported=remote.R.exportState();
  assert.equal(JSON.parse(reloaded.R.mergeImport(imported)).xp,55);
  const next=store.tab();assert.equal(next.R.getState().coins,11);assert.equal(JSON.parse(next.R.exportState()).events.length,3);
});

test('immutable event truth wins over conflicting root or imported copies',()=>{
  const store=hub(),{R}=store.tab();answer(R);const root=JSON.parse(R.exportState());root.events[0].xp=999;root.events[0].coins=999;root.xp=999;
  store.values.set(ROOT,JSON.stringify(root));
  const reloaded=store.tab();assert.equal(reloaded.R.getState().xp,15);assert.equal(JSON.parse(reloaded.R.mergeImport(JSON.stringify(root))).xp,15);
});

test('failed storage remains usable in memory, warns visibly and exports all unsaved awards',()=>{
  const store=hub();store.failWrites(()=>true);const tab=store.tab();
  assert.equal(answer(tab.R).persisted,false);assert.equal(tab.R.getState().xp,15);assert.equal(tab.R.getState().pendingCount,1);
  assert.match(tab.R.renderStatus(),/저장하지 못했어요/);assert.match(tab.nodes.get('harumalRewardsStorageWarning').textContent,/저장하지 못했어요/);
  assert.equal(JSON.parse(tab.R.exportState()).events.length,1);assert.equal(answer(tab.R).duplicate,true);
  store.failWrites(()=>false);tab.R.exportState();assert.equal(tab.R.getState().pendingCount,0);assert.equal(store.tab().R.getState().xp,15);
});

test('corrupt and future roots are retained, and malformed imports cannot alter current rewards',()=>{
  for(const raw of ['{bad',JSON.stringify({schema:99,events:[],private:'retain'}),JSON.stringify({schema:1,events:[{}]})]){
    const store=hub({[ROOT]:raw}),{R}=store.tab();answer(R);assert.equal(store.values.get(ROOT),raw);assert.ok(R.getState().storageWarning);assert.equal(store.tab().R.getState().xp,15);
    const before=R.getState().xp;assert.throws(()=>R.mergeImport('{bad'));assert.equal(R.getState().xp,before);assert.equal(store.values.get(ROOT),raw);
  }
});

test('storage denial and corrupt individual records are nonfatal and preserve the original bytes',()=>{
  const source=hub().tab();answer(source.R);const event=source.R.getState().events[0],key=PREFIX+encodeURIComponent(event.id);
  const corrupt=hub({[key]:'{bad'}),tab=corrupt.tab();answer(tab.R);assert.equal(corrupt.values.get(key),'{bad');assert.ok(tab.R.getState().storageWarning);
  const denied=hub();denied.failReads(true);const blocked=denied.tab();assert.equal(answer(blocked.R).awarded,true);assert.ok(blocked.R.getState().storageWarning);
});

test('rendering a stable ledger does not repeatedly scan localStorage keys',()=>{
  const store=hub(),{R}=store.tab();for(let i=0;i<30;i++)answer(R,'s',i);
  const before=store.keyReads();for(let i=0;i<20;i++){R.renderStatus();R.getState()}
  assert.equal(store.keyReads(),before);
});

test('backup restores growth root and immutable rewards without altering legacy learner records',()=>{
  const source=hub().tab();answer(source.R,'past');const rewardRoot=source.R.exportState(),event=source.R.getState().events[0];
  const growth=JSON.stringify({schema:1,sessions:{keep:{answer:'원문'}}});
  const legacy={topikQuestV8:JSON.stringify({vocab:[{text:'여행'}],gameUnlock:7}),malbitStoryV1:JSON.stringify({episodes:{arrival:{complete:true}}}),malbitWrongReviewV3:JSON.stringify({items:[{id:'old'}]})};
  const snapshot={schema:1,storage:{...legacy,[ROOT]:rewardRoot,harumalGrowthLearningV1:growth,[PREFIX+encodeURIComponent(event.id)]:JSON.stringify(event)}};
  const store=hub({...legacy,malbitRecoverySnapshotV1:JSON.stringify(snapshot)}),tab=store.tab({guard:true});
  assert.equal(tab.R.getState().xp,15);assert.equal(store.values.get('harumalGrowthLearningV1'),growth);
  for(const [key,value] of Object.entries(legacy))assert.equal(store.values.get(key),value);
  answer(tab.R,'current');const richer=tab.R.exportState();store.values.set(ROOT,rewardRoot);
  store.values.set('malbitRecoverySnapshotV1',JSON.stringify({schema:1,storage:{[ROOT]:richer}}));
  tab.c.MALBIT_STORAGE_GUARD.restore();assert.equal(JSON.parse(store.values.get(ROOT)).events.length,2);
  tab.c.MALBIT_STORAGE_GUARD.capture('test');const captured=JSON.parse(store.values.get('malbitRecoverySnapshotV1')).storage;
  assert.ok(captured[PREFIX+encodeURIComponent(event.id)]);assert.equal(JSON.parse(captured[ROOT]).events.length,2);
});

function backupRuntime(tab){
  const c=tab.c;let exported,confirmations=0,reloads=0;
  Object.assign(c,{T1_SESSION:'topikQuestTopik1Session',SHORTS_KEY:'topikQuestShortsV1',GAME_KEY:'topikQuestTopik1GameV1',REVIEW_KEY:'malbitWrongReviewV3',EVENTS_KEY:'malbitLearningEventsV1',PREFS_KEY:'malbitProductPrefsV1',ONBOARD_KEY:'malbitOnboardingV1',
    L:(ko,ja,en)=>en,dayKey:()=> '2026-10-08',confirm:()=>{confirmations++;return true},location:{reload:()=>reloads++},setTimeout(){},
    Blob:class{constructor(parts){exported=JSON.parse(parts[0])}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},
    FileReader:class{readAsText(file){this.result=file.content;this.onload()}},
  });
  c.document.createElement=()=>({click(){}});
  const source=read('product-polish.js'),start=source.indexOf('const PORTABLE_KEYS='),end=source.indexOf('\nwindow.malbitSetPref=',start);
  vm.runInContext(source.slice(start,end),c);
  return {export:()=>{c.malbitExportProgress();return exported},import:storage=>c.malbitImportProgress({files:[{content:JSON.stringify({app:'MALBIT',schema:1,storage})}]}),reloaded:()=>reloads,confirmed:()=>confirmations};
}

test('the real export/import path includes unioned reward events and merges growth while preserving absent roots',()=>{
  const store=hub({harumalGrowthLearningV1:JSON.stringify({schema:1,current:true}),malbitStoryV1:'{"legacy":"travel"}'}),tab=store.tab();
  answer(tab.R,'old');const old=tab.R.exportState();answer(tab.R,'current');store.values.set(ROOT,old);
  tab.c.HARUMAL_GROWTH={validateImport:raw=>{const state=JSON.parse(raw);if(state.schema!==1)throw Error('format')},mergeImport:raw=>JSON.stringify({...JSON.parse(raw),current:true,merged:true})};
  const backup=backupRuntime(tab),exported=backup.export();assert.equal(JSON.parse(exported.storage[ROOT]).events.length,2);assert.ok(exported.storage.harumalGrowthLearningV1);
  backup.import({[ROOT]:old,harumalGrowthLearningV1:'{"schema":1,"old":true}'});
  assert.equal(tab.R.getState().xp,30);assert.equal(JSON.parse(store.values.get('harumalGrowthLearningV1')).merged,true);assert.equal(store.values.get('malbitStoryV1'),'{"legacy":"travel"}');assert.equal(backup.reloaded(),1);
  backup.import({[ROOT]:'broken',topikQuestV8:'{"should":"not write"}'});assert.equal(store.values.has('topikQuestV8'),false);assert.equal(backup.reloaded(),1);
  backup.import({harumalGrowthLearningV1:'{broken',topikQuestV8:'{"should":"not write"}'});assert.equal(store.values.has('topikQuestV8'),false);assert.equal(backup.reloaded(),1);
});

test('backup still exports in-memory rewards when reading other browser storage is denied',()=>{
  const store=hub(),tab=store.tab();store.failReads(true);answer(tab.R);
  const exported=backupRuntime(tab).export();assert.equal(JSON.parse(exported.storage[ROOT]).xp,15);
  assert.ok(exported.unreadableKeys.includes('topikQuestV8'));assert.match(tab.toasts.at(-1),/could not be read/);
});

test('explicit reset removes immutable rewards and prevents their recovery on reload',()=>{
  const store=hub(),tab=store.tab({guard:true});answer(tab.R);tab.c.MALBIT_STORAGE_GUARD.capture('earned');
  backupRuntime(tab);tab.c.malbitResetProgress();
  assert.equal([...store.values.keys()].some(key=>key.startsWith(PREFIX)),false);assert.equal(store.values.has(ROOT),false);assert.equal(store.values.has('malbitRecoverySnapshotV1'),false);assert.equal(store.tab({guard:true}).R.getState().xp,0);
});

test('future coin debit events are aggregated without exposing a spend API',()=>{
  const tab=hub().tab();answer(tab.R);const root=JSON.parse(tab.R.exportState());root.events.push({id:'future-shop-1',kind:'debit',xp:0,coins:-2});
  tab.R.mergeImport(JSON.stringify(root));assert.equal(tab.R.getState().xp,15);assert.equal(tab.R.getState().coins,1);assert.equal(tab.R.debit,undefined);
});

test('same-tick answer and completion feedback reports the actual combined reward once',()=>{
  const tab=hub().tab();answer(tab.R,'s',0,'easy');tab.R.stage({source:'growth',sessionId:'s',stageId:'stage',phase:'learn'});tab.flush();
  assert.deepEqual(tab.toasts,['+30 XP · +6 코인']);answer(tab.R,'s',0,'easy');tab.flush();assert.equal(tab.toasts.length,1);
});
