const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=f=>fs.readFileSync(f,'utf8');
function bank(extra=null,seed={}){
 const data=new Map(Object.entries(seed)),c={console,window:{},localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))}};c.window.localStorage=c.localStorage;vm.createContext(c);
 for(let part=1;part<=4;part++)vm.runInContext(read(`data/question-bank-v1-part${part}.js`),c);
 vm.runInContext(read('data/question-bank-practice-v1.js'),c);
 if(extra)c.window.MALBIT_ORIGINAL_EXAM_PARTS=[extra];else for(let part=1;part<=4;part++)vm.runInContext(read(`data/original-exams-v1-part${part}.js`),c);
 vm.runInContext(read('data/original-support-v1.js'),c);vm.runInContext(read('question-bank-engine.js'),c);return {api:c.window.MALBIT_BANK,data,context:c};
}
const source=JSON.parse(read('content/original-exams-v1.json'));
const original=source.items;
function completeTopik1(set=1){return ['listening','reading'].flatMap(section=>Array.from({length:section==='listening'?30:40},(_,i)=>({id:`fixture-${set}-${section}-${i}`,collectionId:'original12-v1',reviewReady:true,set,level:1,section,no:section==='listening'?i+1:i+31,itemType:'content_match',difficulty:'easy',instruction:'검사 지시',prompt:`검사 ${set} ${section} ${i}`,passage:'독립 검사 문장',script:section==='listening'?'검사 대화':'',options:['하나','둘','셋','넷'],answerIndex:0,explanationKo:'검사 근거',explanationJa:'テスト根拠',targetSkills:['검사'],audioStatus:section==='listening'?'unavailable':null})));}
test('new collection retains all 2144 old IDs and leaves all old mock sets isolated',()=>{
 const {api}=bank();assert.equal(api.total,2144+original.length);assert.equal(api.items.filter(q=>q.collectionId==='legacy-original-v1').length,2144);
 for(let set=1;set<=12;set++)for(const [level,count] of [[1,70],[2,104]]){
  const old=api.mock(level,set);assert.equal(old.length,count);assert.ok(old.every(q=>q.id.startsWith('M')&&q.collectionId==='legacy-original-v1'));
 }
 const q=api.byId('O01-II-W-51'),display=api.present(q);assert.equal(display.collectionId,'original12-v1');assert.equal(display.model,q.model);assert.deepEqual(display.acceptedAnswer,q.acceptedAnswer);assert.deepEqual(display.rubric,q.rubric);assert.deepEqual(display.coach,q.coach);
});
test('authored writing coaching and original table survive adaptation without MCQ coercion',()=>{
 const {api}=bank();for(const q of original.filter(x=>x.section==='writing')){
  const actual=api.present(q.id);assert.equal(actual.answerIndex,null);assert.equal(actual.choices.length,0);
  for(const lang of ['ko','ja'])for(const key of ['reason','trap','strategy'])assert.ok(actual.explanationI18n[lang].includes(q.coach[lang][key]),`${q.id} ${lang} ${key}`);
  if(q.visual){assert.equal(actual.visual.kind,'table');assert.equal(actual.visualPending,false);}
 }
});
test('incomplete original sets cannot rotate while old sequence and keys remain unchanged',()=>{
 const {api,data}=bank(original.filter(q=>q.section==='writing'&&q.set===12),{'malbitNextMockSet:1':'11','malbitNextMockSet:2':'6'});
 assert.equal(api.mockSets(1,'original12-v1').length,12);assert.equal(api.mockSets(2,'original12-v1').length,12);
 assert.ok(api.mockSets(1,'original12-v1').every(s=>!s.ready));assert.equal(api.nextMockSet(1,'original12-v1'),null);
 assert.equal(api.nextMockSet(1),12);assert.equal(api.nextMockSet(1),1);assert.equal(data.get('malbitNextMockSet:2'),'6');
 assert.equal(data.has('malbitNextMockSet:original12-v1:1'),false);
});
test('ready original mock sets rotate independently and report missing recordings honestly',()=>{
 const {api,data}=bank([...completeTopik1(1),...completeTopik1(3)],{'malbitNextMockSet:1':'7'});
 const sets=api.mockSets(1,'original12-v1');assert.deepEqual(Array.from(sets.filter(s=>s.ready),s=>s.set),[1,3]);assert.equal(sets[0].missingAudio,30);
 assert.equal(api.nextMockSet(1,'original12-v1'),1);assert.equal(api.nextMockSet(1,'original12-v1'),3);assert.equal(api.nextMockSet(1,'original12-v1'),1);assert.equal(data.get('malbitNextMockSet:1'),'7');
 assert.equal(api.filter({level:1,collectionId:'original12-v1'}).length,140);assert.equal(api.mock(1,1).length,70);assert.equal(api.mock(1,1,null,'original12-v1').length,70);
});
test('required but missing picture keeps a numerically complete original set unavailable',()=>{
 const qs=completeTopik1();qs[0].requiresVisual=true;const {api}=bank(qs);assert.equal(api.mockSets(1,'original12-v1')[0].ready,false);assert.equal(api.mockSets(1,'original12-v1')[0].visualPending,1);assert.equal(api.nextMockSet(1,'original12-v1'),null);assert.equal(api.filter({level:1,collectionId:'original12-v1'}).length,69);
});
test('new-bank builder distinguishes partial review data from a deployable 2088-item release',async()=>{
 const {validateOriginalExams,readExistingBank}=await import('../scripts/build-original-exams.mjs');
 const result=validateOriginalExams(source,{allowPartial:true,existing:readExistingBank()});assert.equal(result.items.length,original.length);assert.equal(result.sets.length,24);assert.ok(result.sets.some(s=>!s.ready));
 assert.throws(()=>validateOriginalExams(source),/Expected 2088/);
 const duplicate=structuredClone(source);duplicate.items.push(duplicate.items[0]);assert.throws(()=>validateOriginalExams(duplicate,{allowPartial:true}),/duplicate/);
 const noCoach=structuredClone(source);noCoach.items[0].coach.ja.strategy='';assert.throws(()=>validateOriginalExams(noCoach,{allowPartial:true}),/authored ja coaching/);
 const wrongId=structuredClone(source);wrongId.items[0].id='M01-II-W-51';assert.throws(()=>validateOriginalExams(wrongId,{allowPartial:true}),/noncanonical ID/);
});

