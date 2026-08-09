// TOPIK QUEST hot-patch layer.
// Developer Listening Studio + persistent upload connection + recorded-audio playback boost + home redesign.
(function(){
  'use strict';

  const GH_OWNER='okometsbu-beep';
  const GH_REPO='topik-quest';
  const GH_BRANCH='main';
  const TOKEN_KEY='topikQuestDevGithubToken';
  const DB_NAME='topikQuestDeveloper';
  const DB_STORE='settings';
  const AUDIO_EXTS=['mp3','m4a','aac','webm','ogg'];
  const RECORDED_AUDIO_GAIN=1.30;

  window.devUploadStatus=window.devUploadStatus||{};
  let devPreviewAudio=null;
  let memoryToken='';
  let tokenRestoreDone=false;

  let boostCtx=null;
  const boostedMedia=new WeakMap();
  function ensureBoostContext(){
    try{
      if(!boostCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;boostCtx=new AC()}
      if(boostCtx.state==='suspended')boostCtx.resume().catch(()=>{});
      return boostCtx;
    }catch(e){return null}
  }
  function shouldBoostMedia(el){const src=String(el?.currentSrc||el?.src||'');return src.startsWith('blob:')||src.includes('/audio/topik2/')}
  function attachBoost(el){
    if(!el||boostedMedia.has(el)||!shouldBoostMedia(el))return;
    const ctx=ensureBoostContext();if(!ctx)return;
    try{
      const source=ctx.createMediaElementSource(el),gain=ctx.createGain(),comp=ctx.createDynamicsCompressor();
      gain.gain.value=RECORDED_AUDIO_GAIN;comp.threshold.value=-8;comp.knee.value=8;comp.ratio.value=5;comp.attack.value=.003;comp.release.value=.18;
      source.connect(gain).connect(comp).connect(ctx.destination);boostedMedia.set(el,{source,gain,comp});
    }catch(e){try{el.volume=1}catch(_){} }
  }
  const nativeMediaPlay=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){try{attachBoost(this)}catch(e){}return nativeMediaPlay.apply(this,arguments)};
  document.addEventListener('pointerdown',ensureBoostContext,{capture:true,passive:true});
  document.addEventListener('touchstart',ensureBoostContext,{capture:true,passive:true});

  function openDb(){return new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(new Error('IndexedDB unavailable'));const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(DB_STORE))r.result.createObjectStore(DB_STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('IndexedDB open failed'))})}
  async function idbSet(k,v){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put(v,k);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
  async function idbGet(k){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readonly');const r=tx.objectStore(DB_STORE).get(k);r.onsuccess=()=>{db.close();resolve(r.result||'')};r.onerror=()=>{db.close();reject(r.error)}})}
  async function idbDel(k){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).delete(k);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
  async function requestPersistentStorage(){try{if(navigator.storage?.persist)await navigator.storage.persist()}catch(e){}}
  function ghToken(){if(memoryToken)return memoryToken;try{memoryToken=(localStorage.getItem(TOKEN_KEY)||'').trim()}catch(e){}return memoryToken}
  async function restoreDevToken(){if(tokenRestoreDone)return ghToken();tokenRestoreDone=true;let token=ghToken();if(!token){try{token=String(await idbGet(TOKEN_KEY)||'').trim()}catch(e){}if(token){memoryToken=token;try{localStorage.setItem(TOKEN_KEY,token)}catch(e){}}}if(token)requestPersistentStorage();return token}
  window.saveDevGithubToken=async function(){const el=document.getElementById('devGhToken'),token=(el?.value||'').trim();if(!token){toast('GitHub token을 입력해 주세요.');return}memoryToken=token;try{localStorage.setItem(TOKEN_KEY,token)}catch(e){}try{await idbSet(TOKEN_KEY,token)}catch(e){}await requestPersistentStorage();if(el)el.value='';toast('이 기기에 연결을 기억했습니다. 다음 접속부터 자동 복구합니다.');render()};
  window.clearDevGithubToken=async function(){memoryToken='';try{localStorage.removeItem(TOKEN_KEY)}catch(e){}try{await idbDel(TOKEN_KEY)}catch(e){}toast('GitHub 업로드 연결을 해제했습니다.');render()};
  window.openGithubTokenSetup=function(){window.open('https://github.com/settings/personal-access-tokens/new','_blank')};
  window.copyDevStudioUrl=async function(){const u='https://okometsbu-beep.github.io/topik-quest/?dev=studio';try{await navigator.clipboard.writeText(u);toast('제작실 주소를 복사했습니다. Safari에서 열어 주세요.')}catch(e){prompt('이 주소를 Safari에서 여세요.',u)}};

  function ghHeaders(token){return {'Accept':'application/vnd.github+json','Authorization':'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'}}
  function blobBase64(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||'').split(',')[1]||'');r.onerror=()=>reject(r.error||new Error('FileReader failed'));r.readAsDataURL(blob)})}
  async function currentGithubFile(path,token){const url=`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}?ref=${encodeURIComponent(GH_BRANCH)}`;const r=await fetch(url,{headers:ghHeaders(token),cache:'no-store'});if(r.status===404)return null;if(!r.ok){let msg='';try{msg=(await r.json()).message||''}catch(e){}throw new Error(msg||`GitHub GET ${r.status}`)}return await r.json()}
  async function deleteGithubFile(path,sha,token,q){const r=await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,{method:'DELETE',headers:{...ghHeaders(token),'Content-Type':'application/json'},body:JSON.stringify({message:`Remove superseded TOPIK II listening Q${q} audio`,sha,branch:GH_BRANCH})});if(!r.ok){let data={};try{data=await r.json()}catch(e){}throw new Error(data.message||`GitHub DELETE ${r.status}`)}}
  function stopDevPreview(){if(devPreviewAudio){try{devPreviewAudio.pause();devPreviewAudio.currentTime=0}catch(e){}devPreviewAudio=null}}
  window.playDevRecordingPreview=function(id){const x=devBlobs[id];if(!x){toast('먼저 이 문항을 녹음해 주세요.');return}stopDevPreview();try{const a=new Audio(x.url);devPreviewAudio=a;a.onended=()=>{devPreviewAudio=null};a.onerror=()=>{devPreviewAudio=null;toast('녹음 미리듣기에 실패했습니다.')};a.play()}catch(e){toast('녹음 미리듣기에 실패했습니다.')}};
  window.playUploadedDevAudio=async function(id){stopDevPreview();stopListeningAudio();const q=String(id).padStart(3,'0');for(const ext of AUDIO_EXTS){const url=`audio/topik2/q${q}.${ext}?v=${Date.now()}`;try{const r=await fetch(url,{method:'HEAD',cache:'no-store'});if(!r.ok)continue;const a=new Audio(url);devPreviewAudio=a;a.onended=()=>{devPreviewAudio=null};a.onerror=()=>{devPreviewAudio=null;toast('업로드된 음성을 재생하지 못했습니다.')};await a.play();return}catch(e){}}toast('아직 업로드된 음원이 없습니다.')};

  window.uploadDevRecording=async function(id){
    const x=devBlobs[id];if(!x){toast('먼저 이 문항을 녹음해 주세요.');return}
    let token=ghToken();if(!token)token=await restoreDevToken();if(!token){toast('GitHub 연결이 없습니다. 최초 한 번만 연결해 주세요.');document.getElementById('devGhToken')?.focus();return}
    stopDevPreview();const q=String(id).padStart(3,'0'),targetPath=`audio/topik2/q${q}.${x.ext}`;devUploadStatus[id]={state:'uploading',text:'기존 음원 확인 중…'};render();
    try{
      const existing=[];for(const ext of AUDIO_EXTS){const path=`audio/topik2/q${q}.${ext}`,file=await currentGithubFile(path,token);if(file?.sha)existing.push({path,sha:file.sha})}
      const targetOld=existing.find(f=>f.path===targetPath),content=await blobBase64(x.blob);devUploadStatus[id]={state:'uploading',text:targetOld?'기존 음원 교체 중…':'새 음원 업로드 중…'};render();
      const body={message:`Replace TOPIK II listening Q${q} recording`,content,branch:GH_BRANCH};if(targetOld?.sha)body.sha=targetOld.sha;
      const r=await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${targetPath}`,{method:'PUT',headers:{...ghHeaders(token),'Content-Type':'application/json'},body:JSON.stringify(body)});let data={};try{data=await r.json()}catch(e){}if(!r.ok)throw new Error(data.message||`GitHub PUT ${r.status}`);
      for(const old of existing){if(old.path!==targetPath)await deleteGithubFile(old.path,old.sha,token,q)}
      devUploadStatus[id]={state:'done',text:existing.length?'교체 완료':'업로드 완료',path:targetPath,commit:data?.commit?.sha||''};toast(`Q${q} ${existing.length?'음원 교체':'업로드'} 완료`);render();
    }catch(e){console.error(e);devUploadStatus[id]={state:'error',text:'업로드 실패'};const msg=String(e?.message||e);if(/401|Bad credentials|Requires authentication/i.test(msg)){memoryToken='';try{localStorage.removeItem(TOKEN_KEY)}catch(_){}try{await idbDel(TOKEN_KEY)}catch(_){}toast('GitHub 권한이 만료되었거나 잘못되었습니다. 새 토큰이 필요합니다.')}else if(/403|permission|Resource not accessible/i.test(msg)){toast('GitHub token의 Contents 쓰기 권한을 확인해 주세요.')}else toast('업로드 실패: '+msg.slice(0,100));render()}
  };

  function micAlive(){return !!(devStream&&devStream.getAudioTracks?.().some(t=>t.readyState==='live'))}
  window.prepareDevMicrophone=async function(){if(micAlive()){toast('마이크가 이미 준비되어 있습니다.');return true}if(!navigator.mediaDevices?.getUserMedia){toast('이 브라우저는 마이크 녹음을 지원하지 않습니다.');return false}try{devStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});toast('마이크 준비 완료. 이 제작실을 닫기 전까지 다시 요청하지 않습니다.');render();return true}catch(e){console.error(e);toast('마이크 권한을 허용해 주세요. Safari 사이트 설정에서 마이크를 허용으로 고정할 수 있습니다.');return false}};
  window.releaseDevMicrophone=function(){try{devStream?.getTracks().forEach(t=>t.stop())}catch(e){}devStream=null;toast('마이크를 껐습니다.');render()};
  window.toggleDevRecord=async function(id){
    if(!window.MediaRecorder){toast('MediaRecorder unavailable');return}stopDevPreview();
    if(devRecorder&&devRecorder.state==='recording'){if(devRecordingId!==id){toast('먼저 현재 녹음을 종료하세요.');return}devRecorder.stop();return}
    if(!micAlive()){const ok=await prepareDevMicrophone();if(!ok)return}
    try{const types=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'],mime=types.find(t=>MediaRecorder.isTypeSupported?.(t))||'';devChunks=[];devRecordingId=id;devRecorder=new MediaRecorder(devStream,mime?{mimeType:mime}:undefined);const b=document.getElementById('devRec_'+id);if(b){b.textContent='■ 종료';b.style.background='#6d2431';b.style.color='#fff'}devRecorder.ondataavailable=e=>{if(e.data?.size)devChunks.push(e.data)};devRecorder.onstop=()=>{const type=devRecorder.mimeType||mime||'audio/webm',ext=type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm',blob=new Blob(devChunks,{type}),url=URL.createObjectURL(blob);if(devBlobs[id]?.url)try{URL.revokeObjectURL(devBlobs[id].url)}catch(e){}devBlobs[id]={blob,url,ext};devUploadStatus[id]={state:'ready',text:'녹음 완료 · 미리듣기 후 업로드 가능'};devRecorder=null;devRecordingId=null;toast('녹음 완료. 마이크 연결은 유지됩니다.');render()};devRecorder.start();render()}catch(e){console.error(e);toast('녹음을 시작하지 못했습니다.')}
  };

  window.developerStudio=function(sc){
    navActive('more');const linked=!!ghToken(),micReady=micAlive();
    const rows=LS.map(q=>{const x=devBlobs[q.id],st=devUploadStatus[q.id];let action='';if(devRecordingId===q.id&&devRecorder?.state==='recording')action=`<button id="devRec_${q.id}" onclick="toggleDevRecord(${q.id})" style="background:#6d2431;color:#fff">■ 종료</button>`;else{action=`<button id="devRec_${q.id}" onclick="toggleDevRecord(${q.id})">🎙 ${x?'다시 녹음':'녹음'}</button>`;if(x)action+=`<button onclick="playDevRecordingPreview(${q.id})">▶ 내 녹음</button><button onclick="uploadDevRecording(${q.id})" ${st?.state==='uploading'?'disabled':''}>${st?.state==='uploading'?'⏳ 처리 중':st?.state==='done'?'↻ 다시 교체':'⬆ 업로드/교체'}</button>`}const status=st?`<div style="font-size:9px;margin-top:5px;color:${st.state==='error'?'#ff8a9d':st.state==='done'?'#65d6ac':'#9eb3cf'}">${st.text}${st.path?` · ${st.path}`:''}</div>`:'';return `<div class="devRow" style="grid-template-columns:48px 1fr;align-items:start"><div><b>Q${String(q.id).padStart(3,'0')}</b></div><div><b>${q.id<=20?'1 PLAY':'SCRIPT'}</b><p style="white-space:pre-wrap">${esc(q.script||'')}</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><button onclick="playUploadedDevAudio(${q.id})">▶ 현재 음성</button>${action}</div>${status}</div></div>`}).join('');
    sc.innerHTML=`<div class="sectionTitle"><h2>🔒 Developer Listening Studio</h2><span>DEV ONLY</span></div><div class="devBanner">한 번 연결하면 같은 Safari/Web App에서 GitHub 권한을 자동 복구합니다. 마이크는 제작실을 열어 둔 동안 한 번만 허용하고 계속 재사용합니다.</div><div class="infoCard"><h3>🎙 마이크</h3><p>${micReady?'✓ 마이크가 준비되어 있습니다.':'처음 녹음할 때 한 번만 마이크를 준비합니다.'}</p><button class="primary ${micReady?'alt':''}" onclick="${micReady?'releaseDevMicrophone()':'prepareDevMicrophone()'}">${micReady?'마이크 끄기':'마이크 한 번만 준비'}</button></div><div class="infoCard"><h3>🔑 GitHub 자동 업로드</h3>${linked?`<p>✓ 연결 기억됨. 다시 토큰을 만들거나 붙일 필요 없습니다.</p><button class="primary alt" onclick="clearDevGithubToken()">연결 해제</button>`:`<p>최초 한 번만 fine-grained token을 입력합니다.</p><input id="devGhToken" type="password" autocomplete="off" placeholder="github_pat_..." style="width:100%;padding:13px;border-radius:13px;border:1px solid #314663;background:#0c192b;color:#fff;margin:8px 0"><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button class="primary alt" onclick="openGithubTokenSetup()">GitHub 권한 만들기</button><button class="primary" onclick="saveDevGithubToken()">이 기기에 연결</button></div>`}</div><div>${rows}</div>`;
  };

  const originalSetView=window.setView;
  if(typeof originalSetView==='function')window.setView=function(v){if(window.S?.view==='devStudio'&&v!=='devStudio')releaseDevMicrophone();return originalSetView(v)};
  window.addEventListener('pagehide',()=>{stopDevPreview();try{devStream?.getTracks().forEach(t=>t.stop())}catch(e){}});
  restoreDevToken().then(()=>{if(window.S?.view==='devStudio')render()});

  // Home screen redesign inspired by the earlier TOPIK QUEST concept board.
  const homeStyle=document.createElement('style');
  homeStyle.textContent=`
    .screen.homeV10{padding-top:10px}
    .hqHero{position:relative;min-height:250px;border-radius:27px;overflow:hidden;border:1px solid #47618c;background:linear-gradient(160deg,#4d7cce 0%,#7ba9e8 38%,#eab1bd 100%);box-shadow:0 20px 52px rgba(0,0,0,.28);margin-bottom:12px}
    .hqHero:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,36,75,.02),rgba(6,15,28,.76));z-index:1}
    .hqHeroArt{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;filter:saturate(1.08) brightness(1.04)}
    .hqHeroCopy{position:absolute;left:18px;right:18px;bottom:17px;z-index:2;text-shadow:0 2px 12px rgba(0,0,0,.45)}
    .hqHeroCopy .mini{font-size:10px;font-weight:900;letter-spacing:.16em;color:#e5efff}
    .hqHeroCopy h1{margin:4px 0 5px;font-size:29px;letter-spacing:-.05em}
    .hqHeroCopy p{margin:0;color:#e6effc;font-size:11px;line-height:1.45;max-width:82%}
    .hqModes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px}
    .hqMode{position:relative;min-height:148px;border:0;border-radius:22px;padding:13px 11px 12px;text-align:left;color:#fff;overflow:hidden;box-shadow:0 13px 28px rgba(0,0,0,.18)}
    .hqMode.exam{background:linear-gradient(155deg,#3885ff,#315bcf)}
    .hqMode.game{background:linear-gradient(155deg,#ff765f,#e94c74)}
    .hqMode.infinity{background:linear-gradient(155deg,#9a62ff,#6b47d9)}
    .hqMode .tag{position:absolute;right:9px;top:9px;border:1px solid rgba(255,255,255,.36);border-radius:99px;padding:3px 6px;font-size:7px;letter-spacing:.08em;background:rgba(0,0,0,.08)}
    .hqMode .ico{font-size:30px;line-height:1;margin:17px 0 12px}
    .hqMode b{display:block;font-size:15px;letter-spacing:-.04em;margin-bottom:5px}
    .hqMode p{font-size:9px;line-height:1.45;color:rgba(255,255,255,.84);margin:0}
    .hqQuick{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}
    .hqQuick button{border:1px solid #2d4264;border-radius:19px;background:linear-gradient(145deg,#111f35,#172a46);padding:14px;color:#fff;text-align:left;min-height:96px}
    .hqQuick .qicon{font-size:20px;margin-bottom:8px}.hqQuick b{font-size:13px;display:block}.hqQuick small{font-size:9px;line-height:1.45;color:#94a9c7;display:block;margin-top:4px}
    .hqStatus{margin:12px 1px 2px;padding:12px 14px;border:1px solid #283c5c;border-radius:18px;background:#0e1b2e;display:flex;align-items:center;gap:10px}
    .hqStatus .orb{width:38px;height:38px;border-radius:14px;background:linear-gradient(135deg,#4b8cff,#876cff);display:grid;place-items:center;font-size:19px;flex:none}
    .hqStatus b{font-size:12px}.hqStatus small{display:block;color:#91a4c2;font-size:9px;margin-top:3px}
    @media(max-width:390px){.hqMode{min-height:140px;padding-left:9px;padding-right:9px}.hqMode b{font-size:14px}.hqMode p{font-size:8.5px}.hqHero{min-height:235px}}
  `;
  document.head.appendChild(homeStyle);

  home=function(sc){
    navActive('home');setProgress(0);sc.classList.add('homeV10');
    const hero=ASSETS['exam_student.png'];
    sc.innerHTML=`
      <section class="hqHero">
        <img class="hqHeroArt" src="${hero}" alt="TOPIK study character">
        <div class="hqHeroCopy"><span class="mini">KOREAN MASTERY</span><h1>TOPIK QUEST</h1><p>${ml('오늘도 한 문제씩. 시험·게임·무한 연습 중 원하는 방식으로 바로 시작하세요.','今日も一問ずつ。試験・ゲーム・無限練習からすぐ始めましょう。','One question at a time. Jump into exam, game, or endless practice.','每天一道题，从考试、游戏或无限练习立即开始。')}</p></div>
      </section>
      <div class="hqModes">
        <button class="hqMode exam" onclick="setView('realSetup')"><span class="tag">EXAM</span><div class="ico">🎧</div><b>${tr('real')}</b><p>${ml('실제 시험 형식으로 집중 연습','本番形式で集中練習','Real exam practice','真实考试练习')}</p></button>
        <button class="hqMode game" onclick="setView('game')"><span class="tag">STAGE</span><div class="ico">⚔️</div><b>${ml('게임모드','ゲームモード','Game Mode','游戏模式')}</b><p>${ml('몬스터를 물리치며 스테이지 클리어','モンスターを倒して攻略','Clear monster stages','击败怪物闯关')}</p></button>
        <button class="hqMode infinity" onclick="startInfinity()"><span class="tag">ENDLESS</span><div class="ico">∞</div><b>${tr('infinity')}</b><p>${ml('랜덤 문제를 끝없이 풀며 기록 갱신','ランダム問題を無限に練習','Endless random practice','无限随机练习')}</p></button>
      </div>
      <div class="sectionTitle"><h2>${ml('빠른 연습','クイック練習','Quick Practice','快速练习')}</h2><span>TRAINING</span></div>
      <div class="hqQuick">
        <button onclick="setView('speaking')"><div class="qicon">🎙</div><b>${ml('말하기 연습','スピーキング','Speaking','口语')}</b><small>${ml('읽기·따라하기·발음 점수','音読・シャドーイング','Read, shadow, score','朗读、跟读、评分')}</small></button>
        <button onclick="setView('review')"><div class="qicon">↻</div><b>${tr('review')}</b><small>${ml('틀린 문제를 다시 확인','間違えた問題を復習','Review missed questions','复习错题')}</small></button>
      </div>
      <div class="hqStatus"><div class="orb">🏆</div><div><b>${ml('오늘의 목표','今日の目標','Today’s goal','今日目标')}</b><small>${ml('원하는 모드를 골라 바로 시작하세요.','好きなモードを選んですぐ始めましょう。','Pick a mode and start immediately.','选择模式立即开始。')}</small></div></div>`;
  };

  if(window.S?.view==='devStudio')setTimeout(()=>render(),0);
  else if(window.S?.view==='home')setTimeout(()=>render(),0);
})();
