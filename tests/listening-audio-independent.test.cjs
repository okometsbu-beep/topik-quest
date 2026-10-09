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
for(const level of [1,2])test(`TOPIK ${level} owner consumes at actual start and restores only on failure`,async()=>{
 const q={id:1,script:'여자: 시험 음성'},exam={mode:'real',played:{},audioPlayed:{},i:0,id:1,phase:'listen'},node={dataset:{listeningPlayer:`topik${level}:1`}};let options,saves=0;
 const player={busy:()=>false,cancel(){},play(o){options=o;return Promise.resolve({})}};
 const c={window:null,Q:exam,S:{view:'real',real:exam},LS:[q],find:()=>q,document:{querySelector:()=>node},HARUMAL_LISTENING_PLAYER:player,stopAudio(){},stopListeningAudio(){},saveQ(){saves++},save(){saves++}};c.window=c;vm.createContext(c);
 const source=read(level===1?'topik1.js':'legacy-core.js'),name=level===1?'play':'playListening',start=source.indexOf(`async function ${name}(`),end=source.indexOf('\n}',start)+2;assert.ok(start>=0&&end>start);vm.runInContext(source.slice(start,end),c);await vm.runInContext(level===1?'play(1)':'playListening(1,true)',c);
 const attempts=level===1?exam.played:exam.audioPlayed;assert.equal(attempts[1],undefined,'loading uses no attempt');options.onStart();assert.ok(attempts[1]);options.onResult({cancelled:true,started:true});assert.ok(attempts[1],'intentional stop keeps consumed attempt');options.onResult({error:true});assert.equal(attempts[1],undefined,'failed playback restores retry');assert.ok(saves>=2);assert.equal(options.isCurrent(),true);c.S.view='home';assert.equal(options.isCurrent(),false,'navigation invalidates the request');
});
