// Harumal device speech for non-listening text and explicit fallback.
(function(){
'use strict';

const LANGUAGE='ko-KR';
const STORAGE_KEY='malbitTtsPrefsV1';
const DEFAULTS=Object.freeze({rate:.82,voiceId:'',engine:'device'});
const SAMPLE='오늘도 한국어를 천천히, 또렷하게 연습해 봐요.';
const FEMALE=/female|여성|yuna|sora|sunhi|jimin|seohyeon|yujin|jiyeon|seoyeon/i;
const MALE=/\bmale\b|남성|hyunsu|injoon|bongjin|gookmin|minjun/i;
const LANG_INDEX={ko:0,ja:1,en:2,zh:3};
let playbackSerial=0,activeDeviceFinish=null,lastEngine='';

function read(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')||{};return{...DEFAULTS,...saved,recordedVoice:saved.recordedVoice||(String(saved.neuralVoice||'').startsWith('M')?'M1':'F1')}}catch(error){return{...DEFAULTS}}}
function write(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}catch(error){}}
function clampRate(value){return Math.max(.65,Math.min(1.05,Math.round((Number(value)||DEFAULTS.rate)*100)/100))}
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
function cancel(){playbackSerial++;const finish=activeDeviceFinish;activeDeviceFinish=null;finish?.({cancelled:true,engine:'device'});try{speechSynthesis.cancel()}catch(error){};window.HARUMAL_LISTENING_AUDIO?.cancel?.()}
function play(text,options={}){if(options.cancel!==false)cancel();const serial=playbackSerial;lastEngine='device';try{const label=document.getElementById('audioSource');if(label)label.textContent=sourceLabel()}catch(error){};return new Promise(resolve=>{if(typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined')return resolve({unavailable:true,engine:'device'});const item=utterance(text,options);let done=false;const finish=result=>{if(done)return;done=true;if(activeDeviceFinish===finish)activeDeviceFinish=null;resolve(result||{cancelled:serial!==playbackSerial,engine:'device',utterance:item})};activeDeviceFinish=finish;item.onend=()=>finish();item.onerror=()=>finish({error:true,engine:'device'});try{speechSynthesis.speak(item)}catch(error){finish({error:true,engine:'device'})}})}
function sourceLabel(){return lastEngine==='device'?'⚠ DEVICE TTS FALLBACK':'🔊 AUDIO'}
function deviceRows(prefs){const rows=[`<button class="malbitTtsVoice ${prefs.voiceId?'':'on'}" type="button" data-tts-device-voice="" onclick="malbitTtsChooseDeviceVoice('')">${L('기기 음성 자동 선택','端末音声を自動選択','Automatic device voice','自动选择设备语音')}</button>`];voices().forEach((voice,index)=>rows.push(`<button class="malbitTtsVoice ${prefs.voiceId===voiceId(voice)?'on':''}" type="button" data-tts-device-voice="${H(voiceId(voice))}" onclick="malbitTtsChooseDeviceVoice(this.dataset.ttsDeviceVoice)">${H(displayName(voice,index))}</button>`));return rows.join('')}
function settingsMarkup(){const prefs=read();return`<section class="malbitSetting malbitTtsSetting"><h2>${L('한국어 음성·속도','韓国語の音声・速度','Korean voice & speed','韩语音色与速度')}</h2><p>${L('듣기 문제는 Supertonic 3으로 미리 만든 남녀 음원을 사용합니다. 단어장·문법 등 일반 읽기는 기기 음성을 사용합니다.','聴解問題にはSupertonic 3で事前生成した男女の音声を使います。単語帳・文法などは端末音声です。','Listening questions use pre-generated Supertonic 3 male/female audio. Vocabulary and other reading use device speech.','听力题使用Supertonic 3预生成男女音频，单词本等其他朗读使用设备语音。')}</p><p>${L('기기에 AI 모델을 설치하지 않습니다. 듣기 음원은 인터넷 연결이 필요합니다.','端末にAIモデルを入れません。聴解音源には通信が必要です。','No AI model is installed on your device. Listening audio needs a connection.','无需在设备安装AI模型，听力音频需联网。')}</p><div class="malbitTtsSpeedHead"><b>${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}</b><output data-tts-rate>${clampRate(prefs.rate).toFixed(2)}×</output></div><input class="malbitTtsRange" type="range" min="0.65" max="1.05" step="0.01" value="${clampRate(prefs.rate)}" aria-label="${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}" oninput="malbitTtsSetRate(this.value,false)" onchange="malbitTtsPreview()"><details class="malbitTtsDeviceDetails"><summary>${L('일반 읽기용 기기 음성','通常読み上げの端末音声','Device voice for other text','其他文本的设备语音')}</summary><div class="malbitTtsVoices">${deviceRows(prefs)}</div></details><button class="malbitTtsPreview" type="button" onclick="malbitTtsPreview()">🔊 ${L('기기 음성 미리듣기','端末音声を試聴','Preview device speech','试听设备语音')}</button></section>`}
function refreshSettings(){if(typeof document==='undefined')return;const prefs=read();document.querySelectorAll('[data-tts-device-voice]').forEach(node=>node.classList.toggle('on',(node.dataset.ttsDeviceVoice||'')===prefs.voiceId));const range=document.querySelector('.malbitTtsRange'),output=document.querySelector('[data-tts-rate]');if(range)range.value=clampRate(prefs.rate);if(output)output.textContent=clampRate(prefs.rate).toFixed(2)+'×'}
window.malbitTtsChooseDeviceVoice=value=>{const prefs=read();prefs.engine='device';prefs.voiceId=String(value||'');write(prefs);refreshSettings();return play(SAMPLE)};
window.malbitTtsChooseVoice=window.malbitTtsChooseDeviceVoice;
window.malbitTtsSetRate=(value,preview=false)=>{const prefs=read();prefs.rate=clampRate(value);write(prefs);refreshSettings();if(preview)return play(SAMPLE)};
window.malbitTtsPreview=()=>play(SAMPLE);
window.MALBIT_TTS=Object.freeze({language:LANGUAGE,rate:DEFAULTS.rate,lineDelay:380,storageKey:STORAGE_KEY,preferences:read,score,voices,selectVoice,utterance,play,speak:play,cancel,sourceLabel,settingsMarkup,refreshSettings,displayName});
try{speechSynthesis.addEventListener?.('voiceschanged',()=>{if(typeof S!=='undefined'&&S?.view==='more')window.render?.()})}catch(error){}
if(typeof document!=='undefined'&&document.head){const style=document.createElement('style');style.textContent=`
.malbitTtsEngines{display:grid;grid-template-columns:1fr 1fr;gap:7px}.malbitTtsEngines button{border:1px solid #304c6e;border-radius:14px;padding:10px 8px;background:#132b48;color:#d8e6f7;text-align:left}.malbitTtsEngines button.on{border-color:#74a0ff;background:#214c91;box-shadow:0 0 0 2px rgba(105,145,255,.13)}.malbitTtsEngines button.unavailable{opacity:.55;border-style:dashed}.malbitTtsEngines b,.malbitTtsEngines small{display:block}.malbitTtsEngines b{font-size:9px}.malbitTtsEngines small{margin-top:4px;color:#9db3cf;font-size:7px;line-height:1.35}.malbitTtsPack{display:grid;gap:8px;margin:9px 0 10px;border:1px solid #355171;border-radius:14px;padding:10px;background:#102a47}.malbitTtsPack.installed{border-color:#3f806f;background:#12372f}.malbitTtsPack.safety{border-color:#80683f;background:#392f18}.malbitTtsPack b,.malbitTtsPack small{display:block}.malbitTtsPack b{font-size:9px}.malbitTtsPack small{margin-top:3px;color:#9db3cf;font-size:7.5px}.malbitTtsInstallPack,.malbitTtsRemovePack{border:0;border-radius:11px;padding:10px;background:#3978ed;color:#fff;font-size:8px;font-weight:950}.malbitTtsRemovePack{background:#234a48;color:#bce8dc}.malbitTtsPackProgress{width:100%;height:7px;accent-color:#73a1ff}.malbitTtsVoices{display:grid;gap:7px}.malbitTtsVoice{display:flex;align-items:center;justify-content:space-between;width:100%;border:1px solid #304c6e;border-radius:13px;padding:10px;background:#132b48;color:#fff;text-align:left}.malbitTtsVoice.on{border-color:#6d91ff;background:#214c91;box-shadow:0 0 0 2px rgba(105,145,255,.12)}.malbitTtsVoice b,.malbitTtsVoice small{display:block}.malbitTtsVoice b{font-size:9px}.malbitTtsVoice small{margin-top:3px;color:#9db3cf;font-size:7.5px}.malbitTtsVoice i{font-style:normal;color:#9fc0ff}.malbitTtsUnavailable{margin:0!important;border:1px dashed #3a5575;border-radius:12px;padding:10px}.malbitTtsDeviceDetails{margin-top:9px;border:1px solid #2f4866;border-radius:13px;overflow:hidden}.malbitTtsDeviceDetails summary{padding:10px;color:#a9bdd6;font-size:8px;font-weight:900;cursor:pointer}.malbitTtsDeviceDetails .malbitTtsVoices{padding:0 8px 8px}.malbitTtsSpeedHead{display:flex;justify-content:space-between;align-items:center;margin:14px 1px 5px}.malbitTtsSpeedHead b{font-size:10px}.malbitTtsSpeedHead output{color:#9fc0ff;font-size:11px;font-weight:950}.malbitTtsRange{width:100%;accent-color:#6d91ff}.malbitTtsPresets{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:7px}.malbitTtsPresets button,.malbitTtsPreview{border:1px solid #304c6e;border-radius:11px;padding:9px 5px;background:#132b48;color:#d8e6f7;font-size:8px;font-weight:900}.malbitTtsPresets button.on{border-color:#6d91ff;background:#214c91}.malbitTtsPresets small{display:block;margin-top:2px;color:#9db3cf;font-size:7px}.malbitTtsPreview{width:100%;margin-top:8px;background:#1d416d}.malbitTtsSetting blockquote{margin:8px 0 0;color:#8fa6c3;font-size:8px;line-height:1.5}.malbitTtsLicense{margin-top:10px!important;border-top:1px solid #29435f;padding-top:9px}.malbitTtsLicense a{color:#9fc0ff}
`;document.head.appendChild(style)}
})();
