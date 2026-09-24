const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function harness(){
  const store=new Map(),screen={className:'',innerHTML:''};
  const ctx={console,S:{lang:'ja',view:'home'},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},document:{body:{classList:{toggle(){},remove(){}}},documentElement:{style:{}},getElementById:id=>id==='screen'?screen:null,querySelector:()=>null},renderShell(){},navActive(){},hideSelection(){},confirm:()=>true};
  ctx.window=ctx;ctx.render=()=>{};ctx.setView=v=>{ctx.S.view=v;ctx.render()};vm.createContext(ctx);
  vm.runInContext(read('data/travel-pack-seoul-001.js'),ctx);vm.runInContext(read('travel-mode.js'),ctx);
  const pack=ctx.MALBIT_TRAVEL.packs[0],key=ctx.MALBIT_TRAVEL.storageKey;
  ctx.malbitTravelStart(pack.id,false);
  const get=()=>JSON.parse(store.get(key));const state=()=>get().episodes[pack.id];const change=fn=>{const v=get();fn(v.episodes[pack.id]);store.set(key,JSON.stringify(v))};
  change(s=>{s.sceneId='q-ticket';s.route='all-stop';s.wallet=80000;s.inventory=['transitCard'];s.answers['q-ticket']={selected:0,correct:true,earned:2000,delayMinutes:0,bankId:'TRAVEL-A4'}});
  return{ctx,screen,pack,state,change};
}
test('each route question has specific localized reasons and one recall model',()=>{
  const {pack}=harness(),questions=new Map();
  for(const s of pack.scenes)for(const v of [s,...Object.values(s.routeVariants||{})])if(v.question)questions.set(v.question.bankId,v.question);
  assert.equal(questions.size,8);
  for(const [id,q] of questions){assert.equal(q.coach.traps.length,4);assert.equal(q.coach.traps[q.answerIndex],null);assert.ok(q.coach.recall.phrase);
    for(const lang of ['ko','ja','en','zh']){for(const field of [q.coach.evidence,q.coach.method,q.coach.recall.prompt,...q.coach.traps.filter(Boolean)])assert.ok(field[lang]?.trim(),id+lang);assert.equal(new Set(q.coach.traps.filter(Boolean).map(x=>x[lang])).size,3);}
  }
});
test('recall saves drafts, distinguishes delayed unaided use, and preserves the trip',()=>{
  const {ctx,screen,state,change,pack}=harness();const before=state();ctx.malbitTravelPracticeOpen();
  assert.equal(ctx.S.view,'travelRecall');assert.ok(!screen.innerHTML.includes('교통카드를 찍어요.'));
  ctx.malbitTravelPracticeDraft('교통카드를 찍어요!');ctx.render();assert.ok(screen.innerHTML.includes('value="교통카드를 찍어요!"'));
  const now=Date.now();ctx.malbitTravelPracticeCheck();let record=state().practice['TRAVEL-A4'];assert.equal(record.unaidedMatches,1);assert.ok(record.nextDueAt>=now+86400000);ctx.malbitTravelPracticeCheck();assert.equal(state().practice['TRAVEL-A4'].attempts,1);
  ctx.malbitTravelPracticeClose();assert.equal(ctx.S.view,'travelPlay');for(const k of ['wallet','inventory','answers','sceneId','route'])assert.deepEqual(state()[k],before[k]);
  change(s=>s.practice['TRAVEL-A4'].nextDueAt=Date.now()-1);assert.equal(ctx.MALBIT_TRAVEL.recallSummary().due,1);ctx.malbitTravelRecallOpen();assert.ok(!screen.innerHTML.includes('교통카드를 찍어요.'));
  ctx.malbitTravelPracticeDraft('<img src=x onerror=alert(1)>');ctx.render();assert.ok(screen.innerHTML.includes('&lt;img'));assert.ok(!screen.innerHTML.includes('<img src=x'));
  ctx.malbitTravelPracticeClose();assert.equal(ctx.S.view,'home');const records=state().practice;ctx.malbitTravelStart(pack.id,true);assert.deepEqual(state().practice,records);
});
test('revealing the model is assisted practice and alternate wording is not graded wrong',()=>{
  const {ctx,screen,state,change}=harness();change(s=>s.answers['q-ticket'].selected=1);ctx.S.view='travelPlay';ctx.render();assert.ok(screen.innerHTML.includes('切符を2枚買うこと'));
  ctx.malbitTravelPracticeOpen();ctx.malbitTravelPracticeCheck();assert.deepEqual(state().practice,{});
  const now=Date.now();ctx.malbitTravelPracticeReveal();ctx.malbitTravelPracticeDraft('교통카드를 찍어요.');ctx.malbitTravelPracticeCheck();const record=state().practice['TRAVEL-A4'];assert.equal(record.unaidedMatches,0);assert.equal(record.attempts,1);assert.ok(record.nextDueAt>=now+600000&&record.nextDueAt<now+610000);
  ctx.malbitTravelPracticeClose();ctx.malbitTravelPracticeOpen();ctx.malbitTravelPracticeDraft('카드를 찍습니다.');ctx.malbitTravelPracticeCheck();assert.equal(state().practiceSession.outcome,'compare');assert.ok(screen.innerHTML.includes('文法の採点ではありません'));assert.ok(!screen.innerHTML.includes('不正解'));
});