test('reviewed content hashes become stale after edits and draft items stay out of random pools',async()=>{
 const {validateOriginalExams}=await import('../scripts/build-original-exams.mjs');const changed=structuredClone(source);changed.items[0].prompt+=' 추가 조건';
 const checked=validateOriginalExams(changed,{allowPartial:true});assert.equal(checked.items[0].reviewReady,false);
 const {api}=bank(checked.items);const level=changed.items[0].level,count=checked.items.filter(q=>q.level===level).length,ready=checked.items.filter(q=>q.level===level&&q.reviewReady&&q.visualReady&&(!q.requiresVisual||q.visual)).length;assert.equal(api.filter({level,collectionId:'original12-v1'}).length,ready);assert.ok(ready<count);assert.equal(api.filter({level,collectionId:'original12-v1',includeDraft:true}).length,count);
});

test('new exam content cannot enter Shorts without a separate lexical suitability review',()=>{
 const {api}=bank();for(const level of [1,2])assert.ok(api.shorts(level).every(q=>!q.bankId.startsWith('O')));
});

test('mock readiness in a chosen locale never treats missing translations as a completed set',()=>{const {api}=bank(completeTopik1());for(const locale of ['en','zh']){const sets=api.mockSets(1,'original12-v1',locale);assert.equal(sets[0].count,70);assert.equal(sets[0].untranslated,70);assert.equal(sets[0].ready,false);assert.ok(sets.filter(s=>s.untranslated>0).every(s=>!s.ready));}assert.ok(api.mockSets(1,'legacy-original-v1','en').every(s=>s.ready));for(const locale of ['en','zh'])assert.ok(bank().api.mockSets(1,'original12-v1',locale).filter(s=>s.ready).every(s=>s.untranslated===0))});

test('new mock choice orders persist across activation with answer, visual and coaching kept together',()=>{
 const {api}=bank(),orders=api.mockChoiceOrders(2,1,null,'original12-v1'),saved=JSON.parse(JSON.stringify(orders)),ls=[],rw=[];
 assert.equal(Object.keys(orders).length,100);assert.equal(Object.keys(api.mockChoiceOrders(2,1)).length,0);
 assert.equal(api.activateTopik2Set(1,ls,rw,'original12-v1',orders),true);
 for(const q of [...ls,...rw].filter(q=>q.section!=='writing')){const raw=api.byId(q.bankId);assert.equal(q.choices[q.answerIndex],raw.options[raw.answerIndex]);assert.deepEqual(Array.from(q.choiceOrder),saved[q.bankId]);for(const choice of q.choices){assert.ok(q.coach.ko.choices[choice]);if(q.visual?.kind==='options')assert.ok(q.visual.byOption[choice].src)}}
 assert.ok([...ls,...rw].some(q=>q.section!=='writing'&&q.answerIndex!==api.byId(q.bankId).answerIndex));
 const snapshot=JSON.stringify([...ls,...rw]);assert.equal(api.activateTopik2Set(1,ls,rw,'original12-v1',saved),true);assert.equal(JSON.stringify([...ls,...rw]),snapshot);
 api.activateTopik2Set(1,ls,rw,'legacy-original-v1',orders);for(const q of [...ls,...rw].filter(q=>q.section!=='writing'))assert.deepEqual(Array.from(q.choiceOrder),[0,1,2,3]);
});

test('fresh choice order treats missing saved slots as absent, not answer slot zero',()=>{const {api}=bank();for(const answerIndex of [0,1,2,3]){const q=api.items.find(q=>q.collectionId==='original12-v1'&&q.section!=='writing'&&q.answerIndex===answerIndex);assert.ok(q);const order=api.freshOrder(q.id);assert.notEqual(order.indexOf(answerIndex),answerIndex)}});

test('random and game pools withhold original questions missing the selected-language support',()=>{const {api,context}=bank();for(const lang of ['ko','ja','en','zh']){context.S={lang};for(const level of [1,2]){const pool=api.filter({level});assert.ok(pool.filter(q=>q.collectionId==='original12-v1').every(q=>q.localesReady.includes(lang)));assert.ok(api.gamePool(level,1).filter(q=>q.collectionId==='original12-v1').every(q=>q.localesReady.includes(lang)));assert.equal(pool.filter(q=>q.collectionId==='legacy-original-v1').length,api.items.filter(q=>q.collectionId==='legacy-original-v1'&&q.level===level).length)}}context.S.lang='ko';const untranslated=api.items.find(q=>q.collectionId==='original12-v1'&&!q.localesReady.includes('en'));assert.ok(untranslated);assert.ok(!api.filter({level:untranslated.level,locale:'en'}).some(q=>q.id===untranslated.id));assert.ok(api.filter({level:untranslated.level,locale:'ko'}).some(q=>q.id===untranslated.id));});
