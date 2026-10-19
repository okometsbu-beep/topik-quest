const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=f=>fs.readFileSync(f,'utf8');
function boot(seed={},lang='ja',options={}){
 const storage=options.storage||new Map(Object.entries(seed)),screen={innerHTML:'',className:''},results={innerHTML:''},notice={hidden:true,textContent:''},submit={disabled:true},events={};let now=options.now??100000000,seq=0,failSave=false,writes=0,rewardCalls=0;
 const c={console,S:{view:'home',lang},Date:class extends Date{static now(){return now}},crypto:{randomUUID:()=>`${options.tabId||'tab'}-${++seq}`},localStorage:{getItem:k=>storage.get(k)??null,setItem(k,v){if(failSave)throw Error('quota');writes++;storage.set(k,String(v))}},document:{querySelector:()=>submit,getElementById:id=>id==='screen'?screen:id==='gcResults'?results:id==='gcSaveWarning'?notice:null},render(){},navActive(){},addEventListener:(type,fn)=>events[type]=fn,malbitGrammarSpeak(){},malbitGrammarLesson(id){c.handwriting=id},HARUMAL_REWARDS:{answer(){rewardCalls++},stage(){rewardCalls++}}};c.window=c;c.setView=v=>{c.S.view=v;c.render()};vm.createContext(c);
 for(const f of ['data/beginner-grammar-v1.js',...(options.packs?fs.readdirSync('data').filter(f=>/^grammar-course-.+\.js$/.test(f)).map(f=>'data/'+f):[]),'data/grammar-course.js','grammar-course-engine.js','grammar-course-feedback.js'])vm.runInContext(read(f),c);
 if(options.course)c.HARUMAL_GRAMMAR_COURSE=JSON.parse(JSON.stringify(options.course));
 vm.runInContext(read('grammar-course.js'),c);
 const click=(action,extra={})=>screen.onclick({target:{closest:()=>({disabled:false,dataset:{gcAction:action,...extra}})}});
 const input=(id,value)=>screen.oninput({target:{id,value}});
 return{c,storage,screen,events,click,input,notice,submit,tick:ms=>now+=ms,clock:()=>now,writes:()=>writes,rewardCalls:()=>rewardCalls,setFail:value=>failSave=value};
}
const T=value=>({ko:value,ja:value,en:value,zh:value});
const fixture={stages:[{id:'1',title:T('Stage 1')}],lessons:[
 {id:'alpha',stage:'1',title:T('Alpha grammar'),goal:T('Use the target'),formula:'A + B',meaning:T('A meaning'),activities:[
  {id:'alpha-practice',type:'text',phase:'practice',prompt:T('Build it'),contextKorean:'조건',accepted:['정답'],explanation:T('Specific formation reasoning')},
  {id:'alpha-transfer',type:'choice',phase:'transfer',prompt:T('New setting'),options:[{id:'yes',text:'맞아요',feedback:T('Correct new setting')},{id:'no',text:'아니에요',feedback:T('Wrong condition')}],answer:'yes',explanation:T('Choose the matching condition')},
  {id:'alpha-review-one',type:'text',phase:'review',prompt:T('Recall one'),accepted:['복습 하나'],explanation:T('First recall reasoning')},
  {id:'alpha-review-two',type:'text',phase:'review',prompt:T('Recall two'),accepted:['복습 둘'],explanation:T('Second recall reasoning')}
 ]},
 {id:'ordered',stage:'1',title:T('Order grammar'),goal:T('Put it in order'),activities:[
  {id:'ordered-practice',type:'order',phase:'practice',prompt:T('Arrange words'),tokens:[{id:'who',text:'저는'},{id:'what',text:'물을'},{id:'verb',text:'마셔요'}],answer:['who','what','verb'],explanation:T('Put the verb last')}
 ]}
]};
const clone=value=>JSON.parse(JSON.stringify(value));
function finish(b){
 const E=b.c.HARUMAL_GRAMMAR_ENGINE,D=b.c.HARUMAL_GRAMMAR.course;
 for(let i=0;i<20;i++){
  const state=b.c.HARUMAL_GRAMMAR.getState(),s=state.sessions[state.currentId];if(s.stage==='summary')return;
  const a=E.currentActivity(s,D.lessons.find(l=>l.id===s.lessonId));
  if(a.type==='text')b.input('gcAnswer',a.accepted[0]);else if(a.type==='choice')b.click('choice',{value:a.answer});else for(const value of a.answer)b.click('order',{index:String(a.tokens.findIndex(t=>(typeof t==='object'?t.id:t)===value))});
  b.click('submit');b.click('continue');
 }
 throw Error('session did not finish');
}
test('new course keeps old64 identities and four-language authored guidance',()=>{
 for(const lang of ['ko','ja','en','zh']){const b=boot({},lang);b.c.malbitOpenGrammar();assert.equal(b.c.S.view,'grammarCourse');assert.match(b.screen.innerHTML,/gcSearch/);assert.equal(b.c.HARUMAL_GRAMMAR.course.lessons.length,64);b.click('lesson',{id:'sentence-order'});assert.ok(b.screen.innerHTML.includes(b.c.HARUMAL_GRAMMAR.course.lessons.find(x=>x.id==='sentence-order').goal[lang]));assert.match(b.screen.innerHTML,/data-gc-action="handwriting"/);assert.equal(b.storage.size,0)}
});
test('original completed records migrate without deletion, fake retention or required handwriting',()=>{
 const saved=JSON.stringify({known:['가'],grammarV1:{completed:['copula'],quizCorrect:{copula:true},writingDone:{copula:true},drafts:{topic:'저는'}}}),b=boot({malbitBeginnerV1:saved});const E=b.c.HARUMAL_GRAMMAR_ENGINE,D=b.c.HARUMAL_GRAMMAR.course;
 assert.equal(E.progress(b.c.HARUMAL_GRAMMAR.getState(),'copula',D,100000000).status,'practiced');b.c.malbitOpenGrammar();b.click('lesson',{id:'sentence-order'});b.click('start',{id:'sentence-order'});b.input('gcAnswer','저는 한국어를 공부해요');b.click('submit');assert.match(b.screen.innerHTML,/gcFeedback correct/);b.click('continue');assert.match(b.screen.innerHTML,/gcSummary/);assert.equal(b.storage.get('malbitBeginnerV1'),saved);assert.equal(E.progress(b.c.HARUMAL_GRAMMAR.getState(),'sentence-order',D,100000000).status,'practiced');
});
test('wrong answers require explicit retry, retain drafts, and mark later help',()=>{
 const b=boot();b.c.malbitOpenGrammar();b.click('lesson',{id:'sentence-order'});b.click('start',{id:'sentence-order'});b.input('gcAnswer','틀린 문장');b.click('submit');assert.match(b.screen.innerHTML,/data-gc-action="retry"/);assert.match(b.screen.innerHTML,/動作「공부해요」を最後/);b.click('retry');b.click('help');b.input('gcAnswer','저는 한국어를 공부해요');b.click('submit');const s=Object.values(b.c.HARUMAL_GRAMMAR.getState().sessions)[0];assert.equal(s.records[s.currentActivityId].attempts.length,2);assert.equal(s.records[s.currentActivityId].attempts[1].assisted,true);assert.match(b.screen.innerHTML,/gcFeedback correct/);
});
test('interrupted exercise resumes while catalog opens a completed reference normally',()=>{
 const b=boot();b.c.malbitOpenGrammar();b.click('lesson',{id:'sentence-order'});b.click('start',{id:'sentence-order'});b.input('gcAnswer','저는 한국어');b.click('leave');assert.match(b.screen.innerHTML,/data-gc-action="resume"/);b.click('resume');assert.match(b.screen.innerHTML,/value="저는 한국어"/);const restored=boot(Object.fromEntries(b.storage));restored.c.malbitOpenGrammar();restored.click('resume');assert.match(restored.screen.innerHTML,/value="저는 한국어"/);restored.click('leave');restored.click('lesson',{id:'sentence-order'});assert.match(restored.screen.innerHTML,/gcInstruction/);assert.doesNotMatch(restored.screen.innerHTML,/gcTask/);
});
test('malformed progress remains intact and import requires valid evidence',()=>{const raw='{broken',b=boot({harumalGrammarCourseV1:raw});b.c.malbitOpenGrammar();assert.match(b.screen.innerHTML,/上書きしていません/);b.click('lesson',{id:'copula'});b.click('start',{id:'copula'});assert.equal(b.storage.get('harumalGrammarCourseV1'),raw);assert.throws(()=>b.c.HARUMAL_GRAMMAR.validateImport('{}'))});
test('course is covered by offline shell and non-destructive backup/restore',()=>{for(const f of ['storage-guard.js','product-polish.js'])assert.ok(read(f).includes("'harumalGrammarCourseV1'"));assert.match(read('product-polish.js'),/HARUMAL_GRAMMAR.validateImport/);assert.match(read('product-polish.js'),/HARUMAL_GRAMMAR.mergeImport/);for(const f of ['grammar-course.css','data/grammar-course.js','grammar-course-engine.js','grammar-course.js'])assert.ok(read('sw.js').includes(f));assert.doesNotMatch(read('grammar-course.js'),/localStorage\.(removeItem|clear)/)});

