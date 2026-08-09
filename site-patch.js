// TOPIK QUEST hot-patch layer.
// Developer Listening Studio: record -> stop -> upload directly to GitHub.
(function(){
  'use strict';
  const GH_OWNER='okometsbu-beep';
  const GH_REPO='topik-quest';
  const GH_BRANCH='main';
  const TOKEN_KEY='topikQuestDevGithubToken';
  window.devUploadStatus=window.devUploadStatus||{};

  function ghToken(){return (localStorage.getItem(TOKEN_KEY)||'').trim()}
  window.saveDevGithubToken=function(){
    const el=document.getElementById('devGhToken');
    const token=(el?.value||'').trim();
    if(!token){toast('GitHub token을 입력해 주세요.');return}
    localStorage.setItem(TOKEN_KEY,token);
    if(el)el.value='';
    toast('이 기기에 GitHub 업로드 권한을 저장했습니다.');
    render();
  };
  window.clearDevGithubToken=function(){
    localStorage.removeItem(TOKEN_KEY);
    toast('GitHub 업로드 연결을 해제했습니다.');
    render();
  };
  window.openGithubTokenSetup=function(){
    window.open('https://github.com/settings/personal-access-tokens/new','_blank');
  };

  function ghHeaders(token){return {
    'Accept':'application/vnd.github+json',
    'Authorization':'Bearer '+token,
    'X-GitHub-Api-Version':'2026-03-10'
  }}
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
    if(!r.ok){let msg='';try{msg=(await r.json()).message||''}catch(e){};throw new Error(msg||`GitHub GET ${r.status}`)}
    return await r.json();
  }
  window.uploadDevRecording=async function(id){
    const x=devBlobs[id];
    if(!x){toast('먼저 이 문항을 녹음해 주세요.');return}
    const token=ghToken();
    if(!token){toast('먼저 위에서 GitHub 업로드 권한을 연결해 주세요.');document.getElementById('devGhToken')?.focus();return}
    const q=String(id).padStart(3,'0');
    const path=`audio/topik2/q${q}.${x.ext}`;
    devUploadStatus[id]={state:'uploading',text:'업로드 중…'};
    render();
    try{
      const old=await currentGithubFile(path,token);
      const content=await blobBase64(x.blob);
      const body={message:`Upload TOPIK II listening Q${q} recording`,content,branch:GH_BRANCH};
      if(old?.sha)body.sha=old.sha;
      const r=await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,{
        method:'PUT',headers:{...ghHeaders(token),'Content-Type':'application/json'},body:JSON.stringify(body)
      });
      let data={};try{data=await r.json()}catch(e){}
      if(!r.ok)throw new Error(data.message||`GitHub PUT ${r.status}`);
      devUploadStatus[id]={state:'done',text:'업로드 완료',path,commit:data?.commit?.sha||''};
      toast(`Q${q} 업로드 완료`);
      render();
    }catch(e){
      console.error(e);
      devUploadStatus[id]={state:'error',text:'업로드 실패'};
      const msg=String(e?.message||e);
      if(/401|Bad credentials|Requires authentication/i.test(msg)){
        localStorage.removeItem(TOKEN_KEY);
        toast('GitHub 권한이 만료되었거나 잘못되었습니다. 다시 연결해 주세요.');
      }else if(/403|permission|Resource not accessible/i.test(msg)){
        toast('GitHub token의 Contents 쓰기 권한을 확인해 주세요.');
      }else toast('업로드 실패: '+msg.slice(0,100));
      render();
    }
  };

  window.developerStudio=function(sc){
    navActive('more');
    const linked=!!ghToken();
    const rows=LS.map(q=>{
      const x=devBlobs[q.id];
      const st=devUploadStatus[q.id];
      let action='';
      if(devRecordingId===q.id&&devRecorder?.state==='recording'){
        action=`<button id="devRec_${q.id}" onclick="toggleDevRecord(${q.id})" style="background:#6d2431;color:#fff">■ 종료</button>`;
      }else{
        action=`<button id="devRec_${q.id}" onclick="toggleDevRecord(${q.id})">🎙 녹음</button>`;
        if(x) action+=`<button onclick="uploadDevRecording(${q.id})" ${st?.state==='uploading'?'disabled':''} style="${st?.state==='done'?'background:#143d31;border-color:#2c8a69;color:#d9fff1':''}">${st?.state==='uploading'?'⏳ 업로드 중':st?.state==='done'?'✓ 업로드됨':'⬆ 업로드'}</button>`;
      }
      const status=st?`<div style="font-size:9px;margin-top:5px;color:${st.state==='error'?'#ff8a9d':st.state==='done'?'#65d6ac':'#9eb3cf'}">${st.text}${st.path?` · ${st.path}`:''}</div>`:'';
      return `<div class="devRow" style="grid-template-columns:48px 1fr;align-items:start"><div><b>Q${String(q.id).padStart(3,'0')}</b></div><div><b>${q.id<=20?'1 PLAY':'SCRIPT'}</b><p style="white-space:pre-wrap">${esc(q.script||'')}</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><button onclick="playListening(${q.id},false)">▶ 듣기</button>${action}</div>${status}</div></div>`;
    }).join('');
    sc.innerHTML=`
      <div class="sectionTitle"><h2>🔒 Developer Listening Studio</h2><span>DEV ONLY</span></div>
      <div class="devBanner">${ml('이 화면은 개발용입니다. 녹음 후 다운로드 과정 없이 각 문항에서 바로 GitHub로 업로드합니다.','開発用画面です。録音後、ダウンロードせず各問題から直接GitHubへアップロードします。','Developer-only studio. Record and upload each item directly to GitHub without downloading files.','开发者页面。录音后无需下载，直接逐题上传到 GitHub。')}</div>
      <div class="infoCard"><h3>🔑 GitHub 자동 업로드 연결</h3>
        ${linked?
          `<p>✓ 이 기기에 업로드 권한이 연결되어 있습니다.</p><button class="primary alt" onclick="clearDevGithubToken()">연결 해제</button>`:
          `<p>처음 한 번만 fine-grained GitHub token을 입력하면 이후에는 각 문항의 <b>⬆ 업로드</b> 버튼만 누르면 됩니다. 토큰은 이 기기의 브라우저에만 저장됩니다.</p><input id="devGhToken" type="password" autocomplete="off" placeholder="github_pat_..." style="width:100%;padding:13px;border-radius:13px;border:1px solid #314663;background:#0c192b;color:#fff;margin:8px 0"><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button class="primary alt" onclick="openGithubTokenSetup()">GitHub 권한 만들기</button><button class="primary" onclick="saveDevGithubToken()">이 기기에 연결</button></div><p style="margin-top:8px;font-size:9px">권한 범위: 이 저장소(topik-quest)만 선택 · Repository permissions → Contents: Read and write.</p>`}
      </div>
      <div class="infoCard"><h3>🎙 새 작업 방식</h3><p><b>1.</b> 🎙 녹음 → <b>2.</b> ■ 종료 → <b>3.</b> ⬆ 업로드. 파일 이름과 경로는 앱이 자동으로 정합니다. 별도 다운로드나 GitHub 파일 선택 과정은 없습니다.</p></div>
      <div>${rows}</div>`;
  };

  // Keep the existing recorder, but change the completion message and refresh the new UI.
  const originalToggle=window.toggleDevRecord;
  window.toggleDevRecord=async function(id){
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('MediaRecorder unavailable');return}
    if(devRecorder&&devRecorder.state==='recording'){
      if(devRecordingId!==id){toast(ml('먼저 현재 녹음을 종료하세요.','先に現在の録音を終了してください。','Stop the current recording first.','请先结束当前录音。'));return}
      devRecorder.stop();return;
    }
    try{
      devStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      const types=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'];
      const mime=types.find(t=>MediaRecorder.isTypeSupported?.(t))||'';
      devChunks=[];devRecordingId=id;
      devRecorder=new MediaRecorder(devStream,mime?{mimeType:mime}:undefined);
      const b=document.getElementById('devRec_'+id);if(b){b.textContent='■ 종료';b.style.background='#6d2431';b.style.color='#fff'}
      devRecorder.ondataavailable=e=>{if(e.data?.size)devChunks.push(e.data)};
      devRecorder.onstop=()=>{
        const type=devRecorder.mimeType||mime||'audio/webm';
        const ext=type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm';
        const blob=new Blob(devChunks,{type});
        const url=URL.createObjectURL(blob);
        if(devBlobs[id]?.url)try{URL.revokeObjectURL(devBlobs[id].url)}catch(e){}
        devBlobs[id]={blob,url,ext};
        devUploadStatus[id]={state:'ready',text:'녹음 완료 · 업로드 대기'};
        try{devStream?.getTracks().forEach(t=>t.stop())}catch(e){}
        devStream=null;devRecorder=null;devRecordingId=null;
        toast(ml('녹음 완료. 바로 업로드할 수 있습니다.','録音完了。すぐアップロードできます。','Recording complete. Ready to upload.','录音完成，可以直接上传。'));
        render();
      };
      devRecorder.start();
      render();
    }catch(e){console.error(e);toast(ml('마이크 권한을 확인해 주세요.','マイク権限を確認してください。','Check microphone permission.','请检查麦克风权限。'))}
  };

  if(window.S?.view==='devStudio')setTimeout(()=>render(),0);
})();
