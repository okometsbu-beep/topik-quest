import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const COLLECTION='original12-v1';
export const EXPECTED=2088;
const coverageAt=root=>new Map(JSON.parse(fs.readFileSync(path.join(root,'content/original-exams-coverage.json'),'utf8')).slots.map(slot=>[slot.id,slot]));
const sections={listening:'L',reading:'R',writing:'W'};
const text=value=>typeof value==='string'&&value.trim().length>0;
const norm=value=>String(value??'').normalize('NFKC').replace(/\s+/gu,' ').trim();
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value}
export function reviewHash(q){return hash(JSON.stringify(canonical(Object.fromEntries(Object.entries(q).filter(([k])=>!['qa','visualReady','requiresVisual','reviewReady'].includes(k))))))}
function reviewed(q,root){
 const qa=q.qa;if(!qa||!['reviewed','approved'].includes(qa.status)||!text(qa.reviewer)||!text(qa.report)||!Number.isFinite(Date.parse(qa.reviewedAt))||qa.contentSha256!==reviewHash(q))return false;
 for(const key of ['answerUnique','bilingual','duplicateFree','register','visual']){const value=qa.checks?.[key];if(value!==true&&!String(value).startsWith('not_applicable'))return false;if(['bilingual','duplicateFree'].includes(key)&&value!==true)return false;if(key==='answerUnique'&&q.section!=='writing'&&value!==true)return false;if(key==='visual'&&q.visual&&value!==true)return false;}
 const images=q.visual?.kind==='image'?[q.visual]:q.visual?.kind==='options'?Object.values(q.visual.byOption||{}):[];
 return images.every(image=>{try{return qa.assetHashes?.[image.src]===hash(fs.readFileSync(path.join(root,image.src)))}catch{return false}});
}
const speech=value=>norm(String(value||'').replace(/^[가-힣A-Za-z][^:\n]{0,39}:[ \t]*/gmu,''));
const signature=q=>JSON.stringify([norm(q.instruction),norm(q.passage),speech(q.script),norm(q.prompt),(q.options||[]).map(norm).sort(),q.visual?.kind==='table'?q.visual:null]);
function check(condition,message){if(!condition)throw new Error(message)}
function slots(q){return q.level===1?(q.section==='listening'?[1,30]:q.section==='reading'?[31,70]:[]):q.section==='writing'?[51,54]:[1,50]}
export function needsVisual(q){return q.level===1?(q.section==='listening'?[15,16].includes(q.no):q.section==='reading'&&q.no>=40&&q.no<=42):(q.section==='listening'?q.no<=3:q.section==='reading'?q.no>=5&&q.no<=10:q.no===53)}
function visualState(q,root){
 const visual=q.visual;
 if(!visual)return !q.requiresVisual&&q.itemType!=='picture_selection';
 if(visual.kind==='image'){
  check(text(visual.alt)&&text(visual.src)&&/^assets\/original\/[A-Za-z0-9_./-]+\.(?:svg|png|webp)$/u.test(visual.src)&&!visual.src.split('/').includes('..'),`${q.id}: invalid image`);
  return fs.existsSync(path.join(root,visual.src));
 }
 if(visual.kind==='table'){
  check(text(visual.caption)&&Array.isArray(visual.columns)&&visual.columns.length>=2&&visual.columns.every(text),`${q.id}: invalid table heading`);
  check(Array.isArray(visual.rows)&&visual.rows.length>0&&visual.rows.every(row=>Array.isArray(row)&&row.length===visual.columns.length&&row.every(x=>text(String(x)))),`${q.id}: invalid table rows`);
  return true;
 }
 check(visual.kind==='options'&&visual.byOption&&typeof visual.byOption==='object',`${q.id}: unsupported visual`);
 return q.options.every(option=>{
  const image=visual.byOption[option];
  if(!image||!text(image.alt)||!text(image.src))return false;
  check(/^assets\/original\/[A-Za-z0-9_./-]+\.(?:svg|png|webp)$/u.test(image.src)&&!image.src.split('/').includes('..'),`${q.id}: unsafe image path`);
  return fs.existsSync(path.join(root,image.src));
 });
}
export function validateOriginalExams(source,{root=ROOT,allowPartial=false,existing=[],coverage=coverageAt(root)}={}){
 check(source&&Array.isArray(source.items),'items array is required');
 const items=source.items.map(q=>({...q}));
 check(allowPartial?items.length<=EXPECTED:items.length===EXPECTED,`Expected ${allowPartial?'at most ':''}${EXPECTED} original items; received ${items.length}`);
 const ids=new Set(existing.map(q=>q.id)),seen=new Map(existing.map(q=>[signature(q),q.id]));
 for(const q of items){
  check(q.collectionId===COLLECTION,`${q.id}: collection must be ${COLLECTION}`);
  check(Number.isInteger(q.set)&&q.set>=1&&q.set<=12&&[1,2].includes(q.level),`${q.id}: invalid level/set`);
  check(Object.hasOwn(sections,q.section)&&!(q.level===1&&q.section==='writing'),`${q.id}: invalid section`);
  const [first,last]=slots(q);
  check(Number.isInteger(q.no)&&q.no>=first&&q.no<=last,`${q.id}: invalid exam slot`);
  const expectedId=`O${String(q.set).padStart(2,'0')}-${q.level===1?'I':'II'}-${sections[q.section]}-${String(q.no).padStart(2,'0')}`;
  const slot=coverage.get(q.id);
  check(q.id===expectedId&&!ids.has(q.id),`${q.id}: duplicate or noncanonical ID (expected ${expectedId})`);ids.add(q.id);
  check(slot&&q.examType===slot.itemType&&q.points===slot.points,`${q.id}: exam type or point metadata differs from coverage`);
  check((q.stimulusGroup||null)===(slot.stimulusGroup||null),`${q.id}: shared stimulus group differs from coverage`);
  check(text(q.itemType)&&['easy','medium','hard','very_hard'].includes(q.difficulty),`${q.id}: invalid type/difficulty`);
  check(text(q.instruction)&&text(q.prompt),`${q.id}: instruction/prompt required`);
  check(Array.isArray(q.targetSkills)&&q.targetSkills.length>0&&q.targetSkills.every(text),`${q.id}: target skills required`);
  check(q.provenance&&typeof q.provenance==='object',`${q.id}: original-content provenance required`);
  if(q.section==='writing'){
   check(Array.isArray(q.options)&&q.options.length===0&&q.answerIndex===null,`${q.id}: writing must not have MCQ options`);
   if(q.no>=53){const chars=String(q.model||'').replace(/\r?\n/gu,'').length;check(q.no===53?chars>=200&&chars<=300:chars>=600&&chars<=700,`${q.id}: writing model length outside exam range`)}
   check(text(q.model)&&q.rubric&&typeof q.rubric==='object'&&q.acceptedAnswer!=null,`${q.id}: writing model, accepted answers and rubric required`);
  }else{
   check(Array.isArray(q.options)&&q.options.length===4&&q.options.every(text)&&new Set(q.options.map(norm)).size===4,`${q.id}: four distinct options required`);
   check(Number.isInteger(q.answerIndex)&&q.answerIndex>=0&&q.answerIndex<4,`${q.id}: invalid answer index`);
  }
  for(const lang of ['ko','ja']){
   const c=q.coach?.[lang];
   check(c&&['reason','trap','strategy'].every(k=>text(c[k])),`${q.id}: authored ${lang} coaching required`);
   if(q.section!=='writing')check(q.options.every(option=>text(c.choices?.[option])),`${q.id}: per-option ${lang} explanations required`);
  }
  if(q.section==='listening'){
   check(text(q.script),`${q.id}: listening script required`);
   check(['missing','unavailable','not-recorded','recorded'].includes(q.audioStatus),`${q.id}: explicit audioStatus required`);
   check(q.audioStatus!=='recorded',`${q.id}: recording status must come from a separately verified audio companion`);
   check(q.dialogueContext&&typeof q.dialogueContext==='object',`${q.id}: listening relationship/register context required`);
  }
  const fingerprint=signature(q);check(!seen.has(fingerprint),`${q.id}: exact question duplicate of ${seen.get(fingerprint)}`);seen.set(fingerprint,q.id);
  q.requiresVisual=needsVisual(q)||q.requiresVisual===true;
  q.visualReady=visualState(q,root);
  if(!allowPartial)check(q.visualReady,`${q.id}: required picture asset is missing`);
  q.reviewReady=reviewed(q,root);
  if(!allowPartial)check(q.reviewReady,`${q.id}: independent content review is missing or stale`);
  q.contentSha256=reviewHash(q);
 }
 const groups=new Map();
 for(const q of items)if(q.stimulusGroup){const stimulus=norm(q.section==='listening'?q.script:q.passage);if(groups.has(q.stimulusGroup))check(groups.get(q.stimulusGroup)===stimulus,`${q.id}: paired stimulus is inconsistent`);else groups.set(q.stimulusGroup,stimulus)}
 const sets=[];
 for(const level of [1,2])for(let set=1;set<=12;set++){
  const qs=items.filter(q=>q.level===level&&q.set===set),expected=level===1?70:104;
  const complete=qs.length===expected&&new Set(qs.map(q=>`${q.section}:${q.no}`)).size===expected;
  const ready=complete&&qs.every(q=>q.visualReady&&q.reviewReady);
  if(!allowPartial)check(ready,`TOPIK ${level} set ${set} is incomplete`);
  sets.push({level,set,count:qs.length,expected,ready,reviewed:qs.filter(q=>q.reviewReady).length,missingAudio:qs.filter(q=>q.section==='listening'&&q.audioStatus!=='recorded').length});
 }
 return {items,sets};
}
export function readExistingBank(root=ROOT){
 const c={window:{}};vm.createContext(c);
 for(let part=1;part<=4;part++)vm.runInContext(fs.readFileSync(path.join(root,`data/question-bank-v1-part${part}.js`),'utf8'),c);
 vm.runInContext(fs.readFileSync(path.join(root,'data/question-bank-practice-v1.js'),'utf8'),c);
 return [...c.window.MALBIT_QUESTION_BANK_PARTS.flat().map(r=>({id:r[0],instruction:r[7],passage:r[8],script:r[9],prompt:r[10],options:r[11]})),...c.window.MALBIT_QUESTION_BANK_EXPANSION];
}
export function buildOriginalExams(input,{root=ROOT,allowPartial=false,existing=null}={}){
 const sourceBytes=fs.readFileSync(input),source=JSON.parse(sourceBytes);
 const {items,sets}=validateOriginalExams(source,{root,allowPartial,existing:existing??readExistingBank(root)});
 const files=[];fs.mkdirSync(path.join(root,'data'),{recursive:true});
 const chunk=Math.ceil(items.length/4)||1;
 for(let part=1;part<=4;part++){
  const rows=items.slice((part-1)*chunk,part*chunk).map(({qa,...runtime})=>runtime),file=`data/original-exams-v1-part${part}.js`;
  const payload=`// Generated by scripts/build-original-exams.mjs; do not hand-edit.\nwindow.MALBIT_ORIGINAL_EXAM_PARTS=window.MALBIT_ORIGINAL_EXAM_PARTS||[];\nwindow.MALBIT_ORIGINAL_EXAM_PARTS[${part-1}]=${JSON.stringify(rows).replace(/\u2028/gu,'\\u2028').replace(/\u2029/gu,'\\u2029')};\n`;
  fs.writeFileSync(path.join(root,file),payload);files.push({file,count:rows.length,sha256:hash(payload)});
 }
 const manifest={schemaVersion:1,collectionId:COLLECTION,contentKind:'original_mock_exams',expectedItems:EXPECTED,totalItems:items.length,releaseReady:sets.every(s=>s.ready),sourceSha256:hash(sourceBytes),sets,files};
 fs.writeFileSync(path.join(root,'data/original-exams-manifest.json'),JSON.stringify(manifest,null,2)+'\n');return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const input=process.argv.slice(2).find(x=>!x.startsWith('--'))||path.join(ROOT,'content/original-exams-v1.json');
 const manifest=buildOriginalExams(path.resolve(input),{allowPartial:process.argv.includes('--allow-partial')});
 console.log(`Original exams: ${manifest.totalItems}/${EXPECTED}; ready sets ${manifest.sets.filter(s=>s.ready).length}/24; releaseReady=${manifest.releaseReady}`);
}
