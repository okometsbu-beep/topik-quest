// MALBIT product polish v32 · trustworthy learning loop, navigation and settings.
(function(){
'use strict';

const PREFS_KEY='malbitProductPrefsV1';
const EVENTS_KEY='malbitLearningEventsV1';
const ONBOARD_KEY='malbitOnboardingV1';
const T1_SESSION='topikQuestTopik1Session';
const SHORTS_KEY='topikQuestShortsV1';
const GAME_KEY='topikQuestTopik1GameV1';
const REVIEW_KEY='malbitWrongReviewV3';
const LANG_INDEX={ko:0,ja:1,en:2,zh:3};
const PREF_DEFAULT={dailyGoal:5,randomMix:'balanced',listeningMode:'ask'};
let prefs=readJSON(PREFS_KEY,PREF_DEFAULT);prefs={...PREF_DEFAULT,...prefs};
let questionStarted=new Map(),lastRoute='';

function readJSON(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(e){return fallback}}
function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}
function L(ko,ja,en,zh){return [ko,ja,en,zh][LANG_INDEX[S?.lang]??0]||ko}
function html(value){return typeof esc==='function'?esc(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function level(){return Number(localStorage.getItem('topikQuestExamLevel'))===2?2:1}
function dayKey(value=Date.now()){const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function currentT1(){return readJSON(T1_SESSION,null)}
function t1Attempt(q){const n=Math.max(0,Number(q?.total??q?.i)||0);return q?.locked?Math.max(0,n-1):n}
function visibleQuestionKey(){
  if(S?.view==='shorts'){const sh=readJSON(SHORTS_KEY,{}),lv=Number(sh.activeLevel)||level(),p=sh.levels?.[lv]||sh.levels?.[String(lv)]||{};return`shorts:${lv}:${p.index||0}:${p.total||0}`}
  if(S?.view==='infinity'&&S.infinity?.current){const x=S.infinity.current;return`inf:${S.infinity.count||0}:${x.type}:${x.id}`}
  if(S?.view==='t1quiz'){const q=currentT1(),id=q?.ids?.[q.i];return q?`t1:${q.mode}:${q.started||'run'}:${q.gameStage||0}:${id}:${t1Attempt(q)}`:''}
  if(S?.view==='real'&&S.real?.active)return`real2:${S.real.deadline}:${S.real.phase}:${S.real.id}`;
  return'';
}
function beginVisibleTimer(){if(S?.view==='t1quiz'&&currentT1()?.locked)return;const key=visibleQuestionKey();if(key&&!questionStarted.has(key))questionStarted.set(key,Date.now())}
function durationFor(key){const t=questionStarted.get(key);questionStarted.delete(key);return Math.max(1,Math.min(3600,Math.round((Date.now()-(t||Date.now()-1000))/1000)))}
function events(){const value=readJSON(EVENTS_KEY,[]);return Array.isArray(value)?value:[]}
function recordEvent(event){
  if(!event?.key)return;const list=events();if(list.some(x=>x.key===event.key))return;
  list.push({ts:Date.now(),level:Number(event.level)===2?2:1,mode:event.mode||'practice',skill:event.skill||'mixed',id:event.id??'',correct:event.correct===true,duration:Math.max(1,Number(event.duration)||1),key:event.key});
  writeJSON(EVENTS_KEY,list.slice(-1500));
}
function questionForT1(id){
  const session=currentT1();
  if(window.MALBIT_BANK?.byId(id))return window.MALBIT_BANK.present(String(id),session?.choiceOrders?.[String(id)]);
  return [...(window.TOPIK1_LISTENING_DATA||[]),...(window.TOPIK1_READING_DATA||[])].find(x=>String(x.id)===String(id));
}
function observeCompletedT1(){
  if(S?.view!=='t1quiz')return;const q=currentT1();if(!q?.locked||q.mode==='real')return;
  const key=visibleQuestionKey();if(!key||!questionStarted.has(key))return;const id=q.ids?.[q.i],item=questionForT1(id);if(!item)return;
  const selected=q.answers?.[id],correct=q.mode==='game'?q.last?.ok===true:Number(selected)===Number(item.answerIndex);
  recordEvent({key,level:Number(q.examLevel)||1,mode:q.mode==='game'?'game':'random',skill:item.section==='listening'?'listening':'reading',id:item.sourceId||item.id,correct,duration:durationFor(key)});
}

window.MALBIT_REVIEWED_TRANSLATIONS={
  ...(window.MALBIT_REVIEWED_TRANSLATIONS||{}),
  1:{...(window.MALBIT_REVIEWED_TRANSLATIONS?.[1]||{}),listen:{...(window.MALBIT_REVIEWED_TRANSLATIONS?.[1]?.listen||{}),9:{
    ja:'音声を聞いて、内容と同じものを選んでください。\n\n女：私たち、3時に会いましょうか。\n男：私は4時のほうがいいです。\n女：いいですね。では4時に会いましょう。\n\n1. 二人は3時に会います。\n2. 二人は4時に会います。\n3. 男性は3時がいいです。\n4. 女性は4時に時間がありません。',
    en:'Listen and choose the statement that matches the dialogue.\n\nWoman: Shall we meet at three o’clock?\nMan: I prefer four o’clock.\nWoman: All right. Then let’s meet at four o’clock.\n\n1. The two people will meet at three o’clock.\n2. The two people will meet at four o’clock.\n3. The man prefers three o’clock.\n4. The woman is not available at four o’clock.',
    zh:'请听对话，选择与内容相符的一项。\n\n女：我们三点见面好吗？\n男：我更喜欢四点。\n女：好，那我们四点见。\n\n1. 两个人三点见面。\n2. 两个人四点见面。\n3. 男士喜欢三点。\n4. 女士四点没有时间。'
  }}}
};
const reviewedQ9=(window.TOPIK1_LISTENING_DATA||[]).find(q=>Number(q.id)===9);
if(reviewedQ9)reviewedQ9.explanationI18n={
  ko:'여자가 처음에는 세 시를 제안했지만, 남자가 네 시를 원했고 마지막에 두 사람 모두 네 시에 만나기로 확정했습니다. 따라서 정답은 2번입니다.',
  ja:'女性は最初に3時を提案しましたが、男性が4時を希望し、最後に二人は4時に会うと決めました。したがって正解は2番です。',
  en:'The woman first suggests three, but the man prefers four. They finally agree to meet at four, so option 2 is correct.',
  zh:'女士先提议三点，男士希望四点，最后两人确定四点见面，因此正确答案是第2项。'
};

// Record completed answers only. Opening a screen never counts as study.
if(typeof window.checkShorts==='function'){
  const base=window.checkShorts;
  window.checkShorts=function(){
    const sh=readJSON(SHORTS_KEY,{}),lv=Number(sh.activeLevel)||level(),p=sh.levels?.[lv]||sh.levels?.[String(lv)]||{},key=`shorts:${lv}:${p.index||0}:${p.total||0}`,selected=Number(p.selected),bank=p.orderId&&window.MALBIT_BANK?.present(p.orderId,p.choiceOrder),correct=bank?Number(bank.answerIndex):((Number(p.index)||0)*3+lv)%4,item=bank||window.MALBIT_SHORTS_DECKS?.[lv]?.[Number(p.index)||0];
    const out=base.apply(this,arguments);recordEvent({key,level:lv,mode:'shorts',skill:item?.section||item?.type||'vocab',id:item?.bankId||item?.term||p.index,correct:selected===correct,duration:durationFor(key)});return out;
  };
}

if(typeof window.t1Next==='function'){
  const base=window.t1Next;
  window.t1Next=function(){
    const q=currentT1(),id=q?.ids?.[q.i],item=questionForT1(id),selected=q?.answers?.[id],canSubmit=q&&item&&selected!=null&&!q.locked;
    const key=visibleQuestionKey(),out=base.apply(this,arguments);
    if(canSubmit)recordEvent({key,level:Number(q.examLevel)||1,mode:q.mode==='game'?'game':q.mode==='real'?'exam':'random',skill:item.section==='listening'?'listening':'reading',id:item.sourceId||item.id,correct:Number(selected)===Number(item.answerIndex),duration:durationFor(key)});
    return out;
  };
}

if(typeof window.submitInfinity==='function'){
  const base=window.submitInfinity;
  window.submitInfinity=function(){
    const inf=S.infinity,x=inf?.current,q=x&&(typeof infinityCurrentQuestion==='function'?infinityCurrentQuestion():(x.type==='listen'?LS[x.id-1]:RW[x.id-1])),picked=typeof selected==='number'?selected:null,key=visibleQuestionKey();
    const out=base.apply(this,arguments);if(q&&picked!=null)recordEvent({key,level:2,mode:'random',skill:x.type==='listen'?'listening':'reading',id:q.bankId||x.id,correct:picked===Number(q.answerIndex),duration:durationFor(key)});return out;
  };
}

if(typeof window.infTimeout==='function'){
  const base=window.infTimeout;
  window.infTimeout=function(){const x=S.infinity?.current,key=visibleQuestionKey(),out=base.apply(this,arguments);if(x)recordEvent({key,level:2,mode:'random',skill:x.type==='listen'?'listening':x.type==='read'?'reading':'writing',id:x.id,correct:false,duration:durationFor(key)});return out};
}

if(typeof window.realMove==='function'){
  const base=window.realMove;
  window.realMove=function(delta){
    const r=S.real,phase=r?.phase,id=r?.id,answer=phase==='listen'?S.realAnswers?.listen?.[id]:phase==='read'?S.realAnswers?.read?.[id]:null,q=phase==='listen'?LS?.[id-1]:phase==='read'?RW?.[id-1]:null,key=visibleQuestionKey();
    const out=base.apply(this,arguments);if(Number(delta)>0&&answer&&q)recordEvent({key,level:2,mode:'exam',skill:phase==='listen'?'listening':'reading',id,correct:Number(answer.selected)===Number(q.answerIndex),duration:durationFor(key)});return out;
  };
}

// TOPIK II random practice: listening/reading first, then gradually introduce writing.
if(typeof window.nextInfinity==='function'){
  const baseNextInfinity=window.nextInfinity;
  window.nextInfinity=function(){
    const inf=S.infinity;if(!inf||Number(inf.examLevel)!==2)return typeof startRandomPractice==='function'?startRandomPractice(2):undefined;
    const count=Number(inf.count)||0,mix=prefs.randomMix||'balanced';let type;
    if(mix==='lr'||count<3)type=Math.random()<.5?'listen':'read';
    else if(mix==='writing')type=Math.random()<.52?'write':(Math.random()<.5?'listen':'read');
    else type=Math.random()<.18?'write':(Math.random()<.5?'listen':'read');
    inf.nextType=type;
    return baseNextInfinity.apply(this,arguments);
  };
}

function writingMinimum(id){return Number(id)<=52?3:Number(id)===53?80:120}
function writingRule(id){
  if(Number(id)<=52)return L('빈칸 2개를 문맥에 맞는 문장으로 완성하세요.','2つの空欄を文脈に合う文で完成させましょう。','Complete both blanks with context-appropriate sentences.','用符合语境的句子完成两个空格。');
  if(Number(id)===53)return L('랜덤 연습 최소 80자 · 실제 목표 200~300자','ランダム練習は80字以上・本番目標は200～300字','Practice minimum 80 characters · exam target 200–300','随机练习至少80字 · 正式目标200～300字');
  return L('랜덤 연습 최소 120자 · 실제 목표 600~700자','ランダム練習は120字以上・本番目標は600～700字','Practice minimum 120 characters · exam target 600–700','随机练习至少120字 · 正式目标600～700字');
}
function updateWritingGate(id){
  const ta=document.getElementById('writeBox'),btn=document.getElementById('malbitWritingSubmit'),count=String(ta?.value||'').replace(/\s/g,'').length,need=writingMinimum(id),counter=document.getElementById('charCount'),hint=document.getElementById('malbitWritingGate');
  if(counter)counter.textContent=`${count} / ${need}+`;
  if(btn){btn.disabled=count<need;btn.setAttribute('aria-disabled',String(count<need))}
  if(hint){hint.classList.toggle('ready',count>=need);hint.textContent=count>=need?L('제출할 수 있어요. 모범답안과 비교해 보세요.','提出できます。模範解答と比較しましょう。','Ready to submit. Compare your work with the model.','可以提交了，请与参考答案比较。'):L(`제출까지 ${need-count}자 남았어요.`,`提出まであと${need-count}字です。`,`${need-count} characters until submission.`,`还差${need-count}字即可提交。`)}
}

if(typeof window.renderRandomWriting==='function'){
  const base=window.renderRandomWriting;
  window.renderRandomWriting=function(q){
    let out=base.apply(this,arguments);if(S.infinity?.feedback)return out;
    const id=Number(q.id),need=writingMinimum(id),value=String(S.writing?.[id]||''),count=value.replace(/\s/g,'').length;
    const placeholder=id<=52?L('㉠과 ㉡을 각각 자연스러운 한 문장으로 완성하세요.','㉠と㉡をそれぞれ自然な一文で完成させてください。','Complete ㉠ and ㉡ with one natural sentence each.','分别用一个自然的句子完成㉠和㉡。'):id===53?L('자료의 증가·감소와 원인을 연결해 쓰세요.','資料の増減と原因を結び付けて書いてください。','Connect the increases, decreases, and causes shown in the data.','结合资料中的增减变化及其原因作答。'):L('세 가지 과제를 모두 다루고, 주장과 근거를 나누어 쓰세요.','3つの課題をすべて扱い、主張と根拠を分けて書いてください。','Address all three prompts and separate your claim from its reasons.','涵盖三个要求，并区分观点与依据。');
    out=out.replace(/placeholder="[^"]*"/,`placeholder="${html(placeholder)}"`)
      .replace('<div class="counter">',`<div class="malbitWritingRule">${html(writingRule(id))}</div><div id="malbitWritingGate" class="malbitWritingGate ${count>=need?'ready':''}">${html(count>=need?L('제출할 수 있어요. 모범답안과 비교해 보세요.','提出できます。模範解答と比較しましょう。','Ready to submit. Compare your work with the model.','可以提交了，请与参考答案比较。'):L(`제출까지 ${need-count}자 남았어요.`,`提出まであと${need-count}字です。`,`${need-count} characters until submission.`,`还差${need-count}字即可提交。`))}</div><div class="counter">`)
      .replace(/<b id="charCount">[\s\S]*?<\/b>/,`<b id="charCount">${count} / ${need}+</b>`)
      .replace('<button class="randomWriteAction" onclick="submitInfinityWriting()">',`<button id="malbitWritingSubmit" class="randomWriteAction" onclick="submitInfinityWriting()" ${count<need?'disabled':''}>`);
    return out;
  };
}

if(typeof window.bindWrite==='function'){
  const base=window.bindWrite;
  window.bindWrite=function(id,context){const out=base.apply(this,arguments),ta=document.getElementById('writeBox');if(context==='inf'&&ta){ta.addEventListener('input',()=>updateWritingGate(id));updateWritingGate(id)}return out};
}

if(typeof window.submitInfinityWriting==='function'){
  window.submitInfinityWriting=function(){
    const inf=S.infinity,x=inf?.current;if(!inf||x?.type!=='write')return;const q=RW[x.id-1],txt=String(S.writing?.[x.id]||'').trim(),need=writingMinimum(x.id),key=visibleQuestionKey();
    if(txt.replace(/\s/g,'').length<need){updateWritingGate(x.id);document.getElementById('writeBox')?.focus();return toast(L(`최소 ${need}자까지 작성해 주세요.`,`最低${need}字まで書いてください。`,`Write at least ${need} characters.`,`请至少写${need}字。`))}
    const sec=elapsed();stopTimer();inf.count++;inf.writing=(Number(inf.writing)||0)+1;inf.totalSec+=sec;inf.targetSec+=infLimit(x);inf.feedback={write:true,sec};save();recordEvent({key,level:2,mode:'random',skill:'writing',id:q.id,correct:true,duration:durationFor(key)});render();
  };
}

function activitySnapshot(){
  const list=events(),sh=readJSON(SHORTS_KEY,{}),levels=sh.levels||{},legacyTotal=[1,2].reduce((n,lv)=>n+Number((levels[lv]||levels[String(lv)])?.total||0),0),legacyCorrect=[1,2].reduce((n,lv)=>n+Number((levels[lv]||levels[String(lv)])?.score||0),0),eventShorts=list.filter(x=>x.mode==='shorts'),extraLegacy=Math.max(0,legacyTotal-eventShorts.length),extraCorrect=Math.max(0,legacyCorrect-eventShorts.filter(x=>x.correct).length),answered=list.length+extraLegacy,correct=list.filter(x=>x.correct).length+extraCorrect;
  const active=new Set(list.map(x=>dayKey(x.ts)));for(const [key,value] of Object.entries(sh.daily||{}))if(Number(value?.total)>0)active.add(key);
  const today=dayKey(),todayShorts=Number(sh.daily?.[today]?.total)||0,todayOther=list.filter(x=>dayKey(x.ts)===today&&x.mode!=='shorts').length,todayCount=todayShorts+todayOther;
  let streak=0,d=new Date();if(!active.has(dayKey(d)))d.setDate(d.getDate()-1);while(active.has(dayKey(d))){streak++;d.setDate(d.getDate()-1)}
  const monday=new Date(),dow=(monday.getDay()+6)%7;monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-dow);
  const week=Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return{date:d,key:dayKey(d),on:active.has(dayKey(d))}}),durations=list.map(x=>Number(x.duration)).filter(x=>x>0),skills={};
  for(const e of list){const k=e.skill||'mixed';skills[k]=skills[k]||{n:0,ok:0,time:0};skills[k].n++;skills[k].ok+=e.correct?1:0;skills[k].time+=Number(e.duration)||0}
  return{list,answered,correct,accuracy:answered?Math.round(correct/answered*100):0,todayCount,streak,week,weekCount:week.filter(x=>x.on).length,avg:durations.length?Math.round(durations.reduce((a,b)=>a+b,0)/durations.length):0,best:durations.length?Math.min(...durations):0,slowest:durations.length?Math.max(...durations):0,skills};
}
function skillName(skill){return({listening:L('듣기','聴解','Listening','听力'),reading:L('읽기','読解','Reading','阅读'),writing:L('쓰기','作文','Writing','写作'),word:L('단어','単語','Words','单词'),vocab:L('어휘','語彙','Vocabulary','词汇'),grammar:L('문법','文法','Grammar','语法'),idiom:L('숙어','慣用表現','Idioms','惯用语'),expression:L('표현','表現','Expressions','表达'),mixed:L('종합','総合','Mixed','综合')}[skill]||skill)}
function formatTime(sec){sec=Math.max(0,Number(sec)||0);return sec>=60?`${Math.floor(sec/60)}m ${sec%60}s`:`${sec}s`}
function renderPolishedStats(sc){
  const a=activitySnapshot(),rows=Object.entries(a.skills).sort((x,y)=>y[1].n-x[1].n),weak=rows.filter(x=>x[1].n>=2).sort((x,y)=>(x[1].ok/x[1].n)-(y[1].ok/y[1].n))[0],vocab=Array.isArray(S.vocab)?S.vocab.length:0,goal=Math.max(1,Number(prefs.dailyGoal)||5),progress=Math.min(100,Math.round(a.todayCount/goal*100));
  sc.className='screen tqStatsScreen malbitStats';
  sc.innerHTML=`<div class="malbitPageTitle"><div><small>LEARNING INSIGHTS</small><h1>${L('학습 통계','学習統計','Learning insights','学习统计')}</h1></div><button onclick="setView('more')">⚙️</button></div><section class="malbitStatsHero"><div class="malbitGoalRing" style="--p:${progress*3.6}deg"><b>${a.todayCount}<small>/${goal}</small></b></div><div><small>${L('오늘 완료한 문제','今日完了した問題','Questions completed today','今日完成题目')}</small><h2>${progress>=100?L('오늘 목표 달성!','今日の目標達成！','Daily goal complete!','今日目标已完成！'):L(`${goal-a.todayCount}문제만 더 풀면 목표 달성`,`あと${goal-a.todayCount}問で目標達成`,`${goal-a.todayCount} more to reach your goal`,`再做${goal-a.todayCount}题即可达标`)}</h2><p>🔥 ${a.streak} ${L('일 연속 학습','日連続学習','day streak','天连续学习')}</p></div></section><div class="malbitStatGrid"><article><b>${a.accuracy}%</b><small>${L('전체 정답률','全体正答率','Overall accuracy','总体正确率')}</small></article><article><b>${a.answered}</b><small>${L('완료 문제','完了問題','Completed','已完成')}</small></article><article><b>${a.weekCount}/7</b><small>${L('이번 주 학습','今週の学習','Active this week','本周学习')}</small></article><article><b>${vocab}</b><small>${L('저장한 표현','保存した表現','Saved words','已存词汇')}</small></article></div><section class="malbitPace"><h2>${L('풀이 속도','解答ペース','Answer pace','答题速度')}</h2><div><span><b>${a.avg?formatTime(a.avg):'–'}</b><small>${L('평균','平均','Average','平均')}</small></span><span><b>${a.best?formatTime(a.best):'–'}</b><small>${L('가장 빠름','最速','Fastest','最快')}</small></span><span><b>${a.slowest?formatTime(a.slowest):'–'}</b><small>${L('가장 느림','最遅','Slowest','最慢')}</small></span></div></section><section class="malbitSkills"><div class="malbitSectionTitle"><h2>${L('영역별 정확도','分野別正答率','Accuracy by skill','分项正确率')}</h2><span>${L('완료 답안 기준','完了答案ベース','Completed answers','按已完成答题')}</span></div>${rows.length?rows.map(([name,x])=>{const acc=Math.round(x.ok/x.n*100);return`<article><div><b>${skillName(name)}</b><small>${x.ok}/${x.n} · ${formatTime(Math.round(x.time/x.n))}</small></div><div class="malbitSkillBar"><i style="width:${acc}%"></i></div><strong>${acc}%</strong></article>`}).join(''):`<div class="malbitEmptyCompact">${L('문제를 제출하면 영역별 기록이 여기에 쌓여요.','問題を提出すると分野別記録がここに表示されます。','Submit answers to build your skill breakdown.','提交答案后，这里会显示分项记录。')}</div>`}</section><section class="malbitRecommendation"><small>NEXT BEST ACTION</small><h2>${weak?L(`${skillName(weak[0])}를 5문제만 집중해 보세요.`,`${skillName(weak[0])}を5問だけ集中練習しましょう。`,`Focus on 5 ${skillName(weak[0])} questions next.`,`接下来集中练习5道${skillName(weak[0])}题。`):L('숏츠 5문제로 첫 기준점을 만들어 보세요.','ショーツ5問で最初の基準を作りましょう。','Start with 5 Shorts questions.','先做5道短题建立起点。')}</h2><button onclick="malbitStartRecommendation('${weak?.[0]||'vocab'}')">${L('추천 학습 시작','おすすめ学習を開始','Start recommended practice','开始推荐练习')} ›</button></section>`;
}

window.malbitStartRecommendation=skill=>{if(['word','vocab','grammar','idiom','expression'].includes(skill))return window.startShorts?.();prefs.randomMix=skill==='writing'?'writing':'lr';writeJSON(PREFS_KEY,prefs);if(skill==='writing'){localStorage.setItem('topikQuestExamLevel','2');return startRandomPractice(2)}return window.tqStartMode?.('random')};

function currentShort(){
  const sh=readJSON(SHORTS_KEY,{}),lv=Number(sh.activeLevel)||level(),p=sh.levels?.[lv]||sh.levels?.[String(lv)]||{},deck=window.MALBIT_SHORTS_DECKS?.[lv]||[];
  const bankItem=p.orderId?window.MALBIT_BANK?.shorts(lv).find(item=>item.bankId===p.orderId):null;
  return{lv,p,item:bankItem||deck[(Number(p.index)||0)%Math.max(1,deck.length)]};
}
window.malbitSpeak=text=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='ko-KR';u.rate=.88;const voices=speechSynthesis.getVoices().filter(v=>/^ko/i.test(v.lang||''));u.voice=voices[0]||null;speechSynthesis.speak(u)}catch(e){toast(L('이 기기에서는 음성을 재생할 수 없어요.','この端末では音声を再生できません。','Voice playback is unavailable.','此设备无法播放语音。'))}};
window.malbitSaveShort=term=>window.MALBIT_LEARNING?.addVocabTerm?.(term);
async function translateShortExample(item,node){if(!item||!node||S.lang==='ko')return;node.textContent=L('예문 번역 중…','例文を翻訳中…','Translating example…','正在翻译例句…');const value=await translateCached(`short_example_${S.lang}_${item.term}`,item.example,'ko',S.lang);if(node.isConnected)node.textContent=value}
function patchShorts(){
  const card=document.querySelector('.shortsCard');if(!card||card.dataset.productPolish==='1')return;card.dataset.productPolish='1';const {p,item}=currentShort();if(!item)return;
  if(!item.bankId){const word=card.querySelector('.shortsWord');word?.insertAdjacentHTML('afterend',`<div class="malbitShortTools"><button onclick='malbitSpeak(${JSON.stringify(item.term)})'>🔊 ${L('듣기','聞く','Listen','听发音')}</button><button onclick='malbitSaveShort(${JSON.stringify(item.term)})'>＋ ${L('단어장','単語帳','Save','收藏')}</button></div>`)}
  const goal=Math.max(1,Number(prefs.dailyGoal)||5),done=activitySnapshot().todayCount;card.insertAdjacentHTML('beforeend',`<div class="malbitShortDaily">${L('오늘 목표','今日の目標','Daily goal','今日目标')} <b>${Math.min(done,goal)}/${goal}</b></div>`);
  const feedback=card.querySelector('.shortsFeedback');if(feedback&&S.lang!=='ko'&&!item.bankId&&item.example){const row=document.createElement('div');row.className='malbitExampleTranslation';row.textContent='…';feedback.appendChild(row);translateShortExample(item,row)}
}

