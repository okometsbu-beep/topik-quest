// MALBIT durable progress guard v1
(function(){
  'use strict';

  const SNAPSHOT_KEY='malbitRecoverySnapshotV1';
  const DURABLE_KEYS=Object.freeze([
    'topikQuestV8',
    'topikQuestExamLevel',
    'topikQuestShortsV1',
    'topikQuestTopik1GameV1',
    'malbitWrongReviewV3',
    'malbitLearningEventsV1',
    'malbitProductPrefsV1',
    'malbitOnboardingV1',
    'malbitBeginnerV1',
    'malbitStoryV1',
    'malbitTtsPrefsV1',
    'malbitDiagnosticV1',
    'malbitJourneyEventsV1',
    'malbitGrowthPrefsV1',
    'malbitInstallIdV1'
  ]);
  const PREFIXES=Object.freeze(['malbitBankRecent:','malbitBankAnswerSlot:','malbitNextMockSet:']);

  function readSnapshot(){
    try{
      const value=JSON.parse(localStorage.getItem(SNAPSHOT_KEY)||'null');
      return value?.schema===1&&value.storage&&typeof value.storage==='object'?value:null;
    }catch(error){return null}
  }
  function safeCore(raw){
    try{
      const value=JSON.parse(raw);
      if(!value||typeof value!=='object'||Array.isArray(value))return null;
      const copy={...value};
      delete copy.transCache;
      return JSON.stringify(copy);
    }catch(error){return null}
  }
  function coreWeight(raw){
    try{
      const value=JSON.parse(raw),count=entry=>entry&&typeof entry==='object'?Object.keys(entry).length:0;
      return (Array.isArray(value?.vocab)?value.vocab.length*20:0)
        +Math.max(0,Number(value?.gameUnlock||1)-1)
        +count(value?.gameAnswers)+count(value?.writing)+count(value?.rwAnswers)+count(value?.lsAnswers)
        +count(value?.realAnswers?.listen)+count(value?.realAnswers?.read)
        +(value?.infinity?1:0);
    }catch(error){return -1}
  }
  function trackedKeys(){
    const keys=new Set(DURABLE_KEYS);
    try{
      for(let index=0;index<localStorage.length;index++){
        const key=localStorage.key(index);
        if(PREFIXES.some(prefix=>String(key||'').startsWith(prefix)))keys.add(key);
      }
    }catch(error){}
    return [...keys];
  }
  function capture(reason){
    const previous=readSnapshot(),storage={...(previous?.storage||{})};
    for(const key of trackedKeys()){
      try{
        const value=localStorage.getItem(key);
        if(value==null)continue;
        const safe=key==='topikQuestV8'?safeCore(value):value;
        if(safe!=null)storage[key]=safe;
      }catch(error){}
    }
    try{
      localStorage.setItem(SNAPSHOT_KEY,JSON.stringify({schema:1,capturedAt:new Date().toISOString(),reason:String(reason||'auto'),storage}));
      return true;
    }catch(error){return false}
  }
  function restore(){
    const snapshot=readSnapshot();
    if(!snapshot)return[];
    const restored=[];
    for(const [key,value] of Object.entries(snapshot.storage)){
      if(!DURABLE_KEYS.includes(key)&&!PREFIXES.some(prefix=>key.startsWith(prefix)))continue;
      try{
        const current=localStorage.getItem(key);
        const missing=current==null;
        const broken=key==='topikQuestV8'&&safeCore(current)==null;
        const suspiciousCore=key==='topikQuestV8'&&coreWeight(current)===0&&coreWeight(value)>0;
        if(missing||broken||suspiciousCore){
          localStorage.setItem(key,String(value));
          restored.push(key);
        }
      }catch(error){}
    }
    if(restored.includes('topikQuestV8')){
      try{if(typeof S==='object')Object.assign(S,JSON.parse(localStorage.getItem('topikQuestV8')||'{}'))}catch(error){}
    }
    return restored;
  }
  function clear(){
    try{localStorage.removeItem(SNAPSHOT_KEY)}catch(error){}
  }

  const restored=restore();
  capture(restored.length?'recovered':'startup');
  window.MALBIT_STORAGE_GUARD=Object.freeze({snapshotKey:SNAPSHOT_KEY,durableKeys:DURABLE_KEYS,capture,restore,clear});
  window.addEventListener?.('pagehide',()=>capture('pagehide'));
  document.addEventListener?.('visibilitychange',()=>{if(document.visibilityState==='hidden')capture('hidden')});
  window.setInterval?.(()=>capture('interval'),20000);
  if(restored.length)console.info('[MALBIT storage] recovered',restored.join(', '));
})();
