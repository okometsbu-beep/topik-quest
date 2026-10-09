// One cancellable transport for recorded dialogues and explicit device speech.
(function(){
'use strict';
const RATES=[.75,1,1.25,1.5];
let serial=0,current=null,last=null,view=null;
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[typeof S==='object'?S.lang:'ko']||en);
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rate=()=>{const v=Number(window.MALBIT_TTS?.preferences?.().rate)||1;return RATES.reduce((a,b)=>Math.abs(b-v)<Math.abs(a-v)?b:a)};
const time=v=>Number.isFinite(v)?`${Math.floor(v/60)}:${String(Math.floor(v%60)).padStart(2,'0')}`:'—:—';
const busy=key=>!!current&&(!key||current.options.key===key);
const rootFor=key=>[...document.querySelectorAll('[data-listening-player]')].find(el=>el.dataset.listeningPlayer===key);
function markup(action,key,options={}){
 return `<section class="listeningPlayer" data-listening-player="${h(key)}" data-player-once="${options.once?'1':'0'}" data-player-played="${options.played?'1':'0'}"><div class="listeningPlayerTop"><button ${options.id?`id="${h(options.id)}"`:''} type="button" class="listeningToggle ${h(options.className||'')}" ${options.growth?'data-growth-action="listen"':`onclick="${h(action)}"`} ${options.played&&!busy(key)?'disabled':''}>${options.played?L('1회 재생권 사용','1回再生済み','Attempt used','已使用播放次数'):L('▶ 재생','▶ 再生','▶ Play','▶ 播放')}</button><label>${L('속도','速度','Speed','速度')} <select aria-label="${L('재생 속도','再生速度','Playback speed','播放速度')}" onchange="HARUMAL_LISTENING_PLAYER.setRate(this.value)">${RATES.map(v=>`<option value="${v}" ${v===rate()?'selected':''}>${v}×</option>`).join('')}</select></label></div><input type="range" min="0" max="1" step="0.1" value="0" disabled aria-label="${L('재생 위치','再生位置','Playback position','播放位置')}" oninput="HARUMAL_LISTENING_PLAYER.seek(this.value)"><div class="listeningTime"><output>0:00 / —:—</output><span data-player-source></span></div><p class="listeningMessage" role="status">${options.once?L('실전 1회 재생: 시작 후 정지하면 다시 들을 수 없어요.','試験は1回。開始後に停止すると再試聴できません。','Exam: one play. Stopping after playback starts uses the attempt.','考试仅播放一次，开始后停止会消耗次数。'):L('길이는 음원 정보를 읽은 뒤 표시해요.','長さは音声情報の読込後に表示します。','Duration appears after audio metadata loads.','加载音频信息后显示时长。')}</p><button type="button" class="listeningFallback" hidden onclick="HARUMAL_LISTENING_PLAYER.device()">${L('기기 음성으로 듣기','端末音声で聞く','Use device speech','使用设备语音')}</button></section>`;
}
function paint(){
 if(!view)return;const root=rootFor(view.key);if(!root)return;
 const running=busy(view.key),failed=view.status==='error',button=root.querySelector('.listeningToggle'),range=root.querySelector('input[type="range"]');
 if(button){button.disabled=!running&&root.dataset.playerPlayed==='1'&&!failed;button.textContent=running?L('■ 정지','■ 停止','■ Stop','■ 停止'):failed?L('↻ 다시 시도','↻ 再試行','↻ Retry','↻ 重试'):button.disabled?(view.status==='stopped'?L('■ 정지됨','■ 停止済み','■ Stopped','■ 已停止'):L('✓ 재생 완료','✓ 再生済み','✓ Played','✓ 已播放')):L('▶ 재생','▶ 再生','▶ Play','▶ 播放');button.setAttribute('aria-pressed',String(running));}
 if(range){range.disabled=!running||!Number.isFinite(view.total)||view.device||root.dataset.playerOnce==='1';range.max=Number.isFinite(view.total)?view.total:1;range.value=Number.isFinite(view.total)?Math.min(view.position,view.total):0;}
 const output=root.querySelector('output');if(output)output.textContent=view.device?'—:— / —:—':`${time(view.position)} / ${time(view.total)}`;
 const source=root.querySelector('[data-player-source]');if(source)source.textContent=view.device?L('기기 음성','端末音声','Device speech','设备语音'):L('녹음 음원','録音音声','Recorded audio','录制音频');
 const message=root.querySelector('.listeningMessage');if(message)message.textContent=failed?L('음성을 재생하지 못했어요. 다시 시도하거나 기기 음성을 선택하세요.','再生できません。再試行または端末音声を選んでください。','Audio could not play. Retry or choose device speech.','音频无法播放，请重试或选择设备语音。'):view.device?L('기기 음성은 정확한 길이·탐색을 지원하지 않아요. 배속 변경 시 현재 문장을 다시 시작해요.','端末音声は長さ・シーク非対応。速度変更で現在の文を再開します。','Device speech has no exact duration or seeking. Speed changes restart the current sentence.','设备语音不支持准确时长和拖动，变速会重新朗读当前句。'):view.status==='loading'?L('음원을 불러오는 중…','音声を読込中…','Loading audio…','正在加载音频…'):view.status==='stopped'&&root.dataset.playerOnce==='1'&&root.dataset.playerPlayed==='1'?L('정지했어요. 이미 시작한 실전 재생권은 사용됐어요.','停止しました。開始済みの試験再生権は使用済みです。','Stopped. The exam attempt was used because playback started.','已停止，开始播放后考试次数已使用。'):root.dataset.playerOnce==='1'?L('실전 1회 재생 · 탐색 불가 · 실패 시 재시도 가능','試験1回・シーク不可・失敗時は再試行可','Exam: one play, no seeking; failed playback can be retried.','考试仅一次，不可拖动，失败可重试。'):view.status==='ended'?L('재생 완료','再生完了','Playback complete','播放完成'):view.status==='stopped'?L('정지했어요. 처음부터 다시 재생할 수 있어요.','停止しました。最初から再生できます。','Stopped. Play again from the start.','已停止，可从头播放。'):Number.isFinite(view.total)?L('막대로 재생 위치를 바꿀 수 있어요.','バーで再生位置を変更できます。','Move the bar to seek.','拖动进度条可调整位置。'):L('전체 길이를 확인 중이에요. 확인 전에는 탐색할 수 없어요.','全体の長さを確認中です。確認前はシークできません。','Checking full duration. Seeking stays off until it is known.','正在确认总时长，确认前不可拖动。');
 const fallback=root.querySelector('.listeningFallback');if(fallback)fallback.hidden=!failed||view.device;
 root.querySelectorAll('select').forEach(el=>el.value=String(rate()));
}
function cancel(){current?.finish({cancelled:true});}
function setRate(value){if(!RATES.includes(Number(value)))return;window.malbitTtsSetRate?.(Number(value));current?.changeRate(Number(value));paint();}
function device(){if(last?.onDevice)last.onDevice();else if(last)play({...last,forceDevice:true});}
function speechParts(script){return String(script||'').split(/\n+/).map(line=>{const label=line.match(/^(여자|남자)(?:\([^)]*\))?\s*[:：]\s*/);return{text:line.replace(/^(?:여자|남자|여성|남성|진행자|전문가|안내|방송)(?:\([^)]*\))?\s*[:：]\s*/,''),gender:label?.[1]==='여자'?'female':label?'male':''}}).filter(p=>p.text.trim()).map(p=>/^[_\s]+$/.test(p.text)?{pause:1200}:p);}
function play(options){
 cancel();window.MALBIT_TTS?.cancel?.(true);window.HARUMAL_LISTENING_AUDIO?.cancel?.();
 const token=++serial;last=options;view={key:options.key,status:'loading',device:!!options.forceDevice,position:0,total:null};
 return new Promise(resolve=>{
  let parts=[],index=0,step=0,settled=false,started=false,seeked=false,active=null,gap=null,gapTimer=null,watchdog=null,tick=null,playRate=rate();
  const media=[],alive=()=>!settled&&token===serial;
  const validContext=()=>options.isCurrent?.()!==false&&(options.rootRequired===false||!!rootFor(options.key));
  const request={isCurrent:()=>alive()&&validContext()};
  const halt=()=>{step++;clearTimeout(gapTimer);clearTimeout(watchdog);gap=null;if(active){try{active.pause();active.currentTime=0}catch(_){}}active=null;window.MALBIT_TTS?.cancel?.(true);};
  const finish=result=>{if(!alive())return;settled=true;halt();clearInterval(tick);for(const a of media){a.onloadedmetadata=a.ondurationchange=a.onplaying=a.onended=a.onerror=a.onwaiting=null;try{a.pause();a.removeAttribute?.('src');a.load?.()}catch(_){}}if(current?.token===token)current=null;view.status=result.error?'error':result.cancelled?'stopped':'ended';view.position=result.cancelled?0:Number.isFinite(view.total)&&!result.error?view.total:view.position;const final={...result,started,heard:started&&!seeked&&!result.error&&!result.cancelled,engine:view.device?'device':'listening-file'};options.onResult?.(final);paint();resolve(final);};
  const fail=()=>finish({error:true}),markStarted=()=>{if(!started){started=true;options.onStart?.();}};
  const total=()=>{view.total=parts.length&&parts.every(p=>Number.isFinite(p.duration))?parts.reduce((n,p)=>n+p.duration,0):null;};
  const before=idx=>parts.slice(0,idx).reduce((n,p)=>n+(Number.isFinite(p.duration)?p.duration:0),0);
  const position=()=>{view.position=before(index)+(gap?Math.min(gap.duration,gap.offset+(Date.now()-gap.at)/1000*playRate):Number(active?.currentTime)||0);};
  const run=(idx,offset=0)=>{
   if(!alive())return;if(!validContext()){finish({cancelled:true});return;}halt();index=idx;const generation=step,valid=()=>{if(!alive()||generation!==step)return false;if(!validContext()){finish({cancelled:true});return false;}return true;};
   if(index>=parts.length){finish({cancelled:false});return;}const part=parts[index];
   if(part.pause){gap={at:Date.now(),offset,duration:part.duration};gapTimer=setTimeout(()=>{if(valid())run(index+1)},Math.max(0,part.duration-offset)/playRate*1000);return;}
   if(view.device){view.status='playing';paint();const promise=window.MALBIT_TTS?.play?.(part.text,{...options.readOptions,gender:part.gender||options.readOptions?.gender,rate:playRate,cancel:false,managed:true,onStart:()=>{if(valid())markStarted()}});if(!promise){fail();return;}watchdog=setTimeout(()=>{if(valid())fail()},Math.max(20000,part.text.length*1500/playRate));Promise.resolve(promise).then(result=>{if(!valid())return;if(result?.error||result?.unavailable||result?.cancelled){fail();return;}markStarted();run(index+1)},()=>{if(valid())fail()});return;}
   active=part.audio;view.status='loading';paint();active.playbackRate=playRate;active.preservesPitch=true;try{active.currentTime=offset}catch(_){if(offset){fail();return;}}
   active.onplaying=()=>{if(!valid())return;clearTimeout(watchdog);view.status='playing';markStarted();paint();};
   active.onwaiting=()=>{if(!valid())return;view.status='loading';clearTimeout(watchdog);watchdog=setTimeout(()=>{if(valid())fail()},15000);paint();};
   active.onended=()=>{if(!valid())return;if(!Number.isFinite(part.duration)&&Number.isFinite(active.duration)){part.duration=active.duration;total();}run(index+1);};
   active.onerror=()=>{if(valid())fail()};watchdog=setTimeout(()=>{if(valid())fail()},15000);
   try{Promise.resolve(active.play()).catch(()=>{if(valid())fail()})}catch(_){fail()}
  };
  current={token,options,finish,seek(value){if(!alive()||view.device||options.once||!Number.isFinite(view.total)||!Number.isFinite(value))return;seeked=true;let remaining=Math.max(0,Math.min(value,view.total)),i=0;while(i<parts.length&&remaining>=parts[i].duration){remaining-=parts[i].duration;i++;}run(i,remaining);},changeRate(value){position();const offset=view.position-before(index);playRate=value;if(view.device||gap)run(index,view.device?0:offset);else if(active)active.playbackRate=value;}};
  const prepare=segments=>{
   if(!alive())return;if(!validContext()){finish({cancelled:true});return;}if(!segments?.length){fail();return;}
   for(let i=0;i<segments.length;i++){const p=segments[i];if(i&&!p.pause&&!segments[i-1].pause)parts.push({pause:true,duration:.38});if(p.pause){parts.push({pause:true,duration:p.pause/1000});continue;}const part={...p,duration:null};if(!view.device){try{const a=new Audio();a.preload='metadata';a.src=p.url;part.audio=a;media.push(a);const metadata=()=>{if(!alive())return;const d=Number(a.duration);if(Number.isFinite(d)&&d>0){part.duration=d;total();paint();}};a.onloadedmetadata=a.ondurationchange=metadata;a.load?.();metadata();}catch(_){fail();return;}}parts.push(part);}
   total();tick=setInterval(()=>{if(!alive())return;if(!validContext()){finish({cancelled:true});return;}position();paint()},150);run(0);
  };
  paint();if(options.forceDevice){prepare(options.readOptions?[{text:String(options.script||''),gender:options.readOptions.gender||''}]:speechParts(options.script));return;}
  const segments=window.HARUMAL_LISTENING_AUDIO?.resolve?.(options.script);if(segments){prepare(segments);return;}
  if(options.legacy){Promise.resolve().then(()=>request.isCurrent()?options.legacy(request):null).then(url=>{if(!alive())return;if(!validContext()){finish({cancelled:true});return;}if(url)prepare([{url}]);else fail()},()=>{if(alive())fail()});return;}fail();
 });
}
function read(text,options={}){
 let root=document.getElementById('deviceSpeechPlayer');if(!root){root=document.createElement('aside');root.id='deviceSpeechPlayer';root.className='deviceSpeechPlayer';document.body.appendChild(root);}root.innerHTML=markup('HARUMAL_LISTENING_PLAYER.repeatRead()','device-read')+`<button type="button" class="deviceSpeechClose" onclick="HARUMAL_LISTENING_PLAYER.closeRead()">${L('닫기','閉じる','Close','关闭')}</button>`;
 return play({key:'device-read',script:text,forceDevice:true,readOptions:options});
}
window.HARUMAL_LISTENING_PLAYER=Object.freeze({markup,play,cancel,busy,setRate,seek:value=>current?.seek(Number(value)),device,read,repeatRead(){if(busy('device-read'))cancel();else if(last?.key==='device-read')read(last.script,last.readOptions)},closeRead(){if(busy('device-read'))cancel();document.getElementById('deviceSpeechPlayer')?.remove()},refresh:paint});
window.addEventListener?.('pagehide',cancel);
})();