function vocabTarget(){return S.lang==='ko'?'ja':S.lang}
function migrateVocab(){let changed=false;S.vocab=Array.isArray(S.vocab)?S.vocab:[];for(const v of S.vocab){if(!v.meanings){v.meanings={};changed=true}if(v.ja&&!v.meanings.ja){v.meanings.ja=v.ja;changed=true}if(!Number(v.dueAt)){v.dueAt=Date.now();changed=true}if(!Number(v.interval)){v.interval=1;changed=true}if(v.repetitions==null){v.repetitions=0;changed=true}}if(changed)save()}
function dueLabel(v){const diff=Number(v.dueAt)-Date.now();if(diff<=0)return L('지금 복습','今すぐ復習','Due now','现在复习');const days=Math.ceil(diff/86400000);return L(`${days}일 후`,`あと${days}日`,`in ${days}d`,`${days}天后`)}
function renderVocabCard(v,index){const target=vocabTarget(),meaning=v.meanings?.[target]||(target==='ja'?v.ja:'')||'',due=Number(v.dueAt)<=Date.now();return`<article class="malbitVocabCard ${due?'due':''}"><div class="malbitVocabTop"><span>${due?'●':'○'} ${dueLabel(v)}</span><small>${html(v.source||L('직접 저장','手動保存','Saved','已收藏'))}</small></div><h2 lang="ko">${html(v.text)}</h2><div class="malbitVocabMeaning ${v.show?'show':''}">${v.show?html(meaning||L('뜻을 불러오는 중…','意味を読み込み中…','Loading meaning…','正在加载释义…')):L('먼저 뜻을 떠올린 뒤 확인하세요.','意味を思い出してから確認しましょう。','Recall the meaning before revealing it.','先回想词义，再点击查看。')}</div><div class="malbitVocabActions"><button class="reveal" onclick="malbitVocabReveal(${index})">${v.show?L('뜻 숨기기','意味を隠す','Hide','隐藏'):L('뜻 확인','意味を確認','Reveal','查看释义')}</button><button class="sound" onclick='malbitSpeak(${JSON.stringify(v.text)})'>🔊</button><button class="remove" onclick="deleteVocab(${index})">×</button></div>${v.show?`<div class="malbitSrs"><small>${L('다시 언제 볼까요?','次はいつ復習しますか？','When should this return?','下次何时再复习？')}</small><div><button onclick="malbitVocabGrade(${index},'hard')">${L('어려움','難しい','Hard','困难')}<b>10m</b></button><button onclick="malbitVocabGrade(${index},'good')">${L('보통','普通','Good','一般')}<b>${Math.max(1,Math.round(Number(v.interval)||1))}d</b></button><button onclick="malbitVocabGrade(${index},'easy')">${L('쉬움','簡単','Easy','简单')}<b>${Math.max(3,Math.round((Number(v.interval)||1)*3))}d</b></button></div></div>`:''}</article>`}
function renderPolishedVocab(sc){
  migrateVocab();const due=S.vocab.filter(v=>Number(v.dueAt)<=Date.now()).length,order=S.vocab.map((v,index)=>({v,index})).sort((a,b)=>Number(a.v.dueAt)-Number(b.v.dueAt));sc.className='screen malbitVocabScreen';
  sc.innerHTML=`<div class="malbitPageTitle"><div><small>SMART VOCABULARY</small><h1>${L('내 단어장','単語帳','My Vocabulary','我的单词本')}</h1></div><span>${due} ${L('복습 대기','復習待ち','due','待复习')}</span></div><section class="malbitVocabGuide"><b>☝ ${L('문제 속 표현을 0.5초간 눌러 저장','問題の表現を0.5秒長押しで保存','Hold any expression for 0.5 sec to save it','长按题中表达0.5秒即可收藏')}</b><p>${L('조사와 불완전한 조각을 정리한 뒤, 저장 형태를 직접 확인할 수 있어요.','助詞や不完全な断片を整え、保存形を自分で確認できます。','Particles and fragments are cleaned, then you confirm the saved form.','系统会整理助词和残缺片段，并让你确认保存形式。')}</p><button onclick="showVocabGuide()">${L('사용법 자세히','使い方を見る','How it works','查看用法')} ›</button></section>${order.length?`<div class="malbitSectionTitle"><h2>${due?L('오늘 복습','今日の復習','Due for review','今日复习'):L('저장한 표현','保存した表現','Saved expressions','已存表达')}</h2><span>${S.vocab.length}</span></div><div class="malbitVocabList">${order.map(x=>renderVocabCard(x.v,x.index)).join('')}</div>`:`<section class="malbitVocabEmpty"><span>🌱</span><h2>${L('첫 단어를 심어 볼까요?','最初の単語を植えよう','Plant your first word','收藏第一个单词吧')}</h2><p>${L('문제에서 길게 누르거나, 아래 예시를 저장해 복습 흐름을 체험해 보세요.','問題で長押しするか、下の例を保存して復習を体験してください。','Long-press a question word or save the sample below to try the review loop.','长按题中词语，或收藏下方示例体验复习流程。')}</p><div lang="ko"><b>꾸준하다</b><small>${L('한결같이 계속하다','こつこつ続ける','to be consistent','坚持不懈')}</small></div><button onclick="malbitAddSampleVocab()">＋ ${L('예시 단어 저장','例の単語を保存','Save sample word','收藏示例词')}</button></section>`}`;
}
window.malbitVocabReveal=async index=>{migrateVocab();const v=S.vocab?.[Number(index)];if(!v)return;v.show=!v.show;const target=vocabTarget();if(v.show&&!v.meanings?.[target]){v.meanings=v.meanings||{};v.meanings[target]=await translateCached(`vocab_v20_${target}_${v.text}`,v.text,'ko',target);if(target==='ja')v.ja=v.meanings.ja}save();render()};
window.malbitVocabGrade=(index,grade)=>{migrateVocab();const v=S.vocab?.[Number(index)];if(!v)return;const day=86400000,old=Math.max(1,Number(v.interval)||1);if(grade==='hard'){v.interval=1;v.dueAt=Date.now()+10*60000}else if(grade==='easy'){v.interval=Math.max(3,Math.round(old*3));v.dueAt=Date.now()+v.interval*day;v.repetitions=(Number(v.repetitions)||0)+1}else{v.interval=Math.max(1,Math.round(old*(Number(v.repetitions)?2.2:1)));v.dueAt=Date.now()+v.interval*day;v.repetitions=(Number(v.repetitions)||0)+1}v.show=false;v.lastReviewedAt=Date.now();save();toast(L('다음 복습 일정을 저장했어요.','次の復習予定を保存しました。','Next review scheduled.','已安排下次复习。'));render()};
window.malbitAddSampleVocab=()=>{S.vocab=Array.isArray(S.vocab)?S.vocab:[];if(!S.vocab.some(v=>v.text==='꾸준하다'))S.vocab.unshift({text:'꾸준하다',source:L('단어장 안내','単語帳ガイド','Vocabulary guide','单词本引导'),ja:'こつこつ続ける',meanings:{ja:'こつこつ続ける',en:'to be consistent',zh:'坚持不懈'},show:false,dueAt:Date.now(),interval:1,repetitions:0});save();render()};
if(typeof window.deleteVocab==='function')window.deleteVocab=index=>{if(!confirm(L('이 표현을 단어장에서 삭제할까요?','この表現を単語帳から削除しますか？','Remove this expression from Vocabulary?','从单词本中删除此表达吗？')))return;S.vocab.splice(Number(index),1);save();render()};

