const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
function boot(saved=null){const spoken=[],storage=new Map();if(saved)storage.set('malbitTtsPrefsV1',JSON.stringify(saved));let cancelled=0;const good={name:'Yuna Premium Enhanced',lang:'ko-KR',voiceURI:'yuna',localService:true};const c={console,S:{lang:'ko'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))},speechSynthesis:{getVoices:()=>[{name:'Korean Compact',lang:'ko-KR'},good],cancel(){},addEventListener(){},speak(u){spoken.push(u);u.onend?.()}},SpeechSynthesisUtterance:function(text){this.text=text},HARUMAL_LISTENING_AUDIO:{cancel(){cancelled++}},fetch(){throw Error('No external TTS request allowed')},Worker:function(){throw Error('No model worker allowed')},document:{querySelectorAll:()=>[],querySelector:()=>null}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('tts-quality.js','utf8'),c);return{c,spoken,storage,good,cancelled:()=>cancelled}}
test('vocabulary and other arbitrary text always use device speech without model or network',async()=>{const{c,spoken,good}=boot({engine:'neural',neuralVoice:'M4',rate:.77});const result=await c.MALBIT_TTS.play('단어장에서 새로 등록한 문장');assert.equal(result.engine,'device');assert.equal(spoken[0].text,'단어장에서 새로 등록한 문장');assert.equal(spoken[0].voice,good);assert.equal(spoken[0].rate,.77)});
test('settings explain listening files and contain no AI model download or realtime switch',()=>{const{c}=boot();const markup=c.MALBIT_TTS.settingsMarkup();assert.match(markup,/듣기 문제는 Supertonic 3/);assert.match(markup,/기기에 AI 모델을 설치하지 않습니다/);assert.doesNotMatch(markup,/430MB|230MB|음성팩 받기|malbitTtsInstallNeural|실시간 생성/);assert.equal(c.malbitTtsInstallNeural,undefined)});
test('voice and rate edits preserve legacy preferences and cancel listening playback',async()=>{const{c,storage,cancelled}=boot({engine:'neural',neuralVoice:'M4',rate:.9,custom:'keep'});c.malbitTtsSetRate(.75);await c.malbitTtsChooseDeviceVoice('yuna');const prefs=JSON.parse(storage.get('malbitTtsPrefsV1'));assert.equal(prefs.custom,'keep');assert.equal(prefs.neuralVoice,'M4');assert.equal(prefs.engine,'device');assert.equal(prefs.rate,.75);assert.ok(cancelled()>0)});
test('the active runtime no longer loads either old on-device model or general recorded-voice pack',()=>{const bootstrap=fs.readFileSync('site-patch.js','utf8');assert.doesNotMatch(bootstrap,/'neural-tts.js'|'tts-static-ko.js'/);assert.match(bootstrap,/'listening-audio.js'/);assert.doesNotMatch(fs.readFileSync('tts-quality.js','utf8'),/MALBIT_NEURAL_TTS|HARUMAL_STATIC_TTS/)});

