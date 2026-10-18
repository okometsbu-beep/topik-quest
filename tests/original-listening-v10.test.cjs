const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
test('V10 adds exactly the remaining 230 questions with unchanged ordered source and no audible-quality claim',async()=>{
 const {buildCorpus}=await import('../scripts/build-original-listening-corpus.mjs');
 const {buildCatalog}=await import('../scripts/build-original-listening-catalog.mjs');
 const base='audio/listening/original-v10/',source=read(base+'source-snapshot.json'),corpus=read(base+'corpus.json');
 const old=new Set(Array.from({length:9},(_,i)=>read(`audio/listening/original-v${i+1}/source-snapshot.json`).items).flat().map(q=>q.id));
 assert.equal(source.items.length,230);assert.ok(source.items.every(q=>!old.has(q.id)));
 assert.deepEqual(corpus,buildCorpus(root,'original-v10'));assert.equal(corpus.scriptCount,167);assert.equal(corpus.clipCount,428);assert.equal(corpus.reusedClipCount,0);
 const catalog=buildCatalog(root,'original-v10');
 for(const key of ['humanPronunciationReview','scriptToAudioMeaningVerified','physicalDevicePlaybackVerified'])assert.equal(catalog[key],false);
 const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/original-listening-audio-v10.js'),'utf8'),c);assert.deepEqual(JSON.parse(JSON.stringify(c.window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V10)),catalog);
 for(const id of ['O09-II-L-41','O09-II-L-42'])assert.ok(catalog.byId[id].segments.some(s=>s.file==='audio/listening/original-v10/F1/800786a0a81d1d16.mp3'),'Known pause remains pending audible review');
});
