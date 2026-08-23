const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function runtime(voices){
  const spoken=[],storage=new Map();
  const context={S:{lang:'ko'},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))},speechSynthesis:{getVoices:()=>voices,cancel(){},speak:item=>spoken.push(item)},SpeechSynthesisUtterance:function(text){this.text=text}};
  context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync('tts-quality.js','utf8'),context);return{context,spoken,storage};
}

test('Korean TTS prefers an enhanced natural voice and uses the slower learning pace',()=>{
  const basic={name:'Korean Compact',lang:'ko-KR',localService:true},enhanced={name:'Yuna Premium Enhanced',lang:'ko-KR',localService:true},foreign={name:'Samantha Enhanced',lang:'en-US',localService:true};
  const {context,spoken}=runtime([basic,foreign,enhanced]);const utterance=context.MALBIT_TTS.speak('꾸준히 공부해요.');
  assert.equal(utterance.voice,enhanced);assert.equal(utterance.rate,.82);assert.equal(utterance.lang,'ko-KR');assert.equal(spoken[0],utterance);
});

test('dialogue speaker preference falls back safely to the best Korean voice',()=>{
  const best={name:'Microsoft SunHi Online Natural',lang:'ko_KR',localService:false},basic={name:'Korean Basic',lang:'ko-KR',localService:true},roughMale={name:'Hyunsu Compact',lang:'ko-KR',localService:true};
  const {context}=runtime([basic,roughMale,best]);assert.equal(context.MALBIT_TTS.selectVoice('female'),best);assert.equal(context.MALBIT_TTS.selectVoice('male'),best);
});

test('one saved setting controls voice and fine-grained speed across the app',()=>{
  const chosen={name:'Yuna Premium Enhanced',voiceURI:'voice:yuna',lang:'ko-KR',localService:true};const {context,storage}=runtime([chosen]);
  context.malbitTtsChooseVoice(chosen.voiceURI);context.malbitTtsSetRate(.77,false);const utterance=context.MALBIT_TTS.utterance('설정 확인');
  assert.equal(utterance.voice,chosen);assert.equal(utterance.rate,.77);assert.deepEqual(JSON.parse(storage.get('malbitTtsPrefsV1')),{rate:.77,voiceId:'voice:yuna'});
});

test('settings provide samples and presets without showing paid-sounding tier labels',()=>{
  const voice={name:'Yuna Premium Enhanced',voiceURI:'voice:yuna',lang:'ko-KR',localService:true};const {context}=runtime([voice]),markup=context.MALBIT_TTS.settingsMarkup();
  assert.equal(context.MALBIT_TTS.displayName(voice,0),'Yuna');assert.match(markup,/malbitTtsRange/);assert.match(markup,/0\.72×/);assert.match(markup,/0\.82×/);assert.match(markup,/0\.92×/);
  const product=fs.readFileSync('product-polish.js','utf8');assert.match(product,/MALBIT_TTS\.settingsMarkup/);assert.match(product,/malbitTtsPrefsV1/);
});