function inlineBoot(saved={}, {reject=false}={}){
 const b=boot(saved),audio=[],timers=new Map(),intervals=new Map(),listeners={},observers=[];let id=0;
 const screen={firstElementChild:{},isConnected:true},dialog={hidden:false,isConnected:true},status={textContent:''};
 b.c.S.view='shorts';
 b.c.document={querySelectorAll:selector=>selector==='[data-tts-preview-status]'?[status]:[],querySelector:()=>null,getElementById:id=>id==='screen'?screen:id==='harumalSettingsDialog'?dialog:null,createElement(){throw Error('Short audio must not create a player or popup')}};
 b.c.Audio=class{constructor(){this.duration=1.8;this.currentTime=0;audio.push(this)}load(){this.onloadedmetadata?.()}pause(){this.paused=true}removeAttribute(){this.src=''}play(){this.paused=false;this.playedSrc=this.src;this.plays=(this.plays||0)+1;if(reject)return Promise.reject(Error('missing'));this.onplaying?.();return Promise.resolve()}};
 b.c.setTimeout=(fn,ms)=>{const n=++id;timers.set(n,{fn,ms});return n};b.c.clearTimeout=n=>timers.delete(n);b.c.setInterval=fn=>{const n=++id;intervals.set(n,fn);return n};b.c.clearInterval=n=>intervals.delete(n);
 b.c.addEventListener=(name,fn)=>listeners[name]=fn;
 b.c.MutationObserver=class{constructor(callback){this.callback=callback;observers.push(this)}observe(){}disconnect(){this.disconnected=true}};
 b.c.speechSynthesis.speak=u=>{b.spoken.push(u);u.onstart?.()};
 vm.runInContext(fs.readFileSync('listening-player.js','utf8'),b.c);
 return{...b,audio,screen,dialog,status,timers,intervals,listeners,observers,tick(){for(const fn of intervals.values())fn()},mutate(){for(const o of observers)if(!o.disconnected)o.callback()}};
}
test('settings preview uses existing Supertonic F1/M1 MP3 at exact saved speed and matching transcript',async()=>{
 const b=inlineBoot({rate:.73,voiceId:'yuna',custom:'keep',neuralVoice:'F4'}),manifest=JSON.parse(fs.readFileSync('audio/listening/v1/manifest.json')),corpus=JSON.parse(fs.readFileSync('audio/listening/v1/corpus.json'));
 assert.equal(manifest.model,'supertone-oss-archive/supertonic-3');assert.match(b.c.MALBIT_TTS.settingsMarkup(),/주말에 뭐 했어요\?/);
 for(const voice of ['F1','M1']){
  const done=b.c.malbitTtsChooseRecordedVoice(voice),a=b.audio.at(-1),file=manifest.files.find(f=>f.file===a.playedSrc),entry=corpus.corpus.find(x=>x.id===file.id);
  assert.equal(file.voice,voice);assert.equal(entry.text,'주말에 뭐 했어요?');assert.ok(entry.voices.includes(voice));assert.ok(fs.existsSync(file.file));assert.ok(file.duration<2);
  assert.equal(a.playbackRate,.73);assert.equal(b.spoken.length,0);assert.match(b.status.textContent,/Supertonic 3/);a.onended();assert.equal((await done).engine,'listening-file');assert.match(b.status.textContent,/완료/);
 }
 const prefs=JSON.parse(b.storage.get('malbitTtsPrefsV1'));assert.equal(prefs.recordedVoice,'M1');assert.equal(prefs.custom,'keep');assert.equal(prefs.voiceId,'yuna');assert.equal(prefs.neuralVoice,'F4');
});
test('recorded preview is the primary control; explicit device preview stays inside device details',()=>{
 const {c}=boot(),markup=c.MALBIT_TTS.settingsMarkup(),details=markup.match(/<details class="malbitTtsDeviceDetails">([\s\S]*?)<\/details>/)[1];
 assert.match(details,/malbitTtsPreviewDevice\(\)/);assert.doesNotMatch(details,/onclick="malbitTtsPreview\(\)"/);assert.match(markup,/Supertonic 3 · MP3/);assert.match(markup,/data-tts-recorded-voice="F1"/);assert.match(markup,/data-tts-recorded-voice="M1"/);
});
test('preview repeat clicks cancel old MP3 and ignore stale completion',async()=>{
 const b=inlineBoot({rate:1}),old=b.c.malbitTtsPreview(),a=b.audio[0],stale=a.onended,next=b.c.malbitTtsChooseRecordedVoice('M1');
 assert.equal((await old).cancelled,true);assert.equal(a.paused,true);stale();assert.equal(b.c.HARUMAL_LISTENING_PLAYER.busy('settings-preview'),true);assert.match(b.status.textContent,/재생 중/);b.audio[1].onended();await next;
});
test('closing settings or changing the screen stops MP3 previews without stale playback',async()=>{
 for(const action of [b=>{b.dialog.hidden=true;b.mutate()},b=>{b.screen.firstElementChild={};b.mutate()},b=>{b.c.S.view='home';b.tick()},b=>b.c.MALBIT_TTS.cancel()]){
  const b=inlineBoot(),done=b.c.malbitTtsPreview(),a=b.audio[0],stale=a.onplaying;action(b);stale();assert.equal((await done).cancelled,true);assert.equal(a.paused,true);assert.equal(b.c.HARUMAL_LISTENING_PLAYER.busy(),false);assert.equal(b.timers.size,0);assert.equal(b.intervals.size,0);assert.equal(b.status.textContent,'');
 }
});
test('failed preview stays an MP3 error and does not silently use device speech',async()=>{
 const b=inlineBoot({}, {reject:true}),result=await b.c.malbitTtsPreview();assert.equal(result.error,true);assert.equal(result.heard,false);assert.equal(b.spoken.length,0);assert.match(b.status.textContent,/재생하지 못/);
});
test('short vocabulary, Shorts and beginner reads start immediately with saved rate and no popup',async()=>{
 for(const text of ['급격히','기역','가','나무']){
  const b=inlineBoot({rate:.73}),done=b.c.MALBIT_TTS.play(text);assert.equal(b.spoken.length,1);assert.equal(b.spoken[0].text,text);assert.equal(b.spoken[0].rate,.73);assert.equal(b.audio.length,0);b.spoken[0].onend();assert.equal((await done).engine,'device');
 }
});
test('short read repeated clicks and screen replacement cancel old utterances',async()=>{
 const b=inlineBoot(),old=b.c.MALBIT_TTS.play('나무'),stale=b.spoken[0].onend,next=b.c.MALBIT_TTS.play('포도');assert.equal((await old).cancelled,true);stale();await Promise.resolve();assert.equal(b.c.HARUMAL_LISTENING_PLAYER.busy('device-read'),true);b.screen.firstElementChild={};b.mutate();assert.equal((await next).cancelled,true);assert.equal(b.c.HARUMAL_LISTENING_PLAYER.busy(),false);
});
test('page hide and history navigation cancel inline reads and previews',async()=>{
 for(const event of ['pagehide','popstate'])for(const type of ['device','recorded']){
  const b=inlineBoot(),done=type==='device'?b.c.MALBIT_TTS.play('나무'):b.c.malbitTtsPreview();b.listeners[event]();assert.equal((await done).cancelled,true);assert.equal(b.intervals.size,0);
 }
});
test('rate-triggered preview uses MP3 while explicit device testing remains device speech',async()=>{
 const b=inlineBoot({custom:'keep'}),done=b.c.malbitTtsSetRate(.73,true);assert.equal(b.audio[0].playbackRate,.73);assert.equal(b.spoken.length,0);b.audio[0].onended();await done;const device=b.c.malbitTtsPreviewDevice();assert.equal(b.spoken[0].rate,.73);b.spoken[0].onend();assert.equal((await device).engine,'device');assert.equal(JSON.parse(b.storage.get('malbitTtsPrefsV1')).custom,'keep');
});
test('TTS controls use theme tokens and contain no residual fixed blue control colors',()=>{
 const source=fs.readFileSync('tts-quality.js','utf8');assert.match(source,/var\(--ui-accent/);assert.match(source,/var\(--ui-ink/);assert.match(source,/var\(--ui-muted/);assert.doesNotMatch(source,/#(?:132b48|214c91|6d91ff|9fc0ff|304c6e|1d416d)\b/i);
});
test('preview is unavailable rather than disguised device speech before the player loads',async()=>{
 const b=boot(),result=await b.c.malbitTtsPreview();assert.equal(result.unavailable,true);assert.equal(result.engine,'listening-file');assert.equal(b.spoken.length,0);
});
test('source label honestly distinguishes recorded preview and ordinary device reading',async()=>{
 const b=inlineBoot(),preview=b.c.malbitTtsPreview();assert.match(b.c.MALBIT_TTS.sourceLabel(),/SUPERTONIC 3 · MP3/);b.audio[0].onended();await preview;const read=b.c.MALBIT_TTS.play('나무');assert.match(b.c.MALBIT_TTS.sourceLabel(),/DEVICE SPEECH/);assert.doesNotMatch(b.c.MALBIT_TTS.sourceLabel(),/FALLBACK/);b.spoken[0].onend();await read;
});
