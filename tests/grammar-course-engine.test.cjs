const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const E=require('../grammar-course-engine.js');
const clone=value=>JSON.parse(JSON.stringify(value));
const course={stages:[{id:'foundation'},{id:'bridge'}],lessons:[
 {id:'particle',stage:'foundation',prerequisites:[],activities:[
  {id:'particle-meaning',type:'choice',phase:'practice',options:[{id:'subject',text:'주어'},{id:'object',text:'목적어'}],answer:'subject'},
  {id:'particle-build',type:'order',phase:'practice',tokens:['저는','물을','마셔요'],answer:['저는','물을','마셔요']},
  {id:'particle-transfer',type:'text',phase:'transfer',accepted:['동생이 와요','동생이 옵니다']},
  {id:'particle-review',type:'text',phase:'review',accepted:['친구가 와요']}
 ]},
 {id:'contrast',stage:'bridge',prerequisites:['particle'],activities:[
  {id:'contrast-practice',type:'text',phase:'practice',accepted:['춥지만 좋아요']},
  {id:'contrast-transfer',type:'choice',phase:'transfer',options:[{id:'but'},{id:'because'}],answer:'but'},
  {id:'contrast-review',type:'choice',phase:'review',options:[{id:'despite'},{id:'therefore'}],answer:'despite'}
 ]},
 {id:'legacy-only',stage:'foundation',prerequisites:[],activities:[{id:'legacy-drill',type:'text',accepted:['학생이에요']}]}
]};
const lesson=id=>course.lessons.find(item=>item.id===id);
let serial=0;
const answer=q=>clone(q.accepted?.[0]??q.answer);
function event(session,type,extra={},at=session.updatedAt+1){const result=E.transition(session,{type,...extra},lesson(session.lessonId),at);assert.ok(result.changed,`${type}: ${result.reason}`);return result.session}
function solve(id='particle',start=100,options={}){
 let s=E.createSession(lesson(id),options.id||`session-${++serial}`,start,{mode:options.mode||'learn'});
 s=event(s,'begin');
 for(const activityId of s.activityIds){
  const q=E.currentActivity(s,lesson(id));
  if(options.help)s=event(s,'help',{id:'hint'});
  if(options.wrong){
   const value=q.type==='choice'?q.options.find(item=>item.id!==q.answer).id:q.type==='order'?[...q.answer].reverse():'틀린 답';
   s=event(s,'draft',{value});s=event(s,'submit');s=event(s,'retry');
  }
  s=event(s,'draft',{value:answer(q)});s=event(s,'submit');s=event(s,'continue');
 }
 return s;
}
const save=(state,s)=>E.putSession(state,s,course,s.updatedAt);

test('browser and CommonJS exports expose the same pure API without DOM/storage',()=>{
 const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../grammar-course-engine.js'),'utf8'),context);
 assert.equal(typeof context.window.HARUMAL_GRAMMAR_ENGINE.transition,'function');
 assert.equal(Object.isFrozen(E),true);
 assert.equal(E.validate(E.empty(),course),true);
});

test('learn uses practice and transfer; review selects distinct authored retrieval only',()=>{
 const s=E.createSession(lesson('particle'),'stable',100),review=E.createSession(lesson('particle'),'later',200,{mode:'review'});
 assert.deepEqual(s.activityIds,['particle-meaning','particle-build','particle-transfer']);
 assert.deepEqual(review.activityIds,['particle-review']);
 assert.equal(E.currentActivity(s,lesson('particle')).id,'particle-meaning');
 assert.throws(()=>E.createSession(lesson('legacy-only'),'no-review',300,{mode:'review'}),/no-review-activities/);
 assert.equal(E.transition(s,{type:'submit'},lesson('particle'),101).reason,'inactive-activity');
});