test('leaving a review to read its reference records help for every unfinished activity',()=>{
 const b=boot({},'en',{course:fixture});b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'alpha'});finish(b);b.click('catalog');b.tick(86400001);b.click('review');
 const before=b.c.HARUMAL_GRAMMAR.getState(),id=before.currentId;b.click('leave');b.click('lesson',{id:'alpha'});assert.match(b.screen.innerHTML,/gcInstruction/);b.click('resume');finish(b);
 const state=b.c.HARUMAL_GRAMMAR.getState(),s=state.sessions[id],p=b.c.HARUMAL_GRAMMAR_ENGINE.progress(state,'alpha',fixture,b.clock());
 assert.equal(p.retained,false);assert.ok(Object.values(s.records).every(r=>r.help.includes('reference')));assert.ok(Object.values(s.records).every(r=>r.attempts[0].assisted));
});

test('whole-lesson help also covers later activities while unaided delayed review can retain',()=>{
 const b=boot({},'en',{course:fixture});b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'alpha'});b.click('help');finish(b);
 let state=b.c.HARUMAL_GRAMMAR.getState();assert.ok(Object.values(state.sessions[state.currentId].records).every(r=>r.help.includes('explanation')));
 b.click('catalog');b.tick(86400001);b.click('review');finish(b);state=b.c.HARUMAL_GRAMMAR.getState();assert.equal(b.c.HARUMAL_GRAMMAR_ENGINE.progress(state,'alpha',fixture,b.clock()).retained,true);
});

