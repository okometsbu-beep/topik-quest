const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=f=>fs.readFileSync(f,'utf8');
const spec=JSON.parse(read('audio/listening/register-v1/corpus.json'));
function boot(adjust=()=>{}){
 const c={console,window:{},localStorage:{getItem:()=>null,setItem:()=>{}}};vm.createContext(c);
 for(let p=1;p<=4;p++)vm.runInContext(read(`data/question-bank-v1-part${p}.js`),c);
 vm.runInContext(read('data/question-bank-practice-v1.js'),c);vm.runInContext(read('data/listening-register-corrections-v1.js'),c);
 const pending=JSON.parse(JSON.stringify(c.window.HARUMAL_LISTENING_REGISTER_CORRECTIONS));
 adjust(c.window,pending);vm.runInContext(read('question-bank-engine.js'),c);return c.window.MALBIT_BANK;
}
function active(window,overlay){
 overlay.activationAllowed=true;overlay.audioReady=true;for(const repair of Object.values(overlay.byId))repair.audioReady=true;
 window.HARUMAL_LISTENING_REGISTER_CORRECTIONS=overlay;
 window.HARUMAL_LISTENING_REGISTER_AUDIO={version:1,verified:true,scripts:JSON.parse(JSON.stringify(spec.scripts))};
}
const id=spec.coverage[0].id,original=spec.coverage[0].originalScript,corrected=spec.coverage[0].script;
test('pending or unverified correction/catalog never changes runtime dialogue',()=>{
 assert.equal(boot().byId(id).script,original);
 for(const change of [
  w=>{delete w.HARUMAL_LISTENING_REGISTER_AUDIO},
  w=>{w.HARUMAL_LISTENING_REGISTER_AUDIO.verified=false},
  w=>{w.HARUMAL_LISTENING_REGISTER_CORRECTIONS.audioReady=false},
  w=>{w.HARUMAL_LISTENING_REGISTER_CORRECTIONS.activationAllowed=false},
  w=>{w.HARUMAL_LISTENING_REGISTER_CORRECTIONS.byId[id].reviewStatus='draft'},
  w=>{w.HARUMAL_LISTENING_REGISTER_CORRECTIONS.byId[id].audioReady=false},
  w=>{w.HARUMAL_LISTENING_REGISTER_CORRECTIONS.byId[id].originalScript+=' changed'}
 ])assert.equal(boot((w,o)=>{active(w,o);change(w)}).byId(id).script,original);
});
test('runtime only applies exact reviewed correction together with its verified new audio mapping',()=>{
 const bank=boot(active),q=bank.byId(id),baseline=boot().byId(id);
 assert.equal(q.script,corrected);assert.equal(q.audioStatus,'recorded');assert.equal(q.id,id);
 for(const key of ['passage','prompt','instruction','explanationKo','explanationJa','answerIndex'])assert.equal(q[key],baseline[key]);
 assert.deepEqual(Array.from(q.options),Array.from(baseline.options));assert.equal(bank.total,2144);
});
test('a corrected dialogue cannot silently reuse old audio filenames or wrong voices',()=>{
 for(const change of [
  s=>{s.file=s.file.replace('/register-v1/','/v1/')},
  s=>{s.voice=s.voice==='F1'?'M1':'F1'},
  s=>{s.id='0000000000000000'}
 ])assert.equal(boot((w,o)=>{active(w,o);const segment=w.HARUMAL_LISTENING_REGISTER_AUDIO.scripts[corrected].find(s=>s.file?.includes('/register-v1/'));change(segment)}).byId(id).script,original);
});

test('separate real-file catalog resolves corrected scripts without changing pending bank text',()=>{
 const c={};c.window=c;vm.createContext(c);for(const file of ['listening-audio.js','data/listening-register-audio-v1.js','listening-register-audio.js'])vm.runInContext(read(file),c);
 const parts=c.HARUMAL_LISTENING_AUDIO.resolve(corrected);assert.ok(parts.length);for(const p of parts)if(p.url){assert.ok(fs.existsSync(p.url));assert.ok(p.text)}assert.equal(boot().byId(id).script,original);
});
