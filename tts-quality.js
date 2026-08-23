// MALBIT Korean device-TTS quality policy · one detailed setting for every learning mode.
(function(){
'use strict';

const LANGUAGE='ko-KR';
const STORAGE_KEY='malbitTtsPrefsV1';
const DEFAULTS=Object.freeze({rate:.82,voiceId:''});
const SAMPLE='오늘도 한국어를 천천히, 또렷하게 연습해 봐요.';
const FEMALE=/female|여성|yuna|sora|sunhi|jimin|seohyeon|yujin|jiyeon|seoyeon/i;
const MALE=/male|남성|hyunsu|injoon|bongjin|gookmin|minjun/i;
const LANG_INDEX={ko:0,ja:1,en:2,zh:3};

function read(){try{return{...DEFAULTS,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}}catch(error){return{...DEFAULTS}}}
function write(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}catch(error){}}
function clampRate(value){return Math.max(.65,Math.min(1.05,Math.round((Number(value)||DEFAULTS.rate)*100)/100))}
function voiceId(voice){return String(voice?.voiceURI||voice?.name||'')}
function score(voice){
  const name=String(voice?.name||'').toLowerCase(),lang=String(voice?.lang||'').replace('_','-').toLowerCase();
  let value=lang==='ko-kr'?30:10;
  if(/premium|enhanced|natural|neural|high.?quality|siri/.test(name))value+=180;
  if(/yuna|sora|sunhi|hyunsu|heami|injoon|bongjin|jiyeon|seoyeon/.test(name))value+=80;
  if(/google|microsoft|apple|samsung/.test(name))value+=35;
  if(voice?.localService)value+=8;
  if(voice?.default)value+=3;
  if(/compact|espeak|novelty/.test(name))value-=150;
  return value;
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
  const prefs=read(),item=new SpeechSynthesisUtterance(String(text||'')),rate=options.rate==null?prefs.rate:options.rate,requestedId=options.voiceId==null?prefs.voiceId:options.voiceId;
  item.lang=LANGUAGE;item.rate=clampRate(rate);item.pitch=Number(options.pitch)||1;item.voice=selectVoice(options.gender,requestedId);return item;
}
function speak(text,options={}){
  if(options.cancel!==false)speechSynthesis.cancel();
  const item=utterance(text,options);speechSynthesis.speak(item);return item;
}
function L(ko,ja,en,zh){const lang=typeof S!=='undefined'?S?.lang:'ko';return[ko,ja,en,zh][LANG_INDEX[lang]??0]||ko}
function H(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function displayName(voice,index){
  const cleaned=String(voice?.name||'').replace(/\b(premium|enhanced|natural|neural|high[- ]?quality)\b/ig,'').replace(/\(\s*\)/g,'').replace(/\s{2,}/g,' ').replace(/\s+-\s*$/,'').trim();
  return cleaned||L(`한국어 음성 ${index+1}`,`韓国語音声 ${index+1}`,`Korean voice ${index+1}`,`韩语音色 ${index+1}`);
}
function settingsMarkup(){
  const prefs=read(),list=voices(),rows=[`<button type="button" class="malbitTtsVoice ${prefs.voiceId?'':'on'}" data-tts-voice="" onclick="malbitTtsChooseVoice(this.dataset.ttsVoice)"><span><b>${L('자동 추천','自動おすすめ','Auto recommended','自动推荐')}</b><small>${L('기기에서 가장 자연스러운 음성을 자동 선택','端末で最も自然な音声を自動選択','Automatically selects the best available voice','自动选择设备上最自然的音色')}</small></span><i>▶</i></button>`];
  list.forEach((voice,index)=>rows.push(`<button type="button" class="malbitTtsVoice ${prefs.voiceId===voiceId(voice)?'on':''}" data-tts-voice="${H(voiceId(voice))}" onclick="malbitTtsChooseVoice(this.dataset.ttsVoice)"><span><b>${H(displayName(voice,index))}</b><small>${H(voice.lang||LANGUAGE)}</small></span><i>▶</i></button>`));
  if(!list.length)rows.push(`<p class="malbitTtsUnavailable">${L('기기의 한국어 음성을 불러오면 선택 목록이 나타납니다. 지금은 기본 음성을 사용합니다.','端末の韓国語音声を読み込むと選択肢が表示されます。現在は標準音声を使います。','Installed Korean voices will appear here when available. The default voice is used for now.','检测到设备韩语音色后会显示在这里，目前使用默认音色。')}</p>`);
  return`<section class="malbitSetting malbitTtsSetting"><h2>${L('한국어 음성·속도','韓国語の音声・速度','Korean voice & speed','韩语音色与速度')}</h2><p>${L('여기서 고른 설정이 문제·단어장·스토리·말하기의 기기 읽기 음성에 적용됩니다. 녹음 음원은 원본 그대로 재생돼요.','ここで選んだ設定は問題・単語帳・ストーリー・スピーキングの端末読み上げ音声に反映されます。録音音源は元の速度で再生されます。','This setting applies to device-read speech in questions, vocabulary, stories, and speaking. Recorded audio keeps its original speed.','此设置应用于题目、单词本、故事和口语中的设备朗读；录制音频保持原速。')}</p><div class="malbitTtsVoices">${rows.join('')}</div><div class="malbitTtsSpeedHead"><b>${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}</b><output data-tts-rate>${clampRate(prefs.rate).toFixed(2)}×</output></div><input class="malbitTtsRange" type="range" min="0.65" max="1.05" step="0.01" value="${clampRate(prefs.rate)}" aria-label="${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}" oninput="malbitTtsSetRate(this.value,false)" onchange="malbitTtsPreview()"><div class="malbitTtsPresets"><button type="button" data-tts-rate-value="0.72" class="${clampRate(prefs.rate)===.72?'on':''}" onclick="malbitTtsSetRate(.72,true)">${L('천천히','ゆっくり','Slow','慢速')}<small>0.72×</small></button><button type="button" data-tts-rate-value="0.82" class="${clampRate(prefs.rate)===.82?'on':''}" onclick="malbitTtsSetRate(.82,true)">${L('학습용','学習向け','Learning','学习')}<small>0.82×</small></button><button type="button" data-tts-rate-value="0.92" class="${clampRate(prefs.rate)===.92?'on':''}" onclick="malbitTtsSetRate(.92,true)">${L('보통','標準','Normal','正常')}<small>0.92×</small></button></div><button type="button" class="malbitTtsPreview" onclick="malbitTtsPreview()">🔊 ${L('현재 설정으로 다시 듣기','現在の設定でもう一度聞く','Replay with current settings','按当前设置重播')}</button><blockquote>“${SAMPLE}”</blockquote></section>`;
}
function refreshSettings(){
  if(typeof document==='undefined')return;const prefs=read();document.querySelectorAll('[data-tts-voice]').forEach(node=>node.classList.toggle('on',(node.dataset.ttsVoice||'')===prefs.voiceId));
  const range=document.querySelector('.malbitTtsRange'),output=document.querySelector('[data-tts-rate]');if(range)range.value=clampRate(prefs.rate);if(output)output.textContent=`${clampRate(prefs.rate).toFixed(2)}×`;
  document.querySelectorAll('[data-tts-rate-value]').forEach(node=>node.classList.toggle('on',Number(node.dataset.ttsRateValue)===clampRate(prefs.rate)));
}
window.malbitTtsChooseVoice=value=>{const prefs=read();prefs.voiceId=String(value||'');write(prefs);refreshSettings();speak(SAMPLE)};
window.malbitTtsSetRate=(value,preview=false)=>{const prefs=read();prefs.rate=clampRate(value);write(prefs);refreshSettings();if(preview)speak(SAMPLE)};
window.malbitTtsPreview=()=>speak(SAMPLE);

window.MALBIT_TTS=Object.freeze({language:LANGUAGE,rate:DEFAULTS.rate,lineDelay:380,storageKey:STORAGE_KEY,preferences:read,score,voices,selectVoice,utterance,speak,settingsMarkup,refreshSettings,displayName});
try{speechSynthesis.addEventListener?.('voiceschanged',()=>{if(typeof S!=='undefined'&&S?.view==='more')window.render?.()})}catch(error){}

if(typeof document!=='undefined'&&document.head){const style=document.createElement('style');style.textContent=`
.malbitTtsVoices{display:grid;gap:7px}.malbitTtsVoice{display:flex;align-items:center;justify-content:space-between;width:100%;border:1px solid #304c6e;border-radius:13px;padding:10px;background:#132b48;color:#fff;text-align:left}.malbitTtsVoice.on{border-color:#6d91ff;background:#214c91;box-shadow:0 0 0 2px rgba(105,145,255,.12)}.malbitTtsVoice b,.malbitTtsVoice small{display:block}.malbitTtsVoice b{font-size:10px}.malbitTtsVoice small{margin-top:3px;color:#9db3cf;font-size:7.5px}.malbitTtsVoice i{font-style:normal;color:#9fc0ff}.malbitTtsUnavailable{margin:0!important;border:1px dashed #3a5575;border-radius:12px;padding:10px}.malbitTtsSpeedHead{display:flex;justify-content:space-between;align-items:center;margin:14px 1px 5px}.malbitTtsSpeedHead b{font-size:10px}.malbitTtsSpeedHead output{color:#9fc0ff;font-size:11px;font-weight:950}.malbitTtsRange{width:100%;accent-color:#6d91ff}.malbitTtsPresets{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:7px}.malbitTtsPresets button,.malbitTtsPreview{border:1px solid #304c6e;border-radius:11px;padding:9px 5px;background:#132b48;color:#d8e6f7;font-size:8px;font-weight:900}.malbitTtsPresets button.on{border-color:#6d91ff;background:#214c91}.malbitTtsPresets small{display:block;margin-top:2px;color:#9db3cf;font-size:7px}.malbitTtsPreview{width:100%;margin-top:8px;background:#1d416d}.malbitTtsSetting blockquote{margin:8px 0 0;color:#8fa6c3;font-size:8px;line-height:1.5}
`;document.head.appendChild(style)}
})();
