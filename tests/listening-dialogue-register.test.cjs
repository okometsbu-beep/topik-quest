const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const ledger=JSON.parse(fs.readFileSync('content/listening-dialogue-register-v1.json','utf8'));
test('only two legacy conversations change, answers and summary choices survive',()=>{
 const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('legacy-data.js','utf8')+';this.items=LS',c);
 assert.deepEqual(ledger.repairs.map(r=>r.id),[6,17]);
 for(const r of ledger.repairs){
 assert.equal(JSON.stringify(c.items.find(q=>q.id===r.id)),JSON.stringify(r.after));
 assert.equal(r.after.answer,r.before.answer);assert.equal(r.after.answerIndex,r.before.answerIndex);
 const changed=Object.keys(r.before).filter(k=>JSON.stringify(r.before[k])!==JSON.stringify(r.after[k]));
 assert.deepEqual(changed.sort(),(r.id===6?['choices','choicesJa','script','scriptJa']:['script','scriptJa']).sort());
 for(const u of r.utterances)assert.equal(u.id,crypto.createHash('sha256').update(u.text).digest('hex').slice(0,16));
 }
});
test('exact repaired scripts resolve to gender-correct new audio; other text delegates',()=>{
 const fallback=[{url:'original.mp3'}];const c={window:{HARUMAL_LISTENING_AUDIO:{resolve:()=>fallback}}};vm.createContext(c);
 for(const f of ['data/listening-dialogue-register-v1.js','listening-dialogue-register.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
 const api=c.window.HARUMAL_LISTENING_AUDIO;
 for(const r of ledger.repairs){
 const segments=api.resolve(r.after.script).filter(s=>s.url);
 assert.equal(segments.length,2);
 segments.forEach((s,i)=>{assert.equal(s.text,r.utterances[i].text);assert.equal(s.gender,i?'male':'female');assert.ok(s.url.endsWith(r.utterances[i].id+'.mp3'));});
 assert.equal(api.resolve(r.before.script),fallback);
 }
 assert.equal(api.resolve('unrelated expert text'),fallback);
});
test('repair pipeline is idempotent',()=>{
 const cp=require('node:child_process');const before=fs.readFileSync('legacy-data.js','utf8');
 cp.execFileSync(process.execPath,['scripts/build-listening-dialogue-register.cjs']);
 assert.equal(fs.readFileSync('legacy-data.js','utf8'),before);
});
test('malformed, incomplete, unverified or wrong-voice catalog delegates safely',()=>{
 const mutations=[
 d=>{d.verified=false},d=>{delete d.scripts[ledger.repairs[0].after.script]},
 d=>{d.scripts[ledger.repairs[0].after.script].pop()},
 d=>{d.scripts[ledger.repairs[0].after.script][0].voice='M1'},
 d=>{d.scripts[ledger.repairs[0].after.script][0].file='evil.mp3'},
 d=>{d.scripts[ledger.repairs[0].after.script][0].id='0000000000000000'},
 d=>{d.scripts[ledger.repairs[0].after.script][0].text='unrelated'},
 d=>{d.scripts[ledger.repairs[0].after.script][0]=null}
 ];
 for(const mutate of mutations){const fallback=[];const c={window:{HARUMAL_LISTENING_AUDIO:{resolve:()=>fallback}}};vm.createContext(c);vm.runInContext(fs.readFileSync('data/listening-dialogue-register-v1.js','utf8'),c);mutate(c.window.HARUMAL_LISTENING_DIALOGUE_REGISTER);vm.runInContext(fs.readFileSync('listening-dialogue-register.js','utf8'),c);assert.equal(c.window.HARUMAL_LISTENING_AUDIO.resolve(ledger.repairs[0].after.script),fallback);}
});
