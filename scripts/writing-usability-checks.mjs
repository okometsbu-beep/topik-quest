import assert from 'node:assert/strict';

// Remote CI integration only: the caller owns a disposable Chrome profile at its
// loopback test origin. Never run the fixture against a public or learner origin.
// Keyboard checks emulate visualViewport resize; they do not certify a real IME.
export async function verifyWritingUsability({ evaluate, tap, shot, setViewport, send, ready, sleep }) {
  const KEY = 'harumalWritingCurriculumV1';
  const locales = ['ko', 'ja', 'en', 'zh'], themes = ['light', 'dark'], widths = [320, 375, 390, 430];
  assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`), true, 'writing usability fixtures require the disposable loopback CI origin');
  assert.equal(await evaluate(`typeof HARUMAL_WRITING?.updateActionLayout`), 'function', 'writing layout runtime loaded');
  const original = await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),history:history.state,theme:document.documentElement.dataset.theme})`);
  let screenshots = 0, failure;
  const route = (page, id = '') => evaluate(`harumalWritingGo(${JSON.stringify(page)},${JSON.stringify(id)})`);
  const state = () => evaluate('HARUMAL_WRITING.engine.getState()');
  const snapshot = () => evaluate(`(()=>{const s=HARUMAL_WRITING.engine.getState();return{attempts:s.attempts,drafts:s.drafts,readiness:s.readiness,firstIndependentAt:s.firstIndependentAt,guided:s.guided}})()`);
  const click = action => tap(`.wcScreen button[onclick=${JSON.stringify(action)}]`, 0, 100);
  const expectRoute = async (page, id) => {
    const actual = (await state()).route;
    assert.equal(await evaluate('S.view'), 'writingCourse');
    assert.equal(actual.page, page, 'actual writing page');
    if (id) assert.equal(actual.itemId || actual.groupId || actual.attemptId, id, 'actual route identity');
  };
  const waitFor = async (expression, label) => {
    for (let attempt = 0; attempt < 60; attempt++) { if (await evaluate(expression)) return; await sleep(50); }
    assert.fail(label);
  };
  const readLegacy = () => evaluate(`(()=>{
    const core=JSON.parse(localStorage.getItem('topikQuestV8'));
    delete core.view;delete core.lang;delete core.transCache;
    const roots=Object.fromEntries(MALBIT_STORAGE_GUARD.durableKeys.filter(k=>!['topikQuestV8','${KEY}','malbitJourneyEventsV1','harumalRewardsV1'].includes(k)).map(k=>[k,localStorage.getItem(k)]));
    if(roots.malbitProductPrefsV1){const p=JSON.parse(roots.malbitProductPrefsV1);delete p.theme;roots.malbitProductPrefsV1=JSON.stringify(p)}
    return{core,roots};
  })()`);
  const settingsLanguage = '#harumalSettingsDialog select[onchange="malbitSetLanguage(this.value)"]';
  const openLanguageSettings = async () => {
    const index=await evaluate(`[...document.querySelectorAll('.harumalSettingsTrigger')].findIndex(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden'})`);
    assert.ok(index>=0,'writing settings gear is visible');
    await tap('.harumalSettingsTrigger',index,100);
    await waitFor(`!!document.querySelector(${JSON.stringify(settingsLanguage)})`,'settings language picker exists');
  };
  const assertLanguagePicker = async () => {
    const value=await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(settingsLanguage)}),r=el.getBoundingClientRect(),s=getComputedStyle(el),ctx=document.createElement('canvas').getContext('2d');ctx.font=s.font||s.fontSize+' '+s.fontFamily;const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return{value:el.value,label:el.selectedOptions[0]?.textContent,width:r.width,height:r.height,left:r.left,right:r.right,viewport:innerWidth,hit:hit===el||el.contains(hit),labelWidth:ctx.measureText(el.selectedOptions[0]?.textContent||'').width,available:r.width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-parseFloat(s.borderLeftWidth)-parseFloat(s.borderRightWidth)-(s.appearance==='none'?0:20)}})()`);
    assert.ok(value.width>=44&&value.height>=44&&value.hit,'settings language picker is visible and clickable');
    assert.ok(value.left>=0&&value.right<=value.viewport,'settings language picker fits viewport');
    assert.ok(value.available>=value.labelWidth-1,'full selected language label fits '+JSON.stringify(value));
    return value;
  };
  const selectLanguage = async lang => {
    const before = await snapshot(),savedRoute=(await state()).route;
    await openLanguageSettings();
    await tap(settingsLanguage,0,50);
    const key=async(key,code,n)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:n});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:n})};
    await key('Home','Home',36);
    for(let i=0;i<locales.indexOf(lang);i++)await key('ArrowDown','ArrowDown',40);
    await key('Enter','Enter',13);
    await waitFor(`S.lang===${JSON.stringify(lang)}`,'settings picker changes the language');
    assert.equal((await assertLanguagePicker()).value,lang);
    await tap('[data-hub-action="close-settings"]',0,100);
    assert.equal(await evaluate(`JSON.parse(localStorage.getItem('topikQuestV8')).lang`), lang);
    assert.deepEqual((await state()).route,savedRoute,'language selection preserves the writing route');
    assert.deepEqual(await snapshot(), before, 'language selection preserves attempts, drafts and guided pointer');
  };
  const fill = async (id, text) => {
    await tap('#wcAnswer', 0, 40);
    await evaluate(`document.querySelector('#wcAnswer').select()`);
    await send('Input.insertText', { text });
    await waitFor(`HARUMAL_WRITING.engine.draft(${JSON.stringify(id)}).text===${JSON.stringify(text)}`, id + ': real typing must save the draft');
  };
  const inspectAction = () => evaluate(`(()=>{
    const root=document.querySelector('.wcScreen'),bars=[...root.querySelectorAll('.wcPrimaryAction')],bar=bars[0],button=bar?.querySelector('button'),nav=document.querySelector('.nav');
    if(!bar||!button||!nav)return{missing:true,count:bars.length};
    const rect=el=>{const r=el.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}},b=rect(bar),a=rect(button),n=rect(nav),hit=document.elementFromPoint(a.left+a.width/2,a.top+a.height/2),style=getComputedStyle(bar),v=window.visualViewport;
    return{missing:false,count:bars.length,position:style.position,bar:b,button:a,nav:n,navDisplay:getComputedStyle(nav).display,navVisibility:getComputedStyle(nav).visibility,innerWidth,innerHeight,viewport:{height:v?.height||innerHeight,offsetTop:v?.offsetTop||0},hit:hit===button||button.contains(hit),overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth,root.scrollWidth)-innerWidth,space:parseFloat(getComputedStyle(root).paddingBottom),theme:document.documentElement.dataset.theme};
  })()`);
  const assertAction = async (label, { keyboard = false, theme } = {}) => {
    const value = await inspectAction();
    assert.equal(value.missing, false, label + ': action, button and navigation exist');
    assert.equal(value.count, 1, label + ': exactly one primary action bar');
    assert.equal(value.position, 'fixed', label + ': action stays fixed');
    assert.ok(value.button.width >= 44 && value.button.height >= 44, label + ': usable touch target');
    assert.ok(value.bar.left >= -1 && value.bar.right <= value.innerWidth + 1, label + ': action fits the width');
    assert.ok(value.bar.top >= -1 && value.bar.bottom <= value.innerHeight + 1, label + ': action visible in initial viewport');
    assert.equal(value.hit, true, label + ': action is not covered by navigation or another layer');
    assert.ok(value.overflow <= 1, label + ': no horizontal overflow ' + JSON.stringify(value));
    assert.ok(value.space >= value.bar.height, label + ': content reserves at least the complete action height');
    if (theme) assert.equal(value.theme, theme);
    if (keyboard) {
      assert.ok(value.navDisplay === 'none' || value.navVisibility === 'hidden', label + ': bottom navigation does not compete with the keyboard');
      assert.ok(value.bar.bottom <= value.viewport.height + value.viewport.offsetTop + 1, label + ': action is above the simulated keyboard');
    } else {
      assert.ok(value.nav.height > 0, label + ': normal navigation remains visible');
      assert.ok(value.bar.bottom <= value.nav.top + 1, label + ': action is above bottom navigation');
    }
    return value;
  };
  const assertHeading = async id => {
    const result = await evaluate(`(()=>{const h=document.querySelector('.wcHeading h1'),div=document.createElement('div');div.innerHTML=HARUMAL_WRITING.localeText('두 사실의 뜻을<br>그대로 이어 써요');return{heading:h?.textContent,generic:div.textContent,prompt:document.querySelector('#wcPrompt')?.textContent,expected:HARUMAL_WRITING.localeText(HARUMAL_WRITING.engine.itemById(${JSON.stringify(id)}).promptKo),choices:!!document.querySelector('.wcChoices'),textarea:!!document.querySelector('#wcAnswer')}})()`);
    assert.ok(result.heading);
    assert.notEqual(result.heading, result.generic, `${id}: probe task must not tell the learner to connect two sentences`);
    assert.equal(result.prompt, result.expected);
    assert.equal(result.choices, ['P03', 'P04', 'P05'].includes(id));
    assert.equal(result.textarea, ['P01', 'P02', 'P06'].includes(id));
    return result.heading;
  };
  const assertAssessment = async label => {
    const value = await evaluate(`(()=>{const details=document.querySelector('.wcAssessmentDetails'),note=document.querySelector('.wcAssessmentNote');return{details:!!details,open:details?.open,summary:!!details?.querySelector('summary'),long:details?.textContent.includes(HARUMAL_WRITING.localeText('자동 규칙 확인, 자기점검, 사람의 의미 검토를 구분해요. 전체 문장의 정답이나 숙달 판정이 아니에요.')),note:note?.textContent,hidden:!note||!!note.closest('details:not([open])')||getComputedStyle(note).display==='none',meaning:HARUMAL_WRITING.engine.evidence().meaningReviewed}})()`);
    assert.equal(value.details, true, label + ': assessment explanation is available');
    assert.equal(value.open, false, label + ': long explanation starts collapsed');
    assert.equal(value.summary, true); assert.equal(value.long, true);
    assert.ok(value.note?.trim()); assert.equal(value.hidden, false, label + ': uncertainty note stays visible');
    assert.equal(value.meaning, 0, label + ': no automatic semantic mastery');
  };
  const capture = async (name, { itemId, feedback = false } = {}) => {
    for (const lang of locales) {
      await selectLanguage(lang);
      for (const theme of themes) for (const width of widths) {
        const label = `${name} ${lang} ${theme} ${width}`;
        await setViewport(width, 844);
        await evaluate(`malbitSetTheme('${theme}');scrollTo({top:0,left:0,behavior:'instant'})`);
        await sleep(100);
        if(name==='feedback'){await openLanguageSettings();await assertLanguagePicker();await shot(`writing-settings-${lang}-${theme}-${width}.png`);await tap('[data-hub-action="close-settings"]',0,100)}
        await waitFor(`[...document.querySelectorAll('.wcScreen img')].every(img=>img.complete&&img.naturalWidth>0)`, label + ': illustration failed to load');
        if (itemId) await assertHeading(itemId);
        if (feedback) await assertAssessment(label);
        await assertAction(label, { theme });
        await shot(`writing-usability-${name}-${lang}-${theme}-${width}.png`); screenshots++;
        await evaluate(`scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`); await sleep(40);
        const action = await assertAction(label + ' scrolled', { theme });
        const bottom = await evaluate(`(()=>{const root=document.querySelector('.wcScreen'),nodes=[...root.querySelectorAll('button,summary,textarea,.wcChoices label')].filter(node=>!node.closest('.wcPrimaryAction')&&node.getClientRects().length>0);return nodes.length?Math.max(...nodes.map(node=>node.getBoundingClientRect().bottom)):0})()`);
        assert.ok(bottom <= action.bar.top + 1, label + ': final content scrolls clear of the fixed action');
      }
    }
  };
  const restoreViewport = () => evaluate(`(()=>{const fixture=window.__writingViewportFixture;if(!fixture)return;for(const[key,descriptor]of Object.entries(fixture.descriptors)){if(descriptor)Object.defineProperty(visualViewport,key,descriptor);else delete visualViewport[key]}delete window.__writingViewportFixture;document.querySelector('#wcAnswer')?.blur();visualViewport.dispatchEvent(new Event('resize'));HARUMAL_WRITING.updateActionLayout()})()`);
  const keyboardMatrix = async () => {
    for (const lang of locales) {
      await selectLanguage(lang);
      for (const theme of themes) for (const width of widths) {
        const label = `keyboard emulation ${lang} ${theme} ${width}`;
        await setViewport(width, 844); await evaluate(`malbitSetTheme('${theme}')`);
        await fill('P01', '도서관에서 공부하고 있어요.');
        try {
          await evaluate(`(()=>{const v=visualViewport;if(!v)throw Error('visualViewport unavailable');window.__writingViewportFixture={descriptors:Object.fromEntries(['height','offsetTop'].map(key=>[key,Object.getOwnPropertyDescriptor(v,key)]))};Object.defineProperty(v,'height',{configurable:true,get:()=>420});Object.defineProperty(v,'offsetTop',{configurable:true,get:()=>0});v.dispatchEvent(new Event('resize'))})()`);
          await sleep(180);
          const action = await assertAction(label, { keyboard: true, theme });
          const input = await evaluate(`(()=>{const field=document.querySelector('#wcAnswer'),r=field.getBoundingClientRect();return{focused:document.activeElement===field,top:r.top,bottom:r.bottom,text:field.value,keyboard:document.body.classList.contains('wcKeyboardOpen'),attempts:HARUMAL_WRITING.engine.getState().attempts.length}})()`);
          assert.equal(input.keyboard, true, label + ': viewport resize activates keyboard-safe layout');
          assert.equal(input.focused, true, label + ': typing focus stays in the answer');
          assert.ok(input.top >= -1 && input.bottom <= action.bar.top + 1, label + ': typed field is not obscured ' + JSON.stringify({ input, action }));
          assert.equal(input.text, '도서관에서 공부하고 있어요.'); assert.equal(input.attempts, 0, label + ': typing is not submission');
          await shot(`writing-usability-keyboard-${lang}-${theme}-${width}.png`); screenshots++;
        } finally { await restoreViewport(); await sleep(80); }
        assert.equal(await evaluate(`document.body.classList.contains('wcKeyboardOpen')`), false, label + ': closing keyboard restores navigation layout');
        await assertAction(label + ' closed', { theme });
      }
    }
  };

  try {
    await evaluate(`(()=>{setView('learn');S.lang='ko';save();const memory=new Map(),storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value)},engine=HARUMAL_WRITING_ENGINE.create(storage,HARUMAL_WRITING_DATA);engine.route({page:'course'});localStorage.setItem('${KEY}',memory.get('${KEY}'))})()`);
    await send('Page.reload', { ignoreCache: true }); await ready();
    const legacy = await readLegacy();
    await route('course'); await click('harumalWritingBegin()'); await expectRoute('item', 'P01');
    const headings = {};
    for (const lang of locales) { await selectLanguage(lang); headings[lang] = { P01: await assertHeading('P01') }; }
    await keyboardMatrix();
    await evaluate(`window.__writingUsabilitySubmit=document.querySelector('.wcPrimaryAction button')`);
    await click("harumalWritingSubmit('P01')");
    await evaluate(`window.__writingUsabilitySubmit.click();delete window.__writingUsabilitySubmit`);
    await expectRoute('feedback', 'P01');
    let saved = await state();
    assert.equal(saved.attempts.length, 1, 'repeated submit click stores one attempt');
    assert.equal(saved.attempts[0].evaluation.status, 'components_observed', 'positive present progressive is accepted conservatively');
    assert.equal(saved.attempts[0].evaluation.meaning, 'unreviewed');
    await capture('feedback', { feedback: true });
    await click("harumalWritingContinue('P01')"); await expectRoute('item', 'P02');
    await fill('P02', '일이 많아요. 늦게 퇴근해요.');
    await capture('p02-input', { itemId: 'P02' });
    for (const lang of locales) { await selectLanguage(lang); headings[lang].P02 = await assertHeading('P02'); assert.notEqual(headings[lang].P01, headings[lang].P02); }
    const draft = await snapshot(); await send('Page.reload', { ignoreCache: true }); await ready();
    await expectRoute('item', 'P02'); assert.deepEqual(await snapshot(), draft, 'keyboard-safe UI keeps exact draft and guided position across reload');
    assert.equal(await evaluate(`document.querySelector('#wcAnswer').value`), '일이 많아요. 늦게 퇴근해요.');
    const probe = await evaluate(`HARUMAL_WRITING_DATA.groups[0].itemIds.slice(1).map(id=>{const item=HARUMAL_WRITING.engine.itemById(id);return{id,kind:item.kind,answer:item.kind==='relation'?item.evaluation.correctChoiceId:item.models[0]}})`);
    for (const item of probe) {
      await expectRoute('item', item.id);
      for (const lang of locales) { await selectLanguage(lang); headings[lang][item.id] = await assertHeading(item.id); }
      if (item.kind === 'relation') await tap(`.wcChoices label:has(input[value=${JSON.stringify(item.answer)}])`, 0, 80);
      else await fill(item.id, item.answer);
      await click(`harumalWritingSubmit('${item.id}')`); await expectRoute('feedback', item.id);
      await assertAssessment(item.id + ' feedback');
      assert.equal(await evaluate(`HARUMAL_WRITING.engine.guidedProgress().unlockedIds.includes('form-aseo')`), false);
      await click(`harumalWritingContinue('${item.id}')`);
    }
    for (const lang of locales) { assert.notEqual(headings[lang].P02, headings[lang].P03); assert.notEqual(headings[lang].P01, headings[lang].P06); }
    await expectRoute('stage-done', 'probe-basics');
    await capture('stage-done');
    assert.equal(await evaluate(`HARUMAL_WRITING.engine.guidedProgress().unlockedIds.includes('form-aseo')`), false);
    await click("harumalWritingContinue('probe-basics')"); await expectRoute('item', 'R01');
    assert.equal(await evaluate(`HARUMAL_WRITING.engine.guidedProgress().unlockedIds.includes('form-aseo')`), true);

    // Construct the bounded completed-course fixture with real engine submissions
    // and confirms, preserving the six actual UI answers above. This avoids
    // fabricating unlocks and does not replace any other learner-storage root.
    const latest = await evaluate(`(()=>{const e=HARUMAL_WRITING.engine;for(const g of HARUMAL_WRITING_DATA.groups.filter(g=>!g.delayedOnly).slice(1)){for(const id of g.itemIds){const i=e.itemById(id);e.submit(id,i.kind==='relation'?i.evaluation.correctChoiceId:i.models[0]);e.setGuidedRoute({page:'feedback',itemId:id});e.continueGuided(id)}e.continueGuided(g.id)}const last=e.submit('P01','저는 지금 도서관에서 공부하고 있어요.').attempt;harumalWritingGo('course');return last})()`);
    assert.equal(await evaluate(`HARUMAL_WRITING.engine.guidedProgress().complete`), true);
    const completed = await snapshot();
    await click('harumalWritingLastAnswer()'); await expectRoute('answer', latest.id);
    assert.deepEqual(await snapshot(), completed, 'last-answer access does not mutate drafts, attempts, self-checks or progress');
    for (const lang of locales) {
      await selectLanguage(lang); await setViewport(320, 844); await evaluate(`scrollTo({top:0,behavior:'instant'})`); await sleep(60);
      const answer = await evaluate(`(()=>{const panel=document.querySelector('[data-attempt-id]'),r=panel?.getBoundingClientRect();return{id:panel?.dataset.attemptId,text:panel?.textContent,top:r?.top,stats:!!document.querySelector('.wcEvidenceCards')}})()`);
      assert.equal(answer.id, latest.id); assert.ok(answer.text.includes(latest.text)); assert.equal(answer.stats, false);
      assert.ok(answer.top >= 0 && answer.top < 844, 'latest answer is directly reachable near the top');
      await shot(`writing-usability-last-answer-${lang}-320.png`); screenshots++;
    }
    await send('Page.reload', { ignoreCache: true }); await ready(); await expectRoute('answer', latest.id);
    assert.equal(await evaluate(`document.querySelector('[data-attempt-id]')?.dataset.attemptId`), latest.id, 'exact saved attempt survives reload');
    assert.deepEqual(await snapshot(), completed);
    await route('records'); await evaluate('history.back()');
    await waitFor(`HARUMAL_WRITING.engine.getState().route.page==='answer'&&HARUMAL_WRITING.engine.getState().route.attemptId===${JSON.stringify(latest.id)}`, 'Back restores exact saved-answer route');
    assert.deepEqual(await snapshot(), completed);
    assert.deepEqual(await readLegacy(), legacy, 'writing fixes preserve older vocabulary, favorites, SRS, exams, game, review, travel and other durable records');
    assert.equal(screenshots, 132, '3 action states × 32 combinations + 32 simulated-keyboard states + 4 saved-answer screenshots');
  } catch (error) { failure = error; throw error; }
  finally {
    try {
      await restoreViewport();
      const restored = await evaluate(`(()=>{stopTimer();S=JSON.parse(${JSON.stringify(original.state)});document.documentElement.dataset.theme=${JSON.stringify(original.theme)};history.replaceState(${JSON.stringify(original.history)},'');const before=${JSON.stringify(original.storage)};for(const key of Object.keys(localStorage))if(!Object.hasOwn(before,key))localStorage.removeItem(key);for(const[key,value]of Object.entries(before))localStorage.setItem(key,value);delete window.__writingUsabilitySubmit;return Object.fromEntries(Object.keys(localStorage).map(key=>[key,localStorage.getItem(key)]))})()`);
      assert.deepEqual(restored, original.storage, 'usability helper restores all original CI storage bytes');
    } catch (error) { if (!failure) throw error; console.error('Writing usability cleanup also failed:', error.message); }
  }
  console.log(`Writing usability: positive progressive, task-specific headings, 320/375/390/430px × light/dark × ko/ja/en/zh fixed controls, simulated visualViewport keyboard, compact feedback, exact latest answer, preserved evidence/storage; screenshots=${screenshots}; physical keyboards not tested`);
}
