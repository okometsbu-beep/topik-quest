/* Pure reducer: no DOM, storage or reward side effects. */
(function(root){
'use strict';
const stages=['orientation','learn','learn-complete','transfer','summary'];
const engineNonce=Math.random().toString(36).slice(2);let attemptSequence=0;
const copy=value=>JSON.parse(JSON.stringify(value));
const record=()=>({draft:null,help:[],attempts:[],heard:false,complete:false,updatedAt:0});
const empty=()=>({version:1,currentId:null,sessions:{},visible:false,section:'all',updatedAt:0});
const safeId=value=>typeof value==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,220}$/.test(value)&&!['__proto__','constructor','prototype'].includes(value);
const time=value=>Number.isFinite(value)&&value>=0;
function validDraft(d){return d===null||typeof d==='string'&&d.length<=500||Array.isArray(d)&&d.length<=30&&d.every(v=>typeof v==='string'&&v.length<=100)||!!d&&typeof d==='object'&&!Array.isArray(d)&&Object.keys(d).length<=30&&Object.entries(d).every(([k,v])=>safeId(k)&&typeof v==='string'&&v.length<=100);}
function validRecord(r){if(!r||!validDraft(r.draft)||!Array.isArray(r.help)||r.help.length>30||!r.help.every(safeId)||!Array.isArray(r.attempts)||r.attempts.length>1000||typeof r.complete!=='boolean'||typeof r.heard!=='boolean'||!time(r.updatedAt))return false;
 if(!r.attempts.every(a=>a&&safeId(a.id)&&time(a.at)&&typeof a.correct==='boolean'&&typeof a.assisted==='boolean'&&typeof a.requestedHelp==='boolean'&&validDraft(a.answer)))return false;
 if(new Set(r.attempts.map(a=>a.id)).size!==r.attempts.length)return false;
 if(r.complete!==r.attempts.some(a=>a.correct))return false;
 if(r.rewardIntent&&(!r.complete||typeof r.rewardIntent.answer!=='boolean'||typeof r.rewardIntent.stage!=='boolean'))return false;
 return true;
}
function validSession(s){if(!s||!safeId(s.id)||!safeId(s.recipeId)||!stages.includes(s.stage)||!time(s.createdAt)||!time(s.updatedAt)||!s.records||!['learn','transfer'].every(p=>validRecord(s.records[p])))return false;
 const learn=s.records.learn.complete,transfer=s.records.transfer.complete;
 if(transfer&&!learn||s.records.transfer.attempts.length&&!learn)return false;
 if(s.stage==='summary')return learn&&transfer;
 if(s.stage==='transfer'||s.stage==='learn-complete')return learn&&!transfer;
 return !learn&&!transfer;
}
function validate(s,recipes){if(!s||s.version!==1||!s.sessions||typeof s.sessions!=='object'||Array.isArray(s.sessions)||Object.keys(s.sessions).length>10000||!Object.entries(s.sessions).every(([id,item])=>safeId(id)&&id===item?.id&&validSession(item)))return false;
 if(s.currentId!==null&&(!safeId(s.currentId)||!Object.hasOwn(s.sessions,s.currentId)))return false;
 if(s.visible!==undefined&&typeof s.visible!=='boolean')return false;
 if(recipes&&!Object.values(s.sessions).every(session=>{const recipe=recipes.find(r=>r.id===session.recipeId);return recipe&&['learn','transfer'].every(p=>session.records[p].attempts.every(a=>grade(recipe[p],a.answer)===a.correct));}))return false;
 return true;
}
function createSession(recipe,id,now=Date.now()){if(!recipe||!id)throw new Error('Recipe and session ID required');return{id:String(id),recipeId:recipe.id,stage:'orientation',createdAt:now,updatedAt:now,records:{learn:record(),transfer:record()}};}
function phase(s){return s.stage==='transfer'?'transfer':'learn';}
function normalizeText(value){return String(value||'').normalize('NFC').trim().replace(/[.!?。！？]+$/u,'').replace(/\s+/g,' ');}
function ready(q,d,r){
 if(q.kind==='text')return typeof d==='string'&&d.trim().length>0;
 if(['choice','listen','insert'].includes(q.kind))return typeof d==='string'&&d.length>0&&(q.kind!=='listen'||r.heard||r.help.includes('transcript'));
 if(q.kind==='order')return Array.isArray(d)&&d.length===q.parts.length&&new Set(d).size===q.parts.length;
 if(q.kind==='evidence')return !!d&&typeof d.claim==='string'&&typeof d.evidence==='string';
 if(q.kind==='dialogue')return !!d&&typeof d.first==='string'&&typeof d.second==='string';
 if(q.kind==='pair'||q.kind==='table')return !!d&&q.rows.every(row=>typeof d[row.id]==='string');
 if(q.kind==='sort')return !!d&&q.cards.every(card=>typeof d[card.id]==='string');
 return false;
}
function grade(q,d){
 if(q.kind==='text')return q.accepted.some(value=>normalizeText(value)===normalizeText(d));
 if(['choice','listen','insert'].includes(q.kind))return d===q.answer;
 if(q.kind==='order')return Array.isArray(d)&&q.answer.length===d.length&&q.answer.every((value,i)=>value===d[i]);
 if(q.kind==='evidence')return !!d&&d.claim===q.answer.claim&&d.evidence===q.answer.evidence;
 if(q.kind==='dialogue')return !!d&&d.first===q.answer.first&&d.second===q.answer.second;
 if(q.kind==='pair'||q.kind==='table')return !!d&&q.rows.every(row=>d[row.id]===row.answer);
 if(q.kind==='sort')return !!d&&q.cards.every(card=>d[card.id]===card.answer);
 return false;
}
function transition(input,event,recipe,now=Date.now()){
 if(!validSession(input)||!recipe||recipe.id!==input.recipeId)return{session:input,changed:false,reason:'invalid-session'};
 const s=copy(input),p=phase(s),r=s.records[p],q=recipe[p];let result=null;
 const blocked=reason=>({session:input,changed:false,reason});
 if(event.type==='begin'){if(s.stage!=='orientation')return blocked('wrong-stage');s.stage='learn';}
 else if(event.type==='continue'){if(s.stage==='learn-complete'&&s.records.learn.complete)s.stage='transfer';else return blocked('not-completed');}
 else if(event.type==='draft'){
  if(!['learn','transfer'].includes(s.stage)||r.complete||r.feedback==='wrong')return blocked('locked');
  if(!validDraft(event.value))return blocked('invalid-draft');r.draft=copy(event.value);
 }else if(event.type==='help'){
  if(!['learn','transfer'].includes(s.stage)||r.complete)return blocked('locked');
  const allowed=['hint',...(q.tokens||[]).map(t=>t.id),...(q.kind==='listen'?['transcript']:[])];
  if(!allowed.includes(event.id))return blocked('unknown-help');
  if(r.help.includes(event.id))return blocked('already-open');r.help.push(event.id);
 }else if(event.type==='heard'){
  if(!['learn','transfer'].includes(s.stage)||q.kind!=='listen'||r.complete)return blocked('locked');r.heard=true;
 }else if(event.type==='retry'){
  if(!['learn','transfer'].includes(s.stage)||r.feedback!=='wrong'||r.complete)return blocked('no-retry');
  r.feedback=null;r.draft=null;
 }else if(event.type==='submit'){
  if(!['learn','transfer'].includes(s.stage)||r.complete||r.feedback==='wrong')return blocked('locked');
  if(!ready(q,r.draft,r))return blocked(q.kind==='listen'&&!r.heard&&!r.help.includes('transcript')?'listen-first':'incomplete');
  const correct=grade(q,r.draft),assisted=r.help.length>0||r.attempts.length>0;
  if(event.attemptId&&!safeId(event.attemptId))return blocked('invalid-attempt-id');
  const attempt={id:event.attemptId||`${s.id}:${p}:${now}:${engineNonce}:${++attemptSequence}`,at:now,answer:copy(r.draft),correct,assisted,requestedHelp:r.help.length>0};
  r.attempts.push(attempt);r.firstAttempt=r.attempts[0];r.feedback=correct?'correct':'wrong';
  if(correct){r.complete=true;r.completedAt=now;r.rewardIntent={answer:true,stage:true};s.stage=p==='learn'?'learn-complete':'summary';}
  result={correct,assisted,phase:p,attempt,completed:correct};
 }else return blocked('unknown-event');
 r.updatedAt=now;s.updatedAt=now;return{session:s,changed:true,result};
}
function summary(s){return Object.fromEntries(['learn','transfer'].map(p=>{const r=s.records[p],first=r.attempts[0],success=r.attempts.find(a=>a.correct);return[p,{completed:!!success,firstAttemptCorrect:first?first.correct:null,helpRequested:r.help.length>0,helpCount:r.help.length,attemptCount:r.attempts.length,retries:Math.max(0,r.attempts.length-1),independent:!!success&&!success.assisted&&!r.help.length&&r.attempts.length===1&&success===first,assisted:!!success&&(success.assisted||r.help.length>0||r.attempts.length>1)}];}));}
function mergeRecord(a,b){
 if(!a)return copy(b);if(!b)return copy(a);
 const latest=(a.updatedAt||0)>(b.updatedAt||0)?a:b;
 const attempts=[...new Map([...a.attempts,...b.attempts].map(attempt=>[attempt.id,attempt])).values()].sort((x,y)=>x.at-y.at||x.id.localeCompare(y.id));
 const success=attempts.find(attempt=>attempt.correct);
 return{...copy(latest),help:[...new Set([...a.help,...b.help])],attempts,firstAttempt:attempts[0],heard:!!(a.heard||b.heard),complete:!!success,feedback:success?'correct':latest.feedback,completedAt:success?success.at:undefined};
}
function merge(a,b){
 if(!validate(a)||!validate(b))throw new Error('Invalid growth progress');
 const newer=(a.updatedAt||0)>(b.updatedAt||0)?a:b,out={...copy(a),...copy(newer),sessions:{...copy(a.sessions)}};
 for(const [id,s] of Object.entries(b.sessions)){
  const old=out.sessions[id];if(!old){out.sessions[id]=copy(s);continue;}if(old.recipeId!==s.recipeId)continue;
  const newest=(old.updatedAt||0)>(s.updatedAt||0)?old:s;
  const records={learn:mergeRecord(old.records.learn,s.records.learn),transfer:mergeRecord(old.records.transfer,s.records.transfer)};
  let stage=stages[Math.max(stages.indexOf(old.stage),stages.indexOf(s.stage))];
  if(records.transfer.complete)stage='summary';else if(records.learn.complete&&stages.indexOf(stage)<2)stage='learn-complete';
  out.sessions[id]={...copy(newest),records,stage};
 }
 return out;
}
const api=Object.freeze({stages,empty,validate,validSession,createSession,phase,ready,grade,normalizeText,transition,summary,merge});
root.HARUMAL_GROWTH_ENGINE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
