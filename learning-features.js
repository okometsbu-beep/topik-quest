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
  if(q.id<=3)return pack[lang]||pack.ko||'';
  const localizedChoice=lang==='ko'?answerChoice(q):lang==='ja'?cleanChoice((q.choicesJa||q.choices||[])[q.answerIndex]):pack[lang];
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
  const translated=I18N.topik2Listening?.[q.id]?.[lang];return q.id>3&&translated?translated:answerChoice(q);
}

function explanationBlock(type,q,compact=false){
  const l=labels(),reason=type==='listen'?listeningExplanation(q):readingExplanation(q),n=answerNumber(q),choice=localizedAnswerChoice(type,q);
  return `<section class="tqInlineExplanation ${compact?'compact':''}" aria-live="polite"><div class="tqInlineTitle"><span>✓</span><b>${l.title}</b></div><div class="tqInlineAnswer"><small>${l.answer}</small><strong>${n}. ${esc(choice)}</strong></div><h4>${l.reason}</h4><p>${esc(reason)}</p></section>`;
}

function writingExplanationBlock(q){
  const guide=I18N.topik2Writing?.[q?.id]?.[S.lang]||text('문제의 모든 조건과 핵심 정보가 답안에 들어갔는지 확인하세요.','設問の全条件と重要情報が答案に入っているか確認してください。','Check that the answer covers every condition and key detail.','请确认答案包含全部条件和关键信息。');
  return `<section class="tqInlineExplanation"><div class="tqInlineTitle"><span>✓</span><b>${text('바로 해설','すぐに解説','Instant explanation','即时解析')}</b></div><h4>${text('비교 포인트','比較ポイント','What to compare','对照要点')}</h4><p>${esc(guide)}</p></section>`;
}

