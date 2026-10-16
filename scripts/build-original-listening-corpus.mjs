import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {reviewHash} from './build-original-exams.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
export function packFolder(pack){assert.match(pack,/^original-v[1-9]\d*$/);return `audio/listening/${pack}`}

export function buildCorpus(root=ROOT,pack='original-v1'){
 const folder=packFolder(pack);
 const bytes=fs.readFileSync(path.join(root,folder,'source-snapshot.json'));
 const snapshot=JSON.parse(bytes),texts=new Map(),scripts={},byId={},casting={};
 const genderReviews=new Map(),usedGenderReviews=new Set();
 if(snapshot.genderReferenceReviewSha256!==undefined){
  assert.match(snapshot.genderReferenceReviewSha256,/^[a-f0-9]{64}$/);
  const reviewBytes=fs.readFileSync(path.join(root,folder,'gender-reference-review.json'));
  assert.equal(sha256(reviewBytes),snapshot.genderReferenceReviewSha256,'Gender-reference review file changed');
  assert.equal(snapshot.genderReferenceReviewSha256,'572dcaba8a8c8a52269d9707d1ca068de1c905fbd2dddf1c92bf5cfa6110ad34','Only the independently approved L48 exception may be used');
  const review=JSON.parse(reviewBytes);
  assert.equal(review.version,1);assert.equal(review.status,'approved');
  assert.ok(typeof review.reviewer==='string'&&review.reviewer.trim()&&Number.isFinite(Date.parse(review.reviewedAt)));
  assert.ok(Array.isArray(review.items)&&review.items.length>0);
  for(const row of review.items){
   assert.ok(typeof row.id==='string'&&['남자','여자'].includes(row.gender));
   assert.equal(row.classification,'incidental_character_not_speaker');
   assert.ok(typeof row.reason==='string'&&row.reason.trim());
   for(const key of ['sourceContentSha256','sourceScriptSha256','promptSha256','instructionSha256'])assert.match(row[key],/^[a-f0-9]{64}$/);
   const key=row.id+'\0'+row.gender;assert.ok(!genderReviews.has(key),'Duplicate gender-reference review');genderReviews.set(key,row);
  }
 }
 const reusable=new Map(),reuseSources=[];
 assert.equal(snapshot.version,1);
 for(const oldPack of snapshot.reusePacks||[]){
  assert.notEqual(oldPack,pack);const oldFolder=packFolder(oldPack);
  const oldCorpusBytes=fs.readFileSync(path.join(root,oldFolder,'corpus.json')),oldManifestBytes=fs.readFileSync(path.join(root,oldFolder,'manifest.json'));
  const oldCorpus=JSON.parse(oldCorpusBytes),oldManifest=JSON.parse(oldManifestBytes);
  assert.equal(oldCorpus.modelRevision,'aafc6e32416a594460b32413efc49d7fe4ce6d46');assert.equal(oldManifest.modelRevision,oldCorpus.modelRevision);
  assert.equal(oldManifest.decodeVerified,true);assert.equal(oldManifest.synthesisInputMappingVerified,true);
  assert.equal(oldManifest.corpusSha256,sha256(oldCorpusBytes));
  reuseSources.push({packId:oldPack,corpusSha256:sha256(oldCorpusBytes),manifestSha256:sha256(oldManifestBytes)});
  const files=new Map(oldManifest.files.map(file=>[file.id+'\0'+file.voice,file]));
  for(const row of oldCorpus.corpus)for(const voice of row.voices){
   const file=files.get(row.id+'\0'+voice);assert.ok(file);assert.equal(file.textSha256,sha256(row.text));
   const key=row.text+'\0'+voice;if(!reusable.has(key))reusable.set(key,{file:file.file,sha256:file.sha256,sourcePack:oldPack});
  }
 }
 for(const q of snapshot.items){
  assert.equal(q.section,'listening');assert.ok(['approved','reviewed'].includes(q.qa.status));
  assert.ok(q.qa.reviewer?.trim()&&q.qa.report?.trim()&&Number.isFinite(Date.parse(q.qa.reviewedAt)),`Missing review record: ${q.id}`);
  for(const key of ['answerUnique','bilingual','duplicateFree','register','visual']){
   const result=q.qa.checks?.[key];assert.ok(result===true||String(result).startsWith('not_applicable'),`Unapproved ${key}: ${q.id}`);
   if(['answerUnique','bilingual','duplicateFree'].includes(key))assert.equal(result,true,`Unapproved ${key}: ${q.id}`);
  }
  assert.equal(reviewHash(q),q.qa.contentSha256,`Unreviewed content: ${q.id}`);
  assert.equal(q.audioStatus,'unavailable');assert.ok(!byId[q.id]);
  const scriptHash=sha256(q.script);
  if(!Object.hasOwn(scripts,q.script)){
   const lines=q.script.split(/\r?\n/).map(line=>{
    const m=line.match(/^([^:：\n]+)[:：]\s*(.+)$/u);assert.ok(m,`Unlabelled script: ${q.id}`);
    return {label:m[1].trim(),text:m[2].trim()};
   });
   const labels=[...new Set(lines.map(line=>line.label))],voices={},cast=[];
   assert.ok(labels.length<=3,`More than three roles: ${q.id}`);
   for(const label of labels)if(['여자','남자'].includes(label))voices[label]=label==='여자'?'F1':'M1';
   const neutral=labels.filter(label=>!voices[label]);
   const available=['F1','M1'].filter(voice=>!Object.values(voices).includes(voice));
   for(const [i,label] of neutral.entries())voices[label]=available[i%available.length]||['F1','M1'][i%2];
   // Three-role discussions use a separate F2 stock preset for the moderator.
   // The role's gender remains unspecified; this is only a production casting choice.
   if(labels.length===3){
    assert.deepEqual(labels.slice(0,1),['사회자']);
    assert.equal(lines.filter(line=>line.label==='사회자').length,1);
    assert.equal(lines[0].label,'사회자');
    assert.equal(neutral.length,3);labels.forEach((label,i)=>{voices[label]=['F2','M1','F1'][i]});
   }
   for(const label of labels)cast.push({label,voice:voices[label],basis:['남자','여자'].includes(label)?'explicit_gender_label':'production_cast_gender_unspecified',genderInferredFromRole:false,sharedPreset:labels.some(other=>other!==label&&voices[other]===voices[label])});
   casting[scriptHash]={questionIds:[],roles:cast,usesThirdPreset:labels.length===3};
   scripts[q.script]=lines.map(line=>{
    if(/^_+$/u.test(line.text))return {pause:1200};
    assert.ok(!line.text.includes('___'),`Mixed blank: ${q.id}`);
    const id=sha256(line.text).slice(0,16),voice=voices[line.label];
    if(texts.has(id))assert.equal(texts.get(id).text,line.text,'Truncated hash collision');
    else texts.set(id,{id,text:line.text,voices:[],sources:[]});
    const entry=texts.get(id);if(!entry.voices.includes(voice))entry.voices.push(voice);
    const reused=reusable.get(line.text+'\0'+voice);
    if(reused){assert.equal(sha256(fs.readFileSync(path.join(root,reused.file))),reused.sha256);(entry.reuseFiles??={})[voice]=reused}
    return {id,voice,text:line.text,file:reused?.file||`${folder}/${voice}/${id}.mp3`};
   });
  }
  casting[scriptHash].questionIds.push(q.id);
  for(const gender of ['남자','여자'])if(`${q.instruction} ${q.prompt}`.includes(gender)&&!casting[scriptHash].roles.some(role=>role.label===gender)){
   // A gendered character in an explicitly reviewed hypothetical scene is not
   // necessarily an interview speaker. Never infer this exception from prose:
   // require an independent, exact-content-bound review for this question.
   const key=q.id+'\0'+gender,review=genderReviews.get(key);
   assert.ok(review,`Ambiguous gender target: ${q.id}`);
   assert.equal(review.sourceContentSha256,q.qa.contentSha256,`Stale gender-reference core: ${q.id}`);
   assert.equal(review.sourceScriptSha256,scriptHash,`Stale gender-reference script: ${q.id}`);
   assert.equal(review.promptSha256,sha256(q.prompt),`Stale gender-reference prompt: ${q.id}`);
   assert.equal(review.instructionSha256,sha256(q.instruction),`Stale gender-reference instruction: ${q.id}`);
   usedGenderReviews.add(key);
  }
  for(const segment of scripts[q.script])if(!segment.pause){const row=texts.get(segment.id);if(!row.sources.includes(q.id))row.sources.push(q.id)}
  byId[q.id]={sourceContentSha256:q.qa.contentSha256,sourceScriptSha256:scriptHash,script:q.script,segments:scripts[q.script]};
 }
 const corpus=[...texts.values()];for(const row of corpus){row.voices.sort();row.sources.sort();row.heldForCastReview=false}
 const result={version:1,model:'Supertonic-3',modelRevision:'aafc6e32416a594460b32413efc49d7fe4ce6d46',sourceSnapshotSha256:sha256(bytes),sourceFileSha256:snapshot.sourceFileSha256,questionCount:snapshot.items.length,scriptCount:Object.keys(scripts).length,textCount:corpus.length,clipCount:corpus.reduce((n,row)=>n+row.voices.length,0),blankSegments:Object.values(scripts).flat().filter(segment=>segment.pause).length,castingPolicy:'Explicit male/female labels map to M1/F1. Unspecified roles receive deterministic production presets by order of appearance; no profession or name implies gender. Three-role discussions use the distinct F2 moderator preset and M1/F1 debaters.',casting,corpus,scripts,byId};
 assert.equal(usedGenderReviews.size,genderReviews.size,'Unused or stale gender-reference review');
 if(genderReviews.size){result.genderReferenceReviewSha256=snapshot.genderReferenceReviewSha256;result.reviewedIncidentalGenderReferences=[...genderReviews.values()];}
 if(pack!=='original-v1'){result.packId=pack;result.reuseSources=reuseSources;result.reusedClipCount=corpus.reduce((n,row)=>n+Object.keys(row.reuseFiles||{}).length,0);result.newClipCount=result.clipCount-result.reusedClipCount}
 return result;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const pack=process.argv.includes('--pack')?process.argv[process.argv.indexOf('--pack')+1]:'original-v1';
 const result=buildCorpus(ROOT,pack),output=JSON.stringify(result,null,2)+'\n',target=path.join(ROOT,packFolder(pack),'corpus.json');
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),output);else fs.writeFileSync(target,output);
 console.log(JSON.stringify({questionCount:result.questionCount,scriptCount:result.scriptCount,textCount:result.textCount,clipCount:result.clipCount,blankSegments:result.blankSegments}));
}
