import assert from 'node:assert/strict';

// Rendered Chrome evidence uses only the disposable CI profile. Never run against a learner's browser.
export async function verifyQuickPracticeMenus({evaluate,tap,shot,setViewport,send,ready,sleep}) {
  assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
  assert.equal(await evaluate(`!!window.HARUMAL_PRACTICE&&!!window.HARUMAL_HUB.openAreas`),true,'quick-practice owners loaded');
  const before=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),history:history.state,theme:document.documentElement.dataset.theme})`);
  const view=()=>evaluate('S.view');
  const active=()=>evaluate('HARUMAL_PRACTICE.getActive()');
  const rewards=()=>evaluate('JSON.stringify(HARUMAL_REWARDS.getState())');
  const progress=()=>evaluate(`JSON.stringify({vocab:S.vocab,history:S.history,gameUnlock:S.gameUnlock,gameAnswers:S.gameAnswers,roots:Object.fromEntries(['malbitBeginnerV1','topikQuestTopik1GameV1','malbitWrongReviewV3','harumalWritingCurriculumV1','harumalGrowthLearningV1','malbitStoryV1','harumalTravelAdventureV1'].map(k=>[k,localStorage.getItem(k)]))})`);
  const setup=async(lang='ko',theme='light',width=390)=>{
    await setViewport(width,width===1280?900:844);
    await evaluate(`stopTimer();setLang(${JSON.stringify(lang)});malbitSetTheme(${JSON.stringify(theme)});setView('home');window.scrollTo(0,0)`);await sleep(70);
  };
  const geometry=selector=>evaluate(`(()=>{
    const root=document.querySelector('#screen'),rect=e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
    const shown=e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden';
    const controls=[...root.querySelectorAll('button,a')].filter(shown),cards=[...root.querySelectorAll(${JSON.stringify(selector)})].filter(shown);
    return{width:innerWidth,overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,controls:controls.map(e=>({id:e.dataset.hubAction||e.dataset.area||e.dataset.practiceLevel||e.className,...rect(e)})),cards:cards.map(e=>{const s=getComputedStyle(e);return{...rect(e),tag:e.tagName,action:e.dataset.hubAction,area:e.dataset.area,text:e.innerText.trim(),label:e.querySelector('b,h2,h3')?.textContent.trim(),background:s.backgroundColor,color:s.color,radius:s.borderRadius,overflow:e.scrollWidth-e.clientWidth,nested:e.querySelectorAll('button,a,input').length}}),activeTab:document.querySelector('.nav [aria-current="page"]')?.id};
  })()`);
  const fit=(g,label)=>{
    assert.ok(g.overflow<=1,`${label}: page has no horizontal overflow`);
    assert.equal(g.activeTab,'nav_home',`${label}: Learn stays selected`);
    assert.deepEqual(g.controls.filter(r=>r.width<43||r.height<43),[],`${label}: controls have 44px touch targets`);
    assert.deepEqual(g.controls.filter(r=>r.left< -1||r.right>g.width+1),[],`${label}: controls fit horizontally`);
    for(const card of g.cards){
      assert.equal(card.tag,'BUTTON',`${label}: the entire card is a semantic button`);
      assert.equal(card.nested,0,`${label}: card has no nested competing click targets`);
      assert.ok(card.overflow<=1,`${label}: card content does not clip horizontally`);
      assert.ok(card.text&&card.label,`${label}: card has readable localized copy`);
    }
    assert.ok(g.cards.length>0,`${label}: cards are present`);
    for(const key of ['height','width'])assert.ok(Math.max(...g.cards.map(r=>r[key]))-Math.min(...g.cards.map(r=>r[key]))<=2,`${label}: cards have equal ${key}`);
    assert.equal(new Set(g.cards.map(r=>r.background)).size,1,`${label}: all cards share one fill`);
    assert.equal(new Set(g.cards.map(r=>r.radius)).size,1,`${label}: all cards share one corner treatment`);
    for(let i=0;i<g.cards.length;i++)for(let j=i+1;j<g.cards.length;j++){
      const a=g.cards[i],b=g.cards[j];assert.ok(a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+1||b.bottom<=a.top+1,`${label}: cards do not overlap`);
    }
  };
  const menu=async(kind,level)=>{
    if(await view()!=='home')await tap('#nav_home');
    await tap(`[data-hub-action="${kind}"]`);assert.equal(await view(),kind+'Areas');
    await tap(`[data-practice-level="${level}"]`);
  };
  // Click near the card edge as well as testing the usual center, proving the whole card is interactive.
  const edgeTap=async selector=>{
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'auto'})`);await sleep(100);
    const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect(),x=r.right-14,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);return{x,y,hit:hit===e||e.contains(hit)}})()`);
    assert.equal(p.hit,true,'card edge is not covered');
    await send('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',clickCount:1});await sleep(130);
  };
  const currentQuestion=()=>evaluate(`(()=>{
    const one=JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null');
    if(S.view==='t1quiz'&&one){const id=one.ids?.[one.i],q=MALBIT_BANK.byId(id);return{id,section:q?.section,level:Number(q?.level)||1,total:one.ids?.length,started:one.started,duration:one.duration,metadata:one.practiceSession};}
    const cur=S.infinity?.current,q=cur&&MALBIT_BANK.byId(cur.bankId||cur.id);
    if(S.view==='infinity')return{id:cur?.bankId||cur?.id,section:q?.section||({listen:'listening',read:'reading',write:'writing'}[cur?.type]),level:2,type:cur?.type,metadata:S.infinity?.practiceSession};
    if(S.view==='real')return{section:({listen:'listening',read:'reading',write:'writing'}[S.real?.phase]),level:2,deadline:S.real?.deadline,metadata:S.real?.practiceSession};return null;
  })()`);
  let failed;
  try {
    await setup();
    const initialRewards=await rewards(),initialProgress=await progress(),course=await evaluate('JSON.stringify(HARUMAL_HUB.getState())');
    // Each matrix screenshot contains actual rendered DOM, never a mockup or image of a design board.
    for(const lang of ['ko','ja','en','zh'])for(const theme of ['light','dark'])for(const width of [320,390,1280]){
      const label=`${lang}-${theme}-${width}`;
      await setup(lang,theme,width);
      const home=await geometry('.hubQuickGrid .hubMenuCard');fit(home,'home '+label);
      assert.deepEqual(home.cards.map(c=>c.action),['path','shorts','random','mock'],'approved Home order');
      if(lang==='ko')assert.deepEqual(home.cards.map(c=>c.label),['단계별 학습','숏츠 문제','랜덤 문제','모의고사'],'approved Korean labels');
      assert.equal(await evaluate(`document.querySelectorAll('.hubHome [data-hub-action="continue"]').length`),0,'Home has no dominant Continue card');
      assert.equal(await evaluate(`!!document.querySelector('.hubHome [data-hub-action="practice"]:not(.hubMenuCard)')`),true,'More practice remains a secondary entry');
      await shot(`quick-home-${label}.png`);
      for(const kind of ['random','mock']){
        await tap(`[data-hub-action="${kind}"]`);assert.equal(await view(),kind+'Areas');
        for(const level of [1,2]){
          await tap(`[data-practice-level="${level}"]`);await evaluate('window.scrollTo(0,0)');
          const area=await geometry('.hubAreaGrid .hubAreaCard');fit(area,`${kind} ${level} ${label}`);
          assert.deepEqual(area.cards.map(c=>c.area),level===1?['listening','reading']:['listening','reading','writing'],'area eligibility matches TOPIK level');
          assert.deepEqual(await evaluate(`[...document.querySelectorAll('[data-practice-level][aria-pressed="true"]')].map(e=>Number(e.dataset.practiceLevel))`),[level],'selected TOPIK level is accessible');
          assert.notEqual(area.cards[0].background,home.cards[0].background,'inner area fill is distinct from Home sage');
          const rgb=(area.cards[0].background.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
          assert.ok(rgb.length===3&&rgb[2]>=rgb[0]&&rgb[1]>=rgb[0],'inner area cards keep the approved blue-gray tint');
          if(theme==='light')assert.ok(rgb.reduce((a,b)=>a+b,0)/3>=170,'inner area cards remain light rather than saturated/dark');
          assert.equal(await evaluate(`!!document.querySelector('[data-area="full"]:not(.hubAreaCard)')`),kind==='mock','full mock remains a secondary choice only in mock menu');
          await shot(`quick-${kind}-topik${level}-${label}.png`);
        }
        if(kind==='mock'){
          await tap('.hubAreaCard[data-area="writing"]');assert.equal(await view(),'mockReady');
          const readyFit=await evaluate(`(()=>{const r=document.querySelector('[data-hub-action="start-mock"]').getBoundingClientRect();return{overflow:document.documentElement.scrollWidth-innerWidth,width:r.width,height:r.height,left:r.left,right:r.right}})()`);
          assert.ok(readyFit.overflow<=1&&readyFit.width>=44&&readyFit.height>=44&&readyFit.left>=0&&readyFit.right<=width,`mock readiness ${label}: fits with a full Start target`);
          await shot(`quick-mock-ready-${label}.png`);await tap('.hubPageHead .hubBack');assert.equal(await view(),'mockAreas');
        }
        await tap('.hubPageHead .hubBack');assert.equal(await view(),'home','area Back returns Home');
      }
    }
    assert.equal(await rewards(),initialRewards,'menu navigation never grants XP or coins');
    assert.equal(await progress(),initialProgress,'menu navigation preserves all learner evidence');
    assert.equal(await evaluate('JSON.stringify(HARUMAL_HUB.getState())'),course,'practice level choices do not change the learning course');
    await setup();
    for(const [action,expected] of [['path','courseMap'],['shorts','shorts'],['random','randomAreas'],['mock','mockAreas']]){
      await edgeTap(`.hubMenuCard[data-hub-action="${action}"]`);assert.equal(await view(),expected,`${action}: clicking the card edge opens its route`);await tap('#nav_home');
    }
    await tap('[data-hub-action="practice"]');assert.equal(await view(),'practiceHub');
    assert.equal(await evaluate(`!!document.querySelector('[data-hub-action="travel"]')`),true,'existing Travel remains reachable');await tap('#nav_home');
    // An explicit Listening choice must work even when ordinary mixed practice excludes listening.
    await evaluate(`(()=>{const p=JSON.parse(localStorage.getItem('malbitProductPrefsV1')||'{}');p.listeningMode='off';localStorage.setItem('malbitProductPrefsV1',JSON.stringify(p))})()`);
    const preference=await evaluate(`localStorage.getItem('malbitProductPrefsV1')`);
    for(const level of [1,2])for(const area of level===1?['listening','reading']:['listening','reading','writing']){
      await menu('random',level);await edgeTap(`.hubAreaCard[data-area="${area}"]`);
      assert.equal(await view(),level===1?'t1quiz':'infinity',`TOPIK ${level} ${area} opens an actual random question`);
      const session=await active(),question=await currentQuestion();
      assert.deepEqual([session.mode,session.level,session.area,session.returnTo,session.size],['random',level,area,'randomAreas',10],'random session keeps the exact area and ten-question limit');
      assert.deepEqual([question.level,question.section],[level,area],'first question belongs to the selected TOPIK area');
      assert.equal(await evaluate(`localStorage.getItem('malbitProductPrefsV1')`),preference,'explicit area does not overwrite listening preference');
      assert.equal(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),true,'random question fits mobile');
      await shot(`quick-random-topik${level}-${area}-question-ko-light-390.png`);
      const questionId=question.id;
      await send('Page.reload',{ignoreCache:true});await ready();
      const restored=await active();assert.deepEqual(restored?[restored.mode,restored.level,restored.area]:[],['random',level,area],'reload preserves the chosen random session');
      assert.equal((await currentQuestion()).id,questionId,'reload does not replace the current question');
      await tap(level===1?'.t1RandomTop>button':'.randomPracticeTop>button');
      assert.equal(await view(),'randomAreas','random Back returns to area selection');
      assert.deepEqual(await evaluate(`[...document.querySelectorAll('[data-practice-level][aria-pressed="true"]')].map(e=>Number(e.dataset.practiceLevel))`),[level],'random Back preserves selected TOPIK level');
    }
    assert.equal(await rewards(),initialRewards,'opening and leaving unanswered sessions grants no rewards');
    assert.equal(await progress(),initialProgress,'unanswered practice preserves learner evidence');
    const mockMeta={1:{listening:[30,40],reading:[40,60],full:[70,100]},2:{listening:[50,60],reading:[50,70],writing:[4,50],full:[104,180]}};
    for(const level of [1,2])for(const area of Object.keys(mockMeta[level])){
      await menu('mock',level);
      const timerBefore=await evaluate(`JSON.stringify({deadline:S.real?.deadline,started:JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null')?.started})`);
      await edgeTap(`[data-area="${area}"]`);assert.equal(await view(),'mockReady','choosing a mock area opens readiness without starting');
      assert.equal(await evaluate(`JSON.stringify({deadline:S.real?.deadline,started:JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null')?.started})`),timerBefore,'readiness does not create or restart a timer');
      const text=await evaluate(`document.querySelector('#screen').innerText`),[count,minutes]=mockMeta[level][area];
      assert.match(text,new RegExp(`\\b${count}\\b`),'readiness states the question count');assert.match(text,new RegExp(`\\b${minutes}\\b`),'readiness states the exam time');
      assert.equal(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),true,'mock readiness fits mobile');
      await shot(`quick-mock-topik${level}-${area}-ready-ko-light-390.png`);
      await tap('[data-hub-action="start-mock"]');assert.equal(await view(),level===1?'t1quiz':'real','Start enters the actual mock engine');
      const session=await active(),question=await currentQuestion();
      assert.deepEqual([session.mode,session.level,session.area,session.returnTo],['mock',level,area,'mockAreas'],'mock session keeps the selected section');
      assert.equal(question.section,area==='full'?'listening':area,'mock begins in the requested section');
      if(level===1){assert.equal(question.total,count,'TOPIK I mock has its exact section length');assert.equal(question.duration,minutes*60,'TOPIK I mock timer matches readiness')}
      else assert.ok(question.deadline>Date.now()&&question.deadline-Date.now()<=((area==='full'?60:minutes)*60000),'TOPIK II mock timer begins after Start');
      await shot(`quick-mock-topik${level}-${area}-question-ko-light-390.png`);
      await evaluate('HARUMAL_PRACTICE.back()');assert.equal(await view(),'mockAreas','mock Back restores area menu');
    }
    assert.equal(await rewards(),initialRewards,'exam setup and unanswered entry grant no rewards');
    assert.equal(await progress(),initialProgress,'exam setup preserves unrelated learning progress');
    assert.equal(await evaluate('JSON.stringify(HARUMAL_HUB.getState())'),course,'practice sessions preserve course selection');
    // Finish two actual ten-question reading sessions through the existing answer controls.
    // These disposable answers may earn rewards; opening/restarting the result must not duplicate them.
    for(const level of [1,2]){
      await menu('random',level);await tap('.hubAreaCard[data-area="reading"]');
      const ids=new Set();
      for(let index=0;index<10;index++){
        const question=await currentQuestion();assert.equal(question.section,'reading','every random draw stays in the selected area');
        assert.ok(!ids.has(question.id),'ten-question session never repeats a question');ids.add(question.id);
        await tap('.choice',0,100);await tap('.choice',0,130);
        assert.equal((await active()).answered,index+1,'one submitted answer advances exactly once');
        await tap(level===1?'button[onclick="t1Next()"]':'button[onclick="nextInfinity()"]',0,130);
      }
      const result=await active();assert.equal(result.completed,true,'the tenth question opens completion');assert.equal(result.answered,10,'completion has exactly ten answers');
      if(level===1)assert.equal(await view(),'t1result');else assert.equal(await evaluate(`!!document.querySelector('#overlay.open #sheetBody')`),true,'TOPIK II completion sheet is visible');
      await shot(`quick-random-topik${level}-reading-complete-ko-light-390.png`);
      const earned=await rewards();
      await tap(level===1?'[data-practice-restart]':'#sheetBody .primary');
      const restarted=await active();assert.deepEqual([restarted.mode,restarted.level,restarted.area,restarted.answered,restarted.size],['random',level,'reading',0,10],'Again starts a fresh same-area session');
      assert.equal(await rewards(),earned,'restarting does not grant a duplicate result reward');
      await tap(level===1?'.t1RandomTop>button':'.randomPracticeTop>button');assert.equal(await view(),'randomAreas');
    }
    // Exercise both asynchronous TOPIK II result ceremonies in this disposable profile.
    const mockResult=async()=>{
      await evaluate('finishReal()');
      let shown=false;
      for(let attempt=0;attempt<65;attempt++){
        shown=await evaluate(`!!document.querySelector('#resultCurtain.open #resultCard.show [data-practice-restart]')&&!!document.querySelector('#resultCard [data-practice-result-back]')`);
        if(shown)break;await sleep(100);
      }
      assert.equal(shown,true,'the asynchronous mock result offers Again and Back to areas');
      await sleep(400); // The existing result-card pop animation scales its hit rectangles for 350ms.
      const resultFit=await evaluate(`(()=>{const buttons=[...document.querySelectorAll('#resultCard [data-practice-restart],#resultCard [data-practice-result-back]')];return buttons.map(e=>{const r=e.getBoundingClientRect();return{width:r.width,height:r.height,left:r.left,right:r.right}})})()`);
      assert.ok(resultFit.length===2&&resultFit.every(r=>r.width>=43&&r.height>=43&&r.left>=0&&r.right<=390),'mock result actions fit with full touch targets');
    };
    for(const area of ['reading','full']){
      await menu('mock',2);await tap(`[data-area="${area}"]`);await tap('[data-hub-action="start-mock"]');
      await mockResult();await shot(`quick-mock-topik2-${area}-complete-ko-light-390.png`);
      const earned=await rewards(),deadline=await evaluate('S.real.deadline');
      await tap('#resultCard [data-practice-restart]');assert.equal(await view(),'mockReady','result Again returns to readiness');
      assert.equal(await evaluate('S.real.deadline'),deadline,'Again does not start an exam timer before confirmation');
      assert.equal(await rewards(),earned,'Again does not duplicate exam rewards');
      assert.equal(await evaluate(`document.querySelector('#resultCurtain').classList.contains('open')`),false,'Again dismisses the result curtain');
      await tap('[data-hub-action="start-mock"]');assert.equal(await view(),'real');assert.equal((await active()).area,area,'confirmed restart preserves the mock area');
      await mockResult();await tap('#resultCard [data-practice-result-back]');assert.equal(await view(),'mockAreas','result Back returns to mock area choices');
      assert.deepEqual(await evaluate(`[...document.querySelectorAll('[data-practice-level][aria-pressed="true"]')].map(e=>Number(e.dataset.practiceLevel))`),[2],'result Back preserves TOPIK II');
      assert.equal(await evaluate(`document.querySelector('#resultCurtain').classList.contains('open')`),false,'Back dismisses the result curtain');
    }
    console.log('Quick-practice QA: 4 locales × 2 themes × 320/390/1280px; equal Home/area cards, distinct blue-gray depth, all TOPIK areas, full-card clicks, random reload/Back/ten-question completion/restart, mock readiness/timers/results/restart, full mocks, listening-off override, no navigation rewards, and preserved learner progress passed.');
  } catch(error) {failed=error;throw error} finally {
    try {
      await evaluate(`(()=>{HARUMAL_HUB.closeSettings();stopTimer();window.stopListeningAudio?.();const saved=${JSON.stringify(before.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(saved,k))localStorage.removeItem(k);for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);S=JSON.parse(${JSON.stringify(before.state)});document.documentElement.dataset.theme=${JSON.stringify(before.theme)};history.replaceState(${JSON.stringify(before.history)},'')})()`);
      await send('Page.reload',{ignoreCache:true});await ready();
    } catch(error) {if(!failed)throw error}
  }
}
