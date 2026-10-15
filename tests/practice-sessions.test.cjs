const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=file=>fs.readFileSync(file,'utf8');
const line=(file,start)=>read(file).split('\n').find(row=>row.startsWith(start));
function part(file,start,end){const source=read(file),from=source.indexOf(start);assert.ok(from>=0,start);const to=source.indexOf(end,from+start.length);assert.ok(to>from,end);return source.slice(from,to)}
function node(){const classes=new Set();return{innerHTML:'',textContent:'',dataset:{},style:{},attrs:{},children:[],observers:[],classList:{add(value){classes.add(value)},remove(value){classes.delete(value)},contains(value){return classes.has(value)}},setAttribute(k,v){this.attrs[k]=v},appendChild(child){this.children.push(child)},prepend(child){this.children.unshift(child)},querySelector(selector){const attr=selector.match(/^(?:button)?\[([^=\]]+)(?:="([^"]*)")?\]$/);return attr?this.children.find(child=>Object.hasOwn(child.attrs,attr[1])&&(attr[2]==null||child.attrs[attr[1]]===attr[2]))||null:null},querySelectorAll(){return[]}}}
function boot({listening='off',mix='writing'}={}){
 const values=new Map([['malbitProductPrefsV1',JSON.stringify({listeningMode:listening,randomMix:mix,learningPath:'beginner'})],['topikQuestExamLevel','2'],['vocabulary-preservation','saved']]);
 const nodes={screen:node(),sheetBody:node(),overlay:node(),resultCurtain:node(),drum:node(),resultCard:node()},again=node(),close=node();nodes.sheetBody.querySelector=q=>q==='.primary'?again:q==='.closeBtn'?close:null;
 let resultActions=null;Object.defineProperty(nodes.resultCard,'innerHTML',{get(){return this.markup||''},set(value){this.markup=value;resultActions=value.includes('class="resultActions"')?node():null;if(resultActions)for(const action of["closeResult();HARUMAL_GROWTH.open('topik')","closeResult();setView('review')","closeResult();setView('home')"]){const button=node();button.setAttribute('onclick',action);resultActions.appendChild(button)}for(const callback of this.observers)callback()}});nodes.resultCard.querySelector=selector=>selector==='.resultActions'?resultActions:null;
 const rows=[];for(const level of[1,2])for(const section of['listening','reading'])for(let i=1;i<=16;i++)rows.push({id:`${level}-${section}-${i}`,level,section,no:i,answerIndex:1,difficulty:'easy',options:['a','b','c','d']});
 for(let i=0;i<12;i++)rows.push({id:`2-writing-${i}`,level:2,section:'writing',no:51+i%4,options:[]});
 rows.push({id:'not-exam-writing',level:2,section:'writing',no:1,options:[]});
 const c={console,Math,Date,MutationObserver:class{constructor(fn){this.callback=fn}observe(target){target.observers.push(this.callback)}},Q:null,BANK:null,A:rows.filter(q=>q.level===1),S:{view:'home',lang:'en',writing:{},vocab:[{text:'saved'}]},SESSION:'topikQuestTopik1Session',prefs:{randomMix:mix},LANGS:{en:{flag:'US'}},localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)},document:{head:node(),body:node(),documentElement:node(),createElement:node,getElementById:id=>nodes[id]||null,querySelector(){return null},querySelectorAll(){return[]}},setTimeout:fn=>{c.pending.push(fn);return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},pending:[],render(){},stopTimer(){c.stops++},stopAudio(){},stopListeningAudio(){},stops:0,toast(){},save(){values.set('topikQuestV8',JSON.stringify(c.S))},closeSheet(){},closeResult(){},ml:(ko,ja,en)=>en,tr:x=>x,fmt:x=>String(x),rewardQuestion(){c.rewardCalls++},rewardLegacyAnswer(){c.rewardCalls++},rewardCalls:0,rememberWriting(){},playDrumRoll(){},writingEstimate:()=>0,LS:Array.from({length:50},(_,i)=>({id:i+1,answerIndex:1})),RW:Array.from({length:54},(_,i)=>({id:i+1,answerIndex:1})),elapsed:()=>4,infLimit:()=>60,selected:null,HARUMAL_REWARDS:{newSession:()=>`reward-${++c.rewardSessions}`},rewardSessions:0,HARUMAL_HUB:{openAreas(mode,level){c.opened={mode,level};c.setView(mode==='mock'?'mockAreas':'randomAreas')},selectArea(area){c.selectedArea=area;c.setView('mockReady')}}};
 c.window=c;c.$=id=>nodes[id];c.open=c.setView=v=>{c.S.view=v;c.save();c.render()};
 const recent=new Map();c.MALBIT_BANK=c.BANK={filter:opts=>rows.filter(q=>q.level===opts.level&&opts.sections.includes(q.section)&&!opts.exclude?.includes(q.id)),draw(opts){return this.filter(opts)[0]},byId:id=>rows.find(q=>q.id===id),present(id,order){const q=typeof id==='string'?this.byId(id):id;return{...q,bankId:q.id,answerIndex:1,choiceOrder:order||[0,1,2,3]}},freshOrder:()=>[0,1,2,3],readRecent:key=>recent.get(key)||[],remember(key,id){recent.set(key,[...(recent.get(key)||[]),id])},nextMockSet:()=>1};
 c.find=id=>c.MALBIT_BANK.present(id);c.cur=()=>c.find(c.Q.ids[c.Q.i]);c.pool=k=>rows.filter(q=>q.level===1&&(k==='full'||q.section===k));c.restore=()=>c.Q;c.clearQ=()=>{c.Q=null};c.infinityDifficulties=()=>['medium'];c.infinityCurrentQuestion=()=>c.MALBIT_BANK.present(c.S.infinity.current.bankId);c.activateTopik2BankSet=()=>true;
 vm.createContext(c);const run=src=>vm.runInContext(src,c),load=file=>run(read(file));
 run(line('topik1.js','function saveQ()'));
 run(line('topik1.js','window.t1Begin='));
 run(part('topik1.js','function practiceDifficulty()','window.t1ExitRandom='));
 run(part('topik1.js','window.t1Next=()=>{','window.t1Prev='));
 run(part('topik1.js','function finish(){','function game1BossSkillDelay('));
 for(const name of['startRandomPractice','nextInfinity','submitInfinity','infTimeout','finishInfinity','beginReal','exitRandomPractice','finishReal','showSectionResult','showResultCeremony','closeResult'])run(line('legacy-core.js',`function ${name}(`));
 c.tqStartMode=()=>{c.mixedStarts=(c.mixedStarts||0)+1};c.t1ExitRandom=()=>c.setView('home');
 run(part('product-polish.js','// TOPIK II random practice:','function writingMinimum('));
 // Load the real listening gates, including their legacy mixed-mode policy.
 run(read('app-polish-v33.js').split('function patchStatsLanguage()')[0]+'\ninstallListeningGates();})();');
 c.submitInfinityWriting=()=>{c.S.infinity.count++;c.S.infinity.writing++;c.S.infinity.feedback={write:true};c.render()};
 load('practice-sessions.js');
 return{c,values,rows,nodes,again,close,run,load};
}
test('TOPIK I explicit areas stay pure for ten questions, finish, restart and back',()=>{
 for(const area of['listening','reading']){
  const e=boot(),{c,values}=e;assert.equal(c.HARUMAL_PRACTICE.startRandom(1,area),true);const ids=[];
  for(let i=0;i<10;i++){
   assert.equal(c.Q.practiceSession.area,area);const id=c.Q.ids[0];ids.push(id);assert.equal(c.MALBIT_BANK.byId(id).section,area);
   c.Q.answers[id]=1;c.t1Next();assert.equal(c.Q.total,i+1);c.t1Next();
  }
  assert.equal(c.S.view,'t1result');assert.equal(new Set(ids).size,10);assert.equal(c.Q.result.total,10);assert.equal(c.rewardCalls,10);
  assert.equal(c.HARUMAL_PRACTICE.getActive().completed,true);c.HARUMAL_PRACTICE.restart();assert.equal(c.Q.total,0);assert.equal(c.Q.practiceSession.area,area);assert.equal(c.rewardCalls,10);
  c.HARUMAL_PRACTICE.back();assert.equal(c.S.view,'randomAreas');assert.equal(c.opened.level,1);assert.equal(values.get('vocabulary-preservation'),'saved');assert.equal(JSON.parse(values.get('malbitProductPrefsV1')).listeningMode,'off');assert.equal(JSON.parse(values.get('malbitProductPrefsV1')).learningPath,'beginner');
 }
});
test('TOPIK II area sessions bypass writing mix and first-three bias through all ten questions',()=>{
 for(const area of['listening','reading','writing']){
  const {c,again,close}=boot();assert.equal(c.HARUMAL_PRACTICE.startRandom(2,area),true);const inf=c.S.infinity,ids=[];
  assert.equal(inf.practiceSession.size,10);assert.equal(inf.count,0);assert.equal(c.rewardCalls,0);
  for(let i=0;i<10;i++){
   const q=c.MALBIT_BANK.byId(inf.current.bankId);assert.equal(q.section,area);if(area==='writing')assert.ok(q.no>=51&&q.no<=54);ids.push(q.id);
   const before=inf.current;c.nextInfinity();assert.equal(inf.current,before,'unanswered Next cannot skip');
   if(area==='writing'){c.submitInfinityWriting();c.submitInfinityWriting();assert.equal(inf.count,i+1,'repeat writing submit is not another question')}
   else {c.selected=1;c.submitInfinity();assert.equal(inf.count,i+1)}
   c.nextInfinity();
  }
  assert.equal(new Set(ids).size,10);assert.equal(inf.count,10);assert.equal(inf.practiceSession.completed,true);assert.equal(again.attrs.onclick,'HARUMAL_PRACTICE.restart()');assert.equal(close.attrs.onclick,'HARUMAL_PRACTICE.back()');
  c.nextInfinity();assert.equal(inf.count,10);c.HARUMAL_PRACTICE.restart();assert.equal(c.S.infinity.practiceSession.area,area);assert.equal(c.S.infinity.count,0);c.HARUMAL_PRACTICE.back();assert.equal(c.S.view,'randomAreas');assert.equal(c.opened.level,2);
 }
});
test('random metadata and writing filter survive a reload without starting a mixed session',()=>{
 const e=boot(),{c,load}=e;c.HARUMAL_PRACTICE.startRandom('II','writing');const inf=JSON.parse(JSON.stringify(c.S.infinity));c.S.infinity=inf;load('practice-sessions.js');c.infTimeout();c.nextInfinity();assert.equal(c.S.infinity.count,1);assert.equal(c.S.infinity.current.type,'write');assert.equal(c.HARUMAL_PRACTICE.getActive().area,'writing');
});
test('mock sections start only on confirmed API call and explicit listening beats off or ask',()=>{
 for(const listening of['off','ask'])for(const level of[1,2])for(const area of['listening','reading',...(level===2?['writing']:[]),'full']){
  const {c,values}=boot({listening});c.S.view='mockReady';assert.equal(c.S.real,undefined);assert.equal(c.Q,null);assert.equal(c.rewardSessions,0);
  const before=Date.now();assert.equal(c.HARUMAL_PRACTICE.startMock(level,area),true);const q=level===1?c.Q:c.S.real;
  assert.equal(q.practiceSession.area,area);assert.equal(q.practiceSession.mode,'mock');assert.equal(c.S.view,level===1?'t1quiz':'real');assert.equal(c.rewardCalls,0);assert.equal(c.rewardSessions,1);
  if(level===1){assert.equal(q.kind,area);assert.ok(q.started>=before);assert.equal(q.duration,c.HARUMAL_PRACTICE.mockInfo(level,area).minutes*60)}
  else {assert.equal(q.mode,area==='full'?'full':{listening:'listen',reading:'read',writing:'write'}[area]);assert.ok(q.deadline>before)}
  c.HARUMAL_PRACTICE.restart();assert.equal(c.S.view,'mockReady');assert.equal(c.selectedArea,area);assert.equal(c.rewardSessions,1,'restart must wait for readiness again');assert.equal(JSON.parse(values.get('malbitProductPrefsV1')).listeningMode,listening);
 }
});
test('invalid area choices do not mutate state; legacy mixed starts stay available',()=>{
 const {c,values}=boot({listening:'on',mix:'lr'}),original=JSON.stringify(c.S);assert.equal(c.HARUMAL_PRACTICE.startRandom(1,'writing'),false);assert.equal(c.HARUMAL_PRACTICE.startMock(1,'writing'),false);assert.equal(c.HARUMAL_PRACTICE.startRandom(3,'reading'),false);assert.equal(c.HARUMAL_PRACTICE.startRandom(2,'unknown'),false);assert.equal(JSON.stringify(c.S),original);
 c.HARUMAL_PRACTICE.startRandom(2);assert.equal(c.S.infinity.practiceSession,undefined);assert.ok(['listen','read'].includes(c.S.infinity.current.type));assert.equal(values.get('vocabulary-preservation'),'saved');
});
test('legacy full mocks retain listening preference; explicit legacy listening is honored',()=>{
 const {c}=boot();c.t1Begin('full');assert.equal(c.Q.kind,'reading');c.t1Begin('listening');assert.equal(c.Q.kind,'listening');c.beginReal('full');assert.equal(c.S.real.mode,'read');c.beginReal('listen');assert.equal(c.S.real.mode,'listen');
});

test('finishing early blocks stale answers/timeouts and reopens the same result after render',()=>{
 const {c,nodes}=boot();c.HARUMAL_PRACTICE.startRandom(2,'reading');c.finishInfinity();c.selected=1;c.submitInfinity();c.infTimeout();assert.equal(c.S.infinity.count,0);nodes.sheetBody.innerHTML='';c.render();assert.match(nodes.sheetBody.innerHTML,/RANDOM PRACTICE RESULT/);assert.equal(c.S.infinity.practiceSession.area,'reading');
});

test('completed TOPIK II section/full mock results keep same-area restart and Back after async construction',()=>{
 for(const area of['listening','reading','writing','full']){
  const {c,nodes,run}=boot();c.HARUMAL_PRACTICE.startMock(2,area);c.finishReal();assert.equal(c.HARUMAL_PRACTICE.getActive().completed,true);assert.equal(nodes.resultCurtain.classList.contains('open'),true);
  assert.equal(nodes.resultCard.querySelector('.resultActions'),null,'result actions do not exist during the drum roll');
  assert.equal(c.pending.length,1);c.pending.shift()();const actions=nodes.resultCard.querySelector('.resultActions');
  assert.ok(actions.querySelector('[onclick="closeResult();setView(\'review\')"]'),'Review stays available');assert.ok(actions.querySelector('[onclick="closeResult();HARUMAL_GROWTH.open(\'topik\')"]'),'Growth stays available');
  const again=actions.querySelector('[data-practice-restart]'),back=actions.querySelector('[data-practice-result-back]');assert.ok(again);assert.ok(back);
  const rewards=c.rewardCalls,deadline=c.S.real.deadline;c.finishReal();assert.equal(c.rewardCalls,rewards);run(again.attrs.onclick);assert.equal(c.S.view,'mockReady');assert.equal(c.selectedArea,area);assert.equal(nodes.resultCurtain.classList.contains('open'),false,'restart closes the curtain');assert.equal(c.S.real.deadline,deadline,'readiness does not restart the timer');assert.equal(c.rewardCalls,rewards);
  c.HARUMAL_PRACTICE.startMock(2,area);c.finishReal();c.pending.shift()();run(nodes.resultCard.querySelector('.resultActions').querySelector('[data-practice-result-back]').attrs.onclick);assert.equal(c.S.view,'mockAreas');assert.equal(c.opened.level,2);assert.equal(nodes.resultCurtain.classList.contains('open'),false);
 }
});
test('completed TOPIK I mocks also restart through readiness in the selected area',()=>{
 const {c,nodes}=boot();c.HARUMAL_PRACTICE.startMock(1,'listening');c.Q.result={total:0};c.saveQ();c.S.view='t1result';c.render();assert.equal(c.HARUMAL_PRACTICE.getActive().completed,true);assert.ok(nodes.screen.querySelector('[data-practice-restart]'));const started=c.Q.started;c.HARUMAL_PRACTICE.restart();assert.equal(c.S.view,'mockReady');assert.equal(c.selectedArea,'listening');assert.equal(c.Q.started,started);
});
