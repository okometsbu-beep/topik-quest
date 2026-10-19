/* Grammar evidence reducer. No DOM, storage, network, random IDs, or reward effects.
 * course may be a lessons array or {lessons:[...]}. Pass an explicit epoch-ms clock.
 * Learn sessions use practice + transfer; review uses only authored review activities.
 * Opening/finishing a lesson is not retained evidence: delayed unaided retrieval is.
 */
(function(root){
'use strict';
const VERSION=1,DAY=86400000,REVIEW_INTERVALS=Object.freeze([1,3,7,14,30]);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const safeId=v=>typeof v==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,220}$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);
const time=v=>Number.isSafeInteger(v)&&v>=0;
const clone=v=>JSON.parse(JSON.stringify(v));
const lessons=course=>Array.isArray(course)?course:Array.isArray(course?.lessons)?course.lessons:[];
const findLesson=(course,id)=>lessons(course).find(lesson=>lesson.id===id);
const stable=v=>Array.isArray(v)?'['+v.map(stable).join(',')+']':object(v)?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}':JSON.stringify(v);
const same=(a,b)=>stable(a)===stable(b);
const hash=value=>{let h=2166136261;for(const c of String(value)){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(36)};
const latest=(a,b)=>a.updatedAt>b.updatedAt?a:b.updatedAt>a.updatedAt?b:(a.revision||0)>(b.revision||0)?a:(b.revision||0)>(a.revision||0)?b:stable(a)>stable(b)?a:b;
function empty(){return{version:VERSION,currentId:null,sessions:{},legacy:{},references:{},revision:0,updatedAt:0}}
function validDraft(v){return v===null||typeof v==='string'&&v.length<=4000||Number.isSafeInteger(v)&&v>=0||Array.isArray(v)&&v.length<=100&&v.every(x=>typeof x==='string'&&x.length<=500||Number.isSafeInteger(x)&&x>=0)}
function normalizeText(v){return typeof v==='string'?v.normalize('NFC').trim().replace(/\s+/gu,' ').replace(/[.!?。！？]+$/u,'').trim():''}
function activityType(q){return q?.type||q?.kind}
function activitiesFor(lesson,mode='learn'){
 if(!Array.isArray(lesson?.activities))return[];
 return lesson.activities.filter(q=>mode==='review'?(q.phase==='review'||q.role==='construction'):q.phase!=='review');
}
function validActivity(q){
 if(!object(q)||!safeId(q.id)||q.phase!=null&&!['practice','transfer','review'].includes(q.phase))return false;
 const type=activityType(q);
 if(type==='text')return Array.isArray(q.accepted)&&q.accepted.length>0&&q.accepted.every(v=>typeof v==='string'&&normalizeText(v).length>0);
 if(type==='order')return Array.isArray(q.answer)&&q.answer.length>0&&q.answer.length<=100&&q.answer.every(v=>typeof v==='string'&&v.length>0||Number.isSafeInteger(v)&&v>=0);
 if(type==='choice'){
  if(!Array.isArray(q.options)||!q.options.length||!(typeof q.answer==='string'||Number.isSafeInteger(q.answer)))return false;
  return q.options.some((option,index)=>same(choiceValue(option,index),q.answer));
 }
 return false; // Speech and free writing have no automatic semantic grade.
}
function choiceValue(option,index){return object(option)&&own(option,'id')?option.id:option}
function ready(q,value){
 if(!validActivity(q)||!validDraft(value))return false;
 if(activityType(q)==='text')return typeof value==='string'&&normalizeText(value).length>0;
 if(activityType(q)==='choice')return q.options.some((option,index)=>same(choiceValue(option,index),value));
 if(activityType(q)==='order'){
  if(!Array.isArray(value)||value.length!==q.answer.length)return false;
  // A multiset permits repeated Korean tokens, but not missing/reused tiles.
  const tiles=Array.isArray(q.tokens)?q.tokens.map(choiceValue):Array.isArray(q.parts)?q.parts.map(choiceValue):q.answer;
  return same(value.map(stable).sort(),tiles.map(stable).sort());
 }
 return false;
}
function grade(q,value){
 if(!ready(q,value))return false;
 if(activityType(q)==='text')return q.accepted.some(answer=>normalizeText(answer)===normalizeText(value));
 return same(q.answer,value);
}
function newRecord(now){return{draft:null,help:[],attempts:[],complete:false,feedback:null,revision:0,updatedAt:now}}
function createSession(lesson,id,now=0,options={}){
 if(typeof options==='string')options={mode:options};
 const mode=options.mode||'learn',items=activitiesFor(lesson,mode);
 if(!safeId(id)||!safeId(lesson?.id)||!time(now)||!['learn','review'].includes(mode)||!items.length||!items.every(validActivity)||new Set(items.map(q=>q.id)).size!==items.length)throw new Error(mode==='review'&&!items.length?'no-review-activities':'invalid-session-input');
 return{id,lessonId:lesson.id,mode,stage:'orientation',activityIds:items.map(q=>q.id),currentActivityId:items[0].id,createdAt:now,startedAt:null,revision:0,updatedAt:now,completedAt:null,complete:false,records:Object.fromEntries(items.map(q=>[q.id,newRecord(now)]))};
}
function validRecord(r,createdAt,q){
 if(!object(r)||!validDraft(r.draft)||!Array.isArray(r.help)||r.help.length>100||!r.help.every(safeId)||new Set(r.help).size!==r.help.length||!Array.isArray(r.attempts)||r.attempts.length>10000||!time(r.revision)||!time(r.updatedAt)||r.updatedAt<createdAt||typeof r.complete!=='boolean'||![null,'correct','wrong'].includes(r.feedback))return false;
 if(!r.attempts.every(a=>object(a)&&safeId(a.id)&&time(a.at)&&a.at>=createdAt&&a.at<=r.updatedAt&&validDraft(a.answer)&&a.answer!==null&&typeof a.correct==='boolean'&&typeof a.assisted==='boolean'&&typeof a.requestedHelp==='boolean'&&(!a.requestedHelp||a.assisted)&&(!q||ready(q,a.answer)&&grade(q,a.answer)===a.correct)))return false;
 if(new Set(r.attempts.map(a=>a.id)).size!==r.attempts.length)return false;
 const success=r.attempts.some(a=>a.correct);
 if(r.complete!==success||success&&r.feedback!=='correct'||!success&&r.feedback==='correct'||r.feedback==='wrong'&&!r.attempts.some(a=>!a.correct))return false;
 return true;
}
function validSession(s,lesson){
 if(!object(s)||!safeId(s.id)||!safeId(s.lessonId)||!['learn','review'].includes(s.mode)||!['orientation','practice','summary'].includes(s.stage)||!time(s.revision)||!time(s.createdAt)||!time(s.updatedAt)||s.updatedAt<s.createdAt||!(s.startedAt===null||time(s.startedAt)&&s.startedAt>=s.createdAt&&s.startedAt<=s.updatedAt)||!Array.isArray(s.activityIds)||!s.activityIds.length||s.activityIds.length>100||!s.activityIds.every(safeId)||new Set(s.activityIds).size!==s.activityIds.length||!s.activityIds.includes(s.currentActivityId)||!object(s.records)||Object.keys(s.records).length!==s.activityIds.length||typeof s.complete!=='boolean')return false;
 if(lesson&&(lesson.id!==s.lessonId||!same(s.activityIds,activitiesFor(lesson,s.mode).map(q=>q.id))||!activitiesFor(lesson,s.mode).every(validActivity)))return false;
 if(!s.activityIds.every(id=>own(s.records,id)&&validRecord(s.records[id],s.createdAt,lesson?.activities.find(q=>q.id===id))&&s.records[id].updatedAt<=s.updatedAt))return false;
 const attemptIds=s.activityIds.flatMap(id=>s.records[id].attempts.map(a=>a.id));
 if(new Set(attemptIds).size!==attemptIds.length)return false;
 const complete=s.activityIds.every(id=>s.records[id].complete),completion=complete?Math.max(...s.activityIds.map(id=>Math.min(...s.records[id].attempts.filter(a=>a.correct).map(a=>a.at)))):null;
 if(s.complete!==complete||s.completedAt!==completion||s.stage==='summary'&&!complete)return false;
 if(s.stage==='orientation'&&(s.startedAt!==null||s.activityIds.some(id=>s.records[id].attempts.length||s.records[id].help.length||s.records[id].draft!==null)))return false;
 if(s.stage!=='orientation'&&s.startedAt===null)return false;
 const current=s.activityIds.indexOf(s.currentActivityId);
 if(s.activityIds.slice(0,current).some(id=>!s.records[id].complete))return false;
 // Concurrent branches can contribute later attempts; none may predate the begin event.
 if(s.startedAt!==null&&s.activityIds.some(id=>s.records[id].attempts.some(a=>a.at<s.startedAt)))return false;
 return true;
}
function validate(state,course){
 try{
  if(!object(state)||state.version!==VERSION||!object(state.sessions)||!object(state.legacy)||!time(state.revision)||!time(state.updatedAt)||Object.keys(state.sessions).length>20000||Object.keys(state.legacy).length>20000)return false;
  if(!Object.entries(state.sessions).every(([id,s])=>safeId(id)&&id===s?.id&&validSession(s,findLesson(course,s?.lessonId))&&s.updatedAt<=state.updatedAt))return false;
  if(state.currentId!==null&&(!safeId(state.currentId)||!own(state.sessions,state.currentId)))return false;
  if(state.references!==undefined&&(!object(state.references)||Object.keys(state.references).length>20000||!Object.entries(state.references).every(([id,times])=>safeId(id)&&Array.isArray(times)&&times.length<=20000&&times.every(time)&&new Set(times).size===times.length)))return false;
  return Object.entries(state.legacy).every(([id,e])=>safeId(id)&&object(e)&&e.source==='grammarV1'&&time(e.introducedAt)&&(e.practicedAt===null||time(e.practicedAt)&&e.practicedAt>=e.introducedAt)&&(e.draft===undefined||typeof e.draft==='string'&&e.draft.length<=4000));
 }catch(error){return false}
}
function migrate(input,legacyInput,course,now=0){
 if(!time(now))throw new Error('invalid-clock');
 if(input!=null&&!validate(input,course))throw new Error('invalid-grammar-progress');
 const out=input==null?empty():clone(input);
 if(legacyInput==null)return out;
 const old=Array.isArray(legacyInput)?{completed:legacyInput}:object(legacyInput)&&own(legacyInput,'grammarV1')?legacyInput.grammarV1:legacyInput;
 if(!object(old)||old.completed!=null&&(!Array.isArray(old.completed)||!old.completed.every(safeId))||['quizCorrect','writingDone','attempts','drafts'].some(k=>old[k]!=null&&!object(old[k])))throw new Error('invalid-legacy-grammar');
 const ids=new Set(old.completed||[]);
 for(const key of ['quizCorrect','writingDone','attempts','drafts'])for(const[id,value]of Object.entries(old[key]||{}))if(safeId(id)&&(value===true||key==='attempts'&&Number(value)>0||key==='drafts'&&typeof value==='string'&&value.trim()))ids.add(id);
 let changed=false;
 for(const id of ids){
  const completed=(old.completed||[]).includes(id),prior=out.legacy[id],draft=old.drafts?.[id];
  const entry=prior?clone(prior):{source:'grammarV1',introducedAt:now,practicedAt:null};
  if(completed&&entry.practicedAt===null)entry.practicedAt=Math.max(now,entry.introducedAt);
  if(entry.draft===undefined&&typeof draft==='string')entry.draft=draft.slice(0,4000);
  if(!prior||!same(prior,entry))changed=true;
  out.legacy[id]=entry;
 }
 if(changed){out.updatedAt=Math.max(out.updatedAt,now);out.revision++}
 return out;
}
// Keep all exposure times: a later reference must not erase evidence that an earlier
// review followed recent study. These observations never award progress or delay access.
function noteReference(input,lessonId,now=0){
 if(!validate(input)||!safeId(lessonId)||!time(now))throw new Error('invalid-grammar-progress');
 if(input.references?.[lessonId]?.includes(now))return input;
 const out=clone(input);out.references=out.references||{};
 out.references[lessonId]=[...(out.references[lessonId]||[]),now].sort((a,b)=>a-b);
 out.updatedAt=Math.max(out.updatedAt,now);out.revision++;
 if(!validate(out))throw new Error('invalid-grammar-progress');
 return out;
}
function currentActivity(session,lesson){return lesson?.activities?.find(q=>q.id===session?.currentActivityId)||null}
function transition(input,event,lesson,now=0){
 const blocked=reason=>({session:input,changed:false,reason,result:null});
 if(!validSession(input,lesson)||lesson?.id!==input.lessonId)return blocked('invalid-session');
 if(!object(event)||typeof event.type!=='string')return blocked('invalid-event');
 if(!time(now)||now<input.updatedAt)return blocked('invalid-clock');
 const s=clone(input),id=event.activityId||s.currentActivityId,r=s.records[id],q=lesson.activities.find(item=>item.id===id);
 if(event.type==='begin'){
  if(s.stage!=='orientation')return blocked('already-started');
  s.stage='practice';s.startedAt=now;s.updatedAt=now;s.revision++;
  return{session:s,changed:true,result:null};
 }
 if(event.type==='reference'){
  if(s.stage!=='practice')return blocked('inactive-activity');
  const helpId=event.id||'reference';if(!safeId(helpId))return blocked('invalid-help');
  const pending=s.activityIds.filter(activityId=>!s.records[activityId].complete&&!s.records[activityId].help.includes(helpId));
  if(!pending.length)return blocked('already-open');
  if(pending.some(activityId=>s.records[activityId].help.length>=100))return blocked('help-limit');
  for(const activityId of pending){const target=s.records[activityId];target.help.push(helpId);target.updatedAt=now;target.revision++}
  s.updatedAt=now;s.revision++;return{session:s,changed:true,result:null};
 }
 if(event.type==='continue'){
  if(s.stage!=='practice'||!s.records[s.currentActivityId].complete)return blocked('not-completed');
  const index=s.activityIds.indexOf(s.currentActivityId);
  if(index===s.activityIds.length-1)s.stage='summary';else s.currentActivityId=s.activityIds[index+1];
  s.updatedAt=now;s.revision++;return{session:s,changed:true,result:null};
 }
 if(s.stage!=='practice'||id!==s.currentActivityId||!r||!q)return blocked('inactive-activity');
 if(event.type==='submit'&&(event.submissionId||event.attemptId)){
  const supplied=event.submissionId||event.attemptId;
  if(!safeId(supplied))return blocked('invalid-submission-id');
  if(Object.values(s.records).some(record=>record.attempts.some(a=>a.id===supplied)))return blocked('duplicate-submission');
 }
 if(r.complete)return blocked('already-completed');
 let result=null;
 if(event.type==='draft'){
  if(r.feedback==='wrong')return blocked('retry-required');
  if(!validDraft(event.value))return blocked('invalid-draft');
  if(same(r.draft,event.value))return blocked('unchanged');
  r.draft=clone(event.value);
 }else if(event.type==='help'){
  const helpId=event.id||'hint';
  if(!safeId(helpId))return blocked('invalid-help');
  if(r.help.includes(helpId))return blocked('already-open');
  if(r.help.length>=100)return blocked('help-limit');
  r.help.push(helpId);
 }else if(event.type==='retry'){
  if(r.feedback!=='wrong')return blocked('no-retry');
  r.feedback=null; // Keep the learner's draft while recording all prior attempts/help.
 }else if(event.type==='submit'){
  if(r.feedback==='wrong')return blocked('retry-required');
  if(!ready(q,r.draft))return blocked('incomplete');
  if(r.attempts.length>=10000)return blocked('attempt-limit');
  const correct=grade(q,r.draft),assisted=r.help.length>0||r.attempts.length>0;
  const attempt={id:event.submissionId||event.attemptId||`attempt:${hash(s.id+':'+id)}:${r.attempts.length}:${now}:${hash(stable(r.draft))}`,at:now,answer:clone(r.draft),correct,assisted,requestedHelp:r.help.length>0};
  if(Object.values(s.records).some(record=>record.attempts.some(a=>a.id===attempt.id)))return blocked('duplicate-submission');
  r.attempts.push(attempt);r.complete=correct;r.feedback=correct?'correct':'wrong';
  s.complete=s.activityIds.every(activityId=>s.records[activityId].complete);
  if(s.complete)s.completedAt=now;
  result={correct,assisted,firstAttemptCorrect:r.attempts[0].correct,activityId:id,attempt,completed:correct,lessonCompleted:s.complete};
 }else return blocked('unknown-event');
 r.updatedAt=now;r.revision++;s.updatedAt=now;s.revision++;
 return{session:s,changed:true,result};
}
function recordSummary(r){
 const attempts=[...r.attempts].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id)),first=attempts[0],success=attempts.find(a=>a.correct);
 const independent=!!success&&attempts.length===1&&!success.assisted&&!success.requestedHelp&&!r.help.length;
 return{completed:!!success,firstAttemptCorrect:first?attempts.filter(a=>a.at===first.at).every(a=>a.correct):null,attemptCount:attempts.length,retries:Math.max(0,attempts.length-1),helpRequested:r.help.length>0,helpCount:r.help.length,independent,assisted:!!success&&!independent};
}
function summary(session){
 if(!validSession(session))return null;
 const activities=Object.fromEntries(session.activityIds.map(id=>[id,recordSummary(session.records[id])])),values=Object.values(activities);
 return{completed:session.complete,total:values.length,completedCount:values.filter(r=>r.completed).length,firstAttemptCorrect:values.filter(r=>r.firstAttemptCorrect===true).length,independent:session.complete&&values.every(r=>r.independent),assisted:values.some(r=>r.assisted||r.helpRequested||r.retries>0),activities};
}
function mergeRecord(a,b){
 const newest=latest(a,b),byId=new Map(a.attempts.map(attempt=>[attempt.id,clone(attempt)]));
 for(const attempt of b.attempts){
  const prior=byId.get(attempt.id);
  if(prior&&!same(prior,attempt)){
   // A repeated transport ID cannot silently replace a different submitted answer.
   if(prior.at!==attempt.at||prior.correct!==attempt.correct||!same(prior.answer,attempt.answer))throw new Error('conflicting-submission-id');
   byId.set(attempt.id,{...prior,assisted:prior.assisted||attempt.assisted,requestedHelp:prior.requestedHelp||attempt.requestedHelp});
  }else byId.set(attempt.id,clone(attempt));
 }
 const attempts=[...byId.values()].sort((x,y)=>x.at-y.at||x.id.localeCompare(y.id)),success=attempts.find(a=>a.correct),complete=!!success;
 return{...clone(newest),draft:success?clone(success.answer):clone(newest.draft),help:[...new Set([...a.help,...b.help])].sort(),attempts,complete,feedback:complete?'correct':newest.feedback,updatedAt:Math.max(a.updatedAt,b.updatedAt)};
}
function mergeSession(a,b){
 if(a.lessonId!==b.lessonId||a.mode!==b.mode||a.createdAt!==b.createdAt||!same(a.activityIds,b.activityIds))throw new Error('conflicting-session-id');
 const newest=latest(a,b),records=Object.fromEntries(a.activityIds.map(id=>[id,mergeRecord(a.records[id],b.records[id])])),complete=a.activityIds.every(id=>records[id].complete);
 const started=[a.startedAt,b.startedAt].filter(v=>v!==null),startedAt=started.length?Math.min(...started):null;
 let current=Math.max(a.activityIds.indexOf(a.currentActivityId),b.activityIds.indexOf(b.currentActivityId));
 while(current>0&&a.activityIds.slice(0,current).some(id=>!records[id].complete))current--;
 return{...clone(newest),records,startedAt,complete,currentActivityId:a.activityIds[current],stage:complete&&(a.stage==='summary'||b.stage==='summary')?'summary':startedAt===null?'orientation':'practice',completedAt:complete?Math.max(...a.activityIds.map(id=>Math.min(...records[id].attempts.filter(attempt=>attempt.correct).map(attempt=>attempt.at)))):null,updatedAt:Math.max(a.updatedAt,b.updatedAt)};
}
function merge(a,b,course){
 if(!validate(a,course)||!validate(b,course))throw new Error('invalid-grammar-progress');
 const out={...clone(latest(a,b)),sessions:{},legacy:{},references:{},updatedAt:Math.max(a.updatedAt,b.updatedAt)};
 for(const id of [...new Set([...Object.keys(a.sessions),...Object.keys(b.sessions)])].sort())out.sessions[id]=a.sessions[id]&&b.sessions[id]?mergeSession(a.sessions[id],b.sessions[id]):clone(a.sessions[id]||b.sessions[id]);
 for(const id of [...new Set([...Object.keys(a.legacy),...Object.keys(b.legacy)])].sort()){
  const x=a.legacy[id],y=b.legacy[id];
  if(!x||!y){out.legacy[id]=clone(x||y);continue}
  const practiced=[x.practicedAt,y.practicedAt].filter(v=>v!==null);
  out.legacy[id]={...(stable(x)>stable(y)?clone(x):clone(y)),introducedAt:Math.min(x.introducedAt,y.introducedAt),practicedAt:practiced.length?Math.min(...practiced):null};
 }
 for(const id of [...new Set([...Object.keys(a.references||{}),...Object.keys(b.references||{})])].sort())out.references[id]=[...new Set([...(a.references?.[id]||[]),...(b.references?.[id]||[])])].sort((x,y)=>x-y);
 if(!validate(out,course))throw new Error('invalid-merged-progress');
 return out;
}
function putSession(input,session,course,now=session?.updatedAt){
 if(!validate(input,course)||!validSession(session,findLesson(course,session?.lessonId))||!time(now)||now<session.updatedAt)throw new Error('invalid-grammar-progress');
 const out=clone(input),existing=out.sessions[session.id];
 out.sessions[session.id]=existing?mergeSession(existing,session):clone(session);
 out.currentId=session.id;out.updatedAt=Math.max(out.updatedAt,now);out.revision++;
 if(!validate(out,course))throw new Error('invalid-grammar-progress');
 return out;
}
function evidenceFor(state,lessonId,course,now,suppliedSessions){
 const lesson=findLesson(course,lessonId),legacy=state.legacy[lessonId],sessions=suppliedSessions||Object.values(state.sessions).filter(s=>s.lessonId===lessonId),begun=sessions.filter(s=>s.startedAt!==null);
 const introducedTimes=[...(legacy?[legacy.introducedAt]:[]),...begun.map(s=>s.startedAt)],practiceTimes=[...(legacy?.practicedAt!==null&&legacy?.practicedAt!==undefined?[legacy.practicedAt]:[]),...sessions.filter(s=>s.mode==='learn'&&s.complete).map(s=>s.completedAt)];
 const introducedAt=introducedTimes.length?Math.min(...introducedTimes):null,practicedAt=practiceTimes.length?Math.min(...practiceTimes):null;
 let retainedAt=null,retained=false,dueAt=practicedAt===null?null:practicedAt+DAY,baseline=practicedAt,successfulReviews=0,lastReviewAt=null;
 const events=[];
 for(const s of begun){
  const result=summary(s),hasAttempts=s.activityIds.some(id=>s.records[id].attempts.length),help=s.activityIds.some(id=>s.records[id].help.length);
  if(s.mode==='learn')events.push({at:s.complete?s.completedAt:s.updatedAt,session:s,result,kind:'learn'});
  else if(s.mode==='review'&&(s.complete||hasAttempts||help))events.push({at:s.complete?s.completedAt:s.updatedAt,session:s,result,kind:'review'});
 }
 events.sort((a,b)=>a.at-b.at||a.session.id.localeCompare(b.session.id));
 for(const event of events){
  const {session:s,result}=event;
  if(practicedAt===null||event.at<practicedAt)continue;
  if(event.kind==='learn'){
   baseline=Math.max(baseline,event.at);dueAt=baseline+DAY;
   if(result.assisted||s.activityIds.some(id=>s.records[id].attempts.some(a=>!a.correct))){retained=false;successfulReviews=0}
   continue;
  }
  lastReviewAt=event.at;
  const authored=!!lesson&&activitiesFor(lesson,'review').length>0&&activitiesFor(lesson,'review').every(q=>s.activityIds.includes(q.id));
  const recentReference=(state.references?.[lessonId]||[]).some(at=>at<=event.at&&at+DAY>s.startedAt);
  const delayed=baseline!==null&&s.startedAt>=baseline+DAY&&!recentReference;
  if(s.complete&&result.independent&&authored&&delayed){
   retained=true;retainedAt=retainedAt===null?event.at:Math.max(retainedAt,event.at);successfulReviews++;
  }else{
   // Early retrieval is still practice. Wrong, hinted, or corrected retrieval cannot retain.
   retained=false;successfulReviews=0;
  }
  baseline=Math.max(baseline,event.at);dueAt=baseline+REVIEW_INTERVALS[Math.min(successfulReviews,REVIEW_INTERVALS.length-1)]*DAY;
 }
 const practiced=practicedAt!==null,introduced=introducedAt!==null,reviewAvailable=!!lesson&&activitiesFor(lesson,'review').length>0;
 return{lessonId,introduced,practiced,retained,status:retained?'retained':practiced?'practiced':introduced?'introduced':'new',introducedAt,practicedAt,retainedAt,lastReviewAt,dueAt,reviewAvailable,due:practiced&&reviewAvailable&&dueAt<=now,successfulReviews,lastReferenceAt:state.references?.[lessonId]?.at(-1)??null,legacy:!!legacy,completedSessions:sessions.filter(s=>s.complete).length};
}
function progress(state,lessonId,course,now=0){
 if(!validate(state,course)||!safeId(lessonId)||!time(now))throw new Error('invalid-grammar-progress');
 return evidenceFor(state,lessonId,course,now);
}
function allProgress(state,course,now=0){
 if(!validate(state,course)||!time(now))throw new Error('invalid-grammar-progress');
 const grouped=new Map();
 for(const session of Object.values(state.sessions)){if(!grouped.has(session.lessonId))grouped.set(session.lessonId,[]);grouped.get(session.lessonId).push(session)}
 return lessons(course).map(lesson=>evidenceFor(state,lesson.id,course,now,grouped.get(lesson.id)||[]));
}
const byDue=(a,b)=>a.dueAt-b.dueAt||a.lessonId.localeCompare(b.lessonId);
function dueReviews(state,course,now=0){return allProgress(state,course,now).filter(item=>item.due).sort(byDue)}
function recommend(state,course,now=0){
 const items=lessons(course),all=allProgress(state,course,now),due=all.filter(item=>item.due).sort(byDue);
 const current=state.sessions[state.currentId];
 if(current&&!current.complete&&findLesson(course,current.lessonId))return{lessonId:current.lessonId,sessionId:current.id,mode:current.mode,reason:'resume',missingPrerequisites:[],locked:false};
 if(due.length)return{lessonId:due[0].lessonId,mode:'review',reason:'due-review',dueAt:due[0].dueAt,missingPrerequisites:[],locked:false};
 const statuses=new Map(all.map(item=>[item.lessonId,item]));
 const missing=lesson=>(lesson.prerequisites||[]).filter(id=>!statuses.get(id)?.practiced);
 const pending=items.filter(lesson=>!statuses.get(lesson.id).practiced),next=pending.find(lesson=>missing(lesson).length===0)||pending[0];
 return next?{lessonId:next.id,mode:'learn',reason:missing(next).length?'suggested-prerequisites':'next-lesson',missingPrerequisites:missing(next),locked:false}:null;
}
function rewardOpportunities(session){
 const result=summary(session);if(!result)return[];
 const opportunities=session.activityIds.filter(id=>result.activities[id].completed).map(activityId=>({id:`grammar:answer:${session.id}:${activityId}`,kind:'answer',sessionId:session.id,lessonId:session.lessonId,activityId,correct:true,assisted:result.activities[activityId].assisted,firstAttemptCorrect:result.activities[activityId].firstAttemptCorrect}));
 if(result.completed)opportunities.push({id:`grammar:lesson:${session.id}`,kind:'stage',sessionId:session.id,lessonId:session.lessonId,correct:true,assisted:result.assisted,firstAttemptCorrect:result.firstAttemptCorrect===result.total});
 return opportunities;
}
const api=Object.freeze({VERSION,DAY,REVIEW_INTERVALS,empty,validate,validSession,validActivity,validDraft,createSession,currentActivity,activitiesFor,transition,normalizeText,ready,grade,summary,migrate,noteReference,putSession,progress,allProgress,dueReviews,recommend,merge,rewardOpportunities});
root.HARUMAL_GRAMMAR_ENGINE=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
