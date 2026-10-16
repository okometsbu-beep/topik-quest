const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base=path.join(root,'audio/listening/original-v1');
const read=file=>JSON.parse(fs.readFileSync(path.join(base,file),'utf8'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const snapshot=read('source-snapshot.json'),corpus=read('corpus.json');

test('frozen original listening source has reviewed hashes and unchanged unavailable core status',async()=>{
 const {reviewHash}=await import('../scripts/build-original-exams.mjs');
 assert.equal(snapshot.items.length,220);assert.equal(new Set(snapshot.items.map(q=>q.script)).size,178);
 assert.equal(corpus.sourceSnapshotSha256,hash(fs.readFileSync(path.join(base,'source-snapshot.json'))));
 for(const q of snapshot.items){assert.equal(q.section,'listening');assert.equal(q.audioStatus,'unavailable');assert.equal(q.qa.contentSha256,reviewHash(q));assert.equal(corpus.byId[q.id].sourceContentSha256,reviewHash(q));assert.equal(corpus.byId[q.id].sourceScriptSha256,hash(q.script));assert.equal(corpus.byId[q.id].script,q.script)}
});

test('corpus is reproducible from the frozen source rather than the moving import file',async()=>{
 const {buildCorpus}=await import('../scripts/build-original-listening-corpus.mjs');assert.deepEqual(buildCorpus(root),corpus);
 assert.equal(corpus.clipCount,510);assert.equal(corpus.textCount,510);assert.equal(corpus.blankSegments,10);
});

test('only script lines are synthesized; speaker labels and blank answers are excluded',()=>{
 const rows=new Map(corpus.corpus.map(row=>[row.id,row]));
 for(const q of snapshot.items){
  const lines=q.script.split(/\r?\n/).map(line=>line.match(/^([^:：\n]+)[:：]\s*(.+)$/u));
  const segments=corpus.byId[q.id].segments;assert.equal(segments.length,lines.length);
  for(const [i,line] of lines.entries()){
   const text=line[2].trim(),segment=segments[i];
   if(/^_+$/.test(text)){assert.deepEqual(segment,{pause:1200});continue}
   assert.equal(segment.text,text);assert.equal(segment.id,hash(text).slice(0,16));assert.equal(rows.get(segment.id).text,text);
   assert.deepEqual(Object.keys(segment),['id','voice','text','file']);
   assert.equal(segment.file,`audio/listening/original-v1/${segment.voice}/${segment.id}.mp3`);
  }
 }
});

test('explicit gender labels and gender-targeted questions match the recorded production cast',()=>{
 for(const q of snapshot.items){
  const cast=corpus.casting[hash(q.script)];
  for(const role of cast.roles){assert.equal(role.genderInferredFromRole,false);assert.equal(role.sharedPreset,false);if(role.label==='여자'){assert.equal(role.voice,'F1');assert.equal(role.basis,'explicit_gender_label')}else if(role.label==='남자'){assert.equal(role.voice,'M1');assert.equal(role.basis,'explicit_gender_label')}else assert.equal(role.basis,'production_cast_gender_unspecified')}
  for(const gender of ['남자','여자'])if(`${q.instruction} ${q.prompt}`.includes(gender))assert.ok(cast.roles.some(role=>role.label===gender));
 }
 const casts=Object.values(corpus.casting).filter(cast=>cast.usesThirdPreset);assert.equal(casts.length,2);
 for(const cast of casts){assert.deepEqual(cast.roles.map(role=>role.voice),['F2','M1','F1']);assert.equal(cast.questionIds.length,2)}
});

test('shared scripts and exact utterance-plus-voice keys have a single stable mapping',()=>{
 const seen=new Map();for(const entry of Object.values(corpus.byId)){assert.deepEqual(entry.segments,corpus.scripts[entry.script]);for(const s of entry.segments)if(!s.pause){const key=s.text+'\0'+s.voice;if(seen.has(key))assert.deepEqual(seen.get(key),s);else seen.set(key,s)}}
 assert.equal(seen.size,510);assert.equal(new Set([...seen.values()].map(s=>s.file)).size,510);
});

test('F2 provenance remains the same approved pinned model and adds no executable code',()=>{
 const p=read('additional-voice-provenance.json');assert.equal(p.modelRevision,corpus.modelRevision);assert.equal(p.bytes,292423);assert.equal(p.gitBlobSha1,'b09a3a433df8a4856d1d7d64736a56ddf37a4ea3');assert.equal(p.newExecutableCode,false);assert.equal(p.modelWeightsChanged,false);assert.equal(p.networkReceivesScript,false);
});

test('verified original catalog binds every emitted file and reports listening QA honestly',async()=>{
 const {buildCatalog}=await import('../scripts/build-original-listening-catalog.mjs');const expected=buildCatalog(root);
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/original-listening-audio-v1.js'),'utf8'),context);
 const actual=JSON.parse(JSON.stringify(context.window.HARUMAL_ORIGINAL_LISTENING_AUDIO));assert.deepEqual(actual,expected);
 assert.equal(actual.questionCount,220);assert.equal(actual.verified,true);
 assert.equal(actual.humanPronunciationReview,false);assert.equal(actual.scriptToAudioMeaningVerified,false);assert.equal(actual.physicalDevicePlaybackVerified,false);
 const manifest=read('manifest.json');assert.equal(manifest.fileCount,510);assert.equal(manifest.serviceActivationPerformed,false);assert.equal(manifest.durationRateReviewWarnings.length,0);
 for(const file of manifest.files){assert.ok(file.duration>0.2);assert.ok(file.peak<1);assert.ok(file.truePeakDb<0);assert.ok(file.integratedLufs>-30&&file.integratedLufs<-8)}
});

test('catalog construction rejects mismatched source, missing clips and unverified manifests',async()=>{
 const {buildCatalog}=await import('../scripts/build-original-listening-catalog.mjs');
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'harumal-original-audio-'));
 try{
  fs.mkdirSync(path.join(temp,'audio/listening/original-v1'),{recursive:true});
  for(const file of ['source-snapshot.json','corpus.json','manifest.json','generation-records.json'])fs.copyFileSync(path.join(base,file),path.join(temp,'audio/listening/original-v1',file));
  assert.throws(()=>buildCatalog(temp),/ENOENT/);
  const manifest=read('manifest.json');manifest.decodeVerified=false;fs.writeFileSync(path.join(temp,'audio/listening/original-v1/manifest.json'),JSON.stringify(manifest));assert.throws(()=>buildCatalog(temp),/decodeVerified/);
  const bad=JSON.parse(JSON.stringify(corpus));bad.byId[snapshot.items[0].id].script+=' changed';fs.writeFileSync(path.join(temp,'audio/listening/original-v1/corpus.json'),JSON.stringify(bad));assert.throws(()=>buildCatalog(temp),/Frozen source\/corpus mismatch/);
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
});
