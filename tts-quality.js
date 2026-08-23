// MALBIT Korean TTS policy · optional local neural pack plus instant device fallback.
(function(){
'use strict';

const LANGUAGE='ko-KR';
const STORAGE_KEY='malbitTtsPrefsV1';
const DEFAULTS=Object.freeze({rate:.82,voiceId:'',engine:'neural',neuralVoice:'F2'});
const SAMPLE='오늘도 한국어를 천천히, 또렷하게 연습해 봐요.';
const FEMALE=/female|여성|yuna|sora|sunhi|jimin|seohyeon|yujin|jiyeon|seoyeon/i;
const MALE=/male|남성|hyunsu|injoon|bongjin|gookmin|minjun/i;
const LANG_INDEX={ko:0,ja:1,en:2,zh:3};
let playbackSerial=0,activeDeviceFinish=null,missingNoticeShown=false,fallbackNoticeShown=false;

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
  const prefs=read(),item=new SpeechSynthesisUtterance(String(text||'')),rate=options.rate==null?prefs.rate:options.rate,requestedId=options.voiceId==null?prefs.voiceId:options.voiceId;
  item.lang=LANGUAGE;item.rate=clampRate(rate);item.pitch=Number(options.pitch)||1;item.voice=selectVoice(options.gender,requestedId);return item;
}
function L(ko,ja,en,zh){const lang=typeof S!=='undefined'?S?.lang:'ko';return[ko,ja,en,zh][LANG_INDEX[lang]??0]||ko}
function H(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function announce(message){try{if(typeof window.toast==='function')return window.toast(message)}catch(error){};console.info('[MALBIT TTS]',message)}
function displayName(voice,index){
  const cleaned=String(voice?.name||'').replace(/\b(premium|enhanced|natural|neural|high[- ]?quality)\b/ig,'').replace(/\(\s*\)/g,'').replace(/\s{2,}/g,' ').replace(/\s+-\s*$/,'').trim();
  return cleaned||L(`한국어 음성 ${index+1}`,`韓国語音声 ${index+1}`,`Korean voice ${index+1}`,`韩语音色 ${index+1}`);
}
function neuralVoiceName(voice){
  const names={
    F1:L('여성 1 · 차분함','女性1 · 落ち着き','Female 1 · Calm','女声1 · 沉稳'),F2:L('여성 2 · 밝음','女性2 · 明るい','Female 2 · Bright','女声2 · 明亮'),F3:L('여성 3 · 또렷함','女性3 · 明瞭','Female 3 · Clear','女声3 · 清晰'),F4:L('여성 4 · 자신감','女性4 · 自信','Female 4 · Confident','女声4 · 自信'),F5:L('여성 5 · 부드러움','女性5 · やわらかい','Female 5 · Gentle','女声5 · 柔和'),
    M1:L('남성 1 · 활기참','男性1 · 活発','Male 1 · Lively','男声1 · 活力'),M2:L('남성 2 · 낮고 차분함','男性2 · 低く穏やか','Male 2 · Deep','男声2 · 低沉'),M3:L('남성 3 · 또렷함','男性3 · 明瞭','Male 3 · Clear','男声3 · 清晰'),M4:L('남성 4 · 부드러움','男性4 · やわらかい','Male 4 · Soft','男声4 · 柔和'),M5:L('남성 5 · 따뜻함','男性5 · 温かい','Male 5 · Warm','男声5 · 温暖')
  };return names[voice.id]||voice.id;
}
function resolveNeuralVoice(requested,gender){
  const selected=/^[FM][1-5]$/.test(requested||'')?requested:'F2',number=selected.slice(1);
  return gender==='female'?`F${number}`:gender==='male'?`M${number}`:selected;
}
function neuralSpeed(rate){return Math.max(.8,Math.min(1.4,1.05*clampRate(rate)/DEFAULTS.rate))}
function neuralReady(){return !!window.MALBIT_NEURAL_TTS?.status?.().ready}
function neuralInstalled(){return !!window.MALBIT_NEURAL_TTS?.installedSync?.()}
function neuralCompatibility(){try{return window.MALBIT_NEURAL_TTS?.compatibility?.()||{safe:true,reason:''}}catch(error){return{safe:false,reason:'RUNTIME_CHECK_FAILED'}}}
function neuralSafe(){return neuralCompatibility().safe!==false}
function safetyNotice(){return L('이 모바일 기기에서는 앱이 튕기지 않도록 기기 음성으로 재생합니다. 로컬 AI 음성은 메모리가 넉넉한 데스크톱에서만 실행됩니다.','このモバイル端末ではアプリ終了を防ぐため端末音声で再生します。ローカルAI音声はメモリに余裕のあるデスクトップでのみ実行します。','Device speech is used on this mobile device to prevent the app from closing. Local AI voice runs only on desktops with enough memory.','为防止应用闪退，此移动设备将使用系统语音。本地AI语音仅在内存充足的桌面设备上运行。')}
function cancel(){
  playbackSerial++;
  const finish=activeDeviceFinish;activeDeviceFinish=null;if(finish)finish({cancelled:true,engine:'device'});
  try{speechSynthesis.cancel()}catch(error){};try{window.MALBIT_NEURAL_TTS?.cancel?.()}catch(error){}
}
function playDevice(text,options={},serial=playbackSerial){
  return new Promise(resolve=>{
    if(typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined')return resolve({cancelled:false,unavailable:true,engine:'device'});
    const item=utterance(text,options);let settled=false;
    const finish=result=>{if(settled)return;settled=true;if(activeDeviceFinish===finish)activeDeviceFinish=null;resolve(result||{cancelled:serial!==playbackSerial,engine:'device',utterance:item})};
    activeDeviceFinish=finish;item.onend=()=>finish();item.onerror=()=>finish({cancelled:false,error:true,engine:'device',utterance:item});
    try{speechSynthesis.speak(item)}catch(error){finish({cancelled:false,error:true,engine:'device',utterance:item})}
  });
}
async function play(text,options={}){
  if(options.cancel!==false)cancel();const serial=playbackSerial,prefs=read(),neural=window.MALBIT_NEURAL_TTS;
  if(prefs.engine==='neural'&&!neuralSafe()){
    prefs.engine='device';write(prefs);if(!fallbackNoticeShown){fallbackNoticeShown=true;announce(safetyNotice())}
    if(serial!==playbackSerial)return{cancelled:true,engine:'device'};return playDevice(text,options,serial);
  }
  if(prefs.engine==='neural'&&neural?.installedSync?.()){
    neural.unlockAudio?.();
    if(!neuralReady())announce(L('무료 AI 음성을 준비하고 있어요. 처음 한 번만 조금 기다려 주세요.','無料AI音声を準備中です。初回だけ少しお待ちください。','Preparing the free AI voice. The first load takes a little longer.','正在准备免费AI语音，首次加载需要一点时间。'));
    try{
      const result=await neural.speak(String(text||''),{voiceId:resolveNeuralVoice(prefs.neuralVoice,options.gender),speed:neuralSpeed(options.rate==null?prefs.rate:options.rate),steps:6});
      if(serial!==playbackSerial)return{cancelled:true,engine:'neural'};return{...result,engine:'neural'};
    }catch(error){
      if(!fallbackNoticeShown){fallbackNoticeShown=true;announce(L('AI 음성을 불러오지 못해 기기 음성으로 재생합니다.','AI音声を読み込めないため端末音声で再生します。','AI voice could not load, so device speech will play.','AI语音加载失败，将使用设备语音。'))}
    }
  }else if(prefs.engine==='neural'&&!missingNoticeShown){
    missingNoticeShown=true;announce(L('더보기의 음성 설정에서 무료 AI 음성팩을 한 번 받아 주세요. 지금은 기기 음성으로 재생합니다.','「その他」の音声設定で無料AI音声パックを一度ダウンロードしてください。今は端末音声で再生します。','Download the free AI voice pack once in More settings. Device speech will play for now.','请先在“更多”的语音设置中下载免费AI语音包；目前使用设备语音。'));
  }
  if(serial!==playbackSerial)return{cancelled:true,engine:'device'};return playDevice(text,options,serial);
}
function sourceLabel(){return read().engine==='neural'&&neuralInstalled()&&neuralSafe()?'✨ LOCAL AI TTS':'⚠ DEVICE TTS FALLBACK'}
function deviceRows(prefs){
  const list=voices(),rows=[`<button type="button" class="malbitTtsVoice ${prefs.voiceId?'':'on'}" data-tts-device-voice="" onclick="malbitTtsChooseDeviceVoice(this.dataset.ttsDeviceVoice)"><span><b>${L('자동 추천','自動おすすめ','Auto recommended','自动推荐')}</b><small>${L('기기에서 가장 자연스러운 음성을 선택','端末で最も自然な音声を選択','Selects the best installed voice','选择设备上最自然的音色')}</small></span><i>▶</i></button>`];
  list.forEach((voice,index)=>rows.push(`<button type="button" class="malbitTtsVoice ${prefs.voiceId===voiceId(voice)?'on':''}" data-tts-device-voice="${H(voiceId(voice))}" onclick="malbitTtsChooseDeviceVoice(this.dataset.ttsDeviceVoice)"><span><b>${H(displayName(voice,index))}</b><small>${H(voice.lang||LANGUAGE)}</small></span><i>▶</i></button>`));
  if(!list.length)rows.push(`<p class="malbitTtsUnavailable">${L('이 브라우저에서 별도 한국어 음성을 찾지 못했습니다.','このブラウザでは追加の韓国語音声が見つかりません。','No additional Korean device voices were found.','此浏览器未找到其他韩语音色。')}</p>`);return rows.join('');
}
function settingsMarkup(){
  const prefs=read(),neural=window.MALBIT_NEURAL_TTS,installed=neuralInstalled(),safe=neuralSafe(),activeEngine=safe?prefs.engine:'device';
  const aiRows=safe?(neural?.voices||[]).map(voice=>`<button type="button" class="malbitTtsVoice ${prefs.neuralVoice===voice.id?'on':''}" data-tts-neural-voice="${voice.id}" onclick="malbitTtsChooseNeuralVoice(this.dataset.ttsNeuralVoice)"><span><b>${H(neuralVoiceName(voice))}</b><small>${L('신경망으로 기기에서 생성','端末内のニューラル生成','Neural, generated on device','神经网络在设备上生成')}</small></span><i>▶</i></button>`).join(''):'';
  const removeAction=`<button type="button" class="malbitTtsRemovePack" onclick="malbitTtsRemoveNeural()">${L('AI 음성팩 삭제','AI音声パックを削除','Remove AI voice pack','删除AI语音包')}</button>`;
  const packAction=installed?removeAction:safe?`<button type="button" class="malbitTtsInstallPack" onclick="malbitTtsInstallNeural()">↓ ${L('무료 AI 음성팩 받기 · 약 230MB','無料AI音声パックを取得 · 約230MB','Download free AI voice pack · about 230 MB','下载免费AI语音包 · 约230MB')}</button>`:'';
  const packTitle=!safe?L('모바일 안전 모드','モバイル安全モード','Mobile safety mode','移动安全模式'):installed?L('AI 음성팩 준비 완료','AI音声パック準備完了','AI voice pack ready','AI语音包已就绪'):L('처음 한 번만 다운로드','初回のみダウンロード','One-time download','仅首次下载');
  const packStatus=!safe?(installed?L('AI 모델은 실행하지 않습니다 · 삭제하면 약 230MB 확보','AIモデルは実行しません · 削除すると約230MB空きます','AI model will not run · remove it to free about 230 MB','不会运行AI模型 · 删除可释放约230MB'):L('앱 종료를 막기 위해 다운로드 없이 기기 음성을 사용합니다.','アプリ終了を防ぐため、ダウンロードせず端末音声を使います。','Device speech is used without a download to prevent app crashes.','为防止应用闪退，将直接使用系统语音。')):installed?L('10가지 음성 · 별도 결제 없음','10種類の音声 · 追加料金なし','10 voices · no extra charge','10种音色 · 无额外费用'):L('10가지 음성 · Wi-Fi 권장 · 받는 동안 기존 음성 사용 가능','10種類の音声 · Wi-Fi推奨 · 取得中も端末音声を使用可能','10 voices · Wi-Fi recommended · device speech remains available','10种音色 · 建议使用Wi-Fi · 下载时仍可用设备语音');
  const licenseCopy=safe?L('AI 음성은 Supertonic 3 기반이며, 문장은 서버로 보내지지 않습니다.','AI音声はSupertonic 3を使用し、文章はサーバーへ送信されません。','AI speech uses Supertonic 3; your text is not sent to a server.','AI语音基于Supertonic 3，文本不会发送到服务器。'):L('모바일에서는 안정성을 위해 운영체제의 한국어 음성을 사용합니다.','モバイルでは安定性のためOSの韓国語音声を使います。','Mobile uses the operating system Korean voice for stability.','移动设备为保证稳定性将使用系统韩语语音。');
  return`<section class="malbitSetting malbitTtsSetting"><h2>${L('한국어 음성·속도','韓国語の音声・速度','Korean voice & speed','韩语音色与速度')}</h2><p>${L('여기서 한 번 고르면 문제·단어장·스토리·말하기에 모두 적용됩니다.','ここで一度選ぶと、問題・単語帳・ストーリー・スピーキングのすべてに反映されます。','Choose once here to apply it to questions, vocabulary, stories, and speaking.','在此设置一次，即可应用到题目、单词本、故事和口语。')}</p><div class="malbitTtsEngines"><button type="button" class="${activeEngine==='neural'?'on':''} ${safe?'':'unavailable'}" aria-disabled="${safe?'false':'true'}" data-tts-engine="neural" onclick="malbitTtsChooseEngine('neural')"><b>✨ ${L('무료 AI 음성','無料AI音声','Free AI voice','免费AI语音')}</b><small>${safe?L('사용료 0원 · 문장을 기기 안에서 생성','利用料0円 · 端末内で生成','No usage fee · generated on device','零使用费 · 在设备上生成'):L('데스크톱 전용 · 모바일에서는 안전상 비활성화','デスクトップ専用 · モバイルでは安全のため無効','Desktop only · disabled on mobile for safety','仅限桌面端 · 移动设备为安全已禁用')}</small></button><button type="button" class="${activeEngine==='device'?'on':''}" data-tts-engine="device" onclick="malbitTtsChooseEngine('device')"><b>⚡ ${L('기기 음성','端末音声','Device voice','设备语音')}</b><small>${safe?L('다운로드 없이 바로 재생','ダウンロードなしですぐ再生','Instant, no download','无需下载，立即播放'):L('모바일 안전 재생 · 다운로드 없음','モバイル安全再生 · ダウンロード不要','Mobile-safe playback · no download','移动端安全播放 · 无需下载')}</small></button></div><div class="malbitTtsPack ${installed?'installed':''} ${safe?'':'safety'}"><div><b data-tts-pack-title>${packTitle}</b><small data-tts-pack-status>${packStatus}</small></div>${packAction}<progress class="malbitTtsPackProgress" max="100" value="0" hidden></progress></div><div class="malbitTtsVoices malbitTtsAiVoices" ${safe?'':'hidden'}>${aiRows}</div><details class="malbitTtsDeviceDetails" ${activeEngine==='device'?'open':''}><summary>${L('기기에 설치된 음성 보기','端末にインストール済みの音声','Installed device voices','查看设备已安装音色')}</summary><div class="malbitTtsVoices">${deviceRows(prefs)}</div></details><div class="malbitTtsSpeedHead"><b>${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}</b><output data-tts-rate>${clampRate(prefs.rate).toFixed(2)}×</output></div><input class="malbitTtsRange" type="range" min="0.65" max="1.05" step="0.01" value="${clampRate(prefs.rate)}" aria-label="${L('음성 속도','読み上げ速度','Voice speed','朗读速度')}" oninput="malbitTtsSetRate(this.value,false)" onchange="malbitTtsPreview()"><div class="malbitTtsPresets"><button type="button" data-tts-rate-value="0.72" class="${clampRate(prefs.rate)===.72?'on':''}" onclick="malbitTtsSetRate(.72,true)">${L('천천히','ゆっくり','Slow','慢速')}<small>0.72×</small></button><button type="button" data-tts-rate-value="0.82" class="${clampRate(prefs.rate)===.82?'on':''}" onclick="malbitTtsSetRate(.82,true)">${L('학습용','学習向け','Learning','学习')}<small>0.82×</small></button><button type="button" data-tts-rate-value="0.92" class="${clampRate(prefs.rate)===.92?'on':''}" onclick="malbitTtsSetRate(.92,true)">${L('보통','標準','Normal','正常')}<small>0.92×</small></button></div><button type="button" class="malbitTtsPreview" onclick="malbitTtsPreview()">🔊 ${L('현재 설정으로 듣기','現在の設定で聞く','Play current settings','按当前设置试听')}</button><blockquote>“${SAMPLE}”</blockquote><p class="malbitTtsLicense">${licenseCopy} <a href="https://huggingface.co/Supertone/supertonic-3" target="_blank" rel="noopener">${L('모델·라이선스','モデル・ライセンス','Model & license','模型与许可')}</a></p></section>`;
}
function refreshSettings(){
  if(typeof document==='undefined')return;const prefs=read();
  document.querySelectorAll('[data-tts-engine]').forEach(node=>node.classList.toggle('on',node.dataset.ttsEngine===prefs.engine));
  document.querySelectorAll('[data-tts-neural-voice]').forEach(node=>node.classList.toggle('on',node.dataset.ttsNeuralVoice===prefs.neuralVoice));
  document.querySelectorAll('[data-tts-device-voice]').forEach(node=>node.classList.toggle('on',(node.dataset.ttsDeviceVoice||'')===prefs.voiceId));
  const range=document.querySelector('.malbitTtsRange'),output=document.querySelector('[data-tts-rate]');if(range)range.value=clampRate(prefs.rate);if(output)output.textContent=`${clampRate(prefs.rate).toFixed(2)}×`;
  document.querySelectorAll('[data-tts-rate-value]').forEach(node=>node.classList.toggle('on',Number(node.dataset.ttsRateValue)===clampRate(prefs.rate)));
}
function updatePackProgress(progress,state='downloading'){
  const bar=document.querySelector('.malbitTtsPackProgress'),title=document.querySelector('[data-tts-pack-title]'),status=document.querySelector('[data-tts-pack-status]'),button=document.querySelector('.malbitTtsInstallPack');
  if(bar){bar.hidden=false;bar.value=Number(progress?.percent)||0}if(button)button.disabled=true;
  if(title)title.textContent=state==='preparing'?L('AI 음성을 준비하는 중','AI音声を準備中','Preparing AI voice','正在准备AI语音'):L(`AI 음성팩 받는 중 · ${Number(progress?.percent)||0}%`,`AI音声パック取得中 · ${Number(progress?.percent)||0}%`,`Downloading AI voice pack · ${Number(progress?.percent)||0}%`,`正在下载AI语音包 · ${Number(progress?.percent)||0}%`);
  if(status&&progress?.label)status.textContent=progress.label;
}
window.malbitTtsChooseEngine=value=>{const prefs=read();if(value==='neural'&&!neuralSafe()){prefs.engine='device';write(prefs);refreshSettings();announce(safetyNotice());return play(SAMPLE)}prefs.engine=value==='device'?'device':'neural';write(prefs);refreshSettings();if(prefs.engine==='device')play(SAMPLE);else if(neuralInstalled())play(SAMPLE);else announce(L('아래 버튼으로 무료 AI 음성팩을 먼저 받아 주세요.','下のボタンから無料AI音声パックを取得してください。','Download the free AI voice pack below first.','请先点击下方按钮下载免费AI语音包。'))};
window.malbitTtsChooseNeuralVoice=value=>{const prefs=read();prefs.neuralVoice=/^[FM][1-5]$/.test(value)?value:'F2';if(!neuralSafe()){prefs.engine='device';write(prefs);refreshSettings();return announce(safetyNotice())}prefs.engine='neural';write(prefs);refreshSettings();if(neuralInstalled())play(SAMPLE);else announce(L('AI 음색을 저장했습니다. 음성팩을 받으면 바로 들을 수 있어요.','AI音色を保存しました。音声パック取得後に再生できます。','AI voice saved. Download the pack to hear it.','AI音色已保存，下载语音包后即可试听。'))};
window.malbitTtsChooseDeviceVoice=value=>{const prefs=read();prefs.engine='device';prefs.voiceId=String(value||'');write(prefs);refreshSettings();play(SAMPLE)};
window.malbitTtsChooseVoice=window.malbitTtsChooseDeviceVoice;
window.malbitTtsSetRate=(value,preview=false)=>{const prefs=read();prefs.rate=clampRate(value);write(prefs);refreshSettings();if(preview)window.malbitTtsPreview()};
window.malbitTtsPreview=()=>{const prefs=read();if(prefs.engine==='neural'&&neuralSafe()&&!neuralInstalled()){announce(L('무료 AI 음성팩을 먼저 받아 주세요.','無料AI音声パックを先に取得してください。','Download the free AI voice pack first.','请先下载免费AI语音包。'));return Promise.resolve()}return play(SAMPLE)};
window.malbitTtsInstallNeural=async()=>{
  const neural=window.MALBIT_NEURAL_TTS;if(!neural)return;if(!neuralSafe()){announce(safetyNotice());return}neural.unlockAudio?.();const prefs=read();prefs.engine='neural';write(prefs);refreshSettings();let downloaded=false;
  try{await neural.install(progress=>updatePackProgress(progress));downloaded=true;updatePackProgress({percent:100},'preparing');await neural.prepare(progress=>updatePackProgress(progress,'preparing'));if(typeof render==='function'&&(typeof S==='undefined'||S?.view==='more'))render();await play(SAMPLE)}
  catch(error){let message;if(downloaded){const fallback=read();fallback.engine='device';write(fallback);message=L('이 기기에서는 AI 음성을 실행하지 못해 기기 음성으로 돌렸습니다. 음성팩은 보관되어 다시 시도할 수 있어요.','この端末ではAI音声を実行できないため端末音声に戻しました。音声パックは保持されています。','This device could not run the AI voice, so device speech is active. The pack is kept for retrying.','此设备无法运行AI语音，已切换到设备语音；语音包会保留以便重试。')}else message=error?.message==='NOT_ENOUGH_STORAGE'?L('저장 공간이 부족합니다. 약 260MB를 비운 뒤 다시 시도해 주세요.','空き容量が不足しています。約260MB確保して再試行してください。','Not enough storage. Free about 260 MB and try again.','存储空间不足，请释放约260MB后重试。'):L('AI 음성팩을 받지 못했습니다. Wi-Fi 연결을 확인하고 다시 시도해 주세요.','AI音声パックを取得できませんでした。Wi-Fiを確認して再試行してください。','Could not download the AI voice pack. Check Wi-Fi and try again.','AI语音包下载失败，请检查Wi-Fi后重试。');announce(message);if(typeof render==='function'&&(typeof S==='undefined'||S?.view==='more'))render()}
};
window.malbitTtsRemoveNeural=async()=>{if(!confirm(L('AI 음성팩을 삭제하고 약 230MB의 공간을 확보할까요?','AI音声パックを削除して約230MBの空き容量を確保しますか？','Remove the AI voice pack and free about 230 MB?','删除AI语音包并释放约230MB空间吗？')))return;await window.MALBIT_NEURAL_TTS?.remove?.();const prefs=read();prefs.engine='device';write(prefs);if(typeof render==='function')render()};

window.MALBIT_TTS=Object.freeze({language:LANGUAGE,rate:DEFAULTS.rate,lineDelay:380,storageKey:STORAGE_KEY,preferences:read,score,voices,selectVoice,utterance,play,speak:play,cancel,sourceLabel,settingsMarkup,refreshSettings,displayName,resolveNeuralVoice,neuralCompatibility});
try{speechSynthesis.addEventListener?.('voiceschanged',()=>{if(typeof S!=='undefined'&&S?.view==='more')window.render?.()})}catch(error){}
window.addEventListener?.('malbit-neural-tts-status',event=>{
  const detail=event.detail||{},state=detail.state;if(state==='downloading')return updatePackProgress(detail);if(state==='preparing')return updatePackProgress(detail,'preparing');
  const bar=document.querySelector('.malbitTtsPackProgress'),title=document.querySelector('[data-tts-pack-title]'),status=document.querySelector('[data-tts-pack-status]');if(bar)bar.hidden=true;
  if(state==='playing'){if(title)title.textContent=L('무료 AI 음성 재생 중','無料AI音声を再生中','Playing free AI voice','正在播放免费AI语音');if(status)status.textContent=L('문장을 기기 안에서 생성했습니다.','文章を端末内で生成しました。','Generated on this device.','已在设备上生成。');return}
  if(state==='ready'||state==='idle'||state==='cancelled'){if(title)title.textContent=L('AI 음성팩 준비 완료','AI音声パック準備完了','AI voice pack ready','AI语音包已就绪');if(status)status.textContent=L('10가지 음성 · 별도 결제 없음','10種類の音声 · 追加料金なし','10 voices · no extra charge','10种音色 · 无额外费用');return}
  if(state==='error'){if(title)title.textContent=L('AI 음성팩은 보관되어 있어요','AI音声パックは保存されています','AI voice pack is still saved','AI语音包仍已保存');if(status)status.textContent=L('이번에는 기기 음성으로 재생합니다.','今回は端末音声で再生します。','Device speech will play this time.','本次将使用设备语音。')}
});

if(typeof document!=='undefined'&&document.head){const style=document.createElement('style');style.textContent=`
.malbitTtsEngines{display:grid;grid-template-columns:1fr 1fr;gap:7px}.malbitTtsEngines button{border:1px solid #304c6e;border-radius:14px;padding:10px 8px;background:#132b48;color:#d8e6f7;text-align:left}.malbitTtsEngines button.on{border-color:#74a0ff;background:#214c91;box-shadow:0 0 0 2px rgba(105,145,255,.13)}.malbitTtsEngines button.unavailable{opacity:.55;border-style:dashed}.malbitTtsEngines b,.malbitTtsEngines small{display:block}.malbitTtsEngines b{font-size:9px}.malbitTtsEngines small{margin-top:4px;color:#9db3cf;font-size:7px;line-height:1.35}.malbitTtsPack{display:grid;gap:8px;margin:9px 0 10px;border:1px solid #355171;border-radius:14px;padding:10px;background:#102a47}.malbitTtsPack.installed{border-color:#3f806f;background:#12372f}.malbitTtsPack.safety{border-color:#80683f;background:#392f18}.malbitTtsPack b,.malbitTtsPack small{display:block}.malbitTtsPack b{font-size:9px}.malbitTtsPack small{margin-top:3px;color:#9db3cf;font-size:7.5px}.malbitTtsInstallPack,.malbitTtsRemovePack{border:0;border-radius:11px;padding:10px;background:#3978ed;color:#fff;font-size:8px;font-weight:950}.malbitTtsRemovePack{background:#234a48;color:#bce8dc}.malbitTtsPackProgress{width:100%;height:7px;accent-color:#73a1ff}.malbitTtsVoices{display:grid;gap:7px}.malbitTtsVoice{display:flex;align-items:center;justify-content:space-between;width:100%;border:1px solid #304c6e;border-radius:13px;padding:10px;background:#132b48;color:#fff;text-align:left}.malbitTtsVoice.on{border-color:#6d91ff;background:#214c91;box-shadow:0 0 0 2px rgba(105,145,255,.12)}.malbitTtsVoice b,.malbitTtsVoice small{display:block}.malbitTtsVoice b{font-size:9px}.malbitTtsVoice small{margin-top:3px;color:#9db3cf;font-size:7.5px}.malbitTtsVoice i{font-style:normal;color:#9fc0ff}.malbitTtsUnavailable{margin:0!important;border:1px dashed #3a5575;border-radius:12px;padding:10px}.malbitTtsDeviceDetails{margin-top:9px;border:1px solid #2f4866;border-radius:13px;overflow:hidden}.malbitTtsDeviceDetails summary{padding:10px;color:#a9bdd6;font-size:8px;font-weight:900;cursor:pointer}.malbitTtsDeviceDetails .malbitTtsVoices{padding:0 8px 8px}.malbitTtsSpeedHead{display:flex;justify-content:space-between;align-items:center;margin:14px 1px 5px}.malbitTtsSpeedHead b{font-size:10px}.malbitTtsSpeedHead output{color:#9fc0ff;font-size:11px;font-weight:950}.malbitTtsRange{width:100%;accent-color:#6d91ff}.malbitTtsPresets{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:7px}.malbitTtsPresets button,.malbitTtsPreview{border:1px solid #304c6e;border-radius:11px;padding:9px 5px;background:#132b48;color:#d8e6f7;font-size:8px;font-weight:900}.malbitTtsPresets button.on{border-color:#6d91ff;background:#214c91}.malbitTtsPresets small{display:block;margin-top:2px;color:#9db3cf;font-size:7px}.malbitTtsPreview{width:100%;margin-top:8px;background:#1d416d}.malbitTtsSetting blockquote{margin:8px 0 0;color:#8fa6c3;font-size:8px;line-height:1.5}.malbitTtsLicense{margin-top:10px!important;border-top:1px solid #29435f;padding-top:9px}.malbitTtsLicense a{color:#9fc0ff}
`;document.head.appendChild(style)}
})();