test('per-lesson start resumes its saved draft after visiting another lesson; restart is explicit',()=>{
 const b=boot();b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'sentence-order'});b.input('gcAnswer','저는 한국어');const first=b.c.HARUMAL_GRAMMAR.getState().currentId;
 b.click('leave');b.click('start',{id:'copula'});b.input('gcAnswer','학생');b.click('leave');b.click('lesson',{id:'sentence-order'});assert.match(b.screen.innerHTML,/練習を再開/);b.click('start',{id:'sentence-order'});
 let state=b.c.HARUMAL_GRAMMAR.getState();assert.equal(state.currentId,first);assert.equal(Object.keys(state.sessions).length,2);assert.match(b.screen.innerHTML,/value="저는 한국어"/);
 b.click('restart',{id:'sentence-order'});state=b.c.HARUMAL_GRAMMAR.getState();assert.notEqual(state.currentId,first);assert.equal(Object.keys(state.sessions).length,3);assert.equal(state.sessions[first].records[state.sessions[first].currentActivityId].draft,'저는 한국어');
});

test('storage events durably write the lost-write union and keep each tab on its own task',()=>{
 const storage=new Map(),a=boot({},'en',{storage,tabId:'a'}),b=boot({},'en',{storage,tabId:'b'});
 a.c.HARUMAL_GRAMMAR.open();b.c.HARUMAL_GRAMMAR.open();a.click('start',{id:'sentence-order'});a.input('gcAnswer','draft A');const aRaw=storage.get('harumalGrammarCourseV1');
 storage.delete('harumalGrammarCourseV1');b.click('start',{id:'copula'});b.input('gcAnswer','draft B');const bRaw=storage.get('harumalGrammarCourseV1');
 a.events.storage({key:'harumalGrammarCourseV1',newValue:bRaw});b.events.storage({key:'harumalGrammarCourseV1',newValue:aRaw});
 const union=JSON.parse(storage.get('harumalGrammarCourseV1'));assert.equal(Object.keys(union.sessions).length,2);assert.match(a.screen.innerHTML,/value="draft A"/);assert.match(b.screen.innerHTML,/value="draft B"/);
 const writes=a.writes()+b.writes(),raw=storage.get('harumalGrammarCourseV1');a.events.storage({key:'harumalGrammarCourseV1',newValue:raw});b.events.storage({key:'harumalGrammarCourseV1',newValue:raw});assert.equal(a.writes()+b.writes(),writes);
 const restored=boot({},'en',{storage});assert.equal(Object.keys(restored.c.HARUMAL_GRAMMAR.getState().sessions).length,2);
});