test('gates advance on completed activity, preserves final feedback before summary, and records no opening reward',()=>{
 let s=E.createSession(lesson('particle'),'gates',0);
 assert.deepEqual(E.rewardOpportunities(s),[]);
 assert.equal(E.transition(s,{type:'continue'},lesson('particle'),1).reason,'not-completed');
 s=event(s,'begin');
 assert.equal(E.transition(s,{type:'draft',activityId:'particle-transfer',value:'동생이 와요'},lesson('particle'),2).reason,'inactive-activity');
 for(let i=0;i<s.activityIds.length;i++){
  s=event(s,'draft',{value:answer(E.currentActivity(s,lesson('particle')))});s=event(s,'submit');
  assert.equal(s.stage,'practice');assert.equal(s.records[s.currentActivityId].feedback,'correct');
  if(i===s.activityIds.length-1){assert.equal(s.complete,true);assert.equal(s.currentActivityId,'particle-transfer')}
  s=event(s,'continue');
 }
 assert.equal(s.stage,'summary');assert.equal(E.validSession(s,lesson('particle')),true);
 assert.equal(E.summary(s).independent,true);
 assert.equal(E.rewardOpportunities(s).length,4);
});

test('choice/order/exact text grading is bounded, NFC tolerant, and does not claim free semantics',()=>{
 const q=lesson('particle').activities;
 assert.equal(E.grade(q[0],'subject'),true);assert.equal(E.grade(q[0],'목적어'),false);assert.equal(E.ready(q[0],'made-up'),false);
 assert.equal(E.grade(q[1],['저는','물을','마셔요']),true);assert.equal(E.grade(q[1],['물을','저는','마셔요']),false);assert.equal(E.ready(q[1],['저는','저는','마셔요']),false);
 assert.equal(E.grade(q[2],'  동생이   와요.  '),true);assert.equal(E.grade(q[2],'동생이 옵니다!'),true);assert.equal(E.grade(q[2],'동생이 와요'.normalize('NFD')),true);
 assert.equal(E.grade(q[2],'제 동생이 찾아와요'),false);assert.equal(E.grade(q[2],'동생이 안 와요'),false);assert.equal(E.grade(q[2],{}),false);
 for(const type of ['speech','freewriting','self-check'])assert.equal(E.grade({id:'unsupported',type,accepted:['yes']},'yes'),false);
 const repeated={id:'repeated',type:'order',answer:['가','가','나']};assert.equal(E.grade(repeated,['가','가','나']),true);assert.equal(E.ready(repeated,['가','나','나']),false);
});

test('wrong, corrected, and hinted success remain assisted and first-attempt truth survives',()=>{
 const wrong=solve('particle',100,{wrong:true}),hinted=solve('particle',100,{help:true});
 for(const s of [wrong,hinted]){
  assert.equal(E.summary(s).independent,false);assert.equal(E.summary(s).assisted,true);
  assert.ok(E.rewardOpportunities(s).every(item=>item.assisted));
  assert.equal(E.progress(save(E.empty(),s),'particle',course,10000).status,'practiced');
 }
 const r=E.summary(wrong).activities['particle-transfer'];assert.equal(r.firstAttemptCorrect,false);assert.equal(r.retries,1);
 assert.equal(E.summary(hinted).activities['particle-transfer'].firstAttemptCorrect,true);
 assert.equal(E.summary(hinted).activities['particle-transfer'].helpRequested,true);
});

test('a wrong answer requires retry, retains the draft, and cannot be resubmitted as a duplicate',()=>{
 let s=E.createSession(lesson('particle'),'retry',100);s=event(s,'begin');s=event(s,'draft',{value:'object'});s=event(s,'submit',{submissionId:'transport-one'});
 assert.equal(E.transition(s,{type:'submit',submissionId:'transport-one'},lesson('particle'),104).reason,'duplicate-submission');
 assert.equal(E.transition(s,{type:'draft',value:'subject'},lesson('particle'),104).reason,'retry-required');
 assert.equal(E.transition(s,{type:'submit'},lesson('particle'),104).reason,'retry-required');
 s=event(s,'retry');assert.equal(s.records['particle-meaning'].draft,'object');s=event(s,'draft',{value:'subject'});s=event(s,'submit',{submissionId:'transport-two'});
 assert.equal(s.records['particle-meaning'].attempts.length,2);assert.equal(s.records['particle-meaning'].attempts[1].assisted,true);
 assert.equal(E.transition(s,{type:'submit',submissionId:'transport-two'},lesson('particle'),110).changed,false);
});

