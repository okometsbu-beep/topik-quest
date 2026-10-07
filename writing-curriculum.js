// HARUMAL writing corner: curriculum, focused sentence work, and honest local evidence.
(function(){
'use strict';
const DATA=window.HARUMAL_WRITING_DATA,engine=window.HARUMAL_WRITING_ENGINE;
if(!DATA||!engine)return;
let storage;try{storage=window.localStorage}catch{}
const E=engine.create(storage,DATA),VIEW='writingCourse';
const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const group=id=>DATA.groups.find(g=>g.id===id),item=id=>DATA.items.find(i=>i.id===id),state=()=>E.getState();
// Only interface text is localized. Learner answers and Korean examples stay untouched.
const language=()=>['ko','ja','en','zh'].includes(S.lang)?S.lang:'en';
function T(source,...values){
 const key=String(source??''),entry=window.HARUMAL_WRITING_UI_I18N?.[key]||window.HARUMAL_WRITING_CONTENT_I18N?.[key];
 const text=entry?.[language()]??(language()==='ko'?key:entry?.en??key);
 return text.replace(/\{(\d+)\}/g,(_,index)=>String(values[Number(index)]??''));
}
const t=(source,...values)=>h(T(source,...values));
const guided=()=>E.guidedProgress?.()||{started:false,active:false,unlockedIds:[],completedIds:[],complete:false};
const courseFinished=p=>p.complete&&DATA.groups.filter(g=>!g.delayedOnly).every(g=>(p.confirmedStageIds||[]).includes(g.id));
const flowArt=key=>`<img class="wcFlowArt" src="assets/art/writing/flow-${h(key)}-v1.webp" alt="" width="112" height="112" decoding="async">`;
const korean=value=>`<span lang="ko">${h(value)}</span>`;
const button=(label,action,kind='primary',extra='')=>`<button type="button" class="wcButton wcButton--${kind}" onclick="${action}" ${extra}>${T(label)}</button>`;
const badge=(label,tone='quiet')=>`<span class="wcBadge wcBadge--${tone}">${t(label)}</span>`;
const art=(key,cls='wcScenario')=>key?`<img class="${cls}" src="assets/art/writing/context-${h(key)}-v1.webp" alt="" width="120" height="120" decoding="async">`:'';
const mascot=(pose='lesson-welcome')=>`<img class="wcMascot" src="assets/art/haruman/${pose}-v2.webp" alt="" width="112" height="112" decoding="async">`;
const heading=(eyebrow,title,copy='',image='')=>`<header class="wcHeading"><p class="wcEyebrow">${T(eyebrow)}</p><div class="wcHeadingRow"><h1 tabindex="-1">${T(title)}</h1>${image}</div>${copy?`<p class="wcLead">${T(copy)}</p>`:''}</header>`;
const linkCard=(number,title,copy,action,extra='')=>`<button type="button" class="wcRouteCard ${extra}" onclick="${action}"><span class="wcNumber">${T(number)}</span><span><strong>${T(title)}</strong><small>${T(copy)}</small></span><span class="wcArrow" aria-hidden="true">›</span></button>`;
const crumbs=back=>`<div class="wcTopline">${button('‹',back,'icon',`aria-label="${t('이전 화면')}"`)}<strong>하루말 <small>HARUMAL / WRITING</small></strong><select class="wcLanguage" aria-label="${t('설명 언어')}" onchange="harumalWritingLanguage(this.value)">${[['ko','한국어'],['ja','日本語'],['en','English'],['zh','中文']].map(([code,name])=>`<option lang="${code==='zh'?'zh-CN':code}" value="${code}" ${language()===code?'selected':''}>${name}</option>`).join('')}</select>${button('×',"harumalWritingExit()",'icon',`aria-label="${t('작문 코너 닫기')}"`)}</div>`;
const footer=(label,action,note='')=>`<div class="wcFooter">${note?`<p>${T(note)}</p>`:''}${button(label,action)}</div>`;
function localeDate(value){try{return new Date(value).toLocaleString({ko:'ko-KR',ja:'ja-JP',en:'en-US',zh:'zh-CN'}[language()],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return''}}
function readinessMissing(g){return(g?.prerequisites||[]).filter(key=>key!=='reason_form'&&state().readiness[key]?.value!=='ready')}
function returnAction(route){if(guided().active&&['item','feedback','stage-done'].includes(route.page))return "harumalWritingGo('course')";if(route.page==='level')return "harumalWritingGo('course')";return route.page==='course'?"harumalWritingExit()":route.page==='map'?"harumalWritingGo('course')":route.page==='node'?"harumalWritingGo('map')":route.page==='unit'?"harumalWritingGo('map')":route.page==='group'?"harumalWritingGo('unit')":['item','feedback'].includes(route.page)?`harumalWritingGo('group','${item(route.itemId)?.groupId||'probe-basics'}')`:"harumalWritingGo('course')"}
function course(){
 const e=E.evidence(),p=guided(),g=group(p.stageId),resume=p.started,finished=courseFinished(p);
 return heading('나의 쓰기 과정','한 문장부터<br>조리 있는 글까지','수준을 고르면 한 문제씩 이어서 풀어요.')+
 `<section class="wcHero"><div><h2>${t('오늘도 한 문장씩 써요')}</h2><p>${t(E.getStorageError()?'기기에 저장되지 않았어요. 화면의 글을 따로 복사해 주세요.':'쓰던 문장과 풀이 위치는 이 기기에 저장돼요.')}</p></div>${flowArt('start')}</section>`+
 (resume?`<section class="wcResume"><small>${t(finished?'첫 원인 문장 연습을 마쳤어요':'이전에 하던 연습')}</small><h2>${g?t(g.titleKo):t('초급 · 원인 문장 연습')}</h2>${footer(finished?'마지막 기록 이어 보기':'이어서 풀기',finished?"harumalWritingGo('records')":"harumalWritingResume()")}</section>`:'')+
 `<h2 class="wcSectionTitle">${t('내 수준에서 시작해요')}</h2>`+
 linkCard('1','초급','짧은 문장부터 시작해 이유를 한 문장으로 써요.',"harumalWritingBegin()",'wcRouteCard--active')+
 `<p class="wcNote wcAvailable">${t('현재 첫 원인 문장 연습이 열려 있어요. 초급 전체 과정은 계속 준비 중이에요.')}</p>`+
 linkCard('2','중급','문단으로 설명하기 · 과정 준비 중',"harumalWritingGo('level','intermediate')")+
 linkCard('3','고급','여러 문단으로 생각 펼치기 · 과정 준비 중',"harumalWritingGo('level','advanced')")+
 `<div class="wcSplitLinks">${button('내 쓰기 기록',"harumalWritingGo('records')",'text')}${button('전체 학습 지도',"harumalWritingGo('map')",'text')}</div>`+
 (e.delayedReady?`<aside class="wcNotice">${t('다른 날의 새 상황 확인이 준비됐어요.')} ${button('새 문장으로 확인',"harumalWritingGo('group','delayed-new')",'secondary')}</aside>`:'');
}
function levelPage(id){
 if(id==='beginner')return course();
 return heading(id==='advanced'?'고급':'중급','이 과정은 준비 중이에요','지금은 초급의 첫 원인 문장 연습을 할 수 있어요.',flowArt('start'))+
 `<section class="wcPanel"><h2>${t('기존 TOPIK II 문제도 풀 수 있어요')}</h2><p>${t('기존 시험 연습은 이 순서형 과정과 따로 제공돼요. 중급·고급 과정을 마친 것으로 기록하지 않아요.')}</p>${button('기존 TOPIK II 쓰기 연습 열기',"harumalWritingOpenExam()",'secondary')}</section>`+
 footer('초급 연습 시작하기',"harumalWritingBegin()")+button('수준 선택으로 돌아가기',"harumalWritingGo('course')",'text');
}
function stageDone(id){
 const p=guided(),g=group(id);
 if(!g||!p.completedIds.includes(id))return course();
 const next=DATA.groups.find(entry=>!entry.delayedOnly&&!p.completedIds.includes(entry.id)),count=g.itemIds.length;
 return heading('한 단계 완료','이번 연습을 마쳤어요',E.getStorageError()?'기기에 저장되지 않았어요. 화면의 글을 따로 복사해 주세요.':'작성한 문장과 도움 사용 기록을 저장했어요.',flowArt('unlock'))+
 `<section class="wcPanel wcPanel--mint"><small>${t('초급 · 첫 원인 문장 연습')}</small><h2>${t(g.titleKo)}</h2><p>${t('{0}개 문제를 풀었어요. 모든 문장의 뜻이 맞다고 판정한 것은 아니에요.',count)}</p></section>`+
 (next?`<section class="wcNextStage"><small>${t('다음에 열릴 연습')}</small><h2>${t(next.titleKo)}</h2><p>${t('다음 단계로 가도 이전 문장을 다시 고칠 수 있어요.')}</p></section>`:`<section class="wcPanel"><h2>${t('다른 날 새 문장으로 다시 써요')}</h2><p>${t('첫 도움 없는 쓰기에서 24시간 이상 지나고 날짜가 바뀌면 새 상황이 열려요. 기다리는 동안 다른 연습을 해도 좋아요.')}</p>${flowArt('return')}</section>`)+
 footer(next?'다음 단계 열기':'첫 연습 마치기',`harumalWritingContinue('${id}')`)+button(E.getStorageError()?'지금 나가기':'지금 나가기 · 여기까지 저장됨',"harumalWritingExit()",'text');
}
function guidedStrip(i){
 const p=guided();if(!p.active)return '';
 const stages=DATA.groups.filter(g=>!g.delayedOnly),g=group(i.groupId),index=stages.findIndex(g=>g.id===i.groupId);
 return `<div class="wcGuidedProgress"><span>${t('초급 · 첫 원인 문장 연습')}</span><strong>${t('{0}/{1}단계 · {2}/{3}문제',index+1,stages.length,g.itemIds.indexOf(i.id)+1,g.itemIds.length)}</strong><small>${t('단계 표시는 풀이 순서예요. 실력 점수가 아니에요.')}</small></div>`;
}
function map(){
 const block=(ids,title,copy)=>`<section class="wcMapBlock"><h2>${T(title)}</h2><p>${T(copy)}</p><div class="wcNodeLinks">${ids.map(id=>{const n=DATA.nodes.find(n=>n.id===id);return n?`<button type="button" onclick="harumalWritingGo('node','${id}')">${h(id)} · ${t(n.titleKo)} <small>${t(id==='S07'?'첫 소단원 연습 가능':'드릴 준비 중')}</small></button>`:''}).join('')}</div></section>`;
 return heading('공통 기초 · 문장 능력 지도','문장에 필요한 힘을<br>하나씩 연결해요','능력 묶음마다 확인 상태를 따로 기록해요.')+
 block(['S01','S02','S03','S04'],'문장 골격과 기본 표현','한 사실 · 조사 역할 · 형태와 호응 · 시점과 부정')+
 `<div class="wcMapConnector" aria-hidden="true">↓</div><div class="wcMapColumns">${block(['S05','S06'],'정보 더하기','시간 · 장소 · 대상 · 수식과 절 확장')}${block(['S07','S08','S09','S10'],'관계 잇기','원인 · 대조 · 조건 · 목적 · 비교')}</div>`+
 `<button class="wcCurrent" onclick="harumalWritingGo('unit')"><small>${t('지금 연습할 능력 · S07 첫 소단원')}</small><strong>${t('원인과 결과를 한 문장으로')}<span aria-hidden="true">→</span></strong></button>`+
 block(['S11','S12'],'문장 사이의 흐름과 글의 목적','지시 대상 · 정보 순서 · 독자에 맞는 표현')+block(['D01','D02'],'문단 조직 → 글 전체 구성','중심 생각과 뒷받침 → 요구별 문단과 수정')+
 `<p class="wcNote">${t('선택한 과제에 필요한 하위 능력만 확인해요. 이 지도 전체를 끝내야 다음 능력을 볼 수 있는 것은 아니에요.')}</p>`+footer('원인 문장 소단원 보기',"harumalWritingGo('unit')");
}
function nodePage(id){const n=DATA.nodes.find(n=>n.id===id);if(!n)return map();return heading(T('{0} · 문장 능력',h(id)),t(n.titleKo),t(n.summaryKo||''))+`<section class="wcPanel"><h2>${t('필요한 선수 능력')}</h2><p>${t(n.prerequisiteNoteKo||'이 과제에서 실제로 필요한 하위 기능을 먼저 확인해요.')}</p><div class="wcNodeLinks">${(n.prerequisites||[]).map(p=>`<button onclick="harumalWritingGo('node','${h(p)}')">${t('{0} 자세히 보기',p)}</button>`).join('')}</div></section>`+(id==='S07'?`<section class="wcPanel wcPanel--mint"><h2>${t('첫 원인 소단원은 연습할 수 있어요')}</h2><p>${t('기본 상태 서술어와 하다 동작의 아서·어서·해서를 충분히 연습해요. 때문에·기 때문에와 새로운 활용은 별도 소단원으로 준비 중이에요.')}</p></section>`+footer('첫 원인 소단원 열기',"harumalWritingGo('unit')"):`<section class="wcPanel">${badge('드릴 준비 중')}<p>${t('이 능력의 충분한 문항 은행은 아직 준비 중이에요. 지도에 보인다고 이 과정을 이미 제공하거나 학습 완료로 처리하지 않아요.')}</p></section>`+button('준비된 원인 문장 연습',"harumalWritingGo('unit')",'secondary'));}
function unit(){
 const e=E.evidence();
 return heading('이유와 설명 · 첫 소단원','원인과 결과를<br>한 문장으로','첫 범위 · 기본 상태 서술어와 하다 동작',art('work'))+
 `<section class="wcPanel"><h2>${t('들어오기 전, 필요한 것')}</h2><p>${t('짧은 해요체 문장 만들기 · 이번 문항의 단어와 두 사실의 뜻')}</p>${button('짧은 문장과 뜻부터 확인',"harumalWritingGo('group','probe-basics')",'secondary')}</section>`+
 `<h2 class="wcSectionTitle">${t('이번 소단원 안에서')}</h2><div class="wcFormTabs">${[['form-aseo','아서'],['form-eoseo','어서'],['form-haeseo','해서']].map(([id,t])=>button(T('{0} 묶음',t), `harumalWritingGo('group','${id}')`,'secondary')).join('')}</div>`+
 `<ol class="wcSteps"><li>${t('형태별로 익히고, 문장 전체 쓰기')}</li><li>${t('형태를 섞어 새 내용으로 쓰기')}</li><li>${t('시점 · 주체 · 부정을 하나씩 바꾸기')}</li><li>${t('필요한 정보 하나 더하기')}</li><li>${t('예문 없이 새 상황에서 쓰기')}</li><li>${t('다른 날, 새 문장으로 다시 확인')}</li></ol>`+
 DATA.groups.filter(g=>g.stage!=='form'&&g.stage!=='probe').map(g=>linkCard(g.stage==='delayed'?'↻':'·',t(g.titleKo),g.stage==='delayed'?(e.delayedReady?'새 상황 확인 가능':e.delayedAt?T('{0} 이후 · 최소 24시간과 날짜 변경',localeDate(e.delayedAt)):'독립 작성 후 다른 날에 열려요'):t(g.helpKo||''),`harumalWritingGo('group','${g.id}')`)).join('')+
 `<p class="wcNote">${t('먹어서 · 사서 · 와서와 불규칙 활용, 때문에 · 기 때문에 등은 이후 별도 소단원에서 배워요. 여기서 모든 이유 표현을 숙달했다고 표시하지 않아요.')}</p>`+footer('아서 묶음 연습하기',"harumalWritingGo('group','form-aseo')")+button('성장 증거 보기',"harumalWritingGo('records')",'text');
}
function prerequisiteMarkup(g){
 const keys=(g?.prerequisites||[]).filter(k=>k!=='reason_form');
 if(!keys.length)return'';
 return `<details class="wcPrerequisites" ${readinessMissing(g).length?'open':''}><summary>${t('이 묶음에 필요한 준비')} ${readinessMissing(g).length?t('· 아직 확인 전'):''}</summary><p>${t('알고 있는지 스스로 알려 주세요. 이 선택은 숙달 증거가 아니에요. 자신 없으면 짧은 확인부터 할 수 있어요.')}</p>${keys.map(key=>{const p=(DATA.prerequisites||[]).find(p=>p.id===key);const r=state().readiness[key];return `<div class="wcReadiness"><strong>${t(p?.titleKo||key)}</strong><small>${t(p?.helpKo||'이 문항의 단어와 기본 표현을 확인해요.')}</small><div>${button('알고 있어요',`harumalWritingReady('${key}','ready')`,r?.value==='ready'?'selected':'secondary','aria-pressed="'+String(r?.value==='ready')+'"')}${button('도움이 필요해요',`harumalWritingReady('${key}','needs_help')`,r?.value==='needs_help'?'selected':'secondary','aria-pressed="'+String(r?.value==='needs_help')+'"')}</div></div>`}).join('')}${button('기본 문장·뜻 확인하기',"harumalWritingGo('group','probe-basics')",'text')}</details>`;
}
function groupPage(id){
 const g=group(id);if(!g)return unit();
 if(g.delayedOnly&&!E.delayedReady())return heading('다른 날 확인','조금 간격을 두고<br>새 문장을 써요','바로 본 답을 기억하는 것과, 다른 날에도 사용할 수 있는 것은 따로 확인해요.',mascot('review-thinking'))+`<section class="wcPanel"><h2>${E.delayedAt()?t('{0} 이후',localeDate(E.delayedAt())):t('먼저 새 상황에서 독립 작성해요')}</h2><p>${t('첫 독립 작성에서 최소 24시간이 지나고 날짜가 바뀌면 열려요. 기다리는 동안 다른 준비된 능력을 연습할 수 있어요.')}</p></section>`+footer('예문 없이 새 상황 쓰기',"harumalWritingGo('group','independent-new')")+button('다른 연습 보기',"harumalWritingGo('unit')",'text');
 const completed=(g.itemIds||[]).filter(id=>state().attempts.some(a=>a.itemId===id)).length;
 return heading(T('원인 문장 · {0}',T(g.stage==='independent'?'혼자 쓰기 확인':g.stage==='delayed'?'다른 날 확인':'집중 연습')),t(g.titleKo),t(g.helpKo||''))+
 prerequisiteMarkup(g)+(g.stage==='form'?`<section class="wcPanel wcPanel--mint"><small>${t('이번에 새로 배우는 연결 형태')}</small><h2 lang="ko">${g.id==='form-aseo'?'많다 → 많아서 · 좋다 → 좋아서':g.id==='form-eoseo'?'없다 → 없어서 · 멀다 → 멀어서':'하다 → 해서'}</h2><p>${t('완성된 해요체 뒤에 ‘서’를 붙이지 않아요. 한 형태를 익힌 뒤 문장 전체를 직접 써요.')}</p></section>`:'')+
 `<p class="wcNote">${t('{0}/{1}개 문항에 작성 기록이 있어요. 작성 횟수는 숙달 점수가 아니에요.',completed,(g.itemIds||[]).length)}</p>`+
 (g.itemIds||[]).map((id,index)=>{const i=item(id),seen=state().attempts.some(a=>a.itemId===id),fresh=i.evidence?.independent||i.evidence?.delayed;return linkCard(index+1,fresh?T('새 상황 {0}',index+1):i.titleKo?t(i.titleKo):i.facts?.length?korean(i.facts.map(f=>f.ko).join(' / ')):t(i.promptKo),seen?'기록 있음 · 다시 쓰기는 연습으로 기록':fresh?'제출 전에는 예시답안을 보여 주지 않아요':i.kind==='relation'?'두 사실의 뜻을 구별해요':'문장 전체를 직접 써요',`harumalWritingStart('${id}')`)}).join('')+
 footer('소단원으로 돌아가기',"harumalWritingGo('unit')");
}
function support(i){
 const s=i.support||{},v=s.vocabulary||[],d=E.draft(i.id);
 // P04 tests the meaning of 없다: its optional support must not disclose the answer.
 const factMeaning=f=>i.id==='P04'?T(f.ja):T(f.ko);
 return `<details class="wcSupport" ${d.helpOpened?'open':''} ontoggle="if(this.open)harumalWritingHelp('${i.id}','meaning')"><summary>${t('단어 뜻 · 상황 도움')}</summary>${s.meaningJa?`<p>${t(s.meaningJa)}</p>`:''}${i.facts?.length?`<ul>${i.facts.map(f=>`<li>${h(factMeaning(f))}</li>`).join('')}</ul>`:''}${v.length?`<p>${v.map(v=>`${korean(v.ko)} · ${t(v.ko)}`).join('<br>')}</p>`:''}<p class="wcNote">${t('뜻 도움을 연 기록은 남지만, 의미 숙달이나 오답으로 처리하지 않아요.')}</p></details>`;
}
function historyAnswer(attempt){
 const i=item(attempt.itemId);
 if(i?.kind==='relation'){
  const choice=i.choices?.find(c=>c.id===attempt.text);
  if(choice)return i.id==='P05'?korean(choice.labelKo):t(choice.labelKo);
 }
 return korean(attempt.text);
}
function prerequisiteGate(i){
 const g=group(i.groupId);if(g.stage==='probe')return '';
 const needs=(i.prerequisites||g.prerequisites||[]).filter(key=>state().readiness[key]?.value==='needs_help');
 if(!needs.length)return '';
 return heading('필요한 부분부터 준비해요','모르는 요소를<br>한꺼번에 얹지 않아요','도움이 필요하다고 표시한 기능부터 확인해요.')+prerequisiteMarkup({...g,prerequisites:needs})+`<p class="wcNote">${t('뜻이 미검토인 문장을 오답으로 막는 것이 아니에요. 직접 준비가 필요하다고 표시한 표현만 먼저 확인해요.')}</p>`+footer('기본 문장·뜻 확인',"harumalWritingGo('group','probe-basics')")+button('다른 준비된 연습 보기',"harumalWritingGo('unit')",'text');
}
function itemPage(id){
 const i=item(id);if(!i)return unit();const gate=prerequisiteGate(i);if(gate)return gate;if(!E.eligible(id))return groupPage(i.groupId);
 const g=group(i.groupId),d=E.draft(id),prev=state().attempts.filter(a=>a.itemId===id),independent=i.evidence?.independent||i.evidence?.delayed;
 const title=g.stage==='correction'?'뜻은 유지하고,<br>필요한 부분을 고쳐요':g.stage==='expansion'?'길이보다,<br>전할 정보를 분명히':g.stage==='delayed'?'며칠 뒤에도<br>내 문장으로 써봐요':independent?'처음 보는 상황에서<br>혼자 써볼까요?':g.stage==='variation'?'바꾸는 조건은 하나,<br>뜻을 유지해요':'두 사실의 뜻을<br>그대로 이어 써요';
 return guidedStrip(i)+heading(T('원인 문장 · {0}',t(g.titleKo)),title,prev.length?'이전에 본 문항이에요. 다시 쓴 답은 연습으로 남겨요.':independent?'첫 답과 도움 사용을 별도로 기록해요.':'형태를 익힌 뒤 문장 전체를 직접 써요.')+
 `<section class="wcFacts ${independent?'wcFacts--scene':''}">${art(i.image||i.imageKey)}<div lang="ko">${(i.facts||[]).map(f=>`<p>${h(f.ko)}</p>`).join('')}</div></section>`+
 (i.draftKo?`<section class="wcPanel wcPanel--warm"><small>${t('고쳐 볼 초고')}</small><p class="wcDraftText" lang="ko">${h(i.draftKo)}</p></section>`:'')+
 (g.stage==='form'&&i.evidence?.assistedByDesign?`<section class="wcPanel wcPanel--mint"><small>${t('연결 형태 도움')}</small><h2>${i.support?.lessonKo?korean(i.support.lessonKo):t('이번 연결 형태를 확인해요')}</h2><p>${t('완성된 해요체에 ‘서’를 바로 붙이지 않아요.')}</p></section>`:'')+
 `<p class="wcPrompt" id="wcPrompt">${t(i.promptKo)}</p>`+
 (i.kind==='relation'?`<fieldset class="wcChoices"><legend class="wcSrOnly">${t('뜻에 맞는 답 고르기')}</legend>${(i.choices||[]).map(c=>`<label><input type="radio" name="wcChoice" value="${h(c.id)}" ${d.text===c.id?'checked':''} onchange="harumalWritingDraft('${id}',this.value)"><span>${i.id==='P05'?korean(c.labelKo):t(c.labelKo)}</span></label>`).join('')}</fieldset>`:`<label class="wcSrOnly" for="wcAnswer">${t('내 문장')}</label><textarea id="wcAnswer" class="wcAnswer" rows="${independent?6:4}" maxlength="4000" aria-describedby="wcPrompt wcSaveState" lang="ko" placeholder="${t('여기에 내 문장을 써보세요')}" oninput="harumalWritingDraft('${id}',this.value)">${h(d.text)}</textarea><div class="wcSaveState" id="wcSaveState" role="status">${t(E.getStorageError()?'기기에 저장되지 않았어요. 화면의 글을 따로 복사해 주세요.':'이 기기에 초고 자동 저장')}</div>`)+
 support(i,d)+`<p class="wcNote" id="wcHelpState">${t(d.helpOpened?'뜻 도움 사용 기록 있음':independent?'도움을 열면 도움 사용 기록이 남아요.':'도움 있는 연습으로 기록될 수 있어요.')}</p><p id="wcInlineError" role="alert"></p>`+
 footer(i.kind==='relation'?'뜻 확인하기':i.draftKo?'고친 문장 확인하기':'작성한 문장 확인하기',`harumalWritingSubmit('${id}')`)+
 (prev.length?button('지난 작성 기록 보기',`harumalWritingGo('feedback','${id}')`,'text'):'');
}
function feedback(id){
 const i=item(id),attempt=state().attempts.filter(a=>a.itemId===id).at(-1);if(!i||!attempt)return itemPage(id);
 const ev=attempt.evaluation,g=group(i.groupId),d=E.draft(id),idx=g.itemIds.indexOf(id),next=g.itemIds[idx+1],flow=guided().active;
 const label=ev.status==='needs_practice'?'한 부분만 다시 확인해요':ev.status==='interpretation_observed'?'이 문항의 뜻을 구별했어요':'문장을 남겼어요';
 const status={practice:'도움 있는 연습',revision:'수정·반복 연습',independent:'새 상황 첫 독립 작성',delayed:'다른 날 새 상황 작성',interpretation:'뜻 구별 문항'}[attempt.mode]||'연습';
 return guidedStrip(i)+heading('원인 문장 · 작성 기록',label,'첫 답과 수정한 답은 따로 남겨요.',mascot(ev.status==='needs_practice'?'review-thinking':'answer-correct'))+
 `<section class="wcPanel wcPanel--warm"><small>${t(i.kind==='relation'?'방금 쓴 답':'방금 쓴 문장')}</small><p class="wcDraftText">${i.kind==='relation'?(i.id==='P05'?korean((i.choices||[]).find(c=>c.id===attempt.text)?.labelKo||attempt.text):t((i.choices||[]).find(c=>c.id===attempt.text)?.labelKo||attempt.text)):korean(attempt.text)}</p>${badge(status,'mint')}</section>`+
 `<section class="wcFeedback" role="status"><h2>${t(ev.form==='observed'?'목표 형태 확인 · 의미 미검토':ev.status==='interpretation_observed'?'이 선택의 뜻 구별만 확인':'확인한 부분과 남은 부분')}</h2>${ev.messages.map(m=>`<p>${t(m)}</p>`).join('')}<p class="wcNote">${t('자동 규칙 확인, 자기점검, 사람의 의미 검토를 구분해요. 전체 문장의 정답이나 숙달 판정이 아니에요.')}</p></section>`+
 (i.kind!=='relation'?`<section class="wcPanel"><h2>${t('내 문장 다시 읽기')}</h2><ul class="wcChecklist"><li>${t(g.stage==='probe'?'누가, 어디서, 무엇을 하는지 분명한가요?':'앞부분이 뒤 행동의 이유인가요?')}</li><li>${t('누가, 언제, 무엇을 하는지 뜻이 유지됐나요?')}</li><li>${t(g.stage==='expansion'?'더한 정보가 실제로 무엇을 알려 주나요?':'주어진 사실을 바꾸거나 빼지 않았나요?')}</li></ul><div class="wcFormTabs">${button('뜻을 다시 읽었어요',`harumalWritingSelfCheck('${attempt.id}','checked')`,attempt.selfCheck?.value==='checked'?'selected':'secondary')}${button('더 검토할래요',`harumalWritingSelfCheck('${attempt.id}','needs_review')`,attempt.selfCheck?.value==='needs_review'?'selected':'secondary')}</div><small>${t('자기점검은 사람의 의미 검토 완료로 기록되지 않아요.')}</small></section>`:'')+
 (i.models?.length?`<section class="wcModel">${d.modelViewed?`<h2>${t('가능한 문장 예시')}</h2>${i.models.map(m=>`<p lang="ko">${h(m)}</p>`).join('')}<small>${t('같은 뜻의 자연스러운 다른 답도 가능해요.')}</small>`:button('제출 후 가능한 문장 비교',`harumalWritingModel('${id}')`,'secondary')}</section>`:'')+
 (flow?footer(ev.status==='needs_practice'?'전체 문장 다시 써보기':'다음으로',ev.status==='needs_practice'?`harumalWritingGo('item','${id}')`:`harumalWritingContinue('${id}')`):footer(ev.status==='needs_practice'?'전체 문장 다시 써보기':next?'다음 문장 써보기':'이 묶음의 기록 보기',ev.status==='needs_practice'?`harumalWritingGo('item','${id}')`:next?`harumalWritingGo('item','${next}')`:"harumalWritingGo('records')"))+
 `<div class="wcSplitLinks">${button('다시 쓰기',`harumalWritingGo('item','${id}')`,'text')}${flow?(ev.status==='needs_practice'?button('기록을 남기고 다음으로',`harumalWritingContinue('${id}')`,'text'):''):button('필요한 형태만 보충',`harumalWritingGo('group','${i.targetForm==='아서'?'form-aseo':i.targetForm==='어서'?'form-eoseo':'form-haeseo'}')`,'text')}</div>`;
}
function records(){
 const s=state(),e=E.evidence();const latestByItem=new Map(s.attempts.map(a=>[a.itemId,a]));const problems=[...latestByItem.values()].filter(a=>a.evaluation.status==='needs_practice');
 return heading('나의 쓰기 기록 · 실제 저장된 증거','연습과 확인을<br>따로 남겨요','원인과 결과 연결 · 이 기기의 기록',mascot('lesson-complete'))+
 `<div class="wcEvidenceCards"><section class="wcPanel">${badge('연습 중','warm')}<h2>${t('{0}회 연습·수정 기록',e.practice)}</h2><p>${['아서','어서','해서'].map(f=>T('{0} 형태 {1}개 문항에서 감지',f,e.forms[f])).join(' · ')}</p></section><section class="wcPanel">${badge('혼자 쓰기 확인','mint')}<h2>${t('새 상황 첫 답 {0}개',e.independent)}</h2><p>${t('목표 형태와 도움 여부를 따로 보관 · 의미 미검토')}</p></section><section class="wcPanel">${badge('다른 날 다시 확인')}<h2>${t('새 상황 지연 작성 {0}개',e.delayed)}</h2><p>${e.delayedReady?t('새 상황을 열 수 있어요. 이미 본 문항은 반복 연습이에요.'):e.delayedAt?t('{0} 이후 확인',localeDate(e.delayedAt)):t('첫 독립 작성 후 최소 24시간과 날짜 변경을 기다려요.')}</p></section><section class="wcPanel">${badge('정보 확장 · 글 안 적용')}<h2>${t('정보 확장 {0}회 · 문단 적용 미준비',e.expansion)}</h2><p>${t('사람의 의미 검토 {0}개 · 전체 54번 숙달을 판정하지 않아요',e.meaningReviewed)}</p></section></div>`+
 `<section class="wcPanel wcPanel--mint"><small>${t('다음으로 할 일')}</small><h2>${t(problems.length?'막힌 형태부터 보충해요':e.delayedReady?'새 상황으로 다른 날 확인해요':e.independent?'다른 준비된 조건도 연습해요':'예문 없이 새 상황에서 써봐요')}</h2><p>${t('기록 수를 합쳐 하나의 점수나 완주율로 바꾸지 않아요.')}</p></section>`+
 footer(problems.length?'필요한 연습으로 돌아가기':e.delayedReady?'다른 날 새 문장 확인':'새 상황에서 혼자 쓰기',problems.length?`harumalWritingGo('item','${problems.at(-1).itemId}')`:e.delayedReady?"harumalWritingGo('group','delayed-new')":"harumalWritingGo('group','independent-new')")+
 `<h2 class="wcSectionTitle">${t('작성 이력 {0}개',s.attempts.length)}</h2>${s.attempts.length?`<div class="wcHistory">${[...s.attempts].reverse().map(a=>`<details><summary>${t(group(a.groupId)?.titleKo||a.groupId)} · ${localeDate(a.createdAt)}<small>${t(a.mode==='independent'?'독립 첫 답':a.mode==='delayed'?'지연 새 답':a.mode==='revision'?'수정·반복':'연습')} · ${t(a.evaluation.form==='observed'?'목표 형태 확인':'형태 확인 범위 제한')} · ${t(a.evaluation.meaning==='bounded_choice_only'?'뜻: 선택 문항만 확인':'뜻: 미검토')}</small></summary><p class="wcDraftText">${historyAnswer(a)}</p><p>${t(a.helpUsed?'도움 사용 있음':'도움 사용 없음')}${a.selfCheck?` · ${t(a.selfCheck.value==='checked'?'자기점검 완료':'자기점검 재검토')}`:''}</p>${button('이 문항 다시 보기',`harumalWritingGo('item','${a.itemId}')`,'text')}</details>`).join('')}</div>`:`<p class="wcNote">${t('아직 작성한 문장이 없어요. 화면을 열거나 버튼을 누른 것만으로는 학습 기록이 생기지 않아요.')}</p>`}`;
}
function exam(id){const n=Number(id),copy={51:'생활 목적에 맞는 한 문장 · 알림과 요청',52:'설명 관계를 유지하며 앞뒤 문맥 이어 쓰기',53:'제공된 자료만 정확히 연결해 200~300자로 설명하기',54:'과제의 요구에 맞는 생각을 600~700자로 조리 있게 쓰기'}[n];return heading(T('TOPIK II PBT · {0}번',n),t(copy||'기존 쓰기 연습'),'기초에서 익힌 능력을 글의 목적에 맞게 넓혀요.')+`<section class="wcPanel"><h2>${t('이 단계의 과정은 준비 중이에요')}</h2><p>${t('기존 51~54번 쓰기 문제와 모의고사는 계속 사용할 수 있어요. 충분한 선수 드릴을 마친 정규 과정으로 표시하지 않아요.')}</p><p>${t('자동 점수는 학습용 참고치이며 공식 채점이나 자유 글의 의미 평가가 아니에요.')}</p></section>`+footer('기존 TOPIK II 쓰기 연습 열기',"harumalWritingOpenExam()")+button('문장 능력 지도 보기',"harumalWritingGo('map')",'text');}
function renderPage(){
 const sc=document.getElementById('screen');if(!sc)return;const r=state().route||{page:'course'};
 sc.className='screen wcScreen';sc.dataset.harumalView=VIEW;sc.lang=language()==='zh'?'zh-CN':language();
 const content=r.page==='level'?levelPage(r.levelId):r.page==='stage-done'?stageDone(r.groupId):r.page==='map'?map():r.page==='node'?nodePage(r.nodeId):r.page==='unit'?unit():r.page==='group'?groupPage(r.groupId):r.page==='item'?itemPage(r.itemId):r.page==='feedback'?feedback(r.itemId):r.page==='records'?records():r.page==='exam'?exam(r.examId):course();
 sc.innerHTML=crumbs(returnAction(r))+(E.getStorageError()?`<aside class="wcStorageWarning" role="alert">${t(E.getStorageError()==='newer-storage'?'이 기록은 더 새로운 버전에서 저장됐어요. 원본은 그대로 두고 이번 화면의 기록은 임시로만 보관해요.':'저장 공간을 사용할 수 없거나 기존 기록을 읽지 못했어요. 기존 원본은 지우지 않아요. 이번 문장을 따로 복사해 주세요.')}</aside>`:'')+content;
 document.body.classList.add('wcActive');document.body.classList.remove('tq-home-active');
 window.requestAnimationFrame?.(()=>{if(!document.activeElement?.classList?.contains('wcLanguage'))sc.querySelector('h1')?.focus({preventScroll:true})});
}
let changingHistory=false;
const baseSetView=window.setView,baseRender=window.render;
function rememberHistory(route,replace=false){try{const value={...(history.state||{}),harumalWritingRoute:route,harumalWritingGuided:Boolean(guided().active)};(replace?history.replaceState:history.pushState).call(history,value,'')}catch{}}
function navigate(page='course',id='',replace=false){
 if(['course','map','node','unit','group','level','exam','records'].includes(page))E.leaveGuided?.();
 const route={page};if(page==='node')route.nodeId=id;if(page==='group'||page==='stage-done')route.groupId=id;if(page==='level')route.levelId=id;if(page==='item'||page==='feedback')route.itemId=id;if(page==='exam')route.examId=id;
 if(S.view!==VIEW){try{history.replaceState({...(history.state||{}),harumalWritingRoute:null,harumalReturnView:S.view},'')}catch{}}
 if(guided().active&&['item','feedback','stage-done'].includes(page))E.setGuidedRoute?.(route);
 E.route(route);rememberHistory(route,replace);changingHistory=true;baseSetView.call(window,VIEW);changingHistory=false;window.scrollTo?.({top:0,behavior:'instant'});
}
window.setView=function(view){if(S.view===VIEW&&view!==VIEW&&!changingHistory){try{history.pushState({harumalWritingRoute:null,harumalReturnView:view},'')}catch{}}return baseSetView.apply(this,arguments)};
window.render=function(){if(S.view!==VIEW){document.body.classList.remove('wcActive');return baseRender.apply(this,arguments)}if(typeof hideSelection==='function')hideSelection();if(typeof renderShell==='function')renderShell();renderPage()};
function openRoute(route){if(route)navigate(route.page,route.itemId||route.groupId||route.levelId||'')}
window.harumalWritingLanguage=lang=>{
 const restoreFocus=document.activeElement?.classList?.contains('wcLanguage');
 if(typeof window.malbitSetLanguage==='function')window.malbitSetLanguage(lang);
 else if(typeof window.setLang==='function')window.setLang(lang);
 if(restoreFocus)document.querySelector?.('.wcLanguage')?.focus();
};
window.harumalWritingGo=navigate;
window.harumalWritingBegin=()=>courseFinished(guided())?navigate('unit'):openRoute(E.startGuided?.()||{page:'item',itemId:'P01'});
window.harumalWritingResume=()=>openRoute(E.resumeGuided?.()||state().route);
window.harumalWritingContinue=id=>{const r=state().route;if(!guided().active&&r.page==='stage-done'&&r.groupId===id)E.startGuided?.(id);openRoute(E.continueGuided?.(id))};
window.harumalWritingExplore=()=>{E.leaveGuided?.();navigate('map')};
window.harumalWritingStart=id=>navigate('item',id);
window.harumalWritingExit=()=>setView('learn');
window.harumalWritingDraft=(id,text)=>{E.setDraft(id,text);const note=document.getElementById('wcSaveState');if(note)note.textContent=T(E.getStorageError()?'기기에 저장되지 않았어요. 글을 따로 복사해 주세요.':'이 기기에 초고 자동 저장')};
window.harumalWritingHelp=(id,type)=>{E.help(id,type);const note=document.getElementById('wcHelpState');if(note)note.textContent=T('뜻 도움 사용 기록 있음 · 첫 답의 도움 여부를 따로 남겨요.')};
window.harumalWritingSubmit=id=>{const result=E.submit(id);if(result.blocked)return navigate('group',item(id)?.groupId);if(result.empty){const error=document.getElementById('wcInlineError');if(error)error.textContent=T('답을 먼저 작성하거나 골라 주세요.');return}navigate('feedback',id)};
window.harumalWritingReady=(id,value)=>{E.readiness(id,value);renderPage()};
window.harumalWritingSelfCheck=(id,value)=>{E.selfCheck(id,value);renderPage()};
window.harumalWritingModel=id=>{if(E.revealModel(id))renderPage()};
window.harumalWritingOpenExam=()=>{if(typeof tqSetLevel==='function')tqSetLevel(2);setView('realSetup')};
window.addEventListener?.('popstate',event=>{if(event.state?.harumalWritingRoute){if(event.state.harumalWritingGuided)E.resumeGuided?.();else if(event.state.harumalWritingGuided===false)E.leaveGuided?.();if(guided().active)E.setGuidedRoute?.(event.state.harumalWritingRoute);E.route(event.state.harumalWritingRoute);changingHistory=true;baseSetView(VIEW);changingHistory=false}else if(S.view===VIEW||event.state?.harumalReturnView){changingHistory=true;baseSetView(event.state?.harumalReturnView||'learn');changingHistory=false}});
window.HARUMAL_WRITING=Object.freeze({engine:E,data:DATA,render:renderPage,localeText:T,mergeImport:raw=>E.mergeImport(raw)});
if(S.view===VIEW)rememberHistory(state().route,true);
})();