test('an already-open reference in another tab marks a newly received unfinished review as assisted',()=>{
 const b=boot({},'en',{course:fixture});b.c.HARUMAL_GRAMMAR.open();b.click('lesson',{id:'alpha'});
 const E=b.c.HARUMAL_GRAMMAR_ENGINE;let s=E.createSession(fixture.lessons[0],'remote-review',b.clock(),{mode:'review'});s=E.transition(s,{type:'begin'},fixture.lessons[0],b.clock()).session;
 const incoming=E.putSession(E.empty(),s,fixture,b.clock());b.storage.set('harumalGrammarCourseV1',JSON.stringify(incoming));b.events.storage({key:'harumalGrammarCourseV1',newValue:JSON.stringify(incoming)});
 const saved=JSON.parse(b.storage.get('harumalGrammarCourseV1'));assert.ok(Object.values(saved.sessions['remote-review'].records).every(r=>r.help.includes('reference')));
});

test('merged success uses correct feedback even if a concurrent wrong submission was later',()=>{
 const b=boot({},'en',{course:fixture});b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'alpha'});const E=b.c.HARUMAL_GRAMMAR_ENGINE,base=b.c.HARUMAL_GRAMMAR.getState(),id=base.currentId;
 b.input('gcAnswer','정답');b.click('submit');b.tick(10);
 let wrong=E.transition(base.sessions[id],{type:'draft',value:'오답'},fixture.lessons[0],b.clock()).session;wrong=E.transition(wrong,{type:'submit'},fixture.lessons[0],b.clock()).session;
 const incoming=E.putSession(base,wrong,fixture,b.clock());b.events.storage({key:'harumalGrammarCourseV1',newValue:JSON.stringify(incoming)});
 assert.match(b.screen.innerHTML,/gcFeedback correct/);assert.doesNotMatch(b.screen.innerHTML,/gcFeedback wrong/);assert.match(b.screen.innerHTML,/value="정답"/);assert.match(b.screen.innerHTML,/data-gc-action="continue"/);
});

test('object order tiles submit stable IDs, display labels and cannot be reused beyond availability',()=>{
 const b=boot({},'en',{course:fixture});b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'ordered'});b.click('order',{index:'0'});b.click('order',{index:'0'});
 let state=b.c.HARUMAL_GRAMMAR.getState(),s=state.sessions[state.currentId];assert.deepEqual(clone(s.records['ordered-practice'].draft),['who']);assert.match(b.screen.innerHTML,/저는/);
 b.click('order',{index:'1'});b.click('order',{index:'2'});b.click('submit');assert.match(b.screen.innerHTML,/gcFeedback correct/);
 b.click('restart',{id:'ordered'});for(const index of ['2','1','0'])b.click('order',{index});b.click('submit');assert.match(b.screen.innerHTML,/저는 물을 마셔요/);assert.doesNotMatch(b.screen.innerHTML,/>who what verb</);
});

