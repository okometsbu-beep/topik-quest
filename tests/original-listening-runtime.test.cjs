const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=f=>fs.readFileSync(f,'utf8');
const id='O01-I-L-01',clip='cbd2cd726443a020';
function boot(change=()=>{}){
 const c={console,window:{},localStorage:{getItem:()=>null,setItem:()=>{}}};vm.createContext(c);
 for(let p=1;p<=4;p++)for(const file of [`data/question-bank-v1-part${p}.js`,`data/original-exams-v1-part${p}.js`])vm.runInContext(read(file),c);
 vm.runInContext(read('data/question-bank-practice-v1.js'),c);
 const source=c.window.MALBIT_ORIGINAL_EXAM_PARTS.flat().find(q=>q.id===id);
 c.window.HARUMAL_LISTENING_AUDIO={resolve:s=>s==='legacy'?[{url:'old.mp3'}]:null};
 c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO={version:1,verified:true,byId:{[id]:{sourceContentSha256:source.contentSha256,sourceScriptSha256:'a'.repeat(64),script:source.script,segments:[{id:clip,voice:'F2',text:'지금 창문이 열려 있어요?',file:`audio/listening/original-v1/F2/${clip}.mp3`}]}}};
 change(c.window,source);vm.runInContext(read('original-listening-audio.js'),c);vm.runInContext(read('question-bank-engine.js'),c);return {api:c.window.MALBIT_BANK,audio:c.window.HARUMAL_LISTENING_AUDIO,source};
}
test('verified new-file mapping derives availability without changing approved authored audioStatus',()=>{const {api,audio,source}=boot();assert.equal(source.audioStatus,'unavailable');assert.equal(api.byId(id).audioStatus,'recorded');const parts=audio.resolve(source.script);assert.equal(parts[0].gender,'female');assert.match(parts[0].url,/original-v1\/F2/);assert.equal(audio.resolve('legacy')[0].url,'old.mp3')});
test('missing, stale, unverified or unsafe new audio stays unavailable',()=>{for(const change of [w=>delete w.HARUMAL_ORIGINAL_LISTENING_AUDIO,w=>w.HARUMAL_ORIGINAL_LISTENING_AUDIO.verified=false,w=>w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id].sourceContentSha256='0'.repeat(64),w=>w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id].script+=' changed',w=>w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id].segments[0].file='https://external.invalid/clip.mp3',w=>w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id].segments[0].voice='F1',w=>w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id].segments=[{pause:500000}]]){const {api,audio,source}=boot(change);assert.equal(api.byId(id).audioStatus,'unavailable');assert.equal(audio.resolve(source.script),null)}});
test('original audio adapter does not mutate any legacy question, choices or source text',()=>{const {api,source}=boot();assert.equal(api.total,2144+api.items.filter(q=>q.collectionId==='original12-v1').length);const q=api.byId(id);assert.equal(q.script,source.script);assert.equal(q.answerIndex,source.answerIndex);assert.deepEqual(Array.from(q.options),Array.from(source.options));assert.equal(api.items.filter(q=>q.collectionId==='legacy-original-v1').length,2144)});

