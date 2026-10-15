// Area-specific quick practice, using the existing question, answer, review and reward engines.
(function(){
'use strict';
const TYPES={listening:'listen',reading:'read',writing:'write'};
const T1_KEY='topikQuestTopik1Session';
const MOCKS=Object.freeze({
  1:Object.freeze({listening:Object.freeze({count:30,minutes:40}),reading:Object.freeze({count:40,minutes:60}),full:Object.freeze({count:70,minutes:100})}),
  2:Object.freeze({listening:Object.freeze({count:50,minutes:60}),reading:Object.freeze({count:50,minutes:70}),writing:Object.freeze({count:4,minutes:50}),full:Object.freeze({count:104,minutes:180})})
});
function state(){return typeof S!=='undefined'?S:null}
function L(ko,ja,en,zh){return[ko,ja,en,zh][{ko:0,ja:1,en:2,zh:3}[state()?.lang]??0]}
function normalizeLevel(value){return value===1||value==='1'||value==='I'||value==='topik1'?1:value===2||value==='2'||value==='II'||value==='topik2'?2:null}
function storedT1(){try{return JSON.parse(localStorage.getItem(T1_KEY)||'null')}catch(error){return null}}
function persist(){window.save?.()}
function setExamPreference(level){try{localStorage.setItem('topikQuestExamLevel',String(level))}catch(error){}}
function areaName(area){return area==='listening'?L('듣기','聴解','Listening','听力'):area==='reading'?L('읽기','読解','Reading','阅读'):area==='writing'?L('쓰기','作文','Writing','写作'):L('전체','全体','Full exam','全套')}
function getActive(){
  const s=state();if(!s)return null;
  if(['t1quiz','t1result'].includes(s.view)){
    const q=storedT1(),meta=q?.practiceSession;if(!meta)return null;
    return {...meta,answered:q.mode==='real'?Object.keys(q.answers||{}).length:Number(q.total)||0,total:meta.size,position:q.mode==='real'?Number(q.i)+1:Math.min(meta.size,(Number(q.total)||0)+(q.locked?0:1)),completed:!!q.result};
  }
  const q=s.view==='infinity'?s.infinity:s.view==='real'?s.real:null,meta=q?.practiceSession;if(!meta)return null;
  const phase=s.real?.phase,position=meta.mode==='random'?Math.min(meta.size,(Number(q.count)||0)+(q.feedback?0:1)):phase==='write'?q.id-50: q.id;
  return {...meta,answered:meta.mode==='random'?Number(q.count)||0:undefined,total:meta.size,position,completed:meta.mode==='mock'?q.active===false:!!meta.completed};
}
function shuffled(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function randomPool(level,area){
  const rows=window.MALBIT_BANK?.filter({level,sections:[area],mcqOnly:area!=='writing',noVisual:area!=='writing'})||[];
  return rows.filter(q=>area!=='writing'||(Number(q.no)>=51&&Number(q.no)<=54));
}
function startRandom(level,area){
  level=normalizeLevel(level);if(!level)return false;
  // No area remains the original unlimited, mixed practice entry point.
  if(area==null){setExamPreference(level);return window.startRandomPractice?.(level)}
  if(!TYPES[area]||(level===1&&area==='writing'))return false;
  const pool=randomPool(level,area);if(!pool.length)return false;
  setExamPreference(level);window.stopTimer?.();window.stopListeningAudio?.();window.HARUMAL_LISTENING_PLAYER?.cancel();
  if(level===1)return window.t1StartAreaPractice?.(area,10)??false;
  const bank=window.MALBIT_BANK,recent=new Set(bank.readRecent?.(`random:2:${area}`)||[]),fresh=pool.filter(q=>!recent.has(q.id));
  const questionIds=shuffled(fresh.length>=Math.min(10,pool.length)?fresh:pool).slice(0,10).map(q=>q.id);
  const s=state();s.infinity={active:true,rewardSessionId:window.HARUMAL_REWARDS?.newSession('topik2-random'),examLevel:2,count:0,graded:0,correct:0,writing:0,totalSec:0,targetSec:0,last:null,feedback:null,seenIds:[],questionIds,practiceSession:{level:2,mode:'random',area,returnTo:'randomAreas',size:questionIds.length}};
  s.view='infinity';persist();window.nextInfinity();return true;
}
function startMock(level,area='full'){
  level=normalizeLevel(level);const info=MOCKS[level]?.[area];if(!info)return false;
  setExamPreference(level);window.stopTimer?.();window.stopListeningAudio?.();window.HARUMAL_LISTENING_PLAYER?.cancel();
  const meta={level,mode:'mock',area,returnTo:'mockAreas',size:info.count,minutes:info.minutes};
  // Only this confirmed start call creates deadlines; choosing menus never calls an exam engine.
  if(level===1){window.t1Begin(area,{explicitArea:true,practiceSession:meta});return true}
  window.beginReal(area==='full'?'full':TYPES[area],{explicitArea:true});
  const s=state();if(!s?.real)return false;s.real.practiceSession=meta;persist();window.render?.();return true;
}
function back(){
  const meta=getActive();if(!meta)return false;
  window.stopTimer?.();window.stopListeningAudio?.();window.HARUMAL_LISTENING_PLAYER?.cancel();window.closeSheet?.();window.closeResult?.();
  // setView also stops the TOPIK I closure timer, retaining the saved answers for normal resume.
  if(window.HARUMAL_HUB?.openAreas)window.HARUMAL_HUB.openAreas(meta.mode,meta.level);
  else window.setView?.(meta.returnTo);
  return true;
}
function restart(){
  const meta=getActive();if(!meta)return false;window.closeSheet?.();window.closeResult?.();
  if(meta.mode==='mock'&&window.HARUMAL_HUB){window.HARUMAL_HUB.openAreas('mock',meta.level);window.HARUMAL_HUB.selectArea(meta.area);return true}
  return meta.mode==='mock'?false:startRandom(meta.level,meta.area);
}
const baseNext=window.nextInfinity;
if(typeof baseNext==='function'){
  const next=function(){
    const inf=state()?.infinity,meta=inf?.practiceSession;if(meta?.mode!=='random')return baseNext.apply(this,arguments);
    if(Number(inf.count)>=meta.size||meta.completed)return window.finishInfinity();
    // Next is only valid after feedback. Repeated taps cannot skip questions or restart timers.
    if(inf.current&&!inf.feedback)return;
    const item=window.MALBIT_BANK?.byId(inf.questionIds?.[Number(inf.count)||0]);
    if(!item||item.section!==meta.area||(meta.area==='writing'&&(item.no<51||item.no>54)))return window.finishInfinity();
    window.stopTimer?.();window.stopListeningAudio?.();
    const x={type:TYPES[meta.area],id:item.no,bankId:item.id,choiceOrder:meta.area==='writing'?[]:window.MALBIT_BANK.freshOrder(item.id)};
    inf.current=x;inf.last=x;inf.feedback=null;inf.seenIds.push(item.id);delete inf.nextType;
    window.MALBIT_BANK.remember?.(`random:2:${meta.area}`,item.id,480);
    if(meta.area==='writing'){const s=state();s.writing=s.writing||{};s.writing[item.no]=''}
    persist();window.render?.();
  };
  // The legacy listening installer runs after every render. This owner handles explicit areas.
  next.__v33=true;window.nextInfinity=next;
}
const baseFinish=window.finishInfinity;
if(typeof baseFinish==='function')window.finishInfinity=function(){
  const inf=state()?.infinity,meta=inf?.practiceSession;
  if(meta?.mode!=='random')return baseFinish.apply(this,arguments);
  meta.completed=true;window.stopListeningAudio?.();persist();const out=baseFinish.apply(this,arguments);
  const sheet=document.getElementById('sheetBody');
  sheet?.querySelector('.primary')?.setAttribute('onclick','HARUMAL_PRACTICE.restart()');
  sheet?.querySelector('.closeBtn')?.setAttribute('onclick','HARUMAL_PRACTICE.back()');
  return out;
};
// Completed sessions cannot accept a stale submit or timeout after the result is closed.
for(const name of ['submitInfinity','infTimeout']){const base=window[name];if(typeof base==='function')window[name]=function(){if(state()?.infinity?.practiceSession?.completed)return;return base.apply(this,arguments)}}
// The original writing-polish handler lacks a repeat-submit guard. Keep counters truthful.
const baseWriting=window.submitInfinityWriting;
if(typeof baseWriting==='function')window.submitInfinityWriting=function(){if(state()?.infinity?.feedback||state()?.infinity?.practiceSession?.completed)return;return baseWriting.apply(this,arguments)};
const baseExit=window.exitRandomPractice;
if(typeof baseExit==='function')window.exitRandomPractice=function(){return getActive()?.mode==='random'?back():baseExit.apply(this,arguments)};
const baseT1Exit=window.t1ExitRandom;
if(typeof baseT1Exit==='function')window.t1ExitRandom=function(){return getActive()?.mode==='random'?back():baseT1Exit.apply(this,arguments)};
function patchMockResult(){
  const meta=getActive();if(meta?.level!==2||meta.mode!=='mock'||!meta.completed)return;
  const card=document.getElementById('resultCard'),actions=card?.querySelector('.resultActions');if(!actions)return;
  // Legacy result markup arrives after the drum-roll timeout, outside #screen.
  const home=actions.querySelector('button[onclick="closeResult();setView(\'home\')"]');
  if(home){home.setAttribute('onclick','HARUMAL_PRACTICE.back()');home.setAttribute('data-practice-result-back','');home.textContent=L('영역 선택으로','分野選択へ','Back to areas','返回分项')}
  if(!actions.querySelector('[data-practice-restart]')){
    const button=document.createElement('button');button.className='main';button.setAttribute('data-practice-restart','');button.setAttribute('onclick','HARUMAL_PRACTICE.restart()');button.textContent=L('다시 시작','もう一度','Again','再来一次');actions.appendChild(button);
  }
}
const resultCard=document.getElementById('resultCard');
if(resultCard&&typeof MutationObserver==='function')new MutationObserver(patchMockResult).observe(resultCard,{childList:true});
function patchSurface(){
  const screen=document.getElementById('screen'),meta=getActive();if(!screen)return;
  if(!meta){delete screen.dataset.practiceArea;delete screen.dataset.practiceLevel;delete screen.dataset.practiceMode;return}
  screen.dataset.practiceArea=meta.area;screen.dataset.practiceLevel=String(meta.level);screen.dataset.practiceMode=meta.mode;
  const label=`TOPIK ${meta.level===1?'I':'II'} · ${areaName(meta.area)}`;
  const count=meta.mode==='random'?`${meta.completed?meta.answered:meta.position} / ${meta.total}`:'';
  const top=screen.querySelector('.randomPracticeTop,.t1RandomTop');
  if(top){
    top.querySelector('button')?.setAttribute('onclick','HARUMAL_PRACTICE.back()');
    if(top.classList.contains('randomPracticeTop')){const heading=top.querySelector('b'),sub=top.querySelector('small');if(heading)heading.textContent=label;if(sub)sub.textContent=count}
    else {const spans=top.querySelectorAll('.t1hud span');if(spans[0])spans[0].textContent=label;if(spans[1])spans[1].textContent=count}
  }else if(!screen.querySelector('[data-practice-back]')){
    const nav=document.createElement('div');nav.className='questionMiniNav';nav.setAttribute('data-practice-back','');
    nav.innerHTML=`<button onclick="HARUMAL_PRACTICE.back()">‹ ${L('영역 선택','分野を選ぶ','Choose area','选择分项')}</button><span class="harumalPracticeCount">${label}${count?' · '+count:''}</span>`;screen.prepend(nav);
  }
  screen.querySelectorAll('button[onclick="setView(\'home\')"]').forEach(button=>{button.setAttribute('onclick','HARUMAL_PRACTICE.back()');button.textContent=L('영역 선택으로','分野選択へ','Back to areas','返回分项')});
  if(state()?.view==='t1result'&&!screen.querySelector('[data-practice-restart]')){
    const button=document.createElement('button');button.className='primary';button.setAttribute('data-practice-restart','');button.setAttribute('onclick','HARUMAL_PRACTICE.restart()');button.textContent=L('다시 시작','もう一度','Again','再来一次');screen.appendChild(button);
  }
  if(meta.level===2&&meta.mode==='random'&&meta.completed)window.finishInfinity?.();
  patchMockResult();
}
window.HARUMAL_PRACTICE=Object.freeze({startRandom,startMock,getActive,restart,back,mockInfo:(level,area)=>MOCKS[normalizeLevel(level)]?.[area]||null});
if(typeof window.render==='function'){const base=window.render;window.render=function(){const out=base.apply(this,arguments);patchSurface();return out}}
patchSurface();
})();