test('summary promises later recall only for lessons with authored review activities',()=>{
 const old=boot({},'en');old.c.HARUMAL_GRAMMAR.open();old.click('start',{id:'sentence-order'});finish(old);assert.match(old.screen.innerHTML,/no separate recall exercise yet/);assert.doesNotMatch(old.screen.innerHTML,/later with a new task/);
 const extended=boot({},'en',{course:fixture});extended.c.HARUMAL_GRAMMAR.open();extended.click('start',{id:'alpha'});finish(extended);assert.match(extended.screen.innerHTML,/later with a new task/);
});

test('legacy migration is saved once so reload cannot postpone its due review forever',()=>{
 const legacy=JSON.stringify({grammarV1:{completed:['alpha']}}),storage=new Map([['malbitBeginnerV1',legacy]]),first=boot({},'en',{course:fixture,storage,now:100000000});
 const migrated=first.c.HARUMAL_GRAMMAR.getState();assert.equal(migrated.legacy.alpha.practicedAt,100000000);assert.ok(storage.has('harumalGrammarCourseV1'));
 const second=boot({},'en',{course:fixture,storage,now:100000000+86400001}),state=second.c.HARUMAL_GRAMMAR.getState();assert.equal(state.legacy.alpha.practicedAt,100000000);assert.equal(second.c.HARUMAL_GRAMMAR_ENGINE.progress(state,'alpha',fixture,second.clock()).due,true);assert.equal(storage.get('malbitBeginnerV1'),legacy);
});

test('empty malformed storage is not silently replaced, and failed draft saves warn without dropping input',()=>{
 const corrupt=boot({harumalGrammarCourseV1:''},'en');corrupt.c.HARUMAL_GRAMMAR.open();corrupt.click('start',{id:'sentence-order'});corrupt.input('gcAnswer','draft');assert.equal(corrupt.storage.get('harumalGrammarCourseV1'),'');
 const b=boot({},'en');b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'sentence-order'});b.setFail(true);b.input('gcAnswer','unsaved draft');assert.equal(b.notice.hidden,false);assert.match(b.notice.textContent,/Could not save/);const state=b.c.HARUMAL_GRAMMAR.getState();assert.equal(state.sessions[state.currentId].records[state.sessions[state.currentId].currentActivityId].draft,'unsaved draft');
});

test('render, restore and imported completions do not manufacture reward transactions',()=>{
 const b=boot({},'en',{course:fixture});b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'alpha'});finish(b);const raw=JSON.stringify(b.c.HARUMAL_GRAMMAR.getState()),other=boot({},'en',{course:fixture});
 other.c.HARUMAL_GRAMMAR.mergeImport(raw);other.c.HARUMAL_GRAMMAR.open();other.c.HARUMAL_GRAMMAR.render();assert.equal(other.rewardCalls(),0);assert.equal(b.rewardCalls(),1);
 const restored=boot({harumalGrammarCourseV1:raw},'en',{course:fixture});restored.c.HARUMAL_GRAMMAR.open();assert.equal(restored.rewardCalls(),0);
});

test('authored context and worked-source translations render in the chosen language as escaped text',()=>{
 const data=clone(fixture);data.lessons[0].activities[0].contextMeaning={ko:'한국어 조건',ja:'日本語の条件 <img src=x>',en:'English condition',zh:'中文条件'};data.lessons[0].workedExamples=[{source:'가다',sourceMeaning:{ko:'한국어 원형',ja:'日本語の原形 <b>go</b>',en:'English source',zh:'中文原形'},result:'가요',explanation:T('Explanation')}];
 const b=boot({},'ja',{course:data});b.c.HARUMAL_GRAMMAR.open();b.click('lesson',{id:'alpha'});assert.match(b.screen.innerHTML,/日本語の原形 &lt;b&gt;go&lt;\/b&gt;/);assert.doesNotMatch(b.screen.innerHTML,/<b>go<\/b>/);
 b.click('start',{id:'alpha'});assert.match(b.screen.innerHTML,/日本語の条件 &lt;img src=x&gt;/);assert.doesNotMatch(b.screen.innerHTML,/<img src=x>/);assert.doesNotMatch(b.screen.innerHTML,/English condition/);
});