test('same exact reducer inputs give identical IDs/results and submissions/reward opportunities are idempotent',()=>{
 let s=E.createSession(lesson('particle'),'deterministic',100);s=event(s,'begin');s=event(s,'draft',{value:'subject'});
 const a=E.transition(s,{type:'submit'},lesson('particle'),103),b=E.transition(clone(s),{type:'submit'},lesson('particle'),103);
 assert.deepEqual(a,b);assert.equal(E.transition(a.session,{type:'submit'},lesson('particle'),104).changed,false);
 const state=save(E.empty(),a.session),joined=E.merge(state,clone(state),course);
 assert.deepEqual(E.rewardOpportunities(joined.sessions.deterministic),E.rewardOpportunities(a.session));assert.equal(joined.sessions.deterministic.records['particle-meaning'].attempts.length,1);
});

test('draft, hints, wrong feedback and stable task/session IDs survive JSON reload',()=>{
 let s=E.createSession(lesson('particle'),'reload',100);s=event(s,'begin');s=event(s,'help',{id:'rule'});s=event(s,'draft',{value:'object'});s=event(s,'submit');
 const state=save(E.empty(),s),restored=E.migrate(clone(state),null,course,1000);
 assert.deepEqual(restored,state);assert.equal(E.validate(restored,course),true);
 s=restored.sessions.reload;assert.deepEqual(s.records['particle-meaning'].help,['rule']);assert.equal(s.records['particle-meaning'].feedback,'wrong');assert.equal(s.records['particle-meaning'].draft,'object');
 s=event(s,'retry',{},1001);s=event(s,'draft',{value:'subject'});s=event(s,'submit');assert.equal(E.summary(s).activities['particle-meaning'].independent,false);
});

test('legacy completion migrates additively to practiced, never retained or synthetic reward evidence',()=>{
 const old={grammarV1:{completed:['particle','unknown-old'],quizCorrect:{contrast:true},drafts:{contrast:'춥지만'},attempts:{contrast:2},writingDone:{particle:true},writingUnits:{particle:[0,1]},rewardAttempts:{particle:{sessionId:'keep'}}}},before=clone(old);
 const state=E.migrate(null,old,course,1000),p=E.progress(state,'particle',course,1000);
 assert.equal(p.introduced,true);assert.equal(p.practiced,true);assert.equal(p.retained,false);assert.equal(p.status,'practiced');assert.equal(p.dueAt,1000+E.DAY);
 assert.equal(state.legacy.contrast.draft,'춥지만');assert.equal(E.progress(state,'contrast',course,1000).status,'introduced');assert.ok(state.legacy['unknown-old']);assert.deepEqual(state.sessions,{});assert.deepEqual(old,before);
 assert.deepEqual(E.migrate(state,old,course,2000),state);
 const upgrade=E.migrate(state,{completed:['contrast']},course,3000);assert.equal(upgrade.legacy.contrast.practicedAt,3000);assert.equal(upgrade.updatedAt,3000);assert.equal(state.legacy.contrast.practicedAt,null);
});

test('opening alone is new, beginning is introduced, all practice+transfer yields practiced',()=>{
 let s=E.createSession(lesson('particle'),'levels',100),state=save(E.empty(),s);
 assert.equal(E.progress(state,'particle',course,100).status,'new');s=event(s,'begin');state=save(state,s);assert.equal(E.progress(state,'particle',course,101).status,'introduced');
 state=save(state,solve('particle',200));assert.equal(E.progress(state,'particle',course,1000).status,'practiced');assert.equal(E.progress(state,'particle',course,1000).retained,false);
});

