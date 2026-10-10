// Harumal device speech for non-listening text and explicit fallback.
(function(){
'use strict';

const LANGUAGE='ko-KR';
const STORAGE_KEY='malbitTtsPrefsV1';
const DEFAULTS=Object.freeze({rate:1,voiceId:'',engine:'device'});
const SAMPLE='오늘도 한국어를 천천히, 또렷하게 연습해 봐요.';
// Existing F1/M1 clips; exact text, voice, hashes and model revision are in corpus.json/manifest.json.
const RECORDED_SAMPLE=Object.freeze({id:'0b2c5059104c9824',text:'주말에 뭐 했어요?'});
let previewSerial=0,previewStatus='';
const FEMALE=/female|여성|yuna|sora|sunhi|jimin|seohyeon|yujin|jiyeon|seoyeon/i;
const MALE=/\bmale\b|남성|hyunsu|injoon|bongjin|gookmin|minjun/i;
const LANG_INDEX={ko:0,ja:1,en:2,zh:3};
let playbackSerial=0,activeDeviceFinish=null,lastEngine='';

function read(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')||{};return{...DEFAULTS,...saved,recordedVoice:saved.recordedVoice||(String(saved.neuralVoice||'').startsWith('M')?'M1':'F1')}}catch(error){return{...DEFAULTS}}}
function write(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}catch(error){}}
function clampRate(value){return Math.max(.65,Math.min(1.5,Math.round((Number(value)||DEFAULTS.rate)*100)/100))}
function voiceId(voice){return String(voice?.voiceURI||voice?.name||'')}
function score(voice){
  const name=String(voice?.name||'').toLowerCase(),lang=String(voice?.lang||'').replace('_','-').toLowerCase();
  let value=lang==='ko-kr'?30:10;
  if(/premium|enhanced|natural|neural|high.?quality|siri/.test(name))value+=180;
  if(/yuna|sora|sunhi|hyunsu|heami|injoon|bongjin|jiyeon|seoyeon/.test(name))value+=80;
  if(/google|microsoft|apple|samsung/.test(name))value+=35;
  if(voice?.localService)value+=8;if(voice?.default)value+=3;if(/compact|espeak|novelty/.test(name))value-=150;return value;
}
function voices(){
  try{return speechSynthesis.getVoices().filter(voice=>/^ko(?:[-_]|$)/i.test(voice.lang||'')).sort((a,b)=>score(b)-score(a)||String(a.name||'').localeCompare(String(b.name||'')))}catch(error){return[]}
}
function selectVoice(gender='',requestedId=read().voiceId){
  const ranked=voices(),chosen=requestedId?ranked.find(voice=>voiceId(voice)===requestedId):null;if(chosen)return chosen;
  const pattern=gender==='female'?FEMALE:gender==='male'?MALE:null,best=ranked[0]||null,matched=pattern?ranked.find(voice=>pattern.test(voice.name||'')):null;
  return matched&&score(matched)>=score(best)-70?matched:best;
}
function utterance(text,options={}){
  const prefs=read(),item=new SpeechSynthesisUtterance(String(text||'')),rate=options.rate==null?prefs.rate:options.rate,requestedId=options.voiceId==null?(options.gender?'':prefs.voiceId):options.voiceId;
  item.lang=LANGUAGE;item.rate=clampRate(rate);item.pitch=Number(options.pitch)||1;item.voice=selectVoice(options.gender,requestedId);return item;
}
function L(ko,ja,en,zh){const lang=typeof S!=='undefined'?S?.lang:'ko';return[ko,ja,en,zh][LANG_INDEX[lang]??0]||ko}
function H(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function announce(message){try{if(typeof window.toast==='function')return window.toast(message)}catch(error){};console.info('[MALBIT TTS]',message)}
function displayName(voice,index){
  const cleaned=String(voice?.name||'').replace(/\b(premium|enhanced|natural|neural|high[- ]?quality)\b/ig,'').replace(/\(\s*\)/g,'').replace(/\s{2,}/g,' ').replace(/\s+-\s*$/,'').trim();
  return cleaned||L(`한국어 음성 ${index+1}`,`韓国語音声 ${index+1}`,`Korean voice ${index+1}`,`韩语音色 ${index+1}`);
}
function cancel(keepPlayer=false){if(!keepPlayer)window.HARUMAL_LISTENING_PLAYER?.cancel();playbackSerial++;const finish=activeDeviceFinish;activeDeviceFinish=null;finish?.({cancelled:true,engine:'device'});try{speechSynthesis.cancel()}catch(error){};window.HARUMAL_LISTENING_AUDIO?.cancel?.()}
function play(text,options={}){if(!options.managed&&window.HARUMAL_LISTENING_PLAYER)return window.HARUMAL_LISTENING_PLAYER.read(text,options);if(options.cancel!==false)cancel();const serial=playbackSerial;lastEngine='device';try{const label=document.getElementById('audioSource');if(label)label.textContent=sourceLabel()}catch(error){};return new Promise(resolve=>{if(typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined')return resolve({unavailable:true,engine:'device'});const item=utterance(text,options);let done=false;const finish=result=>{if(done)return;done=true;if(activeDeviceFinish===finish)activeDeviceFinish=null;resolve(result||{cancelled:serial!==playbackSerial,engine:'device',utterance:item})};activeDeviceFinish=finish;item.onstart=()=>{if(!done&&serial===playbackSerial)options.onStart?.()};item.onend=()=>finish();item.onerror=()=>finish({error:true,engine:'device'});try{speechSynthesis.speak(item)}catch(error){finish({error:true,engine:'device'})}})}
function sourceLabel(){return lastEngine==='device'?'🔊 DEVICE SPEECH':lastEngine==='listening-file'?'♫ SUPERTONIC 3 · MP3':'🔊 AUDIO'}
function deviceRows(prefs){const rows=[`<button class="malbitTtsVoice ${prefs.voiceId?'':'on'}" type="button" data-tts-device-voice="" onclick="malbitTtsChooseDeviceVoice('')">${L('기기 음성 자동 선택','端末音声を自動選択','Automatic device voice','自动选择设备语音')}</button>`];voices().forEach((voice,index)=>rows.push(`<button class="malbitTtsVoice ${prefs.voiceId===voiceId(voice)?'on':''}" type="button" data-tts-device-voice="${H(voiceId(voice))}" onclick="malbitTtsChooseDeviceVoice(this.dataset.ttsDeviceVoice)">${H(displayName(voice,index))}</button>`));return rows.join('')}
function recordedVoice(){return read().recordedVoice==='M1'?'M1':'F1'}
function setPreviewStatus(value){previewStatus=value;document.querySelectorAll('[data-tts-preview-status]').forEach(node=>node.textContent=value)}
function preview(){
 const player=window.HARUMAL_LISTENING_PLAYER,voice=recordedVoice(),request=++previewSerial;
 if(!player?.preview){cancel();const message=L('미리듣기를 준비하지 못했어요. 다시 시도해 주세요.','試聴を準備できませんでした。再試行してください。','Preview is unavailable. Please try again.','试听暂不可用，请重试。');setPreviewStatus(message);return Promise.resolve({unavailable:true,engine:'listening-file'})}
 lastEngine='listening-file';setPreviewStatus(L('음원을 불러오는 중…','音声を読込中…','Loading audio…','正在加载音频…'));
 return player.preview([{url:`audio/listening/v1/${voice}/${RECORDED_SAMPLE.id}.mp3`,text:RECORDED_SAMPLE.text,gender:voice==='F1'?'female':'male'}],{
  onStart(){if(request===previewSerial)setPreviewStatus(L('Supertonic 3 음원 재생 중','Supertonic 3音声を再生中','Playing Supertonic 3 audio','正在播放Supertonic 3音频'))},
  onResult(result){if(request!==previewSerial)return;setPreviewStatus(result.error?L('음원을 재생하지 못했어요. 연결을 확인하고 다시 눌러 주세요.','再生できませんでした。接続を確認して再試行してください。','Audio could not play. Check your connection and try again.','音频播放失败，请检查网络并重试。'):result.cancelled?'':L('미리듣기 완료','試聴完了','Preview complete','试听完成'))}
 });
}
function settingsMarkup(){const prefs=read(),voice=recordedVoice();return`<section class="malbitSetting malbitTtsSetting"><h2>${L('한국어 음성·속도','韓国語の音声・速度','Korean voice & speed','韩语音色与速度')}</h2><p>${L('듣기 문제는 Supertonic 3으로 미리 만든 남녀 음원을 사용합니다. 단어장·문법 등 일반 읽기는 기기 음성을 사용합니다.','聴解問題にはSupertonic 3で事前生成した男女の音声を使います。単語帳・文法などは端末音声です。','Listening questions use pre-generated Supertonic 3 male/female audio. Vocabulary and other reading use device speech.','听力题使用Supertonic 3预生成男女音频，单词本等其他朗读使用设备语音。')}</p><p>${L('기기에 AI 모델을 설치하지 않습니다. 듣기 음원은 인터넷 연결이 필요합니다.','端末にAIモデルを入れません。聴解音源には通信が必要です。','No AI model is installed on your device. Listening audio needs a connection.','无需在设备安装AI模型，听力音频需联网。')}</p><div class="malbitTtsSpeedHead"><b>${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}</b><output data-tts-rate>${clampRate(prefs.rate).toFixed(2)}×</output></div><input class="malbitTtsRange" type="range" min="0.65" max="1.5" step="0.01" value="${clampRate(prefs.rate)}" aria-label="${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}" oninput="malbitTtsSetRate(this.value,false)" onchange="malbitTtsPreview()"><div class="malbitTtsRecordedSample"><b>${L('듣기 음원 미리듣기','聴解音声の試聴','Preview listening audio','试听听力音频')}</b><small>Supertonic 3 · MP3</small><p class="malbitTtsTranscript" lang="ko">${H(RECORDED_SAMPLE.text)}</p><div class="malbitTtsRecordedVoices" role="group" aria-label="${L('미리듣기 음색','試聴する声','Preview voice','试听音色')}">${['F1','M1'].map(id=>`<button type="button" data-tts-recorded-voice="${id}" aria-pressed="${voice===id}" class="${voice===id?'on':''}" onclick="malbitTtsChooseRecordedVoice('${id}')">${id==='F1'?L('여성','女性','Female','女声'):L('남성','男性','Male','男声')} · ${id}</button>`).join('')}</div><button class="malbitTtsPreview" type="button" onclick="malbitTtsPreview()">🔊 ${L('음원 미리듣기','音声を試聴','Preview audio','试听音频')}</button><p class="malbitTtsPreviewStatus" data-tts-preview-status role="status">${H(previewStatus)}</p></div><details class="malbitTtsDeviceDetails"><summary>${L('일반 읽기용 기기 음성','通常読み上げの端末音声','Device voice for other text','其他文本的设备语音')}</summary><div class="malbitTtsVoices">${deviceRows(prefs)}</div><button class="malbitTtsPreview malbitTtsDevicePreview" type="button" onclick="malbitTtsPreviewDevice()">🔊 ${L('기기 음성 미리듣기','端末音声を試聴','Preview device speech','试听设备语音')}</button></details></section>`}
function refreshSettings(){if(typeof document==='undefined')return;const prefs=read();document.querySelectorAll('[data-tts-device-voice]').forEach(node=>node.classList.toggle('on',(node.dataset.ttsDeviceVoice||'')===prefs.voiceId));document.querySelectorAll('[data-tts-recorded-voice]').forEach(node=>{const selected=node.dataset.ttsRecordedVoice===recordedVoice();node.classList.toggle('on',selected);node.setAttribute('aria-pressed',String(selected))});const range=document.querySelector('.malbitTtsRange'),output=document.querySelector('[data-tts-rate]');if(range)range.value=clampRate(prefs.rate);if(output)output.textContent=clampRate(prefs.rate).toFixed(2)+'×'}
window.malbitTtsChooseDeviceVoice=value=>{const prefs=read();prefs.engine='device';prefs.voiceId=String(value||'');write(prefs);refreshSettings();return play(SAMPLE)};
window.malbitTtsChooseVoice=window.malbitTtsChooseDeviceVoice;
window.malbitTtsChooseRecordedVoice=value=>{if(value!=='F1'&&value!=='M1')return;const prefs=read();prefs.recordedVoice=value;write(prefs);refreshSettings();return preview()};
window.malbitTtsSetRate=(value,withPreview=false)=>{const prefs=read();prefs.rate=clampRate(value);write(prefs);refreshSettings();if(withPreview)return preview()};
window.malbitTtsPreview=preview;
window.malbitTtsPreviewDevice=()=>play(SAMPLE);
window.MALBIT_TTS=Object.freeze({language:LANGUAGE,rate:DEFAULTS.rate,lineDelay:380,storageKey:STORAGE_KEY,preferences:read,score,voices,selectVoice,utterance,play,speak:play,cancel,sourceLabel,settingsMarkup,refreshSettings,displayName});
try{speechSynthesis.addEventListener?.('voiceschanged',()=>{if(typeof S!=='undefined'&&S?.view==='more')window.render?.()})}catch(error){}
if(typeof document!=='undefined'&&document.head){const style=document.createElement('style');style.textContent=`
.malbitTtsVoices{display:grid;gap:7px}.malbitTtsVoice,.malbitTtsRecordedVoices button{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:44px;border:1px solid var(--ui-border,#bbd4c9);border-radius:13px;padding:10px;background:var(--ui-surface,#fff);color:var(--ui-ink,#203b35);text-align:left;font:inherit}.malbitTtsVoice.on,.malbitTtsRecordedVoices button.on{border-color:var(--ui-accent,#23806d);background:var(--ui-accent-soft,#e2f2e9);color:var(--ui-ink,#203b35);box-shadow:inset 0 0 0 1px var(--ui-accent,#23806d)}.malbitTtsDeviceDetails{margin-top:12px;border:1px solid var(--ui-border,#bbd4c9);border-radius:13px;overflow:hidden}.malbitTtsDeviceDetails summary{min-height:44px;box-sizing:border-box;padding:12px 10px;color:var(--ui-muted,#546f64);font-size:13px;font-weight:700;cursor:pointer}.malbitTtsDeviceDetails .malbitTtsVoices{padding:0 8px 8px}.malbitTtsSpeedHead{display:flex;justify-content:space-between;align-items:center;margin:14px 1px 5px}.malbitTtsSpeedHead b{font-size:14px}.malbitTtsSpeedHead output{color:var(--ui-accent,#23806d);font-size:14px;font-weight:800}.malbitTtsRange{width:100%;min-height:44px;margin:0;accent-color:var(--ui-accent,#23806d)}.malbitTtsRecordedSample{margin-top:10px;padding:12px;border:1px solid var(--ui-border,#bbd4c9);border-radius:14px;background:var(--ui-surface-raised,#f3f8f4);color:var(--ui-ink,#203b35)}.malbitTtsRecordedSample>b,.malbitTtsRecordedSample>small{display:block}.malbitTtsRecordedSample>b{font-size:14px}.malbitTtsRecordedSample>small{color:var(--ui-muted,#546f64);font-size:12px;margin-top:3px}.malbitTtsRecordedSample .malbitTtsTranscript{font-size:18px!important;font-weight:700;color:var(--ui-ink,#203b35)!important;margin:12px 0!important}.malbitTtsRecordedVoices{display:grid;grid-template-columns:1fr 1fr;gap:8px}.malbitTtsRecordedVoices button{justify-content:center;font-size:13px}.malbitTtsPreview{width:100%;min-height:44px;margin-top:10px;border:1px solid var(--ui-accent,#23806d);border-radius:11px;padding:10px;background:var(--ui-accent,#23806d);color:var(--harumal-on-accent,#fff);font:inherit;font-size:13px;font-weight:700;cursor:pointer}.malbitTtsDevicePreview{width:calc(100% - 16px);margin:0 8px 8px;background:var(--ui-surface-raised,#f3f8f4);border-color:var(--ui-border,#bbd4c9);color:var(--ui-ink,#203b35)}.malbitTtsRecordedSample .malbitTtsPreviewStatus{font-size:12px!important;line-height:1.5;min-height:1.5em;margin:8px 0 0!important;color:var(--ui-muted,#546f64)!important}.malbitTtsSetting :focus-visible{outline:3px solid var(--ui-accent,#23806d);outline-offset:3px}
`;document.head.appendChild(style)}
})();
