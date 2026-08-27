// MALBIT Travel Mode · data-driven Seoul route runtime
(function(){
  'use strict';

  // Keep the legacy key permanently: existing Story progress becomes Seoul route progress.
  const STORAGE_KEY='malbitStoryV1';
  const DEFAULT_SKIN='traveler-blue';
  const PACKS=Array.isArray(window.MALBIT_TRAVEL_PACKS)?window.MALBIT_TRAVEL_PACKS:[];
  const HUBS=Array.isArray(window.MALBIT_TRAVEL_HUBS)?window.MALBIT_TRAVEL_HUBS:[];
  const SELECTED=Object.create(null);
  const TRANSCRIPTS=Object.create(null);
  const HUB_ORDER=Object.create(null);
  const HUB_BUDGET=Object.create(null);
  const HUB_DIALOGUE_STEP=Object.create(null);
  const HUB_COMPOSE_RESULT=Object.create(null);
  const METRIC_KEYS=Object.freeze({
    routeStarted:'routeStarts',
    routeCompleted:'routeCompletions',
    myeongdongEntered:'myeongdongEntries',
    exchangeSession:'exchangeSessions',
    priceQuestStarted:'priceQuestStarts',
    priceQuestCompleted:'priceQuestCompletions'
  });

  if(!PACKS.length){console.error('[MALBIT travel] travel pack missing');return}

  const h=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const lang=()=>['ko','ja','en','zh'].includes(S.lang)?S.lang:'ko';
  const l=value=>typeof value==='string'?value:(value?.[lang()]||value?.ko||'');
  const flag=()=>window.LANGS?.[lang()]?.flag||({ko:'🇰🇷',ja:'🇯🇵',en:'🇺🇸',zh:'🇨🇳'})[lang()]||'🌐';
  const now=()=>new Date().toISOString();
  const packById=id=>PACKS.find(pack=>pack.id===id)||null;
  const hubByRoute=id=>HUBS.find(hub=>hub.routeId===id)||null;
  const sceneById=(pack,id)=>pack?.scenes?.find(scene=>scene.id===id)||null;
  const routeScene=(scene,state)=>{
    const variant=scene?.routeVariants?.[state?.route];
    return variant?{...scene,...variant}:scene;
  };
  const questionScenes=pack=>pack.scenes.filter(scene=>scene.type==='question');
  const correctCount=state=>Object.values(state?.answers||{}).filter(answer=>answer?.correct).length;
  const answeredCount=state=>Object.keys(state?.answers||{}).length;
  const won=value=>{
    const amount=Math.max(0,Number(value)||0).toLocaleString('ko-KR');
    return lang()==='ja'?`${amount}旅ウォン`:lang()==='en'?`${amount} travel won`:lang()==='zh'?`${amount}旅行韩元`:`${amount}원`;
  };
  const clock=value=>{const minutes=((Number(value)||0)%1440+1440)%1440;return`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`};

  function notify(message){
    if(typeof toast==='function')return toast(message);
    console.info('[MALBIT travel]',message);
  }
  function cancelAudio(){
    try{if(window.MALBIT_TTS)window.MALBIT_TTS.cancel();else speechSynthesis.cancel()}catch(error){}
  }
  function resetViewport(){
    const reset=()=>{try{window.scrollTo?.({top:0,left:0,behavior:'auto'})}catch(error){try{window.scrollTo?.(0,0)}catch(innerError){}}};
    try{requestAnimationFrame(reset)}catch(error){reset()}
  }
  function revealFeedback(){
    const reveal=()=>{try{document.querySelector('.travelFeedback')?.scrollIntoView({block:'nearest',behavior:'auto'})}catch(error){}};
    try{requestAnimationFrame(reveal)}catch(error){reveal()}
  }
  function resetTransient(pack){
    for(const scene of pack.scenes){delete SELECTED[scene.id];delete TRANSCRIPTS[scene.id]}
  }
  function normalizeMetrics(value){
    const raw=value&&typeof value==='object'?value:{};
    return{
      version:2,
      routeStarts:Math.max(0,Number(raw.routeStarts)||0),
      routeCompletions:Math.max(0,Number(raw.routeCompletions)||0),
      myeongdongEntries:Math.max(0,Number(raw.myeongdongEntries)||0),
      exchangeSessions:Math.max(0,Number(raw.exchangeSessions)||0),
      priceQuestStarts:Math.max(0,Number(raw.priceQuestStarts)||0),
      priceQuestCompletions:Math.max(0,Number(raw.priceQuestCompletions)||0),
      priceQuestWrongSubmissions:Math.max(0,Number(raw.priceQuestWrongSubmissions)||0),
      priceQuestWalletTotal:Math.max(0,Number(raw.priceQuestWalletTotal)||0)
    };
  }
  function normalizeMeasurement(value){
    const raw=value&&typeof value==='object'?value:{};
    return{
      routeStarted:!!raw.routeStarted,
      routeCompleted:!!raw.routeCompleted,
      myeongdongEntered:!!raw.myeongdongEntered,
      exchangeSession:!!raw.exchangeSession,
      priceQuestStarted:!!raw.priceQuestStarted,
      priceQuestCompleted:!!raw.priceQuestCompleted
    };
  }
  function recordMilestones(store,state,names){
    store.metrics=normalizeMetrics(store.metrics);
    state.measurement=normalizeMeasurement(state.measurement);
    for(const name of names){
      const key=METRIC_KEYS[name];
      if(!key||state.measurement[name])continue;
      state.measurement[name]=true;
      store.metrics[key]+=1;
    }
  }
  function recordMetricAggregates(store,aggregates){
    store.metrics=normalizeMetrics(store.metrics);
    const wrong=Math.max(0,Number(aggregates?.priceQuestWrongSubmissions)||0);
    store.metrics.priceQuestWrongSubmissions+=wrong;
    if(Number.isFinite(Number(aggregates?.priceQuestWalletAfterCompletion))){
      store.metrics.priceQuestWalletTotal+=Math.max(0,Number(aggregates.priceQuestWalletAfterCompletion));
    }
  }
  const metricRate=(part,total)=>total?Math.round(part/total*100):null;
  function metricsSnapshot(store=readStore()){
    const metrics=normalizeMetrics(store.metrics);
    return Object.freeze({
      ...metrics,
      completionRate:metricRate(metrics.routeCompletions,metrics.routeStarts),
      myeongdongEntryRate:metricRate(metrics.myeongdongEntries,metrics.routeCompletions),
      collectibleExchangeRate:metricRate(metrics.exchangeSessions,metrics.myeongdongEntries),
      priceQuestCompletionRate:metricRate(metrics.priceQuestCompletions,metrics.priceQuestStarts),
      priceQuestAverageWallet:metrics.priceQuestCompletions?Math.round(metrics.priceQuestWalletTotal/metrics.priceQuestCompletions):null,
      localOnly:true
    });
  }
  const metricPercent=value=>value===null?'—':`${value}%`;
  function priceQuestFeedback(metrics){
    const rate=metricPercent(metrics.priceQuestCompletionRate);
    const wrong=metrics.priceQuestWrongSubmissions;
    const wallet=metrics.priceQuestAverageWallet===null?'—':won(metrics.priceQuestAverageWallet);
    if(!metrics.priceQuestStarts)return{
      title:l({ko:'기록이 쌓이면 여기서 연습 요령을 알려드려요',ja:'記録がたまると、ここに練習のコツが出ます',en:'Practice guidance will appear after your first try',zh:'完成首次尝试后，这里会显示练习建议'}),
      body:l({ko:'가격표를 읽고 가격 × 개수 → 예산 − 합계 순서로 계산해 보세요.',ja:'値札を読み、「値段×個数 → 予算−合計」の順で計算してみよう。',en:'Read the price board, then calculate price × quantity → budget − total.',zh:'读取价目表后，按价格×数量→预算−合计的顺序计算。'})
    };
    if(!metrics.priceQuestCompletions)return{
      title:l({ko:'아직 진행 중이에요. 합계를 먼저 만드세요',ja:'まだ途中です。まず合計を作ろう',en:'Still in progress: find the total first',zh:'仍在进行中：先算出合计'}),
      body:l({ko:`완료율 ${rate} · 완료 전 오답 ${wrong}회. 가격 × 개수를 구한 뒤 예산에서 빼세요.`,ja:`完了率${rate}・完了前の誤答${wrong}回。値段×個数を出してから、予算から引こう。`,en:`Completion ${rate} · ${wrong} wrong tries before clear. Multiply price by quantity, then subtract from the budget.`,zh:`完成率${rate} · 完成前错答${wrong}次。先计算价格×数量，再从预算中减去。`})
    };
    if(wrong>0)return{
      title:l({ko:'계산을 두 단계로 나누면 실수를 줄일 수 있어요',ja:'計算を2段階に分けると、ミスを減らせます',en:'Split the calculation into two steps',zh:'把计算分成两步可减少失误'}),
      body:l({ko:`완료율 ${rate} · 오답 ${wrong}회 · 완료 후 평균 ${wallet}. 가격 × 개수, 그다음 예산 − 합계 순서로 확인하세요.`,ja:`完了率${rate}・誤答${wrong}回・完了後の平均${wallet}。値段×個数、そのあと予算−合計の順で確認しよう。`,en:`Completion ${rate} · ${wrong} wrong tries · average after clear ${wallet}. Check price × quantity, then budget − total.`,zh:`完成率${rate} · 错答${wrong}次 · 完成后平均${wallet}。先检查价格×数量，再检查预算−合计。`})
    };
    if(metrics.priceQuestCompletionRate===100)return{
      title:l({ko:'계산 순서를 안정적으로 지켰어요',ja:'計算の順番を安定して守れています',en:'Your calculation order is consistent',zh:'计算顺序保持得很稳定'}),
      body:l({ko:`완료율 ${rate} · 오답 0회 · 완료 후 평균 ${wallet}. 다음에는 먼저 남길 여행 원을 정해 보세요.`,ja:`完了率${rate}・誤答0回・完了後の平均${wallet}。次は、残したい旅ウォンを先に決めてみよう。`,en:`Completion ${rate} · 0 wrong tries · average after clear ${wallet}. Next, decide how much travel won to keep first.`,zh:`完成率${rate} · 错答0次 · 完成后平均${wallet}。下次先决定要保留多少旅行韩元。`})
    };
    return{
      title:l({ko:'시작한 문제를 끝까지 마무리해 보세요',ja:'始めた問題を最後まで仕上げよう',en:'Finish each attempt you start',zh:'把已开始的题目完成到底'}),
      body:l({ko:`완료율 ${rate} · 오답 0회 · 완료 후 평균 ${wallet}. 개수를 정한 뒤 합계와 잔액을 차례로 확인하세요.`,ja:`完了率${rate}・誤答0回・完了後の平均${wallet}。個数を決めたら、合計と残高を順に確認しよう。`,en:`Completion ${rate} · 0 wrong tries · average after clear ${wallet}. After choosing a quantity, check the total and balance in order.`,zh:`完成率${rate} · 错答0次 · 完成后平均${wallet}。决定数量后，依次检查合计和余额。`})
    };
  }
  function metricsMarkup(store){
    const metrics=metricsSnapshot(store);
    const routeLabels=[
      [l({ko:'코스 시작',ja:'コース開始',en:'Route starts',zh:'路线开始'}),String(metrics.routeStarts)],
      [l({ko:'완주율',ja:'完走率',en:'Completion',zh:'完成率'}),metricPercent(metrics.completionRate)],
      [l({ko:'명동 진입률',ja:'明洞到達率',en:'Myeongdong entry',zh:'明洞进入率'}),metricPercent(metrics.myeongdongEntryRate)],
      [l({ko:'교환 경험률',ja:'交換体験率',en:'Exchange use',zh:'兑换体验率'}),metricPercent(metrics.collectibleExchangeRate)]
    ];
    const priceLabels=[
      [l({ko:'가격 퀘스트 완료율',ja:'値段クエスト完了率',en:'Price quest completion',zh:'价格任务完成率'}),metricPercent(metrics.priceQuestCompletionRate)],
      [l({ko:'완료 전 오답 제출',ja:'完了前の誤答',en:'Wrong tries before clear',zh:'完成前错答'}),String(metrics.priceQuestWrongSubmissions)],
      [l({ko:'완료 후 평균 잔액',ja:'完了後の平均残高',en:'Average wallet after clear',zh:'完成后平均余额'}),metrics.priceQuestAverageWallet===null?'—':won(metrics.priceQuestAverageWallet)]
    ];
    const feedback=priceQuestFeedback(metrics);
    const grid=(labels,kind='')=>`<div class="travelMetricsGrid ${kind}"${kind?' aria-label="'+h(l({ko:'명동 가격 퀘스트 기록',ja:'明洞の値段クエスト記録',en:'Myeongdong price quest record',zh:'明洞价格任务记录'}))+'"':''}>${labels.map(([label,value])=>`<div class="travelMetric"><b>${h(value)}</b><small>${h(label)}</small></div>`).join('')}</div>`;
    return`<section class="travelMetrics" aria-labelledby="travel-metrics-title"><div class="travelMetricsHead"><div><small>LOCAL LEARNING SIGNALS</small><h2 id="travel-metrics-title">${h(l({ko:'이 기기의 여행 기록',ja:'この端末の旅記録',en:'Travel record on this device',zh:'此设备的旅行记录'}))}</h2></div><span>LOCAL</span></div>${grid(routeLabels)}<div class="travelMetricsSubhead">${h(l({ko:'명동 가격 퀘스트',ja:'明洞の値段クエスト',en:'Myeongdong price quest',zh:'明洞价格任务'}))}</div>${grid(priceLabels,'price')}<div class="travelMetricFeedback" role="note"><small>${h(l({ko:'이 기록으로 보는 학습 한마디',ja:'この記録からの学習ヒント',en:'Learning tip from this record',zh:'根据此记录的学习提示'}))}</small><b>${h(feedback.title)}</b><p>${h(feedback.body)}</p></div><p>${h(l({ko:'이 기기에만 숫자로 저장하며 외부로 전송하지 않습니다.',ja:'この端末内に数値だけを保存し、外部へ送信しません。',en:'Only numeric totals are stored on this device and never sent outside.',zh:'仅以数字保存在本设备，不会发送到外部。'}))}</p></section>`;
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
    store.metrics=normalizeMetrics(store.metrics);
    return store;
  }
  function writeStore(store){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(normalizeStore(store)));
      window.MALBIT_STORAGE_GUARD?.capture?.('travel');
    }catch(error){}
  }
  function normalizeHubState(value){
    const raw=value&&typeof value==='object'?value:{};
    const quests=raw.quests&&typeof raw.quests==='object'?raw.quests:{};
    return{
      screen:['hub','dialogue','order','result'].includes(raw.screen)?raw.screen:'ending',
      activeEvent:typeof raw.activeEvent==='string'?raw.activeEvent:null,
      quests,
      attempts:Math.max(0,Number(raw.attempts)||0),
      lastAttemptCorrect:raw.lastAttemptCorrect===false?false:null,
      lastPurchase:typeof raw.lastPurchase==='string'?raw.lastPurchase:null
    };
  }
  function normalizeState(pack,value){
    if(!value||value.packId!==pack.id||!sceneById(pack,value.sceneId))return null;
    value.answers=value.answers&&typeof value.answers==='object'?value.answers:{};
    value.orders=value.orders&&typeof value.orders==='object'?value.orders:{};
    value.evidence=Array.isArray(value.evidence)?value.evidence.filter(id=>sceneById(pack,id)||String(id).startsWith('hub:')):[];
    value.visited=Array.isArray(value.visited)?value.visited.filter(id=>sceneById(pack,id)):[];
    value.wallet=Math.max(0,Number(value.wallet??pack.startWallet)||0);
    value.clockMinutes=Number.isFinite(Number(value.clockMinutes))?Number(value.clockMinutes):new Date().getHours()*60+new Date().getMinutes();
    value.inventory=Array.isArray(value.inventory)?value.inventory:[];
    value.myeongdong=normalizeHubState(value.myeongdong);
    value.measurement=normalizeMeasurement(value.measurement);
    return value;
  }
  function readState(pack){return normalizeState(pack,readStore().episodes[pack.id])}
  function writeState(state,milestones=[],aggregates=null){
    const store=readStore();
    recordMilestones(store,state,milestones);
    recordMetricAggregates(store,aggregates);
    store.activePackId=state.packId;
    store.episodes[state.packId]=state;
    writeStore(store);
  }
  function activePack(){
    const store=readStore();
    return packById(store.activePackId)||PACKS[0];
  }
  function newState(pack,previous){
    const state={
      version:1,packId:pack.id,sceneId:pack.scenes[0].id,route:null,
      answers:{},orders:{},evidence:[],visited:[pack.scenes[0].id],
      wallet:Number(pack.startWallet)||0,clockMinutes:new Date().getHours()*60+new Date().getMinutes(),inventory:Array.from(new Set(Array.isArray(previous?.inventory)?previous.inventory:[])),spent:[],
      completed:false,startedAt:now(),updatedAt:now(),completedAt:null,
      bestScore:Math.max(Number(previous?.bestScore)||0,previous?.completed?correctCount(previous):0),
      clears:Number(previous?.clears)||0,perfectBonusClaimed:!!previous?.perfectBonusClaimed,
      measurement:normalizeMeasurement(null)
    };
    state.myeongdong=normalizeHubState(previous?.myeongdong);
    state.myeongdong.screen='ending';
    return state;
  }
  function current(){
    const pack=activePack();
    let state=readState(pack);
    if(!state){state=newState(pack);writeState(state)}
    return{pack,state,scene:routeScene(sceneById(pack,state.sceneId),state)};
  }
  function move(state,pack,next){
    if(!sceneById(pack,next))return false;
    state.sceneId=next;
    if(!state.visited.includes(next))state.visited.push(next);
    state.updatedAt=now();
    writeState(state);
    cancelAudio();
    render();
    resetViewport();
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
  const ATTACHED_TOKENS=new Set(['은','는','이','가','을','를','에','에서','도','와','과','으로','로','부터','까지',',','.','?','!']);
  function composedSentence(tokens){
    let sentence='';
    for(const raw of tokens){
      const token=String(raw||'').trim();if(!token)continue;
      if(sentence&&(ATTACHED_TOKENS.has(token)||/^[,.?!]/u.test(token)))sentence+=token;
      else sentence+=`${sentence?' ':''}${token}`;
    }
    return sentence.replace(/\s+([,.?!])/gu,'$1').replace(/\s+/g,' ').trim();
  }
  function compactSentence(value){return String(value||'').replace(/[\s“”"']/gu,'').trim()}
  function compositionResult(event,tokens){
    const phrase=composedSentence(tokens),canonical=composedSentence(event.answer||[]);
    if(compactSentence(phrase)===compactSentence(canonical))return{grade:'full',phrase,response:event.success};
    for(const accepted of event.accepted||[]){
      try{if(new RegExp(accepted.pattern,'u').test(phrase))return{grade:'partial',phrase,response:accepted.response}}catch(error){}
    }
    return{grade:'invalid',phrase,response:event.explanation};
  }
  function tokenKind(token){
    if(ATTACHED_TOKENS.has(token))return'particle';
    if(/(?:요[?.!]?|니다[?.!]?|세요[?.!]?|싶어요[?.!]?|왔어요[?.!]?|감사합니다[.!]?|안녕하세요[!]?)$/u.test(token))return'ending';
    return'word';
  }
  function travelSolveTip(scene,q){
    const interaction=scene.interaction||'quiz';
    if(interaction==='dialogue')return l({ko:'대화 문제는 마지막 말이 인사·질문·요청 중 무엇인지 먼저 판별하고, 그 기능에 직접 답하는 표현만 남기세요.',ja:'会話問題は、最後の発話が「あいさつ・質問・依頼」のどれかを先に判断し、その働きに直接答える表現だけを残します。',en:'First identify whether the last line is a greeting, question, or request, then keep only the response that directly serves that function.',zh:'先判断最后一句属于问候、提问还是请求，再保留能直接回应其功能的表达。'});
    if(interaction==='hotspot')return l({ko:'문장 전체를 번역하지 말고 ‘지하철역’처럼 장소를 결정하는 핵심 명사를 그림·표지와 연결하세요.',ja:'文全体を訳す前に、「지하철역」のように場所を決める核心語を絵や標識と結び付けます。',en:'Before translating everything, connect the location keyword, such as 지하철역, to the matching sign or picture.',zh:'不要先翻译整句，先把“지하철역”等决定地点的关键词与图标或标牌对应。'});
    if(interaction==='machine')return l({ko:'기계 화면에서는 행동 동사와 목표 명사를 먼저 찾으세요. 이번에는 ‘찍다/선택하다’와 ‘교통카드/명동’이 단서입니다.',ja:'機械画面では、動作を表す語と目的の名詞を先に探します。今回は「찍다／선택하다」と「교통카드／명동」が手掛かりです。',en:'On a machine screen, find the action verb and target noun first; here 찍다/선택하다 and 교통카드/명동 are the clues.',zh:'在机器界面先找动作动词和目标名词；本题线索是“찍다/선택하다”和“교통카드/명동”。'});
    return l({ko:'질문이 요구하는 행동·장소·대상을 하나씩 표시한 뒤, 모두 만족하는 보기만 남기세요.',ja:'設問が求める行動・場所・対象を一つずつ確認し、すべて満たす選択肢だけを残します。',en:'Mark the required action, place, and target, then keep only the option satisfying all three.',zh:'逐一确认题目要求的动作、地点和对象，只保留全部符合的选项。'});
  }
  function travelCoachMarkup(scene,q,answer,explanation){
    const correct=String(q.choices?.[q.answerIndex]?.ko||l(q.choices?.[q.answerIndex])||'').replace(/^[①②③④]\s*/u,''),selected=String(q.choices?.[answer.selected]?.ko||l(q.choices?.[answer.selected])||'').replace(/^[①②③④]\s*/u,'');
    const contrast=answer.correct?l({ko:`‘${correct}’이 상황의 질문이나 행동에 바로 이어지는지 확인하면 됩니다.`,ja:`「${correct}」が場面の質問や行動にそのまま続くかを確認します。`,en:`Check that “${correct}” directly continues the situation’s question or action.`,zh:`确认“${correct}”能否直接承接情境中的提问或动作。`}):l({ko:`고른 ‘${selected}’은(는) 이 상황의 요구와 다릅니다. 정답 ‘${correct}’이(가) 질문의 핵심 행동에 직접 대응합니다.`,ja:`選んだ「${selected}」はこの場面の要求とずれます。正解の「${correct}」が質問の核心となる行動に直接対応します。`,en:`“${selected}” does not fit this situation. “${correct}” directly answers the key action in the prompt.`,zh:`所选“${selected}”不符合情境要求；正确答案“${correct}”直接回应了题目的核心动作。`});
    return`<section class="travelTutor"><div><small>${h(l({ko:'① 정답 근거',ja:'① 正解の根拠',en:'① WHY IT WORKS',zh:'① 正确依据'}))}</small><p>${h(explanation)}</p></div><div><small>${h(l({ko:'② 함정 구별',ja:'② ひっかけの見分け方',en:'② DISTRACTOR CHECK',zh:'② 干扰项辨析'}))}</small><p>${h(contrast)}</p></div><div><small>${h(l({ko:'③ 쪽집게 풀이 요령',ja:'③ 解き方のコツ',en:'③ SOLVING TIP',zh:'③ 解题技巧'}))}</small><p>${h(travelSolveTip(scene,q))}</p></div></section>`;
  }
  function assetPath(pack,group,key){
    if(!key)return'';
    return pack.assets?.[group]?.[key]||hubByRoute(pack.id)?.assets?.[group]?.[key]||'';
  }
  function propImage(pack,key,className=''){
    const src=assetPath(pack,'props',key);
    return src?`<img class="${h(className)}" src="${h(src)}" alt="" loading="eager">`:'';
  }
  function mapMarkup(pack,state,compact=false){
    const allStops=Array.isArray(pack.map?.stops)?pack.map.stops:[];
    const stops=state?.route==='taxi'?allStops.filter(stop=>stop.id!=='seoul-station'):allStops;
    const activeScene=state?routeScene(sceneById(pack,state.sceneId),state):null;
    const matched=stops.findIndex(stop=>stop.id===activeScene?.stop);
    const active=state?.completed?Math.max(0,stops.length-1):Math.max(0,matched);
    return `<section class="travelMap ${compact?'compact':''}" style="--travel-stops:${stops.length}" aria-label="${h(l({ko:'서울 여행 지도',ja:'ソウル旅行マップ',en:'Seoul travel map',zh:'首尔旅行地图'}))}"><div class="travelMapLine"><i style="width:${stops.length>1?Math.round(active/(stops.length-1)*100):100}%"></i></div>${stops.map((stop,index)=>{const open=index<=active,done=index<active||state?.completed,current=index===active&&!state?.completed,src=assetPath(pack,'props',stop.asset);return `<div class="travelStop ${open?'open':'locked'} ${done?'done':''} ${current?'current':''}"><span>${src?`<img src="${h(src)}" alt="">`:`<b>${h(stop.id)}</b>`}</span><b>${h(l(stop.name))}</b><small>${done?'DONE':current?h(l({ko:'현재',ja:'いま',en:'NOW',zh:'当前'})):h(l({ko:'잠김',ja:'未開放',en:'LOCKED',zh:'未解锁'}))}</small></div>`}).join('')}</section>`;
  }
  function skinById(pack,id){return pack.skins?.find(skin=>skin.id===id)||pack.skins?.[0]}
  function worldMarkup(pack,state,scene,answer){
    const world=scene.world;if(!world)return'';
    const store=readStore(),skin=skinById(pack,store.avatar.equipped),background=assetPath(pack,'backgrounds',world.background),npc=assetPath(pack,'npcs',world.npc);
    const props=(world.props||[]).map((key,index)=>propImage(pack,key,`travelWorldProp prop-${String(key).replace(/[^a-z0-9-]/gi,'').toLowerCase()} prop-${index}`)).join('');
    const reaction=answer?l(answer.correct?scene.success:scene.recovery):'';
    const reward=answer?.correct&&answer.earned?`<div class="travelWorldReward">${propImage(pack,'travelWon','')}<b>+${h(won(answer.earned))}</b></div>`:'';
    const item=answer?.correct&&answer.itemReward?`<div class="travelWorldItem">${propImage(pack,answer.itemReward,'')}<small>${h(l({ko:'수집품 획득',ja:'コレクション獲得',en:'COLLECTED',zh:'获得收藏品'}))}</small></div>`:'';
    return `<div class="travelWorld ${answer?answer.correct?'is-success':'is-recovery':''}" data-background="${h(world.background||'')}">${background?`<img class="travelWorldBg" src="${h(background)}" alt="">`:''}${props}${npc?`<img class="travelWorldNpc" src="${h(npc)}" alt="">`:''}${skin?.image?`<img class="travelWorldPlayer" src="${h(skin.image)}" alt="">`:''}<div class="travelWorldFloor"></div>${reward}${item}${reaction?`<p class="travelWorldReaction">${h(reaction)}</p>`:''}</div>`;
  }
  function avatarMarkup(pack,store){
    const equipped=skinById(pack,store.avatar.equipped),unlocked=new Set(store.avatar.unlocked);
    return `<section class="travelAvatar"><div class="travelAvatarHead"><div><small>MY TRAVELER</small><h2>${h(l({ko:'내 여행자',ja:'わたしの旅人',en:'My Traveler',zh:'我的旅行者'}))}</h2></div><span>${unlocked.size}/${pack.skins.length}</span></div><div class="travelAvatarStage" style="--avatar-accent:${h(equipped.accent)}"><img src="${h(equipped.image)}" alt=""><b>${h(l(equipped.name))}</b></div><div class="travelSkinGrid">${pack.skins.map(skin=>{const open=unlocked.has(skin.id),on=skin.id===equipped.id;return `<button class="${on?'on':''}" ${open?'':'disabled'} onclick="malbitTravelEquip('${h(skin.id)}')"><i style="--skin:${h(skin.accent)}"><img src="${h(skin.image)}" alt=""></i><span>${h(l(skin.name))}</span><small>${open?(on?h(l({ko:'착용 중',ja:'着用中',en:'Equipped',zh:'已装备'})):h(l({ko:'갈아입기',ja:'着替える',en:'Wear',zh:'换装'}))):h(skin.unlock==='perfect'?l({ko:'전부 정답 보상',ja:'全問正解報酬',en:'All-correct reward',zh:'全对奖励'}):l({ko:'코스 완료 보상',ja:'コース完了報酬',en:'Route-clear reward',zh:'路线完成奖励'}))}</small></button>`}).join('')}</div></section>`;
  }
  function ensureQuestion(pack,state,scene){
    if(scene.question){
      const q=scene.question;
      return{source:q,display:{...q,choiceOrder:q.choices.map((_,index)=>index)}};
    }
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
    return`<header class="travelTop"><button class="travelBack" onclick="malbitTravelBack()" aria-label="${h(l({ko:'여행 지도',ja:'旅マップ',en:'Travel map',zh:'旅行地图'}))}">‹</button><div><small>${h(pack.badge)} · BEGINNER</small><b>${h(l(pack.title))}</b></div><button class="travelLang" onclick="event.stopPropagation();flagMenu()" aria-label="${h(l({ko:'설명 언어 바꾸기',ja:'説明言語を変更',en:'Change explanation language',zh:'切换解析语言'}))}">${flag()}</button></header><div class="travelCaseMeta"><span>${h(traveler(pack,state))}</span><b>${score}/${total} ${h(l({ko:'정답',ja:'正解',en:'correct',zh:'答对'}))}</b></div><div class="travelWallet"><span><small>${h(l({ko:'게임 재화',ja:'ゲーム内通貨',en:'GAME CURRENCY',zh:'游戏货币'}))}</small><b>${h(won(state.wallet))}</b></span><span><small>${h(l({ko:'여행 시각',ja:'旅の時刻',en:'TRIP TIME',zh:'旅行时间'}))}</small><b>${h(clock(state.clockMinutes))}</b></span></div><div class="travelProgress" aria-label="${answered}/${total}"><i style="width:${Math.min(100,answered/total*100)}%"></i></div>${scene?.location?`<div class="travelLocation">● ${h(l(scene.location))}</div>`:''}`;
  }
  function koreanCopy(scene){
    return`<blockquote class="travelKorean" lang="ko">${h(scene.korean)}</blockquote>${scene.support?`<p class="travelSupport ${lang()==='ko'?'ko':''}">${h(l(scene.support))}</p>`:''}`;
  }
  function clueMarkup(scene,answer){
    if(!scene.clue)return'';
    return`<div class="travelClue ${answer?.correct?'found':'missed'}"><div><small>${answer?.correct?h(l({ko:'스탬프 획득',ja:'スタンプ獲得',en:'Stamp earned',zh:'获得印章'})):h(l({ko:'여행 기록에 저장',ja:'旅の記録に保存',en:'Saved to journey',zh:'已保存到旅行记录'}))}</small><b>${h(l(scene.clue.label))}</b><p>${h(l(scene.clue.detail))}</p></div></div>`;
  }
  function notebook(pack,state){
    const items=state.inventory.filter(key=>assetPath(pack,'props',key));
    if(!items.length)return'';
    const hub=hubByRoute(pack.id);
    const labels={
      airportMap:{ko:'인천공항 안내 지도',ja:'仁川空港ガイドマップ',en:'Incheon Airport map',zh:'仁川机场指南地图'},
      transitCard:{ko:'명동행 교통카드',ja:'明洞行き交通カード',en:'Myeongdong transit card',zh:'明洞方向交通卡'},
      'myeongdong-first-stamp':{ko:'명동 첫 여행 스탬프',ja:'明洞はじめて旅スタンプ',en:'First Myeongdong stamp',zh:'明洞首次旅行印章'}
    };
    for(const item of hub?.exchange||[])labels[item.id]=item.name;
    return`<details class="travelNotebook"><summary><b>${h(l({ko:'여행 가방',ja:'旅のバッグ',en:'Travel bag',zh:'旅行背包'}))}</b><em>${items.length} ITEM</em></summary><div>${items.map(key=>`<p>${propImage(pack,key,'')}<b>${h(l(labels[key]||{ko:key,ja:key,en:key,zh:key}))}</b><small>COLLECTED</small></p>`).join('')}</div></details>`;
  }
  function renderHub(sc){
    navActive('home');
    const store=readStore(),focus=PACKS[0],focusState=readState(focus);
    const cards=PACKS.map(pack=>{
      const state=readState(pack),answered=answeredCount(state),score=correctCount(state),complete=!!state?.completed;
      const action=!state?l({ko:'서울 여행 시작',ja:'ソウル旅を始める',en:'Start Seoul journey',zh:'开始首尔旅行'}):complete?l({ko:'완주 기록 보기',ja:'完走記録を見る',en:'View journey record',zh:'查看旅行记录'}):l({ko:'여행 이어가기',ja:'旅を続ける',en:'Continue journey',zh:'继续旅行'});
      return`<article class="travelEpisodeCard" style="--travel-accent:${h(pack.cover.accent)}"><div class="travelEpisodeArt pixel"><img src="${h(pack.cover.image)}" alt="" width="960" height="640"><i>${h(pack.badge)}</i></div><div class="travelEpisodeBody"><div class="travelEpisodeFlags"><span>BEGINNER</span><span>${h(l(pack.duration))}</span>${complete?`<span class="clear">ROUTE CLEAR</span>`:''}</div><h2>${h(l(pack.title))}</h2><p>${h(l(pack.description))}</p>${state?`<div class="travelEpisodeStats"><span>${h(l({ko:'미션',ja:'ミッション',en:'Missions',zh:'任务'}))} ${answered}/${pack.questionCount}</span><span>${h(won(state.wallet))}</span></div>`:''}<button class="travelPrimary" onclick="malbitTravelStart('${h(pack.id)}',false)">${action} <b>→</b></button>${state?`<button class="travelTextButton" onclick="malbitTravelRestart('${h(pack.id)}')">${h(l({ko:'코스 처음부터',ja:'コースを最初から',en:'Restart route',zh:'重新开始路线'}))}</button>`:''}</div></article>`;
    }).join('');
    sc.innerHTML=`<div class="travelHub"><header class="travelHubHead"><button onclick="setView('home')">‹</button><div><small>LEARN · TRAVEL · COLLECT</small><h1>${h(l({ko:'여행모드',ja:'旅行モード',en:'Travel Mode',zh:'旅行模式'}))}</h1><p>${h(l({ko:'말하고, 표지를 찾고, 발권하며 서울을 직접 여행하세요.',ja:'話して、標識を探して、発券しながらソウルを旅しよう。',en:'Speak, find signs, and use the ticket machine as you travel Seoul.',zh:'通过对话、找标志和购票，亲自游览首尔。'}))}</p></div><button class="travelLang" onclick="event.stopPropagation();flagMenu()" aria-label="${h(l({ko:'설명 언어 바꾸기',ja:'説明言語を変更',en:'Change explanation language',zh:'切换解析语言'}))}">${flag()}</button></header><section class="travelHubBanner"><div><small>KOREA ROUTE 001</small><b>${h(l({ko:'인천공항 T1 → 명동',ja:'仁川空港 T1 → 明洞',en:'Incheon Airport T1 → Myeongdong',zh:'仁川机场 T1 → 明洞'}))}</b><p>${h(l({ko:'6개 현장 미션 · 이동 선택 · 수집품 · 무료 의상',ja:'現地6ミッション・移動選択・コレクション・無料衣装',en:'6 field missions · route choice · collectibles · free outfit',zh:'6个现场任务 · 路线选择 · 收藏品 · 免费服装'}))}</p></div></section>${mapMarkup(focus,focusState)}<div class="travelSectionTitle"><b>${h(l({ko:'첫 번째 여행 코스',ja:'最初の旅行コース',en:'First travel route',zh:'第一条旅行路线'}))}</b><span>${PACKS.length} ROUTE</span></div>${cards}${metricsMarkup(store)}${avatarMarkup(focus,store)}<article class="travelComingSoon"><span>02</span><div><b>${h(l({ko:'다음 서울 지역',ja:'次のソウルエリア',en:'Next Seoul area',zh:'下一个首尔区域'}))}</b><p>${h(l({ko:'남은 여행 원·시간·수집품을 그대로 들고 다음 역으로 이어집니다.',ja:'残った旅ウォン・時間・コレクションを持って次の駅へ進みます。',en:'Carry your travel won, time, and collection to the next station.',zh:'携带剩余旅行韩元、时间和收藏前往下一站。'}))}</p></div><em>LOCKED</em></article></div>`;
  }
  function renderNarrative(sc,pack,state,scene){
    sc.innerHTML=`<div class="travelPlay">${commonTop(pack,state,scene)}<article class="travelSceneCard"><div class="travelChapter">AREA ${scene.chapter}</div><h1>${h(l(scene.title))}</h1>${worldMarkup(pack,state,scene)}${koreanCopy(scene)}<button class="travelPrimary" onclick="malbitTravelNext()">${h(l({ko:'여행 계속',ja:'旅を��ける',en:'Continue journey',zh:'继续旅行'}))} <b>→</b></button></article>${notebook(pack,state)}</div>`;
  }
  function renderChoice(sc,pack,state,scene){
    sc.innerHTML=`<div class="travelPlay">${commonTop(pack,state,scene)}<article class="travelSceneCard"><div class="travelChapter">CHOOSE YOUR ROUTE</div><h1>${h(l(scene.title))}</h1>${worldMarkup(pack,state,scene)}${koreanCopy(scene)}<div class="travelRoutes">${scene.choices.map(choice=>{const locked=Number(choice.cost)>state.wallet,src=assetPath(pack,'props',choice.asset);return`<button onclick="malbitTravelChoose('${h(choice.id)}')" ${locked?'disabled':''}>${src?`<img src="${h(src)}" alt="">`:`<span>${h(choice.code||choice.id)}</span>`}<div><b>${h(l(choice.label))}</b><small>${h(l(choice.detail))}</small><strong>${h(won(choice.cost))} · ${h(choice.durationMinutes)} MIN</strong>${locked?`<small class="need">${h(l({ko:`${won(choice.cost-state.wallet)} 더 필요`,ja:`あと${won(choice.cost-state.wallet)}必要`,en:`Need ${won(choice.cost-state.wallet)} more`,zh:`还需${won(choice.cost-state.wallet)}`}))}</small>`:''}</div><em>${locked?'LOCK':'›'}</em></button>`}).join('')}</div><details class="travelFacts"><summary>${h(l({ko:'실제 교통 정보 출처',ja:'実際の交通情報の出典',en:'Real transport sources',zh:'真实交通信息来源'}))}</summary>${pack.sources.map(source=>`<a href="${h(source.url)}" target="_blank" rel="noopener">${h(source.label)}</a>`).join('')}</details></article></div>`;
  }
  function renderQuestion(sc,pack,state,scene){
    const payload=ensureQuestion(pack,state,scene);
    if(!payload){sc.innerHTML=`<div class="travelFatal">${h(l({ko:'문항을 불러오지 못했습니다.',ja:'問題を読み込めませんでした。',en:'Could not load this question.',zh:'无法加载题目。'}))}<button onclick="malbitTravelBack()">BACK</button></div>`;return}
    const q=payload.display,answer=state.answers[scene.id],picked=answer?answer.selected:SELECTED[scene.id],listening=q.section==='listening',script=cleanScript(q.script),showTranscript=!!TRANSCRIPTS[scene.id],interaction=scene.interaction||'quiz';
    const explanation=answer?(q.explanationI18n?.[lang()]||q.explanationI18n?.ko||''):'';
    const choices=q.choices.map((choice,index)=>{
      const selected=picked===index,correct=!!answer&&index===q.answerIndex,wrong=!!answer&&selected&&!answer.correct,asset=scene.choiceAssets?.[index],src=assetPath(pack,'props',asset),ko=String(choice?.ko||l(choice)).replace(/^[①②③④]\s*/u,''),revealTranslation=!!answer&&lang()!=='ko'&&(selected||correct),translation=revealTranslation?String(l(choice)).replace(/^[①②③④]\s*/u,''):'';
      return`<button class="travelAnswer ${selected?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}" onclick="malbitTravelSelect(${index})" ${answer?'disabled':''}>${src?`<img src="${h(src)}" alt="">`:`<span>${index+1}</span>`}<span class="travelAnswerCopy"><b lang="ko">${h(ko)}</b>${translation?`<small>${h(translation)}</small>`:''}</span></button>`;
    }).join('');
    const material=listening?`<div class="travelListen"><button onclick="malbitTravelSpeak()"><span>▶</span><b>${h(l({ko:'한국어 듣기',ja:'韓国語を聞く',en:'Play Korean audio',zh:'播放韩语'}))}</b></button><button class="transcript" onclick="malbitTravelToggleTranscript()">${showTranscript?h(l({ko:'대본 닫기',ja:'スクリプトを閉じる',en:'Hide transcript',zh:'隐藏文本'})):h(l({ko:'대본 보기',ja:'スクリプトを見る',en:'Show transcript',zh:'查看文本'}))}</button>${showTranscript?`<p lang="ko">${h(script)}</p>`:''}</div>`:`${q.passage?`<div class="travelPassage" lang="ko">${h(q.passage)}</div>`:''}`;
    const feedback=answer?`<div class="travelFeedback ${answer.correct?'good':'bad'}" role="status"><div><b>${h(answer.correct?l({ko:`성공 · +${won(answer.earned)}`,ja:`成功・+${won(answer.earned)}`,en:`Success · +${won(answer.earned)}`,zh:`成功 · +${won(answer.earned)}`}):l({ko:`다시 길을 찾았어요 · ${answer.delayMinutes}분 경과`,ja:`ルート復帰・${answer.delayMinutes}分経過`,en:`Back on route · ${answer.delayMinutes} min passed`,zh:`已返回路线 · 经过${answer.delayMinutes}分钟`}))}</b>${travelCoachMarkup(scene,q,answer,explanation)}</div></div>${clueMarkup(scene,answer)}<button class="travelPrimary" onclick="malbitTravelNext()">${scene.next==='ending'?h(l({ko:'명동에 도착하기',ja:'明洞に到着',en:'Reach Myeongdong',zh:'抵达明洞'})):h(l({ko:'다음 행동',ja:'次の行動',en:'Next action',zh:'下一步行动'}))} <b>→</b></button>`:`<button class="travelPrimary ${Number.isInteger(picked)?'ready':''}" onclick="malbitTravelSubmit()">${h(l({ko:'이대로 행동하기',ja:'この行動に決める',en:'Do this',zh:'执行此操作'}))}</button>`;
    sc.innerHTML=`<div class="travelPlay travelQuestionPlay">${commonTop(pack,state,scene)}<article class="travelQuestionCard"><div class="travelQuestionNo"><span>MISSION ${questionNumber(pack,scene)} / ${pack.questionCount}</span><em>${h(interaction.toUpperCase())}</em></div><h1>${h(l(scene.title))}</h1>${worldMarkup(pack,state,scene,answer)}<p class="travelContext">${h(l(scene.context))}</p>${material}<div class="travelPrompt"><small>${h(l(scene.instruction||q.instruction))}</small><b>${h(l(q.prompt))}</b></div><div class="travelAnswers ${h(interaction)} ${answer?'answered':''}">${choices}</div>${feedback}</article>${notebook(pack,state)}</div>`;
  }
  function activeHubEvent(hub,state){
    const minute=((Number(state.clockMinutes)||0)%1440+1440)%1440;
    const timed=minute>=hub.events.daytime.from&&minute<hub.events.daytime.to?hub.events.daytime:hub.events.evening;
    const followup=Object.values(hub.events).find(event=>event.followup&&!hubQuestDone(state,event.id));
    return hubQuestDone(state,timed.id)&&followup?followup:timed;
  }
  function hubQuestDone(state,eventId){return !!state.myeongdong?.quests?.[eventId]?.completed}
  function anyHubQuestDone(state){return Object.values(state.myeongdong?.quests||{}).some(quest=>quest?.completed)}
  function hubWorld(pack,state,hub,event,answer){
    const scene={world:{...hub.world,npc:event.npc},success:event.success,recovery:event.explanation};
    const sign=event.signLabel?`<div class="travelWorldSign ${answer?.correct?'lit':''}"><small>EXIT 6</small><b lang="ko">${answer?.correct?h(event.signLabel.ko):'＿ ＿ ＿'}</b></div>`:'';
    return `<div class="travelMyeongdongWorld">${worldMarkup(pack,state,scene,answer)}${sign}</div>`;
  }
  function exchangeAvailability(item,event,state){
    if(state.inventory.includes(item.id))return{disabled:true,status:l({ko:'수집 완료',ja:'収集済み',en:'COLLECTED',zh:'已收藏'}),kind:'owned'};
    if(item.unlock==='evening'&&event.id!=='vendor-order')return{disabled:true,status:l({ko:'저녁 이벤트',ja:'夜イベント',en:'EVENING EVENT',zh:'夜间活动'}),kind:'locked'};
    if(item.unlock==='sign'&&!hubQuestDone(state,'myeongdong-station-sign'))return{disabled:true,status:l({ko:'표지판 미션 필요',ja:'標識ミッションが必要',en:'SIGN MISSION REQUIRED',zh:'需完成标牌任务'}),kind:'locked'};
    if(item.unlock==='quest'&&!anyHubQuestDone(state))return{disabled:true,status:l({ko:'NPC 퀘스트 필요',ja:'NPCクエストが必要',en:'NPC QUEST REQUIRED',zh:'需完成NPC任务'}),kind:'locked'};
    if(Number(item.cost)>state.wallet)return{disabled:true,status:l({ko:'여행 원 부족',ja:'旅ウォン不足',en:'NOT ENOUGH',zh:'旅行韩元不足'}),kind:'locked'};
    return{disabled:false,status:l({ko:'교환하기',ja:'交換する',en:'EXCHANGE',zh:'兑换'}),kind:'open'};
  }
  function exchangeMarkup(pack,state,hub,event){
    return `<section class="travelExchange" aria-labelledby="travel-exchange-title"><div class="travelSectionTitle"><div><small>${h(l({ko:'게임 재화 전용 · 결제 없음',ja:'ゲーム内通貨のみ・決済なし',en:'GAME CURRENCY ONLY · NO PAYMENT',zh:'仅限游戏货币 · 无支付'}))}</small><b id="travel-exchange-title">${h(l({ko:'명동 여행 원 교환소',ja:'明洞 旅ウォン交換所',en:'Myeongdong travel exchange',zh:'明洞旅行韩元兑换处'}))}</b></div><span>${hub.exchange.filter(item=>state.inventory.includes(item.id)).length}/${hub.exchange.length}</span></div><div class="travelExchangeGrid">${hub.exchange.map(item=>{const availability=exchangeAvailability(item,event,state);return `<button class="travelExchangeCard ${availability.kind}" onclick="malbitTravelBuy('${h(item.id)}')" ${availability.disabled?'disabled':''}><img src="${h(assetPath(pack,'props',item.asset))}" alt=""><span><small>${h(availability.status)}</small><b>${h(l(item.name))}</b><p>${h(l(item.detail))}</p><strong>${h(won(item.cost))}</strong></span></button>`}).join('')}</div></section>`;
  }
  function renderMyeongdongHub(sc,pack,state,hub){
    const event=activeHubEvent(hub,state),done=hubQuestDone(state,event.id),last=state.myeongdong.lastPurchase;
    const eventStatus=done?l({ko:'오늘의 대화 완료',ja:'今日の会話クリア',en:'TODAY’S TALK CLEARED',zh:'今日对话已完成'}):l(event.badge);
    sc.innerHTML=`<div class="travelPlay travelMyeongdong">${commonTop(pack,state,{location:hub.location})}<article class="travelMyeongdongCard"><header class="travelMyeongdongHead"><button onclick="malbitTravelMyeongdongClose()" aria-label="Back">‹</button><div><small>AREA 01 · MYEONGDONG</small><h1>${h(l(hub.title))}</h1><p>${h(l(hub.subtitle))}</p></div></header>${hubWorld(pack,state,hub,event)}<section class="travelEventCard ${done?'complete':''}"><div><small>${h(eventStatus)}</small><h2>${h(l(event.title))}</h2><p>${h(l(event.dialogue))}</p></div><button class="travelPrimary" onclick="malbitTravelTalk()">${h(done?l({ko:'대화 다시 보기',ja:'会話をもう一度',en:'Replay dialogue',zh:'重看对话'}):l({ko:'NPC에게 말 걸기',ja:'NPCに話しかける',en:'Talk to NPC',zh:'与NPC交谈'}))} <b>→</b></button></section>${last?`<div class="travelPurchaseBurst" role="status">${propImage(pack,last,'')}<span><small>${h(l({ko:'여행 가방에 저장',ja:'旅バッグに保存',en:'SAVED TO TRAVEL BAG',zh:'已存入旅行包'}))}</small><b>${h(l(hub.exchange.find(item=>item.id===last)?.name||last))}</b></span></div>`:''}${exchangeMarkup(pack,state,hub,event)}${notebook(pack,state)}<details class="travelFacts"><summary>${h(l({ko:'명동 현지 정보 출처',ja:'明洞の現地情報ソース',en:'Myeongdong fact sources',zh:'明洞实地信息来源'}))}</summary>${hub.sources.map(source=>`<a href="${h(source.url)}" target="_blank" rel="noopener">${h(source.label)}</a>`).join('')}</details></article></div>`;
  }
  function renderHubDialogue(sc,pack,state,hub,event){
    const sign=event.interaction==='sign-build',budget=event.interaction==='price-budget';
    const action=sign?l({ko:'표지판 글자 조립하기',ja:'標識の文字を組み立てる',en:'Build the station sign',zh:'拼出车站标牌'}):budget?l({ko:'가격표 읽고 수량 정하기',ja:'値札を読んで数量を決める',en:'Read prices and choose quantity',zh:'阅读价格并决定数量'}):l({ko:'내 말로 문장 만들기',ja:'自分の言葉で文を作る',en:'Build my own sentence',zh:'用自己的话造句'});
    const turns=Array.isArray(event.conversation)&&event.conversation.length?event.conversation:[{role:'npc',korean:event.dialogue?.ko||'',support:event.dialogue},{role:'player',korean:'',support:event.prompt}];
    const step=Math.max(0,Math.min(turns.length-1,Number(HUB_DIALOGUE_STEP[event.id])||0)),finished=step>=turns.length-1;
    const conversation=turns.slice(0,step+1).map((turn,index)=>{const player=turn.role==='player';return`<div class="${player?'player':'npc'} ${index===step?'current':''}"><small>${h(player?l({ko:'나',ja:'あなた',en:'YOU',zh:'你'}):l(event.speaker))}</small>${turn.korean?`<p lang="ko">${h(turn.korean)}</p>`:''}${lang()!=='ko'&&turn.support?`<span>${h(l(turn.support))}</span>`:''}</div>`}).join('');
    const nextAction=finished?'malbitTravelOrderStart()':'malbitTravelDialogueNext()';
    const nextLabel=finished?action:l({ko:'대화 계속하기',ja:'会話を続ける',en:'Continue the conversation',zh:'继续对话'});
    sc.innerHTML=`<div class="travelPlay travelMyeongdong">${commonTop(pack,state,{location:hub.location})}<article class="travelMyeongdongCard"><div class="travelQuestionNo"><span>NPC TALK · ${step+1}/${turns.length}</span><em>${h(clock(state.clockMinutes))}</em></div><h1>${h(l(event.title))}</h1>${hubWorld(pack,state,hub,event)}<div class="travelDialogueFlow" aria-live="polite">${conversation}</div><button class="travelPrimary" onclick="${nextAction}">${h(nextLabel)} <b>→</b></button><button class="travelTextButton" onclick="malbitTravelMyeongdongOpen()">${h(l({ko:'거리로 돌아가기',ja:'通りへ戻る',en:'Back to the street',zh:'返回街道'}))}</button></article></div>`;
  }
  function renderHubBudget(sc,pack,state,hub,event){
  const item=event.menu.find(entry=>entry.id===event.targetItem)||event.menu[0];
  const quantity=Math.max(0,Math.min(Number(event.maxQuantity)||3,Number(HUB_BUDGET[event.id])||1));
  const total=item.price*quantity,remaining=event.budget-total,over=remaining<0,wrong=state.myeongdong.lastAttemptCorrect===false;
  const rows=event.menu.map(entry=>`<div class="${entry.id===item.id?'target':''}" role="row"><b lang="ko">${h(entry.name)}</b><span>${h(won(entry.price))}</span></div>`).join('');
  const hint=quantity<event.targetQuantity?l({ko:'예산 안에서 한 개 더 살 수 있어요.',ja:'予算内でもう1個買えます。',en:'You can still afford one more.',zh:'预算内还可以买一个。'}):l({ko:'합계가 연습 예산을 넘었어요.',ja:'合計が練習予算を超えています。',en:'The total exceeds the practice budget.',zh:'总额超过练习预算。'});
  sc.innerHTML=`<div class="travelPlay travelMyeongdong">${commonTop(pack,state,{location:hub.location})}<article class="travelMyeongdongCard travelBudgetCard"><div class="travelQuestionNo"><span>PRICE READING · BUDGET</span><em>${h(l({ko:'가격표 계산',ja:'値札を計算',en:'PRICE MATH',zh:'价格计算'}))}</em></div><h1>${h(l(event.title))}</h1>${hubWorld(pack,state,hub,event)}<div class="travelPrompt"><small>${h(l(event.instruction))}</small><b>${h(l(event.prompt))}</b></div><section class="travelMenuBoard" aria-label="${h(l({ko:'명동 간식 가격표',ja:'明洞おやつの値札',en:'Myeongdong snack prices',zh:'明洞小吃价目表'}))}"><header><span>MENU · 명동</span><small>${h(l({ko:'가게마다 가격이 달라질 수 있어요',ja:'店によって価格は異なります',en:'Prices vary by stall',zh:'各摊位价格可能不同'}))}</small></header><div role="table">${rows}</div></section><section class="travelBudgetMeter"><div><small>${h(l({ko:'오늘의 연습 예산',ja:'今日の練習予算',en:'PRACTICE BUDGET',zh:'今日练习预算'}))}</small><b>${h(won(event.budget))}</b></div><div><small>${h(l({ko:'남길 여행 원',ja:'残る旅ウォン',en:'TRAVEL WON LEFT',zh:'剩余旅行韩元'}))}</small><b class="${over?'over':''}">${h(won(remaining))}</b></div></section><section class="travelQuantityPicker"><p><b lang="ko">${h(item.name)}</b><span>${h(won(item.price))} × ${quantity}</span></p><div><button onclick="malbitTravelBudgetChange(-1)" aria-label="${h(l({ko:'수량 줄이기',ja:'数量を減らす',en:'Decrease quantity',zh:'减少数量'}))}">−</button><strong aria-live="polite">${quantity}</strong><button onclick="malbitTravelBudgetChange(1)" aria-label="${h(l({ko:'수량 늘리기',ja:'数量を増やす',en:'Increase quantity',zh:'增加数量'}))}">＋</button></div><output>${h(l({ko:'합계',ja:'合計',en:'TOTAL',zh:'合计'}))} <b>${h(won(total))}</b></output></section>${wrong?`<div class="travelFeedback bad" role="status"><div><b>${h(hint)}</b><p>${h(l(event.explanation))}</p></div></div>`:''}<div class="travelBudgetActions"><button class="travelTextButton" onclick="malbitTravelMyeongdongOpen()">${h(l({ko:'거리로 돌아가기',ja:'通りへ戻る',en:'Back to street',zh:'返回街道'}))}</button><button class="travelPrimary ${!over&&quantity>0?'ready':''}" onclick="malbitTravelBudgetSubmit()">${h(l({ko:'이 수량으로 주문하기',ja:'この数量で注文する',en:'Order this quantity',zh:'按此数量下单'}))}</button></div><p class="travelCurrencyNote">${h(l({ko:'게임 속 여행 원만 사용하며 실제 결제는 없습니다.',ja:'ゲーム内の旅ウォンのみ使用し、実際の決済はありません。',en:'Uses game travel won only; no real payment.',zh:'仅使用游戏内旅行韩元，不涉及真实支付。'}))}</p></article></div>`;
}
  function renderHubOrder(sc,pack,state,hub,event){
    const selected=Array.isArray(HUB_ORDER[event.id])?HUB_ORDER[event.id]:[];
    const built=selected.map(index=>event.tokens[index]);
    const remaining=event.tokens.map((token,index)=>({token,index})).filter(item=>!selected.includes(item.index));
    const wrong=state.myeongdong.lastAttemptCorrect===false;
    const sign=event.interaction==='sign-build',free=event.interaction==='free-compose',required=sign?event.answer.length:event.tokens.length,result=HUB_COMPOSE_RESULT[event.id]||null;
    const modeLabel=sign?'SIGN BUILD · HANGUL':free?'FREE COMPOSE · NPC TALK':'WORD ORDER · NPC TALK';
    const modeName=sign?l({ko:'글자 조립',ja:'文字組み立て',en:'SIGN BUILD',zh:'文字拼合'}):free?l({ko:'자유 작문',ja:'自由作文',en:'FREE COMPOSE',zh:'自由造句'}):l({ko:'순서 맞추기',ja:'並べ替え',en:'WORD ORDER',zh:'语序排列'});
    const empty=sign?l({ko:'필요한 글자만 골라 주세요.',ja:'必要な文字だけを選ぼう',en:'Choose only the needed letters',zh:'只选择需要的文字'}):free?l({ko:'단어와 조사를 자유롭게 골라 말을 만들어 보세요.',ja:'単語と助詞を自由に選んで、言いたいことを作ろう。',en:'Choose words and particles freely to say what you mean.',zh:'自由选择单词和助词，组合你想说的话。'}):l({ko:'아래 단어를 순서대로 눌러 주세요.',ja:'下の単語を順番にタップ',en:'Tap the words in order',zh:'按顺序点击下方词语'});
    const wrongTitle=sign?l({ko:'다른 글자가 섞였어요 · 2분 경과',ja:'別の文字が混ざっています・2分経過',en:'A decoy slipped in · 2 min passed',zh:'混入了干扰字 · 经过2分钟'}):l({ko:'순서가 조금 달라요 · 2분 경과',ja:'順番が少し違います・2分経過',en:'Not quite the order · 2 min passed',zh:'顺序不太对 · 经过2分钟'});
    const submit=sign?l({ko:'이 표지판 완성하기',ja:'この標識を完成する',en:'Complete this sign',zh:'完成这个标牌'}):free?l({ko:'NPC에게 이대로 말하기',ja:'この文をNPCに話す',en:'Say this to the NPC',zh:'就这样对NPC说'}):l({ko:'이 문장으로 말하기',ja:'この文で話す',en:'Say this sentence',zh:'用这句话说'});
    const slots=Array.from({length:event.answer.length},(_,index)=>`<span class="${built[index]?'filled':''}" lang="ko">${h(built[index]||'＿')}</span>`).join('');
    const phrase=free&&built.length?composedSentence(built):'';
    const compositionFeedback=result?`<div class="travelFeedback ${result.grade==='partial'?'good':'bad'} travelCompositionFeedback" role="status"><div><b>${h(result.grade==='partial'?result.earned>0?l({ko:`말이 통해서 +${won(result.earned)}`,ja:`言葉が通じた・+${won(result.earned)}`,en:`They understood you · +${won(result.earned)}`,zh:`表达被理解 · +${won(result.earned)}`}):l({ko:'좋은 문장이에요 · 이미 받은 창의 보상',ja:'自然な文です・創作報酬は受取済み',en:'Good sentence · creative reward already claimed',zh:'句子通顺 · 创意奖励已领取'}):l({ko:'뜻을 더 분명하게 만들어 보세요 · 1분 경과',ja:'意味をもう少し明確にしよう・1分経過',en:'Make the meaning a little clearer · 1 min passed',zh:'请让意思更明确 · 经过1分钟'}))}</b><p lang="ko">${h(result.phrase)}</p><span>${h(l(result.response))}</span></div></div>`:'';
    sc.innerHTML=`<div class="travelPlay travelMyeongdong">${commonTop(pack,state,{location:hub.location})}<article class="travelMyeongdongCard travelOrderCard ${sign?'travelSignCard':''} ${free?'travelComposeCard':''}"><div class="travelQuestionNo"><span>${modeLabel}</span><em>${h(modeName)}</em></div><h1>${h(l(event.title))}</h1>${hubWorld(pack,state,hub,event)}<div class="travelPrompt"><small>${h(l(event.instruction))}</small><b>${h(l(event.prompt))}</b></div>${sign?`<div class="travelSignPreview" aria-label="Built station sign"><small>EXIT 6 · LINE 4</small><b>${slots}</b></div>`:''}${free&&phrase?`<div class="travelCompositionPreview"><small>${h(l({ko:'지금 만든 말',ja:'今作った文',en:'YOUR SENTENCE',zh:'当前句子'}))}</small><b lang="ko">${h(phrase)}</b></div>`:''}<div class="travelSentence" aria-label="Built sentence">${built.length?selected.map((index,position)=>`<button class="${tokenKind(event.tokens[index])}" onclick="malbitTravelOrderRemove(${position})" lang="ko">${h(event.tokens[index])}</button>`).join(''):`<p>${h(empty)}</p>`}</div><div class="travelWordBank ${free?'free':''}">${remaining.map(item=>`<button class="${tokenKind(item.token)}" onclick="malbitTravelOrderAdd(${item.index})" lang="ko">${h(item.token)}</button>`).join('')}</div>${compositionFeedback}${wrong&&!free?`<div class="travelFeedback bad" role="status"><div><b>${h(wrongTitle)}</b><p>${h(l(event.explanation))}</p></div></div>`:''}<div class="travelOrderActions"><button class="travelTextButton" onclick="malbitTravelOrderReset()">${h(free?l({ko:'새 문장 만들기',ja:'新しい文を作る',en:'New sentence',zh:'创建新句子'}):l({ko:'다시 놓기',ja:'やり直す',en:'Reset',zh:'重置'}))}</button><button class="travelPrimary ${(free?selected.length>=2:selected.length===required)?'ready':''}" onclick="malbitTravelOrderSubmit()">${h(submit)}</button></div></article></div>`;
  }
  function renderHubBudgetResult(sc,pack,state,hub,event){
  const quest=state.myeongdong.quests[event.id]||{},quantity=Math.max(0,Number(quest.quantity)||0),cost=Math.max(0,Number(quest.cost)||0),unitPrice=quantity?Math.round(cost/quantity):0;
  sc.innerHTML=`<div class="travelPlay travelMyeongdong">${commonTop(pack,state,{location:hub.location})}<article class="travelMyeongdongCard travelHubResult travelBudgetResult"><div class="travelQuestionNo"><span>MENU READING CLEAR</span><em>−${h(won(cost))}</em></div><h1>${h(l({ko:'가격을 읽고 예산 안에서 주문했다!',ja:'値段を読んで予算内で注文できた！',en:'You read the price and ordered within budget!',zh:'读懂价格并在预算内完成点单！'}))}</h1>${hubWorld(pack,state,hub,event,{correct:true,earned:0})}<blockquote class="travelKorean" lang="ko">호떡 두 개 주세요.</blockquote><p class="travelSupport">${h(l(event.success))}</p><div class="travelBudgetReceipt"><div><small>${h(l({ko:'단가',ja:'単価',en:'UNIT PRICE',zh:'单价'}))}</small><b>${h(won(unitPrice))}</b></div><div><small>${h(l({ko:'수량',ja:'数量',en:'QUANTITY',zh:'数量'}))}</small><b>${quantity}</b></div><div><small>${h(l({ko:'쓴 여행 원',ja:'使った旅ウォン',en:'SPENT',zh:'已花费'}))}</small><b>−${h(won(cost))}</b></div><div><small>${h(l({ko:'현재 잔액',ja:'現在の残高',en:'CURRENT WALLET',zh:'当前余额'}))}</small><b>${h(won(state.wallet))}</b></div></div><div class="travelTeacherTip"><b>${h(l({ko:'다음에도 쓰는 계산 요령',ja:'次にも使える計算のコツ',en:'REUSABLE SOLVING TIP',zh:'可复用的计算技巧'}))}</b><p>${h(l(event.explanation))}</p></div><button class="travelPrimary" onclick="malbitTravelMyeongdongOpen()">${h(l({ko:'명동 거리로 돌아가기',ja:'明洞の通りへ戻る',en:'Return to Myeongdong street',zh:'返回明洞街道'}))} <b>→</b></button></article></div>`;
}
  function renderHubResult(sc,pack,state,hub,event){
    if(event.interaction==='price-budget')return renderHubBudgetResult(sc,pack,state,hub,event);
    const quest=state.myeongdong.quests[event.id];
    const earned=Number.isFinite(Number(quest?.earned))?Number(quest.earned):Number(event.reward)||0;
    const sign=event.interaction==='sign-build',clearLabel=sign?'SIGN QUEST CLEAR':'NPC QUEST CLEAR';
    const title=sign?l({ko:'한글 표지판이 켜지고 길이 열렸다!',ja:'ハングルの標識が点灯し、道が開いた！',en:'The Hangul sign lit up and opened the way!',zh:'韩文标牌亮起，道路开启了！'}):l({ko:'한국어가 실제 여행을 움직였다!',ja:'韓国語で旅が動いた！',en:'Your Korean moved the journey forward!',zh:'韩语推动了真实旅程！'});
    const rewardLabel=sign?l({ko:'표지판 미션 보상',ja:'標識ミッション報酬',en:'SIGN MISSION REWARD',zh:'标牌任务奖励'}):l({ko:'NPC 대화 보상',ja:'NPC会話報酬',en:'NPC TALK REWARD',zh:'NPC对话奖励'});
    sc.innerHTML=`<div class="travelPlay travelMyeongdong">${commonTop(pack,state,{location:hub.location})}<article class="travelMyeongdongCard travelHubResult"><div class="travelQuestionNo"><span>${clearLabel}</span><em>+${h(won(earned))}</em></div><h1>${h(title)}</h1>${hubWorld(pack,state,hub,event,{correct:true,earned,itemReward:event.itemReward})}<blockquote class="travelKorean" lang="ko">${h(sign?event.answer.join(''):composedSentence(event.answer))}</blockquote><p class="travelSupport">${h(l(event.success))}</p><div class="travelReward travelHubReward">${propImage(pack,event.itemReward,'')}<div><small>${h(rewardLabel)}</small><b>${h(l(hub.exchange.find(item=>item.id===event.itemReward)?.name||event.itemReward))}</b><p>+${h(won(earned))}</p></div></div><button class="travelPrimary" onclick="malbitTravelMyeongdongOpen()">${h(l({ko:'거리에서 다음 추억 찾기',ja:'通りで次の思い出を探す',en:'Find the next street memory',zh:'在街上寻找下一段回忆'}))} <b>→</b></button></article></div>`;
  }
  function renderMyeongdong(sc,pack,state,hub){
    const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);
    if(state.myeongdong.screen==='dialogue')return renderHubDialogue(sc,pack,state,hub,event);
    if(state.myeongdong.screen==='order')return event.interaction==='price-budget'?renderHubBudget(sc,pack,state,hub,event):renderHubOrder(sc,pack,state,hub,event);
    if(state.myeongdong.screen==='result')return renderHubResult(sc,pack,state,hub,event);
    return renderMyeongdongHub(sc,pack,state,hub);
  }
  function endingType(pack,state){const score=correctCount(state);return score===pack.questionCount?'perfect':score>=Math.ceil(pack.questionCount*.67)?'clear':'close'}
  function renderEnding(sc,pack,state,scene){
    if(!state.completed){
      const perfect=correctCount(state)===pack.questionCount;
      state.completed=true;state.completedAt=now();state.updatedAt=now();state.clears=(Number(state.clears)||0)+1;state.bestScore=Math.max(Number(state.bestScore)||0,correctCount(state));
      if(perfect&&!state.perfectBonusClaimed){state.wallet+=Number(pack.perfectBonus)||0;state.perfectBonusClaimed=true}
      if(!state.inventory.includes('myeongdong-first-stamp'))state.inventory.push('myeongdong-first-stamp');
      writeState(state,['routeStarted','routeCompleted']);
    }
    const result=pack.endings[endingType(pack,state)],score=correctCount(state);
    const reward=skinById(pack,score===pack.questionCount?pack.perfectSkin:pack.rewardSkin);
    const hub=hubByRoute(pack.id);
    sc.innerHTML=`<div class="travelPlay travelEnding">${commonTop(pack,state,scene)}<article class="travelEndingCard"><div class="travelEndingGlow"></div>${worldMarkup(pack,state,scene)}<div class="travelEndingBody"><span class="travelEndingIcon">${h(result.icon)}</span><small>ROUTE CLEAR · ${h(pack.badge)}</small><h1>${h(l(result.title))}</h1><p>${h(l(result.detail))}</p><div class="travelScore"><b>${score}</b><span>/ ${pack.questionCount}</span><small>${h(l({ko:'정답 미션',ja:'正解ミッション',en:'correct missions',zh:'答对任务'}))}</small></div><div class="travelReward" style="--reward:${h(reward.accent)}"><img src="${h(reward.image)}" alt=""><div><small>${h(l({ko:'무료 여행 보상',ja:'無料の旅報酬',en:'Free journey reward',zh:'免费旅行奖励'}))}</small><b>${h(l(reward.name))}</b><p>${h(won(state.wallet))} · ${h(clock(state.clockMinutes))}</p></div></div>${koreanCopy(scene)}${notebook(pack,state)}${hub?`<button class="travelPrimary" onclick="malbitTravelMyeongdongOpen()">${h(l({ko:'명동 거리를 탐험하기',ja:'明洞の街を探索する',en:'Explore Myeongdong',zh:'探索明洞街道'}))} <b>→</b></button>`:''}<button class="travelSecondary" onclick="malbitTravelBack()">${h(l({ko:'여행 지도로',ja:'旅マップへ',en:'Back to travel map',zh:'返回旅行地图'}))}</button><button class="travelTextButton" onclick="malbitTravelRestart('${h(pack.id)}')">${h(l({ko:'다른 이동 수단으로 다시',ja:'別の移動手段で再挑戦',en:'Replay with another route',zh:'换路线重玩'}))}</button></div></article></div>`;
  }
  function renderPlay(sc){
    const {pack,state,scene}=current();
    if(!scene)return setView('travel');
    const hub=hubByRoute(pack.id);
    if(scene.type==='ending'&&state.completed&&hub&&state.myeongdong.screen!=='ending')return renderMyeongdong(sc,pack,state,hub);
    if(scene.type==='narrative')return renderNarrative(sc,pack,state,scene);
    if(scene.type==='choice')return renderChoice(sc,pack,state,scene);
    if(scene.type==='question')return renderQuestion(sc,pack,state,scene);
    return renderEnding(sc,pack,state,scene);
  }

  window.malbitTravelOpen=()=>setView('travel');
  window.malbitTravelStart=(packId,fresh)=>{
    const pack=packById(packId)||PACKS[0],store=readStore(),previous=normalizeState(pack,store.episodes[pack.id]);
    let state=previous;
    store.activePackId=pack.id;
    if(fresh||!previous){resetTransient(pack);state=newState(pack,previous)}
    else if(previous.completed)state.myeongdong.screen='ending';
    recordMilestones(store,state,['routeStarted']);
    if(state.completed)recordMilestones(store,state,['routeCompleted']);
    store.episodes[pack.id]=state;
    writeStore(store);
    setView('travelPlay');
    resetViewport();
  };
  window.malbitTravelRestart=packId=>{
    const message=l({ko:'이 여행 코스를 처음부터 다시 시작할까요? 최고 기록과 의상은 남습니다.',ja:'この旅行コースを最初からやり直しますか？ベスト記録と衣装は残ります。',en:'Restart this route? Your best score and outfits stay.',zh:'要从头开始这条路线吗？最高纪录和服装会保留。'});
    if(!confirm(message))return;
    window.malbitTravelStart(packId,true);
  };
  window.malbitTravelBack=()=>{cancelAudio();setView('travel');resetViewport()};
  window.malbitTravelEquip=skinId=>{
    const store=readStore(),pack=activePack();
    if(!store.avatar.unlocked.includes(skinId)||!skinById(pack,skinId))return;
    store.avatar.equipped=skinId;writeStore(store);
    notify(l({ko:'여행자 의상을 갈아입었어요.',ja:'旅人の衣装を着替えました。',en:'Traveler outfit changed.',zh:'旅行者服装已更换。'}));
    render();
  };
  window.malbitTravelMyeongdongOpen=()=>{
    const {pack,state,scene}=current(),hub=hubByRoute(pack.id);
    if(!hub||!state.completed||scene.type!=='ending')return;
    const event=activeHubEvent(hub,state);
    state.myeongdong.screen='hub';state.myeongdong.activeEvent=event.id;state.myeongdong.lastAttemptCorrect=null;
    writeState(state,['routeStarted','routeCompleted','myeongdongEntered']);cancelAudio();render();resetViewport();
  };
  window.malbitTravelMyeongdongClose=()=>{
    const {state}=current();
    state.myeongdong.screen='ending';state.myeongdong.activeEvent=null;state.myeongdong.lastPurchase=null;
    writeState(state);cancelAudio();render();resetViewport();
  };
  window.malbitTravelTalk=()=>{
    const {pack,state}=current(),hub=hubByRoute(pack.id);
    if(!hub||!state.completed)return;
    const event=activeHubEvent(hub,state);
    HUB_DIALOGUE_STEP[event.id]=0;delete HUB_COMPOSE_RESULT[event.id];
    state.myeongdong.screen='dialogue';state.myeongdong.activeEvent=event.id;state.myeongdong.lastAttemptCorrect=null;state.myeongdong.lastPurchase=null;
    writeState(state);render();resetViewport();
  };
  window.malbitTravelDialogueNext=()=>{
    const {pack,state}=current(),hub=hubByRoute(pack.id);if(!hub||state.myeongdong.screen!=='dialogue')return;
    const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state),turns=Array.isArray(event.conversation)?event.conversation:[];
    HUB_DIALOGUE_STEP[event.id]=Math.min(Math.max(0,turns.length-1),(Number(HUB_DIALOGUE_STEP[event.id])||0)+1);render();
  };
  window.malbitTravelOrderStart=()=>{
    const {pack,state}=current(),hub=hubByRoute(pack.id);
    if(!hub)return;
    const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);
    HUB_ORDER[event.id]=[];HUB_BUDGET[event.id]=1;delete HUB_COMPOSE_RESULT[event.id];state.myeongdong.screen='order';state.myeongdong.lastAttemptCorrect=null;
    writeState(state,event.interaction==='price-budget'&&!hubQuestDone(state,event.id)?['priceQuestStarted']:[]);render();resetViewport();
  };
  function changeHubBudget(delta){
  const {pack,state}=current(),hub=hubByRoute(pack.id);if(!hub||state.myeongdong.screen!=='order')return;
  const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);if(event.interaction!=='price-budget')return;
  const currentQuantity=Math.max(0,Number(HUB_BUDGET[event.id])||1),maximum=Math.max(1,Number(event.maxQuantity)||3);
  HUB_BUDGET[event.id]=Math.max(0,Math.min(maximum,currentQuantity+Number(delta||0)));state.myeongdong.lastAttemptCorrect=null;render();
}
  function submitHubBudget(){
  const {pack,state}=current(),hub=hubByRoute(pack.id);if(!hub||state.myeongdong.screen!=='order')return;
  const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);if(event.interaction!=='price-budget')return;
  const item=event.menu.find(entry=>entry.id===event.targetItem)||event.menu[0],quantity=Math.max(0,Number(HUB_BUDGET[event.id])||0),cost=item.price*quantity;
  if(quantity!==Number(event.targetQuantity)||cost>Number(event.budget)){
    const tracking=!hubQuestDone(state,event.id);
    state.myeongdong.attempts+=1;state.myeongdong.lastAttemptCorrect=false;state.clockMinutes+=1;state.updatedAt=now();
    writeState(state,tracking?['priceQuestStarted']:[],tracking?{priceQuestWrongSubmissions:1}:null);render();revealFeedback();return;
  }
  if(cost>state.wallet)return notify(l({ko:'여행 원이 부족합니다. 다른 퀘스트에서 조금 더 모아 주세요.',ja:'旅ウォンが足りません。ほかのクエストでもう少し集めよう。',en:'Not enough travel won. Earn a little more in another quest.',zh:'旅行韩元不足，请先在其他任务中赚取。'}));
  const already=hubQuestDone(state,event.id),previous=state.myeongdong.quests[event.id]&&typeof state.myeongdong.quests[event.id]==='object'?state.myeongdong.quests[event.id]:{};
  if(!already){state.wallet-=cost;state.spent=Array.isArray(state.spent)?state.spent:[];state.spent.push({kind:'street-food',id:event.id,item:item.id,quantity,cost,currency:'travel-won',at:now()});}
  state.myeongdong.quests[event.id]={...previous,completed:true,earned:0,quantity,cost,completedAt:previous.completedAt||now()};
  state.myeongdong.lastAttemptCorrect=null;state.myeongdong.screen='result';state.clockMinutes+=3;state.updatedAt=now();
  if(!state.evidence.includes(`hub:${event.id}`))state.evidence.push(`hub:${event.id}`);
  writeState(state,already?[]:['priceQuestStarted','priceQuestCompleted'],already?null:{priceQuestWalletAfterCompletion:state.wallet});render();resetViewport();
}
  window.malbitTravelBudgetChange=changeHubBudget;
  window.malbitTravelBudgetSubmit=submitHubBudget;
  window.malbitTravelOrderAdd=index=>{
    const {pack,state}=current(),hub=hubByRoute(pack.id);if(!hub||state.myeongdong.screen!=='order')return;
    const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);
    const order=Array.isArray(HUB_ORDER[event.id])?HUB_ORDER[event.id]:[];
    index=Number(index);if(!Number.isInteger(index)||index<0||index>=event.tokens.length||order.includes(index))return;
    const required=event.interaction==='sign-build'?event.answer.length:event.interaction==='free-compose'?Math.min(10,event.tokens.length):event.tokens.length;if(order.length>=required)return;
    order.push(index);HUB_ORDER[event.id]=order;delete HUB_COMPOSE_RESULT[event.id];state.myeongdong.lastAttemptCorrect=null;render();
  };
  window.malbitTravelOrderRemove=position=>{
    const {pack,state}=current(),hub=hubByRoute(pack.id);if(!hub||state.myeongdong.screen!=='order')return;
    const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);
    const order=Array.isArray(HUB_ORDER[event.id])?HUB_ORDER[event.id]:[];
    position=Number(position);if(!Number.isInteger(position)||position<0||position>=order.length)return;
    order.splice(position,1);delete HUB_COMPOSE_RESULT[event.id];state.myeongdong.lastAttemptCorrect=null;render();
  };
  window.malbitTravelOrderReset=()=>{
    const {pack,state}=current(),hub=hubByRoute(pack.id);if(!hub)return;
    const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);
    HUB_ORDER[event.id]=[];delete HUB_COMPOSE_RESULT[event.id];state.myeongdong.lastAttemptCorrect=null;render();
  };
  window.malbitTravelOrderSubmit=()=>{
    const {pack,state}=current(),hub=hubByRoute(pack.id);if(!hub||state.myeongdong.screen!=='order')return;
    const event=Object.values(hub.events).find(item=>item.id===state.myeongdong.activeEvent)||activeHubEvent(hub,state);
    const order=Array.isArray(HUB_ORDER[event.id])?HUB_ORDER[event.id]:[];
    const sign=event.interaction==='sign-build',free=event.interaction==='free-compose',required=sign?event.answer.length:event.tokens.length;
    if((free&&order.length<2)||(!free&&order.length!==required))return notify(sign?l({ko:'필요한 세 글자를 표지판에 놓아 주세요.',ja:'必要な3文字を標識に置いてください。',en:'Place the three needed letters on the sign.',zh:'请把需要的三个字放到标牌上。'}):free?l({ko:'두 개 이상의 단어를 골라 말을 만들어 주세요.',ja:'2つ以上の単語を選んで文を作ってください。',en:'Choose at least two words to build a sentence.',zh:'请选择至少两个词来造句。'}):l({ko:'모든 단어를 문장 칸에 놓아 주세요.',ja:'すべての単語を文の欄に置いてください。',en:'Place every word in the sentence.',zh:'请把所有词放入句子栏。'}));
    const built=order.map(index=>event.tokens[index]);
    const evaluated=free?compositionResult(event,built):null,correct=free?evaluated.grade==='full':built.every((token,index)=>token===event.answer[index]);
    if(free&&!correct){
      const previous=state.myeongdong.quests[event.id]&&typeof state.myeongdong.quests[event.id]==='object'?state.myeongdong.quests[event.id]:{},attempted=Array.isArray(previous.attemptedPhrases)?previous.attemptedPhrases:[],key=compactSentence(evaluated.phrase),unique=!attempted.includes(key),limit=Math.max(0,Number(event.maxPartialRewards)||3),claimed=Math.max(0,Number(previous.partialRewards)||0),reward=evaluated.grade==='partial'&&unique&&claimed<limit?Math.max(0,Number(event.partialReward)||0):0;
      if(unique)attempted.push(key);
      if(reward)state.wallet+=reward;
      state.myeongdong.quests[event.id]={...previous,attemptedPhrases:attempted.slice(-20),partialRewards:claimed+(reward?1:0),partialEarned:Math.max(0,Number(previous.partialEarned)||0)+reward};
      state.myeongdong.attempts+=1;state.clockMinutes+=1;state.updatedAt=now();state.myeongdong.lastAttemptCorrect=null;
      HUB_COMPOSE_RESULT[event.id]={...evaluated,earned:reward};writeState(state);render();revealFeedback();return;
    }
    if(!correct){
      state.myeongdong.attempts+=1;state.myeongdong.lastAttemptCorrect=false;state.clockMinutes+=2;state.updatedAt=now();HUB_ORDER[event.id]=[];
      writeState(state);render();revealFeedback();return;
    }
    const already=hubQuestDone(state,event.id),earned=already?0:Number(event.reward)||0;
    const previous=state.myeongdong.quests[event.id]&&typeof state.myeongdong.quests[event.id]==='object'?state.myeongdong.quests[event.id]:{};
    state.myeongdong.quests[event.id]={...previous,completed:true,earned,answer:Array.from(event.answer),completedAt:now()};
    state.myeongdong.lastAttemptCorrect=null;state.myeongdong.screen='result';state.wallet+=earned;state.clockMinutes+=3;state.updatedAt=now();
    if(event.itemReward&&!state.inventory.includes(event.itemReward))state.inventory.push(event.itemReward);
    if(!state.evidence.includes(`hub:${event.id}`))state.evidence.push(`hub:${event.id}`);
    HUB_ORDER[event.id]=[];delete HUB_COMPOSE_RESULT[event.id];writeState(state);render();resetViewport();
  };
  window.malbitTravelBuy=itemId=>{
    const {pack,state,scene}=current(),hub=hubByRoute(pack.id);if(!hub||!state.completed||scene.type!=='ending')return;
    const event=activeHubEvent(hub,state),item=hub.exchange.find(entry=>entry.id===itemId);if(!item)return;
    const availability=exchangeAvailability(item,event,state);if(availability.disabled)return notify(availability.status);
    const cost=Math.max(0,Number(item.cost)||0);
    state.wallet-=cost;state.clockMinutes+=2;state.inventory.push(item.id);state.myeongdong.lastPurchase=item.id;state.myeongdong.screen='hub';state.updatedAt=now();
    state.spent=Array.isArray(state.spent)?state.spent:[];state.spent.push({kind:'collectible',id:item.id,cost,currency:'travel-won',at:now()});
    writeState(state,['routeStarted','routeCompleted','myeongdongEntered','exchangeSession']);render();
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
    const cost=Math.max(0,Number(choice.cost)||0);
    if(cost>state.wallet)return notify(l({ko:'여행 원이 부족합니다. 문제를 더 맞혀 보세요.',ja:'旅ウォンが足りません。問題に正解して増やそう。',en:'Not enough travel won. Earn more from correct answers.',zh:'旅行韩元不足，请通过答题赚取。'}));
    state.route=choice.id;
    state.wallet-=cost;state.clockMinutes+=Math.max(0,Number(choice.durationMinutes)||0);
    state.spent=Array.isArray(state.spent)?state.spent:[];state.spent.push({kind:'transport',id:choice.id,cost,at:now()});
    move(state,pack,choice.next||scene.next);
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
    const earned=correct?Number(scene.reward??pack.questionReward)||0:0;
    const delayMinutes=correct?2:4,itemReward=correct&&scene.itemReward?scene.itemReward:null;
    state.answers[scene.id]={selected,correct,earned,delayMinutes,itemReward,bankId:q.bankId,choiceOrder:Array.from(q.choiceOrder),answeredAt:now()};
    delete SELECTED[scene.id];
    state.wallet+=earned;state.clockMinutes+=delayMinutes;
    if(itemReward&&!state.inventory.includes(itemReward))state.inventory.push(itemReward);
    if(!state.evidence.includes(scene.id))state.evidence.push(scene.id);
    state.updatedAt=now();
    if(!correct){
      try{window.MALBIT_REVIEW?.record(payload.source.level,q.section==='listening'?'listen':'read',q.bankId,selected,'travel',{choiceOrder:q.choiceOrder})}catch(error){}
    }
    writeState(state);
    render();
    revealFeedback();
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

  window.malbitTravelMetrics=()=>metricsSnapshot();

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

  window.MALBIT_TRAVEL=Object.freeze({storageKey:STORAGE_KEY,packs:PACKS,hubs:HUBS,open:window.malbitTravelOpen,metrics:window.malbitTravelMetrics});
  window.MALBIT_STORY=window.MALBIT_TRAVEL;
})();