test('delayed first-attempt unaided review supplies retained evidence and advances due interval',()=>{
 const learned=solve('particle',100),state=save(E.empty(),learned),before=E.progress(state,'particle',course,learned.completedAt+E.DAY-1);
 assert.equal(before.due,false);assert.equal(E.dueReviews(state,course,learned.completedAt+E.DAY).length,1);
 const review=solve('particle',learned.completedAt+E.DAY,{mode:'review'}),updated=save(state,review),after=E.progress(updated,'particle',course,review.completedAt);
 assert.equal(after.status,'retained');assert.equal(after.retainedAt,review.completedAt);assert.equal(after.successfulReviews,1);assert.equal(after.dueAt,review.completedAt+3*E.DAY);
 const again=solve('particle',after.dueAt,{mode:'review'}),twice=E.progress(save(updated,again),'particle',course,again.completedAt);assert.equal(twice.successfulReviews,2);assert.equal(twice.dueAt,again.completedAt+7*E.DAY);
});

test('same-session retries, help and early or advance-open review cannot manufacture retention',()=>{
 for(const options of [{wrong:true},{help:true},{early:true},{advance:true}]){
  const learned=solve('particle',100);let state=save(E.empty(),learned),review;
  if(options.advance){
   review=E.createSession(lesson('particle'),`advance-${++serial}`,learned.completedAt+1,{mode:'review'});review=event(review,'begin');review=event(review,'draft',{value:'친구가 와요'},learned.completedAt+E.DAY+1);review=event(review,'submit');review=event(review,'continue');
  }else review=solve('particle',learned.completedAt+(options.early?10:E.DAY),{...options,mode:'review'});
  state=save(state,review);const p=E.progress(state,'particle',course,review.completedAt);assert.equal(p.retained,false,JSON.stringify(options));assert.equal(p.status,'practiced');assert.equal(p.dueAt,review.completedAt+E.DAY);
 }
});

test('review without prior practiced evidence cannot skip instruction or claim retained',()=>{
 const review=solve('particle',E.DAY*10,{mode:'review'}),p=E.progress(save(E.empty(),review),'particle',course,E.DAY*11);
 assert.equal(p.status,'introduced');assert.equal(p.practiced,false);assert.equal(p.retained,false);assert.equal(p.dueAt,null);
});

test('a later failed retrieval lowers current retained status while retaining historical evidence',()=>{
 const learned=solve(),review=solve('particle',learned.completedAt+E.DAY,{mode:'review'});let state=save(save(E.empty(),learned),review);
 let failed=E.createSession(lesson('particle'),'lapse',review.completedAt+3*E.DAY,{mode:'review'});failed=event(failed,'begin');failed=event(failed,'draft',{value:'다른 답'});failed=event(failed,'submit');state=save(state,failed);
 const p=E.progress(state,'particle',course,failed.updatedAt);assert.equal(p.retained,false);assert.equal(p.retainedAt,review.completedAt);assert.equal(p.status,'practiced');assert.equal(p.dueAt,failed.updatedAt+E.DAY);
});

test('legacy completion needs newly delayed retrieval; no review variant gives no fake due task',()=>{
 let state=E.migrate(null,{completed:['particle','legacy-only']},course,500);
 assert.equal(E.progress(state,'legacy-only',course,E.DAY*3).due,false);assert.equal(E.progress(state,'legacy-only',course,E.DAY*3).reviewAvailable,false);
 const review=solve('particle',500+E.DAY,{mode:'review'});state=save(state,review);assert.equal(E.progress(state,'particle',course,review.completedAt).retained,true);
});

