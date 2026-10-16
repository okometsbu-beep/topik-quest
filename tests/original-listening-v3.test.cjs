const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base=path.join(root,'audio/listening/original-v3');
const read=file=>JSON.parse(fs.readFileSync(path.join(base,file),'utf8')),hash=x=>crypto.createHash('sha256').update(x).digest('hex');

test('third batch contains only thirty newly approved O05 beginner listening questions',async()=>{
 const {reviewHash}=await import('../scripts/build-original-exams.mjs');const snapshot=read('source-snapshot.json'),corpus=read('corpus.json');
 assert.equal(snapshot.items.length,30);assert.equal(snapshot.sourceItemCount,748);
 const earlier=new Set(['original-v1','original-v2'].flatMap(pack=>JSON.parse(fs.readFileSync(path.join(root,'audio/listening',pack,'source-snapshot.json'),'utf8')).items.map(q=>q.id)));
 for(const q of snapshot.items){assert.match(q.id,/^O05-I-L-\d\d$/);assert.equal(earlier.has(q.id),false);assert.equal(q.qa.status,'approved');assert.equal(q.qa.contentSha256,reviewHash(q));assert.equal(q.audioStatus,'unavailable');assert.equal(corpus.byId[q.id].sourceContentSha256,reviewHash(q));assert.equal(corpus.byId[q.id].sourceScriptSha256,hash(q.script))}
});

test('L24 uses the approved uncertainty-about-directions script, not its discarded draft',()=>{
 const q=read('source-snapshot.json').items.find(q=>q.id==='O05-I-L-24');
 assert.equal(q.qa.contentSha256,'57a7964b9be303c3dda611904b6b9198b132cb7c9ef972b0d9b8085f50897880');
 assert.equal(hash(q.script),'f28c9bc22165128f0ca7a6a86bad0a1702b065040eeefd8eb8b22a22f87ec447');
 assert.match(q.script,/공원 가는 길/);assert.match(q.script,/짐작으로 길을 알려 드리면/);assert.doesNotMatch(q.script,/사진/);
});

test('third-batch corpus preserves exact shared scripts, speaker casts and reproducible input',async()=>{
 const {buildCorpus}=await import('../scripts/build-original-listening-corpus.mjs');const corpus=read('corpus.json');assert.deepEqual(corpus,buildCorpus(root,'original-v3'));
 assert.equal(corpus.scriptCount,27);assert.equal(corpus.clipCount,67);assert.equal(corpus.newClipCount,67);assert.equal(corpus.reusedClipCount,0);assert.equal(corpus.blankSegments,0);
 const voices=corpus.corpus.flatMap(row=>row.voices).reduce((out,v)=>(out[v]=(out[v]||0)+1,out),{});assert.deepEqual(voices,{F1:34,M1:33});
 for(const cast of Object.values(corpus.casting))for(const role of cast.roles){assert.equal(role.genderInferredFromRole,false);assert.equal(role.voice,role.label==='남자'?'M1':'F1');assert.equal(role.basis,['남자','여자'].includes(role.label)?'explicit_gender_label':'production_cast_gender_unspecified')}
 for(const [a,b]of [[25,26],[27,28],[29,30]])assert.deepEqual(corpus.byId[`O05-I-L-${a}`].segments,corpus.byId[`O05-I-L-${b}`].segments);
 for(const q of read('source-snapshot.json').items){const texts=q.script.split(/\r?\n/).map(line=>line.split(/[:：](.*)/s)[1].trim());assert.deepEqual(corpus.byId[q.id].segments.map(s=>s.text),texts)}
});

test('V3 uses a separate fail-closed catalog and keeps perceptual QA unclaimed',async()=>{
 const {buildCatalog}=await import('../scripts/build-original-listening-catalog.mjs');const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/original-listening-audio-v3.js'),'utf8'),ctx);
 assert.equal(ctx.window.HARUMAL_ORIGINAL_LISTENING_AUDIO,undefined);assert.equal(ctx.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V2,undefined);
 const c=JSON.parse(JSON.stringify(ctx.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V3));assert.equal(c.batchId,'original-v3');assert.equal(c.humanPronunciationReview,false);assert.equal(c.scriptToAudioMeaningVerified,false);assert.equal(c.physicalDevicePlaybackVerified,false);
 if(c.verified){assert.deepEqual(c,buildCatalog(root,'original-v3'));assert.equal(Object.keys(c.byId).length,30);assert.equal(read('manifest.json').fileCount,67)}else{assert.deepEqual(c.byId,{});assert.deepEqual(c,buildCatalog(root,'original-v3',{allowPending:true}));assert.throws(()=>buildCatalog(root,'original-v3'))}
});

test('third-batch work does not change either prior public audio catalog or manifest',()=>{
 for(const [file,digest]of Object.entries({
  'audio/listening/original-v1/manifest.json':'a8e13178756181c78813bd0b1577e9996640312c61ca1209ac76e6e1477832f9',
  'data/original-listening-audio-v1.js':'81f07ffdeae9075fbc8733bdd7a140090fe49efce2f322e75e410660f82b8ff6',
  'audio/listening/original-v2/manifest.json':'0c0aa689e5ed5132a3d3ee77a192027ede23994cd01cf710c7a52b68ff5f1884',
  'data/original-listening-audio-v2.js':'cabc985b9c6bc9213d6646e4fba77bb8cfbf6c8f731d9ebdb6b55932a9223b64'
 }))assert.equal(hash(fs.readFileSync(path.join(root,file))),digest,file);
});
