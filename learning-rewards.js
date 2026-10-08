// HARUMAL activity rewards. This is a local activity ledger, not a proficiency score.
(function(){
  'use strict';
  const ROOT='harumalRewardsV1',PREFIX='harumalRewardsEvent:';
  const CHANGE_EVENT='harumal:rewards-change';
  const TIERS=Object.freeze({easy:Object.freeze({xp:10,coins:2}),normal:Object.freeze({xp:15,coins:3}),hard:Object.freeze({xp:25,coins:5}),'very-hard':Object.freeze({xp:40,coins:8})});
  const events=new Map(),pending=new Set(),warnings=new Set();
  let lastRoot,observedLength=-1,sequence=0,rootBlocked=false,publishing=false,feedbackXp=0,feedbackCoins=0,feedbackQueued=false;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(ko,ja,en,zh)=>[ko,ja,en,zh][{ko:0,ja:1,en:2,zh:3}[typeof S==='object'?S.lang:'ko']??0];
  const validToken=value=>(typeof value==='string'||typeof value==='number')&&String(value).length>0&&String(value).length<=2048;
  const eventKey=id=>PREFIX+encodeURIComponent(id);
  function warn(reason){warnings.add(reason)}
  function read(key){try{return localStorage.getItem(key)}catch(error){warn('read');return undefined}}
  function length(){try{return localStorage.length}catch(error){warn('read');return -1}}
  function validEvent(value){
    if(!value||typeof value!=='object'||Array.isArray(value)||!validToken(value.id))return false;
    if(!['answer','stage','credit','debit'].includes(value.kind))return false;
    if(!Number.isSafeInteger(value.xp)||!Number.isSafeInteger(value.coins)||Math.abs(value.xp)>1000000||Math.abs(value.coins)>1000000)return false;
    // Reserved for a future, separately authorized shop. There is no debit action in this API.
    return value.kind==='debit'?value.xp===0&&value.coins<=0:value.xp>=0&&value.coins>=0;
  }
  function decodeEvent(raw,key){
    try{const value=JSON.parse(raw);if(!validEvent(value)||(key&&eventKey(value.id)!==key))throw new Error('event');return value}catch(error){warn('corrupt');return null}
  }
  function decodeRoot(raw,strict=false){
    try{
      const value=typeof raw==='string'?JSON.parse(raw):raw;
      if(!value||value.schema!==1||!Array.isArray(value.events)||!value.events.every(validEvent))throw new Error('root');
      return value;
    }catch(error){if(strict)throw new Error('Invalid HARUMAL reward backup');warn('corrupt');return null}
  }
  function merge(list){let changed=false;for(const value of list){const id=String(value.id);if(!events.has(id)){events.set(id,{...value,id});pending.add(id);changed=true}}return changed}
  function refresh(force=false){
    let changed=false;warnings.delete('read');
    const raw=read(ROOT);
    if(force||raw!==lastRoot){
      lastRoot=raw;rootBlocked=false;
      if(raw!=null){const root=decodeRoot(raw);if(root)changed=merge(root.events)||changed;else rootBlocked=true}
    }
    const count=length();
    if(force||count!==observedLength){
      try{
        for(let i=0;i<localStorage.length;i++){
          const key=localStorage.key(i);if(!String(key||'').startsWith(PREFIX))continue;
          const rawEvent=read(key);if(rawEvent==null)continue;
          const event=decodeEvent(rawEvent,key);if(!event)continue;
          // Per-event records are the durable truth, including after an old backup overwrites the root cache.
          const previous=events.get(String(event.id));
          if(!previous||JSON.stringify(previous)!==JSON.stringify(event)){events.set(String(event.id),event);changed=true}
          pending.delete(String(event.id));
        }
      }catch(error){warn('read')}
      observedLength=length();
    }
    return changed;
  }
  function levelInfo(value){
    const numeric=Number(value),xp=Number.isFinite(numeric)?Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(numeric))):0;
    const level=Math.max(1,Math.floor((1+Math.sqrt(1+4*xp/50))/2));
    const currentThreshold=50*(level-1)*level,nextThreshold=50*level*(level+1);
    return {level,xp,currentThreshold,nextThreshold,currentXp:xp-currentThreshold,nextXp:nextThreshold-currentThreshold,remaining:Math.max(0,nextThreshold-xp),progress:Math.max(0,Math.min(1,(xp-currentThreshold)/(nextThreshold-currentThreshold)))};
  }
  function warningText(){
    if(pending.size||warnings.has('read'))return text('보상 일부를 이 브라우저에 저장하지 못했어요. 새로고침 전에 설정에서 진행 파일을 내보내세요.','報酬の一部を保存できませんでした。再読み込み前に設定から進行ファイルを書き出してください。','Some rewards could not be saved in this browser. Export progress in Settings before reloading.','部分奖励未能保存到此浏览器。刷新前请在设置中导出进度。');
    if(warnings.size)return text('보상 저장소 일부를 읽거나 갱신하지 못했어요. 남아 있는 기록은 보존했어요. 설정에서 진행 파일을 백업하세요.','報酬の保存領域の一部を読み取り・更新できませんでした。残っている記録は保持しています。設定からバックアップしてください。','Part of reward storage could not be read or updated. Remaining records were kept. Back up progress in Settings.','部分奖励记录无法读取或更新，现有记录已保留。请在设置中备份进度。');
    return '';
  }
  function snapshot(){
    const list=[...events.values()].sort((a,b)=>String(a.id).localeCompare(String(b.id)));
    const totals=list.reduce((sum,event)=>({xp:sum.xp+event.xp,coins:sum.coins+event.coins}),{xp:0,coins:0});
    return {schema:1,...totals,level:levelInfo(totals.xp).level,events:list.map(event=>({...event})),pendingCount:pending.size,storageWarning:warningText()};
  }
  function writeEvent(event){
    const key=eventKey(event.id),existing=read(key);
    if(existing!==null&&existing!==undefined){
      const saved=decodeEvent(existing,key);if(!saved)return false;
      events.set(String(saved.id),saved);pending.delete(String(saved.id));return true;
    }
    if(existing===undefined)return false;
    try{localStorage.setItem(key,JSON.stringify(event));pending.delete(String(event.id));return true}catch(error){warn('write');return false}
  }
  function writeRoot(){
    if(rootBlocked)return false;
    try{const state=snapshot();lastRoot=JSON.stringify({schema:1,xp:state.xp,coins:state.coins,events:state.events});localStorage.setItem(ROOT,lastRoot);return true}catch(error){lastRoot=undefined;warn('write');return false}
  }
  function persist(){
    refresh();
    // Also materialize events imported from older backups before updating the replaceable cache.
    let allEventsSaved=true;
    for(const event of events.values())if(!writeEvent(event)){pending.add(String(event.id));allEventsSaved=false}
    const rootSaved=writeRoot();
    // A replaceable root is not enough: a racing tab can overwrite it. Keep failed immutable writes pending.
    if(rootSaved&&allEventsSaved)warnings.delete('write');
    observedLength=length();
    return rootSaved;
  }
  function renderStatus(){
    refresh();const state=snapshot(),info=levelInfo(state.xp),warning=state.storageWarning;
    return `<section class="harumalRewardsStatus" aria-label="${esc(text('학습 활동 보상','学習活動の報酬','Learning activity rewards','学习活动奖励'))}"><div class="harumalRewardsTotals"><b>${text('활동 레벨','活動レベル','Activity level','活动等级')} ${info.level}</b><span>${state.xp} XP</span><span>${text('코인','コイン','Coins','金币')} ${state.coins}</span></div><progress max="${info.nextXp}" value="${info.currentXp}" aria-label="${esc(text('다음 활동 레벨까지','次の活動レベルまで','Progress to the next activity level','距下一个活动等级'))}"></progress><small>${text('다음 레벨까지','次のレベルまで','To next level:','距下一级：')} ${info.remaining} XP · ${info.currentXp}/${info.nextXp}</small><small class="harumalRewardsDisclosure">${text('활동 기록이며 한국어 실력·TOPIK 등급 인증이 아니에요. 이 브라우저에만 저장돼요.','活動の記録であり、韓国語力・TOPIK級の認定ではありません。このブラウザにのみ保存されます。','An activity record, not a Korean proficiency or TOPIK certification. Saved only in this browser.','这是活动记录，并非韩语能力或TOPIK等级认证。仅保存在此浏览器。')}</small>${warning?`<p class="harumalRewardsWarning" role="status">${esc(warning)}</p>`:''}</section>`;
  }
  function publish(){
    if(publishing)return;publishing=true;
    try{
      document.querySelectorAll?.('.harumalRewardsStatus').forEach(node=>{node.outerHTML=renderStatus()});
      const warning=warningText();let banner=document.getElementById?.('harumalRewardsStorageWarning');
      if(warning&&!banner&&document.body&&document.createElement){banner=document.createElement('p');banner.id='harumalRewardsStorageWarning';banner.className='harumalRewardsWarning harumalRewardsStorageBanner';banner.setAttribute('role','status');document.body.appendChild(banner)}
      if(banner){banner.textContent=warning;banner.hidden=!warning}
      if(typeof CustomEvent==='function')window.dispatchEvent?.(new CustomEvent(CHANGE_EVENT,{detail:snapshot()}));
    }finally{publishing=false}
  }
  function difficulty(question){
    const raw=String(question?.difficulty??'').toLowerCase().replaceAll('_','-');
    if(raw==='medium'||raw==='normal')return 'normal';
    if(Object.prototype.hasOwnProperty.call(TIERS,raw))return raw;
    const rank=Number(question?.difficultyRank);return [null,'easy','normal','hard','very-hard'][rank]||'normal';
  }
  function newSession(source){
    const name=validToken(source)?String(source):'activity';
    const random=window.crypto?.randomUUID?.()||`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${++sequence}`;
    return `${name}:${random}`;
  }
  function announce(event){
    feedbackXp+=event.xp;feedbackCoins+=event.coins;
    if(feedbackQueued)return;feedbackQueued=true;
    const show=()=>{const message=`+${feedbackXp} XP · +${feedbackCoins} ${text('코인','コイン','coins','金币')}`;feedbackXp=0;feedbackCoins=0;feedbackQueued=false;if(typeof window.toast==='function')window.toast(message)};
    // Coalesce a task answer and its stage bonus, and run after the caller's normal answer feedback.
    if(typeof window.queueMicrotask==='function')window.queueMicrotask(show);else if(typeof window.setTimeout==='function')window.setTimeout(show,0);else show();
  }
  function award(event){
    refresh();const before=events.get(event.id);
    if(before){if(pending.has(event.id)){persist();publish()}return {awarded:false,duplicate:true,xp:0,coins:0,event:{...before},persisted:!pending.has(event.id)}}
    events.set(event.id,event);pending.add(event.id);persist();publish();announce(events.get(event.id));
    const saved=events.get(event.id);return {awarded:true,duplicate:false,xp:saved.xp,coins:saved.coins,event:{...saved},persisted:!pending.has(event.id)};
  }
  function answer(options={}){
    const {source,sessionId,slot,question,correct,assisted}=options;
    if(correct!==true)return {awarded:false,reason:'incorrect',xp:0,coins:0};
    if(!validToken(source)||!validToken(sessionId)||!validToken(slot))return {awarded:false,reason:'missing-identity',xp:0,coins:0};
    const tier=difficulty(question),reward=TIERS[tier];
    return award({id:JSON.stringify(['answer',String(source),String(sessionId),String(slot)]),kind:'answer',source:String(source),sessionId:String(sessionId),slot:String(slot),questionId:String(question?.bankId??question?.sourceId??question?.id??''),difficulty:tier,assisted:assisted===true,...reward,createdAt:new Date().toISOString()});
  }
  function stage(options={}){
    const {source,sessionId,stageId,phase,assisted}=options;
    if(!validToken(source)||!validToken(sessionId)||!validToken(stageId)||!['learn','transfer'].includes(phase))return {awarded:false,reason:'missing-identity',xp:0,coins:0};
    const reward=phase==='transfer'?{xp:30,coins:6}:{xp:20,coins:4};
    return award({id:JSON.stringify(['stage',String(source),String(sessionId),String(stageId),phase]),kind:'stage',source:String(source),sessionId:String(sessionId),stageId:String(stageId),phase,difficulty:difficulty({difficulty:options.difficulty}),assisted:assisted===true,...reward,createdAt:new Date().toISOString()});
  }
  function exportState(){refresh(true);persist();const state=snapshot();return JSON.stringify({schema:1,xp:state.xp,coins:state.coins,events:state.events})}
  function mergeImport(raw){const incoming=decodeRoot(raw,true);refresh(true);merge(incoming.events);persist();publish();return exportState()}
  function reset(){
    const keys=[];try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(String(key||'').startsWith(PREFIX))keys.push(key)}for(const key of keys)localStorage.removeItem(key);localStorage.removeItem(ROOT)}catch(error){warn('write');publish();return false}
    events.clear();pending.clear();warnings.clear();lastRoot=null;rootBlocked=false;observedLength=length();publish();return true;
  }
  function onStorage(event){
    if(event.storageArea&&event.storageArea!==localStorage)return;
    if(event.key===null||(event.key===ROOT&&event.newValue===null)){
      events.clear();pending.clear();lastRoot=undefined;observedLength=-1;refresh(true);publish();return;
    }
    if(event.key===ROOT||String(event.key||'').startsWith(PREFIX)){refresh(true);publish()}
  }
  function installStyle(){
    if(!document.head||!document.createElement||document.getElementById?.('harumalRewardsStyle'))return;
    const style=document.createElement('style');style.id='harumalRewardsStyle';style.textContent='.harumalRewardsStatus{margin:12px 0;padding:13px 15px;border:1px solid var(--ui-border,#d8e2e8);border-radius:16px;background:var(--ui-surface,#fff);color:var(--ui-ink,#243c42);font-size:13px}.harumalRewardsTotals{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.harumalRewardsTotals b{margin-right:auto}.harumalRewardsStatus progress{display:block;width:100%;height:8px;margin:9px 0 5px;accent-color:#207e70}.harumalRewardsStatus small{display:block;font-size:11px;line-height:1.5}.harumalRewardsDisclosure{margin-top:5px;opacity:.78}.harumalRewardsWarning{font-size:12px;line-height:1.5;border:1px solid #b36a24;background:#fff2d9;color:#693b13;border-radius:9px;padding:10px;margin:8px 0 0}.harumalRewardsStorageBanner{position:fixed;z-index:10001;bottom:82px;left:12px;right:12px;max-width:640px;margin:0 auto;box-shadow:0 3px 15px #0002}.harumalRewardsStorageBanner[hidden]{display:none}';document.head.appendChild(style);
  }
  refresh(true);if(pending.size)persist();
  window.HARUMAL_REWARDS=Object.freeze({rootKey:ROOT,eventPrefix:PREFIX,changeEvent:CHANGE_EVENT,tiers:TIERS,newSession,answer,stage,getState:()=>{refresh();return snapshot()},levelInfo,renderStatus,validateImport:raw=>{decodeRoot(raw,true);return true},mergeImport,exportState,reset});
  installStyle();window.addEventListener?.('storage',onStorage);
  window.addEventListener?.('pageshow',()=>{refresh(true);publish()});
  if(warnings.size)publish();
})();