test('recommendations respect prerequisites but never lock, prioritize resume then due review',()=>{
 assert.equal(E.recommend(E.empty(),course,100).lessonId,'particle');
 const reordered={lessons:[lesson('contrast'),lesson('particle')]};assert.equal(E.recommend(E.empty(),reordered,100).lessonId,'particle');
 const onlyDependent={lessons:[lesson('contrast')]},suggestion=E.recommend(E.empty(),onlyDependent,100);assert.deepEqual(suggestion.missingPrerequisites,['particle']);assert.equal(suggestion.locked,false);
 let state=save(E.empty(),solve('particle',100));assert.equal(E.recommend(state,course,200).lessonId,'contrast');assert.equal(E.recommend(state,course,E.DAY*2).reason,'due-review');
 const pending=E.createSession(lesson('contrast'),'unfinished',E.DAY*2);state=save(state,pending);assert.equal(E.recommend(state,course,E.DAY*2).reason,'resume');
 assert.doesNotThrow(()=>E.createSession(lesson('contrast'),'explore',100));
 assert.equal(E.recommend(E.empty(),[],100),null);
});

test('cross-tab merge preserves independent sessions, legacy progress, drafts and assistance',()=>{
 let a=E.migrate(null,{completed:['particle']},course,100),b=E.migrate(null,{completed:['legacy-only']},course,200);
 let left=E.createSession(lesson('contrast'),'left-tab',300);left=event(left,'begin');left=event(left,'draft',{value:'춥지만'});a=save(a,left);
 const right=solve('particle',400);b=save(b,right);
 const joined=E.merge(a,b,course);assert.equal(Object.keys(joined.sessions).length,2);assert.equal(joined.sessions['left-tab'].records['contrast-practice'].draft,'춥지만');assert.ok(joined.legacy.particle);assert.ok(joined.legacy['legacy-only']);assert.equal(joined.sessions[right.id].complete,true);
 assert.deepEqual(E.merge(a,b,course),E.merge(b,a,course));assert.deepEqual(E.merge(joined,joined,course),joined);
});

test('concurrent wrong/correct attempts union conservatively instead of inventing independent success',()=>{
 let base=E.createSession(lesson('particle'),'same-tab-session',100);base=event(base,'begin');
 let wrong=event(base,'draft',{value:'object'},102),correct=event(base,'draft',{value:'subject'},102);wrong=event(wrong,'submit',{},103);correct=event(correct,'submit',{},103);
 assert.notEqual(wrong.records['particle-meaning'].attempts[0].id,correct.records['particle-meaning'].attempts[0].id);
 const a=save(E.empty(),wrong),b=save(E.empty(),correct),joined=E.merge(a,b,course),s=joined.sessions['same-tab-session'];
 assert.equal(s.records['particle-meaning'].attempts.length,2);assert.equal(s.records['particle-meaning'].complete,true);assert.equal(E.summary(s).activities['particle-meaning'].independent,false);assert.equal(E.validate(joined,course),true);
 assert.deepEqual(E.merge(a,b,course),E.merge(b,a,course));
});

test('sequential edits in one millisecond survive save merges and invalid clock goes nowhere',()=>{
 let s=E.createSession(lesson('contrast'),'same-clock',100),state=save(E.empty(),s);s=event(s,'begin',{},100);state=save(state,s);s=event(s,'draft',{value:'z'},100);state=save(state,s);s=event(s,'draft',{value:'a'},100);state=save(state,s);
 assert.equal(state.sessions['same-clock'].records['contrast-practice'].draft,'a');assert.equal(E.transition(s,{type:'draft',value:'b'},lesson('contrast'),99).reason,'invalid-clock');
});