test('reading instructions before a due review stays accessible and records immediate recall as practice',()=>{
 const b=boot({},'en',{course:fixture});b.c.HARUMAL_GRAMMAR.open();b.click('start',{id:'alpha'});finish(b);b.click('catalog');b.tick(86400001);
 b.click('lesson',{id:'alpha'});b.click('catalog');assert.match(b.screen.innerHTML,/1 reviews due/);b.click('review');finish(b);
 const state=b.c.HARUMAL_GRAMMAR.getState(),p=b.c.HARUMAL_GRAMMAR_ENGINE.progress(state,'alpha',fixture,b.clock());assert.equal(p.status,'practiced');assert.equal(state.references.alpha.length,1);assert.match(b.screen.innerHTML,/This practice is recorded/);
});

test('two open reference tabs do not mint fresh exposures or trigger a storage-write loop',()=>{
 const storage=new Map(),a=boot({},'en',{course:fixture,storage,tabId:'reference-a'}),b=boot({},'en',{course:fixture,storage,tabId:'reference-b'});
 a.c.HARUMAL_GRAMMAR.open();b.c.HARUMAL_GRAMMAR.open();a.click('lesson',{id:'alpha'});b.tick(10);b.click('lesson',{id:'alpha'});
 for(let i=0;i<3;i++){const raw=storage.get('harumalGrammarCourseV1');a.events.storage({key:'harumalGrammarCourseV1',newValue:raw});b.events.storage({key:'harumalGrammarCourseV1',newValue:raw});a.tick(10);b.tick(10)}
 const before=a.writes()+b.writes(),raw=storage.get('harumalGrammarCourseV1');a.events.storage({key:'harumalGrammarCourseV1',newValue:raw});b.events.storage({key:'harumalGrammarCourseV1',newValue:raw});assert.equal(a.writes()+b.writes(),before);assert.equal(JSON.parse(raw).references.alpha.length,2);
});

test('loaded curriculum teaches model assembly then independent construction and later full-sentence retrieval',()=>{const b=boot({},'ja',{packs:true}),E=b.c.HARUMAL_GRAMMAR_ENGINE;b.c.HARUMAL_GRAMMAR.open();b.click('lesson',{id:'sentence-order'});b.click('start',{id:'sentence-order'});assert.match(b.screen.innerHTML,/gcModel/);assert.equal(b.c.HARUMAL_GRAMMAR_FEEDBACK.skills(b.c.HARUMAL_GRAMMAR.getState(),b.c.HARUMAL_GRAMMAR.course.lessons[0]).constructed,false);finish(b);const state=b.c.HARUMAL_GRAMMAR.getState(),l=b.c.HARUMAL_GRAMMAR.course.lessons.find(l=>l.id==='sentence-order');assert.equal(b.c.HARUMAL_GRAMMAR_FEEDBACK.skills(state,l).constructed,true);assert.equal(E.progress(state,l.id,b.c.HARUMAL_GRAMMAR.course,b.clock()).retained,false);assert.equal(b.rewardCalls(),2);b.tick(25*60*60*1000);b.c.HARUMAL_GRAMMAR.open();b.click('review');const reviewing=b.c.HARUMAL_GRAMMAR.getState(),session=reviewing.sessions[reviewing.currentId];assert.ok(session.activityIds.some(id=>l.activities.find(a=>a.id===id)?.role==='construction'));assert.match(b.screen.innerHTML,/前に練習した場面/);assert.doesNotMatch(b.screen.innerHTML,/class="gcModel"/);finish(b);assert.equal(E.progress(b.c.HARUMAL_GRAMMAR.getState(),l.id,b.c.HARUMAL_GRAMMAR.course,b.clock()).retained,true);assert.equal(b.rewardCalls(),3)});
