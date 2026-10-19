const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('site-patch.js','utf8');
const flush=async()=>{for(let n=0;n<30;n++)await Promise.resolve()};
function boot(failures={},timeoutFile=null){
 const attempts=[],executed=[],timers=new Map(),finished=[],saved={vocab:['keep'],review:{q:1},travel:{stage:2}};let id=0;
 const c={console:{error(){}},localStorage:{getItem:()=>JSON.stringify(saved),setItem(){throw Error('must not mutate saved progress')},removeItem(){throw Error('must not clear progress')}},document:{documentElement:{classList:{remove(){}}},createElement:()=>({remove(){this.removed=true}}),head:{appendChild(){}},body:{appendChild(s){const name=s.src.split('?')[0];attempts.push(name);if(name===timeoutFile)return;if((failures[name]||0)>0){failures[name]--;queueMicrotask(()=>s.onerror?.());}else{executed.push(name);queueMicrotask(()=>s.onload?.())}}}},setTimeout(fn,ms){const key=++id;if(ms===15000)timers.set(key,fn);else queueMicrotask(fn);return key},clearTimeout(key){timers.delete(key)},render(){},__malbitBoot:{finish:r=>finished.push(r)},requestAnimationFrame:fn=>fn()};c.window=c;vm.runInNewContext(source,c);return{c,attempts,executed,finished,timers,saved};
}
test('transient dependency errors retry only the failed file, retain order, and complete remaining modules',async()=>{
 const b=boot({'practice-sessions.js':1});await flush();await new Promise(r=>setImmediate(r));
 assert.equal(b.attempts.filter(x=>x==='practice-sessions.js').length,2);
 assert.equal(b.executed.filter(x=>x==='practice-sessions.js').length,1);
 assert.deepEqual(b.executed,Array.from(b.c.__MALBIT_RUNTIME__.files));assert.deepEqual(b.finished,['ready']);assert.deepEqual(b.saved,{vocab:['keep'],review:{q:1},travel:{stage:2}});
});
test('persistent dependency failure stops after three attempts without executing dependent modules',async()=>{
 const b=boot({'practice-sessions.js':9});await new Promise(r=>setImmediate(r));
 assert.equal(b.attempts.filter(x=>x==='practice-sessions.js').length,3);assert.ok(!b.executed.includes('learning-hub.js'));assert.deepEqual(b.finished,['dependency-error']);
});
test('ambiguous script timeouts never retry in the same document',async()=>{
 const b=boot({},'practice-sessions.js');await new Promise(r=>setImmediate(r));for(const fn of b.timers.values())fn();await flush();
 assert.equal(b.attempts.filter(x=>x==='practice-sessions.js').length,1);assert.deepEqual(b.finished,['dependency-error']);
});
function shell(){
 const nodes=new Map(),timers=new Map();let reloads=0,id=0;
 const c={document:{documentElement:{classList:{remove(){}}},getElementById:key=>nodes.get(key),createElement:()=>({children:[],setAttribute(){},style:{},appendChild(n){this.children.push(n)},remove(){nodes.delete(this.id)}}),body:{appendChild(n){if(n.id)nodes.set(n.id,n)}}},location:{protocol:'https:',reload(){reloads++}},navigator:{},sessionStorage:{getItem:()=>null},setTimeout(fn,ms){timers.set(++id,{fn,ms});return id},clearTimeout(k){timers.delete(k)},ml:ko=>ko,render(){},HARUMAN_INTRO:{finish(){}},console};c.window=c;
 const html=fs.readFileSync('index.html','utf8'),start=html.indexOf('(function(){'),end=html.indexOf('})();',start)+5;vm.runInNewContext(html.slice(start,end),c);return{c,nodes,timers,reloads:()=>reloads};
}
test('failed boot offers persistent honest recovery and reload without clearing storage',()=>{
 const b=shell();b.c.__malbitBoot.finish('dependency-error');const note=b.nodes.get('malbitBootRecovery');assert.match(note.textContent,/다 불러오지 못/);assert.doesNotMatch(note.textContent,/복구했습니다/);assert.equal(note.children.length,1);note.children[0].onclick();assert.equal(b.reloads(),1);assert.ok(![...b.timers.values()].some(t=>t.ms===4500));b.c.__malbitBoot.finish('dependency-error');assert.equal(b.nodes.size,1);
});
test('late successful boot removes recovery notice',()=>{const b=shell();b.c.__malbitBoot.finish('watchdog');assert.ok(b.nodes.has('malbitBootRecovery'));b.c.__malbitBoot.finish('ready');assert.ok(!b.nodes.has('malbitBootRecovery'))});