test('actual catalogs cover only current hash-matching fixed audio snapshots',()=>{
 const c={window:{},console,localStorage:{getItem:()=>null,setItem:()=>{}}};vm.createContext(c);
 for(let p=1;p<=4;p++)for(const file of [`data/question-bank-v1-part${p}.js`,`data/original-exams-v1-part${p}.js`])vm.runInContext(read(file),c);
 for(const file of ['data/question-bank-practice-v1.js','data/original-listening-audio-v1.js','data/original-listening-audio-v2.js','data/original-listening-audio-v3.js','data/original-listening-audio-v4.js','data/original-listening-audio-v5.js','data/original-listening-audio-v6.js','data/original-listening-audio-v7.js','data/original-listening-audio-v8.js','data/original-listening-audio-v9.js','data/original-listening-audio-v10.js'])vm.runInContext(read(file),c);
 c.window.HARUMAL_LISTENING_AUDIO={resolve:()=>null};
 for(const file of ['original-listening-audio.js','question-bank-engine.js'])vm.runInContext(read(file),c);
 const source=c.window.MALBIT_ORIGINAL_EXAM_PARTS.flat(),api=c.window.MALBIT_BANK,audio=c.window.HARUMAL_LISTENING_AUDIO,catalog=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO,catalog2=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V2,catalog3=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V3,catalog4=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V4,catalog5=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V5,catalog6=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V6,catalog7=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V7,catalog8=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V8,catalog9=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V9,catalog10=c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V10,mappings={...catalog.byId,...(catalog2?.verified?catalog2.byId:{}),...(catalog3?.verified?catalog3.byId:{}),...(catalog4?.verified?catalog4.byId:{}),...(catalog5?.verified?catalog5.byId:{}),...(catalog6?.verified?catalog6.byId:{}),...(catalog7?.verified?catalog7.byId:{}),...(catalog8?.verified?catalog8.byId:{}),...(catalog9?.verified?catalog9.byId:{}),...(catalog10?.verified?catalog10.byId:{})};
 let available=0,missing=0;for(const q of source.filter(q=>q.section==='listening')){const entry=mappings[q.id];if(entry){available++;assert.equal(q.audioStatus,'unavailable');assert.equal(api.byId(q.id).audioStatus,'recorded');assert.equal(entry.sourceContentSha256,q.contentSha256);assert.ok(audio.resolve(q.script).some(s=>s.url));assert.ok(audio.resolve(q.script).filter(s=>s.url).every(s=>s.source==='original-generated'));}else{missing++;assert.equal(api.byId(q.id).audioStatus,'unavailable');assert.equal(audio.resolve(q.script),null);}}
 assert.equal(available,960);assert.equal(available+missing,source.filter(q=>q.section==='listening').length);assert.equal(catalog.humanPronunciationReview,false);
});
test('independent audio batches add only verified mappings and retain the frozen v1 fallback',()=>{
 const usable=boot((w,q)=>{const entry=w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id];w.HARUMAL_ORIGINAL_LISTENING_AUDIO_V2={version:1,verified:true,byId:{[id]:{...entry,segments:entry.segments.map(s=>({...s,file:s.file.replace('original-v1','original-v2')}))}}};});assert.match(usable.audio.resolve(usable.source.script)[0].url,/original-v2/);
 const pending=boot(w=>{w.HARUMAL_ORIGINAL_LISTENING_AUDIO_V2={version:1,verified:false,byId:{[id]:w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id]}};});assert.match(pending.audio.resolve(pending.source.script)[0].url,/original-v1/);
 const stale=boot(w=>{w.HARUMAL_ORIGINAL_LISTENING_AUDIO_V2={version:1,verified:true,byId:{[id]:{...w.HARUMAL_ORIGINAL_LISTENING_AUDIO.byId[id],sourceContentSha256:'0'.repeat(64)}}};});assert.match(stale.audio.resolve(stale.source.script)[0].url,/original-v1/);
});

test('all locally ready original sets have complete selected-locale coaching, review materials and connected audio',()=>{
 const c={window:{HARUMAL_LISTENING_AUDIO:{resolve:()=>null}},console,localStorage:{getItem:()=>null,setItem(){}}};vm.createContext(c);
 const files=[...[1,2,3,4].flatMap(n=>[`data/question-bank-v1-part${n}.js`,`data/original-exams-v1-part${n}.js`]),'data/question-bank-practice-v1.js','data/original-support-v1.js',...[1,2,3,4,5,6,7,8,9,10].map(n=>`data/original-listening-audio-v${n}.js`),'original-listening-audio.js','question-bank-engine.js'];for(const f of files)vm.runInContext(read(f),c);
 const api=c.window.MALBIT_BANK,support=c.window.HARUMAL_ORIGINAL_SUPPORT;
 for(const level of [1,2])for(const locale of ['ko','ja','en','zh']){
  const readySets=api.mockSets(level,'original12-v1',locale).filter(s=>s.ready);assert.equal(readySets.length,12,`Ready sets: TOPIK ${level} ${locale}`);
  for(const readiness of readySets){assert.equal(readiness.missingAudio,0);
  const items=api.mock(level,readiness.set,null,'original12-v1');assert.equal(items.length,level===1?70:104);
  for(const item of items){const q=api.present(item.id,item.section==='writing'?undefined:[2,0,3,1]);assert.ok(q.coach[locale].reason&&q.coach[locale].trap&&q.coach[locale].strategy);for(const choice of q.choices)assert.ok(q.coach[locale].choices[choice],`${item.id} ${locale} ${choice}`);assert.equal(q.visualPending,false);
   if(q.section==='listening'){assert.equal(q.audioStatus,'recorded');assert.ok(support.byId[item.id].transcripts[locale].turns.length);assert.equal(support.byId[item.id].sourceContentSha256,q.contentSha256)}
   if(q.section==='writing')assert.ok(locale==='ko'?q.rubric.criteria.length:q.rubric[locale].criteria.length);
  }
  }
 }
});
