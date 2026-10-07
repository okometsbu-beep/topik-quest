// HARUMAL writing evidence. Local-only; a detected form is never a meaning/mastery grade.
(function(root){
'use strict';
const KEY='harumalWritingCurriculumV1',SCHEMA=1,DAY=86400000;
const clone=value=>JSON.parse(JSON.stringify(value));
const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
const safeId=value=>typeof value==='string'&&/^[A-Za-z0-9_-]+$/.test(value)&&!['__proto__','prototype','constructor'].includes(value);
const validDate=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
const now=()=>new Date().toISOString();
const localDay=value=>{const d=new Date(value);return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`};
function empty(){return{schema:SCHEMA,createdAt:now(),revision:0,drafts:{},attempts:[],readiness:{},route:{page:'course'},firstIndependentAt:null}}
function migrate(value){
 if(!object(value))throw new Error('invalid-storage');
 if(value.schema!=null&&value.schema!==0&&value.schema!==SCHEMA)throw new Error('newer-storage');
 // Additive migration retains unknown fields. No legacy app roots are read or rewritten.
 if(value.attempts!=null&&(!Array.isArray(value.attempts)||value.attempts.some(a=>!object(a)||!safeId(a.id)||!safeId(a.itemId)||!safeId(a.groupId)||typeof a.text!=='string'||!validDate(a.createdAt)||!object(a.evaluation)||!Array.isArray(a.evaluation.messages)||(a.helpTypes!=null&&!Array.isArray(a.helpTypes)))))throw new Error('invalid-storage');
 if(value.readiness!=null&&(!object(value.readiness)||Object.entries(value.readiness).some(([id,r])=>!safeId(id)||!object(r))))throw new Error('invalid-storage');
 if(value.firstIndependentAt!=null&&!validDate(value.firstIndependentAt))throw new Error('invalid-storage');
 if(value.drafts!=null&&(!object(value.drafts)||Object.entries(value.drafts).some(([id,d])=>!safeId(id)||!object(d)||typeof d.text!=='string'||(d.helpTypes!=null&&!Array.isArray(d.helpTypes)))))throw new Error('invalid-storage');
 const result={...empty(),...value,schema:SCHEMA};
 result.drafts=object(value.drafts)?value.drafts:{};
 result.attempts=Array.isArray(value.attempts)?value.attempts.filter(object):[];
 result.readiness=object(value.readiness)?value.readiness:{};
 result.route=object(value.route)?value.route:{page:'course'};
 return result;
}
function combine(current,incoming){
 const attempts=new Map(current.attempts.map(a=>[a.id,a]));
 for(const a of incoming.attempts){const old=attempts.get(a.id);if(!old)attempts.set(a.id,a);else if(String(a.selfCheck?.updatedAt||'')>String(old.selfCheck?.updatedAt||''))attempts.set(a.id,{...old,selfCheck:a.selfCheck});}
 const drafts={...current.drafts};for(const[id,d]of Object.entries(incoming.drafts)){const old=drafts[id];const newest=!old||String(d.updatedAt||'')>String(old.updatedAt||'')?d:old;drafts[id]={...newest,helpOpened:Boolean(old?.helpOpened||d.helpOpened),modelViewed:Boolean(old?.modelViewed||d.modelViewed),helpTypes:[...new Set([...(old?.helpTypes||[]),...(d.helpTypes||[])])]};}
 const readiness={...current.readiness};for(const[id,r]of Object.entries(incoming.readiness))if(safeId(id)&&(!readiness[id]||String(r.updatedAt||'')>String(readiness[id].updatedAt||'')))readiness[id]=r;

 const seen=new Set();const ordered=[...attempts.values()].sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))||a.id.localeCompare(b.id)).map(a=>{const repeated=seen.has(a.itemId);seen.add(a.itemId);return repeated?{...a,first:false,...(['independent','delayed'].includes(a.mode)?{originalMode:a.originalMode||a.mode,mode:'revision'}:{})}:a});
 return {...incoming,...current,attempts:ordered,drafts,readiness,firstIndependentAt:ordered.find(a=>a.mode==='independent'&&!a.helpUsed)?.createdAt||null,revision:Math.max(Number(current.revision)||0,Number(incoming.revision)||0)};
}
function match(pattern,text){try{return new RegExp(pattern,'u').test(text)}catch{return false}}
function evaluate(item,text){
 const raw=String(text||'').normalize('NFC').trim(),rules=item.evaluation||{};
 if(!raw)return{status:'empty',form:'not_observed',meaning:'unreviewed',messages:['문장을 먼저 써 주세요.']};
 if(item.kind==='relation'){
  const ok=raw===rules.correctChoiceId;
  return{status:ok?'interpretation_observed':'needs_practice',form:'not_applicable',meaning:'bounded_choice_only',messages:[ok?'이 선택 문항의 뜻 구별을 확인했어요. 한국어 문장 생성과는 별도 기록이에요.':rules.incorrectMessageKo||'두 사실의 뜻과 순서를 다시 확인해 보세요.']};
 }
 const textForRules=raw.replace(/\s+/gu,''),forbidden=(rules.forbidden||[]).filter(rule=>match(rule.pattern,textForRules));
 const missing=(rules.required||[]).filter(rule=>!match(rule.pattern,textForRules));
 const form=rules.targetPattern&&match(rules.targetPattern,textForRules);
 const alternative=rules.alternativePattern&&match(rules.alternativePattern,textForRules);
 if(forbidden.length)return{status:'needs_practice',form:'needs_practice',meaning:'unreviewed',messages:forbidden.slice(0,1).map(rule=>rule.messageKo),issues:forbidden.map(rule=>rule.id)};
 if(missing.length)return{status:'review_needed',form:form?'observed':'not_observed',meaning:'unreviewed',messages:missing.slice(0,1).map(rule=>rule.messageKo),issues:missing.map(rule=>rule.id)};
 if(item.kind==='free')return{status:'saved',form:form?'observed':'not_observed',meaning:'unreviewed',messages:['내 문장을 저장했어요. 자동 규칙만으로 자유 문장의 의미와 자연스러움을 확정하지 않아요.']};
 if(form)return{status:'form_observed',form:'observed',meaning:'unreviewed',messages:['목표 연결 형태와 지정된 표현을 찾았어요. 두 사실의 뜻과 자연스러움은 아직 검토 전이에요.']};
 if(alternative)return{status:'alternative_form',form:'other_expression',meaning:'unreviewed',messages:['다른 연결 표현이 보여요. 자연스러운 답일 수 있지만, 이번 연결 형태를 사용한 증거와는 따로 남겨요.']};
 if(!rules.targetPattern)return{status:'components_observed',form:'components_only',meaning:'unreviewed',messages:['지정된 기본 표현을 찾았어요. 문장 전체의 뜻은 직접 다시 읽어 확인해 주세요.']};
 return{status:'review_needed',form:'not_observed',meaning:'unreviewed',messages:['이번에 확인할 연결 형태를 찾지 못했어요. 다른 자연스러운 답일 수도 있어요. 도움을 보거나 형태를 다시 연습해 보세요.']};
}
function create(storage,data,clock=()=>Date.now()){
 let state=empty(),storageError='',readOnly=false;
 const sessionId=Math.random().toString(36).slice(2,10);
 try{const raw=storage?.getItem(KEY);if(raw!=null)state=migrate(JSON.parse(raw))}catch(error){storageError=error.message==='newer-storage'?'newer-storage':'read-error';readOnly=true}
 const itemById=id=>(data.items||[]).find(item=>item.id===id);
 const iso=()=>new Date(clock()).toISOString();
 function sync(){
  if(readOnly)return;
  try{const raw=storage?.getItem(KEY);if(raw!=null)state=combine(state,migrate(JSON.parse(raw)))}catch(error){storageError=error.message==='newer-storage'?'newer-storage':'read-error';readOnly=true}
 }
 function persist(){
  sync();
  state.revision=(Number(state.revision)||0)+1;
  if(readOnly)return false;
  try{storage.setItem(KEY,JSON.stringify(state));storageError='';return true}catch{storageError='write-error';return false}
 }
 function draft(id){return state.drafts[id]||{text:'',helpOpened:false,modelViewed:false}}
 function setDraft(id,text){if(!itemById(id))return false;state.drafts[id]={...draft(id),text:String(text).slice(0,4000),updatedAt:iso()};return persist()}
 function help(id,type='meaning'){sync();if(!itemById(id))return;state.drafts[id]={...draft(id),helpOpened:true,helpTypes:[...new Set([...(draft(id).helpTypes||[]),type])],updatedAt:iso()};persist()}
 function revealModel(id){sync();if(!state.attempts.some(a=>a.itemId===id))return false;state.drafts[id]={...draft(id),modelViewed:true,updatedAt:iso()};persist();return true}
 function delayedReady(){const anchor=Date.parse(state.firstIndependentAt||'');return Number.isFinite(anchor)&&clock()-anchor>=DAY&&localDay(clock())!==localDay(anchor)}
 function delayedAt(){return validDate(state.firstIndependentAt)?new Date(Date.parse(state.firstIndependentAt)+DAY).toISOString():null}
 function eligible(id){const item=itemById(id);if(!item)return false;const g=(data.groups||[]).find(g=>g.id===item.groupId);if(g?.stage!=='probe'&&(item.prerequisites||[]).some(key=>state.readiness[key]?.value==='needs_help'))return false;return !(item.delayedOnly||item.evidence?.delayed)||delayedReady()}
 function submit(id,text){
  sync();const item=itemById(id);if(!item||!eligible(id))return{blocked:true};
  const value=String(text??draft(id).text).normalize('NFC').trim();
  const result=evaluate(item,value);if(result.status==='empty')return{empty:true,evaluation:result};
  const prev=state.attempts.filter(a=>a.itemId===id),last=prev.at(-1),d=draft(id);
  // Repeated submit taps are idempotent. Revisiting a known item never creates new-context evidence.
  if(last&&last.text===value&&last.helpUsed===Boolean(d.helpOpened||d.modelViewed||item.evidence?.assistedByDesign))return{attempt:clone(last),duplicate:true};
  const first=prev.length===0,helpUsed=Boolean(d.helpOpened||d.modelViewed||item.evidence?.assistedByDesign);
  const mode=item.evidence?.delayed&&first&&!helpUsed?'delayed':item.evidence?.independent&&first&&!helpUsed?'independent':prev.length?'revision':item.kind==='relation'?'interpretation':'practice';
  const attempt={id:`${clock()}-${sessionId}-${state.revision}-${state.attempts.length}`,itemId:id,groupId:item.groupId,createdAt:iso(),text:value,first,mode,helpUsed,helpTypes:[...(d.helpTypes||[])],relationProvided:Boolean(item.evidence?.relationProvided),evaluation:result,selfCheck:null};
  state.attempts.push(attempt);
  if(mode==='independent'&&!state.firstIndependentAt)state.firstIndependentAt=iso();
  state.drafts[id]={...d,text:value,updatedAt:iso()};
  const saved=persist();return{attempt:clone(attempt),saved};
 }
 function readiness(id,value){sync();if(!safeId(id))return;if(!['ready','needs_help'].includes(value))return;state.readiness[id]={value,source:'self_report',updatedAt:iso()};persist()}
 function selfCheck(id,value){sync();const attempt=state.attempts.find(a=>a.id===id);if(!attempt||!['checked','needs_review'].includes(value))return;attempt.selfCheck={value,source:'learner',updatedAt:iso()};persist()}
 function route(value){state.route={...value};persist()}
 function evidence(){
  sync();const a=state.attempts,forms={};for(const name of ['아서','어서','해서'])forms[name]=a.filter(x=>itemById(x.itemId)?.targetForm===name&&x.evaluation.form==='observed').map(x=>x.itemId).filter((v,i,all)=>all.indexOf(v)===i).length;
  return{practice:a.filter(x=>['practice','revision'].includes(x.mode)).length,independent:a.filter(x=>x.mode==='independent').length,delayed:a.filter(x=>x.mode==='delayed').length,expansion:a.filter(x=>(data.groups||[]).find(g=>g.id===x.groupId)?.stage==='expansion').length,meaningReviewed:0,forms,delayedReady:delayedReady(),delayedAt:delayedAt()};
 }
 function mergeImport(raw){sync();const incoming=migrate(JSON.parse(raw));return JSON.stringify(combine(state,incoming))}

 return Object.freeze({getState:()=>{sync();return clone(state)},getStorageError:()=>storageError,persist,draft:id=>{sync();return clone(draft(id))},setDraft,help,revealModel,submit,readiness,selfCheck,route,evidence,eligible,delayedReady,delayedAt,mergeImport,itemById});
}
root.HARUMAL_WRITING_ENGINE=Object.freeze({KEY,SCHEMA,DAY,migrate,evaluate,create});
})(typeof window!=='undefined'?window:globalThis);
