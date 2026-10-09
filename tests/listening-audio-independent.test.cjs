const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=file=>fs.readFileSync(require('node:path').join(__dirname,'..',file),'utf8');
const spec=JSON.parse(read('audio/listening/v1/corpus.json'));
test('generated speech omits presenter and speaker direction labels',()=>{
 const leaked=spec.corpus.filter(row=>/^(진행자|전문가|여자|남자|여성|남성|안내|방송)(?:[（(][^）)]*[）)])?\s*[:：]/.test(row.text));assert.deepEqual(leaked.map(x=>x.id),[],'role names are instructions, not spoken dialogue');
});
test('inventory covers both TOPIK levels and growth listening without extra reading sources',()=>{
 const buckets={bank:0,topik1:0,topik2:0,growth:0};for(const row of spec.coverage){const key=row.id.startsWith('legacy-I-')?'topik1':row.id.startsWith('legacy-II-')?'topik2':row.id.startsWith('GL-')?'growth':'bank';buckets[key]++}assert.deepEqual(buckets,{bank:968,topik1:30,topik2:50,growth:2});
 const bootstrap=read('site-patch.js');assert.ok(bootstrap.includes("'listening-audio.js'"));assert.ok(!bootstrap.includes("'neural-tts.js'"));assert.ok(!bootstrap.includes("'tts-static-ko.js'"));assert.doesNotMatch(read('tts-quality.js'),/430\s*MB|malbitTtsInstallNeural|new Worker/);
});
test('cancelling during a response blank clears silence timers and cannot advance a stale callback',async()=>{
 const audios=[],timers=new Map();let id=0;function Audio(){audios.push(this);this.duration=1;this.play=()=>Promise.resolve();this.pause=()=>{};this.removeAttribute=()=>{};this.load=()=>{}}
 const c={Audio,console,setTimeout(fn,ms){const k=++id;timers.set(k,{fn,ms});return k},clearTimeout:k=>timers.delete(k),document:{getElementById:()=>null}};c.window=c;c.MALBIT_TTS={cancel:()=>c.HARUMAL_LISTENING_AUDIO.cancel()};vm.createContext(c);vm.runInContext(read('listening-audio.js'),c);
 const script=spec.coverage.find(row=>row.id==='P01-I-L-01').script,api=c.HARUMAL_LISTENING_AUDIO,pending=api.play(script);audios[0].onended();const transition=[...timers.values()].find(x=>x.ms===0);assert.ok(transition);transition.fn();const pause=[...timers.values()].find(x=>x.ms===1200);assert.ok(pause);api.cancel();assert.equal((await pending).cancelled,true);assert.equal([...timers.values()].some(x=>x.ms===1200),false);pause.fn();assert.equal(audios.length,1);
});
test('TOPIK I device fallback does not schedule the next line after cancellation',async()=>{
 const scheduled=[],c={stopAudio(){},setTimeout(fn){scheduled.push(fn)},MALBIT_TTS:{play:async()=>({cancelled:true}),lineDelay:380},Date};c.window=c;vm.createContext(c);const s=read('topik1.js'),start=s.indexOf('function tts(txt)'),end=s.indexOf('\nasync function play(id)',start);assert.ok(start>=0&&end>start);vm.runInContext(s.slice(start,end),c);c.tts('여자: 첫 번째 대사입니다.\n남자: 두 번째 대사입니다.');await Promise.resolve();await Promise.resolve();assert.equal(scheduled.length,0,'cancelled fallback must not restart another line');
});
test('TOPIK II device fallback does not schedule the next line after cancellation',async()=>{
 const scheduled=[],c={audioFallbackToken:0,$:()=>null,koVoices:()=>[],naturalizeLine:s=>s,audioDone(){},setTimeout(fn){scheduled.push(fn)},MALBIT_TTS:{play:async()=>({cancelled:true}),lineDelay:380}};c.window=c;vm.createContext(c);const s=read('legacy-core.js'),start=s.indexOf('function playTTSFallback('),end=s.indexOf('\n',start);assert.ok(start>=0&&end>start);vm.runInContext(s.slice(start,end),c);c.playTTSFallback({script:'여자: 첫 번째 대사입니다.\n남자: 두 번째 대사입니다.'},null,false);await Promise.resolve();await Promise.resolve();assert.equal(scheduled.length,0,'cancelled fallback must not restart another line');
});
