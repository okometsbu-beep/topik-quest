// MALBIT optional zero-fee neural Korean TTS pack.
// Inference follows Supertone's MIT-licensed browser example. Model weights remain
// under OpenRAIL-M and are fetched directly from a pinned Hugging Face revision.
(function(){
'use strict';

const CACHE_NAME='malbit-neural-tts-v1';
const MARKER_KEY='malbitNeuralTtsPackV1';
const MODEL_REVISION='1035a9450d054103f69c6815539ca069e81cce15';
const MODEL_ROOT=`https://huggingface.co/Kyumdroid/supertonic-3-quant/resolve/${MODEL_REVISION}`;
const ONNX_ROOT=`${MODEL_ROOT}/fp16/onnx`;
const ORT_VERSION='1.27.0';
const ORT_ROOT=`https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist`;
const ORT_MODULE=`${ORT_ROOT}/ort.webgpu.min.mjs`;
const PACK_BYTES=229000000;
const VOICES=Object.freeze([
  {id:'F1',gender:'female',tone:'calm'},
  {id:'F2',gender:'female',tone:'bright'},
  {id:'F3',gender:'female',tone:'clear'},
  {id:'F4',gender:'female',tone:'confident'},
  {id:'F5',gender:'female',tone:'gentle'},
  {id:'M1',gender:'male',tone:'lively'},
  {id:'M2',gender:'male',tone:'deep'},
  {id:'M3',gender:'male',tone:'clear'},
  {id:'M4',gender:'male',tone:'soft'},
  {id:'M5',gender:'male',tone:'warm'}
]);
const MODEL_FILES=Object.freeze([
  {path:'tts.json',bytes:8250,label:'설정'},
  {path:'unicode_indexer.json',bytes:278000,label:'한국어 문자표'},
  {path:'duration_predictor.onnx',bytes:2060000,label:'말하기 길이 모델'},
  {path:'text_encoder.onnx',bytes:18600000,label:'문장 이해 모델'},
  {path:'vector_estimator.onnx',bytes:129000000,label:'AI 음성 모델'},
  {path:'vocoder.onnx',bytes:50800000,label:'음성 출력 모델'}
]);
const RESOURCES=Object.freeze([
  ...MODEL_FILES.map(file=>({...file,url:`${ONNX_ROOT}/${file.path}`})),
  ...VOICES.map(voice=>({url:`${MODEL_ROOT}/voice_styles/${voice.id}.json`,bytes:292000,label:`${voice.id} 음색`})),
  {url:ORT_MODULE,bytes:66000,label:'AI 실행기'},
  {url:`${ORT_ROOT}/ort-wasm-simd-threaded.jsep.mjs`,bytes:46000,label:'AI 실행기 보조 파일'},
  {url:`${ORT_ROOT}/ort-wasm-simd-threaded.jsep.wasm`,bytes:25580000,label:'AI 실행기 본체'}
]);

let ortPromise=null,enginePromise=null,engine=null,activeSource=null,activeAudio=null,audioContext=null,playToken=0;
const styleCache=new Map();

function marker(){
  try{return JSON.parse(localStorage.getItem(MARKER_KEY)||'null')}
  catch(error){return null}
}
function installedSync(){return marker()?.revision===MODEL_REVISION}
function setMarker(value){
  try{value?localStorage.setItem(MARKER_KEY,JSON.stringify({revision:MODEL_REVISION,installedAt:Date.now(),bytes:PACK_BYTES})):localStorage.removeItem(MARKER_KEY)}catch(error){}
}
function emit(detail){
  try{window.dispatchEvent(new CustomEvent('malbit-neural-tts-status',{detail}))}catch(error){}
}
function assertPlatform(){
  if(typeof caches==='undefined'||typeof fetch!=='function')throw new Error('CACHE_UNAVAILABLE');
  if(typeof BigInt64Array==='undefined')throw new Error('BIGINT_UNAVAILABLE');
}
async function cache(){assertPlatform();return caches.open(CACHE_NAME)}
async function installed(){
  if(!installedSync())return false;
  try{
    const store=await cache();
    for(const resource of RESOURCES)if(!await store.match(resource.url)){setMarker(false);return false}
    return true;
  }catch(error){return false}
}
function progressPayload(done,current,resource,resourceDone=0){
  const value=Math.min(PACK_BYTES,done+Math.min(resource?.bytes||0,resourceDone));
  return{loaded:value,total:PACK_BYTES,percent:Math.max(0,Math.min(100,Math.round(value/PACK_BYTES*100))),label:resource?.label||''};
}
async function cacheResponse(store,resource,response,done,onProgress){
  if(!response.ok)throw new Error(`DOWNLOAD_${response.status}`);
  const expected=Number(response.headers.get('content-length'))||resource.bytes;
  if(!response.body||typeof ReadableStream==='undefined'){
    await store.put(resource.url,response);
    onProgress?.(progressPayload(done,resource,resource,resource.bytes));
    return;
  }
  let received=0;
  const reader=response.body.getReader(),headers=new Headers(response.headers);
  headers.delete('content-encoding');headers.delete('content-length');
  const stream=new ReadableStream({
    async pull(controller){
      try{
        const result=await reader.read();
        if(result.done){controller.close();return}
        received+=result.value.byteLength;
        onProgress?.(progressPayload(done,resource,resource,resource.bytes*Math.min(1,received/expected)));
        controller.enqueue(result.value);
      }catch(error){controller.error(error)}
    },
    cancel(){reader.cancel().catch(()=>{})}
  });
  await store.put(resource.url,new Response(stream,{status:200,statusText:'OK',headers}));
}
async function install(onProgress){
  assertPlatform();
  const estimate=await navigator.storage?.estimate?.().catch?.(()=>null);
  if(estimate?.quota&&estimate.quota-(estimate.usage||0)<PACK_BYTES+25000000)throw new Error('NOT_ENOUGH_STORAGE');
  const store=await cache();let done=0;
  emit({state:'downloading',...progressPayload(0,null)});
  for(const resource of RESOURCES){
    if(await store.match(resource.url)){
      done+=resource.bytes;const progress=progressPayload(done,null);onProgress?.(progress);emit({state:'downloading',...progress});continue;
    }
    const response=await fetch(resource.url,{mode:'cors',cache:'no-store'});
    await cacheResponse(store,resource,response,done,progress=>{onProgress?.(progress);emit({state:'downloading',...progress})});
    done+=resource.bytes;const progress=progressPayload(done,null);onProgress?.(progress);emit({state:'downloading',...progress});
  }
  setMarker(true);emit({state:'installed',percent:100,loaded:PACK_BYTES,total:PACK_BYTES});return true;
}
function unlockAudio(){
  try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return null;
    audioContext=audioContext||new AudioContextClass({sampleRate:44100});
    if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
    return audioContext;
  }catch(error){return null}
}
function cancel(){
  playToken++;
  if(activeSource){try{activeSource.stop()}catch(error){};try{activeSource.disconnect()}catch(error){};activeSource=null}
  if(activeAudio){try{activeAudio.pause();activeAudio.currentTime=0}catch(error){};activeAudio=null}
}
async function remove(){
  cancel();releaseEngine();setMarker(false);try{await caches.delete(CACHE_NAME)}catch(error){};emit({state:'removed'});
}
function releaseSessions(target){
  if(!target)return;
  for(const session of Object.values(target.sessions||{}))try{session.release?.()}catch(error){}
}
function releaseEngine(){releaseSessions(engine);engine=null;enginePromise=null;styleCache.clear()}
async function cachedResponse(url){
  const response=await (await cache()).match(url);
  if(!response){setMarker(false);throw new Error('PACK_MISSING')}
  return response;
}
async function loadOrt(){
  if(!ortPromise)ortPromise=import(ORT_MODULE).then(ort=>{
    ort.env.wasm.wasmPaths=`${ORT_ROOT}/`;
    ort.env.wasm.numThreads=1;
    ort.env.wasm.proxy=false;
    return ort;
  }).catch(error=>{ortPromise=null;throw error});
  return ortPromise;
}
async function createSession(ort,file,options){
  const data=await (await cachedResponse(`${ONNX_ROOT}/${file}`)).arrayBuffer();
  return ort.InferenceSession.create(data,options);
}
async function loadSessions(ort,provider,onProgress){
  const options={executionProviders:[provider],graphOptimizationLevel:'all'},sessions={};
  const names=['duration_predictor.onnx','text_encoder.onnx','vector_estimator.onnx','vocoder.onnx'];
  try{
    for(let index=0;index<names.length;index++){
      onProgress?.({state:'preparing',provider,current:index+1,total:names.length,label:MODEL_FILES.find(file=>file.path===names[index])?.label||names[index]});
      sessions[names[index]]=await createSession(ort,names[index],options);
    }
    return sessions;
  }catch(error){releaseSessions({sessions});throw error}
}
async function prepare(onProgress){
  if(engine)return engine;
  if(enginePromise)return enginePromise;
  enginePromise=(async()=>{
    if(!await installed())throw new Error('PACK_MISSING');
    emit({state:'preparing'});const ort=await loadOrt();
    const cfg=await (await cachedResponse(`${ONNX_ROOT}/tts.json`)).json();
    const indexer=await (await cachedResponse(`${ONNX_ROOT}/unicode_indexer.json`)).json();
    let provider='wasm',sessions;
    if(typeof navigator!=='undefined'&&navigator.gpu){
      try{provider='webgpu';sessions=await loadSessions(ort,provider,onProgress)}
      catch(error){provider='wasm';sessions=await loadSessions(ort,provider,onProgress)}
    }else sessions=await loadSessions(ort,provider,onProgress);
    engine={ort,cfg,indexer,sessions,provider,sampleRate:Number(cfg?.ae?.sample_rate)||44100};
    emit({state:'ready',provider});return engine;
  })().catch(error=>{enginePromise=null;emit({state:'error',message:error.message});throw error});
  return enginePromise;
}
function flatten(value){return Array.isArray(value)?value.flat(Infinity):value}
async function style(id,targetEngine){
  const voice=VOICES.some(item=>item.id===id)?id:'F2';
  if(styleCache.has(voice))return styleCache.get(voice);
  const raw=await (await cachedResponse(`${MODEL_ROOT}/voice_styles/${voice}.json`)).json(),ort=targetEngine.ort;
  const ttlData=new Float32Array(flatten(raw.style_ttl.data)),dpData=new Float32Array(flatten(raw.style_dp.data));
  const value={ttl:new ort.Tensor('float32',ttlData,raw.style_ttl.dims),dp:new ort.Tensor('float32',dpData,raw.style_dp.dims)};
  styleCache.set(voice,value);return value;
}
function preprocess(text,indexer){
  let value=String(text||'').normalize('NFKD')
    .replace(/[\u{1F1E6}-\u{1FAFF}\u{2600}-\u{27BF}]+/gu,'')
    .replace(/[–‑—_\[\]|/#→←]/g,' ')
    .replace(/[♥☆♡©\\]/g,'')
    .replace(/[“”]/g,'"').replace(/[‘’´`]/g,"'")
    .replace(/\s+/g,' ').trim();
  if(!/[.!?;:,'"')\]}…。」』】〉》›»]$/.test(value))value+='.';
  value=`<ko>${value}</ko>`;
  const ids=[];for(const character of value){const point=character.codePointAt(0);ids.push(point<indexer.length?indexer[point]:-1)}return ids;
}
function chunks(text,maxLength=120){
  const source=String(text||'').trim();if(!source)return[];
  const sentences=source.split(/(?<=[.!?。！？])\s+/u),result=[];let current='';
  for(const sentence of sentences){
    if(!current||current.length+sentence.length+1<=maxLength)current+=(current?' ':'')+sentence;
    else{result.push(current);current=sentence}
  }
  if(current)result.push(current);
  return result.flatMap(value=>value.length<=maxLength?[value]:Array.from({length:Math.ceil(value.length/maxLength)},(_,index)=>value.slice(index*maxLength,(index+1)*maxLength)));
}
function dispose(value){try{value?.dispose?.()}catch(error){}}
function randomNormal(target){
  for(let index=0;index<target.length;index+=2){
    const u1=Math.max(.0001,Math.random()),u2=Math.random(),radius=Math.sqrt(-2*Math.log(u1)),angle=2*Math.PI*u2;
    target[index]=radius*Math.cos(angle);if(index+1<target.length)target[index+1]=radius*Math.sin(angle);
  }
}
async function infer(targetEngine,text,voiceStyle,steps,speed,onProgress){
  const {ort,cfg,indexer,sessions,sampleRate}=targetEngine,ids=preprocess(text,indexer),textLength=ids.length;
  const idData=new BigInt64Array(textLength);for(let index=0;index<textLength;index++)idData[index]=BigInt(ids[index]);
  const maskData=new Float32Array(textLength);maskData.fill(1);
  const idTensor=new ort.Tensor('int64',idData,[1,textLength]),maskTensor=new ort.Tensor('float32',maskData,[1,1,textLength]);
  const durationResult=await sessions['duration_predictor.onnx'].run({text_ids:idTensor,style_dp:voiceStyle.dp,text_mask:maskTensor});
  const duration=Math.max(.08,Number(durationResult.duration.data[0])/speed);dispose(durationResult.duration);
  const textResult=await sessions['text_encoder.onnx'].run({text_ids:idTensor,style_ttl:voiceStyle.ttl,text_mask:maskTensor}),textEmbedding=textResult.text_emb;
  const chunkSize=Number(cfg.ae.base_chunk_size)*Number(cfg.ttl.chunk_compress_factor),latentLength=Math.ceil(Math.floor(duration*sampleRate)/chunkSize),latentDimensions=Number(cfg.ttl.latent_dim)*Number(cfg.ttl.chunk_compress_factor);
  let latent=new Float32Array(latentDimensions*latentLength);randomNormal(latent);
  const latentMaskData=new Float32Array(latentLength);latentMaskData.fill(1);
  const latentMask=new ort.Tensor('float32',latentMaskData,[1,1,latentLength]),totalStep=new ort.Tensor('float32',new Float32Array([steps]),[1]);
  for(let step=0;step<steps;step++){
    onProgress?.({state:'generating',current:step+1,total:steps});
    const latentTensor=new ort.Tensor('float32',latent,[1,latentDimensions,latentLength]),currentStep=new ort.Tensor('float32',new Float32Array([step]),[1]);
    const result=await sessions['vector_estimator.onnx'].run({noisy_latent:latentTensor,text_emb:textEmbedding,style_ttl:voiceStyle.ttl,latent_mask:latentMask,text_mask:maskTensor,current_step:currentStep,total_step:totalStep});
    latent=new Float32Array(result.denoised_latent.data);dispose(result.denoised_latent);dispose(latentTensor);dispose(currentStep);
  }
  const finalTensor=new ort.Tensor('float32',latent,[1,latentDimensions,latentLength]);
  const audioResult=await sessions['vocoder.onnx'].run({latent:finalTensor}),length=Math.min(audioResult.wav_tts.data.length,Math.floor(sampleRate*duration)),wav=new Float32Array(length);
  wav.set(audioResult.wav_tts.data.subarray?audioResult.wav_tts.data.subarray(0,length):audioResult.wav_tts.data.slice(0,length));
  dispose(audioResult.wav_tts);dispose(finalTensor);dispose(textEmbedding);dispose(idTensor);dispose(maskTensor);dispose(latentMask);dispose(totalStep);
  return wav;
}
async function synthesize(text,options={}){
  const targetEngine=await prepare(options.onProgress),voiceStyle=await style(options.voiceId||'F2',targetEngine),parts=chunks(text),outputs=[];
  if(!parts.length)throw new Error('EMPTY_TEXT');
  let total=0;
  for(let index=0;index<parts.length;index++){
    const wav=await infer(targetEngine,parts[index],voiceStyle,Math.max(4,Math.min(8,Number(options.steps)||6)),Math.max(.8,Math.min(1.4,Number(options.speed)||1.05)),options.onProgress);
    outputs.push(wav);total+=wav.length;if(index<parts.length-1){const silence=new Float32Array(Math.round(targetEngine.sampleRate*.28));outputs.push(silence);total+=silence.length}
  }
  const merged=new Float32Array(total);let offset=0;for(const output of outputs){merged.set(output,offset);offset+=output.length}
  return{wav:merged,sampleRate:targetEngine.sampleRate,provider:targetEngine.provider};
}
function wavBuffer(samples,sampleRate){
  const buffer=new ArrayBuffer(44+samples.length*2),view=new DataView(buffer),write=(offset,value)=>{for(let index=0;index<value.length;index++)view.setUint8(offset+index,value.charCodeAt(index))};
  write(0,'RIFF');view.setUint32(4,36+samples.length*2,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,samples.length*2,true);
  for(let index=0;index<samples.length;index++)view.setInt16(44+index*2,Math.max(-1,Math.min(1,samples[index]))*32767,true);return buffer;
}
async function playSamples(samples,sampleRate,token){
  if(token!==playToken)return{cancelled:true};
  const context=unlockAudio();
  if(context){
    await context.resume();if(token!==playToken)return{cancelled:true};
    const buffer=context.createBuffer(1,samples.length,sampleRate);buffer.copyToChannel(samples,0);
    return new Promise((resolve,reject)=>{const source=context.createBufferSource();activeSource=source;source.buffer=buffer;source.connect(context.destination);source.onended=()=>{if(activeSource===source)activeSource=null;resolve({cancelled:token!==playToken})};try{source.start()}catch(error){activeSource=null;reject(error)}});
  }
  const url=URL.createObjectURL(new Blob([wavBuffer(samples,sampleRate)],{type:'audio/wav'})),audio=new Audio(url);activeAudio=audio;
  return new Promise((resolve,reject)=>{const finish=(error)=>{if(activeAudio===audio)activeAudio=null;URL.revokeObjectURL(url);error?reject(error):resolve({cancelled:token!==playToken})};audio.onended=()=>finish();audio.onerror=()=>finish(new Error('AUDIO_PLAYBACK_FAILED'));audio.play().catch(finish)});
}
async function speak(text,options={}){
  cancel();const token=playToken;unlockAudio();emit({state:'preparing'});
  const result=await synthesize(text,options);if(token!==playToken)return{cancelled:true};
  emit({state:'playing',provider:result.provider});const playback=await playSamples(result.wav,result.sampleRate,token);emit({state:playback.cancelled?'cancelled':'idle'});return{...playback,provider:result.provider};
}
function status(){return{installed:installedSync(),ready:!!engine,provider:engine?.provider||'',bytes:PACK_BYTES,revision:MODEL_REVISION}}

window.MALBIT_NEURAL_TTS=Object.freeze({cacheName:CACHE_NAME,markerKey:MARKER_KEY,modelRevision:MODEL_REVISION,packBytes:PACK_BYTES,voices:VOICES,resources:RESOURCES,installedSync,installed,install,remove,prepare,synthesize,speak,cancel,unlockAudio,status});
})();
