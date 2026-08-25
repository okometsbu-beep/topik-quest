// MALBIT Travel Mode · data-driven Seoul route runtime
(function(){
  'use strict';

  // Keep the legacy key permanently: existing Story progress becomes Seoul route progress.
  const STORAGE_KEY='malbitStoryV1';
  const DEFAULT_SKIN='traveler-blue';
  const PACKS=Array.isArray(window.MALBIT_TRAVEL_PACKS)?window.MALBIT_TRAVEL_PACKS:[];
  const SELECTED=Object.create(null);
  const TRANSCRIPTS=Object.create(null);

  if(!PACKS.length){console.error('[MALBIT travel] travel pack missing');return}

  const h=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const lang=()=>['ko','ja','en','zh'].includes(S.lang)?S.lang:'ko';
  const l=value=>typeof value==='string'?value:(value?.[lang()]||value?.ko||'');
  const now=()=>new Date().toISOString();
  const packById=id=>PACKS.find(pack=>pack.id===id)||null;
  const sceneById=(pack,id)=>pack?.scenes?.find(scene=>scene.id===id)||null;
  const questionScenes=pack=>pack.scenes.filter(scene=>scene.type==='question');
  const correctCount=state=>Object.values(state?.answers||{}).filter(answer=>answer?.correct).length;
  const answeredCount=state=>Object.keys(state?.answers||{}).length;

  function notify(message){
    if(typeof toast==='function')return toast(message);
    console.info('[MALBIT travel]',message);
  }
  function readStore(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(parsed&&parsed.version===1&&parsed.episodes&&typeof parsed.episodes==='object')return normalizeStore(parsed);
    }catch(error){}
    return normalizeStore({version:1,activePackId:PACKS[0].id,episodes:{}});
  }
  function normalizeStore(store){
    const unlocked=new Set(Array.isArray(store.avatar?.unlocked)?store.avatar.unlocked:[DEFAULT_SKIN]);
    unlocked.add(DEFAULT_SKIN);
    for(const pack of PACKS){
      const state=store.episodes?.[pack.id];
      if(!state?.completed)continue;
      if(pack.rewardSkin)unlocked.add(pack.rewardSkin);
      if(pack.perfectSkin&&Math.max(Number(state.bestScore)||0,correctCount(state))===pack.questionCount)unlocked.add(pack.perfectSkin);
    }
    const equipped=unlocked.has(store.avatar?.equipped)?store.avatar.equipped:DEFAULT_SKIN;
    store.avatar={equipped,unlocked:[...unlocked]};
    return store;
  }
  function writeStore(store){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(normalizeStore(store)));
      window.MALBIT_STORAGE_GUARD?.capture?.('travel');
    }catch(error){}
  }
  function normalizeState(pack,value){
    if(!value||value.packId!==pack.id||!sceneById(pack,value.sceneId))return null;
    value.answers=value.answers&&typeof value.answers==='object'?value.answers:{};
    value.orders=value.orders&&typeof value.orders==='object'?value.orders:{};
    value.evidence=Array.isArray(value.evidence)?value.evidence.filter(id=>sceneById(pack,id)):[];
    value.visited=Array.isArray(value.visited)?value.visited.filter(id=>sceneById(pack,id)):[];
    return value;
  }
  function readState(pack){return normalizeState(pack,readStore().episodes[pack.id])}
  function writeState(state){
    const store=readStore();
    store.activePackId=state.packId;
    store.episodes[state.packId]=state;
    writeStore(store);
  }
  function activePack(){
    const store=readStore();
    return packById(store.activePackId)||PACKS[0];
  }
  function newState(pack,previous){
    return{
      version:1,packId:pack.id,sceneId:pack.scenes[0].id,route:null,
      answers:{},orders:{},evidence:[],visited:[pack.scenes[0].id],
      completed:false,startedAt:now(),updatedAt:now(),completedAt:null,
      bestScore:Math.max(Number(previous?.bestScore)||0,previous?.completed?correctCount(previous):0),
      clears:Number(previous?.clears)||0
    };
  }
  function current(){
    const pack=activePack();
    let state=readState(pack);
    if(!state){state=newState(pack);writeState(state)}
    return{pack,state,scene:sceneById(pack,state.sceneId)};
  }
  function move(state,pack,next){
    if(!sceneById(pack,next))return false;
    state.sceneId=next;
    if(!state.visited.includes(next))state.visited.push(next);
    state.updatedAt=now();
    writeState(state);
    render();
    return true;
  }
  function traveler(pack,state){
    const choice=sceneById(pack,'approach')?.choices?.find(item=>item.id===state.route);
    return choice?l(choice.title):l({ko:'첫 서울 여행자',ja:'はじめてのソウル旅人',en:'First-time Seoul Traveler',zh:'首尔初游者'});
  }
  function questionNumber(pack,scene){return questionScenes(pack).findIndex(item=>item.id===scene.id)+1}
  function cleanScript(value){
    return String(value||'').replace(/(^|\n)[^:\n]{1,45}:\s*/gu,'$1').replace(/\n{3,}/g,'\n\n').trim();
  }
  function mapMarkup(pack,state,compact=false){
    const answered=answeredCount(state),stops=Array.isArray(pack.map?.stops)?pack.map.stops:[];
    const active=Math.max(0,stops.reduce((last,stop,index)=>answered>=Number(stop.unlockAt||0)?index:last,0));
    return `<section class="travelMap ${compact?'compact':''}" aria-label="${h(l({ko:'서울 여행 지도',ja:'ソウル旅行マップ',en:'Seoul travel map',zh:'首尔旅行地图'}))}"><div class="travelMapLine"><i style="width:${stops.length>1?Math.round(active/(stops.length-1)*100):100}%"></i></div>${stops.map((stop,index)=>{const open=answered>=Number(stop.unlockAt||0),done=index<active||state?.completed,current=index===active&&!state?.completed;return `<div class="travelStop ${open?'open':'locked'} ${done?'done':''} ${current?'current':''}"><span>${open?h(stop.icon):'🔒'}</span><b>${h(l(stop.name))}</b><small>${done?'✓':current?h(l({ko:'현재',ja:'いま',en:'NOW',zh:'当前'})):h(l({ko:'잠김',ja:'未開放',en:'LOCKED',zh:'未解锁'}))}</small></div>`}).join('')}</section>`;
  }
  function skinById(pack,id){return pack.skins?.find(skin=>skin.id===id)||pack.skins?.[0]}
  function avatarMarkup(pack,store){
    const equipped=skinById(pack,store.avatar.equipped),unlocked=new Set(store.avatar.unlocked);
    return `<section class="travelAvatar"><div class="travelAvatarHead"><div><small>MY TRAVELER</small><h2>${h(l({ko:'내 여행자',ja:'わたしの旅人',en:'My Traveler',zh:'我的旅行者'}))}</h2></div><span>${unlocked.size}/${pack.skins.length}</span></div><div class="travelAvatarStage" style="--avatar-accent:${h(equipped.accent)}"><i>${h(equipped.icon)}</i><span>🙂</span><b>${h(l(equipped.name))}</b></div><div class="travelSkinGrid">${pack.skins.map(skin=>{const open=unlocked.has(skin.id),on=skin.id===equipped.id;return `<button class="${on?'on':''}" ${open?'':'disabled'} onclick="malbitTravelEquip('${h(skin.id)}')"><i style="--skin:${h(skin.accent)}">${open?h(skin.icon):'🔒'}</i><span>${h(l(skin.name))}</span><small>${open?(on?'✓ '+h(l({ko:'착용 중',ja:'着用中',en:'Equipped',zh:'已装备'})):h(l({ko:'갈아입기',ja:'着替える',en:'Wear',zh:'换装'}))):h(skin.unlock==='perfect'?l({ko:'전부 정답 보상',ja:'全問正解報酬',en:'All-correct reward',zh:'全对奖励'}):l({ko:'코스 완료 보상',ja:'コース完了報酬',en:'Route-clear reward',zh:'路线完成奖励'}))}</small></button>`}).join('')}</div></section>`;
  }
  function ensureQuestion(pack,state,scene){
    const source=window.MALBIT_BANK?.byId(scene.bankId);
    if(!source)return null;
    let order=state.orders[scene.id];
    if(!Array.isArray(order)||order.length!==source.options.length){
      order=window.MALBIT_BANK.freshOrder(source.id);
      state.orders[scene.id]=Array.from(order);
      state.updatedAt=now();
      writeState(state);
    }
    return{source,display:window.MALBIT_BANK.present(source,order)};
  }
  function commonTop(pack,state,scene){
    const total=pack.questionCount,answered=answeredCount(state),score=correctCount(state);
    return`<header class="travelTop"><button class="travelBack" onclick="malbitTravelBack()" aria-label="${h(l({ko:'여행 지도',ja:'旅マップ',en:'Travel map',zh:'旅行地图'}))}">‹</button><div><small>${h(pack.badge)} · TOPIK ${pack.level===1?'I':'II'}</small><b>${h(l(pack.title))}</b></div><button class="travelLang" onclick="event.stopPropagation();flagMenu()" aria-label="Language">${({ko:'🇰🇷',ja:'🇯🇵',en:'🇺🇸',zh:'🇨🇳'})[lang()]}</button></header><div class="travelCaseMeta"><span>${h(traveler(pack,state))}</span><b>${score}/${total} ${h(l({ko:'정답',ja:'正解',en:'correct',zh:'答对'}))}</b></div><div class="travelProgress" aria-label="${answered}/${total}"><i style="width:${Math.min(100,answered/total*100)}%"></i></div>${scene?.location?`<div class="travelLocation">● ${h(l(scene.location))}</div>`:''}`;
  }
  function koreanCopy(scene){
    return`<blockquote class="travelKorean" lang="ko">${h(scene.korean)}</blockquote>${scene.support?`<p class="travelSupport ${lang()==='ko'?'ko':''}">${h(l(scene.support))}</p>`:''}`;
  }
  function clueMarkup(scene,answer){
    if(!scene.clue)return'';
    return`<div class="travelClue ${answer?.correct?'found':'missed'}"><span>${h(scene.clue.icon)}</span><div><small>${answer?.correct?h(l({ko:'스탬프 획득',ja:'スタンプ獲得',en:'Stamp earned',zh:'获得印章'})):h(l({ko:'여행 기록에 저장',ja:'旅の記録に保存',en:'Saved to journey',zh:'已保存到旅行记录'}))}</small><b>${h(l(scene.clue.label))}</b><p>${h(l(scene.clue.detail))}</p></div></div>`;
  }
  function notebook(pack,state){
    const clues=state.evidence.map(id=>sceneById(pack,id)).filter(Boolean);
    if(!clues.length)return'';
    return`<details class="travelNotebook"><summary><span>🗂</span><b>${h(l({ko:'여행 여권',ja:'旅のパスポート',en:'Travel passport',zh:'旅行护照'}))}</b><em>${clues.length}/${pack.questionCount}</em></summary><div>${clues.map(scene=>{const answer=state.answers[scene.id];return`<p class="${answer?.correct?'':'soft'}"><span>${h(scene.clue.icon)}</span><b>${h(l(scene.clue.label))}</b><small>${answer?.correct?'✓':'↺'}</small></p>`}).join('')}</div></details>`;
  }
  function renderHub(sc){
    navActive('home');
    const store=readStore(),focus=PACKS[0],focusState=readState(focus);
    const cards=PACKS.map(pack=>{
      const state=readState(pack),answered=answeredCount(state),score=correctCount(state),complete=!!state?.completed;
      const action=!state?l({ko:'서울 여행 시작',ja:'ソウル旅を始める',en:'Start Seoul journey',zh:'开始首尔旅行'}):complete?l({ko:'완주 기록 보기',ja:'完走記録を見る',en:'View journey record',zh:'查看旅行记录'}):l({ko:'여행 이어가기',ja:'旅を続ける',en:'Continue journey',zh:'继续旅行'});
      return`<article class="travelEpisodeCard" style="--travel-accent:${h(pack.cover.accent)}"><div class="travelEpisodeArt"><span>${h(pack.cover.emoji)}</span><i>${h(pack.badge)}</i></div><div class="travelEpisodeBody"><div class="travelEpisodeFlags"><span>TOPIK ${pack.level===1?'I':'II'}</span><span>${h(l(pack.duration))}</span>${complete?`<span class="clear">ROUTE CLEAR</span>`:''}</div><h2>${h(l(pack.title))}</h2><p>${h(l(pack.description))}</p>${state?`<div class="travelEpisodeStats"><span>${h(l({ko:'미션',ja:'ミッション',en:'Missions',zh:'任务'}))} ${answered}/${pack.questionCount}</span><span>${h(l({ko:'최고',ja:'ベスト',en:'Best',zh:'最佳'}))} ${Math.max(Number(state.bestScore)||0,score)}/${pack.questionCount}</span></div>`:''}<button class="travelPrimary" onclick="malbitTravelStart('${h(pack.id)}',false)">${action} <b>→</b></button>${state?`<button class="travelTextButton" onclick="malbitTravelRestart('${h(pack.id)}')">${h(l({ko:'코스 처음부터',ja:'コースを最初から',en:'Restart route',zh:'重新开始路线'}))}</button>`:''}</div></article>`;
    }).join('');
    sc.innerHTML=`<div class="travelHub"><header class="travelHubHead"><button onclick="setView('home')">‹</button><div><small>LEARN · TRAVEL · COLLECT</small><h1>${h(l({ko:'여행모드',ja:'旅行モード',en:'Travel Mode',zh:'旅行模式'}))}</h1><p>${h(l({ko:'한국어 미션으로 서울의 다음 장소를 여세요.',ja:'韓国語ミッションでソウルの次の場所を開こう。',en:'Use Korean missions to unlock your next Seoul stop.',zh:'通过韩语任务解锁首尔的下一站。'}))}</p></div><button class="travelLang" onclick="event.stopPropagation();flagMenu()">${({ko:'🇰🇷',ja:'🇯🇵',en:'🇺🇸',zh:'🇨🇳'})[lang()]}</button></header><section class="travelHubBanner"><span>🚇</span><div><small>SEOUL ROUTE 001</small><b>${h(l({ko:'서울역에서 광화문까지',ja:'ソウル駅から光化門まで',en:'Seoul Station to Gwanghwamun',zh:'从首尔站到光化门'}))}</b><p>${h(l({ko:'6개 미션 · 스탬프 3개 · 무료 의상 보상',ja:'6ミッション・スタンプ3個・無料衣装報酬',en:'6 missions · 3 stamps · free outfit rewards',zh:'6个任务 · 3枚印章 · 免费服装奖励'}))}</p></div></section>${mapMarkup(focus,focusState)}<div class="travelSectionTitle"><b>${h(l({ko:'첫 번째 여행 코스',ja:'最初の旅行コース',en:'First travel route',zh:'第一条旅行路线'}))}</b><span>${PACKS.length} ROUTE</span></div>${cards}${avatarMarkup(focus,store)}<article class="travelComingSoon"><span>🧭</span><div><b>${h(l({ko:'다음 서울 지역',ja:'次のソウルエリア',en:'Next Seoul area',zh:'下一个首尔区域'}))}</b><p>${h(l({ko:'첫 코스의 재미와 재방문을 확인한 뒤 새로운 장소를 엽니다.',ja:'最初のコースの楽しさと再訪を確認してから、新しい場所を開きます。',en:'New places open after the first route proves fun and worth returning to.',zh:'确认首条路线有趣且值得再访后，再开放新地点。'}))}</p></div><em>LOCKED</em></article></div>`;
  }
  function renderNarrative(sc,pack,state,scene){
    const art=scene.stop==='seoul-station'?'🚉':scene.stop==='city-hall'?'🏛️':'🏯';
    sc.innerHTML=`<div class="travelPlay">${commonTop(pack,state,scene)}<article class="travelSceneCard"><div class="travelChapter">AREA ${scene.chapter}</div><h1>${h(l(scene.title))}</h1>${koreanCopy(scene)}<div class="travelSceneArt"><span>${art}</span><i></i><i></i></div><button class="travelPrimary" onclick="malbitTravelNext()">${h(l({ko:'여행 계속',ja:'旅を続ける',en:'Continue journey',zh:'继续旅行'}))} <b>→</b></button></article>${notebook(pack,state)}</div>`;
  }
  function renderChoice(sc,pack,state,scene){
    sc.innerHTML=`<div class="travelPlay">${commonTop(pack,state,scene)}<article class="travelSceneCard"><div class="travelChapter">TRAVEL STYLE</div><h1>${h(l(scene.title))}</h1>${koreanCopy(scene)}<div class="travelRoutes">${scene.choices.map(choice=>`<button onclick="malbitTravelChoose('${h(choice.id)}')"><span>${h(choice.icon)}</span><div><b>${h(l(choice.label))}</b><small>${h(l(choice.detail))}</small></div><em>›</em></button>`).join('')}</div></article></div>`;
  }
  function renderQuestion(sc,pack,state,scene){
    const payload=ensureQuestion(pack,state,scene);
    if(!payload){sc.innerHTML=`<div class="travelFatal">${h(l({ko:'문항을 불러오지 못했습니다.',ja:'問題を読み込めませんでした。',en:'Could not load this question.',zh:'无法加载题目。'}))}<button onclick="malbitTravelBack()">BACK</button></div>`;return}
    const q=payload.display,answer=state.answers[scene.id],picked=answer?answer.selected:SELECTED[scene.id],listening=q.section==='listening',script=cleanScript(q.script),showTranscript=!!answer||TRANSCRIPTS[scene.id];
    const explanation=answer?(q.explanationI18n?.[lang()]||q.explanationI18n?.ko||''):'';
    const choices=q.choices.map((choice,index)=>{
      const selected=picked===index,correct=!!answer&&index===q.answerIndex,wrong=!!answer&&selected&&!answer.correct;
      return`<button class="travelAnswer ${selected?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}" onclick="malbitTravelSelect(${index})" ${answer?'disabled':''}><span>${index+1}</span><b>${h(String(choice).replace(/^[①②③④]\s*/u,''))}</b></button>`;
    }).join('');
    const material=listening?`<div class="travelListen"><button onclick="malbitTravelSpeak()"><span>▶</span><b>${h(l({ko:'한국어 듣기',ja:'韓国語を聞く',en:'Play Korean audio',zh:'播放韩语'}))}</b></button><button class="transcript" onclick="malbitTravelToggleTranscript()">${showTranscript?h(l({ko:'대본 닫기',ja:'スクリプトを閉じる',en:'Hide transcript',zh:'隐藏文本'})):h(l({ko:'대본 보기',ja:'スクリプトを見る',en:'Show transcript',zh:'查看文本'}))}</button>${showTranscript?`<p lang="ko">${h(script)}</p>`:''}</div>`:`${q.passage?`<div class="travelPassage" lang="ko">${h(q.passage)}</div>`:''}`;
    const feedback=answer?`<div class="travelFeedback ${answer.correct?'good':'bad'}"><strong>${answer.correct?'✓':'!'}</strong><div><b>${h(answer.correct?l({ko:'정답! 여행 스탬프를 얻었습니다.',ja:'正解！旅スタンプを獲得。',en:'Correct! Stamp earned.',zh:'答对了！获得印章。'}):l({ko:'오답도 여행 기록에 남겼습니다.',ja:'不正解でも旅の記録に残しました。',en:'Wrong, but the journey continues.',zh:'答错了，但旅程仍会继续。'}))}</b><p>${h(explanation)}</p></div></div>${clueMarkup(scene,answer)}<button class="travelPrimary" onclick="malbitTravelNext()">${scene.next==='ending'?h(l({ko:'광화문 도착하기',ja:'光化門に到着',en:'Reach Gwanghwamun',zh:'抵达光化门'})):h(l({ko:'다음 미션',ja:'次のミッション',en:'Next mission',zh:'下一个任务'}))} <b>→</b></button>`:`<button class="travelPrimary ${Number.isInteger(picked)?'ready':''}" onclick="malbitTravelSubmit()">${h(l({ko:'답 확인',ja:'答えを確認',en:'Check answer',zh:'确认答案'}))}</button>`;
    sc.innerHTML=`<div class="travelPlay">${commonTop(pack,state,scene)}<article class="travelQuestionCard"><div class="travelQuestionNo"><span>MISSION ${questionNumber(pack,scene)} / ${pack.questionCount}</span><em>${h(q.section==='listening'?l({ko:'듣기',ja:'聴解',en:'Listening',zh:'听力'}):l({ko:'읽기',ja:'読解',en:'Reading',zh:'阅读'}))}</em></div><h1>${h(l(scene.title))}</h1><p class="travelContext">${h(l(scene.context))}</p>${material}<div class="travelPrompt"><small>${h(q.instruction)}</small><b>${h(q.prompt)}</b></div><div class="travelAnswers">${choices}</div>${feedback}</article>${notebook(pack,state)}</div>`;
  }
  function endingType(pack,state){const score=correctCount(state);return score===pack.questionCount?'perfect':score>=Math.ceil(pack.questionCount*.67)?'clear':'close'}
  function renderEnding(sc,pack,state,scene){
    if(!state.completed){
      state.completed=true;state.completedAt=now();state.updatedAt=now();state.clears=(Number(state.clears)||0)+1;state.bestScore=Math.max(Number(state.bestScore)||0,correctCount(state));writeState(state);
    }
    const result=pack.endings[endingType(pack,state)],score=correctCount(state);
    const reward=skinById(pack,score===pack.questionCount?pack.perfectSkin:pack.rewardSkin);
    sc.innerHTML=`<div class="travelPlay travelEnding">${commonTop(pack,state,scene)}<article class="travelEndingCard"><div class="travelEndingGlow"></div><span class="travelEndingIcon">${h(result.icon)}</span><small>ROUTE CLEAR · ${h(pack.badge)}</small><h1>${h(l(result.title))}</h1><p>${h(l(result.detail))}</p><div class="travelScore"><b>${score}</b><span>/ ${pack.questionCount}</span><small>${h(l({ko:'정답 미션',ja:'正解ミッション',en:'correct missions',zh:'答对任务'}))}</small></div><div class="travelReward" style="--reward:${h(reward.accent)}"><span>${h(reward.icon)}</span><div><small>${h(l({ko:'여행 보상 획득',ja:'旅の報酬を獲得',en:'Journey reward earned',zh:'获得旅行奖励'}))}</small><b>${h(l(reward.name))}</b><p>${h(l({ko:'여행 지도에서 바로 갈아입을 수 있어요.',ja:'旅マップですぐに着替えられます。',en:'Equip it from the travel map.',zh:'可在旅行地图中立即换装。'}))}</p></div></div>${koreanCopy(scene)}${notebook(pack,state)}<button class="travelPrimary" onclick="malbitTravelBack()">${h(l({ko:'여행 지도로',ja:'旅マップへ',en:'Back to travel map',zh:'返回旅行地图'}))} <b>→</b></button><button class="travelTextButton" onclick="malbitTravelRestart('${h(pack.id)}')">${h(l({ko:'코스 다시 여행',ja:'コースをもう一度',en:'Travel again',zh:'再次旅行'}))}</button></article></div>`;
  }
  function renderPlay(sc){
    const {pack,state,scene}=current();
    if(!scene)return setView('travel');
    if(scene.type==='narrative')return renderNarrative(sc,pack,state,scene);
    if(scene.type==='choice')return renderChoice(sc,pack,state,scene);
    if(scene.type==='question')return renderQuestion(sc,pack,state,scene);
    return renderEnding(sc,pack,state,scene);
  }

  window.malbitTravelOpen=()=>setView('travel');
  window.malbitTravelStart=(packId,fresh)=>{
    const pack=packById(packId)||PACKS[0],store=readStore(),previous=normalizeState(pack,store.episodes[pack.id]);
    store.activePackId=pack.id;
    if(fresh||!previous)store.episodes[pack.id]=newState(pack,previous);
    writeStore(store);
    setView('travelPlay');
  };
  window.malbitTravelRestart=packId=>{
    const message=l({ko:'이 여행 코스를 처음부터 다시 시작할까요? 최고 기록과 의상은 남습니다.',ja:'この旅行コースを最初からやり直しますか？ベスト記録と衣装は残ります。',en:'Restart this route? Your best score and outfits stay.',zh:'要从头开始这条路线吗？最高纪录和服装会保留。'});
    if(!confirm(message))return;
    window.malbitTravelStart(packId,true);
  };
  window.malbitTravelBack=()=>{try{if(window.MALBIT_TTS)window.MALBIT_TTS.cancel();else speechSynthesis.cancel()}catch(error){};setView('travel')};
  window.malbitTravelEquip=skinId=>{
    const store=readStore(),pack=activePack();
    if(!store.avatar.unlocked.includes(skinId)||!skinById(pack,skinId))return;
    store.avatar.equipped=skinId;writeStore(store);
    notify(l({ko:'여행자 의상을 갈아입었어요.',ja:'旅人の衣装を着替えました。',en:'Traveler outfit changed.',zh:'旅行者服装已更换。'}));
    render();
  };
  window.malbitTravelNext=()=>{
    const {pack,state,scene}=current();
    if(scene.type==='question'&&!state.answers[scene.id])return notify(l({ko:'먼저 문제를 풀어 주세요.',ja:'先に問題を解いてください。',en:'Answer the question first.',zh:'请先答题。'}));
    if(scene.type==='ending')return setView('travel');
    move(state,pack,scene.next);
  };
  window.malbitTravelChoose=choiceId=>{
    const {pack,state,scene}=current(),choice=scene?.choices?.find(item=>item.id===choiceId);
    if(!choice)return;
    state.route=choice.id;
    move(state,pack,scene.next);
  };
  window.malbitTravelSelect=index=>{
    const {state,scene}=current();
    if(scene.type!=='question'||state.answers[scene.id])return;
    SELECTED[scene.id]=Number(index);
    render();
  };
  window.malbitTravelSubmit=()=>{
    const {pack,state,scene}=current();
    if(scene.type!=='question'||state.answers[scene.id])return;
    const selected=SELECTED[scene.id];
    if(!Number.isInteger(selected))return notify(l({ko:'답을 먼저 선택해 주세요.',ja:'先に答えを選んでください。',en:'Select an answer first.',zh:'请先选择答案。'}));
    const payload=ensureQuestion(pack,state,scene);
    if(!payload)return;
    const q=payload.display,correct=selected===q.answerIndex;
    state.answers[scene.id]={selected,correct,bankId:q.bankId,choiceOrder:Array.from(q.choiceOrder),answeredAt:now()};
    if(!state.evidence.includes(scene.id))state.evidence.push(scene.id);
    state.updatedAt=now();
    if(!correct){
      try{window.MALBIT_REVIEW?.record(payload.source.level,q.section==='listening'?'listen':'read',q.bankId,selected,'travel',{choiceOrder:q.choiceOrder})}catch(error){}
    }
    writeState(state);
    render();
  };
  window.malbitTravelToggleTranscript=()=>{const {scene}=current();TRANSCRIPTS[scene.id]=!TRANSCRIPTS[scene.id];render()};
  window.malbitTravelSpeak=()=>{
    const {pack,state,scene}=current(),payload=ensureQuestion(pack,state,scene),script=cleanScript(payload?.display?.script);
    if(!script||(!window.MALBIT_TTS&&(typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined')))return notify(l({ko:'이 기기에서는 음성 재생을 사용할 수 없습니다.',ja:'この端末では音声再生を利用できません。',en:'Audio playback is unavailable on this device.',zh:'此设备无法播放语音。'}));
    try{
      if(window.MALBIT_TTS){window.MALBIT_TTS.play(script);return}
      speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(script);utterance.lang='ko-KR';utterance.rate=.82;speechSynthesis.speak(utterance);
    }catch(error){notify(l({ko:'음성 재생에 실패했습니다.',ja:'音声の再生に失敗しました。',en:'Could not play audio.',zh:'语音播放失败。'}))}
  };

  // A returning tab may still hold the old view name. Migrate it without touching any progress.
  if(S.view==='story'||S.view==='storyPlay'){
    S.view=S.view==='storyPlay'?'travelPlay':'travel';
    try{save()}catch(error){}
  }
  // Compatibility aliases keep already-cached buttons functional during the service-worker swap.
  window.malbitStoryOpen=window.malbitTravelOpen;
  window.malbitStoryStart=window.malbitTravelStart;
  window.malbitStoryRestart=window.malbitTravelRestart;
  window.malbitStoryBack=window.malbitTravelBack;
  window.malbitStoryNext=window.malbitTravelNext;
  window.malbitStoryChoose=window.malbitTravelChoose;
  window.malbitStorySelect=window.malbitTravelSelect;
  window.malbitStorySubmit=window.malbitTravelSubmit;
  window.malbitStoryToggleTranscript=window.malbitTravelToggleTranscript;
  window.malbitStorySpeak=window.malbitTravelSpeak;

  const baseRender=window.render;
  window.render=function(){
    const travelView=S.view==='travel'||S.view==='travelPlay';
    document.body.classList.toggle('travel-active',travelView);
    if(!travelView)return baseRender.apply(this,arguments);
    document.body.classList.remove('tq-home-active','tq-shorts-active','tq-stats-active','tq-game-active');
    document.documentElement.style.colorScheme='dark';
    const theme=document.querySelector('meta[name="theme-color"]');if(theme)theme.content='#0b1020';
    try{hideSelection()}catch(error){}try{renderShell()}catch(error){}
    const sc=document.getElementById('screen');sc.className='screen travelScreen';sc.innerHTML='';
    if(S.view==='travel')return renderHub(sc);
    navActive('home');
    return renderPlay(sc);
  };

  window.MALBIT_TRAVEL=Object.freeze({storageKey:STORAGE_KEY,packs:PACKS,open:window.malbitTravelOpen});
  window.MALBIT_STORY=window.MALBIT_TRAVEL;
})();