if(typeof renderInfMCQ==='function'){
  const baseRenderInfMCQ=renderInfMCQ;
  renderInfMCQ=function(q,type){
    let html=baseRenderInfMCQ(q,type);
    if(!S.infinity?.feedback)return html;
    const marker='<button class="primary" style="margin-top:10px"';
    return html.replace(marker,explanationBlock(type,q)+marker);
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
    try{const q=JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null'),id=q?.ids?.[q.i],item=(window.TOPIK1_QUESTIONS||[]).find(x=>x.id===id);if(item)return`TOPIK I · ${item.section==='listening'?'L':'R'}${id}`}catch(e){}
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
  const note=p.querySelector('.tqVocabNormalize');
  note.textContent=raw!==term?text(`“${raw}”에서 조사를 정리해 “${term}”로 저장합니다.`,`「${raw}」の助詞を除き、「${term}」として保存します。`,`The particle is removed from “${raw}”; “${term}” will be saved.`,`已从“${raw}”中去除助词，将保存为“${term}”。`):text('이 표현 그대로 저장합니다.','この表現をそのまま保存します。','This expression will be saved as shown.','将按当前表达保存。');
  p.classList.add('open');
}

function addVocabTerm(term=pendingVocab?.term){
  const word=normalizeKoreanTerm(term)||String(term||'').trim();if(!isSavableTerm(word))return toast(text('불완전한 어절은 저장하지 않아요.','不完全な語形は保存しません。','Incomplete word fragments are not saved.','不会保存不完整的词形。'));
  S.vocab=Array.isArray(S.vocab)?S.vocab:[];
  if(S.vocab.some(v=>normalizeKoreanTerm(v.text)===word)){
    closeVocabPopup();return toast(text('이미 단어장에 있어요.','すでに単語帳にあります。','Already in your vocabulary.','已经在单词本中。'));
  }
  S.vocab.unshift({text:word,source:sourceForVocab(),ja:'',meanings:{},show:false});save();
  try{localStorage.setItem('malbitVocabLongPressUsed','1')}catch(e){}
  closeVocabPopup();toast(text(`“${word}” 단어장에 추가했어요.`,`「${word}」を単語帳に追加しました。`,`Added “${word}” to Vocabulary.`,`已将“${word}”加入单词本。`));
}

function installPopup(){
  if(popup())return;
  const el=document.createElement('div');el.id='tqVocabPopup';el.className='tqVocabPopup';el.innerHTML=`<button class="tqVocabBackdrop" aria-label="${text('닫기','閉じる','Close','关闭')}"></button><section role="dialog" aria-modal="true" aria-labelledby="tqVocabPopupTitle"><div class="tqVocabHandle"></div><small>${text('길게 누른 표현','長押しした表現','Long-pressed expression','长按的表达')}</small><strong id="tqVocabPopupTitle" class="tqVocabTerm"></strong><p class="tqVocabNormalize"></p><button class="tqVocabAdd">＋ ${text('단어장에 추가하기','単語帳に追加','Add to Vocabulary','加入单词本')}</button><button class="tqVocabCancel">${text('취소','キャンセル','Cancel','取消')}</button></section>`;
  document.body.appendChild(el);el.querySelector('.tqVocabBackdrop').onclick=closeVocabPopup;el.querySelector('.tqVocabCancel').onclick=closeVocabPopup;el.querySelector('.tqVocabAdd').onclick=()=>addVocabTerm();
}

function tokenizeElement(el){
  if(!el||el.dataset.vocabReady==='1')return;el.dataset.vocabReady='1';el.classList.add('vocab-zone');
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    if(node.parentElement?.closest('.vocab-token'))continue;
    const value=node.nodeValue||'',re=/[가-힣]+/g;if(!re.test(value))continue;re.lastIndex=0;
    const frag=document.createDocumentFragment();let at=0,m;
    while((m=re.exec(value))){if(m.index>at)frag.append(value.slice(at,m.index));const span=document.createElement('span');span.className='vocab-token';span.textContent=m[0];span.setAttribute('role','button');span.setAttribute('aria-label',text(`${m[0]} 길게 눌러 단어장에 추가`,`「${m[0]}」を長押しして単語帳に追加`,`Long-press ${m[0]} to add it to Vocabulary`,`长按${m[0]}加入单词本`));frag.append(span);at=m.index+m[0].length}if(at<value.length)frag.append(value.slice(at));node.replaceWith(frag);
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

if(typeof vocabPage==='function'){
  vocabPage=function(sc){
    navActive('vocab');const target=S.lang==='ko'?'ja':S.lang,flag=LANGS[target]?.flag||'🌐';
    sc.innerHTML=`<div class="sectionTitle"><h2>${tr('vocab')}</h2><span>${S.vocab.length}</span></div><div class="infoCard tqVocabInfo"><p>☝ ${text('문제 속 한국어 단어나 숙어를 길게 누르면 ‘단어장에 추가하기’가 열립니다. 문맥을 확인해 조사와 활용형을 정리하고 불완전한 어절은 저장하지 않습니다.','問題の韓国語の単語・表現を長押しすると「単語帳に追加」が開きます。文脈から助詞・活用形を整え、不完全な語形は保存しません。','Long-press a Korean word or expression to open “Add to Vocabulary.” Context is used to clean particles and conjugations; incomplete fragments are rejected.','长按韩语单词或短语即可打开“加入单词本”。系统结合语境整理助词和活用，并拒绝不完整片段。')}</p><button onclick="showVocabGuide()">${text('사용법 보기','使い方を見る','See how it works','查看使用方法')} ›</button></div>${S.vocab.map((v,i)=>{const meaning=v.meanings?.[target]||(target==='ja'?v.ja:'')||'…';return `<div class="vocabCard"><div class="vocabHead"><div class="vocabWord">${esc(v.text)}</div><span class="source">${esc(v.source)}</span></div><div class="vocabAnswer ${v.show?'show':''}">${v.show?esc(meaning):''}</div><div class="vocabActions"><button class="reveal" onclick="revealVocab(${i})">${flag} ${v.show?text('뜻 숨기기','意味を隠す','Hide meaning','隐藏释义'):text('뜻 보기','意味を見る','Reveal meaning','查看释义')}</button><button class="delete" onclick="deleteVocab(${i})">×</button></div></div>`}).join('')}`;
  };
}

function addDiscovery(root=document){
  if(S.view==='home'){
    const modes=root.querySelector('.tqV9Modes');if(modes&&!root.querySelector('.tqLongPressDiscovery'))modes.insertAdjacentHTML('afterend',`<button type="button" class="tqLongPressDiscovery" onclick="showVocabGuide()"><i>☝</i><span><b>${text('문제 속 단어, 꾹 눌러 저장','問題の単語を長押しで保存','Long-press words to save them','长按题中单词即可收藏')}</b><small>${text('문맥에 맞는 완전한 단어·표현으로 정리해요','文脈に合う完全な単語・表現に整えます','Saved as a complete word or phrase from context','按语境整理为完整单词或表达')}</small></span><strong>›</strong></button>`);
  }
  let allow=S.view==='infinity'||S.view==='gameQ'||S.view==='shorts'||S.view==='t1quiz';
  if(S.view==='t1quiz'){try{const q=JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null');if(q?.mode==='real')allow=false}catch(e){}}
  if(allow){const card=root.querySelector('.card,.shortsCard');if(card&&!card.querySelector('.tqVocabCoach'))card.insertAdjacentHTML('beforeend',`<button type="button" class="tqVocabCoach" onclick="showVocabGuide()">☝ ${text('모르는 단어·숙어를 길게 눌러 단어장에 저장','知らない単語・表現を長押しして単語帳に保存','Long-press an unfamiliar word or expression to save it','长按不熟悉的单词或短语即可收藏')}</button>`)}
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
    const out=baseOpenGameResult(ok,timeout);setTimeout(()=>{const root=document.getElementById('sheetBody');if(!root)return;try{const m=stageMeta(S.gameStage),q=m.type==='listen'?LS[m.id-1]:RW[m.id-1],next=root.querySelector('button.primary');if(next&&!root.querySelector('.tqInlineExplanation'))next.insertAdjacentHTML('beforebegin',m.type==='write'?writingExplanationBlock(q):explanationBlock(m.type,q))}catch(e){console.warn('[MALBIT explanation]',e)}enhance(root)},0);return out
  };
}

const style=document.createElement('style');style.textContent=`
  .tqInlineExplanation{margin-top:13px;border:1px solid #cfe4ff;background:linear-gradient(145deg,#f1f7ff,#fff);border-radius:18px;padding:13px;color:#17243a}.tqInlineExplanation.compact{margin-top:0}.tqInlineTitle{display:flex;align-items:center;gap:7px;color:#245ed5}.tqInlineTitle span{width:24px;height:24px;border-radius:8px;background:#ddebff;display:grid;place-items:center;font-weight:950}.tqInlineTitle b{font-size:13px}.tqInlineAnswer{margin:10px 0;background:#e8f2ff;border-radius:13px;padding:10px 11px}.tqInlineAnswer small{display:block;color:#69809d;font-size:9px;font-weight:900}.tqInlineAnswer strong{display:block;margin-top:3px;font-size:13px}.tqInlineExplanation h4{margin:10px 0 4px;font-size:10px;color:#62748d}.tqInlineExplanation p{margin:0!important;color:#263850!important;font-size:12px!important;line-height:1.65!important}
  .selectable,.vocab-zone{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}.vocab-token{display:inline;border-radius:4px;touch-action:pan-y;-webkit-touch-callout:none;transition:background .12s,box-shadow .12s}.vocab-token:active,.vocab-token.holding{background:#dceaff;box-shadow:0 0 0 3px rgba(63,126,235,.12)}.selectionBar{display:none!important}
  .tqVocabPopup{position:fixed;inset:0;z-index:180;display:none;align-items:flex-end}.tqVocabPopup.open{display:flex}.tqVocabBackdrop{position:absolute;inset:0;border:0;background:rgba(2,8,18,.68)}.tqVocabPopup section{position:relative;width:100%;background:#f8fbff;color:#15223a;border-radius:27px 27px 0 0;padding:10px 18px calc(20px + env(safe-area-inset-bottom));box-shadow:0 -20px 60px rgba(0,0,0,.35);animation:sheetUp .22s ease}.tqVocabHandle{width:40px;height:5px;background:#d3dbe8;border-radius:99px;margin:0 auto 16px}.tqVocabPopup small{display:block;color:#78879d;font-size:9px;font-weight:900}.tqVocabTerm{display:block;font-size:27px;margin:5px 0 8px;letter-spacing:-.04em}.tqVocabNormalize{background:#edf3fb;border-radius:13px;padding:10px;color:#55657b;font-size:11px;line-height:1.55}.tqVocabAdd,.tqVocabCancel{width:100%;border:0;border-radius:15px;padding:13px;font-weight:950}.tqVocabAdd{background:#286cff;color:#fff;margin-top:10px}.tqVocabCancel{background:#e9eef6;color:#536176;margin-top:7px}
  .tqLongPressDiscovery{width:100%;display:flex;align-items:center;gap:10px;border:1px solid #2b4163;background:linear-gradient(145deg,#101e33,#142740);color:#fff;border-radius:17px;padding:11px 12px;margin:9px 0 0;text-align:left}.tqLongPressDiscovery i{font-style:normal;font-size:22px}.tqLongPressDiscovery span{flex:1}.tqLongPressDiscovery b{display:block;font-size:11px}.tqLongPressDiscovery small{display:block;color:#91a8c8;font-size:8.5px;margin-top:3px}.tqLongPressDiscovery strong{color:#80a8ff}.tqVocabCoach{width:100%;border:1px dashed #9eb5d5;background:#edf4ff;color:#49617e;border-radius:13px;padding:9px 10px;margin-top:11px;font-size:9px;font-weight:850;line-height:1.45}.tqGuideSteps{display:grid;gap:9px;margin-top:12px}.tqGuideSteps>div{display:flex;gap:10px;align-items:flex-start;background:#eef3fa;border-radius:15px;padding:11px}.tqGuideSteps i{font-style:normal;width:25px;height:25px;border-radius:9px;background:#286cff;color:#fff;display:grid;place-items:center;font-weight:950;font-size:11px}.tqGuideSteps p{margin:0!important;flex:1}.tqGuideSteps b{display:block;color:#23344d;font-size:11px}.tqGuideSteps small{display:block;color:#66768d;font-size:9px;line-height:1.5;margin-top:3px}.tqVocabInfo button{border:0;background:#1c3353;color:#dceaff;border-radius:11px;padding:9px 11px;font-size:9px;font-weight:900}
`;
document.head.appendChild(style);
window.MALBIT_LEARNING={normalizeKoreanTerm,stripParticle,termFromToken,isSavableTerm,addVocabTerm,listeningExplanation,readingExplanation,writingExplanationBlock,enhance};
removeUnsafeSavedFragments();
setTimeout(()=>enhance(document),0);
})();
