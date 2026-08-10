// MALBIT live patch v11
// Unified app, persistent listening-studio upload, louder recorded audio, redesigned home.
(function(){
  const GH_OWNER='okometsbu-beep';
  const GH_REPO='topik-quest';
  const GH_BRANCH='main';
  const TOKEN_KEY='topikQuestDevGithubToken';
  const DB_NAME='topikQuestDeveloper';
  const DB_STORE='settings';
  const AUDIO_EXTS=['mp3','m4a','aac','webm','ogg'];
  const RECORDED_AUDIO_GAIN=1.30;

  window.devUploadStatus=window.devUploadStatus||{};
  let memoryToken='';
  let devPreviewAudio=null;
  let boostCtx=null;
  const boostedMedia=new WeakMap();

  // ---------- recorded audio boost ----------
  function ensureBoostContext(){
    try{
      if(!boostCtx){
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC)return null;
        boostCtx=new AC();
      }
      if(boostCtx.state==='suspended')boostCtx.resume().catch(()=>{});
      return boostCtx;
    }catch(e){return null}
  }
  function shouldBoostMedia(el){
    const src=String(el?.currentSrc||el?.src||'');
    return src.startsWith('blob:')||src.includes('/audio/topik2/');
  }
  function attachBoost(el){
    if(!el||boostedMedia.has(el)||!shouldBoostMedia(el))return;
    const ctx=ensureBoostContext();
    if(!ctx)return;
    try{
      const source=ctx.createMediaElementSource(el);
      const gain=ctx.createGain();
      const comp=ctx.createDynamicsCompressor();
      gain.gain.value=RECORDED_AUDIO_GAIN;
      comp.threshold.value=-8;
      comp.knee.value=8;
      comp.ratio.value=5;
      comp.attack.value=.003;
      comp.release.value=.18;
      source.connect(gain).connect(comp).connect(ctx.destination);
      boostedMedia.set(el,{source,gain,comp});
    }catch(e){try{el.volume=1}catch(_){}}
  }
  const nativeMediaPlay=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){
    try{attachBoost(this)}catch(e){}
    return nativeMediaPlay.apply(this,arguments);
  };
  document.addEventListener('pointerdown',ensureBoostContext,{capture:true,passive:true});
  document.addEventListener('touchstart',ensureBoostContext,{capture:true,passive:true});

  // ---------- persistent GitHub token ----------
  function openDb(){
    return new Promise((resolve,reject)=>{
      if(!window.indexedDB)return reject(new Error('IndexedDB unavailable'));
      const r=indexedDB.open(DB_NAME,1);
      r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(DB_STORE))r.result.createObjectStore(DB_STORE)};
      r.onsuccess=()=>resolve(r.result);
      r.onerror=()=>reject(r.error||new Error('IndexedDB open failed'));
    });
  }
  async function idbSet(k,v){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE,'readwrite');
      tx.objectStore(DB_STORE).put(v,k);
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>{db.close();reject(tx.error)};
    });
  }
  async function idbGet(k){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE,'readonly');
      const r=tx.objectStore(DB_STORE).get(k);
      r.onsuccess=()=>{db.close();resolve(r.result||'')};
      r.onerror=()=>{db.close();reject(r.error)};
    });
  }
  async function idbDel(k){
    const db=await openDb();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE,'readwrite');
      tx.objectStore(DB_STORE).delete(k);
      tx.oncomplete=()=>{db.close();resolve()};
      tx.onerror=()=>{db.close();reject(tx.error)};
    });
  }
  async function requestPersistentStorage(){
    try{if(navigator.storage?.persist)await navigator.storage.persist()}catch(e){}
  }
  function ghToken(){
    if(memoryToken)return memoryToken;
    try{memoryToken=(localStorage.getItem(TOKEN_KEY)||'').trim()}catch(e){}
    return memoryToken;
  }
  async function restoreDevToken(){
    let token=ghToken();
    if(!token){
      try{token=String(await idbGet(TOKEN_KEY)||'').trim()}catch(e){}
      if(token){
        memoryToken=token;
        try{localStorage.setItem(TOKEN_KEY,token)}catch(e){}
      }
    }
    if(token)requestPersistentStorage();
    return token;
  }
  window.saveDevGithubToken=async function(){
    const el=document.getElementById('devGhToken');
    const token=(el?.value||'').trim();
    if(!token){toast('GitHub token을 입력해 주세요.');return}
    memoryToken=token;
    try{localStorage.setItem(TOKEN_KEY,token)}catch(e){}
    try{await idbSet(TOKEN_KEY,token)}catch(e){}
    await requestPersistentStorage();
    if(el)el.value='';
    toast('연결을 저장했습니다. 다음부터 자동으로 연결됩니다.');
    render();
  };
  window.clearDevGithubToken=async function(){
    memoryToken='';
    try{localStorage.removeItem(TOKEN_KEY)}catch(e){}
    try{await idbDel(TOKEN_KEY)}catch(e){}
    toast('GitHub 연결을 해제했습니다.');
    render();
  };
  window.openGithubTokenSetup=function(){window.open('https://github.com/settings/personal-access-tokens/new','_blank')};

  function ghHeaders(token){
    return {
      'Accept':'application/vnd.github+json',
      'Authorization':'Bearer '+token,
      'X-GitHub-Api-Version':'2022-11-28'
    };
  }
  function blobBase64(blob){
    return new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(String(r.result||'').split(',')[1]||'');
      r.onerror=()=>reject(r.error||new Error('FileReader failed'));
      r.readAsDataURL(blob);
    });
  }
  async function currentGithubFile(path,token){
    const url=`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}?ref=${encodeURIComponent(GH_BRANCH)}`;
    const r=await fetch(url,{headers:ghHeaders(token),cache:'no-store'});
    if(r.status===404)return null;
    if(!r.ok){
      let msg='';
      try{msg=(await r.json()).message||''}catch(e){}
      throw new Error(msg||`GitHub GET ${r.status}`);
    }
    return await r.json();
  }
  async function deleteGithubFile(path,sha,token,q){
    const r=await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,{
      method:'DELETE',
      headers:{...ghHeaders(token),'Content-Type':'application/json'},
      body:JSON.stringify({message:`Remove superseded TOPIK II listening Q${q} audio`,sha,branch:GH_BRANCH})
    });
    if(!r.ok){
      let data={};try{data=await r.json()}catch(e){}
      throw new Error(data.message||`GitHub DELETE ${r.status}`);
    }
  }

  // ---------- recording preview / uploaded audio ----------
  function stopDevPreview(){
    if(devPreviewAudio){
      try{devPreviewAudio.pause();devPreviewAudio.currentTime=0}catch(e){}
      devPreviewAudio=null;
    }
  }
  window.playDevRecordingPreview=function(id){
    const x=devBlobs[id];
    if(!x){toast('먼저 이 문항을 녹음해 주세요.');return}
    stopDevPreview();ensureBoostContext();
    try{
      const a=new Audio(x.url);devPreviewAudio=a;
      a.onended=()=>{devPreviewAudio=null};
      a.onerror=()=>{devPreviewAudio=null;toast('녹음 미리듣기에 실패했습니다.')};
      a.play();
    }catch(e){toast('녹음 미리듣기에 실패했습니다.')}
  };
  window.playUploadedDevAudio=async function(id){
    stopDevPreview();stopListeningAudio();ensureBoostContext();
    const q=String(id).padStart(3,'0');
    for(const ext of AUDIO_EXTS){
      const url=`audio/topik2/q${q}.${ext}?v=${Date.now()}`;
      try{
        const r=await fetch(url,{method:'HEAD',cache:'no-store'});
        if(!r.ok)continue;
        const a=new Audio(url);devPreviewAudio=a;
        a.onended=()=>{devPreviewAudio=null};
        a.onerror=()=>{devPreviewAudio=null;toast('업로드된 음성을 재생하지 못했습니다.')};
        await a.play();
        return;
      }catch(e){}
    }
    toast('아직 업로드된 음원이 없습니다.');
  };
  window.uploadDevRecording=async function(id){
    const x=devBlobs[id];
    if(!x){toast('먼저 이 문항을 녹음해 주세요.');return}
    const token=await restoreDevToken();
    if(!token){toast('최초 한 번만 GitHub 업로드 연결을 설정해 주세요.');return}
    stopDevPreview();
    const q=String(id).padStart(3,'0');
    const targetPath=`audio/topik2/q${q}.${x.ext}`;
    devUploadStatus[id]={state:'uploading',text:'기존 음원 확인 중…'};render();
    try{
      const existing=[];
      for(const ext of AUDIO_EXTS){
        const path=`audio/topik2/q${q}.${ext}`;
        const file=await currentGithubFile(path,token);
        if(file?.sha)existing.push({path,sha:file.sha});
      }
      const targetOld=existing.find(f=>f.path===targetPath);
      const content=await blobBase64(x.blob);
      devUploadStatus[id]={state:'uploading',text:existing.length?'기존 음원 교체 중…':'새 음원 업로드 중…'};render();
      const body={message:`Replace TOPIK II listening Q${q} recording`,content,branch:GH_BRANCH};
      if(targetOld?.sha)body.sha=targetOld.sha;
      const r=await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${targetPath}`,{
        method:'PUT',headers:{...ghHeaders(token),'Content-Type':'application/json'},body:JSON.stringify(body)
      });
      let data={};try{data=await r.json()}catch(e){}
      if(!r.ok)throw new Error(data.message||`GitHub PUT ${r.status}`);
      for(const old of existing){if(old.path!==targetPath)await deleteGithubFile(old.path,old.sha,token,q)}
      devUploadStatus[id]={state:'done',text:existing.length?'교체 완료':'업로드 완료',path:targetPath};
      toast(`Q${q} ${existing.length?'음원 교체':'업로드'} 완료`);
      render();
    }catch(e){
      console.error(e);
      devUploadStatus[id]={state:'error',text:'업로드 실패'};
      const msg=String(e?.message||e);
      if(/401|Bad credentials|Requires authentication/i.test(msg)){
        memoryToken='';
        try{localStorage.removeItem(TOKEN_KEY)}catch(_){}
        try{await idbDel(TOKEN_KEY)}catch(_){}
        toast('저장된 GitHub 권한이 만료되었습니다. 새 토큰을 연결해 주세요.');
      }else if(/403|permission|Resource not accessible/i.test(msg)){
        toast('GitHub token의 Contents 쓰기 권한을 확인해 주세요.');
      }else toast('업로드 실패: '+msg.slice(0,100));
      render();
    }
  };

  // ---------- one mic stream per studio session ----------
  function micAlive(){return !!(devStream&&devStream.getAudioTracks?.().some(t=>t.readyState==='live'))}
  async function prepareMic(){
    if(micAlive())return true;
    if(!navigator.mediaDevices?.getUserMedia){toast('이 브라우저는 마이크 녹음을 지원하지 않습니다.');return false}
    try{
      devStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      return true;
    }catch(e){
      console.error(e);
      toast('마이크 권한을 허용해 주세요. Safari 사이트 설정에서 이 사이트를 허용으로 지정할 수 있습니다.');
      return false;
    }
  }
  function releaseMic(){
    try{devStream?.getTracks().forEach(t=>t.stop())}catch(e){}
    devStream=null;
  }
  window.toggleDevRecord=async function(id){
    if(!window.MediaRecorder){toast('MediaRecorder unavailable');return}
    stopDevPreview();
    if(devRecorder&&devRecorder.state==='recording'){
      if(devRecordingId!==id){toast('먼저 현재 녹음을 종료하세요.');return}
      devRecorder.stop();
      return;
    }
    if(!(await prepareMic()))return;
    try{
      const types=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'];
      const mime=types.find(t=>MediaRecorder.isTypeSupported?.(t))||'';
      devChunks=[];devRecordingId=id;
      devRecorder=new MediaRecorder(devStream,mime?{mimeType:mime}:undefined);
      devRecorder.ondataavailable=e=>{if(e.data?.size)devChunks.push(e.data)};
      devRecorder.onstop=()=>{
        const type=devRecorder.mimeType||mime||'audio/webm';
        const ext=type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm';
        const blob=new Blob(devChunks,{type});
        const url=URL.createObjectURL(blob);
        if(devBlobs[id]?.url)try{URL.revokeObjectURL(devBlobs[id].url)}catch(e){}
        devBlobs[id]={blob,url,ext};
        devUploadStatus[id]={state:'ready',text:'녹음 완료 · 들어본 뒤 업로드 가능'};
        devRecorder=null;devRecordingId=null;
        toast('녹음 완료. 바로 미리듣기할 수 있습니다.');
        render();
      };
      devRecorder.start();
      render();
    }catch(e){console.error(e);toast('녹음을 시작하지 못했습니다.')}
  };

  // ---------- visual system ----------
  const style=document.createElement('style');
  style.textContent=`
    .tqHome{padding-top:8px!important}
    .tqHero{position:relative;overflow:hidden;min-height:285px;border-radius:29px;border:1px solid #5172ad;background:#4f8fe0;box-shadow:0 24px 55px rgba(0,0,0,.28);margin:0 0 11px}
    .tqHero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 34%;filter:saturate(1.08) brightness(1.08)}
    .tqHero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,18,42,.02) 34%,rgba(4,12,27,.84) 100%)}
    .tqHeroBrand{position:absolute;left:17px;top:17px;z-index:2;text-shadow:0 2px 10px rgba(0,0,0,.25)}
    .tqHeroBrand b{display:block;font-size:27px;letter-spacing:-.055em}.tqHeroBrand small{font-size:9px;letter-spacing:.22em;font-weight:900;color:#e6f0ff}
    .tqBubble{position:absolute;right:13px;top:20px;z-index:3;max-width:153px;background:rgba(255,255,255,.94);color:#263856;border-radius:20px 20px 6px 20px;padding:10px 11px;font-size:10px;font-weight:800;line-height:1.45;box-shadow:0 7px 24px rgba(0,0,0,.16)}
    .tqHeroFoot{position:absolute;left:17px;right:17px;bottom:17px;z-index:3}.tqHeroFoot b{font-size:16px}.tqHeroFoot small{display:block;margin-top:4px;font-size:10px;color:#d7e4f7}
    .tqModeGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .tqMode{border:0;border-radius:22px;overflow:hidden;padding:0;color:#fff;text-align:left;min-height:185px;box-shadow:0 13px 27px rgba(0,0,0,.18);position:relative}
    .tqMode .art{height:99px;position:relative;overflow:hidden}.tqMode .art img{width:100%;height:100%;object-fit:cover}.tqMode .art:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.24))}
    .tqMode .fakeArt{height:99px;display:grid;place-items:center;font-size:43px;position:relative}.tqMode .fakeArt span{filter:drop-shadow(0 7px 12px rgba(0,0,0,.2))}
    .tqMode.exam{background:linear-gradient(155deg,#2788ff,#255fd7)}.tqMode.game{background:linear-gradient(155deg,#ff7c58,#ef476f)}.tqMode.inf{background:linear-gradient(155deg,#9763ff,#653fd3)}
    .tqMode.exam .fakeArt{background:linear-gradient(160deg,#b7e8ff,#7ac0ff)}.tqMode.game .fakeArt{background:linear-gradient(160deg,#a9e6b0,#5ebf87)}.tqMode.inf .fakeArt{background:radial-gradient(circle at 50% 35%,#8969ff,#261c72 72%)}
    .tqMode .copy{padding:11px 10px 12px}.tqMode .copy b{font-size:15px;letter-spacing:-.04em;display:block}.tqMode .copy small{display:block;font-size:8.5px;line-height:1.45;color:rgba(255,255,255,.86);margin-top:5px}
    .tqSectionHead{display:flex;align-items:center;justify-content:space-between;margin:18px 3px 9px}.tqSectionHead b{font-size:15px}.tqSectionHead span{font-size:9px;color:#8197b5;letter-spacing:.08em}
    .tqQuick{display:grid;grid-template-columns:1fr 1fr;gap:8px}.tqQuick button{background:linear-gradient(145deg,#101e33,#172a46);border:1px solid #2c4163;color:#fff;border-radius:20px;min-height:98px;padding:13px;text-align:left}.tqQuick i{font-style:normal;font-size:22px}.tqQuick b{display:block;font-size:13px;margin-top:7px}.tqQuick small{display:block;color:#94a9c7;font-size:9px;line-height:1.45;margin-top:4px}
    .tqStudioBadge{display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border-radius:99px;background:#173250;color:#9fc7ff;font-size:8px;font-weight:900}
    .devRow button{border:1px solid #315077;background:#132842;color:#fff;border-radius:10px;padding:8px 10px;font-size:10px;font-weight:800}.devRow{border-bottom:1px solid #20334d;padding:13px 0}.devRow p{color:#9fb2cc;font-size:10px;line-height:1.55;margin:5px 0 0}
    @media(max-width:390px){.tqHero{min-height:265px}.tqMode{min-height:175px}.tqMode .art,.tqMode .fakeArt{height:92px}.tqMode .copy b{font-size:14px}.tqMode .copy small{font-size:8px}}
  `;
  document.head.appendChild(style);

  // ---------- redesigned unified home ----------
  home=function(sc){
    navActive('home');setProgress(0);
    sc.classList.add('tqHome');
    const hero=ASSETS['exam_student.png'];
    sc.innerHTML=`
      <section class="tqHero">
        <img src="${hero}" alt="MALBIT Korean learning">
        <div class="tqHeroBrand"><b>MALBIT · 말빛</b><small>TOPIK I·II PREP · UNOFFICIAL</small></div>
        <div class="tqBubble">${ml('오늘도 한 문제씩, 한국어를 더 가깝게.','今日も一問ずつ、韓国語をもっと身近に。','One question at a time, closer to Korean.','每天一道题，更接近韩语。')}</div>
        <div class="tqHeroFoot"><b>${ml('원하는 방식으로 바로 시작하세요','好きな方法ですぐ始めよう','Choose your way to practice','选择你的练习方式')}</b><small>TOPIK I · II · SHORTS · RANDOM PRACTICE</small></div>
      </section>
      <div class="tqModeGrid">
        <button class="tqMode exam" onclick="setView('realSetup')"><div class="fakeArt"><span>🎧📝</span></div><div class="copy"><b>${tr('real')}</b><small>${ml('실제 시험 형식으로 집중 연습','本番形式で集中練習','Real exam practice','真实考试练习')}</small></div></button>
        <button class="tqMode game" onclick="setView('game')"><div class="fakeArt"><span>⚔️👾</span></div><div class="copy"><b>${ml('게임모드','ゲームモード','Game Mode','游戏模式')}</b><small>${ml('몬스터를 물리치며 재미있게 학습','モンスターを倒して楽しく学習','Defeat monsters and learn','击败怪物趣味学习')}</small></div></button>
        <button class="tqMode inf" onclick="window.startShorts?startShorts():setView('home')"><div class="fakeArt"><span>🐱⚡</span></div><div class="copy"><b>${ml('숏츠 모드','ショーツモード','Shorts Mode','短题模式')}</b><small>${ml('단어·어휘·문법 초스피드 퀴즈','単語・語彙・文法の超高速クイズ','Rapid vocab and grammar quiz','单词词汇语法极速测验')}</small></div></button>
      </div>
      <div class="tqSectionHead"><b>${ml('빠른 연습','クイック練習','Quick Practice','快速练习')}</b><span>TRAINING</span></div>
      <div class="tqQuick">
        <button onclick="setView('speaking')"><i>🎙</i><b>${ml('말하기 연습','スピーキング','Speaking','口语')}</b><small>${ml('읽기·따라하기·발음 점수','音読・シャドーイング','Read, shadow, score','朗读、跟读、评分')}</small></button>
        <button onclick="setView('review')"><i>↻</i><b>${tr('review')}</b><small>${ml('틀린 문제를 다시 풀어보기','間違えた問題を復習','Review missed questions','复习错题')}</small></button>
      </div>`;
  };

  // ---------- unified More page: listening studio is part of the same app ----------
  morePage=function(sc){
    navActive('more');
    sc.innerHTML=`
      <div class="sectionTitle"><h2>${tr('more')}</h2><span>MALBIT · 말빛</span></div>
      <div class="modeGrid">
        <button class="modeCard wideCard" onclick="setView('devStudio')"><div class="modeIcon">🎙</div><div><b>${ml('듣기 제작실','リスニング制作室','Listening Studio','听力制作室')} <span class="tqStudioBadge">UPLOAD</span></b><p>${ml('문항별 녹음·미리듣기·GitHub 업로드/교체. 업로드 권한은 연결된 개발자 토큰이 있을 때만 활성화됩니다.','問題ごとの録音・試聴・GitHubアップロード。書き込み権限は開発者トークン接続時のみ有効です。','Record, preview, and replace question audio. Write access requires a connected developer token.','逐题录音、试听并上传替换，写入需要开发者令牌。')}</p></div></button>
        <button class="modeCard wideCard" onclick="resetAll()"><div class="modeIcon">↺</div><div><b>${ml('진행 초기화','進行状況を初期化','Reset progress','重置进度')}</b><p>${ml('기기에 저장된 스테이지·오답·단어장 기록을 삭제합니다.','端末に保存された記録を削除します。','Delete saved progress on this device.','删除本机保存的进度。')}</p></div></button>
      </div>`;
  };

  // ---------- integrated listening studio ----------
  developerStudio=function(sc){
    navActive('more');
    const linked=!!ghToken();
    const rows=LS.map(q=>{
      const x=devBlobs[q.id];
      const st=devUploadStatus[q.id];
      let actions=`<button onclick="playUploadedDevAudio(${q.id})">▶ 현재 음성</button>`;
      if(devRecordingId===q.id&&devRecorder?.state==='recording'){
        actions+=`<button id="devRec_${q.id}" onclick="toggleDevRecord(${q.id})" style="background:#6d2431">■ 종료</button>`;
      }else{
        actions+=`<button id="devRec_${q.id}" onclick="toggleDevRecord(${q.id})">🎙 ${x?'다시 녹음':'녹음'}</button>`;
        if(x){
          actions+=`<button onclick="playDevRecordingPreview(${q.id})">▶ 내 녹음</button>`;
          actions+=`<button onclick="uploadDevRecording(${q.id})" ${st?.state==='uploading'?'disabled':''}>${st?.state==='uploading'?'⏳ 업로드 중':st?.state==='done'?'↻ 다시 교체':'⬆ 업로드/교체'}</button>`;
        }
      }
      const status=st?`<div style="font-size:9px;margin-top:6px;color:${st.state==='error'?'#ff8a9d':st.state==='done'?'#65d6ac':'#9eb3cf'}">${st.text}${st.path?` · ${st.path}`:''}</div>`:'';
      return `<div class="devRow"><b>Q${String(q.id).padStart(3,'0')} · ${q.id<=20?'1 PLAY':'SCRIPT'}</b><p>${esc(q.script||'')}</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${actions}</div>${status}</div>`;
    }).join('');

    sc.innerHTML=`
      <div class="sectionTitle"><h2>🎙 ${ml('듣기 제작실','リスニング制作室','Listening Studio','听力制作室')}</h2><span>${linked?'CONNECTED':'SETUP'}</span></div>
      <div class="devBanner">${ml('일반 앱과 같은 화면 안에서 제작합니다. 녹음 → 내 녹음 확인 → 업로드/교체 순서로 사용하세요.','通常アプリ内で制作します。録音→試聴→アップロード/置換の順です。','Built into the same app. Record, preview, then upload/replace.','与普通应用合并。录音、试听后上传/替换。')}</div>
      <div class="infoCard"><h3>🔑 GitHub 자동 업로드</h3>${linked?
        `<p>✓ 이 기기에 연결이 저장되어 있습니다. 토큰을 다시 만들거나 입력할 필요가 없습니다.</p><button class="primary alt" onclick="clearDevGithubToken()">연결 해제</button>`:
        `<p>최초 한 번만 설정합니다. <b>topik-quest</b> 저장소의 Contents: Read and write 권한 토큰을 연결하면 이후 자동 복구됩니다.</p><input id="devGhToken" type="password" autocomplete="off" placeholder="github_pat_..." style="width:100%;padding:13px;border-radius:13px;border:1px solid #314663;background:#0c192b;color:#fff;margin:8px 0"><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button class="primary alt" onclick="openGithubTokenSetup()">GitHub 권한 만들기</button><button class="primary" onclick="saveDevGithubToken()">최초 1회 연결</button></div>`}
      </div>
      <div class="infoCard"><h3>🎙 녹음 방식</h3><p>첫 녹음에서 마이크 권한을 한 번 요청하고, 제작실을 사용하는 동안 같은 마이크 연결을 계속 재사용합니다. 업로드된 음원과 내 녹음은 실제 플레이와 동일하게 약간 크게 재생됩니다.</p></div>
      <div>${rows}</div>`;
  };

  // release mic only when leaving studio; keep original setView behavior otherwise.
  const baseSetView=setView;
  setView=function(v){
    if(S.view==='devStudio'&&v!=='devStudio')releaseMic();
    return baseSetView(v);
  };
  window.addEventListener('pagehide',()=>{stopDevPreview();releaseMic()});

  restoreDevToken().finally(()=>{
    // Important: index.html renders before this patch loads, so force the current view to re-render.
    if(typeof S!=='undefined'&&(S.view==='home'||S.view==='more'||S.view==='devStudio'))setTimeout(()=>render(),0);
  });
})();
