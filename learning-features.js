// MALBIT · level-safe random practice, inline explanations, and custom long-press vocab capture.
(function(){
'use strict';

const I18N=window.MALBIT_EXPLANATIONS||{};
const text=(ko,ja,en,zh)=>typeof ml==='function'?ml(ko,ja,en,zh):ko;
const cleanChoice=v=>String(v??'').replace(/^[①②③④]\s*/,'').trim();
const answerNumber=q=>(Number(q?.answerIndex)||0)+1;
const answerChoice=q=>cleanChoice(q?.choices?.[q.answerIndex]||q?.answer||'');
const labels=()=>({
  title:text('바로 해설','すぐに解説','Instant explanation','即时解析'),
  answer:text('정답','正解','Answer','正确答案'),
  reason:text('왜 이 답일까요?','なぜこの答え？','Why this answer?','为什么选这个？')
});

function listeningExplanation(q){
  const lang=S.lang||'ko',pack=I18N.topik2Listening?.[q.id]||{},n=answerNumber(q);
  if(pack[lang]||pack.ko)return pack[lang]||pack.ko;
  const localizedChoice=lang==='ko'?answerChoice(q):lang==='ja'?cleanChoice((q.choicesJa||q.choices||[])[q.answerIndex]):answerChoice(q);
  if(lang==='ja')return `音声の要点は「${localizedChoice}」です。したがって${n}番が正解です。`;
  if(lang==='en')return `The key point in the audio is “${localizedChoice},” so option ${n} is correct.`;
  if(lang==='zh')return `录音的关键信息是“${localizedChoice}”，所以第${n}项正确。`;
  return `음성의 핵심 내용은 “${localizedChoice}”입니다. 따라서 ${n}번이 정답입니다.`;
}

function readingExplanation(q){
  const pack=I18N.topik2Reading?.[q.id]||{};
  return pack[S.lang]||(S.lang==='ja'?q.why:'')||pack.ko||'';
}

function localizedAnswerChoice(type,q){
  const lang=S.lang||'ko';if(type!=='listen'||lang==='ko')return answerChoice(q);
  if(lang==='ja')return cleanChoice((q.choicesJa||q.choices||[])[q.answerIndex]||answerChoice(q));
  return answerChoice(q);
}

function explanationBlock(type,q,compact=false){
  const l=labels(),reason=type==='listen'?listeningExplanation(q):readingExplanation(q),n=answerNumber(q),choice=localizedAnswerChoice(type,q);
  return `<section class="tqInlineExplanation ${compact?'compact':''}" aria-live="polite"><div class="tqInlineTitle"><span>✓</span><b>${l.title}</b></div><div class="tqInlineAnswer"><small>${l.answer}</small><strong>${n}. ${esc(choice)}</strong></div><h4>${l.reason}</h4><p>${esc(reason)}</p></section>`;
}

function writingExplanationBlock(q){
  const guide=I18N.topik2Writing?.[q?.id]?.[S.lang]||text('문제의 모든 조건과 핵심 정보가 답안에 들어갔는지 확인하세요.','設問の全条件と重要情報が答案に入っているか確認してください。','Check that the answer covers every condition and key detail.','请确认答案包含全部条件和关键信息。');
  return `<section class="tqInlineExplanation"><div class="tqInlineTitle"><span>✓</span><b>${text('바로 해설','すぐに解説','Instant explanation','即时解析')}</b></div><h4>${text('비교 포인트','比較ポイント','What to compare','对照要点')}</h4><p>${esc(guide)}</p></section>`;
}

// ----- Persistent wrong-answer review -----
const REVIEW_KEY='malbitWrongReviewV3';
let REVIEW={schema:3,items:{},mastered:0};
let reviewAttempt=null;
try{
  const saved=JSON.parse(localStorage.getItem(REVIEW_KEY)||'null');
  if(saved?.schema===3&&saved.items)REVIEW={...REVIEW,...saved,items:{...saved.items}};
}catch(e){}

function saveReview(){try{localStorage.setItem(REVIEW_KEY,JSON.stringify(REVIEW))}catch(e){}}
function reviewKey(level,type,id){return `${Number(level)===1?1:2}:${type==='listen'?'listen':'read'}:${String(id)}`}
function reviewQuestion(level,type,id,choiceOrder){
  if(window.MALBIT_BANK?.byId(id))return window.MALBIT_BANK.present(String(id),choiceOrder);
  const n=Number(id),lv=Number(level)===1?1:2;
  if(lv===1){
    const deck=type==='listen'?(window.TOPIK1_LISTENING_DATA||[]):(window.TOPIK1_READING_DATA||[]);
    return deck.find(x=>Number(x.id)===n)||null;
  }
  return type==='listen'?LS[n-1]:RW[n-1];
}
function recordReviewWrong(level,type,id,selected=-1,source='practice',meta={}){
  const choiceOrder=meta?.choiceOrder||null,q=reviewQuestion(level,type,id,choiceOrder);if(!q)return;
  const key=reviewKey(level,type,id),old=REVIEW.items[key]||{};
  REVIEW.items[key]={key,level:Number(level)===1?1:2,type:type==='listen'?'listen':'read',id:window.MALBIT_BANK?.byId(id)?String(id):Number(id),selected:Number(selected),answerIndex:Number(q.answerIndex),choiceOrder:q.choiceOrder||choiceOrder||null,source,lastWrongAt:Date.now(),wrongCount:(Number(old.wrongCount)||0)+1,retryCount:Number(old.retryCount)||0,active:true};
  saveReview();
}
function resolveReview(key,ok,selected){
  const item=REVIEW.items[key];if(!item)return;
  item.retryCount=(Number(item.retryCount)||0)+1;item.lastRetriedAt=Date.now();item.selected=Number(selected);
  if(ok){item.active=false;item.masteredAt=Date.now();REVIEW.mastered=(Number(REVIEW.mastered)||0)+1}
  else{item.active=true;item.lastWrongAt=Date.now();item.wrongCount=(Number(item.wrongCount)||0)+1}
  saveReview();
}
function scanLatestExamWrongAnswers(){
  try{
    if(S.lastResult?.mockSet&&typeof activateTopik2BankSet==='function')activateTopik2BankSet(S.lastResult.mockSet);
    const raw=JSON.stringify([S.lastResult||null,S.realAnswers||null]);let hash=2166136261;
    for(let i=0;i<raw.length;i++){hash^=raw.charCodeAt(i);hash=Math.imul(hash,16777619)}
    const signature=String(hash>>>0);if(REVIEW.latestExamSignature===signature)return;
    const mode=S.lastResult?.mode||'',includeListen=mode==='full'||mode==='listen',includeRead=mode==='full'||mode==='read';
    for(let i=1;i<=50;i++){
      const l=S.realAnswers?.listen?.[i],r=S.realAnswers?.read?.[i];
      const lq=LS[i-1],rq=RW[i-1];
      if(includeListen&&(!l||Number(l.selected)!==Number(lq?.answerIndex)))recordReviewWrong(2,'listen',lq?.bankId||i,l?.selected??-1,'exam',{choiceOrder:lq?.choiceOrder});
      if(includeRead&&(!r||Number(r.selected)!==Number(rq?.answerIndex)))recordReviewWrong(2,'read',rq?.bankId||i,r?.selected??-1,'exam',{choiceOrder:rq?.choiceOrder});
    }
    REVIEW.latestExamSignature=signature;saveReview();
  }catch(e){}
}
function localizedReviewType(type){return type==='listen'?text('듣기','聴解','Listening','听力'):text('읽기','読解','Reading','阅读')}
function reviewSourceLabel(source){
  const map={exam:text('실전 시험','模擬試験','Mock exam','模拟考试'),random:text('랜덤 실전','ランダム実戦','Random practice','随机实战'),game:text('게임 전투','ゲームバトル','Game battle','游戏战斗'),retry:text('복습 재도전','復習再挑戦','Review retry','复习重做')};
  return map[source]||map.random;
}
function originalQuestionParts(q,type){
  return {
    instruction:q.instruction||'',
    body:[q.stem,q.prompt&&q.prompt!==q.stem?q.prompt:''].filter(Boolean).join('\n\n'),
    script:type==='listen'?(q.script||''):'',
    choices:(q.choices||[]).map(cleanChoice)
  };
}
async function translatedReviewParts(item,q){
  const lang=S.lang||'ko',original=originalQuestionParts(q,item.type);
  if(lang==='ko')return original;
  const target=lang,base=`review_v3_${item.key}_${target}`;
  const reviewed=window.MALBIT_REVIEWED_TRANSLATIONS?.[item.level]?.[item.type]?.[item.id]?.[target];
  if(reviewed)return{fullText:reviewed,reviewed:true};
  let instruction='';
  if(item.type==='listen')instruction=text('', '音声と質問を読み、最も適切な答えを選んでください。','Read the audio transcript and question, then choose the best answer.','阅读听力原文和问题，选择最恰当的答案。');
  else instruction=text('', '次の文を読んで、最も適切な答えを選んでください。','Read the passage and choose the best answer.','阅读下面的内容，选择最恰当的答案。');
  let body='',script='',choices=[];
  if(item.level===2&&target==='ja'){
    const reviewed=String(q.translation||''),fullEnough=reviewed.length>=String(original.body||'').length*.45;
    body=item.type==='listen'?(q.promptJa||await translateCached(base+'_body',original.body,'ko','ja')):(fullEnough?reviewed:await translateCached(base+'_body_full',original.body,'ko','ja'));
    script=item.type==='listen'?(q.scriptJa||await translateCached(base+'_script',original.script,'ko','ja')):'';
    choices=item.type==='listen'&&Array.isArray(q.choicesJa)?q.choicesJa.map(cleanChoice):await Promise.all(original.choices.map((x,i)=>translateCached(base+'_choice_'+i,x,'ko','ja')));
  }else{
    const source=[original.instruction,original.script,original.body,...original.choices.map((x,i)=>`${i+1}. ${x}`)].filter(Boolean).join('\n\n');
    const fullText=await translateCached(`review_v4_whole_${item.key}_${target}`,source,'ko',target);
    return{fullText,reviewed:false};
  }
  return{instruction,body,script,choices};
}
function reviewQuestionMarkup(parts,translated=false){
  if(parts.fullText)return `<div class="tqReviewQuestion ${translated?'translated':''}">${parts.reviewed?`<small class="tqReviewedBadge">✓ ${text('문맥 검수 번역','文脈確認済み翻訳','Context-reviewed translation','语境校对翻译')}</small>`:''}<p>${esc(parts.fullText)}</p></div>`;
  return `<div class="tqReviewQuestion ${translated?'translated':''}">${parts.instruction?`<small>${esc(parts.instruction)}</small>`:''}${parts.script?`<div class="tqReviewScript">${esc(parts.script)}</div>`:''}${parts.body?`<p>${esc(parts.body)}</p>`:''}<ol>${parts.choices.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`;
}
async function localizedField(value,key,source='ja'){
  if(!value)return'';const lang=S.lang||'ko';if(lang===source)return value;
  return translateCached(`review_detail_${key}_${lang}`,value,source,lang);
}
const REVIEW_STOP_WORDS=new Set('것 수 이 그 저 은 는 이 가 을 를 에 에서 로 으로 와 과 도 만 의 한 하다 있다 없다 되다 아니다 그리고 그러나 그래서 때문에 대한 대해 가장 다음 내용 글 사람 경우 선택지 정답'.split(' '));
function reviewTokens(value){return [...new Set(String(value||'').replace(/[①②③④㉠㉡]/g,' ').match(/[가-힣A-Za-z0-9%]+/g)||[])].map(x=>x.toLowerCase()).filter(x=>x.length>1&&!REVIEW_STOP_WORDS.has(x))}
function bestEvidenceSentence(evidence,correct){
  const wanted=new Set(reviewTokens(correct)),parts=String(evidence||'').split(/(?<=[.!?。！？]|다\.)\s+|\n+/).map(x=>x.trim()).filter(Boolean);let best='',score=-1;
  for(const part of parts){const tokens=reviewTokens(part),hit=tokens.reduce((n,x)=>n+(wanted.has(x)?1:0),0),next=hit*100-Math.min(80,part.length);if(next>score){score=next;best=part}}
  return(best||String(evidence||'')).replace(/\s+/g,' ').slice(0,150)
}
function specificWrongChoiceReason(type,evidence,correct,wrong){
  const lang=S.lang||'ko',proof=bestEvidenceSentence(evidence,correct),evidenceSet=new Set(reviewTokens(evidence)),correctSet=new Set(reviewTokens(correct)),wrongOnly=reviewTokens(wrong).filter(x=>!evidenceSet.has(x)&&!correctSet.has(x)).slice(0,3),changed=wrongOnly.length?wrongOnly.join(' · '):cleanChoice(wrong).replace(/\s+/g,' ').slice(0,42);
  if(type==='listen')return [
    `실제 발화의 근거는 “${proof}”입니다. 정답 내용은 “${cleanChoice(correct)}”이고, 이 선택지는 “${changed}”로 시간·대상·행동의 관계를 바꾸거나 근거 없는 정보를 더했으므로 제외합니다.`,
    `実際の発話の根拠は「${proof}」です。正解は「${cleanChoice(correct)}」ですが、この選択肢は「${changed}」の部分で時刻・対象・行動の関係を変えるか、根拠のない情報を加えているため除外します。`,
    `The transcript evidence is “${proof}.” The supported answer is “${cleanChoice(correct)}”; this option changes or adds “${changed},” so its time, subject, or action does not match the audio.`,
    `原话依据是“${proof}”。正确内容是“${cleanChoice(correct)}”；此项把“${changed}”相关的时间、对象或行为关系改掉，或加入了无依据的信息，因此排除。`
  ][{ko:0,ja:1,en:2,zh:3}[lang]??0];
  return [
    `본문에서 직접 확인할 근거는 “${proof}”입니다. 이를 바꾸어 말한 정답은 “${cleanChoice(correct)}”이며, 이 선택지는 “${changed}”라는 주장이나 관계를 추가·반전해 본문과 일치하지 않습니다.`,
    `本文で直接確認できる根拠は「${proof}」です。その言い換えが「${cleanChoice(correct)}」であり、この選択肢は「${changed}」という主張や関係を追加・反転しているため本文と一致しません。`,
    `The direct evidence is “${proof}.” It supports “${cleanChoice(correct)}”; this option adds or reverses the claim or relationship around “${changed},” so it is not supported by the passage.`,
    `原文中的直接依据是“${proof}”，它支持“${cleanChoice(correct)}”；此项围绕“${changed}”增加或反转了原文关系，因此不成立。`
  ][{ko:0,ja:1,en:2,zh:3}[lang]??0];
}
async function detailedReviewExplanation(item,q){
  const type=item.type,lang=S.lang||'ko',n=answerNumber(q),answer=cleanChoice(q.choices?.[q.answerIndex]||q.answer||'');
  let reason='',grammar='',vocab='',elimination='';
  if(q.bankId){
    const base=lang==='ja'?(q.explanationJa||q.explanationKo):(q.explanationKo||q.explanation||'');reason=(lang==='ko'||lang==='ja')?base:await translateCached(`review_bank_${q.bankId}_${lang}`,base,'ko',lang);grammar=(q.targetSkills||[]).join(' · ');elimination=reason;
  }else if(item.level===2){
    reason=type==='listen'?listeningExplanation(q):readingExplanation(q);
    if(type==='read'){
      [grammar,vocab]=await Promise.all([localizedField(q.grammar,`${item.key}_grammar`),localizedField(q.vocab,`${item.key}_vocab`)]);
      elimination=lang==='ja'?(q.why||reason):(I18N.topik2Reading?.[q.id]?.[lang]||reason);
    }
  }else{
    reason=q.explanationI18n?.[lang]||q.explanationI18n?.ko||q.explanation||'';
    if(lang!=='ko'&&!q.explanationI18n?.[lang])reason=await translateCached(`review_t1_reason_${item.key}_${lang}`,reason,'ko',lang);
  }
  const evidence=type==='listen'?(q.script||q.prompt||''):(q.stem||'');
  const correctChoice=cleanChoice(q.choices?.[q.answerIndex]||q.answer||'');
  const choiceReason=(c,i)=>{
    if(i===Number(q.answerIndex))return reason;
    const supplied=q.choiceExplanationsI18n?.[lang]?.[i]||q.choiceExplanations?.[i];
    if(supplied)return supplied;
    return specificWrongChoiceReason(type,evidence,correctChoice,cleanChoice(c));
  };
  const wrongIntro=elimination||text('각 선택지의 시간·대상·행동을 근거 문장과 따로 대조해 보세요.','各選択肢の時刻・対象・行動を根拠文と個別に照合しましょう。','Compare the time, subject, and action in each option with the evidence.','请把每个选项的时间、对象和行为分别与依据句对照。');
  return `<section class="tqReviewDeep"><div class="tqInlineTitle"><span>✓</span><b>${text('상세 해설','詳しい解説','Detailed explanation','详细解析')}</b></div><div class="tqInlineAnswer"><small>${text('정답','正解','Answer','正确答案')}</small><strong>${n}. ${esc(answer)}</strong></div><h4>${text('판단 근거','判断の根拠','Key evidence','判断依据')}</h4><p>${esc(reason)}</p>${evidence?`<blockquote>${esc(evidence)}</blockquote>`:''}${grammar?`<h4>${text('문법 포인트','文法ポイント','Grammar point','语法要点')}</h4><p>${esc(grammar)}</p>`:''}${vocab?`<h4>${text('핵심 어휘','重要語彙','Key vocabulary','核心词汇')}</h4><p>${esc(vocab)}</p>`:''}<h4>${text('선택지별 오답 소거','選択肢ごとの消去','Option-by-option elimination','逐项排除')}</h4><p>${esc(wrongIntro)}</p><ol class="tqReviewChoiceAnalysis">${(q.choices||[]).map((c,i)=>`<li class="${i===q.answerIndex?'right':''}"><b>${i+1}. ${esc(cleanChoice(c))}</b><span>${esc(choiceReason(c,i))}</span></li>`).join('')}</ol></section>`;
}
function activeReviewItems(){return Object.values(REVIEW.items).filter(x=>x?.active&&reviewQuestion(x.level,x.type,x.id,x.choiceOrder)).sort((a,b)=>(Number(b.lastWrongAt)||0)-(Number(a.lastWrongAt)||0))}
function openReviewRetry(key){
  const item=REVIEW.items[key],q=item&&reviewQuestion(item.level,item.type,item.id,item.choiceOrder);if(!item||!q)return;
  reviewAttempt={key,selected:null,locked:false,showTranslation:false,translation:null};renderReviewRetry();
}
function renderReviewRetry(){
  const a=reviewAttempt,item=a&&REVIEW.items[a.key],q=item&&reviewQuestion(item.level,item.type,item.id,item.choiceOrder),body=document.getElementById('sheetBody');if(!a||!q||!body)return;
  const original=originalQuestionParts(q,item.type),selected=a.selected,locked=a.locked;
  body.innerHTML=`<div class="reward"><b>TOPIK ${item.level} · ${localizedReviewType(item.type)} ${item.id}</b><small>${text(`누적 오답 ${item.wrongCount}회`,`累計誤答 ${item.wrongCount}回`,`${item.wrongCount} misses`,`${item.wrongCount}次错题`)}</small></div>${reviewQuestionMarkup(original)}<button class="tqTranslationToggle" onclick="toggleReviewTranslation()">🌐 ${a.showTranslation?text('전체 번역 숨기기','全文翻訳を隠す','Hide full translation','隐藏全文翻译'):text('문제 전체를 내 언어로 보기','問題全体を自分の言語で見る','View the full question in my language','用我的语言查看整道题')}</button><div id="tqReviewTranslation" class="tqReviewTranslation ${a.showTranslation?'open':''}">${a.showTranslation?(a.translation?reviewQuestionMarkup(a.translation,true):`<div class="translationLoading">${text('전체 번역을 불러오는 중…','全文翻訳を読み込み中…','Loading the full translation…','正在加载全文翻译…')}</div>`):''}</div><div class="choices tqReviewChoices">${(q.choices||[]).map((c,i)=>{let cls='choice';if(selected===i)cls+=' selected';if(locked&&i===q.answerIndex)cls+=' correct';if(locked&&selected===i&&i!==q.answerIndex)cls+=' wrong';return `<button class="${cls}" ${locked?'disabled':''} onclick="reviewSelect(${i})"><span class="n">${i+1}</span><span>${esc(cleanChoice(c))}</span></button>`}).join('')}</div>${locked?`<div class="resultStrip ${selected===q.answerIndex?'good':'bad'}">${selected===q.answerIndex?text('정답입니다. 오답 스택에서 해결 처리했어요.','正解です。誤答スタックを解決済みにしました。','Correct — removed from your active wrong-answer stack.','答对了，已从待复习错题中移除。'):text(`정답은 ${q.answerIndex+1}번입니다. 다시 오답 스택에 남겨 두었어요.`,`正解は${q.answerIndex+1}番です。復習スタックに残しました。`,`The answer is option ${q.answerIndex+1}. It remains in your review stack.`,`正确答案是第${q.answerIndex+1}项，仍保留在复习错题中。`)}</div><div id="tqReviewDeep" class="translationLoading">${text('상세 해설을 준비하는 중…','詳しい解説を準備中…','Preparing the detailed explanation…','正在准备详细解析…')}</div>`:`<div class="doubleTapHint">${text('한 번 탭해 선택 · 같은 답을 한 번 더 탭하면 제출','1回タップで選択・同じ答えをもう一度タップして提出','Tap once to select · tap the same answer again to submit','点一次选择，再点同一答案提交')}</div>`}<button class="closeBtn" onclick="closeSheet();reviewAttempt=null;render()">${text('복습 목록으로','復習一覧へ','Back to review list','返回复习列表')}</button>`;
  document.getElementById('overlay')?.classList.add('open');
  if(a.showTranslation&&!a.translation)loadReviewTranslation();
  if(locked)detailedReviewExplanation(item,q).then(html=>{const el=document.getElementById('tqReviewDeep');if(el){el.className='';el.innerHTML=html;enhance(el)}});
  enhance(body);
}
async function loadReviewTranslation(){
  const a=reviewAttempt,item=a&&REVIEW.items[a.key],q=item&&reviewQuestion(item.level,item.type,item.id,item.choiceOrder);if(!a||!q)return;
  a.translation=await translatedReviewParts(item,q);if(reviewAttempt===a&&a.showTranslation)renderReviewRetry();
}
function toggleReviewTranslation(){if(!reviewAttempt)return;reviewAttempt.showTranslation=!reviewAttempt.showTranslation;renderReviewRetry()}
function reviewSelect(i){
  const a=reviewAttempt,item=a&&REVIEW.items[a.key],q=item&&reviewQuestion(item.level,item.type,item.id,item.choiceOrder);if(!a||!q||a.locked)return;
  i=Number(i);if(a.selected!==i){a.selected=i;return renderReviewRetry()}
  a.locked=true;resolveReview(a.key,i===Number(q.answerIndex),i);renderReviewRetry();
}
function clearMasteredReview(){for(const [key,item] of Object.entries(REVIEW.items))if(!item.active)delete REVIEW.items[key];saveReview();render()}

window.MALBIT_REVIEW={record:recordReviewWrong,resolve:resolveReview,items:()=>REVIEW.items};
window.openReviewRetry=openReviewRetry;window.reviewSelect=reviewSelect;window.toggleReviewTranslation=toggleReviewTranslation;window.clearMasteredReview=clearMasteredReview;

if(typeof renderInfMCQ==='function'){
  const baseRenderInfMCQ=renderInfMCQ;
  renderInfMCQ=function(q,type){
    return baseRenderInfMCQ(q,type);
  };
}

if(typeof renderRandomWriting==='function'){
  const baseRenderRandomWriting=renderRandomWriting;
  renderRandomWriting=function(q){
    let html=baseRenderRandomWriting(q);
    if(!S.infinity?.feedback)return html;
    const marker='<button class="primary" style="margin-top:10px"';
    return html.replace(marker,writingExplanationBlock(q)+marker);
  };
}

if(typeof buildExplanation==='function'){
  buildExplanation=async function(type,q){
    if(type==='listen'||type==='read')return explanationBlock(type,q,true);
    const model=q?.model||'';
    return `<h3>${text('모범답안','模範解答','Model answer','参考答案')}</h3><div class="answerBox"><p>${esc(model)}</p></div>${writingExplanationBlock(q)}`;
  };
}

if(typeof finishReal==='function'){
  const baseFinishReal=finishReal;
  finishReal=function(){const out=baseFinishReal();scanLatestExamWrongAnswers();return out};
}

// Random Practice records misses in the core submit/timeout handlers with the
// exact bank ID and displayed choice order. Do not wrap those handlers here:
// doing so would duplicate a miss under the legacy numeric question number.

if(typeof reviewPage==='function'){
  reviewPage=function(sc){
    navActive('review');scanLatestExamWrongAnswers();const items=activeReviewItems(),mastered=Object.values(REVIEW.items).filter(x=>x&&!x.active).length;
    sc.className='screen tqReviewScreen';
    sc.innerHTML=`<section class="tqReviewHero"><div><small>${text('누적 오답 복습','累積誤答レビュー','WRONG-ANSWER REVIEW','累计错题复习')}</small><h1>${text('틀린 문제를 끝까지 이해해요','間違えた問題を最後まで理解しよう','Understand every missed question','彻底理解每一道错题')}</h1><p>${text('오답은 자동으로 쌓이고, 다시 맞히면 해결 처리됩니다.','誤答は自動で蓄積され、解き直して正解すると解決済みになります。','Missed questions stack automatically and are resolved when you answer them correctly on retry.','错题会自动累积，重做答对后标记为已掌握。')}</p></div><strong>${items.length}<small>${text('복습 대기','復習待ち','to review','待复习')}</small></strong></section><div class="tqReviewStats"><div><b>${items.reduce((n,x)=>n+(Number(x.wrongCount)||0),0)}</b><small>${text('누적 오답','累積誤答','Total misses','累计错题')}</small></div><div><b>${mastered}</b><small>${text('해결한 문제','解決済み','Mastered','已掌握')}</small></div><div><b>${new Set(items.map(x=>x.level)).size}</b><small>${text('학습 급수','学習級','TOPIK levels','学习级别')}</small></div></div><div class="sectionTitle"><h2>${text('다시 풀 문제','解き直す問題','Retry queue','待重做题目')}</h2><span>${items.length}</span></div><div class="tqReviewQueue">${items.length?items.map(item=>{const q=reviewQuestion(item.level,item.type,item.id,item.choiceOrder),preview=String(q?.stem||q?.prompt||q?.script||'').replace(/\s+/g,' ').slice(0,68);return `<article class="tqReviewItem"><div class="tqReviewBadge">${item.type==='listen'?'🎧':'📖'}<small>TOPIK ${item.level}</small></div><div><b>${localizedReviewType(item.type)} ${item.id}</b><p>${esc(preview)}${preview.length>=68?'…':''}</p><small>${reviewSourceLabel(item.source)} · ${text(`${item.wrongCount}회 틀림`,`${item.wrongCount}回誤答`,`${item.wrongCount} misses`,`${item.wrongCount}次答错`)}</small></div><button onclick="openReviewRetry('${item.key}')">${text('다시 풀기','解き直す','Retry','重做')} ›</button></article>`}).join(''):`<div class="tqReviewEmpty"><span>✓</span><h3>${text('지금은 복습할 오답이 없어요','今は復習する誤答がありません','No missed questions to review','目前没有待复习错题')}</h3><p>${text('실전·랜덤·게임에서 틀린 문제가 자동으로 이곳에 쌓입니다.','模擬試験・ランダム・ゲームの誤答が自動でここに蓄積されます。','Misses from exams, random practice, and game battles appear here automatically.','实战、随机练习和游戏中的错题会自动出现在这里。')}</p></div>`}</div>${mastered?`<button class="tqClearMastered" onclick="clearMasteredReview()">${text(`해결 기록 ${mastered}개 정리`,`解決記録${mastered}件を整理`,`Clear ${mastered} mastered records`,`清理${mastered}条已掌握记录`)}</button>`:''}`;
  };
}

// TOPIK II game timers: 20% more time, then a length-aware reading/listening allowance.
if(typeof gameLimit==='function'){
  const baseGameLimit=gameLimit;
  gameLimit=function(stage){
    const base=Math.max(1,Number(baseGameLimit(stage))||1),meta=stageMeta(stage);let q=null,chars=0;
    if(meta.type==='read'){q=RW[meta.id-1];chars=String(q?.stem||'').length+(q?.choices||[]).join('').length}
    else if(meta.type==='listen'){q=LS[meta.id-1];chars=String(q?.script||'').length+String(q?.prompt||'').length+(q?.choices||[]).join('').length}
    else q=RW[meta.id-1];
    const threshold=meta.type==='listen'?150:meta.type==='read'?115:0;
    const lengthAllowance=threshold?Math.max(0,Math.min(36,Math.round((chars-threshold)*.09))):0;
    return Math.max(15,Math.round(base*1.2+lengthAllowance));
  };
}

// ----- Korean token normalization -----
const LEXICAL_WORDS=new Set(['사과','종이','회의','같이','많이','그만','정말','동안','시장','건강','생각','희망','공부','단어','의자','나라','바다','아래','위로','서로','지도']);
const ONE_SYLLABLE_STEMS=new Set(['책','집','밥','물','옷','문','길','차','비','빵','말','일','달','돈','손','발','눈','입','귀','방','병','표','산','약','빛','불','꿈','힘','줄','글','칸','곳','때','뒤','앞','속','밖','밤','낮','맛','몸','잠','값','꽃','배','강','숲','벽','돌','땅','풀','나','너','저']);
const PARTICLES=['에게서는','한테서는','으로부터','로부터','께서는','에게서','한테서','에서는','으로는','이라도','라도','까지','부터','조차','마저','밖에','처럼','만큼','보다','하고','이랑','께서','에서','에게','한테','으로','로는','로','께','랑','와','과','의','에','을','를','은','는','이','가','도','만'].sort((a,b)=>b.length-a.length);
const KNOWN_FORMS=new Map([['보지도','보다']]);
const BLOCKED_FRAGMENTS=new Set(['보지']);

function stripParticle(word){
  if(!/^[가-힣]+$/.test(word)||LEXICAL_WORDS.has(word))return word;
  for(const particle of PARTICLES){
    if(!word.endsWith(particle)||word===particle)continue;
    const stem=word.slice(0,-particle.length);
    if(stem.length>=2||ONE_SYLLABLE_STEMS.has(stem))return stem;
  }
  return word;
}

function normalizeKoreanTerm(value){
  let raw=String(value||'').replace(/^[①②③④\d.\s]+/,'').replace(/[“”‘’"'〈〉《》「」『』()[\]{}<>.,!?;:·…]/g,' ').replace(/\s+/g,' ').trim();
  if(!raw)return'';
  const normalized=raw.split(' ').map(word=>KNOWN_FORMS.get(word)||stripParticle(word)).join(' ').trim();
  return BLOCKED_FRAGMENTS.has(normalized)?'':normalized;
}

function removeUnsafeSavedFragments(){
  if(!Array.isArray(S.vocab))return;const clean=S.vocab.filter(v=>!BLOCKED_FRAGMENTS.has(String(v?.text||'').trim()));
  if(clean.length!==S.vocab.length){S.vocab=clean;save()}
}

const PHRASES=[
  {term:'-지도 못하다',re:/[가-힣]+지도\s+못[가-힣]+/,keys:['지도','못']},
  {term:'마음에 들다',re:/마음에\s+들[가-힣]*/,keys:['마음에','들']},{term:'눈에 띄다',re:/눈에\s+띄[가-힣]*/,keys:['눈에','띄']},
  {term:'손이 크다',re:/손이\s+크[가-힣]*/,keys:['손이','크']},{term:'기분이 풀리다',re:/기분이\s+풀[가-힣]*/,keys:['기분이','풀']},
  {term:'발이 넓다',re:/발이\s+넓[가-힣]*/,keys:['발이','넓']},{term:'귀가 얇다',re:/귀가\s+얇[가-힣]*/,keys:['귀가','얇']},
  {term:'한눈을 팔다',re:/한눈을\s+팔[가-힣]*/,keys:['한눈을','팔']},{term:'입이 무겁다',re:/입이\s+무겁[가-힣]*/,keys:['입이','무겁']},
  {term:'마음을 놓다',re:/마음을\s+놓[가-힣]*/,keys:['마음을','놓']},{term:'손을 대다',re:/손을\s+댄|손을\s+대[가-힣]*/,keys:['손을','댄','대']},
  {term:'-는 바람에',re:/[는은]\s+바람에/,keys:['바람에']},{term:'-기 마련이다',re:/기\s+마련[가-힣]*/,keys:['마련']},
  {term:'-는 김에',re:/[는은]\s+김에/,keys:['김에']},{term:'-(으)ㄹ수록',re:/[을ㄹ]수록/,keys:['수록']},
  {term:'-기는 하지만',re:/기는\s+하지만/,keys:['기는','하지만']},{term:'-느라고',re:/느라고/,keys:['느라고']},
  {term:'-다 보니',re:/다\s+보니/,keys:['보니']},{term:'-는 대신에',re:/는\s+대신에/,keys:['대신에']},
  {term:'-(으)려던 참이다',re:/려던\s+참[가-힣]*/,keys:['려던','참']},{term:'-(으)ㄹ 리가 없다',re:/[을ㄹ]\s+리가\s+없[가-힣]*/,keys:['리가','없']},
  {term:'-기만 하면',re:/기만\s+하면/,keys:['기만','하면']},{term:'-(으)ㄹ 뿐만 아니라',re:/뿐만\s+아니라/,keys:['뿐만','아니라']},
  {term:'-(으)ㄴ/는 척하다',re:/[는은]\s+척[가-힣]*/,keys:['척']}
];

function termFromToken(target){
  const raw=String(target?.textContent||'').trim(),zone=target?.closest?.('.vocab-zone'),full=String(zone?.textContent||'');
  for(const phrase of PHRASES){
    phrase.re.lastIndex=0;
    if(phrase.re.test(full)&&phrase.keys.some(k=>raw.includes(k)||k.includes(raw)))return{term:phrase.term,raw};
  }
  return{term:normalizeKoreanTerm(raw),raw};
}

// ----- Custom long-press menu -----
let pendingVocab=null,holdTimer=null,holdStart=null,suppressClickUntil=0;
function isSavableTerm(term){return !!term&&/[가-힣]/.test(term)&&!BLOCKED_FRAGMENTS.has(term)}
function sourceForVocab(){
  if(S.view==='t1quiz'){
    try{const q=JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null'),id=q?.ids?.[q.i];if(Number(q?.examLevel)===2&&/^[LR]\d+$/.test(String(id)))return`TOPIK II · ${id}`;const item=(window.TOPIK1_QUESTIONS||[]).find(x=>x.id===id);if(item)return`TOPIK I · ${item.section==='listening'?'L':'R'}${id}`}catch(e){}
  }
  if(S.view==='shorts')return text('숏츠','ショーツ','Shorts','短题');
  try{const x=currentSource();if(x)return`TOPIK II · ${x}`}catch(e){}
  return S.view||'';
}

function popup(){return document.getElementById('tqVocabPopup')}
function closeVocabPopup(){pendingVocab=null;popup()?.classList.remove('open')}
function showVocabPopup(term,raw){
  if(!isSavableTerm(term))return toast(text('완전한 단어나 표현을 눌러 주세요.','完全な単語・表現を長押ししてください。','Long-press a complete word or expression.','请长按完整的单词或表达。'));
  pendingVocab={term,raw};const p=popup();if(!p)return;
  p.querySelector('.tqVocabTerm').textContent=term;
  const input=p.querySelector('.tqVocabInput');if(input){input.value=term;input.setAttribute('aria-label',text('저장할 단어 또는 표현','保存する単語・表現','Word or expression to save','要保存的单词或表达'))}
  const note=p.querySelector('.tqVocabNormalize');
  note.textContent=raw!==term?text(`“${raw}”에서 조사를 정리해 “${term}”로 저장합니다.`,`「${raw}」の助詞を除き、「${term}」として保存します。`,`The particle is removed from “${raw}”; “${term}” will be saved.`,`已从“${raw}”中去除助词，将保存为“${term}”。`):text('이 표현 그대로 저장합니다.','この表現をそのまま保存します。','This expression will be saved as shown.','将按当前表达保存。');
  p.classList.add('open');
}

function manualVocabTerm(value){
  let text=String(value||'');try{text=text.normalize('NFKC')}catch(e){}
  return text.replace(/^[\s“”‘’"'〈〉《》「」『』]+|[\s“”‘’"'〈〉《》「」『』]+$/g,'').replace(/\s+/g,' ').trim();
}
function vocabKey(value){return manualVocabTerm(value).replace(/[‐‑‒–—]/g,'-').toLocaleLowerCase()}
function hasVocabTerm(term){const key=vocabKey(term);return !!key&&S.vocab.some(v=>vocabKey(v?.text)===key)}
function storeVocab(entry){
  S.vocab=Array.isArray(S.vocab)?S.vocab:[];
  if(hasVocabTerm(entry.text))return false;
  S.vocab.unshift({ja:'',meanings:{},show:false,...entry});save();return true;
}

function addVocabTerm(term=pendingVocab?.term){
  const edited=popup()?.querySelector('.tqVocabInput')?.value;
  const word=normalizeKoreanTerm(edited||term)||String(edited||term||'').trim();if(!isSavableTerm(word))return toast(text('완전한 단어나 표현으로 고쳐 주세요.','完全な単語・表現に直してください。','Edit this into a complete word or expression.','请修改为完整的单词或表达。'));
  if(hasVocabTerm(word)){
    closeVocabPopup();return toast(text('이미 단어장에 있어요.','すでに単語帳にあります。','Already in your vocabulary.','已经在单词本中。'));
  }
  storeVocab({text:word,source:sourceForVocab()});
  try{localStorage.setItem('malbitVocabLongPressUsed','1')}catch(e){}
  closeVocabPopup();toast(text(`“${word}” 단어장에 추가했어요.`,`「${word}」を単語帳に追加しました。`,`Added “${word}” to Vocabulary.`,`已将“${word}”加入单词本。`));
}

function installPopup(){
  if(popup())return;
  const el=document.createElement('div');el.id='tqVocabPopup';el.className='tqVocabPopup';el.innerHTML=`<button class="tqVocabBackdrop" aria-label="${text('닫기','閉じる','Close','关闭')}"></button><section role="dialog" aria-modal="true" aria-labelledby="tqVocabPopupTitle"><div class="tqVocabHandle"></div><small>${text('길게 누른 표현','長押しした表現','Long-pressed expression','长按的表达')}</small><strong id="tqVocabPopupTitle" class="tqVocabTerm"></strong><label class="tqVocabEditLabel">${text('저장 형태 확인·수정','保存形を確認・修正','Review or edit the saved form','确认或修改保存形式')}<input class="tqVocabInput" lang="ko" autocomplete="off" spellcheck="false"></label><p class="tqVocabNormalize"></p><button class="tqVocabAdd">＋ ${text('단어장에 추가하기','単語帳に追加','Add to Vocabulary','加入单词本')}</button><button class="tqVocabCancel">${text('취소','キャンセル','Cancel','取消')}</button></section>`;
  document.body.appendChild(el);el.querySelector('.tqVocabBackdrop').onclick=closeVocabPopup;el.querySelector('.tqVocabCancel').onclick=closeVocabPopup;el.querySelector('.tqVocabAdd').onclick=()=>addVocabTerm();
}

function tokenizeElement(el){
  if(!el||el.dataset.vocabReady==='1')return;el.dataset.vocabReady='1';el.classList.add('vocab-zone');
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    if(node.parentElement?.closest('.vocab-token'))continue;
    const value=node.nodeValue||'',re=/[가-힣]+/g;if(!re.test(value))continue;re.lastIndex=0;
    const frag=document.createDocumentFragment();let at=0,m;
    while((m=re.exec(value))){if(m.index>at)frag.append(value.slice(at,m.index));const span=document.createElement('span');span.className='vocab-token';span.textContent=m[0];span.dataset.vocabTerm=m[0];frag.append(span);at=m.index+m[0].length}if(at<value.length)frag.append(value.slice(at));node.replaceWith(frag);
  }
}

function pointerTarget(e){return e.target?.closest?.('.vocab-token')}
function clearHold(){if(holdTimer)clearTimeout(holdTimer);holdStart?.target?.classList?.remove('holding');holdTimer=null;holdStart=null}
document.addEventListener('pointerdown',e=>{
  const target=pointerTarget(e);if(!target||e.button>0)return;clearHold();target.classList.add('holding');holdStart={x:e.clientX,y:e.clientY,target,id:e.pointerId};
  holdTimer=setTimeout(()=>{if(!target.isConnected)return clearHold();const hit=typeof document.elementFromPoint==='function'?document.elementFromPoint(holdStart.x,holdStart.y):target;if(hit!==target&&!target.contains(hit))return clearHold();const info=termFromToken(target);suppressClickUntil=Date.now()+700;try{navigator.vibrate?.(18)}catch(_){}showVocabPopup(info.term,info.raw);clearHold()},550);
},{capture:true});
document.addEventListener('pointermove',e=>{if(!holdStart||e.pointerId!==holdStart.id)return;if(Math.hypot(e.clientX-holdStart.x,e.clientY-holdStart.y)>9)clearHold()},{capture:true,passive:true});
document.addEventListener('pointerup',clearHold,{capture:true});document.addEventListener('pointercancel',clearHold,{capture:true});
document.addEventListener('click',e=>{if(Date.now()<suppressClickUntil&&pointerTarget(e)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},{capture:true});
document.addEventListener('contextmenu',e=>{if(pointerTarget(e))e.preventDefault()},{capture:true});

// ----- Discovery UI and vocab page compatibility -----
function showVocabGuide(){
  const body=document.getElementById('sheetBody');if(!body)return;
  body.innerHTML=`<div class="reward"><b>☝ ${text('길게 눌러 단어 저장','長押しで単語を保存','Long-press to save words','长按保存单词')}</b><small>${text('문제를 풀다가 바로 단어장으로','問題を解きながら単語帳へ','Save while you solve','做题时直接收藏')}</small></div><div class="tqGuideSteps"><div><i>1</i><p><b>${text('한국어 표현을 0.5초간 누르기','韓国語の表現を0.5秒長押し','Hold a Korean expression for 0.5 sec','长按韩语表达0.5秒')}</b><small>${text('브라우저 복사 메뉴 대신 말빛 메뉴가 열립니다.','ブラウザのコピーではなくMALBITメニューが開きます。','The MALBIT menu opens instead of the browser copy menu.','不会弹出浏览器复制菜单，而会打开MALBIT菜单。')}</small></p></div><div><i>2</i><p><b>${text('저장될 단어·표현 확인','保存する単語・表現を確認','Check the saved word or phrase','确认保存的单词或表达')}</b><small>${text('문맥을 확인해 “친구를 → 친구”, “보지도 못한 → -지도 못하다”처럼 정리하며 불완전한 조각은 저장하지 않습니다.','文脈を確認し、「친구를 → 친구」「보지도 못한 → -지도 못하다」のように整え、不完全な断片は保存しません。','Context is checked: “친구를 → 친구” and “보지도 못한 → -지도 못하다.” Incomplete fragments are rejected.','系统会结合语境整理为“친구를 → 친구”“보지도 못한 → -지도 못하다”，并拒绝不完整片段。')}</small></p></div><div><i>3</i><p><b>${text('단어장에 추가하기','単語帳に追加','Add to Vocabulary','加入单词本')}</b><small>${text('아래 단어장 탭에서 언제든 다시 볼 수 있어요.','下の単語帳タブでいつでも見直せます。','Review it anytime from the Vocabulary tab.','可随时在下方“单词本”中复习。')}</small></p></div></div><button class="closeBtn" onclick="closeSheet()">${text('알겠어요','わかりました','Got it','知道了')}</button>`;
  document.getElementById('overlay')?.classList.add('open');
}

window.showVocabGuide=showVocabGuide;
window.addVocabTerm=addVocabTerm;
if(typeof addVocab==='function')addVocab=function(){addVocabTerm(typeof selectedText==='string'?selectedText:'')};

let vocabPageMode='saved',vocabLibraryLevel=1,vocabLibraryType='all',vocabLibraryQuery='';
function vocabTypeGroup(type){return type==='grammar'?'grammar':type==='idiom'||type==='expression'?'idiom':'word'}
function vocabTypeLabel(type){
  const group=vocabTypeGroup(type);
  return group==='grammar'?text('문법','文法','Grammar','语法'):group==='idiom'?text('숙어·표현','慣用句・表現','Idioms & expressions','惯用语·表达'):text('단어·어휘','単語・語彙','Words & vocabulary','单词·词汇');
}
function vocabLevelLabel(level){return Number(level)===1?'TOPIK I':'TOPIK II'}
function manualSource(){return text('직접 입력','直接入力','Manual entry','手动输入')}
window.malbitSetVocabPageMode=mode=>{vocabPageMode=mode==='library'?'library':'saved';render()};
window.malbitSetVocabLibraryLevel=level=>{vocabLibraryLevel=Number(level)===2?2:1;vocabLibraryQuery='';render()};
window.malbitSetVocabLibraryType=type=>{vocabLibraryType=['all','word','idiom','grammar'].includes(type)?type:'all';vocabLibraryQuery='';render()};
window.malbitAddManualVocab=async event=>{
  event?.preventDefault?.();const input=document.getElementById('tqManualVocabTerm'),button=event?.currentTarget?.querySelector?.('button[type="submit"]'),raw=manualVocabTerm(input?.value),note=String(document.getElementById('tqManualVocabMeaning')?.value||'').trim();
  if(!raw)return toast(text('한국어 또는 내 언어로 단어를 입력해 주세요.','韓国語または自分の言語で単語を入力してください。','Enter a word in Korean or your language.','请用韩语或自己的语言输入单词。')),false;
  const foreign=!/[가-힣]/.test(raw);let term=raw;
  if(foreign){
    if(S.lang==='ko')return toast(text('한국어 단어·숙어·문법을 입력해 주세요.','韓国語の単語・慣用句・文法を入力してください。','Enter a Korean word, idiom, or grammar form.','请输入韩语单词、惯用语或语法。')),false;
    if(button){button.disabled=true;button.dataset.label=button.textContent;button.textContent=text('한국어로 바꾸는 중…','韓国語に変換中…','Converting to Korean…','正在转换为韩语…')}
    try{term=manualVocabTerm(await translateCached(`manual_vocab_v33_${S.lang}_${raw}`,raw,S.lang,'ko'))}finally{if(button){button.disabled=false;button.textContent=button.dataset.label||text('단어장에 저장','単語帳に保存','Save to vocabulary','保存到单词本')}}
  }
  if(!isSavableTerm(term))return toast(text('한국어 단어로 변환하지 못했어요. 철자를 확인해 주세요.','韓国語の単語に変換できませんでした。入力を確認してください。','Could not convert that to a Korean word. Check the spelling.','无法转换为韩语单词，请检查拼写。')),false;
  const meanings={};if(foreign)meanings[S.lang]=note||raw;
  if(!storeVocab({text:term,source:manualSource(),note,meanings,show:!!note||foreign,manual:true,inputOriginal:foreign?raw:'',dueAt:Date.now(),interval:1,repetitions:0}))return toast(text('이미 단어장에 있어요.','すでに単語帳にあります。','Already in your vocabulary.','已经在单词本中。')),false;
  toast(foreign?text(`“${raw}” → “${term}”으로 저장했어요.`,`「${raw}」→「${term}」として保存しました。`,`Saved “${raw}” as “${term}”.`,`已将“${raw}”以“${term}”保存。`):text(`“${term}” 직접 추가 완료.`,`「${term}」を追加しました。`,`Added “${term}”.`,`已添加“${term}”。`));render();return false;
};
window.malbitAddLibraryVocab=(level,index)=>{
  const item=window.MALBIT_SHORTS_DECKS?.[Number(level)]?.[Number(index)];if(!item)return;
  if(!storeVocab({text:item.term,source:`${vocabLevelLabel(level)} · ${vocabTypeLabel(item.type)}`,meanings:{...(item.meaning||{})},ja:item.meaning?.ja||'',example:item.example||'',level:Number(level),type:item.type}))return toast(text('이미 단어장에 있어요.','すでに単語帳にあります。','Already in your vocabulary.','已经在单词本中。'));
  toast(text(`“${item.term}” 단어장에 저장했어요.`,`「${item.term}」を単語帳に保存しました。`,`Saved “${item.term}” to your vocabulary.`,`已将“${item.term}”保存到单词本。`));render();
};
window.malbitPracticeVocabLibrary=level=>{try{localStorage.setItem('topikQuestExamLevel',Number(level)===2?'2':'1')}catch(e){};if(typeof startShorts==='function')startShorts()};
window.malbitSearchVocabLibrary=input=>{
  vocabLibraryQuery=String(input?.value||'').trim().toLocaleLowerCase();let visible=0;
  document.querySelectorAll('.tqLibraryCard').forEach(card=>{const match=!vocabLibraryQuery||String(card.dataset.search||'').includes(vocabLibraryQuery);card.hidden=!match;if(match)visible++});
  const count=document.getElementById('tqLibraryVisibleCount');if(count)count.textContent=String(visible);const empty=document.getElementById('tqLibrarySearchEmpty');if(empty)empty.hidden=visible>0;
};

const VOCAB_GROWTH_THRESHOLDS=[0,1,3,6,10,16,24,35,50,75];
function vocabGrowthStage(count){for(let i=VOCAB_GROWTH_THRESHOLDS.length-1;i>=0;i--)if(count>=VOCAB_GROWTH_THRESHOLDS[i])return i;return 0}
function vocabGrowthName(stage){const names={ko:['씨앗','첫 싹','두 잎','어린 모종','튼튼한 모종','어린 나무','푸른 나무','꽃봉오리','꽃 핀 나무','열매나무'],ja:['種','芽','双葉','苗','丈夫な苗','若木','緑の木','つぼみ','花の木','実のなる木'],en:['Seed','First sprout','Two leaves','Seedling','Strong seedling','Young tree','Green tree','Budding tree','Flowering tree','Fruit tree'],zh:['种子','嫩芽','双叶','幼苗','茁壮幼苗','小树','绿树','含苞树','开花树','结果树']};return(names[S.lang]||names.ko)[stage]}
function vocabGrowthSvg(stage){const canopy=stage>=5,leafCount=Math.max(0,stage-4),fruit=stage>=9;return `<svg viewBox="0 0 220 170" role="img" aria-label="${esc(vocabGrowthName(stage))}"><defs><linearGradient id="vocabSoil" x1="0" x2="1"><stop stop-color="#a8693d"/><stop offset="1" stop-color="#704329"/></linearGradient><linearGradient id="vocabLeaf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8ee75f"/><stop offset="1" stop-color="#249b57"/></linearGradient></defs><ellipse cx="110" cy="146" rx="78" ry="15" fill="url(#vocabSoil)" opacity=".92"/><ellipse cx="110" cy="144" rx="57" ry="8" fill="#d99b5f" opacity=".45"/>${stage===0?`<path d="M102 140c-11-11 0-24 10-20 13 6 8 23-10 20Z" fill="#e9bd58"/><path d="M109 124c2 5 2 9 0 14" stroke="#9b7130" stroke-width="3"/>`:''}${stage>0&&!canopy?`<path d="M111 143c-1-24 ${stage>=3?'-2-49':'0-36'} 2-${32+stage*8}" fill="none" stroke="#43a859" stroke-width="${4+stage*.7}" stroke-linecap="round"/><ellipse cx="${86-stage}" cy="${116-stage*8}" rx="${15+stage}" ry="${8+stage/2}" fill="url(#vocabLeaf)" transform="rotate(22 ${86-stage} ${116-stage*8})"/>${stage>=2?`<ellipse cx="${135+stage}" cy="${105-stage*7}" rx="${15+stage}" ry="${8+stage/2}" fill="url(#vocabLeaf)" transform="rotate(-25 ${135+stage} ${105-stage*7})"/>`:''}${stage>=3?`<ellipse cx="92" cy="78" rx="18" ry="9" fill="url(#vocabLeaf)" transform="rotate(18 92 78)"/>`:''}${stage>=4?`<ellipse cx="130" cy="64" rx="19" ry="10" fill="url(#vocabLeaf)" transform="rotate(-20 130 64)"/>`:''}`:''}${canopy?`<path d="M106 145c5-28 0-51 5-78M111 103 83 80M111 91l31-24" fill="none" stroke="#8b5938" stroke-width="${10+stage}" stroke-linecap="round"/><g fill="url(#vocabLeaf)"><circle cx="81" cy="72" r="${31+leafCount}"/><circle cx="119" cy="55" r="${37+leafCount}"/><circle cx="153" cy="76" r="${30+leafCount}"/><circle cx="111" cy="88" r="${35+leafCount}"/></g>${stage>=7?`<g fill="${stage===7?'#ffe8a3':'#ffd4ed'}" stroke="#fff" stroke-width="2"><circle cx="72" cy="66" r="6"/><circle cx="130" cy="38" r="6"/><circle cx="163" cy="75" r="6"/>${stage>=8?`<circle cx="105" cy="83" r="6"/><circle cx="144" cy="94" r="6"/>`:''}</g>`:''}${fruit?`<g fill="#ff6b62" stroke="#ffd36b" stroke-width="2"><circle cx="82" cy="87" r="8"/><circle cx="126" cy="65" r="8"/><circle cx="154" cy="91" r="8"/><circle cx="105" cy="34" r="8"/></g>`:''}`:''}</svg>`}
function vocabGardenHtml(){const count=S.vocab.length,stage=vocabGrowthStage(count),next=VOCAB_GROWTH_THRESHOLDS[stage+1];return `<section class="tqVocabGarden"><div class="tqVocabGardenArt">${vocabGrowthSvg(stage)}</div><div><small>${text('나의 말빛 정원','私のことばの庭','My word garden','我的词语花园')} · ${stage+1}/10</small><h3>${vocabGrowthName(stage)}</h3><p>${next?text(`${next-count}개를 더 심으면 다음 단계로 자라요.`,`あと${next-count}語で次の段階へ育ちます。`,`Save ${next-count} more to reach the next stage.`,`再收藏${next-count}个即可成长到下一阶段。`):text('멋진 열매나무로 자랐어요!','立派な実のなる木に育ちました！','Your garden has grown a fruit tree!','已经长成硕果累累的大树！')}</p><div class="tqVocabGardenProgress"><i style="width:${next?Math.max(6,Math.round((count-VOCAB_GROWTH_THRESHOLDS[stage])/(next-VOCAB_GROWTH_THRESHOLDS[stage])*100)):100}%"></i></div><b>${count} ${text('개 표현','語','saved','个表达')}</b></div></section>`}
function savedVocabHtml(target,flag){
  const cards=S.vocab.map((v,i)=>{const meaning=v.note||v.meanings?.[target]||(target==='ja'?v.ja:'')||'…',example=v.example?`<small class="tqVocabExample">${text('예문','例文','Example','例句')} · ${esc(v.example)}</small>`:'';return `<article class="vocabCard tqSavedVocabCard"><div class="vocabHead"><div class="vocabWord">${esc(v.text)}</div><span class="source">${esc(v.source||manualSource())}</span></div><div class="vocabAnswer ${v.show?'show':''}">${v.show?`<b>${esc(meaning)}</b>${example}`:''}</div><div class="vocabActions"><button class="reveal" onclick="revealVocab(${i})">${flag} ${v.show?text('뜻 숨기기','意味を隠す','Hide meaning','隐藏释义'):text('뜻 보기','意味を見る','Reveal meaning','查看释义')}</button><button class="delete" onclick="deleteVocab(${i})">×</button></div>${v.show&&typeof malbitVocabGrade==='function'?`<div class="tqVocabSrs"><small>${text('다음 복습 간격','次の復習間隔','Next review interval','下次复习间隔')}</small><button onclick="malbitVocabGrade(${i},'hard')">${text('어려움','難しい','Hard','困难')}</button><button onclick="malbitVocabGrade(${i},'good')">${text('보통','普通','Good','一般')}</button><button onclick="malbitVocabGrade(${i},'easy')">${text('쉬움','簡単','Easy','简单')}</button></div>`:''}</article>`}).join('');
  return `${vocabGardenHtml()}<section class="tqManualVocab"><div><small>MY VOCABULARY</small><h3>${text('직접 추가','直接追加','Add manually','手动添加')}</h3><p>${text('한국어나 내 언어로 입력하면 한국어 표제어로 정리해 저장해요.','韓国語または自分の言語で入力すると、韓国語の見出し語として保存します。','Type in Korean or your language; MALBIT saves a Korean headword.','用韩语或自己的语言输入，系统会保存为韩语词条。')}</p></div><form onsubmit="return malbitAddManualVocab(event)"><label>${text('한국어 또는 내 언어','韓国語または自分の言語','Korean or your language','韩语或自己的语言')}<input id="tqManualVocabTerm" maxlength="60" autocomplete="off" required placeholder="${text('예: 마음에 들다','例：好きになる / 마음에 들다','e.g. dependable or 믿음직하다','例：可靠 / 믿음직하다')}"></label><label>${text('뜻·메모 (선택)','意味・メモ（任意）','Meaning or note (optional)','释义或备注（选填）')}<input id="tqManualVocabMeaning" maxlength="120" autocomplete="off" placeholder="${text('내가 기억하기 쉬운 설명','覚えやすい説明','A note that helps you remember','便于记忆的说明')}"></label><button type="submit">＋ ${text('단어장에 저장','単語帳に保存','Save to vocabulary','保存到单词本')}</button></form></section><div class="tqVocabCompactTip"><span>☝ ${text('문제 속 표현은 길게 눌러서도 저장할 수 있어요.','問題の表現は長押しでも保存できます。','You can also long-press expressions in questions to save them.','也可以长按题目中的表达进行保存。')}</span><button onclick="showVocabGuide()">${text('사용법','使い方','How it works','使用方法')} ›</button></div>${cards||`<div class="tqVocabEmpty"><i>＋</i><h3>${text('아직 저장한 표현이 없어요.','保存した表現はまだありません。','No saved expressions yet.','还没有保存的表达。')}</h3><p>${text('위에서 직접 입력하거나 TOPIK 학습목록에서 골라 담아 보세요.','上で直接入力するか、TOPIK学習リストから追加しましょう。','Add one above or choose from the TOPIK study library.','请在上方手动添加，或从TOPIK学习列表中选择。')}</p></div>`}`;
}

function libraryVocabHtml(){
  const level=vocabLibraryLevel,deck=window.MALBIT_SHORTS_DECKS?.[level]||[],rows=deck.map((item,index)=>({item,index})).filter(({item})=>vocabLibraryType==='all'||vocabTypeGroup(item.type)===vocabLibraryType),query=vocabLibraryQuery;
  const cards=rows.map(({item,index})=>{const meaning=item.meaning?.[S.lang]||item.meaning?.ko||'',search=[item.term,meaning,item.meaning?.ko,item.meaning?.ja,item.meaning?.en,item.meaning?.zh,item.example].join(' ').toLocaleLowerCase(),saved=hasVocabTerm(item.term);return `<article class="tqLibraryCard" data-search="${esc(search)}" ${query&&!search.includes(query)?'hidden':''}><div class="tqLibraryMeta"><span class="${vocabTypeGroup(item.type)}">${vocabTypeLabel(item.type)}</span><small>${vocabLevelLabel(level)}</small></div><h3>${esc(item.term)}</h3><p>${esc(meaning)}</p><div class="tqLibraryExample"><b>${text('예문','例文','Example','例句')}</b>${esc(item.example||'')}</div><button onclick="malbitAddLibraryVocab(${level},${index})" ${saved?'disabled':''}>${saved?'✓ '+text('저장됨','保存済み','Saved','已保存'):'＋ '+text('내 단어장에 추가','自分の単語帳に追加','Add to my vocabulary','添加到我的单词本')}</button></article>`}).join('');
  const visible=rows.filter(({item})=>!query||[item.term,item.meaning?.[S.lang],item.meaning?.ko,item.meaning?.ja,item.meaning?.en,item.meaning?.zh,item.example].join(' ').toLocaleLowerCase().includes(query)).length;
  const filter=(key,label)=>`<button class="${vocabLibraryType===key?'on':''}" onclick="malbitSetVocabLibraryType('${key}')">${label}</button>`;
  return `<section class="tqLibraryHero"><small>TOPIK STUDY LIBRARY</small><h3>${text('시험에 자주 쓰이는 핵심 표현','試験でよく使う重要表現','Core expressions for the exam','考试常用核心表达')}</h3><p>${text('검수된 단어·어휘·숙어·문법을 급수별로 찾아보고 내 단어장에 담으세요.','確認済みの単語・語彙・慣用句・文法を級別に探して保存できます。','Browse reviewed words, idioms, and grammar by level, then save what you need.','按等级浏览已审核的单词、惯用语和语法，并保存所需内容。')}</p><button onclick="malbitPracticeVocabLibrary(${level})">▶ ${text('이 급수 문제로 연습','この級の問題を練習','Practice this level','练习该等级题目')}</button></section><div class="tqLibraryLevels"><button class="${level===1?'on':''}" onclick="malbitSetVocabLibraryLevel(1)"><b>TOPIK I</b><small>1~2${text('급','級',' level','级')} · ${window.MALBIT_SHORTS_DECKS?.[1]?.length||0}</small></button><button class="${level===2?'on':''}" onclick="malbitSetVocabLibraryLevel(2)"><b>TOPIK II</b><small>3~6${text('급','級',' level','级')} · ${window.MALBIT_SHORTS_DECKS?.[2]?.length||0}</small></button></div><div class="tqLibraryFilters">${filter('all',text('전체','すべて','All','全部'))}${filter('word',text('단어·어휘','単語・語彙','Words','单词·词汇'))}${filter('idiom',text('숙어·표현','慣用句・表現','Idioms','惯用语·表达'))}${filter('grammar',text('문법','文法','Grammar','语法'))}</div><label class="tqLibrarySearch"><span>⌕</span><input value="${esc(query)}" oninput="malbitSearchVocabLibrary(this)" placeholder="${text('표현이나 뜻 검색','表現・意味を検索','Search expressions or meanings','搜索表达或释义')}"></label><div class="tqLibraryCount"><b id="tqLibraryVisibleCount">${visible}</b> ${text('개 표현','件',' items','个表达')}</div><div class="tqLibraryGrid">${cards}</div><div id="tqLibrarySearchEmpty" class="tqVocabEmpty" ${visible?'hidden':''}><i>⌕</i><h3>${text('검색 결과가 없어요.','検索結果がありません。','No matches found.','没有搜索结果。')}</h3></div>`;
}

if(typeof revealVocab==='function'){
  revealVocab=async function(i){
    const v=S.vocab?.[i];if(!v)return;v.show=!v.show;v.meanings=v.meanings||{};const target=S.lang==='ko'?'ja':S.lang;
    if(v.show&&!v.meanings[target]){
      if(target==='ja'&&v.ja)v.meanings.ja=v.ja;
      else v.meanings[target]=await translateCached(`vocab_v2_${target}_${v.text}`,v.text,'ko',target);
      if(target==='ja')v.ja=v.meanings.ja;
    }
    save();render();
  };
}

function renderLearningVocabPage(sc){
    navActive('vocab');S.vocab=Array.isArray(S.vocab)?S.vocab:[];const target=S.lang==='ko'?'ja':S.lang,flag=LANGS[target]?.flag||'🌐';sc.className='screen tqVocabScreen';
    sc.innerHTML=`<div class="sectionTitle tqVocabTitle"><div><small>VOCABULARY</small><h2>${tr('vocab')}</h2></div><span>${S.vocab.length}</span></div><div class="tqVocabPageTabs"><button class="${vocabPageMode==='saved'?'on':''}" onclick="malbitSetVocabPageMode('saved')">${text('내 단어장','マイ単語帳','My vocabulary','我的单词本')} <b>${S.vocab.length}</b></button><button class="${vocabPageMode==='library'?'on':''}" onclick="malbitSetVocabPageMode('library')">${text('TOPIK 학습목록','TOPIK学習リスト','TOPIK study library','TOPIK学习列表')} <b>${(window.MALBIT_SHORTS_DECKS?.[1]?.length||0)+(window.MALBIT_SHORTS_DECKS?.[2]?.length||0)}</b></button></div>${vocabPageMode==='library'?libraryVocabHtml():savedVocabHtml(target,flag)}`;
}
window.malbitLearningVocabPage=renderLearningVocabPage;
if(typeof vocabPage==='function')vocabPage=renderLearningVocabPage;

function addDiscovery(root=document){
  let allow=S.view==='infinity'||S.view==='gameQ'||S.view==='shorts'||S.view==='t1quiz';
  if(S.view==='t1quiz'){try{const q=JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null');if(q?.mode==='real')allow=false}catch(e){}}
  if(allow&&S.view!=='shorts'){const card=root.querySelector('.card');if(card&&!card.querySelector('.tqVocabCoach'))card.insertAdjacentHTML('beforeend',`<button type="button" class="tqVocabCoach" onclick="showVocabGuide()">☝ ${text('모르는 단어·숙어를 길게 눌러 단어장에 저장','知らない単語・表現を長押しして単語帳に保存','Long-press an unfamiliar word or expression to save it','长按不熟悉的单词或短语即可收藏')}</button>`)}
}

function enhance(root=document){
  installPopup();addDiscovery(root);
  root.querySelectorAll('.card .stem,.card .choice>span:last-child,.card .instruction,.shortsCard .shortsWord,.shortsCard .shortsFeedback p,.shortsCard .shortsFeedback small,.answerBox p,.tqInlineExplanation p').forEach(tokenizeElement);
  try{hideSelection()}catch(e){}
}

if(typeof render==='function'){
  const baseRender=render;
  render=function(){const out=baseRender();setTimeout(()=>enhance(document),0);return out};
}
if(typeof explainCurrent==='function'){
  const baseExplainCurrent=explainCurrent;
  explainCurrent=async function(type,id){const out=await baseExplainCurrent(type,id);enhance(document.getElementById('sheetBody')||document);return out};
}
if(typeof openGameResult==='function'){
  const baseOpenGameResult=openGameResult;
  openGameResult=function(ok,timeout){
    let missed=null;try{const m=stageMeta(S.gameStage);if(!ok&&(m.type==='listen'||m.type==='read'))missed={type:m.type,id:m.id,selected:typeof selected==='number'?selected:-1}}catch(e){}
    const out=baseOpenGameResult(ok,timeout);if(missed)recordReviewWrong(2,missed.type,missed.id,missed.selected,'game');setTimeout(()=>{const root=document.getElementById('sheetBody');if(!root)return;try{const m=stageMeta(S.gameStage),q=m.type==='listen'?LS[m.id-1]:RW[m.id-1],next=root.querySelector('button.primary');if(next&&!root.querySelector('.tqInlineExplanation'))next.insertAdjacentHTML('beforebegin',m.type==='write'?writingExplanationBlock(q):explanationBlock(m.type,q))}catch(e){console.warn('[MALBIT explanation]',e)}enhance(root)},0);return out
  };
}

const style=document.createElement('style');style.textContent=`
  .tqInlineExplanation{margin-top:13px;border:1px solid #cfe4ff;background:linear-gradient(145deg,#f1f7ff,#fff);border-radius:18px;padding:13px;color:#17243a}.tqInlineExplanation.compact{margin-top:0}.tqInlineTitle{display:flex;align-items:center;gap:7px;color:#245ed5}.tqInlineTitle span{width:24px;height:24px;border-radius:8px;background:#ddebff;display:grid;place-items:center;font-weight:950}.tqInlineTitle b{font-size:13px}.tqInlineAnswer{margin:10px 0;background:#e8f2ff;border-radius:13px;padding:10px 11px}.tqInlineAnswer small{display:block;color:#69809d;font-size:9px;font-weight:900}.tqInlineAnswer strong{display:block;margin-top:3px;font-size:13px}.tqInlineExplanation h4{margin:10px 0 4px;font-size:10px;color:#62748d}.tqInlineExplanation p{margin:0!important;color:#263850!important;font-size:12px!important;line-height:1.65!important}
  .selectable,.vocab-zone{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}.vocab-token{display:inline;border-radius:4px;touch-action:pan-y;-webkit-touch-callout:none;transition:background .12s,box-shadow .12s}.vocab-token:active,.vocab-token.holding{background:#dceaff;box-shadow:0 0 0 3px rgba(63,126,235,.12)}.selectionBar{display:none!important}
  .tqVocabPopup{position:fixed;inset:0;z-index:180;display:none;align-items:flex-end}.tqVocabPopup.open{display:flex}.tqVocabBackdrop{position:absolute;inset:0;border:0;background:rgba(2,8,18,.68)}.tqVocabPopup section{position:relative;width:100%;background:#f8fbff;color:#15223a;border-radius:27px 27px 0 0;padding:10px 18px calc(20px + env(safe-area-inset-bottom));box-shadow:0 -20px 60px rgba(0,0,0,.35);animation:sheetUp .22s ease}.tqVocabHandle{width:40px;height:5px;background:#d3dbe8;border-radius:99px;margin:0 auto 16px}.tqVocabPopup small{display:block;color:#78879d;font-size:9px;font-weight:900}.tqVocabTerm{display:block;font-size:27px;margin:5px 0 8px;letter-spacing:-.04em}.tqVocabNormalize{background:#edf3fb;border-radius:13px;padding:10px;color:#55657b;font-size:11px;line-height:1.55}.tqVocabAdd,.tqVocabCancel{width:100%;border:0;border-radius:15px;padding:13px;font-weight:950}.tqVocabAdd{background:#286cff;color:#fff;margin-top:10px}.tqVocabCancel{background:#e9eef6;color:#536176;margin-top:7px}
  .tqVocabCoach{width:100%;border:1px dashed #9eb5d5;background:#edf4ff;color:#49617e;border-radius:13px;padding:9px 10px;margin-top:11px;font-size:9px;font-weight:850;line-height:1.45}.tqGuideSteps{display:grid;gap:9px;margin-top:12px}.tqGuideSteps>div{display:flex;gap:10px;align-items:flex-start;background:#eef3fa;border-radius:15px;padding:11px}.tqGuideSteps i{font-style:normal;width:25px;height:25px;border-radius:9px;background:#286cff;color:#fff;display:grid;place-items:center;font-weight:950;font-size:11px}.tqGuideSteps p{margin:0!important;flex:1}.tqGuideSteps b{display:block;color:#23344d;font-size:11px}.tqGuideSteps small{display:block;color:#66768d;font-size:9px;line-height:1.5;margin-top:3px}.tqVocabInfo button{border:0;background:#1c3353;color:#dceaff;border-radius:11px;padding:9px 11px;font-size:9px;font-weight:900}
  .tqVocabTitle{margin-top:3px}.tqVocabTitle>div small{display:block;color:#7fa9f4;font-size:8px;font-weight:950;letter-spacing:.14em}.tqVocabTitle h2{margin-top:3px!important;font-size:23px!important}.tqVocabTitle>span{display:grid;place-items:center;min-width:34px;height:29px;border:1px solid #304b70;border-radius:10px;background:#10243e;color:#a8c4ea;font-weight:950}.tqVocabPageTabs{display:grid;grid-template-columns:1fr 1.25fr;gap:6px;border:1px solid #263d5c;border-radius:16px;padding:5px;background:#0d1d32;margin-bottom:12px}.tqVocabPageTabs button{border:0;border-radius:12px;padding:10px 7px;background:transparent;color:#8297b4;font-size:10px;font-weight:950}.tqVocabPageTabs button.on{background:linear-gradient(135deg,#346ff2,#725cf0);color:#fff;box-shadow:0 8px 18px rgba(45,83,205,.28)}.tqVocabPageTabs b{display:inline-grid;place-items:center;min-width:20px;height:18px;margin-left:3px;border-radius:7px;background:rgba(255,255,255,.13);font-size:8px}
  .tqManualVocab{border:1px solid #2b4668;border-radius:22px;padding:15px;background:linear-gradient(145deg,#112641,#0d1d33);box-shadow:0 14px 35px rgba(0,0,0,.18)}.tqManualVocab>div small,.tqLibraryHero>small{color:#7ca8f8;font-size:7.5px;font-weight:950;letter-spacing:.13em}.tqManualVocab h3,.tqLibraryHero h3{margin:4px 0;font-size:17px}.tqManualVocab p,.tqLibraryHero p{margin:0;color:#99adc8;font-size:9px;line-height:1.5}.tqManualVocab form{display:grid;gap:8px;margin-top:13px}.tqManualVocab label{color:#a9bad0;font-size:8px;font-weight:900}.tqManualVocab input,.tqLibrarySearch input{width:100%;margin-top:5px;border:1px solid #dbe4f0;border-radius:12px;padding:11px 12px;background:#f8fbff;color:#17243a;font-size:12px;font-weight:800;outline:none}.tqManualVocab input:focus,.tqLibrarySearch input:focus{border-color:#5a88ff;box-shadow:0 0 0 3px rgba(83,130,255,.13)}.tqManualVocab form>button{border:0;border-radius:13px;padding:12px;background:linear-gradient(135deg,#3479f4,#7560ed);color:#fff;font-size:10px;font-weight:950}.tqVocabCompactTip{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:9px 0 13px;border:1px solid #263d5b;border-radius:14px;padding:9px 10px;background:#0d1d32;color:#8fa4c0;font-size:8px}.tqVocabCompactTip button{border:0;background:transparent;color:#80aaff;font-size:8px;font-weight:950}.tqSavedVocabCard{box-shadow:0 9px 22px rgba(0,0,0,.12)}.tqVocabExample{display:block;margin-top:7px;border-top:1px solid #d7e3f2;padding-top:7px;color:#61738b;font-size:9px;line-height:1.5}.tqVocabEmpty{text-align:center;border:1px dashed #38506d;border-radius:20px;padding:22px 14px;background:#0d1b2e;color:#eaf3ff}.tqVocabEmpty i{display:grid;place-items:center;width:39px;height:39px;margin:auto;border-radius:13px;background:#183458;color:#8bb1ff;font-style:normal;font-size:19px}.tqVocabEmpty h3{margin:9px 0 4px;font-size:12px}.tqVocabEmpty p{margin:0;color:#8499b6;font-size:8.5px;line-height:1.5}
  .tqLibraryHero{border:1px solid #304d73;border-radius:22px;padding:16px;background:radial-gradient(circle at 100% 0,rgba(114,87,255,.23),transparent 42%),linear-gradient(145deg,#102641,#0b1b2f)}.tqLibraryLevels{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:10px 0}.tqLibraryLevels button{border:1px solid #29415f;border-radius:15px;padding:10px;background:#0e2037;color:#8fa4c0;text-align:left}.tqLibraryLevels button.on{border-color:#648dff;background:#183a70;color:#fff;box-shadow:0 0 0 3px rgba(92,135,255,.1)}.tqLibraryLevels b,.tqLibraryLevels small{display:block}.tqLibraryLevels b{font-size:11px}.tqLibraryLevels small{margin-top:3px;font-size:7.5px}.tqLibraryFilters{display:flex;gap:5px;overflow:auto;padding-bottom:3px;scrollbar-width:none}.tqLibraryFilters::-webkit-scrollbar{display:none}.tqLibraryFilters button{flex:0 0 auto;border:1px solid #2d4563;border-radius:999px;padding:7px 10px;background:#102139;color:#8ea2bd;font-size:8px;font-weight:900}.tqLibraryFilters button.on{border-color:#7197ff;background:#2857a9;color:#fff}.tqLibrarySearch{position:relative;display:block;margin:9px 0}.tqLibrarySearch span{position:absolute;left:12px;top:15px;z-index:1;color:#61738d;font-size:16px}.tqLibrarySearch input{margin:0;padding-left:36px}.tqLibraryCount{margin:4px 3px 8px;color:#8499b5;font-size:8px}.tqLibraryCount b{color:#9ebdff;font-size:11px}.tqLibraryGrid{display:grid;gap:8px}.tqLibraryCard{border:1px solid #dce5f1;border-radius:18px;padding:13px;background:#f8fbff;color:#16233a;box-shadow:0 9px 22px rgba(0,0,0,.1)}.tqLibraryCard[hidden]{display:none}.tqLibraryMeta{display:flex;align-items:center;justify-content:space-between}.tqLibraryMeta span{border-radius:999px;padding:5px 7px;font-size:7px;font-weight:950}.tqLibraryMeta span.word{background:#e8f2ff;color:#2865be}.tqLibraryMeta span.idiom{background:#fff0dc;color:#a55a13}.tqLibraryMeta span.grammar{background:#f2eaff;color:#7043b5}.tqLibraryMeta small{color:#8391a6;font-size:7px;font-weight:900}.tqLibraryCard h3{margin:9px 0 3px;font-size:19px}.tqLibraryCard>p{margin:0;color:#52647c;font-size:11px;line-height:1.5}.tqLibraryExample{margin:9px 0;border-radius:11px;padding:9px;background:#edf3fa;color:#4a5e77;font-size:9px;line-height:1.5}.tqLibraryExample b{display:block;margin-bottom:2px;color:#7b8ba1;font-size:7px}.tqLibraryCard>button{width:100%;border:0;border-radius:12px;padding:10px;background:#286cff;color:#fff;font-size:9px;font-weight:950}.tqLibraryCard>button:disabled{background:#e7edf5;color:#7b899d;opacity:1}
  html[data-theme="light"] .tqVocabScreen{color:#17243a}html[data-theme="light"] .tqVocabPageTabs,html[data-theme="light"] .tqManualVocab,html[data-theme="light"] .tqVocabCompactTip,html[data-theme="light"] .tqLibraryHero,html[data-theme="light"] .tqLibraryLevels button,html[data-theme="light"] .tqLibraryFilters button,html[data-theme="light"] .tqVocabEmpty{border-color:#d7e2f0;background:#fff;color:#17243a;box-shadow:0 9px 24px rgba(46,66,96,.07)}html[data-theme="light"] .tqVocabPageTabs button{color:#6f8098}html[data-theme="light"] .tqVocabPageTabs button.on{color:#fff;background:linear-gradient(135deg,#3476ed,#725ce9)}html[data-theme="light"] .tqManualVocab p,html[data-theme="light"] .tqLibraryHero p,html[data-theme="light"] .tqVocabCompactTip,html[data-theme="light"] .tqVocabEmpty p{color:#6d7e95}html[data-theme="light"] .tqManualVocab label{color:#5f7088}html[data-theme="light"] .tqLibraryLevels button.on,html[data-theme="light"] .tqLibraryFilters button.on{border-color:#5c85ee;background:#e6efff;color:#2558ad}html[data-theme="light"] .tqVocabTitle>span{border-color:#d6e1ef;background:#fff;color:#41689f}
  .tqReviewScreen{background:#f4f6fb!important;color:#18243b!important}.tqReviewHero{display:grid;grid-template-columns:1fr 76px;gap:13px;align-items:center;border-radius:24px;padding:18px;background:linear-gradient(145deg,#315fd7,#7755e8);color:#fff;box-shadow:0 17px 36px rgba(71,75,184,.2)}.tqReviewHero small{font-size:8px;font-weight:950;letter-spacing:.11em;color:#dce4ff}.tqReviewHero h1{font-size:20px;line-height:1.2;letter-spacing:-.045em;margin:6px 0}.tqReviewHero p{font-size:9px;line-height:1.5;color:#e5e9ff;margin:0}.tqReviewHero>strong{display:grid;place-items:center;width:72px;height:72px;border-radius:23px;background:rgba(255,255,255,.15);font-size:28px}.tqReviewHero>strong small{display:block;font-size:7px;letter-spacing:0}.tqReviewStats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:11px 0 17px}.tqReviewStats>div{border-radius:17px;padding:12px;background:#fff;box-shadow:0 8px 22px rgba(44,50,85,.07)}.tqReviewStats b{display:block;font-size:19px}.tqReviewStats small{font-size:8px;color:#8992a4}.tqReviewQueue{display:grid;gap:9px}.tqReviewItem{display:grid;grid-template-columns:51px 1fr auto;gap:10px;align-items:center;border:1px solid #e0e5ee;border-radius:19px;padding:11px;background:#fff;box-shadow:0 7px 21px rgba(42,52,87,.06)}.tqReviewBadge{display:grid;place-items:center;width:51px;height:51px;border-radius:16px;background:#edf2ff;font-size:19px}.tqReviewBadge small{display:block;color:#536fd4;font-size:6.5px;font-weight:950}.tqReviewItem b{font-size:12px}.tqReviewItem p{max-width:220px;margin:3px 0;color:#647187;font-size:8.5px;line-height:1.35}.tqReviewItem>div>small{font-size:7.5px;color:#a06a7b}.tqReviewItem>button{border:0;border-radius:12px;padding:9px;background:#315fd7;color:#fff;font-size:8px;font-weight:950;white-space:nowrap}.tqReviewEmpty{text-align:center;border:1px dashed #ccd4e1;border-radius:22px;padding:25px 17px;background:#fff}.tqReviewEmpty span{display:grid;place-items:center;width:46px;height:46px;margin:auto;border-radius:15px;background:#e8f8f0;color:#199267;font-size:21px;font-weight:950}.tqReviewEmpty h3{font-size:14px}.tqReviewEmpty p{color:#778398;font-size:9px;line-height:1.5}.tqClearMastered{display:block;margin:13px auto 0;border:0;background:transparent;color:#8a94a6;font-size:8.5px;text-decoration:underline}.tqReviewQuestion{margin:11px 0;border:1px solid #dce4ef;border-radius:17px;padding:13px;background:#f7f9fc;color:#1e2d44}.tqReviewQuestion.translated{background:#eef5ff;border-color:#c9dcfa}.tqReviewQuestion>small{display:block;color:#728199;font-size:9px;line-height:1.45}.tqReviewQuestion>p{white-space:pre-wrap;font-size:13px;font-weight:850;line-height:1.65}.tqReviewScript{white-space:pre-wrap;margin-top:9px;border-left:3px solid #7a9ee8;padding:8px 10px;background:#fff;border-radius:0 10px 10px 0;font-size:10px;line-height:1.55}.tqReviewQuestion ol{margin:9px 0 0;padding-left:24px}.tqReviewQuestion li{padding:3px 0;font-size:10px;line-height:1.45}.tqTranslationToggle{width:100%;border:1px solid #c9d9ef;border-radius:13px;padding:11px;background:#edf4ff;color:#315f9f;font-size:10px;font-weight:950}.tqReviewTranslation{display:none}.tqReviewTranslation.open{display:block}.tqReviewChoices{margin-top:11px}.tqReviewDeep{margin-top:12px;border:1px solid #cfe4ff;background:linear-gradient(145deg,#f1f7ff,#fff);border-radius:18px;padding:13px;color:#17243a}.tqReviewDeep h4{margin:12px 0 5px;font-size:10px;color:#62748d}.tqReviewDeep p{font-size:11px;line-height:1.65;color:#263850}.tqReviewDeep blockquote{margin:8px 0;border-left:3px solid #83a8ed;padding:8px 10px;background:#edf4ff;color:#40536e;font-size:9.5px;line-height:1.55;white-space:pre-wrap}.tqReviewChoiceAnalysis{display:grid;gap:7px;margin:8px 0 0;padding:0;list-style:none}.tqReviewChoiceAnalysis li{border:1px solid #e0e5ed;border-radius:12px;padding:9px;background:#f8f9fc}.tqReviewChoiceAnalysis li.right{border-color:#8bd3b7;background:#eaf9f2}.tqReviewChoiceAnalysis b,.tqReviewChoiceAnalysis span{display:block}.tqReviewChoiceAnalysis b{font-size:9.5px}.tqReviewChoiceAnalysis span{margin-top:3px;color:#68768a;font-size:8.5px;line-height:1.45}
`;
document.head.appendChild(style);
window.MALBIT_LEARNING={normalizeKoreanTerm,stripParticle,termFromToken,isSavableTerm,addVocabTerm,listeningExplanation,readingExplanation,writingExplanationBlock,enhance};
removeUnsafeSavedFragments();
setTimeout(()=>enhance(document),0);
})();
