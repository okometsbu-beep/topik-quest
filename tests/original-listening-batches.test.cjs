const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base=path.join(root,'audio/listening/original-v2');
const json=file=>JSON.parse(fs.readFileSync(file,'utf8')),hash=value=>crypto.createHash('sha256').update(value).digest('hex');

test('second batch freezes exactly the fifty approved O03 advanced listening questions',async()=>{
 const snapshot=json(path.join(base,'source-snapshot.json')),corpus=json(path.join(base,'corpus.json'));
 const {reviewHash}=await import('../scripts/build-original-exams.mjs');
 assert.equal(snapshot.items.length,50);assert.equal(new Set(snapshot.items.map(q=>q.script)).size,35);
 assert.deepEqual(snapshot.reusePacks,['original-v1']);
 for(const q of snapshot.items){assert.match(q.id,/^O03-II-L-\d\d$/);assert.equal(q.qa.contentSha256,reviewHash(q));assert.equal(q.audioStatus,'unavailable');assert.equal(corpus.byId[q.id].sourceContentSha256,reviewHash(q));assert.equal(corpus.byId[q.id].sourceScriptSha256,hash(q.script))}
});

test('second batch corpus is deterministic and only new text/voice pairs require generation',async()=>{
 const {buildCorpus}=await import('../scripts/build-original-listening-corpus.mjs');const corpus=buildCorpus(root,'original-v2');
 assert.deepEqual(corpus,json(path.join(base,'corpus.json')));assert.equal(corpus.questionCount,50);assert.equal(corpus.scriptCount,35);assert.equal(corpus.clipCount,100);assert.equal(corpus.newClipCount,100);assert.equal(corpus.reusedClipCount,0);assert.equal(corpus.blankSegments,5);
 assert.deepEqual(corpus.corpus.flatMap(row=>row.voices).reduce((out,voice)=>(out[voice]=(out[voice]||0)+1,out),{}),{M1:44,F1:55,F2:1});
});

test('original-v1 source, corpus, records, manifest and public catalog remain frozen',()=>{
 const files={
  'audio/listening/original-v1/source-snapshot.json':'d0a3a2145c56edf846b2b80c7f9c72377ae353b81e27531d1258def84f5ff971',
  'audio/listening/original-v1/corpus.json':'9df3ad270bb2fc802a817c00722f25bcfb5100ca7f35daaedeed12529d53c5f4',
  'audio/listening/original-v1/generation-records.json':'09f78fd3cdd016c1a84d81549c8b8542bfeb81e1889ee2e03ed90db9960021ca',
  'audio/listening/original-v1/manifest.json':'a8e13178756181c78813bd0b1577e9996640312c61ca1209ac76e6e1477832f9',
  'data/original-listening-audio-v1.js':'81f07ffdeae9075fbc8733bdd7a140090fe49efce2f322e75e410660f82b8ff6'
 };for(const [file,digest]of Object.entries(files))assert.equal(hash(fs.readFileSync(path.join(root,file))),digest,file);
});

test('separate V2 global fails closed until its own full manifest passes',async()=>{
 const {buildCatalog}=await import('../scripts/build-original-listening-catalog.mjs');
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/original-listening-audio-v2.js'),'utf8'),context);
 const result=JSON.parse(JSON.stringify(context.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V2));
 assert.equal(context.window.HARUMAL_ORIGINAL_LISTENING_AUDIO,undefined);assert.equal(result.batchId,'original-v2');
 assert.equal(result.humanPronunciationReview,false);assert.equal(result.scriptToAudioMeaningVerified,false);
 if(result.verified){assert.deepEqual(result,buildCatalog(root,'original-v2'));assert.equal(Object.keys(result.byId).length,50)}
 else{assert.deepEqual(result.byId,{});assert.deepEqual(result,buildCatalog(root,'original-v2',{allowPending:true}));assert.throws(()=>buildCatalog(root,'original-v2'))}
});

test('incremental reuse requires exact text and voice plus unchanged recorded bytes',async()=>{
 const {buildCorpus}=await import('../scripts/build-original-listening-corpus.mjs');const {reviewHash}=await import('../scripts/build-original-exams.mjs');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'harumal-audio-reuse-'));
 try{
  for(const pack of ['original-v1','original-v2'])fs.mkdirSync(path.join(temp,'audio/listening',pack),{recursive:true});
  for(const file of ['corpus.json','manifest.json'])fs.copyFileSync(path.join(root,'audio/listening/original-v1',file),path.join(temp,'audio/listening/original-v1',file));
  const old=json(path.join(root,'audio/listening/original-v1/source-snapshot.json')).items.find(q=>q.id==='O01-I-L-01');
  const q=JSON.parse(JSON.stringify(old));q.id='AUDIO-REUSE-FIXTURE';q.qa.contentSha256=reviewHash(q);
  const oldCorpus=json(path.join(root,'audio/listening/original-v1/corpus.json')),segment=oldCorpus.byId[old.id].segments[0];
  fs.mkdirSync(path.dirname(path.join(temp,segment.file)),{recursive:true});fs.copyFileSync(path.join(root,segment.file),path.join(temp,segment.file));
  const source={version:1,sourceFileSha256:'0'.repeat(64),reusePacks:['original-v1'],items:[q]};
  const sourcePath=path.join(temp,'audio/listening/original-v2/source-snapshot.json');fs.writeFileSync(sourcePath,JSON.stringify(source));
  const exact=buildCorpus(temp,'original-v2');assert.equal(exact.reusedClipCount,1);assert.equal(exact.newClipCount,0);assert.equal(exact.byId[q.id].segments[0].file,segment.file);
  q.script=q.script.replace(/^여자:/,'남자:');q.qa.contentSha256=reviewHash(q);fs.writeFileSync(sourcePath,JSON.stringify(source));
  const differentVoice=buildCorpus(temp,'original-v2');assert.equal(differentVoice.reusedClipCount,0);assert.equal(differentVoice.newClipCount,1);assert.match(differentVoice.byId[q.id].segments[0].file,/original-v2\/M1\//);
  q.script=old.script;q.qa.contentSha256=reviewHash(q);fs.writeFileSync(sourcePath,JSON.stringify(source));fs.appendFileSync(path.join(temp,segment.file),'corruption');assert.throws(()=>buildCorpus(temp,'original-v2'));
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
});