test('malformed progress is rejected without rewriting or discarding the original data',()=>{
 const state=save(E.empty(),solve()),mutations=[
  x=>x.version=2,x=>x.sessions[Object.keys(x.sessions)[0]].id='other',x=>x.sessions[Object.keys(x.sessions)[0]].records['particle-meaning'].attempts.push(null),
  x=>x.sessions[Object.keys(x.sessions)[0]].records['particle-meaning'].attempts[0].correct='true',x=>x.sessions[Object.keys(x.sessions)[0]].records['particle-meaning'].attempts[0].answer='object',
  x=>x.sessions[Object.keys(x.sessions)[0]].complete=false,x=>x.sessions[Object.keys(x.sessions)[0]].startedAt=null,x=>x.currentId='missing',x=>x.legacy.bad={source:'grammarV1',introducedAt:0,practicedAt:-1}
 ];
 for(const mutate of mutations){const corrupt=clone(state);mutate(corrupt);const before=clone(corrupt);assert.equal(E.validate(corrupt,course),false);assert.throws(()=>E.migrate(corrupt,null,course,1000),/invalid-grammar-progress/);assert.deepEqual(corrupt,before);assert.throws(()=>E.merge(state,corrupt,course))}
 for(const bad of [null,{},[],{version:99},'broken'])assert.equal(E.validate(bad,course),false);
 assert.throws(()=>E.migrate(null,{completed:['__proto__']},course,100),/invalid-legacy/);
 assert.throws(()=>E.createSession(lesson('particle'),'__proto__',100));
 assert.equal({}.polluted,undefined);
});

test('malformed events/drafts are rejected, and inputs remain untouched on success',()=>{
 let s=E.createSession(lesson('particle'),'immutability',100);s=event(s,'begin');const before=clone(s);
 const result=E.transition(s,{type:'draft',value:'subject'},lesson('particle'),102);assert.deepEqual(s,before);assert.equal(result.changed,true);
 for(const value of [undefined,{},()=>{},NaN,Infinity,'x'.repeat(4001),Array(101).fill('x')])assert.equal(E.transition(s,{type:'draft',value},lesson('particle'),102).changed,false);
 assert.equal(E.transition(s,null,lesson('particle'),102).changed,false);assert.equal(E.transition(s,{type:'submit',submissionId:'__proto__'},lesson('particle'),102).changed,false);
});

test('course array and object contracts are equivalent and have no fixed lesson-count dependency',()=>{
 const state=save(E.empty(),solve());assert.deepEqual(E.progress(state,'particle',course,1000),E.progress(state,'particle',course.lessons,1000));assert.deepEqual(E.dueReviews(state,course,E.DAY*2),E.dueReviews(state,course.lessons,E.DAY*2));
 const many={lessons:Array.from({length:420},(_,i)=>({id:`lesson-${i}`,activities:[{id:`activity-${i}`,type:'text',accepted:['답']}]}))};assert.equal(E.recommend(E.empty(),many,0).lessonId,'lesson-0');
});

test('removing transfer activities from a saved session cannot fake practice completion',()=>{
 const s=solve(),state=save(E.empty(),s),bad=clone(state),record=bad.sessions[s.id];
 record.activityIds=['particle-meaning'];record.records={'particle-meaning':record.records['particle-meaning']};record.currentActivityId='particle-meaning';record.completedAt=record.records['particle-meaning'].attempts[0].at;
 assert.equal(E.validSession(record),true);assert.equal(E.validate(bad,course),false);assert.throws(()=>E.migrate(bad,null,course,1000));
});

test('recent uncompleted study also delays review eligibility, including after cross-tab merge',()=>{
 const learned=solve('particle',100);let state=save(E.empty(),learned);
 let restudy=E.createSession(lesson('particle'),'restudy',learned.completedAt+E.DAY);restudy=event(restudy,'begin');restudy=event(restudy,'help',{id:'model'});
 const other=save(clone(state),restudy),review=solve('particle',restudy.updatedAt+10,{mode:'review'});state=save(state,review);
 const joined=E.merge(state,other,course),p=E.progress(joined,'particle',course,review.completedAt);
 assert.equal(p.retained,false);assert.equal(p.dueAt,review.completedAt+E.DAY);
});

