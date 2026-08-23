const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const AI_VOICES=['F1','F2','F3','F4','F5','M1','M2','M3','M4','M5'].map(id=>({id,gender:id[0]==='F'?'female':'male'}));

function runtime(voices,{neuralInstalled=false}={}){
  const spoken=[],neuralSpoken=[],storage=new Map(),listeners={};
  const neural={voices:AI_VOICES,installedSync:()=>neuralInstalled,status:()=>({ready:true}),unlockAudio(){},cancel(){},speak:async(text,options)=>{neuralSpoken.push({text,options});return{provider:'webgpu'}},install:async()=>true,prepare:async()=>true,remove:async()=>true};
  const context={S:{lang:'ko'},console,localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},MALBIT_NEURAL_TTS:neural,addEventListener:(name,handler)=>{listeners[name]=handler},speechSynthesis:{getVoices:()=>voices,cancel(){},speak(item){spoken.push(item);item.onend?.()}},SpeechSynthesisUtterance:function(text){this.text=text}};
  context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync('tts-quality.js','utf8'),context);return{context,spoken,neuralSpoken,storage};
}

test('device fallback prefers an enhanced Korean voice and keeps the slower learning pace',async()=>{
  const basic={name:'Korean Compact',lang:'ko-KR',localService:true},enhanced={name:'Yuna Premium Enhanced',lang:'ko-KR',localService:true},foreign={name:'Samantha Enhanced',lang:'en-US',localService:true};
  const {context,spoken}=runtime([basic,foreign,enhanced]);const result=await context.MALBIT_TTS.play('꾸준히 공부해요.'),utterance=spoken[0];
  assert.equal(result.engine,'device');assert.equal(utterance.voice,enhanced);assert.equal(utterance.rate,.82);assert.equal(utterance.lang,'ko-KR');
});

test('dialogue speaker preference falls back safely to the best Korean device voice',()=>{
  const best={name:'Microsoft SunHi Online Natural',lang:'ko_KR',localService:false},basic={name:'Korean Basic',lang:'ko-KR',localService:true},roughMale={name:'Hyunsu Compact',lang:'ko-KR',localService:true};
  const {context}=runtime([basic,roughMale,best]);assert.equal(context.MALBIT_TTS.selectVoice('female'),best);assert.equal(context.MALBIT_TTS.selectVoice('male'),best);
});

test('one saved setting controls engine, voice and fine-grained speed across the app',()=>{
  const chosen={name:'Yuna Premium Enhanced',voiceURI:'voice:yuna',lang:'ko-KR',localService:true};const {context,storage}=runtime([chosen]);
  context.malbitTtsChooseDeviceVoice(chosen.voiceURI);context.malbitTtsSetRate(.77,false);const utterance=context.MALBIT_TTS.utterance('설정 확인');
  assert.equal(utterance.voice,chosen);assert.equal(utterance.rate,.77);assert.deepEqual(JSON.parse(storage.get('malbitTtsPrefsV1')),{rate:.77,voiceId:'voice:yuna',engine:'device',neuralVoice:'F2'});
});

test('installed neural pack uses the selected AI style and matches dialogue gender',async()=>{
  const {context,neuralSpoken,spoken}=runtime([],{neuralInstalled:true});
  context.malbitTtsChooseNeuralVoice('F4');await context.MALBIT_TTS.play('회의를 시작하겠습니다.',{gender:'male'});
  assert.equal(spoken.length,0);assert.equal(neuralSpoken.at(-1).options.voiceId,'M4');assert.equal(neuralSpoken.at(-1).options.steps,6);
});

test('settings expose ten zero-fee neural choices without paid-sounding tier labels',()=>{
  const voice={name:'Yuna Premium Enhanced',voiceURI:'voice:yuna',lang:'ko-KR',localService:true};const {context}=runtime([voice]),markup=context.MALBIT_TTS.settingsMarkup();
  assert.equal(context.MALBIT_TTS.displayName(voice,0),'Yuna');assert.match(markup,/무료 AI 음성/);assert.match(markup,/약 230MB/);assert.match(markup,/10가지 음성/);assert.match(markup,/malbitTtsRange/);assert.doesNotMatch(markup,/Premium|프리미엄/i);
  assert.equal((markup.match(/data-tts-neural-voice=/g)||[]).length,10);
});

test('neural pack is pinned, local-only and never adds a client API secret',()=>{
  const source=fs.readFileSync('neural-tts.js','utf8'),worker=fs.readFileSync('sw.js','utf8'),bootstrap=fs.readFileSync('site-patch.js','utf8');
  assert.match(source,/1035a9450d054103f69c6815539ca069e81cce15/);assert.match(source,/onnxruntime-web@\$\{ORT_VERSION\}/);assert.match(source,/OpenRAIL-M/);assert.match(source,/CACHE_NAME='malbit-neural-tts-v1'/);
  assert.doesNotMatch(source,/api[_-]?key|bearer\s+[a-z0-9]/i);assert.match(worker,/NEURAL_CACHE='malbit-neural-tts-v1'/);assert.ok(bootstrap.indexOf("'neural-tts.js'")<bootstrap.indexOf("'tts-quality.js'"));
});
