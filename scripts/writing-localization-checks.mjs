import assert from 'node:assert/strict';

// Integrate with scripts/check-travel-mobile.mjs after verifyWritingCurriculum.
// This fixture helper must run only in that harness's disposable local profile.
export async function verifyWritingLocalization({ evaluate, tap, shot, setViewport, send, ready, sleep }) {
  const KEY = 'harumalWritingCurriculumV1';
  assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`), true, 'localization fixtures require the disposable local CI origin');
  assert.equal(await evaluate(`typeof HARUMAL_WRITING?.localeText`), 'function', 'localized writing runtime loaded');
  const original = await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),history:history.state,theme:document.documentElement.dataset.theme})`);
  let screenshots = 0, failure;
  const route = (page, id = '') => evaluate(`harumalWritingGo(${JSON.stringify(page)},${JSON.stringify(id)})`);
  const snapshot = () => evaluate(`(()=>{const s=HARUMAL_WRITING.engine.getState(),g=HARUMAL_WRITING.engine.guidedProgress();return{attempts:s.attempts,drafts:s.drafts,readiness:s.readiness,firstIndependentAt:s.firstIndependentAt,guidedCompletion:{completedItemIds:g.completedItemIds,completedIds:g.completedIds,confirmedStageIds:g.confirmedStageIds,unlockedIds:g.unlockedIds,complete:g.complete}}})()`);
  const click = handler => tap(`.wcScreen button[onclick=${JSON.stringify(handler)}]`,0,100);
  const expectRoute = async (page,id) => {
    const actual = await evaluate('HARUMAL_WRITING.engine.getState().route');
    assert.equal(actual.page,page,'actual writing route');
    if (id) assert.equal(actual.itemId || actual.groupId || actual.levelId || actual.nodeId || actual.examId,id,'actual writing route ID');
  };
  const waitFor = async (expression,label) => {
    for (let attempt=0;attempt<60;attempt++) { if (await evaluate(expression)) return; await sleep(50); }
    assert.fail(label);
  };
  const assertStageDone = async () => {
    await expectRoute('stage-done','probe-basics');
    const actual = await evaluate(`(()=>{const g=HARUMAL_WRITING.engine.guidedProgress();return{completed:g.completedIds.includes('probe-basics'),nextPanel:!!document.querySelector('.wcNextStage'),nextButton:document.querySelector('.wcFooter button')?.getAttribute('onclick')==="harumalWritingContinue('probe-basics')",art:document.querySelector('.wcFlowArt')?.getAttribute('src'),meaningReviewed:HARUMAL_WRITING.engine.evidence().meaningReviewed}})()`);
    assert.equal(actual.completed,true,'stage screen must be backed by the completed six-item journey');
    assert.equal(actual.nextPanel,true,'real stage-completion panel is rendered, not the course fallback');
    assert.equal(actual.nextButton,true,'real next-stage control is rendered');
    assert.equal(actual.art,'assets/art/writing/flow-unlock-v1.webp','the unlock illustration is shown');
    assert.equal(actual.meaningReviewed,0,'sequence completion does not claim semantic mastery');
  };
  const inspect = `(()=>{
    const root=document.querySelector('.wcScreen'),lang=S.lang,catalog={...window.HARUMAL_WRITING_UI_I18N,...window.HARUMAL_WRITING_CONTENT_I18N};
    const allowed=[...new Set(Object.values(catalog).flatMap(entry=>(entry[lang]||'').match(/[가-힣]+/g)||[]))].sort((a,b)=>b.length-a.length);
    const untranslated=[],invalidLearningContainers=[];
    const check=(text,kind)=>{if(lang==='ko')return;text=text.replace(/하루말/g,'');for(const token of allowed)text=text.split(token).join('');if(/[가-힣]/.test(text))untranslated.push(kind+': '+text.trim())};
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    for(let node;node=walker.nextNode();){if(node.parentElement.closest('[lang="ko"],textarea,script,style,.wcLanguage option'))continue;check(node.textContent,'text')}
    for(const node of root.querySelectorAll('[aria-label],[placeholder],[title]'))for(const attr of ['aria-label','placeholder','title'])if(node.hasAttribute(attr))check(node.getAttribute(attr),attr);
    for(const node of root.querySelectorAll('section[lang="ko"],header[lang="ko"],main[lang="ko"],details[lang="ko"],button[lang="ko"],fieldset[lang="ko"]'))invalidLearningContainers.push(node.tagName+'.'+node.className);
    const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};
    const controls=[...root.querySelectorAll('button,summary,textarea,select,.wcChoices label')].filter(visible);
    return{lang,route:HARUMAL_WRITING.engine.getState().route,untranslated:[...new Set(untranslated)],invalidLearningContainers,width:innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,overflow:root.scrollWidth-root.clientWidth,small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(el=>el.className),outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1}).map(el=>el.className),theme:document.documentElement.dataset.theme,answerFont:root.querySelector('#wcAnswer')?parseFloat(getComputedStyle(root.querySelector('#wcAnswer')).fontSize):null};
  })()`;
  const assertScreen = async label => {
    const result = await evaluate(inspect);
    assert.deepEqual(result.untranslated, [], label + ': untranslated UI text');
    assert.deepEqual(result.invalidLearningContainers, [], label + ': UI container mislabeled as a Korean lesson');
    assert.ok(result.documentWidth <= result.width + 1 && result.bodyWidth <= result.width + 1 && result.overflow <= 1, label + ': horizontal overflow ' + JSON.stringify(result));
    assert.deepEqual(result.small, [], label + ': touch targets below 44px');
    assert.deepEqual(result.outside, [], label + ': controls outside viewport');
    if (result.answerFont != null) assert.ok(result.answerFont >= 16, label + ': textarea text must not trigger mobile zoom');
  };
  const switchWithPicker = async lang => {
    const savedRoute = await evaluate('HARUMAL_WRITING.engine.getState().route');
    const before = await snapshot();
    const storedBefore = await evaluate(`localStorage.getItem('${KEY}')`);
    if (await evaluate(`!!document.querySelector('.wcLanguage')`)) {
      await tap('.wcLanguage',0,100);
      const key = async (name,code) => { await send('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:code}); await send('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code}); };
      await key('Home',36);
      for (let index=0;index<['ko','ja','en','zh'].indexOf(lang);index++) await key('ArrowDown',40);
      await key('Enter',13); await key('Escape',27); await sleep(100);
      assert.equal(await evaluate('S.lang'),lang,'in-place language selector changes current writing locale');
      assert.equal(await evaluate(`JSON.parse(localStorage.getItem('topikQuestV8')).lang`),lang,'in-place language selection is persisted');
      assert.deepEqual(await evaluate('HARUMAL_WRITING.engine.getState().route'),savedRoute,'in-place language change keeps current route');
      assert.deepEqual(await snapshot(),before,'in-place language change preserves writing evidence');
      assert.equal(await evaluate(`localStorage.getItem('${KEY}')`),storedBefore,'in-place language change leaves every stored writing byte unchanged');
      return;
    }
    if (await evaluate(`S.view==='writingCourse'`)) await tap('.wcTopline button[onclick="harumalWritingExit()"]', 0, 100);
    const selector = '.tqLang,#flagBtn';
    const index = await evaluate(`[...document.querySelectorAll(${JSON.stringify(selector)})].findIndex(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'})`);
    assert.ok(index >= 0, 'actual language picker is visible outside the writing screen');
    await tap(selector, index, 100);
    await tap(`.flagOpt[data-lang="${lang}"]`, 0, 100);
    assert.equal(await evaluate('S.lang'), lang, 'language-picker click changes the active locale');
    assert.equal(await evaluate(`JSON.parse(localStorage.getItem('topikQuestV8')).lang`), lang, 'locale selection is persisted');
    await route(savedRoute.page, savedRoute.itemId || savedRoute.groupId || savedRoute.nodeId || savedRoute.examId || savedRoute.levelId || '');
    assert.deepEqual(await snapshot(), before, 'changing the actual language setting preserves writing evidence');
  };
  const capture = async (lang, name) => {
    for (const theme of ['light','dark']) for (const width of [320,390]) {
      await setViewport(width,844);
      await evaluate(`malbitSetTheme('${theme}');scrollTo({top:0,left:0,behavior:'instant'})`);
      await sleep(60);
      await waitFor(`[...document.querySelectorAll('.wcScreen img')].every(img=>img.complete&&img.naturalWidth>0)`,`${lang} ${name}: illustration failed to load`);
      await assertScreen(`${lang} ${name} ${theme} ${width}`);
      if (name==='stage-done') await assertStageDone();
      assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
      await shot(`writing-locale-${lang}-${name}-${theme}-${width}.png`); screenshots++;
    }
  };
  try {
    // Seed one existing Korean feedback record and one old independent attempt.
    // Original bytes are restored in finally, including the recovery snapshot.
    await evaluate(`(()=>{setView('learn');S.lang='ko';save();const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},e=HARUMAL_WRITING_ENGINE.create(storage,HARUMAL_WRITING_DATA,()=>Date.now()-49*60*60*1000);e.submit('I01','공원이 넓어서 여기에서 산책해요.');e.submit('R01','일이 많아요서 늦게 퇴근해요.');e.setDraft('I02','의자가 편해서 여기에');e.route({page:'feedback',itemId:'R01'});localStorage.setItem('${KEY}',memory.get('${KEY}'))})()`);
    await send('Page.reload',{ignoreCache:true}); await ready();
    // Earn the completion screen through actual controls and real input events.
    // Browsing a stage-done URL alone cannot supply completion evidence.
    await route('course');
    await click('harumalWritingBegin()'); await expectRoute('item','P01');
    const probeItems = await evaluate(`HARUMAL_WRITING_DATA.groups.find(g=>g.id==='probe-basics').itemIds.map(id=>{const item=HARUMAL_WRITING_DATA.items.find(i=>i.id===id);return{id,kind:item.kind,answer:item.kind==='relation'?item.evaluation.correctChoiceId:item.models[0]}})`);
    assert.deepEqual(probeItems.map(item=>item.id),['P01','P02','P03','P04','P05','P06']);
    for (const item of probeItems) {
      await expectRoute('item',item.id);
      if (item.kind==='relation') {
        await tap(`.wcChoices label:has(input[value=${JSON.stringify(item.answer)}])`,0,100);
      } else {
        await tap('#wcAnswer',0,50);
        await evaluate(`document.querySelector('#wcAnswer').select()`);
        await send('Input.insertText',{text:item.answer});
      }
      await waitFor(`HARUMAL_WRITING.engine.draft(${JSON.stringify(item.id)}).text===${JSON.stringify(item.answer)}`,item.id+': actual input did not persist');
      await click(`harumalWritingSubmit('${item.id}')`); await expectRoute('feedback',item.id);
      assert.equal(await evaluate(`HARUMAL_WRITING.engine.getState().attempts.filter(a=>a.itemId===${JSON.stringify(item.id)}).length`),1,item.id+': exactly one submission');
      assert.equal(await evaluate(`HARUMAL_WRITING.engine.guidedProgress().unlockedIds.includes('form-aseo')`),false,'next stage stays locked until the stage review is confirmed');
      await click(`harumalWritingContinue('${item.id}')`);
    }
    await assertStageDone();
    assert.equal(await evaluate(`HARUMAL_WRITING.engine.guidedProgress().unlockedIds.includes('form-aseo')`),false,'completion review precedes the next-stage unlock');
    await click("harumalWritingContinue('probe-basics')"); await expectRoute('item','R01');
    assert.equal(await evaluate(`HARUMAL_WRITING.engine.guidedProgress().unlockedIds.includes('form-aseo')`),true,'confirming stage completion unlocks the next real stage');
    assert.equal(await evaluate(`HARUMAL_WRITING.engine.getState().attempts.length`),8,'six real probe answers and the two original fixture answers are retained');
    await route('course'); // End guided navigation before the read-only route audit.
    await route('feedback','R01');
    const persistedEvidence = await snapshot();
    const originalData = await evaluate('JSON.stringify(HARUMAL_WRITING_DATA)');
    for (const lang of ['ko','ja','en','zh']) {
      await switchWithPicker(lang);
      await assertScreen(lang + ' previously saved feedback');
      await send('Page.reload',{ignoreCache:true}); await ready();
      assert.equal(await evaluate('S.lang'), lang, 'locale survives reload');
      assert.deepEqual(await snapshot(), persistedEvidence, 'same saved Korean feedback survives language change and reload');
      await setViewport(320,844);
      const routes = await evaluate(`[['course',''],['map',''],['unit',''],['records',''],...['beginner','intermediate','advanced'].map(id=>['level',id]),...HARUMAL_WRITING.engine.guidedProgress().completedIds.map(id=>['stage-done',id]),...HARUMAL_WRITING_DATA.nodes.map(n=>['node',n.id]),...HARUMAL_WRITING_DATA.groups.map(g=>['group',g.id]),...HARUMAL_WRITING_DATA.items.map(i=>['item',i.id]),...[51,52,53,54].map(n=>['exam',String(n)])]`);
      for (const [page,id] of routes) { await route(page,id); await assertScreen(`${lang} ${page} ${id}`); if (page==='stage-done') await assertStageDone(); }
      for (const [name,page,id] of [['course','course',''],['input','item','R01'],['feedback','feedback','R01'],['stage-done','stage-done','probe-basics'],['records','records','']]) {
        await route(page,id); await capture(lang,name);
      }
      // Hidden support is part of the DOM scan; no independent/delayed model may leak.
      for (const id of ['I02','I03','D01','D02']) {
        await route('item',id);
        const leaks = await evaluate(`(()=>{const root=document.querySelector('.wcScreen'),item=HARUMAL_WRITING_DATA.items.find(i=>i.id==='${id}');return{models:item.models.filter(m=>root.textContent.includes(m)),modelComponent:!!root.querySelector('.wcModel'),lesson:!!root.querySelector('.wcPanel--mint'),facts:item.facts.every(f=>root.textContent.includes(f.ko))}})()`);
        assert.deepEqual(leaks.models, [], lang + ' ' + id + ': no model leaked before first submission');
        assert.equal(leaks.modelComponent, false); assert.equal(leaks.lesson, false); assert.equal(leaks.facts, true);
      }
      assert.deepEqual(await snapshot(), persistedEvidence, 'route audit does not manufacture or rewrite evidence');
      assert.equal(await evaluate('JSON.stringify(HARUMAL_WRITING_DATA)'), originalData, 'learning facts remain unchanged in every language');
      await route('feedback','R01');
    }
    assert.equal(screenshots,80,'4 locales × 5 states × 2 widths × 2 themes');
  } catch (error) { failure = error; throw error; }
  finally {
    try {
      const restored = await evaluate(`(()=>{stopTimer();S=JSON.parse(${JSON.stringify(original.state)});document.documentElement.dataset.theme=${JSON.stringify(original.theme)};history.replaceState(${JSON.stringify(original.history)},'');const before=${JSON.stringify(original.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(before,k))localStorage.removeItem(k);for(const [k,v]of Object.entries(before))localStorage.setItem(k,v);return Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]))})()`);
      assert.deepEqual(restored,original.storage,'localization journey restores all original storage bytes');
    } catch (error) { if (!failure) throw error; console.error('Writing localization cleanup also failed:',error.message); }
  }
  console.log(`Writing localization: all available routes in ko/ja/en/zh, real six-item guided journey and unlock, actual picker + reload, same saved evidence, Korean lesson text retained; screenshots=${screenshots}`);
}
