import assert from 'node:assert/strict';

// Disposable CI profile only. Never seed or restore a learner's live browser.
export async function verifyThreeTabRedesign({evaluate,tap,shot,setViewport,send,ready,sleep}) {
  assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
  assert.equal(await evaluate(`!!window.HARUMAL_HUB`),true,'new hub loaded');
  const before=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),history:history.state,theme:document.documentElement.dataset.theme})`);
  const reward=()=>evaluate(`JSON.stringify(HARUMAL_REWARDS.getState())`);
  const visible=selector=>evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});return !!e&&!e.hidden&&e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden'})()`);
  const dialog='#harumalSettingsDialog';
  const open=async()=>{await tap('.hubHomeHeader .harumalSettingsTrigger');assert.equal(await visible(dialog),true,'settings opens by gear')};
  const fit=async label=>{
    const result=await evaluate(`(()=>{const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};const c=document.querySelector('[data-hub-action="continue"]');const r=c?.getBoundingClientRect();const n=document.querySelector('.nav')?.getBoundingClientRect();return{overflow:document.documentElement.scrollWidth-innerWidth,nav:[...document.querySelectorAll('.nav button')].filter(visible).map(e=>e.id),cta:r?{top:r.top,bottom:r.bottom}:null,navTop:n?.top,oldLanguage:[...document.querySelectorAll('.tqLang,#flagBtn')].filter(visible).length,gear:[...document.querySelectorAll('.harumalSettingsTrigger')].filter(visible).map(e=>{const b=e.getBoundingClientRect(),s=e.querySelector('svg')?.getBoundingClientRect();return{width:b.width,height:b.height,svgWidth:s?.width,svgHeight:s?.height}}),broken:[...document.querySelectorAll('#screen img')].filter(visible).filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.src)}})()`);
    assert.ok(result.overflow<=1,label+' no horizontal overflow');
    assert.deepEqual(result.nav,['nav_home','nav_review','nav_vocab'],label+' exactly Learn / Review / Vocabulary');
    assert.equal(result.oldLanguage,0,label+' no persistent language shortcut');
    assert.equal(result.gear.length,1,label+' one visible settings gear');
    const gear=result.gear[0];assert.ok(gear.width>=44&&gear.height>=44,label+' gear has a full touch target');assert.equal(gear.svgWidth,24,label+' gear icon keeps its width');assert.equal(gear.svgHeight,24,label+' gear icon is square');
    assert.deepEqual(result.broken,[],label+' no broken visible images');
    if(result.cta){assert.ok(result.cta.top>=0&&result.cta.bottom<=result.navTop,label+' main lesson visible above navigation without scrolling')}
  };
  const flagsAndPalette=async(lang,label)=>{
    const names={ko:['한국어','일본어','영어','중국어'],ja:['韓国語','日本語','英語','中国語'],en:['Korean','Japanese','English','Chinese'],zh:['韩语','日语','英语','中文']};
    const result=await evaluate(`(()=>{const token=name=>{const e=document.createElement('span');e.style.color='var('+name+')';document.body.append(e);const c=getComputedStyle(e).color;e.remove();return c};return{flags:[...document.querySelectorAll('#harumalSettingsDialog [data-hub-language]')].map(e=>{const r=e.getBoundingClientRect(),f=e.querySelector('svg')?.getBoundingClientRect(),s=getComputedStyle(e),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return{id:e.dataset.hubLanguage,name:e.getAttribute('aria-label'),selected:e.getAttribute('aria-pressed'),width:r.width,height:r.height,left:r.left,right:r.right,hit:hit===e||e.contains(hit),svg:f?{width:f.width,height:f.height}:null,bg:s.backgroundColor,border:s.borderTopColor}}),accent:token('--ui-accent'),selected:token('--ui-accent-soft'),surface:token('--ui-surface'),border:token('--ui-border'),width:innerWidth}})()`);
    assert.deepEqual(result.flags.map(f=>f.id),['ko','ja','en','zh'],label+' four SVG flags');
    assert.deepEqual(result.flags.map(f=>f.name),names[lang],label+' localized flag accessible names');
    assert.deepEqual(result.flags.filter(f=>f.selected==='true').map(f=>f.id),[lang],label+' current language selected');
    for(const f of result.flags){assert.ok(f.hit&&f.width>=44&&f.height>=44&&f.left>=0&&f.right<=result.width,label+' visible clickable flag '+f.id);assert.ok(f.svg?.width===30&&f.svg?.height===20,label+' stable vector flag '+f.id);assert.equal(f.bg,f.selected==='true'?result.selected:result.surface,label+' theme-aware flag surface');assert.equal(f.border,f.selected==='true'?result.accent:result.border,label+' theme-aware flag border')}
  };
  let failed;
  try {
    await evaluate(`stopTimer();setView('home')`);
    const initialReward=await reward();
    for(const lang of ['ko','ja','en','zh']) for(const theme of ['light','dark']) for(const width of [320,390]) {
      await setViewport(width,844);await evaluate(`setLang('${lang}');malbitSetTheme('${theme}');setView('home');window.scrollTo(0,0)`);await sleep(70);
      await fit(`${lang} ${theme} ${width} home`);await shot(`redesign-home-${lang}-${theme}-${width}.png`);
      for(const id of ['nav_review','nav_vocab','nav_home']) {await tap('#'+id);await fit(`${lang} ${theme} ${width} ${id}`)}
      await open();await flagsAndPalette(lang,`${lang} ${theme} ${width}`);await shot(`redesign-settings-${lang}-${theme}-${width}.png`);
      const dimensions=await evaluate(`(()=>{const d=document.querySelector('${dialog}');const r=d.getBoundingClientRect();return{overflow:d.scrollWidth-d.clientWidth,left:r.left,right:r.right,role:d.getAttribute('role'),modal:d.getAttribute('aria-modal')}})()`);
      assert.ok(dimensions.overflow<=1&&dimensions.left>=-1&&dimensions.right<=width+1,'settings fits '+lang+width);
      assert.equal(dimensions.role,'dialog');assert.equal(dimensions.modal,'true');
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await sleep(100);
      assert.equal(await visible(dialog),false,'Escape dismisses settings');
      assert.equal(await evaluate(`S.view`),'home','settings dismissal preserves learning view');
    }
    await evaluate(`setLang('ko');malbitSetTheme('light');setView('home')`);await setViewport(320,606);
    await evaluate(`window.scrollTo(0,0)`);await fit('short 320x606 home');await shot('redesign-home-ko-light-320x606.png');
    await setViewport(390,844);
    for(const [action,view] of [['profile','profile'],['path','courseMap'],['practice','practiceHub']]) {
      await tap(`[data-hub-action="${action}"]`);assert.equal(await evaluate(`S.view`),view,action+' route reachable');await fit(action);await shot(`redesign-${view}-ko-390.png`);await tap('#nav_home');
    }
    await open();await tap('[data-hub-action="close-settings"]');await sleep(120);assert.equal(await visible(dialog),false,'explicit close dismisses');
    await open();await tap('[data-hub-language="en"]');await sleep(120);await flagsAndPalette('en','changed language');
    assert.equal(await evaluate(`S.lang`),'en','settings language selector changes actual explanation language');
    assert.equal(await visible(dialog),true,'language change keeps settings open');
    assert.equal(await evaluate(`document.querySelector('#harumalSettingsDialog').contains(document.activeElement)`),true,'focus remains inside settings after rebuild');
    await evaluate(`history.back()`);await sleep(180);assert.equal(await visible(dialog),false,'browser Back closes settings');assert.equal(await evaluate(`S.view`),'home','Back does not leave learning home');
    assert.equal(await evaluate(`document.activeElement.matches('.harumalSettingsTrigger')&&document.activeElement.getClientRects().length>0`),true,'dismiss after language rebuild restores focus to visible gear');
    await open();
    const outside=await evaluate(`(()=>{const s=document.querySelector('.hubSettingsSheet').getBoundingClientRect();return {x:innerWidth/2,y:Math.max(1,s.top/2),available:s.top>4}})()`);
    assert.equal(outside.available,true,'mobile sheet leaves a dismissible backdrop');
    await send('Input.dispatchMouseEvent',{type:'mousePressed',x:outside.x,y:outside.y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:outside.x,y:outside.y,button:'left',clickCount:1});await sleep(180);
    assert.equal(await visible(dialog),false,'outside tap closes settings');
    await evaluate(`setView('more')`);assert.equal(await visible(dialog),true,'legacy settings route still opens settings');
    await tap('[data-hub-action="close-settings"]');await sleep(160);await evaluate(`render()`);assert.equal(await visible(dialog),false,'dismissed legacy settings route must not reopen on render');
    await open();await send('Page.reload',{ignoreCache:true});await ready();assert.equal(await visible(dialog),false,'reload does not reopen transient settings');
    await tap('[data-hub-action="continue"]');assert.notEqual(await evaluate(`S.view`),'home','one primary button starts learning');assert.equal(await visible(dialog),false,'closed dialog cannot intercept lesson');
    await evaluate(`stopTimer();setView('home')`);
    assert.equal(await reward(),initialReward,'navigation, settings, and lesson entry never mint rewards');
    console.log('Three-tab QA: 4 languages, 2 themes, 320/390 widths, short 606px home, settings Escape/close/reload, profile/path/practice routes, primary lesson entry, no navigation rewards passed.');
  } catch(error) {failed=error;throw error} finally {
    try {
      await evaluate(`(()=>{HARUMAL_HUB.closeSettings();stopTimer();const saved=${JSON.stringify(before.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(saved,k))localStorage.removeItem(k);for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);S=JSON.parse(${JSON.stringify(before.state)});document.documentElement.dataset.theme=${JSON.stringify(before.theme)};history.replaceState(${JSON.stringify(before.history)},'')})()`);
      await send('Page.reload',{ignoreCache:true});await ready();
    } catch(error) {if(!failed)throw error}
  }
}