const PORTABLE_KEYS=['topikQuestV8','topikQuestExamLevel',T1_SESSION,SHORTS_KEY,GAME_KEY,REVIEW_KEY,EVENTS_KEY,PREFS_KEY,ONBOARD_KEY,'malbitDiagnosticV1','malbitJourneyEventsV1','malbitGrowthPrefsV1','malbitInstallIdV1','malbitShortProposalHandled'];
function progressPayload(){const data={schema:1,app:'MALBIT',exportedAt:new Date().toISOString(),storage:{}};for(const key of PORTABLE_KEYS){const value=localStorage.getItem(key);if(value!=null)data.storage[key]=value}return data}
window.malbitExportProgress=()=>{const blob=new Blob([JSON.stringify(progressPayload(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`malbit-progress-${dayKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
window.malbitImportProgress=input=>{const file=input?.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result||''));if(data?.app!=='MALBIT'||!data.storage||typeof data.storage!=='object')throw new Error('format');if(!confirm(L('현재 진행 기록을 가져온 파일로 교체할까요?','現在の記録を読み込んだファイルで置き換えますか？','Replace current progress with the imported file?','用导入文件替换当前进度吗？')))return;for(const key of PORTABLE_KEYS)localStorage.removeItem(key);for(const key of PORTABLE_KEYS)if(Object.prototype.hasOwnProperty.call(data.storage,key))localStorage.setItem(key,String(data.storage[key]));location.reload()}catch(e){toast(L('올바른 MALBIT 진행 파일이 아니에요.','正しいMALBIT進行ファイルではありません。','That is not a valid MALBIT progress file.','这不是有效的MALBIT进度文件。'))}};reader.readAsText(file)};
window.malbitResetProgress=()=>{if(!confirm(L('학습·게임·오답·단어장 기록을 모두 삭제할까요? 이 작업은 되돌릴 수 없습니다.','学習・ゲーム・誤答・単語帳の記録をすべて削除しますか？元に戻せません。','Delete all learning, game, review, and vocabulary progress? This cannot be undone.','删除全部学习、游戏、错题和单词本记录吗？此操作无法撤销。')))return;for(const key of PORTABLE_KEYS.concat(['malbitVocabLongPressUsed']))localStorage.removeItem(key);location.reload()};
window.resetAll=window.malbitResetProgress;

window.malbitSetPref=(name,value)=>{if(name==='dailyGoal')value=Math.max(3,Math.min(20,Number(value)||5));if(name==='randomMix'&&!['balanced','lr','writing'].includes(value))value='balanced';prefs[name]=value;writeJSON(PREFS_KEY,prefs);render()};
window.malbitSetLanguage=lang=>{if(!['ko','ja','en','zh'].includes(lang))return;setLang(lang);document.documentElement.lang=lang==='zh'?'zh-CN':lang};
window.malbitCopyReport=async()=>{const payload=`MALBIT v32\nview=${S.view}\nlang=${S.lang}\nlevel=${level()}\nua=${navigator.userAgent}`;try{await navigator.clipboard.writeText(payload);toast(L('문제 신고 정보가 복사됐어요.','不具合報告情報をコピーしました。','Diagnostic details copied.','问题诊断信息已复制。'))}catch(e){prompt(L('아래 내용을 복사해 주세요.','以下をコピーしてください。','Copy the details below.','请复制以下内容。'),payload)}};

window.morePage=function(sc){
  navActive('more');sc.className='screen malbitMoreScreen';const langButtons=[['ko','🇰🇷','한국어'],['ja','🇯🇵','日本語'],['en','🇺🇸','English'],['zh','🇨🇳','中文']].map(([id,flag,name])=>`<button class="${S.lang===id?'on':''}" onclick="malbitSetLanguage('${id}')"><i>${flag}</i><span>${name}</span></button>`).join('');
  sc.innerHTML=`<div class="malbitPageTitle"><div><small>SETTINGS & SUPPORT</small><h1>${L('설정과 도움말','設定とヘルプ','Settings & help','设置与帮助')}</h1></div><span>v20</span></div><section class="malbitSetting"><h2>${L('앱 언어','アプリの言語','App language','应用语言')}</h2><p>${L('문제 해설·번역·메뉴에 적용됩니다.','問題解説・翻訳・メニューに反映されます。','Used for explanations, translations, and menus.','用于解析、翻译和菜单。')}</p><div class="malbitLangGrid">${langButtons}</div></section><section class="malbitSetting"><h2>${L('하루 학습 목표','1日の学習目標','Daily question goal','每日学习目标')}</h2><div class="malbitChoiceRow">${[3,5,10,15].map(n=>`<button class="${Number(prefs.dailyGoal)===n?'on':''}" onclick="malbitSetPref('dailyGoal',${n})">${n}</button>`).join('')}</div></section><section class="malbitSetting"><h2>${L('TOPIK II 랜덤 실전 구성','TOPIK II ランダム練習の構成','TOPIK II random mix','TOPIK II随机练习构成')}</h2><p>${L('균형 모드는 처음 3문제에 쓰기가 나오지 않고, 이후 점진적으로 섞입니다.','バランスでは最初の3問に作文を出さず、その後少しずつ混ぜます。','Balanced mode keeps writing out of the first 3 questions, then introduces it gradually.','均衡模式前3题不出现写作，之后逐步加入。')}</p><div class="malbitMixGrid"><button class="${prefs.randomMix==='balanced'?'on':''}" onclick="malbitSetPref('randomMix','balanced')"><b>${L('균형','バランス','Balanced','均衡')}</b><small>${L('듣기·읽기 중심 + 쓰기 18%','聴解・読解中心＋作文18%','L/R focused + 18% writing','听读为主＋18%写作')}</small></button><button class="${prefs.randomMix==='lr'?'on':''}" onclick="malbitSetPref('randomMix','lr')"><b>${L('듣기·읽기만','聴解・読解のみ','Listening & reading','仅听力阅读')}</b><small>${L('선택형만 빠르게','選択問題だけ','Multiple choice only','仅选择题')}</small></button><button class="${prefs.randomMix==='writing'?'on':''}" onclick="malbitSetPref('randomMix','writing')"><b>${L('쓰기 집중','作文集中','Writing focus','写作强化')}</b><small>${L('쓰기를 약 50%로','作文を約50%に','About 50% writing','写作约50%')}</small></button></div></section><section class="malbitSetting"><h2>${L('진행 기록 보관','進行記録の保管','Progress backup','进度备份')}</h2><p>${L('계정 없이 이 기기에 저장됩니다. 기기를 바꾸기 전 파일로 백업하세요.','アカウントなしでこの端末に保存されます。機種変更前にファイルで保存してください。','Progress is stored on this device without an account. Export before changing devices.','无需账号，进度保存在本设备。更换设备前请导出备份。')}</p><div class="malbitDataButtons"><button onclick="malbitExportProgress()">↓ ${L('진행 파일 내보내기','進行ファイルを書き出す','Export progress','导出进度')}</button><label>↑ ${L('진행 파일 가져오기','進行ファイルを読み込む','Import progress','导入进度')}<input type="file" accept="application/json,.json" onchange="malbitImportProgress(this)"></label></div></section><details class="malbitHelp"><summary>${L('문제 풀이와 숨은 기능','問題の解き方と便利機能','How answers and hidden tools work','答题与隐藏功能')}</summary><ul><li>${L('선택지를 한 번 누르면 선택, 같은 답을 다시 누르면 제출됩니다.','選択肢を1回押して選択、同じ答えをもう一度押すと提出します。','Tap once to select; tap the same answer again to submit.','点一次选择，再点同一答案提交。')}</li><li>${L('한국어 표현을 0.5초간 누르면 조사·활용을 정리한 뒤 단어장에 저장할 수 있습니다.','韓国語表現を0.5秒長押しすると、助詞・活用を整えて単語帳に保存できます。','Hold Korean text for 0.5 sec to clean particles/conjugation and save it.','长按韩语0.5秒，可整理助词/活用后收藏。')}</li><li>${L('틀린 문제는 복습 탭에 쌓이고, 다시 맞히면 해결됩니다.','誤答は復習タブに蓄積し、解き直して正解すると解決します。','Misses enter Review and are resolved after a correct retry.','错题会进入复习，重做答对后解决。')}</li></ul></details><details class="malbitHelp"><summary>${L('개인정보와 데이터','プライバシーとデータ','Privacy & data','隐私与数据')}</summary><p>${L('학습 기록은 브라우저의 로컬 저장소에 보관됩니다. 번역 기능을 사용할 때 해당 문장이 외부 번역 서비스로 전송될 수 있으며, 마이크는 말하기 연습을 직접 시작했을 때만 브라우저 권한을 요청합니다.','学習記録はブラウザ内に保存されます。翻訳時は対象文が外部翻訳サービスへ送信される場合があり、マイクは発話練習を開始した時だけ権限を求めます。','Learning progress stays in browser storage. Text may be sent to an external translation service when translation is requested; microphone permission is requested only when you start speaking practice.','学习记录保存在浏览器本地。使用翻译时文本可能发送到外部翻译服务；仅在主动开始口语练习时请求麦克风权限。')}</p></details><details class="malbitHelp"><summary>${L('앱 정보와 TOPIK 안내','アプリ情報とTOPIKについて','About MALBIT and TOPIK','关于MALBIT与TOPIK')}</summary><p>${L('MALBIT · 말빛은 독립적으로 제작한 비공식 한국어 학습 앱입니다. TOPIK 명칭은 대비하는 시험을 설명하기 위해 사용하며, 시험 주관기관의 공식 앱이나 후원 앱이 아닙니다. 문제·설명·게임 시스템은 독자 제작물입니다.','MALBIT・말빛は独立制作の非公式韓国語学習アプリです。TOPIKの名称は対象試験を説明するために使用しており、試験主催機関の公式・協賛アプリではありません。問題・解説・ゲームシステムは独自制作です。','MALBIT is an independently made, unofficial Korean-learning app. “TOPIK” identifies the exam being studied; this is not an official or sponsored app of the exam administrator. Questions, explanations, and game systems are original.','MALBIT是独立制作的非官方韩语学习应用。“TOPIK”仅用于说明备考对象，本应用并非考试主办方的官方或赞助应用。题目、解析与游戏系统均为原创。')}</p></details><div class="malbitSupport"><button onclick="malbitCopyReport()">⧉ ${L('문제 신고 정보 복사','不具合報告情報をコピー','Copy diagnostic details','复制问题诊断信息')}</button><button class="danger" onclick="malbitResetProgress()">↺ ${L('모든 진행 기록 초기화','すべての進行記録を初期化','Reset all progress','重置全部进度')}</button></div>`;
};

if(typeof SPEAKING_PROMPTS!=='undefined'){
  ['지하철이 지연되어서 약속 시간보다 조금 늦을 것 같습니다.','신청서를 제출하기 전에 빠진 내용이 없는지 확인해 주세요.','건강을 지키려면 충분히 자고 규칙적으로 운동해야 합니다.','행사가 취소되면 참가비는 다음 주 안에 환불됩니다.','의견이 다르더라도 상대방의 설명을 끝까지 듣는 태도가 필요합니다.','공공 자전거 이용자가 늘면서 대여소도 더 많아졌습니다.','자료를 요약할 때에는 중요한 수치와 변화 원인을 함께 써야 합니다.','불필요한 알림을 끄면 업무에 더 오래 집중할 수 있습니다.','환경 문제를 해결하려면 개인과 기업의 노력이 모두 필요합니다.','새로운 언어를 배울 때 실수를 두려워하지 않는 것이 중요합니다.','이번 전시회에서는 지역 작가들의 다양한 작품을 감상할 수 있습니다.','온라인 수업은 편리하지만 학습 계획을 스스로 관리해야 합니다.','물건을 교환하려면 영수증과 구입한 상품을 함께 가져오세요.','길이 많이 막힐 것 같아서 평소보다 일찍 출발했습니다.','추천 목록 밖의 자료도 찾아보면 더 다양한 관점을 만날 수 있습니다.','작은 목표라도 매일 꾸준히 실천하면 큰 변화를 만들 수 있습니다.'].forEach(x=>{if(!SPEAKING_PROMPTS.includes(x))SPEAKING_PROMPTS.push(x)})
}
window.malbitTranslateSpeaking=async()=>{if(typeof SPEAKING_PROMPTS==='undefined')return;const idx=(S.speaking?.index||0)%SPEAKING_PROMPTS.length,node=document.getElementById('malbitSpeakingTranslation');if(!node)return;node.textContent=L('번역 중…','翻訳中…','Translating…','正在翻译…');const target=S.lang==='ko'?'ja':S.lang,value=await translateCached(`speaking_v20_${target}_${idx}`,SPEAKING_PROMPTS[idx],'ko',target);if(node.isConnected)node.textContent=value};
function patchSpeaking(){const prompt=document.querySelector('.speakPrompt');if(!prompt||document.querySelector('.malbitSpeakingTools'))return;prompt.insertAdjacentHTML('afterend',`<div class="malbitSpeakingTools"><button onclick="playSpeakingModel()">🔊 ${L('모범 음성','モデル音声','Model voice','示范音频')}</button><button onclick="malbitTranslateSpeaking()">🌐 ${L('문장 번역','文を翻訳','Translate','翻译句子')}</button></div><div id="malbitSpeakingTranslation" class="malbitSpeakingTranslation"></div>`);const info=[...document.querySelectorAll('.infoCard')].pop();if(info&&/음성인식|音声認識|speech recognition|语音识别/i.test(info.textContent))info.outerHTML=`<details class="malbitSpeakingNote"><summary>${L('점수 산정 방식','スコアの仕組み','How scoring works','评分方式')}</summary>${info.outerHTML}</details>`}

function routeKey(){const q=currentT1();return`${S?.view||'home'}:${q?.mode||''}:${q?.phase||''}:${S.real?.phase||''}`}
function dynamicSubtitle(){
  const lv=level()===1?'I':'II',view=S.view,q=currentT1();if(view==='shorts')return`TOPIK ${lv} · SHORTS`;if(view==='infinity')return'TOPIK II · RANDOM PRACTICE';if(view==='t1game')return`TOPIK ${lv} · MALBIT TRAIL`;if(view==='t1quiz'&&q?.mode==='game')return`TOPIK ${Number(q.examLevel)===1?'I':'II'} · BATTLE`;if(view==='t1quiz')return`TOPIK ${Number(q?.examLevel)===2?'II':'I'} · ${q?.mode==='real'?'MOCK EXAM':'RANDOM PRACTICE'}`;if(view==='real'||view==='realSetup')return'TOPIK II · MOCK EXAM';return({review:'REVIEW · DETAILED EXPLANATIONS',stats:'LEARNING INSIGHTS',vocab:'SMART VOCABULARY',speaking:'SPEAKING PRACTICE',more:'SETTINGS & SUPPORT',home:`TOPIK ${lv} · DAILY KOREAN`}[view]||`TOPIK ${lv} · MALBIT`)
}
function patchShell(){
  document.documentElement.lang=S.lang==='zh'?'zh-CN':S.lang||'ko';document.title=`MALBIT · ${dynamicSubtitle()}`;const subtitle=document.querySelector('.top .title small');if(subtitle)subtitle.textContent=dynamicSubtitle();const toastEl=document.getElementById('toast');if(toastEl){toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite')}const overlay=document.getElementById('overlay');if(overlay){overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true')}const stats=document.getElementById('nav_stats')||document.getElementById('nav_speaking');if(stats){const icon=stats.querySelector('b');if(icon)icon.textContent='📊'}const vocab=document.getElementById('nav_vocab');if(vocab){const icon=vocab.querySelector('b');if(icon)icon.textContent='📚'}document.querySelectorAll('.choice').forEach(x=>x.setAttribute('aria-pressed',String(x.classList.contains('selected'))));
}
function patchHome(){
  const a=activitySnapshot(),goal=Math.max(1,Number(prefs.dailyGoal)||5),ring=document.querySelector('.tqV9Ring'),done=Math.min(a.todayCount,goal);if(ring){ring.style.setProperty('--p',`${Math.round(done/goal*360)}deg`);const b=ring.querySelector('b');if(b)b.innerHTML=`${done}<small>/${goal}</small>`}const goalText=document.querySelector('.tqV9Week h2 span');if(goalText)goalText.textContent=`${a.weekCount}/5${S.lang==='ko'?'일':''}`;document.querySelectorAll('.tqV9Day').forEach((node,i)=>{node.classList.toggle('on',!!a.week[i]?.on);const mark=node.querySelector('i');if(mark)mark.textContent=a.week[i]?.on?'✓':'·'});const streak=document.querySelector('.tqStreak');if(streak)streak.textContent=a.streak?`🔥 ${L(`${a.streak}일 연속`,`${a.streak}日連続`,`${a.streak}-day streak`,`${a.streak}天连续`)}`:`🔥 ${L('오늘 시작','今日スタート','Start today','今天开始')}`;
}
window.malbitCenterMap=()=>{const route=document.querySelector('.t1TrailRoute'),current=route?.querySelector('.t1TrailNode.current');if(route&&current)route.scrollTo({top:Math.max(0,current.offsetTop-route.clientHeight/2),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
function patchGameMap(){
  const screen=document.querySelector('.t1TrailScreen'),route=screen?.querySelector('.t1TrailRoute'),action=screen?.querySelector('.t1TrailAction'),board=route?.parentElement;if(!screen||!route||!action||!board)return;if(action.nextElementSibling!==route)board.insertBefore(action,route);if(!route.querySelector('.malbitMapTools'))route.insertAdjacentHTML('afterbegin',`<div class="malbitMapTools"><span>${L('전체 경로','全ルート','Full trail','完整路线')}</span><button onclick="malbitCenterMap()">⌖ ${L('현재 위치','現在地','Current','当前位置')}</button></div>`)
}
function postRender(){
  patchShell();if(S.view==='home')patchHome();if(S.view==='stats')renderPolishedStats(document.getElementById('screen'));if(S.view==='vocab')renderPolishedVocab(document.getElementById('screen'));if(S.view==='shorts')patchShorts();if(S.view==='speaking')patchSpeaking();if(S.view==='t1quiz'&&currentT1()?.mode==='game'&&currentT1()?.phase==='map')patchGameMap();
  const nextRoute=routeKey();if(nextRoute!==lastRoute){lastRoute=nextRoute;requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}))}observeCompletedT1();beginVisibleTimer();
}

if(typeof render==='function'){
  const baseRender=render;render=function(){const out=baseRender.apply(this,arguments);postRender();return out};
}

if('serviceWorker'in navigator&&location.protocol!=='file:'){const register=()=>navigator.serviceWorker.register('./sw.js').catch(()=>{});document.readyState==='complete'?register():window.addEventListener('load',register,{once:true})}

const polishStyle=document.createElement('style');polishStyle.textContent=`
  :where(button,a,input,textarea,summary):focus-visible{outline:3px solid #78a7ff!important;outline-offset:3px!important}
  .tqVocabEditLabel{display:block;margin:9px 0 5px;color:#5d6c82;font-size:9px;font-weight:900}.tqVocabInput{display:block;width:100%;margin-top:5px;border:2px solid #d9e3f1;border-radius:13px;padding:11px 12px;background:#fff;color:#17243a;font-size:16px;font-weight:850}.tqReviewedBadge{display:block;margin-bottom:8px;color:#287756!important}.malbitWritingRule{margin:9px 0 5px;border-radius:12px;background:#edf4ff;padding:9px 10px;color:#405d85;font-size:10px;font-weight:850;line-height:1.45}.malbitWritingGate{margin:5px 0 8px;color:#b34858;font-size:10px;font-weight:850}.malbitWritingGate.ready{color:#16805d}.randomWriteAction:disabled{box-shadow:none;filter:grayscale(.4)}
  .malbitPageTitle{display:flex;align-items:center;justify-content:space-between;margin:2px 2px 14px}.malbitPageTitle small{display:block;color:#7d91af;font-size:8px;font-weight:950;letter-spacing:.13em}.malbitPageTitle h1{margin:4px 0 0;font-size:22px;letter-spacing:-.045em}.malbitPageTitle>button,.malbitPageTitle>span{border:1px solid #2b4464;border-radius:13px;padding:9px;background:#10233d;color:#c9dcf6;font-size:10px;font-weight:900}
  .malbitStats{color:#18243b}.malbitStats .malbitPageTitle>button{background:#fff;border-color:#e2e7ef}.malbitStatsHero{display:grid;grid-template-columns:88px 1fr;gap:14px;align-items:center;border-radius:24px;padding:17px;background:linear-gradient(145deg,#315fd7,#7958e7);color:#fff;box-shadow:0 16px 38px rgba(63,72,189,.22)}.malbitGoalRing{width:82px;height:82px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#fff var(--p),rgba(255,255,255,.2) 0);position:relative}.malbitGoalRing:after{content:'';position:absolute;inset:7px;border-radius:50%;background:#5365df}.malbitGoalRing b{position:relative;z-index:2;font-size:24px}.malbitGoalRing small{font-size:10px;opacity:.8}.malbitStatsHero>div:last-child>small{font-size:8px;font-weight:900;opacity:.8}.malbitStatsHero h2{margin:5px 0;font-size:16px;line-height:1.25}.malbitStatsHero p{margin:0;font-size:9px;color:#e4e8ff}.malbitStatGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.malbitStatGrid article{border:1px solid #e4e8f0;border-radius:17px;padding:12px;background:#fff;box-shadow:0 7px 20px rgba(40,52,84,.05)}.malbitStatGrid b{display:block;font-size:20px}.malbitStatGrid small{font-size:8px;color:#7a8799}.malbitPace,.malbitSkills{border:1px solid #e4e8f0;border-radius:20px;padding:14px;background:#fff;margin-top:10px}.malbitPace h2,.malbitSectionTitle h2{font-size:13px;margin:0}.malbitPace>div{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:11px}.malbitPace span{text-align:center;border-radius:13px;background:#f2f5fa;padding:10px 5px}.malbitPace b,.malbitPace small{display:block}.malbitPace b{font-size:13px}.malbitPace small{margin-top:3px;color:#7c899c;font-size:7.5px}.malbitSectionTitle{display:flex;align-items:center;justify-content:space-between}.malbitSectionTitle>span{font-size:8px;color:#8a95a6}.malbitSkills article{display:grid;grid-template-columns:90px 1fr 36px;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #eef1f5}.malbitSkills article:last-child{border-bottom:0}.malbitSkills article b,.malbitSkills article small{display:block}.malbitSkills article b{font-size:10px}.malbitSkills article small{margin-top:2px;color:#909bab;font-size:7px}.malbitSkillBar{height:7px;border-radius:99px;background:#edf1f6;overflow:hidden}.malbitSkillBar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#477ee9,#785ce4)}.malbitSkills strong{font-size:10px;text-align:right}.malbitEmptyCompact{margin-top:10px;border:1px dashed #d5dce7;border-radius:14px;padding:13px;color:#7b8799;font-size:9px;line-height:1.5}.malbitRecommendation{margin-top:10px;border-radius:21px;padding:15px;background:#102340;color:#fff}.malbitRecommendation small{color:#7fa6e7;font-size:7px;font-weight:950;letter-spacing:.12em}.malbitRecommendation h2{font-size:14px;line-height:1.35}.malbitRecommendation button{width:100%;border:0;border-radius:13px;padding:11px;background:#4b7df0;color:#fff;font-size:10px;font-weight:950}
  .malbitShortTools{display:flex;justify-content:center;gap:7px;margin:-2px 0 13px}.malbitShortTools button{border:1px solid #dbe3ef;border-radius:999px;padding:8px 11px;background:#f4f7fb;color:#344761;font-size:9px;font-weight:900}.malbitExampleTranslation{margin-top:7px;border-top:1px solid rgba(60,80,110,.13);padding-top:7px;color:#53657d;font-size:9px;line-height:1.5}.malbitShortDaily{margin-top:10px;text-align:center;color:#71829a;font-size:9px}.malbitShortDaily b{color:#385fbb}
  .malbitVocabScreen .malbitPageTitle{color:#fff}.malbitVocabGuide{border:1px solid #294768;border-radius:19px;padding:13px;background:linear-gradient(145deg,#10233c,#112945)}.malbitVocabGuide b{font-size:11px}.malbitVocabGuide p{margin:5px 0 9px;color:#93aac8;font-size:9px;line-height:1.5}.malbitVocabGuide button{border:0;border-radius:11px;padding:8px 10px;background:#254b7b;color:#fff;font-size:8px;font-weight:900}.malbitVocabScreen>.malbitSectionTitle{margin:18px 3px 8px;color:#fff}.malbitVocabList{display:grid;gap:9px}.malbitVocabCard{border:1px solid #e3e8f0;border-radius:20px;padding:14px;background:#fff;color:#18243a;box-shadow:0 8px 24px rgba(0,0,0,.15)}.malbitVocabCard.due{border-color:#8caefa;box-shadow:0 8px 25px rgba(65,112,214,.18)}.malbitVocabTop{display:flex;justify-content:space-between;align-items:center}.malbitVocabTop span{color:#3268d3;font-size:8px;font-weight:950}.malbitVocabTop small{color:#8a96a8;font-size:7.5px}.malbitVocabCard h2{margin:9px 0;font-size:22px}.malbitVocabMeaning{border-radius:13px;padding:11px;background:#f2f5fa;color:#6d7a8e;font-size:11px;line-height:1.5}.malbitVocabMeaning.show{background:#eaf3ff;color:#263d5e;font-size:13px;font-weight:850}.malbitVocabActions{display:grid;grid-template-columns:1fr 45px 45px;gap:7px;margin-top:9px}.malbitVocabActions button{border:0;border-radius:12px;padding:10px;font-weight:900}.malbitVocabActions .reveal{background:#286cff;color:#fff}.malbitVocabActions .sound,.malbitVocabActions .remove{background:#edf1f6;color:#42526a}.malbitSrs{margin-top:10px;border-top:1px solid #e6ebf2;padding-top:9px}.malbitSrs>small{display:block;color:#748197;font-size:8px}.malbitSrs>div{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:7px}.malbitSrs button{border:1px solid #dce3ed;border-radius:11px;padding:8px 4px;background:#f7f9fc;color:#405069;font-size:8px;font-weight:900}.malbitSrs b{display:block;margin-top:2px;color:#2f66cc;font-size:7px}.malbitVocabEmpty{text-align:center;border:1px dashed #38516f;border-radius:23px;padding:24px 17px;background:#0e2037}.malbitVocabEmpty>span{font-size:34px}.malbitVocabEmpty h2{font-size:16px}.malbitVocabEmpty p{color:#91a6c2;font-size:9px;line-height:1.5}.malbitVocabEmpty>div{display:flex;align-items:center;justify-content:space-between;border-radius:14px;padding:11px;background:#182e4a;text-align:left}.malbitVocabEmpty>div b,.malbitVocabEmpty>div small{display:block}.malbitVocabEmpty>div small{color:#9db2cf}.malbitVocabEmpty>button{width:100%;margin-top:9px;border:0;border-radius:13px;padding:12px;background:#3674ec;color:#fff;font-weight:950}
  .malbitMoreScreen{color:#fff}.malbitSetting{border:1px solid #29415f;border-radius:20px;padding:14px;background:#0e2037;margin:9px 0}.malbitSetting h2{font-size:13px;margin:0 0 5px}.malbitSetting p{margin:0 0 10px;color:#91a6c2;font-size:9px;line-height:1.5}.malbitLangGrid{display:grid;grid-template-columns:1fr 1fr;gap:7px}.malbitLangGrid button{display:flex;align-items:center;gap:8px;border:1px solid #304c6e;border-radius:12px;padding:9px;background:#132b48;color:#b9cbe1}.malbitLangGrid button.on,.malbitChoiceRow button.on,.malbitMixGrid button.on{border-color:#6d91ff;background:#214c91;color:#fff;box-shadow:0 0 0 2px rgba(105,145,255,.12)}.malbitLangGrid i{font-style:normal;font-size:18px}.malbitChoiceRow{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.malbitChoiceRow button{border:1px solid #304c6e;border-radius:12px;padding:10px;background:#132b48;color:#b9cbe1;font-weight:900}.malbitMixGrid{display:grid;gap:7px}.malbitMixGrid button{display:flex;align-items:center;justify-content:space-between;border:1px solid #304c6e;border-radius:13px;padding:10px;background:#132b48;color:#fff;text-align:left}.malbitMixGrid small{color:#98afcc;font-size:8px}.malbitDataButtons{display:grid;grid-template-columns:1fr 1fr;gap:7px}.malbitDataButtons button,.malbitDataButtons label{display:grid;place-items:center;border:1px solid #345276;border-radius:12px;padding:10px;background:#183352;color:#dce9f9;font-size:8px;font-weight:900;text-align:center;cursor:pointer}.malbitDataButtons input{display:none}.malbitHelp{border:1px solid #29415f;border-radius:16px;background:#0d1d32;margin:8px 0;overflow:hidden}.malbitHelp summary{padding:13px;font-size:10px;font-weight:900;cursor:pointer}.malbitHelp p,.malbitHelp ul{margin:0;padding:0 16px 14px 31px;color:#93a8c4;font-size:9px;line-height:1.65}.malbitHelp p{padding-left:15px}.malbitSupport{display:grid;gap:7px;margin-top:12px}.malbitSupport button{border:1px solid #304b6d;border-radius:13px;padding:11px;background:#122b48;color:#d5e4f7;font-size:9px;font-weight:900}.malbitSupport button.danger{border-color:#633445;background:#321b27;color:#ffb8c6}
  .malbitSpeakingTools{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.malbitSpeakingTools button{border:1px solid #314b6c;border-radius:13px;padding:10px;background:#132b49;color:#fff;font-size:9px;font-weight:900}.malbitSpeakingTranslation:not(:empty){border:1px solid #d9e3f1;border-radius:14px;padding:11px;margin-top:8px;background:#f7f9fc;color:#30415a;font-size:11px;line-height:1.55}.malbitSpeakingNote{margin-top:11px;border:1px solid #293e5c;border-radius:15px;background:#0d1c31;overflow:hidden}.malbitSpeakingNote summary{padding:11px;color:#9eb2cf;font-size:9px;font-weight:900}.malbitSpeakingNote .infoCard{margin:0;border:0;border-top:1px solid #293e5c;border-radius:0}
  .t1TrailAction{position:sticky!important;top:72px;z-index:15;padding:9px 12px 10px!important;background:rgba(6,19,35,.96);backdrop-filter:blur(12px);border-bottom:1px solid #294766}.t1TrailRoute{height:min(55vh,520px);min-height:360px;overflow-y:auto;overscroll-behavior:contain;padding-top:44px!important;scrollbar-width:thin}.t1TrailGrid{height:680px!important}.malbitMapTools{position:absolute;z-index:12;left:8px;right:8px;top:7px;display:flex;align-items:center;justify-content:space-between;border:1px solid #294766;border-radius:11px;padding:6px 8px;background:rgba(6,19,35,.94);color:#91aac8;font-size:8px;font-weight:900}.malbitMapTools button{border:0;border-radius:9px;padding:6px 8px;background:#1c4775;color:#fff;font-size:8px;font-weight:900}.t1TrailScreen{padding-bottom:120px!important}
  .malbitOnboarding{position:fixed;inset:0;z-index:300;display:grid;place-items:center;padding:18px;background:rgba(2,8,18,.88);backdrop-filter:blur(14px)}.malbitOnboarding section{width:min(440px,100%);max-height:92vh;overflow:auto;border:1px solid #dce5f2;border-radius:27px;padding:22px;background:#f8fbff;color:#17243a;box-shadow:0 30px 90px rgba(0,0,0,.5)}.malbitOnboardLogo{display:grid;place-items:center;width:52px;height:52px;border-radius:17px;background:linear-gradient(135deg,#4b8cff,#856bff);color:#fff;font-weight:1000;font-size:18px}.malbitOnboarding section>small{display:block;margin-top:12px;color:#6d82a0;font-size:8px;font-weight:950;letter-spacing:.12em}.malbitOnboarding h1{margin:5px 0 7px;font-size:24px}.malbitOnboarding p{color:#65748b;font-size:10px;line-height:1.55}.malbitOnboarding h2{margin:17px 0 7px;font-size:11px}.malbitOnboardLang{display:grid;grid-template-columns:1fr 1fr;gap:7px}.malbitOnboardLang button,.malbitOnboardLevel button{border:2px solid #e1e7f0;border-radius:13px;padding:10px;background:#fff;color:#3e4d63;text-align:left}.malbitOnboardLang button.on,.malbitOnboardLevel button.on{border-color:#4d7cf0;background:#edf3ff;color:#204fae}.malbitOnboardLevel{display:grid;grid-template-columns:1fr 1fr;gap:7px}.malbitOnboardLevel b,.malbitOnboardLevel small{display:block}.malbitOnboardLevel small{margin-top:3px;color:#7b899c;font-size:8px}.malbitOnboardStart{width:100%;margin-top:16px;border:0;border-radius:15px;padding:14px;background:linear-gradient(135deg,#3f78ee,#795ee9);color:#fff;font-weight:950}
  @media(max-width:380px){.malbitSkills article{grid-template-columns:76px 1fr 33px}.malbitStatsHero{grid-template-columns:72px 1fr}.malbitGoalRing{width:68px;height:68px}.malbitDataButtons{grid-template-columns:1fr}.t1TrailRoute{height:50vh;min-height:330px}.t1TrailGrid{height:620px!important}}
`;
document.head.appendChild(polishStyle);

postRender();
})();
