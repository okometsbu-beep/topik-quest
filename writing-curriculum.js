// HARUMAL writing corner: curriculum, focused sentence work, and honest local evidence.
(function(){
'use strict';
const DATA=window.HARUMAL_WRITING_DATA,engine=window.HARUMAL_WRITING_ENGINE;
if(!DATA||!engine)return;
let storage;try{storage=window.localStorage}catch{}
const E=engine.create(storage,DATA),VIEW='writingCourse';
const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const group=id=>DATA.groups.find(g=>g.id===id),item=id=>DATA.items.find(i=>i.id===id),state=()=>E.getState();
const isJapanese=()=>typeof S!=='undefined'&&S.lang==='ja';
const L=(ko,ja)=>isJapanese()?ja:ko;
const button=(label,action,kind='primary',extra='')=>`<button type="button" class="wcButton wcButton--${kind}" onclick="${action}" ${extra}>${label}</button>`;
const badge=(label,tone='quiet')=>`<span class="wcBadge wcBadge--${tone}">${h(label)}</span>`;
const art=(key,cls='wcScenario')=>key?`<img class="${cls}" src="assets/art/writing/context-${h(key)}-v1.webp" alt="" width="120" height="120" decoding="async">`:'';
const mascot=(pose='lesson-welcome')=>`<img class="wcMascot" src="assets/art/haruman/${pose}-v2.webp" alt="" width="112" height="112" decoding="async">`;
const heading=(eyebrow,title,copy='',image='')=>`<header class="wcHeading"><p class="wcEyebrow">${eyebrow}</p><div class="wcHeadingRow"><h1 tabindex="-1">${title}</h1>${image}</div>${copy?`<p class="wcLead">${copy}</p>`:''}</header>`;
const linkCard=(number,title,copy,action,extra='')=>`<button type="button" class="wcRouteCard ${extra}" onclick="${action}"><span class="wcNumber">${number}</span><span><strong>${title}</strong><small>${copy}</small></span><span class="wcArrow" aria-hidden="true">›</span></button>`;
const crumbs=back=>`<div class="wcTopline">${button('‹',back,'icon','aria-label="이전 화면"')}<strong>하루말 <small>HARUMAL / WRITING</small></strong>${button('×',"harumalWritingExit()",'icon','aria-label="작문 코너 닫기"')}</div>`;
const footer=(label,action,note='')=>`<div class="wcFooter">${note?`<p>${note}</p>`:''}${button(label,action)}</div>`;
function localeDate(value){try{return new Date(value).toLocaleString(isJapanese()?'ja-JP':'ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return''}}
function readinessMissing(g){return(g?.prerequisites||[]).filter(key=>key!=='reason_form'&&state().readiness[key]?.value!=='ready')}
function returnAction(route){return route.page==='course'?"harumalWritingExit()":route.page==='map'?"harumalWritingGo('course')":route.page==='node'?"harumalWritingGo('map')":route.page==='unit'?"harumalWritingGo('map')":route.page==='group'?"harumalWritingGo('unit')":['item','feedback'].includes(route.page)?`harumalWritingGo('group','${item(route.itemId)?.groupId||'probe-basics'}')`:"harumalWritingGo('course')"}
function course(){
 const s=state(),e=E.evidence(),resume=s.route?.itemId&&item(s.route.itemId);
 return heading(L('나의 쓰기 과정','私の作文コース'),L('한 문장부터<br>조리 있는 글까지','一文から、<br>筋道の通った文章へ'),'')+`<section class="wcHero"><div><h2>${L('매일 한 문장,<br>뜻을 더 분명하게','毎日の一文を、<br>より伝わる言葉に。')}</h2><p>최종 목표 · TOPIK II PBT 54번</p></div>${mascot('lesson-welcome')}</section><h2 class="wcSectionTitle">${L('배운 능력을 넓혀 쓰는 과정','使える力を、一歩ずつ広げる')}</h2>`+
 linkCard('기초','문장 속성 익히기','골격 · 역할 · 시점 · 연결 · 의미 있는 확장',"harumalWritingGo('map')",'wcRouteCard--active')+
 [[51,'생활 목적에 맞게 쓰기','알림 · 사정 설명 · 요청'],[52,'설명 관계를 유지하기','앞뒤 문맥과 논리 연결'],[53,'자료를 연결해 설명하기','수치 · 비교 · 변화 · 200~300자'],[54,'생각을 조리 있게 펼치기','중심 생각 · 근거 · 문단 · 600~700자']].map(([n,t,c])=>linkCard(n,t,c,`harumalWritingGo('exam','${n}')`)).join('')+
 `<p class="wcNote">준비된 능력부터 이어가고, 필요한 부분을 보충해요. 전체 차시 수와 기간은 아직 정하지 않았어요.</p>`+
 footer('문장 능력 지도 열기',"harumalWritingGo('map')")+
 `<div class="wcSplitLinks">${button(`성장 기록 ${e.independent?`· 독립 ${e.independent}`:''}`,"harumalWritingGo('records')",'text')}${button('첫 원인 소단원',"harumalWritingGo('unit')",'text')}</div>`+
 (e.delayedReady?`<aside class="wcNotice">다른 날의 새 상황 확인이 준비됐어요. ${button('새 문장으로 확인',"harumalWritingGo('group','delayed-new')",'secondary')}</aside>`:'');
}
function map(){
 const block=(ids,title,copy)=>`<section class="wcMapBlock"><h2>${title}</h2><p>${copy}</p><div class="wcNodeLinks">${ids.map(id=>{const n=DATA.nodes.find(n=>n.id===id);return n?`<button type="button" onclick="harumalWritingGo('node','${id}')">${h(id)} · ${h(n.titleKo)} <small>${id==='S07'?'첫 소단원 연습 가능':'드릴 준비 중'}</small></button>`:''}).join('')}</div></section>`;
 return heading('공통 기초 · 문장 능력 지도','문장에 필요한 힘을<br>하나씩 연결해요','능력 묶음마다 확인 상태를 따로 기록해요.')+
 block(['S01','S02','S03','S04'],'문장 골격과 기본 표현','한 사실 · 조사 역할 · 형태와 호응 · 시점과 부정')+
 `<div class="wcMapConnector" aria-hidden="true">↓</div><div class="wcMapColumns">${block(['S05','S06'],'정보 더하기','시간 · 장소 · 대상 · 수식과 절 확장')}${block(['S07','S08','S09','S10'],'관계 잇기','원인 · 대조 · 조건 · 목적 · 비교')}</div>`+
 `<button class="wcCurrent" onclick="harumalWritingGo('unit')"><small>지금 연습할 능력 · S07 첫 소단원</small><strong>원인과 결과를 한 문장으로 <span aria-hidden="true">→</span></strong></button>`+
 block(['S11','S12'],'문장 사이의 흐름과 글의 목적','지시 대상 · 정보 순서 · 독자에 맞는 표현')+block(['D01','D02'],'문단 조직 → 글 전체 구성','중심 생각과 뒷받침 → 요구별 문단과 수정')+
 `<p class="wcNote">선택한 과제에 필요한 하위 능력만 확인해요. 이 지도 전체를 끝내야 다음 능력을 볼 수 있는 것은 아니에요.</p>`+footer('원인 문장 소단원 보기',"harumalWritingGo('unit')");
}
function nodePage(id){const n=DATA.nodes.find(n=>n.id===id);if(!n)return map();return heading(`${h(id)} · 문장 능력`,h(n.titleKo),h(n.summaryKo||''))+`<section class="wcPanel"><h2>필요한 선수 능력</h2><p>${h(n.prerequisiteNoteKo||'이 과제에서 실제로 필요한 하위 기능을 먼저 확인해요.')}</p><div class="wcNodeLinks">${(n.prerequisites||[]).map(p=>`<button onclick="harumalWritingGo('node','${h(p)}')">${h(p)} 자세히 보기</button>`).join('')}</div></section>`+(id==='S07'?`<section class="wcPanel wcPanel--mint"><h2>첫 원인 소단원은 연습할 수 있어요</h2><p>기본 상태 서술어와 하다 동작의 아서·어서·해서를 충분히 연습해요. 때문에·기 때문에와 새로운 활용은 별도 소단원으로 준비 중이에요.</p></section>`+footer('첫 원인 소단원 열기',"harumalWritingGo('unit')"):`<section class="wcPanel">${badge('드릴 준비 중')}<p>이 능력의 충분한 문항 은행은 아직 준비 중이에요. 지도에 보인다고 이 과정을 이미 제공하거나 학습 완료로 처리하지 않아요.</p></section>`+button('준비된 원인 문장 연습',"harumalWritingGo('unit')",'secondary'));}
function unit(){
 const e=E.evidence();
 return heading('이유와 설명 · 첫 소단원','원인과 결과를<br>한 문장으로','첫 범위 · 기본 상태 서술어와 하다 동작',art('work'))+
 `<section class="wcPanel"><h2>들어오기 전, 필요한 것</h2><p>짧은 해요체 문장 만들기 · 이번 문항의 단어와 두 사실의 뜻</p>${button('짧은 문장과 뜻부터 확인',"harumalWritingGo('group','probe-basics')",'secondary')}</section>`+
 `<h2 class="wcSectionTitle">이번 소단원 안에서</h2><div class="wcFormTabs">${[['form-aseo','아서'],['form-eoseo','어서'],['form-haeseo','해서']].map(([id,t])=>button(`${t} 묶음`, `harumalWritingGo('group','${id}')`,'secondary')).join('')}</div>`+
 `<ol class="wcSteps"><li>형태별로 익히고, 문장 전체 쓰기</li><li>형태를 섞어 새 내용으로 쓰기</li><li>시점 · 주체 · 부정을 하나씩 바꾸기</li><li>필요한 정보 하나 더하기</li><li>예문 없이 새 상황에서 쓰기</li><li>다른 날, 새 문장으로 다시 확인</li></ol>`+
 DATA.groups.filter(g=>g.stage!=='form'&&g.stage!=='probe').map(g=>linkCard(g.stage==='delayed'?'↻':'·',h(g.titleKo),g.stage==='delayed'?(e.delayedReady?'새 상황 확인 가능':e.delayedAt?`${localeDate(e.delayedAt)} 이후 · 최소 24시간과 날짜 변경`:'독립 작성 후 다른 날에 열려요'):h(g.helpKo||''),`harumalWritingGo('group','${g.id}')`)).join('')+
 `<p class="wcNote">먹어서 · 사서 · 와서와 불규칙 활용, 때문에 · 기 때문에 등은 이후 별도 소단원에서 배워요. 여기서 모든 이유 표현을 숙달했다고 표시하지 않아요.</p>`+footer('아서 묶음 연습하기',"harumalWritingGo('group','form-aseo')")+button('성장 증거 보기',"harumalWritingGo('records')",'text');
}
function prerequisiteMarkup(g){
 const keys=(g?.prerequisites||[]).filter(k=>k!=='reason_form');
 if(!keys.length)return'';
 return `<details class="wcPrerequisites" ${readinessMissing(g).length?'open':''}><summary>이 묶음에 필요한 준비 ${readinessMissing(g).length?'· 아직 확인 전':''}</summary><p>알고 있는지 스스로 알려 주세요. 이 선택은 숙달 증거가 아니에요. 자신 없으면 짧은 확인부터 할 수 있어요.</p>${keys.map(key=>{const p=(DATA.prerequisites||[]).find(p=>p.id===key);const r=state().readiness[key];return `<div class="wcReadiness"><strong>${h(p?.titleKo||key)}</strong><small>${h(p?.helpKo||'이 문항의 단어와 기본 표현을 확인해요.')}</small><div>${button('알고 있어요',`harumalWritingReady('${key}','ready')`,r?.value==='ready'?'selected':'secondary','aria-pressed="'+String(r?.value==='ready')+'"')}${button('도움이 필요해요',`harumalWritingReady('${key}','needs_help')`,r?.value==='needs_help'?'selected':'secondary','aria-pressed="'+String(r?.value==='needs_help')+'"')}</div></div>`}).join('')}${button('기본 문장·뜻 확인하기',"harumalWritingGo('group','probe-basics')",'text')}</details>`;
}
function groupPage(id){
 const g=group(id);if(!g)return unit();
 if(g.delayedOnly&&!E.delayedReady())return heading('다른 날 확인','조금 간격을 두고<br>새 문장을 써요','바로 본 답을 기억하는 것과, 다른 날에도 사용할 수 있는 것은 따로 확인해요.',mascot('review-thinking'))+`<section class="wcPanel"><h2>${E.delayedAt()?`${localeDate(E.delayedAt())} 이후`:'먼저 새 상황에서 독립 작성해요'}</h2><p>첫 독립 작성에서 최소 24시간이 지나고 날짜가 바뀌면 열려요. 기다리는 동안 다른 준비된 능력을 연습할 수 있어요.</p></section>`+footer('예문 없이 새 상황 쓰기',"harumalWritingGo('group','independent-new')")+button('다른 연습 보기',"harumalWritingGo('unit')",'text');
 const completed=(g.itemIds||[]).filter(id=>state().attempts.some(a=>a.itemId===id)).length;
 return heading(`원인 문장 · ${g.stage==='independent'?'혼자 쓰기 확인':g.stage==='delayed'?'다른 날 확인':'집중 연습'}`,h(g.titleKo),h(g.helpKo||''))+
 prerequisiteMarkup(g)+(g.stage==='form'?`<section class="wcPanel wcPanel--mint"><small>이번에 새로 배우는 연결 형태</small><h2>${g.id==='form-aseo'?'많다 → 많아서 · 좋다 → 좋아서':g.id==='form-eoseo'?'없다 → 없어서 · 멀다 → 멀어서':'하다 → 해서'}</h2><p>완성된 해요체 뒤에 ‘서’를 붙이지 않아요. 한 형태를 익힌 뒤 문장 전체를 직접 써요.</p></section>`:'')+
 `<p class="wcNote">${completed}/${(g.itemIds||[]).length}개 문항에 작성 기록이 있어요. 작성 횟수는 숙달 점수가 아니에요.</p>`+
 (g.itemIds||[]).map((id,index)=>{const i=item(id),seen=state().attempts.some(a=>a.itemId===id),fresh=i.evidence?.independent||i.evidence?.delayed;return linkCard(index+1,fresh?`새 상황 ${index+1}`:h(i.titleKo||i.facts?.map(f=>f.ko).join(' / ')||i.promptKo),seen?'기록 있음 · 다시 쓰기는 연습으로 기록':fresh?'제출 전에는 예시답안을 보여 주지 않아요':i.kind==='relation'?'두 사실의 뜻을 구별해요':'문장 전체를 직접 써요',`harumalWritingStart('${id}')`)}).join('')+
 footer('소단원으로 돌아가기',"harumalWritingGo('unit')");
}
function support(i,d){const s=i.support||{},v=s.vocabulary||[];return `<details class="wcSupport" ontoggle="if(this.open)harumalWritingHelp('${i.id}','meaning')"><summary>단어 뜻 · 日本語で状況を確認</summary>${i.promptJa?`<p lang="ja">${h(i.promptJa)}</p>`:''}${s.meaningJa?`<p lang="ja">${h(s.meaningJa)}</p>`:''}${i.facts?.length?`<ul lang="ja">${i.facts.map(f=>`<li>${h(f.ja||'')}</li>`).join('')}</ul>`:''}${v.length?`<p>${v.map(v=>`${h(v.ko)} · ${h(v.ja)}`).join('<br>')}</p>`:''}<p class="wcNote">뜻 도움을 연 기록은 남지만, 의미 숙달이나 오답으로 처리하지 않아요.</p></details>`;}
function prerequisiteGate(i){
 const g=group(i.groupId);if(g.stage==='probe')return '';
 const needs=(i.prerequisites||g.prerequisites||[]).filter(key=>state().readiness[key]?.value==='needs_help');
 if(!needs.length)return '';
 return heading('필요한 부분부터 준비해요','모르는 요소를<br>한꺼번에 얹지 않아요','도움이 필요하다고 표시한 기능부터 확인해요.')+prerequisiteMarkup({...g,prerequisites:needs})+`<p class="wcNote">뜻이 미검토인 문장을 오답으로 막는 것이 아니에요. 직접 준비가 필요하다고 표시한 표현만 먼저 확인해요.</p>`+footer('기본 문장·뜻 확인',"harumalWritingGo('group','probe-basics')")+button('다른 준비된 연습 보기',"harumalWritingGo('unit')",'text');
}
function itemPage(id){
 const i=item(id);if(!i)return unit();const gate=prerequisiteGate(i);if(gate)return gate;if(!E.eligible(id))return groupPage(i.groupId);
 const g=group(i.groupId),d=E.draft(id),prev=state().attempts.filter(a=>a.itemId===id),independent=i.evidence?.independent||i.evidence?.delayed;
 const title=g.stage==='correction'?'뜻은 유지하고,<br>필요한 부분을 고쳐요':g.stage==='expansion'?'길이보다,<br>전할 정보를 분명히':g.stage==='delayed'?'며칠 뒤에도<br>내 문장으로 써봐요':independent?'처음 보는 상황에서<br>혼자 써볼까요?':g.stage==='variation'?'바꾸는 조건은 하나,<br>뜻을 유지해요':'두 사실의 뜻을<br>그대로 이어 써요';
 return heading(`원인 문장 · ${h(g.titleKo)}`,title,prev.length?'이전에 본 문항이에요. 다시 쓴 답은 연습으로 남겨요.':independent?'첫 답과 도움 사용을 별도로 기록해요.':'형태를 익힌 뒤 문장 전체를 직접 써요.')+
 `<section class="wcFacts ${independent?'wcFacts--scene':''}">${art(i.image||i.imageKey)}<div>${(i.facts||[]).map(f=>`<p>${h(f.ko)}</p>`).join('')}</div></section>`+
 (i.draftKo?`<section class="wcPanel wcPanel--warm"><small>고쳐 볼 초고</small><p class="wcDraftText">${h(i.draftKo)}</p></section>`:'')+
 (g.stage==='form'&&i.evidence?.assistedByDesign?`<section class="wcPanel wcPanel--mint"><small>연결 형태 도움</small><h2>${h(i.support?.lessonKo||'이번 연결 형태를 확인해요')}</h2><p>완성된 해요체에 ‘서’를 바로 붙이지 않아요.</p></section>`:'')+
 `<p class="wcPrompt" id="wcPrompt">${h(i.promptKo)}</p>`+
 (i.kind==='relation'?`<fieldset class="wcChoices"><legend class="wcSrOnly">뜻에 맞는 답 고르기</legend>${(i.choices||[]).map(c=>`<label><input type="radio" name="wcChoice" value="${h(c.id)}" ${d.text===c.id?'checked':''} onchange="harumalWritingDraft('${id}',this.value)"><span>${h(isJapanese()&&c.labelJa?c.labelJa:c.labelKo)}</span></label>`).join('')}</fieldset>`:`<label class="wcSrOnly" for="wcAnswer">내 문장</label><textarea id="wcAnswer" class="wcAnswer" rows="${independent?6:4}" maxlength="4000" aria-describedby="wcPrompt wcSaveState" placeholder="여기에 내 문장을 써보세요" oninput="harumalWritingDraft('${id}',this.value)">${h(d.text)}</textarea><div class="wcSaveState" id="wcSaveState" role="status">${E.getStorageError()?'기기에 저장되지 않았어요. 화면의 글을 따로 복사해 주세요.':'이 기기에 초고 자동 저장'}</div>`)+
 support(i,d)+`<p class="wcNote" id="wcHelpState">${d.helpOpened?'뜻 도움 사용 기록 있음':independent?'도움을 열면 도움 사용 기록이 남아요.':'도움 있는 연습으로 기록될 수 있어요.'}</p><p id="wcInlineError" role="alert"></p>`+
 footer(i.kind==='relation'?'뜻 확인하기':i.draftKo?'고친 문장 확인하기':'작성한 문장 확인하기',`harumalWritingSubmit('${id}')`)+
 (prev.length?button('지난 작성 기록 보기',`harumalWritingGo('feedback','${id}')`,'text'):'');
}
function feedback(id){
 const i=item(id),attempt=state().attempts.filter(a=>a.itemId===id).at(-1);if(!i||!attempt)return itemPage(id);
 const ev=attempt.evaluation,g=group(i.groupId),d=E.draft(id),idx=g.itemIds.indexOf(id),next=g.itemIds[idx+1];
 const label=ev.status==='needs_practice'?'한 부분만 다시 확인해요':ev.status==='interpretation_observed'?'이 문항의 뜻을 구별했어요':'문장을 남겼어요';
 const status={practice:'도움 있는 연습',revision:'수정·반복 연습',independent:'새 상황 첫 독립 작성',delayed:'다른 날 새 상황 작성',interpretation:'뜻 구별 문항'}[attempt.mode]||'연습';
 return heading('원인 문장 · 작성 기록',label,'첫 답과 수정한 답은 따로 남겨요.',mascot(ev.status==='needs_practice'?'review-thinking':'answer-correct'))+
 `<section class="wcPanel wcPanel--warm"><small>방금 쓴 ${i.kind==='relation'?'답':'문장'}</small><p class="wcDraftText">${h(i.kind==='relation'?(i.choices||[]).find(c=>c.id===attempt.text)?.labelKo||attempt.text:attempt.text)}</p>${badge(status,'mint')}</section>`+
 `<section class="wcFeedback" role="status"><h2>${ev.form==='observed'?'목표 형태 확인 · 의미 미검토':ev.status==='interpretation_observed'?'이 선택의 뜻 구별만 확인':'확인한 부분과 남은 부분'}</h2>${ev.messages.map(m=>`<p>${h(m)}</p>`).join('')}<p class="wcNote">자동 규칙 확인, 자기점검, 사람의 의미 검토를 구분해요. 전체 문장의 정답이나 숙달 판정이 아니에요.</p></section>`+
 (i.kind!=='relation'?`<section class="wcPanel"><h2>내 문장 다시 읽기</h2><ul class="wcChecklist"><li>${g.stage==='probe'?'누가, 어디서, 무엇을 하는지 분명한가요?':'앞부분이 뒤 행동의 이유인가요?'}</li><li>누가, 언제, 무엇을 하는지 뜻이 유지됐나요?</li><li>${g.stage==='expansion'?'더한 정보가 실제로 무엇을 알려 주나요?':'주어진 사실을 바꾸거나 빼지 않았나요?'}</li></ul><div class="wcFormTabs">${button('뜻을 다시 읽었어요',`harumalWritingSelfCheck('${attempt.id}','checked')`,attempt.selfCheck?.value==='checked'?'selected':'secondary')}${button('더 검토할래요',`harumalWritingSelfCheck('${attempt.id}','needs_review')`,attempt.selfCheck?.value==='needs_review'?'selected':'secondary')}</div><small>자기점검은 사람의 의미 검토 완료로 기록되지 않아요.</small></section>`:'')+
 (i.models?.length?`<section class="wcModel">${d.modelViewed?`<h2>가능한 문장 예시</h2>${i.models.map(m=>`<p>${h(m)}</p>`).join('')}<small>같은 뜻의 자연스러운 다른 답도 가능해요.</small>`:button('제출 후 가능한 문장 비교',`harumalWritingModel('${id}')`,'secondary')}</section>`:'')+
 footer(ev.status==='needs_practice'?'전체 문장 다시 써보기':next?'다음 문장 써보기':'이 묶음의 기록 보기',ev.status==='needs_practice'?`harumalWritingGo('item','${id}')`:next?`harumalWritingGo('item','${next}')`:"harumalWritingGo('records')")+
 `<div class="wcSplitLinks">${button('다시 쓰기',`harumalWritingGo('item','${id}')`,'text')}${button('필요한 형태만 보충',`harumalWritingGo('group','${i.targetForm==='아서'?'form-aseo':i.targetForm==='어서'?'form-eoseo':'form-haeseo'}')`,'text')}</div>`;
}
function records(){
 const s=state(),e=E.evidence();const latestByItem=new Map(s.attempts.map(a=>[a.itemId,a]));const problems=[...latestByItem.values()].filter(a=>a.evaluation.status==='needs_practice');
 return heading('나의 쓰기 기록 · 실제 저장된 증거','연습과 확인을<br>따로 남겨요','원인과 결과 연결 · 이 기기의 기록',mascot('lesson-complete'))+
 `<div class="wcEvidenceCards"><section class="wcPanel">${badge('연습 중','warm')}<h2>${e.practice}회 연습·수정 기록</h2><p>${['아서','어서','해서'].map(f=>`${f} 형태 ${e.forms[f]}개 문항에서 감지`).join(' · ')}</p></section><section class="wcPanel">${badge('혼자 쓰기 확인','mint')}<h2>새 상황 첫 답 ${e.independent}개</h2><p>목표 형태와 도움 여부를 따로 보관 · 의미 미검토</p></section><section class="wcPanel">${badge('다른 날 다시 확인')}<h2>새 상황 지연 작성 ${e.delayed}개</h2><p>${e.delayedReady?'새 상황을 열 수 있어요. 이미 본 문항은 반복 연습이에요.':e.delayedAt?`${localeDate(e.delayedAt)} 이후 확인`:'첫 독립 작성 후 최소 24시간과 날짜 변경을 기다려요.'}</p></section><section class="wcPanel">${badge('정보 확장 · 글 안 적용')}<h2>정보 확장 ${e.expansion}회 · 문단 적용 미준비</h2><p>사람의 의미 검토 ${e.meaningReviewed}개 · 전체 54번 숙달을 판정하지 않아요</p></section></div>`+
 `<section class="wcPanel wcPanel--mint"><small>다음으로 할 일</small><h2>${problems.length?'막힌 형태부터 보충해요':e.delayedReady?'새 상황으로 다른 날 확인해요':e.independent?'다른 준비된 조건도 연습해요':'예문 없이 새 상황에서 써봐요'}</h2><p>기록 수를 합쳐 하나의 점수나 완주율로 바꾸지 않아요.</p></section>`+
 footer(problems.length?'필요한 연습으로 돌아가기':e.delayedReady?'다른 날 새 문장 확인':'새 상황에서 혼자 쓰기',problems.length?`harumalWritingGo('item','${problems.at(-1).itemId}')`:e.delayedReady?"harumalWritingGo('group','delayed-new')":"harumalWritingGo('group','independent-new')")+
 `<h2 class="wcSectionTitle">작성 이력 ${s.attempts.length}개</h2>${s.attempts.length?`<div class="wcHistory">${[...s.attempts].reverse().map(a=>`<details><summary>${h(group(a.groupId)?.titleKo||a.groupId)} · ${localeDate(a.createdAt)}<small>${a.mode==='independent'?'독립 첫 답':a.mode==='delayed'?'지연 새 답':a.mode==='revision'?'수정·반복':'연습'} · ${a.evaluation.form==='observed'?'목표 형태 확인':'형태 확인 범위 제한'} · 의미 ${a.evaluation.meaning==='bounded_choice_only'?'선택 문항만 확인':'미검토'}</small></summary><p class="wcDraftText">${h(a.text)}</p><p>${a.helpUsed?'도움 사용 있음':'도움 사용 없음'}${a.selfCheck?` · 자기점검 ${a.selfCheck.value==='checked'?'완료':'재검토'}`:''}</p>${button('이 문항 다시 보기',`harumalWritingGo('item','${a.itemId}')`,'text')}</details>`).join('')}</div>`:'<p class="wcNote">아직 작성한 문장이 없어요. 화면을 열거나 버튼을 누른 것만으로는 학습 기록이 생기지 않아요.</p>'}`;
}
function exam(id){const n=Number(id),copy={51:'생활 목적에 맞는 한 문장 · 알림과 요청',52:'설명 관계를 유지하며 앞뒤 문맥 이어 쓰기',53:'제공된 자료만 정확히 연결해 200~300자로 설명하기',54:'과제의 요구에 맞는 생각을 600~700자로 조리 있게 쓰기'}[n];return heading(`TOPIK II PBT · ${n}번`,h(copy||'기존 쓰기 연습'),'기초에서 익힌 능력을 글의 목적에 맞게 넓혀요.')+`<section class="wcPanel"><h2>이 단계의 과정은 준비 중이에요</h2><p>기존 51~54번 쓰기 문제와 모의고사는 계속 사용할 수 있어요. 충분한 선수 드릴을 마친 정규 과정으로 표시하지 않아요.</p><p>자동 점수는 학습용 참고치이며 공식 채점이나 자유 글의 의미 평가가 아니에요.</p></section>`+footer('기존 TOPIK II 쓰기 연습 열기',"harumalWritingOpenExam()")+button('문장 능력 지도 보기',"harumalWritingGo('map')",'text');}
function renderPage(){
 const sc=document.getElementById('screen');if(!sc)return;const r=state().route||{page:'course'};
 sc.className='screen wcScreen';sc.dataset.harumalView=VIEW;
 const content=r.page==='map'?map():r.page==='node'?nodePage(r.nodeId):r.page==='unit'?unit():r.page==='group'?groupPage(r.groupId):r.page==='item'?itemPage(r.itemId):r.page==='feedback'?feedback(r.itemId):r.page==='records'?records():r.page==='exam'?exam(r.examId):course();
 sc.innerHTML=crumbs(returnAction(r))+(E.getStorageError()?`<aside class="wcStorageWarning" role="alert">${E.getStorageError()==='newer-storage'?'이 기록은 더 새로운 버전에서 저장됐어요. 원본은 그대로 두고 이번 화면의 기록은 임시로만 보관해요.':'저장 공간을 사용할 수 없거나 기존 기록을 읽지 못했어요. 기존 원본은 지우지 않아요. 이번 문장을 따로 복사해 주세요.'}</aside>`:'')+content;
 document.body.classList.add('wcActive');document.body.classList.remove('tq-home-active');
 window.requestAnimationFrame?.(()=>sc.querySelector('h1')?.focus({preventScroll:true}));
}
let changingHistory=false;
const baseSetView=window.setView,baseRender=window.render;
function rememberHistory(route,replace=false){try{const value={...(history.state||{}),harumalWritingRoute:route};(replace?history.replaceState:history.pushState).call(history,value,'')}catch{}}
function navigate(page='course',id='',replace=false){
 const route={page};if(page==='node')route.nodeId=id;if(page==='group')route.groupId=id;if(page==='item'||page==='feedback')route.itemId=id;if(page==='exam')route.examId=id;
 if(S.view!==VIEW){try{history.replaceState({...(history.state||{}),harumalWritingRoute:null,harumalReturnView:S.view},'')}catch{}}
 E.route(route);rememberHistory(route,replace);changingHistory=true;baseSetView.call(window,VIEW);changingHistory=false;window.scrollTo?.({top:0,behavior:'instant'});
}
window.setView=function(view){if(S.view===VIEW&&view!==VIEW&&!changingHistory){try{history.pushState({harumalWritingRoute:null,harumalReturnView:view},'')}catch{}}return baseSetView.apply(this,arguments)};
window.render=function(){if(S.view!==VIEW){document.body.classList.remove('wcActive');return baseRender.apply(this,arguments)}if(typeof hideSelection==='function')hideSelection();if(typeof renderShell==='function')renderShell();renderPage()};
window.harumalWritingGo=navigate;
window.harumalWritingStart=id=>navigate('item',id);
window.harumalWritingExit=()=>setView('learn');
window.harumalWritingDraft=(id,text)=>{E.setDraft(id,text);const note=document.getElementById('wcSaveState');if(note)note.textContent=E.getStorageError()?'기기에 저장되지 않았어요. 글을 따로 복사해 주세요.':'이 기기에 초고 자동 저장'};
window.harumalWritingHelp=(id,type)=>{E.help(id,type);const note=document.getElementById('wcHelpState');if(note)note.textContent='뜻 도움 사용 기록 있음 · 첫 답의 도움 여부를 따로 남겨요.'};
window.harumalWritingSubmit=id=>{const result=E.submit(id);if(result.blocked)return navigate('group',item(id)?.groupId);if(result.empty){const error=document.getElementById('wcInlineError');if(error)error.textContent='답을 먼저 작성하거나 골라 주세요.';return}navigate('feedback',id)};
window.harumalWritingReady=(id,value)=>{E.readiness(id,value);renderPage()};
window.harumalWritingSelfCheck=(id,value)=>{E.selfCheck(id,value);renderPage()};
window.harumalWritingModel=id=>{if(E.revealModel(id))renderPage()};
window.harumalWritingOpenExam=()=>{if(typeof tqSetLevel==='function')tqSetLevel(2);setView('realSetup')};
window.addEventListener?.('popstate',event=>{if(event.state?.harumalWritingRoute){E.route(event.state.harumalWritingRoute);changingHistory=true;baseSetView(VIEW);changingHistory=false}else if(S.view===VIEW||event.state?.harumalReturnView){changingHistory=true;baseSetView(event.state?.harumalReturnView||'learn');changingHistory=false}});
window.HARUMAL_WRITING=Object.freeze({engine:E,data:DATA,render:renderPage,mergeImport:raw=>E.mergeImport(raw)});
if(S.view===VIEW)rememberHistory(state().route,true);
})();
