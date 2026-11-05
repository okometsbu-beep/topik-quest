// Exact, idempotent two-question repair. Old text stays in the ledger and old audio stays in its catalog.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ledger=JSON.parse(fs.readFileSync('content/listening-dialogue-register-v1.json','utf8'));
let source=fs.readFileSync('legacy-data.js','utf8');
for(const {before,after} of ledger.repairs){
 const old=JSON.stringify(before),next=JSON.stringify(after);
 if(source.includes(old)) source=source.replace(old,next);
 else if(!source.includes(next)) throw Error('Source drift at LS '+before.id);
}
fs.writeFileSync('legacy-data.js',source);
const scripts={};
for(const r of ledger.repairs) scripts[r.after.script]=r.utterances.flatMap((u,i)=>[
 {...u,file:'audio/listening/dialogue-register-v1/'+u.voice+'/'+u.id+'.mp3'}
]);
{
 const manifest=JSON.parse(fs.readFileSync('audio/listening/dialogue-register-v1/manifest.json','utf8'));
 const corpusBytes=fs.readFileSync('audio/listening/dialogue-register-v1/corpus.json');
 if(manifest.verified!==true||manifest.corpusSha256!==crypto.createHash('sha256').update(corpusBytes).digest('hex'))throw Error('Corpus verification failed');

 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 const corpus=JSON.parse(corpusBytes),record=JSON.parse(fs.readFileSync('audio/listening/dialogue-register-v1/generation-record.json','utf8'));
 assert.equal(manifest.files.length,4);assert.equal(record.files.length,4);
 assert.equal(new Set(manifest.files.map(f=>f.file)).size,4);
 assert.equal(new Set(record.files.map(f=>f.file)).size,4);
 assert.equal(record.corpusSha256,hash(corpusBytes));
 assert.equal(record.manifestSha256,hash(fs.readFileSync('audio/listening/dialogue-register-v1/manifest.json')));
 assert.deepEqual(corpus.coverage,ledger.repairs.map(r=>({id:'legacy-II-'+r.id,originalScript:r.before.script,script:r.after.script})));
 const canonical=x=>Object.fromEntries(Object.entries(x).map(([k,v])=>[k,v.map(({id,voice,text,file})=>({id,voice,text,file}))]));
 assert.deepEqual(canonical(corpus.scripts),canonical(scripts));
 assert.equal(corpus.corpus.length,4);
 for(const u of Object.values(scripts).flat().filter(x=>x.file)){
  const f=manifest.files.find(f=>f.id===u.id&&f.voice===u.voice);
  const bytes=fs.readFileSync(u.file);
  assert.equal(f.file,u.file);
  const row=corpus.corpus.find(x=>x.id===u.id);
  assert.equal(row.text,u.text);assert.deepEqual(row.voices,[u.voice]);
  const generated=record.files.find(x=>x.id===u.id&&x.voice===u.voice);
  assert.equal(generated.file,u.file);assert.equal(generated.textSha256,hash(u.text));assert.equal(generated.sha256,hash(bytes));
  if(!f||f.text!==u.text||f.textSha256!==crypto.createHash('sha256').update(u.text).digest('hex')||f.decodeVerified!==true||!(f.duration>0)||f.bytes!==bytes.length||f.sha256!==crypto.createHash('sha256').update(bytes).digest('hex'))throw Error('Unverified audio '+u.file);
 }
}

fs.writeFileSync('data/listening-dialogue-register-v1.js','// Exact verified legacy dialogue repairs only. Generated from correction ledger.\nwindow.HARUMAL_LISTENING_DIALOGUE_REGISTER='+JSON.stringify({version:1,verified:true,scripts})+';\n');