test('merged correct feedback keeps a correct answer visible while retaining the concurrent wrong attempt',()=>{
 let base=E.createSession(lesson('particle'),'race-answer',100);base=event(base,'begin');
 let right=event(base,'draft',{value:'subject'},102);right=event(right,'submit',{},103);
 let wrong=event(base,'draft',{value:'object'},104);wrong=event(wrong,'submit',{},105);
 const joined=E.merge(save(E.empty(),right),save(E.empty(),wrong),course).sessions['race-answer'];
 assert.equal(joined.records['particle-meaning'].draft,'subject');assert.equal(joined.records['particle-meaning'].feedback,'correct');assert.equal(joined.records['particle-meaning'].attempts.length,2);
});

test('batch progress agrees with per-lesson progress and retains unknown historical lessons',()=>{
 const state=save(E.migrate(null,{completed:['retired-lesson']},course,50),solve());
 assert.deepEqual(E.allProgress(state,course,E.DAY*2),course.lessons.map(item=>E.progress(state,item.id,course,E.DAY*2)));
 assert.equal(E.progress(state,'retired-lesson',course,E.DAY*2).status,'practiced');assert.ok(E.merge(state,E.empty(),course).legacy['retired-lesson']);
});

test('full-reference exposure marks every unfinished task without advancing or changing completed evidence',()=>{
 let s=E.createSession(lesson('particle'),'reference-event',100);s=event(s,'begin');s=event(s,'draft',{value:'subject'});s=event(s,'submit');
 const first=clone(s.records['particle-meaning']);s=event(s,'reference');assert.equal(s.currentActivityId,'particle-meaning');assert.deepEqual(s.records['particle-meaning'],first);assert.ok(s.records['particle-build'].help.includes('reference'));assert.ok(s.records['particle-transfer'].help.includes('reference'));
 assert.equal(E.validSession(s,lesson('particle')),true);assert.equal(E.transition(s,{type:'reference'},lesson('particle'),s.updatedAt+1).reason,'already-open');
});

test('pre-session reference exposure prevents immediate retention without hiding a due review',()=>{
 let state=E.migrate(null,{completed:['particle']},course,100),at=100+E.DAY+1;state=E.noteReference(state,'particle',at);
 assert.equal(E.progress(state,'particle',course,at).due,true);assert.equal(E.dueReviews(state,course,at).length,1);
 const immediate=solve('particle',at+1,{mode:'review'});state=save(state,immediate);assert.equal(E.progress(state,'particle',course,immediate.completedAt).retained,false);
 const later=solve('particle',immediate.completedAt+E.DAY,{mode:'review'});state=save(state,later);assert.equal(E.progress(state,'particle',course,later.completedAt).retained,true);
});

test('reference history is additive and merge-safe; later reads cannot erase earlier assistance evidence',()=>{
 const base=E.migrate(null,{completed:['particle']},course,100),at=100+E.DAY+1,a=E.noteReference(base,'particle',at),b=E.noteReference(base,'particle',at+10),joined=E.merge(a,b,course);
 assert.deepEqual(joined.references.particle,[at,at+10]);assert.deepEqual(E.merge(a,b,course),E.merge(b,a,course));assert.deepEqual(E.merge(joined,joined,course),joined);
 const review=solve('particle',at+11,{mode:'review'});let state=save(joined,review);assert.equal(E.progress(state,'particle',course,review.completedAt).retained,false);
 state=E.noteReference(state,'particle',review.completedAt+E.DAY*2);assert.equal(E.progress(state,'particle',course,review.completedAt+E.DAY*2).retained,false);
 const noLedger=clone(base);delete noLedger.references;assert.equal(E.validate(noLedger,course),true);assert.deepEqual(E.merge(noLedger,a,course).references.particle,[at]);
 for(const references of [{particle:['today']},{particle:[1,1]},[],JSON.parse('{"__proto__":[1]}')])assert.equal(E.validate({...base,references},course),false);
});
