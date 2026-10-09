import assert from 'node:assert/strict';

// Called only by the normal mobile regression in its disposable Chrome profile.
// Never point this storage-fixture journey at the public site or a learner profile.
export async function verifyWritingCurriculum({evaluate,tap,shot,setViewport,send,ready,sleep}){
  const KEY='harumalWritingCurriculumV1';
  assert.equal(await evaluate(`['127.0.0.1','localhost','[::1]'].includes(location.hostname)`),true,'writing fixtures require the disposable local CI origin');
  assert.equal(await evaluate(`!!window.HARUMAL_WRITING&&!!window.HARUMAL_WRITING_ENGINE`),true,'writing runtime loaded');
  const original=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),history:history.state,theme:document.documentElement.dataset.theme})`);
  let screenshots=0,journeyFailure;
  const action=code=>`.wcScreen button[onclick=${JSON.stringify(code)}]`;
  const click=code=>tap(action(code),0,100);
  const state=()=>evaluate(`HARUMAL_WRITING.engine.getState()`);
  const evidence=()=>evaluate(`HARUMAL_WRITING.engine.evidence()`);
  const expectRoute=async(page,id)=>{
    const r=(await state()).route;
    assert.equal(await evaluate('S.view'),'writingCourse','writing view active');
    assert.equal(r.page,page,'writing route');
    if(id)assert.equal(r.itemId||r.groupId||r.nodeId||r.examId,id,'writing route item');
  };
  const waitFor=async(expression,label)=>{
    for(let i=0;i<60;i++){
      if(await evaluate(expression))return;
      await sleep(50);
    }
    assert.fail(label);
  };
  const readLegacy=()=>evaluate(`(()=>{
    const core=JSON.parse(localStorage.getItem('topikQuestV8'));
    delete core.view;delete core.lang;delete core.transCache;
    // Navigation analytics append mode_enter events by design. They are restored
    // with the complete storage snapshot below, not treated as learner progress.
    const roots=Object.fromEntries(MALBIT_STORAGE_GUARD.durableKeys.filter(k=>!['topikQuestV8','${KEY}','malbitJourneyEventsV1','harumalRewardsV1'].includes(k)).map(k=>[k,localStorage.getItem(k)]));
    if(roots.malbitProductPrefsV1){const prefs=JSON.parse(roots.malbitProductPrefsV1);delete prefs.theme;roots.malbitProductPrefsV1=JSON.stringify(prefs)}
    return{core,roots};
  })()`);
  const assertHonest=async label=>{
    const s=await state(),e=await evidence();
    assert.equal(e.meaningReviewed,0,label+': no automatic semantic mastery');
    assert.ok(s.attempts.every(a=>a.evaluation.meaning==='unreviewed'),label+': written meaning stays unreviewed');
    assert.equal(await evaluate(`document.querySelector('.top')?.getBoundingClientRect().height||0`),0,label+': unrelated quiz progress header hidden');
    assert.equal(await evaluate(`!!document.querySelector('.wcScreen [role="progressbar"],.wcScreen progress')`),false,label+': evidence is not a made-up completion score');
  };
  const assertUnseen=async id=>{
    const r=await evaluate(`(()=>{
      const root=document.querySelector('.wcScreen'),i=HARUMAL_WRITING.data.items.find(i=>i.id===${JSON.stringify(id)});
      return{answer:root.querySelector('#wcAnswer')?.value,model:!!root.querySelector('.wcModel'),lesson:root.textContent.includes(HARUMAL_WRITING.localeText('연결 형태 도움')),leaks:i.models.filter(m=>root.textContent.includes(m)),target:root.textContent.includes(${JSON.stringify(id==='I01'?'넓어서':'재미있어서')}),attempts:HARUMAL_WRITING.engine.getState().attempts.filter(a=>a.itemId===i.id).length};
    })()`);
    assert.equal(r.model,false,id+': no pre-submit model component');
    assert.equal(r.lesson,false,id+': no conjugation lesson on an independent prompt');
    assert.equal(r.target,false,id+': no target conjugation leak');
    assert.deepEqual(r.leaks,[],id+': no model text in the learner DOM, including closed help');
    assert.equal(r.attempts,0,id+': held-out prompt has no earlier attempt');
  };
  const fill=async(text,id)=>{
    await tap('#wcAnswer',0,50);
    // Select existing text, then let real browser input fire the app's oninput handler.
    await evaluate(`document.querySelector('#wcAnswer').select()`);
    await send('Input.insertText',{text});
    await waitFor(`JSON.parse(localStorage.getItem('${KEY}')).drafts[${JSON.stringify(id)}]?.text===${JSON.stringify(text)}`,id+': actual input was not persisted');
    assert.equal(await evaluate(`document.querySelector('#wcAnswer').value`),text,id+': input retained the typed sentence');
  };
  const fit=async(label,theme)=>{
    await waitFor(`[...document.querySelectorAll('.wcScreen img')].every(i=>i.complete&&i.naturalWidth>0)`,label+': writing art failed to load');
    const r=await evaluate(`(()=>{
      const root=document.querySelector('.wcScreen'),visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&el.getClientRects().length>0};
      const rect=el=>{const r=el.getBoundingClientRect();return{tag:el.tagName,class:el.className,left:r.left,right:r.right,width:r.width,height:r.height}};
      const controls=[...root.querySelectorAll('button,summary,textarea,.wcChoices label')].filter(visible);
      const answer=root.querySelector('#wcAnswer'),a=answer?rect(answer):null;
      const background=getComputedStyle(root.querySelector('.wcPanel,.wcHero,.wcMapBlock,.wcFacts')||root).backgroundColor;
      return{theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,contentOverflow:root.scrollWidth-root.clientWidth,small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1}).map(rect),answer:a,answerFont:answer?parseFloat(getComputedStyle(answer).fontSize):null,background,css:[...document.styleSheets].some(s=>s.href?.includes('writing-curriculum.css')),nav:document.querySelector('.nav [aria-current="page"]')?.id};
    })()`);
    assert.equal(r.theme,theme,label+': theme');
    assert.equal(r.css,true,label+': writing stylesheet loaded');
    assert.equal(r.nav,'nav_home',label+': learning navigation stays selected');
    assert.ok(r.rootWidth<=r.innerWidth+1&&r.bodyWidth<=r.innerWidth+1&&r.contentOverflow<=1,label+': horizontal overflow '+JSON.stringify(r));
    assert.deepEqual(r.small,[],label+': touch target below 44px');
    assert.deepEqual(r.outside,[],label+': interactive control leaves viewport');
    if(r.answer){assert.ok(r.answer.height>=180&&r.answer.width>=r.innerWidth*.65,label+': writing area too small');assert.ok(r.answerFont>=16,label+': input text should not trigger mobile zoom')}
    assert.notEqual(r.background,'rgba(0, 0, 0, 0)',label+': writing surface tokens missing');
    await assertHonest(label);
  };
  const capture=async(name,{unseen}={})=>{
    for(const theme of ['light','dark'])for(const width of [320,375,390,430]){
      await setViewport(width,844);
      await evaluate(`malbitSetTheme('${theme}');scrollTo({top:0,left:0,behavior:'instant'})`);
      await sleep(60);
      if(unseen)await assertUnseen(unseen);
      await fit(name+' '+theme+' '+width,theme);
      await shot(`writing-course-${name}-${theme}-${width}.png`);screenshots++;
    }
  };

  try{
    // Keep every other suite's fixtures intact; add one recognizable favorite to
    // prove the writing flow preserves vocabulary contents and SRS metadata.
    await evaluate(`setView('learn');S.lang='ko';S.vocab=[...S.vocab,{text:'쓰기 CI 보존',ja:'保存用',favorite:true,dueAt:123,interval:3,notes:'writing-ci-only'}];save();localStorage.setItem('${KEY}',JSON.stringify({schema:1,createdAt:new Date().toISOString(),revision:0,drafts:{},attempts:[],readiness:{},route:{page:'course'},firstIndependentAt:null}))`);
    await send('Page.reload',{ignoreCache:true});await ready();
    const legacyBefore=await readLegacy();
    await tap('#nav_home',0,100);await tap('[data-hub-action="practice"]',0,100);
    await tap(`.hubRow[onclick="harumalWritingGo('course')"]`,0,100);
    await expectRoute('course');await capture('01-course');
    await click("harumalWritingGo('map')");await expectRoute('map');await capture('02-map');
    await tap('.wcCurrent',0,100);await expectRoute('unit');await capture('03-unit');
    await click("harumalWritingGo('group','form-aseo')");await expectRoute('group','form-aseo');
    await click("harumalWritingStart('R01')");await expectRoute('item','R01');
    assert.equal((await state()).attempts.length,0,'visiting routes must not create learning evidence');
    await capture('04-r01-input');
    await fill('일이 많아요서 늦게 퇴근해요.','R01');
    await click("harumalWritingSubmit('R01')");await expectRoute('feedback','R01');
    let attempt=(await state()).attempts.at(-1);
    assert.equal(attempt.evaluation.status,'needs_practice');assert.ok(attempt.evaluation.issues.includes('yo_seo'));
    assert.equal(attempt.mode,'practice');assert.equal(attempt.helpUsed,true,'model reconstruction stays assisted');
    await capture('05-r01-typo-feedback');
    await tap('.wcFooter .wcButton--primary',0,100);await expectRoute('item','R01');
    await fill('일이 많아서 늦게 퇴근해요.','R01');
    await click("harumalWritingSubmit('R01')");await expectRoute('feedback','R01');
    attempt=(await state()).attempts.at(-1);
    assert.equal(attempt.evaluation.status,'form_observed');assert.equal(attempt.mode,'revision');
    assert.equal(attempt.evaluation.meaning,'unreviewed');assert.equal((await evidence()).independent,0,'corrected practice is not independent evidence');
    await capture('06-r01-form-observed');
    await tap('.wcTopline .wcButton--icon',0,100);await expectRoute('group','form-aseo');
    await tap('.wcTopline .wcButton--icon',0,100);await expectRoute('unit');
    await click("harumalWritingGo('group','independent-new')");
    await click("harumalWritingStart('I01')");await expectRoute('item','I01');
    await capture('07-i01-independent',{unseen:'I01'});
    const draft='공원이 넓어서 여기에서';
    await fill(draft,'I01');
    await send('Page.reload',{ignoreCache:true});await ready();
    await expectRoute('item','I01');
    assert.equal(await evaluate(`document.querySelector('#wcAnswer')?.value`),draft,'independent draft survives reload');
    assert.equal((await state()).attempts.length,2,'draft reload does not submit');
    await tap('.wcTopline .wcButton--icon',0,100);await expectRoute('group','independent-new');
    await evaluate('history.back()');
    await waitFor(`S.view==='writingCourse'&&HARUMAL_WRITING.engine.getState().route.page==='item'&&document.querySelector('#wcAnswer')?.value===${JSON.stringify(draft)}`,'browser Back must restore the actual draft route');
    await tap('.wcTopline .wcButton--icon',1,100);
    assert.equal(await evaluate('S.view'),'learn','Close leaves the writing corner');await tap('[data-hub-action="practice"]',0,100);
    await tap(`.hubRow[onclick="harumalWritingGo('course')"]`,0,100);
    await click("harumalWritingGo('map')");await click("harumalWritingGo('unit')");await click("harumalWritingGo('group','independent-new')");await click("harumalWritingStart('I01')");
    assert.equal(await evaluate(`document.querySelector('#wcAnswer')?.value`),draft,'Close/reopen keeps the unfinished draft');
    await fill('공원이 넓어서 여기에서 산책해요.','I01');
    // Preserve the actual button to replay a second already-dispatched click even
    // when the first click synchronously replaces it with the feedback screen.
    await evaluate(`window.__writingSubmitQA=document.querySelector(${JSON.stringify(action("harumalWritingSubmit('I01')"))})`);
    await click("harumalWritingSubmit('I01')");
    await evaluate(`window.__writingSubmitQA.click();delete window.__writingSubmitQA`);
    await expectRoute('feedback','I01');
    assert.equal((await state()).attempts.length,3,'double-submit stores exactly one independent attempt');
    attempt=(await state()).attempts.at(-1);
    assert.equal(attempt.mode,'independent');assert.equal(attempt.helpUsed,false);assert.equal(attempt.evaluation.form,'observed');
    await click(`harumalWritingSelfCheck('${attempt.id}','checked')`);
    assert.equal((await state()).attempts.at(-1).selfCheck.source,'learner');await assertHonest('self-check');
    const clearance=await evaluate(`(()=>{const sc=document.querySelector('.wcScreen.wcHasPrimary'),bar=sc.querySelector('.wcPrimaryAction'),r=bar.getBoundingClientRect();return{padding:parseFloat(getComputedStyle(sc).paddingBottom),required:r.height+innerHeight-r.bottom+24}})()`);
    assert.ok(clearance.padding>=clearance.required-1,`writing feedback must reserve fixed-action clearance: ${JSON.stringify(clearance)}`);
    await click("harumalWritingGo('item','I01')");await click("harumalWritingSubmit('I01')");
    assert.equal((await state()).attempts.length,3,'reopening and resubmitting unchanged text cannot duplicate evidence');
    await tap('.wcTopline .wcButton--icon',0,100);await tap('.wcTopline .wcButton--icon',0,100);
    await click("harumalWritingGo('records')");await expectRoute('records');
    assert.equal(await evaluate(`document.querySelector('.wcEvidenceCards').textContent.includes(HARUMAL_WRITING.localeText('새 상황 첫 답 {0}개',1))`),true,'independent count is shown in the selected language');
    await capture('08-records');
    await tap('.wcTopline .wcButton--icon',0,100);await click("harumalWritingGo('map')");await click("harumalWritingGo('unit')");
    await click("harumalWritingGo('group','delayed-new')");
    assert.equal((await evidence()).delayedReady,false,'same-day delayed gate stays closed');
    assert.equal(await evaluate(`!!document.querySelector('#wcAnswer')||document.querySelector('.wcScreen').textContent.includes('영화가 재미있어요.')`),false,'future prompt must stay held out');
    // Time travel only this disposable test record; never alter the system clock.
    // Update the anchor attempt as well because engine merge derives the anchor.
    await evaluate(`(()=>{const s=JSON.parse(localStorage.getItem('${KEY}')),past=new Date(Date.now()-49*60*60*1000).toISOString();for(const a of s.attempts)if(a.mode==='independent')a.createdAt=past;s.firstIndependentAt=past;localStorage.setItem('${KEY}',JSON.stringify(s))})()`);
    await send('Page.reload',{ignoreCache:true});await ready();
    await expectRoute('group','delayed-new');assert.equal((await evidence()).delayedReady,true,'seeded later-day fixture opens delayed gate');
    await click("harumalWritingStart('D01')");await expectRoute('item','D01');
    assert.match(await evaluate(`document.querySelector('.wcFacts').textContent`),/영화가 재미있어요/);
    assert.doesNotMatch(await evaluate(`document.querySelector('.wcFacts').textContent`),/공원이 넓어요/);
    await capture('09-d01-delayed',{unseen:'D01'});
    await fill('영화가 재미있어서 다시 봐요.','D01');await click("harumalWritingSubmit('D01')");
    attempt=(await state()).attempts.at(-1);
    assert.equal(attempt.itemId,'D01');assert.equal(attempt.mode,'delayed');assert.equal(attempt.evaluation.form,'observed');
    assert.equal((await evidence()).delayed,1);assert.equal((await evidence()).independent,1);await assertHonest('delayed new sentence');
    assert.deepEqual(await readLegacy(),legacyBefore,'writing preserves legacy vocabulary/favorites, SRS, old writing, game, review, travel and durable learner roots');
    assert.equal(screenshots,72,'nine writing states × four widths × two themes');
  }catch(error){
    journeyFailure=error;
    try{await shot('writing-course-failure.png')}catch{}
    throw error;
  }finally{
    // Restore byte-for-byte storage (including the recovery snapshot) even when
    // an assertion fails. Read the restored bytes in the same browser task: a
    // render/resize here would queue fresh navigation analytics after restoration.
    // This helper is last in the harness, so no further UI work is needed.
    try{
      const restored=await evaluate(`(()=>{
        stopTimer();S=JSON.parse(${JSON.stringify(original.state)});
        document.documentElement.dataset.theme=${JSON.stringify(original.theme)};
        history.replaceState(${JSON.stringify(original.history)},'');
        const previous=${JSON.stringify(original.storage)};
        for(const k of Object.keys(localStorage))if(!Object.prototype.hasOwnProperty.call(previous,k))localStorage.removeItem(k);
        for(const[k,v]of Object.entries(previous))localStorage.setItem(k,v);
        delete window.__writingSubmitQA;
        return Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]));
      })()`);
      assert.deepEqual(restored,original.storage,'writing test restores all original CI storage snapshots');
    }catch(error){
      if(!journeyFailure)throw error;
      // Keep the original failing flow and stack as the primary CI diagnostic.
      console.error('Writing cleanup also failed:',error.message);
    }
  }
  console.log(`Writing curriculum: real input/reload/back/close/reopen, correction + independent + delayed evidence, legacy records preserved; screenshots=${screenshots}`);
}
