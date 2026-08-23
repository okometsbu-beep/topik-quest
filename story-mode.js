// MALBIT Story Mode · data-driven episode runtime
(function(){
  'use strict';

  const STORAGE_KEY='malbitStoryV1';
  const PACKS=Array.isArray(window.MALBIT_STORY_PACKS)?window.MALBIT_STORY_PACKS:[];
  const SELECTED=Object.create(null);
  const TRANSCRIPTS=Object.create(null);

  if(!PACKS.length){console.error('[MALBIT story] story pack missing');return}

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
    console.info('[MALBIT story]',message);
  }
  function readStore(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(parsed&&parsed.version===1&&parsed.episodes&&typeof parsed.episodes==='object')return parsed;
    }catch(error){}
    return{version:1,activePackId:PACKS[0].id,episodes:{}};
  }
  function writeStore(store){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(store))}catch(error){}
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
  function investigator(pack,state){
    const choice=sceneById(pack,'approach')?.choices?.find(item=>item.id===state.route);
    return choice?l(choice.title):l({ko:'신입 수사관',ja:'新人捜査官',en:'Rookie Investigator',zh:'新手调查员'});
  }
  function questionNumber(pack,scene){return questionScenes(pack).findIndex(item=>item.id===scene.id)+1}
  function cleanScript(value){
    return String(value||'').replace(/(^|\n)[^:\n]{1,45}:\s*/gu,'$1').replace(/\n{3,}/g,'\n\n').trim();
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
    return`<header class="storyTop"><button class="storyBack" onclick="malbitStoryBack()" aria-label="${h(l({ko:'사건 목록',ja:'事件一覧',en:'Case list',zh:'案件列表'}))}">‹</button><div><small>${h(pack.badge)} · TOPIK ${pack.level===1?'I':'II'}</small><b>${h(l(pack.title))}</b></div><button class="storyLang" onclick="event.stopPropagation();flagMenu()" aria-label="Language">${({ko:'🇰🇷',ja:'🇯🇵',en:'🇺🇸',zh:'🇨🇳'})[lang()]}</button></header><div class="storyCaseMeta"><span>${h(investigator(pack,state))}</span><b>${score}/${total} ${h(l({ko:'정답',ja:'正解',en:'correct',zh:'答对'}))}</b></div><div class="storyProgress" aria-label="${answered}/${total}"><i style="width:${Math.min(100,answered/total*100)}%"></i></div>${scene?.location?`<div class="storyLocation">● ${h(l(scene.location))}</div>`:''}`;
  }
  function koreanCopy(scene){
    return`<blockquote class="storyKorean" lang="ko">${h(scene.korean)}</blockquote>${scene.support?`<p class="storySupport ${lang()==='ko'?'ko':''}">${h(l(scene.support))}</p>`:''}`;
  }
  function clueMarkup(scene,answer){
    if(!scene.clue)return'';
    return`<div class="storyClue ${answer?.correct?'found':'missed'}"><span>${h(scene.clue.icon)}</span><div><small>${answer?.correct?h(l({ko:'단서 확보',ja:'手掛かり獲得',en:'Clue secured',zh:'获得线索'})):h(l({ko:'단서 복구',ja:'手掛かり復元',en:'Clue recovered',zh:'恢复线索'}))}</small><b>${h(l(scene.clue.label))}</b><p>${h(l(scene.clue.detail))}</p></div></div>`;
  }
  function notebook(pack,state){
    const clues=state.evidence.map(id=>sceneById(pack,id)).filter(Boolean);
    if(!clues.length)return'';
    return`<details class="storyNotebook"><summary><span>🗂</span><b>${h(l({ko:'수사 노트',ja:'捜査ノート',en:'Case notebook',zh:'调查笔记'}))}</b><em>${clues.length}/${pack.questionCount}</em></summary><div>${clues.map(scene=>{const answer=state.answers[scene.id];return`<p class="${answer?.correct?'':'soft'}"><span>${h(scene.clue.icon)}</span><b>${h(l(scene.clue.label))}</b><small>${answer?.correct?'✓':'↺'}</small></p>`}).join('')}</div></details>`;
  }
  function renderHub(sc){
    navActive('home');
    const cards=PACKS.map(pack=>{
      const state=readState(pack),answered=answeredCount(state),score=correctCount(state),complete=!!state?.completed;
      const action=!state?l({ko:'사건 시작',ja:'事件を開始',en:'Start case',zh:'开始案件'}):complete?l({ko:'결과 보기',ja:'結果を見る',en:'View result',zh:'查看结果'}):l({ko:'이어하기',ja:'続きから',en:'Continue',zh:'继续'});
      return`<article class="storyEpisodeCard" style="--story-accent:${h(pack.cover.accent)}"><div class="storyEpisodeArt"><span>${h(pack.cover.emoji)}</span><i>${h(pack.badge)}</i></div><div class="storyEpisodeBody"><div class="storyEpisodeFlags"><span>TOPIK ${pack.level===1?'I':'II'}</span><span>${h(l(pack.duration))}</span>${complete?`<span class="clear">CLEAR</span>`:''}</div><h2>${h(l(pack.title))}</h2><p>${h(l(pack.description))}</p>${state?`<div class="storyEpisodeStats"><span>${h(l({ko:'진행',ja:'進行',en:'Progress',zh:'进度'}))} ${answered}/${pack.questionCount}</span><span>${h(l({ko:'최고',ja:'ベスト',en:'Best',zh:'最佳'}))} ${Math.max(Number(state.bestScore)||0,score)}/${pack.questionCount}</span></div>`:''}<button class="storyPrimary" onclick="malbitStoryStart('${h(pack.id)}',false)">${action} <b>→</b></button>${state?`<button class="storyTextButton" onclick="malbitStoryRestart('${h(pack.id)}')">${h(l({ko:'처음부터 다시',ja:'最初からやり直す',en:'Restart case',zh:'重新开始'}))}</button>`:''}</div></article>`;
    }).join('');
    sc.innerHTML=`<div class="storyHub"><header class="storyHubHead"><button onclick="setView('home')">‹</button><div><small>MALBIT ORIGINAL</small><h1>${h(l({ko:'스토리 모드',ja:'ストーリーモード',en:'Story Mode',zh:'故事模式'}))}</h1><p>${h(l({ko:'문제를 풀수록 사건이 앞으로 나아갑니다.',ja:'問題を解くたびに物語が進みます。',en:'Every question moves the case forward.',zh:'每答一道题，案件就会向前推进。'}))}</p></div><button class="storyLang" onclick="event.stopPropagation();flagMenu()">${({ko:'🇰🇷',ja:'🇯🇵',en:'🇺🇸',zh:'🇨🇳'})[lang()]}</button></header><section class="storyHubBanner"><span>🔎</span><div><small>READ · LISTEN · SOLVE</small><b>${h(l({ko:'한국어로 사건을 해결하세요',ja:'韓国語で事件を解決しよう',en:'Solve cases in Korean',zh:'用韩语解决案件'}))}</b></div></section><div class="storySectionTitle"><b>${h(l({ko:'플레이 가능한 사건',ja:'プレイできる事件',en:'Playable cases',zh:'可玩案件'}))}</b><span>${PACKS.length} CASE</span></div>${cards}<article class="storyComingSoon"><span>＋</span><div><b>${h(l({ko:'다음 사건 파일',ja:'次の事件ファイル',en:'Next case file',zh:'下一个案件档案'}))}</b><p>${h(l({ko:'새 에피소드는 엔진 수정 없이 사건 데이터만 추가됩니다.',ja:'新エピソードはエンジンを変えず、事件データだけで追加できます。',en:'New episodes can be added as data without changing the engine.',zh:'新剧集只需添加案件数据，无需修改引擎。'}))}</p></div><em>COMING SOON</em></article></div>`;
  }
  function renderNarrative(sc,pack,state,scene){
    sc.innerHTML=`<div class="storyPlay">${commonTop(pack,state,scene)}<article class="storySceneCard"><div class="storyChapter">CHAPTER ${scene.chapter}</div><h1>${h(l(scene.title))}</h1>${koreanCopy(scene)}<div class="storySceneArt"><span>${scene.id==='briefing'?'📨':'🚧'}</span><i></i><i></i></div><button class="storyPrimary" onclick="malbitStoryNext()">${h(l({ko:'다음 장면',ja:'次のシーン',en:'Next scene',zh:'下一场景'}))} <b>→</b></button></article>${notebook(pack,state)}</div>`;
  }
  function renderChoice(sc,pack,state,scene){
    sc.innerHTML=`<div class="storyPlay">${commonTop(pack,state,scene)}<article class="storySceneCard"><div class="storyChapter">CHAPTER ${scene.chapter}</div><h1>${h(l(scene.title))}</h1>${koreanCopy(scene)}<div class="storyRoutes">${scene.choices.map(choice=>`<button onclick="malbitStoryChoose('${h(choice.id)}')"><span>${h(choice.icon)}</span><div><b>${h(l(choice.label))}</b><small>${h(l(choice.detail))}</small></div><em>›</em></button>`).join('')}</div></article></div>`;
  }
  function renderQuestion(sc,pack,state,scene){
    const payload=ensureQuestion(pack,state,scene);
    if(!payload){sc.innerHTML=`<div class="storyFatal">${h(l({ko:'문항을 불러오지 못했습니다.',ja:'問題を読み込めませんでした。',en:'Could not load this question.',zh:'无法加载题目。'}))}<button onclick="malbitStoryBack()">BACK</button></div>`;return}
    const q=payload.display,answer=state.answers[scene.id],picked=answer?answer.selected:SELECTED[scene.id],listening=q.section==='listening',script=cleanScript(q.script),showTranscript=!!answer||TRANSCRIPTS[scene.id];
    const explanation=answer?(q.explanationI18n?.[lang()]||q.explanationI18n?.ko||''):'';
    const choices=q.choices.map((choice,index)=>{
      const selected=picked===index,correct=!!answer&&index===q.answerIndex,wrong=!!answer&&selected&&!answer.correct;
      return`<button class="storyAnswer ${selected?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}" onclick="malbitStorySelect(${index})" ${answer?'disabled':''}><span>${index+1}</span><b>${h(String(choice).replace(/^[①②③④]\s*/u,''))}</b></button>`;
    }).join('');
    const material=listening?`<div class="storyListen"><button onclick="malbitStorySpeak()"><span>▶</span><b>${h(l({ko:'한국어 듣기',ja:'韓国語を聞く',en:'Play Korean audio',zh:'播放韩语'}))}</b></button><button class="transcript" onclick="malbitStoryToggleTranscript()">${showTranscript?h(l({ko:'대본 닫기',ja:'スクリプトを閉じる',en:'Hide transcript',zh:'隐藏文本'})):h(l({ko:'대본 보기',ja:'スクリプトを見る',en:'Show transcript',zh:'查看文本'}))}</button>${showTranscript?`<p lang="ko">${h(script)}</p>`:''}</div>`:`${q.passage?`<div class="storyPassage" lang="ko">${h(q.passage)}</div>`:''}`;
    const feedback=answer?`<div class="storyFeedback ${answer.correct?'good':'bad'}"><strong>${answer.correct?'✓':'!'}</strong><div><b>${h(answer.correct?l({ko:'정답! 단서를 확보했습니다.',ja:'正解！手掛かりを獲得。',en:'Correct! Clue secured.',zh:'答对了！获得线索。'}):l({ko:'오답이지만 단서는 복구했습니다.',ja:'不正解。でも手掛かりは復元。',en:'Wrong, but the clue was recovered.',zh:'答错了，但线索已恢复。'}))}</b><p>${h(explanation)}</p></div></div>${clueMarkup(scene,answer)}<button class="storyPrimary" onclick="malbitStoryNext()">${scene.next==='ending'?h(l({ko:'사건 결말 보기',ja:'事件の結末を見る',en:'See the ending',zh:'查看案件结局'})):h(l({ko:'다음 단서',ja:'次の手掛かり',en:'Next clue',zh:'下一条线索'}))} <b>→</b></button>`:`<button class="storyPrimary ${Number.isInteger(picked)?'ready':''}" onclick="malbitStorySubmit()">${h(l({ko:'답 확인',ja:'答えを確認',en:'Check answer',zh:'确认答案'}))}</button>`;
    sc.innerHTML=`<div class="storyPlay">${commonTop(pack,state,scene)}<article class="storyQuestionCard"><div class="storyQuestionNo"><span>CLUE ${questionNumber(pack,scene)} / ${pack.questionCount}</span><em>${h(q.section==='listening'?l({ko:'듣기',ja:'聴解',en:'Listening',zh:'听力'}):l({ko:'읽기',ja:'読解',en:'Reading',zh:'阅读'}))}</em></div><h1>${h(l(scene.title))}</h1><p class="storyContext">${h(l(scene.context))}</p>${material}<div class="storyPrompt"><small>${h(q.instruction)}</small><b>${h(q.prompt)}</b></div><div class="storyAnswers">${choices}</div>${feedback}</article>${notebook(pack,state)}</div>`;
  }
  function endingType(pack,state){const score=correctCount(state);return score===pack.questionCount?'perfect':score>=Math.ceil(pack.questionCount*.67)?'clear':'close'}
  function renderEnding(sc,pack,state,scene){
    if(!state.completed){
      state.completed=true;state.completedAt=now();state.updatedAt=now();state.clears=(Number(state.clears)||0)+1;state.bestScore=Math.max(Number(state.bestScore)||0,correctCount(state));writeState(state);
    }
    const result=pack.endings[endingType(pack,state)],score=correctCount(state);
    sc.innerHTML=`<div class="storyPlay storyEnding">${commonTop(pack,state,scene)}<article class="storyEndingCard"><div class="storyEndingGlow"></div><span class="storyEndingIcon">${h(result.icon)}</span><small>CASE CLOSED · ${h(pack.badge)}</small><h1>${h(l(result.title))}</h1><p>${h(l(result.detail))}</p><div class="storyScore"><b>${score}</b><span>/ ${pack.questionCount}</span><small>${h(l({ko:'정답 단서',ja:'正解した手掛かり',en:'correct clues',zh:'答对线索'}))}</small></div>${koreanCopy(scene)}${clueMarkup({clue:{icon:'🎫',label:scene.title,detail:scene.support}},{correct:true})}${notebook(pack,state)}<button class="storyPrimary" onclick="malbitStoryBack()">${h(l({ko:'사건 목록으로',ja:'事件一覧へ',en:'Back to cases',zh:'返回案件列表'}))} <b>→</b></button><button class="storyTextButton" onclick="malbitStoryRestart('${h(pack.id)}')">${h(l({ko:'다시 플레이',ja:'もう一度プレイ',en:'Play again',zh:'再次游玩'}))}</button></article></div>`;
  }
  function renderPlay(sc){
    const {pack,state,scene}=current();
    if(!scene)return setView('story');
    if(scene.type==='narrative')return renderNarrative(sc,pack,state,scene);
    if(scene.type==='choice')return renderChoice(sc,pack,state,scene);
    if(scene.type==='question')return renderQuestion(sc,pack,state,scene);
    return renderEnding(sc,pack,state,scene);
  }

  window.malbitStoryOpen=()=>setView('story');
  window.malbitStoryStart=(packId,fresh)=>{
    const pack=packById(packId)||PACKS[0],store=readStore(),previous=normalizeState(pack,store.episodes[pack.id]);
    store.activePackId=pack.id;
    if(fresh||!previous)store.episodes[pack.id]=newState(pack,previous);
    writeStore(store);
    setView('storyPlay');
  };
  window.malbitStoryRestart=packId=>{
    const message=l({ko:'이 사건을 처음부터 다시 시작할까요? 최고 기록은 남습니다.',ja:'この事件を最初からやり直しますか？ベスト記録は残ります。',en:'Restart this case? Your best score will be kept.',zh:'要从头开始本案件吗？最高纪录会保留。'});
    if(!confirm(message))return;
    window.malbitStoryStart(packId,true);
  };
  window.malbitStoryBack=()=>{try{speechSynthesis.cancel()}catch(error){};setView('story')};
  window.malbitStoryNext=()=>{
    const {pack,state,scene}=current();
    if(scene.type==='question'&&!state.answers[scene.id])return notify(l({ko:'먼저 문제를 풀어 주세요.',ja:'先に問題を解いてください。',en:'Answer the question first.',zh:'请先答题。'}));
    if(scene.type==='ending')return setView('story');
    move(state,pack,scene.next);
  };
  window.malbitStoryChoose=choiceId=>{
    const {pack,state,scene}=current(),choice=scene?.choices?.find(item=>item.id===choiceId);
    if(!choice)return;
    state.route=choice.id;
    move(state,pack,scene.next);
  };
  window.malbitStorySelect=index=>{
    const {state,scene}=current();
    if(scene.type!=='question'||state.answers[scene.id])return;
    SELECTED[scene.id]=Number(index);
    render();
  };
  window.malbitStorySubmit=()=>{
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
      try{window.MALBIT_REVIEW?.record(payload.source.level,q.section==='listening'?'listen':'read',q.bankId,selected,'story',{choiceOrder:q.choiceOrder})}catch(error){}
    }
    writeState(state);
    render();
  };
  window.malbitStoryToggleTranscript=()=>{const {scene}=current();TRANSCRIPTS[scene.id]=!TRANSCRIPTS[scene.id];render()};
  window.malbitStorySpeak=()=>{
    const {pack,state,scene}=current(),payload=ensureQuestion(pack,state,scene),script=cleanScript(payload?.display?.script);
    if(!script||typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined')return notify(l({ko:'이 기기에서는 음성 재생을 사용할 수 없습니다.',ja:'この端末では音声再生を利用できません。',en:'Audio playback is unavailable on this device.',zh:'此设备无法播放语音。'}));
    try{
      speechSynthesis.cancel();
      const utterance=window.MALBIT_TTS?window.MALBIT_TTS.utterance(script):new SpeechSynthesisUtterance(script);if(!window.MALBIT_TTS){utterance.lang='ko-KR';utterance.rate=.82}
      speechSynthesis.speak(utterance);
    }catch(error){notify(l({ko:'음성 재생에 실패했습니다.',ja:'音声の再生に失敗しました。',en:'Could not play audio.',zh:'语音播放失败。'}))}
  };

  const baseRender=window.render;
  window.render=function(){
    const storyView=S.view==='story'||S.view==='storyPlay';
    document.body.classList.toggle('story-active',storyView);
    if(!storyView)return baseRender.apply(this,arguments);
    document.body.classList.remove('tq-home-active','tq-shorts-active','tq-stats-active','tq-game-active');
    document.documentElement.style.colorScheme='dark';
    const theme=document.querySelector('meta[name="theme-color"]');if(theme)theme.content='#0b1020';
    try{hideSelection()}catch(error){}try{renderShell()}catch(error){}
    const sc=document.getElementById('screen');sc.className='screen storyScreen';sc.innerHTML='';
    if(S.view==='story')return renderHub(sc);
    navActive('home');
    return renderPlay(sc);
  };

  window.MALBIT_STORY=Object.freeze({storageKey:STORAGE_KEY,packs:PACKS,open:window.malbitStoryOpen});
})();
