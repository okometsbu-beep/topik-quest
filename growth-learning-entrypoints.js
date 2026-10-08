// Growth practice is opt-in and separate from quick Shorts and timed exams.
(function(){
'use strict';
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[typeof S==='object'?S.lang:'ko']||en);
const labels=()=>({
 all:L('오늘의 도전','今日のチャレンジ','Today’s challenge','今日挑战'),
 topik:L('TOPIK 유형별 성장 학습','TOPIKの型別ステップ練習','TOPIK step-by-step practice','TOPIK题型成长练习'),
 grammar:L('뜻이 보이는 문법','意味が見える文法','Grammar you can see','看得见含义的语法'),
 writing:L('조건에 맞게 한 문장','条件に合う一文','One sentence, clear conditions','按条件写一句话'),
 travel:L('상황을 바꾸며 대화','場面を変えて会話','Conversation in a new setting','换个情景练对话')
});
function entry(section='all',compact=false){
 const copy=section==='all'?L('혼자 풀기 → 필요한 도움 → 새 상황 확인','自分で解く → 必要なヒント → 新しい場面','Try it → get help → check a new situation','独立尝试 → 按需帮助 → 新情景确认'):L('선택된 예제로 뜻과 관계를 직접 확인해요.','選ばれた例で意味と関係を確かめよう。','Explore meaning and relationships with selected examples.','用精选例题理解含义和关系。');
 return `<section class="harumalGrowthEntry ${compact?'harumalGrowthEntry--compact':''}" data-growth-entry="${section}"><div><small>GROWTH / ${L('단계별 연습','ステップ練習','STEP BY STEP','分步练习')}</small><h2>${labels()[section]||labels().all}</h2><p>${copy}</p></div><button type="button" onclick="HARUMAL_GROWTH.open('${section}')">${L('성장 학습 열기','ステップ練習を開く','Open growth practice','打开成长练习')} <span aria-hidden="true">↗</span></button></section>`;
}
function mount(screen,section='all',after){
 if(screen.querySelector(`[data-growth-entry="${section}"]`))return;
 if(after?.insertAdjacentHTML)after.insertAdjacentHTML('afterend',entry(section));else screen.insertAdjacentHTML('beforeend',entry(section,true));
}
function status(screen){
 if(!window.HARUMAL_REWARDS||screen.querySelector('.harumalRewardsStatus'))return;
 const anchor=screen.querySelector('.harumalPersonal .harumalPageHead,.tqV9Greeting,.harumalPageHead');
 if(anchor?.insertAdjacentHTML)anchor.insertAdjacentHTML('afterend',HARUMAL_REWARDS.renderStatus());else screen.insertAdjacentHTML('afterbegin',HARUMAL_REWARDS.renderStatus());
}
function decorate(){
 if(!window.HARUMAL_GROWTH||typeof S!=='object')return;
 const sc=document.getElementById('screen');if(!sc?.querySelector)return;
 const view=S.view;
 if(['home','more','stats'].includes(view))status(sc);
 if(view==='home')mount(sc,'all',sc.querySelector('.tqTodayLesson'));
 else if(view==='learn'){
  if(!sc.querySelector('.harumalGrowthCourses'))sc.insertAdjacentHTML('beforeend',`<section class="harumalGrowthCourses"><h2>${L('뜻을 발견하는 성장 학습','意味を発見するステップ練習','Learn by discovering meaning','发现含义的成长练习')}</h2><p>${L('11가지 학습 방식 · 직접 만든 22개 예제. 기존 문제 전체를 바꾼 과정은 아니에요.','11種類の練習・オリジナル22題。既存の全問題を置き換えるコースではありません。','11 practice types · 22 original examples. This covers selected lessons, not the full question bank.','11种练习方式 · 22道原创例题。当前仅覆盖精选课程。')}</p>${['topik','grammar','writing','travel'].map(id=>entry(id,true)).join('')}</section>`);
 }else if(view==='beginnerGrammar')mount(sc,'grammar',sc.querySelector('.bgHero'));
 else if(view==='writingCourse'&&['course','map','level','unit'].includes(window.HARUMAL_WRITING?.engine.getState().route?.page||'course'))mount(sc,'writing');
 else if(view==='travel')mount(sc,'travel',sc.querySelector('.advLead'));
 else if(view==='t1result'&&sc.querySelector('.t1result'))mount(sc,'topik');
 // Intentionally no Shorts, active timed-exam, or unsubmitted question hook.
}
window.HARUMAL_GROWTH_ENTRIES=Object.freeze({entry,decorate});
if(typeof window.render==='function'){const base=window.render;window.render=function(){const value=base.apply(this,arguments);decorate();return value}}
decorate();
})();
