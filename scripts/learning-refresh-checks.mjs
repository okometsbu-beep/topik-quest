import assert from 'node:assert/strict';

// Isolated CI browser only: real shipped audio, explicitly mocked device speech.
export async function verifyLearningRefresh({evaluate,tap,shot,setViewport,send,ready,sleep}) {
  assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
  const before=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),theme:document.documentElement.dataset.theme})`);
  const wait=async(expression,label)=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await sleep(100)}assert.fail(label)};
  try {
    await evaluate(`(()=>{stopTimer();setView('home');window.__refreshNativeAudio=window.Audio;window.__refreshAudio=[];window.Audio=function(...args){const a=new __refreshNativeAudio(...args),record={audio:a};__refreshAudio.push(record);a.addEventListener('ended',()=>record.ended=true);a.addEventListener('error',()=>record.error=true);a.addEventListener('playing',()=>{record.started=true;record.url=a.src;record.rate=a.playbackRate});return a};window.__refreshSpeak=speechSynthesis.speak;window.__refreshCancel=speechSynthesis.cancel;window.__refreshSpeech=[];speechSynthesis.speak=function(u){__refreshSpeech.push(u);u.onstart?.()};speechSynthesis.cancel=function(){};malbitTtsSetRate(.73);HARUMAL_HUB.openSettings();document.querySelector('.malbitTtsSetting').closest('details').open=true})()`);
    for(const voice of ['F1','M1']) {
      await tap(`[data-tts-recorded-voice="${voice}"]`,0,70);
      await wait(`__refreshAudio.some(r=>r.started&&r.url.includes('/${voice}/'))`,voice+' real preview starts');
      const audio=await evaluate(`(()=>{const r=__refreshAudio.findLast(r=>r.started);return{url:r.url,rate:r.rate,text:document.querySelector('.malbitTtsTranscript').textContent}})()`);
      assert.match(audio.url,new RegExp(`/audio/listening/v1/${voice}/0b2c5059104c9824\\.mp3$`));
      assert.equal(audio.rate,.73,'preview honors exact saved settings speed');assert.match(audio.text,/주말에 뭐 했어요/);
      await wait(`!HARUMAL_LISTENING_PLAYER.busy('settings-preview')`,'real preview completes');
      assert.equal(await evaluate(`__refreshAudio.findLast(r=>r.url?.includes('/${voice}/'))?.ended`),true,'sample ends successfully');
      assert.equal(await evaluate(`__refreshAudio.some(r=>r.error)`),false,'no MP3 playback errors');
    }
    await evaluate(`window.__refreshCorrected=HARUMAL_LISTENING_PLAYER.preview([{url:'audio/listening/v1/M1/25cc82b759911d41.mp3'}]);void 0`);
    await wait(`__refreshAudio.at(-1)?.started&&__refreshAudio.at(-1).audio.currentTime>0`,'corrected Korean recording decodes and advances');
    assert.ok(await evaluate(`__refreshAudio.at(-1).audio.duration>20&&__refreshAudio.at(-1).audio.duration<23`),'corrected recording has real metadata');
    assert.equal(await evaluate(`__refreshAudio.at(-1).rate`),.73);
    await evaluate(`HARUMAL_LISTENING_PLAYER.cancel()`);
    assert.deepEqual(await evaluate(`__refreshCorrected.then(r=>({started:r.started,cancelled:r.cancelled}))`),{started:true,cancelled:true});
    await evaluate(`window.__refreshFirst=malbitTtsPreview();window.__refreshSecond=malbitTtsPreview();void 0`);
    assert.equal(await evaluate(`__refreshFirst.then(r=>r.cancelled)`),true,'new preview cancels earlier request');
    await wait(`__refreshAudio.at(-1)?.started===true`,'replacement preview actually starts before closing');
    await tap('[data-hub-action="close-settings"]',0,80);
    await wait(`!history.state?.harumalSettings`,'settings history entry has closed');
    assert.equal(await evaluate(`__refreshAudio.at(-1).audio.paused`),true,'dismissed audio is paused');
    assert.equal(await evaluate(`__refreshSecond.then(r=>r.cancelled)`),true,'settings close cancels preview');
    await evaluate(`window.__refreshRead1=MALBIT_TTS.play('급격히');void 0`);
    await wait(`__refreshSpeech.length>0`,'short read reaches device voice');
    assert.equal(await evaluate(`__refreshSpeech.at(-1).rate`),.73,'short read uses exact settings speed');
    assert.equal(await evaluate(`!!document.getElementById('deviceSpeechPlayer')`),false,'short read never opens speed popup');
    await evaluate(`window.__refreshRead2=MALBIT_TTS.play('중단');void 0`);
    assert.equal(await evaluate(`__refreshRead1.then(r=>r.cancelled)`),true,'repeat read cancels old speech');
    await evaluate(`setView('vocab')`);
    assert.equal(await evaluate(`__refreshRead2.then(r=>r.cancelled)`),true,'navigation cancels short read');
    assert.equal(await evaluate(`!!document.getElementById('deviceSpeechPlayer')`),false);
    await evaluate(`setView('home');HARUMAL_HUB.openSettings();document.querySelector('.malbitTtsSetting').closest('details').open=true`);
    for(const lang of ['ko','ja','en','zh'])for(const theme of ['light','dark']) {
      await setViewport(320,844);await evaluate(`setLang('${lang}');malbitSetTheme('${theme}');document.querySelector('.malbitTtsSetting').closest('details').open=true;document.querySelector('.malbitTtsSetting').scrollIntoView({block:'start',behavior:'auto'})`);await sleep(60);
      const fit=await evaluate(`(()=>{const p=document.querySelector('.malbitTtsSetting');return{overflow:p.scrollWidth-p.clientWidth,labels:[...p.querySelectorAll('[data-tts-recorded-voice]')].map(e=>e.getAttribute('aria-label')||e.textContent.trim()),blue:[...p.querySelectorAll('button')].filter(e=>e.getClientRects().length).map(e=>getComputedStyle(e).backgroundColor)}})()`);
      assert.ok(fit.overflow<=1,lang+theme+' settings fit');assert.ok(fit.labels.every(Boolean));assert.ok(!fit.blue.includes('rgb(19, 43, 72)'),'legacy navy preview removed');await shot(`refresh-audio-settings-${lang}-${theme}-320.png`);
    }
    await evaluate(`HARUMAL_HUB.closeSettings()`);await wait(`!history.state?.harumalSettings`,'settings closed before beginner checks');
    console.log('Learning refresh audio QA: actual F1/M1 sample, exact 0.73 rate, repeat/close/navigation cancellation, no short-read popup, four-language light/dark settings.');
    await evaluate(`(()=>{const p=JSON.parse(localStorage.getItem('malbitBeginnerV1')||'{}');p.known=['c:ㄱ'];p.quiz=7;p.correct=3;p.legacyRefreshMarker=19;delete p.readingV2;delete p.blocksV1;localStorage.setItem('malbitBeginnerV1',JSON.stringify(p));setView('beginner');malbitBeginnerTab('consonants')})()`);
    assert.deepEqual(await evaluate(`Object.fromEntries(Object.entries(HARUMAL_BEGINNER.inventory).map(([k,v])=>[k,v.length]))`),{basicVowels:10,furtherVowels:11,basicConsonants:14,doubleConsonants:5});
    assert.equal(await evaluate(`document.querySelectorAll('.hbLetterName').length`),19);
    assert.deepEqual(await evaluate(`new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve([img.naturalWidth,img.naturalHeight]);img.onerror=()=>reject(new Error('Beginner sprite failed to load'));img.src='assets/art/beginner/beginner-objects-sprite-v1.png'})`),[1448,1086],'generated picture sprite loads in browser');
    assert.match(await evaluate(`document.querySelector('.hbLetterName').textContent`),/기역/);
    await tap('.hbLetterName',0,50);assert.equal(await evaluate(`__refreshSpeech.at(-1).text`),'기역','name button speaks the actual consonant name');
    await tap('.hbLetterSound',0,50);assert.equal(await evaluate(`__refreshSpeech.at(-1).text`),'가','sound button is a separate syllable example');
    await evaluate(`MALBIT_TTS.cancel();malbitBeginnerTab('vowels')`);assert.equal(await evaluate(`document.querySelectorAll('.hbLetterName').length`),21);
    for(const lang of ['ko','ja','en','zh'])for(const theme of ['light','dark'])for(const width of [320,390]) {
      await setViewport(width,844);await evaluate(`setLang('${lang}');malbitSetTheme('${theme}');setView('beginner');malbitBeginnerTab('consonants');scrollTo(0,0)`);await sleep(50);
      const fit=await evaluate(`(()=>{const buttons=[...document.querySelectorAll('.hbLetterName,.hbLetterSound')];return{overflow:document.documentElement.scrollWidth-innerWidth,small:buttons.filter(b=>b.getBoundingClientRect().height<44).length,text:document.querySelector('.hbLetterNote').textContent}})()`);
      assert.ok(fit.overflow<=1,lang+theme+width+' letter layout fits');assert.equal(fit.small,0,'letter controls have 44px targets');assert.match(fit.text,/ㅇ/);await shot(`refresh-letters-${lang}-${theme}-${width}.png`);
      await evaluate(`malbitBeginnerTab('reading');malbitBeginnerReadingStep('blocks');malbitBeginnerBlock(2);malbitBeginnerBuild(HARUMAL_BEGINNER.blocks[2].id)`);await shot(`refresh-block-${lang}-${theme}-${width}.png`);
      assert.equal(await evaluate(`document.querySelector('.hbBuiltWord b').textContent`),'과');
      await evaluate(`malbitBeginnerReadingStep('words')`);
      assert.equal(await evaluate(`document.querySelector('.hbWordMeaning').textContent`),({ko:'나무',ja:'木',en:'tree',zh:'树'})[lang]);
      assert.equal(await evaluate(`!!document.querySelector('.v33ReadingChoices')`),false,'reading is not a correctness quiz');
      assert.ok(await evaluate(`document.querySelector('.hbWordPicture').getBoundingClientRect().width>0`),'word picture visible');
      assert.ok(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),'picture-word layout fits');await shot(`refresh-picture-${lang}-${theme}-${width}.png`);
    }
    await evaluate(`malbitBeginnerReadDone('tree');malbitBeginnerReadDone('tree')`);
    assert.deepEqual(await evaluate(`HARUMAL_BEGINNER.getReading().completed`),['tree'],'repeat self-check is idempotent');
    await send('Page.reload',{ignoreCache:true});await ready();
    await evaluate(`setView('beginner');malbitBeginnerTab('reading');malbitBeginnerReadingStep('words')`);
    assert.equal(await evaluate(`!!document.querySelector('.hbSelfConfirmed')`),true,'self-check survives reload');
    await evaluate(`malbitBeginnerReadNext('tree');malbitBeginnerReadNext('tree')`);
    assert.equal(await evaluate(`HARUMAL_BEGINNER.getReading().index`),1,'stale next click cannot skip a word');
    const saved=await evaluate(`(()=>{const p=JSON.parse(localStorage.getItem('malbitBeginnerV1'));return{quiz:p.quiz,correct:p.correct,marker:p.legacyRefreshMarker,known:p.known}})()`);
    assert.deepEqual(saved,{quiz:7,correct:3,marker:19,known:['c:ㄱ']},'existing beginner progress remains intact');
    for(let i=1;i<12;i++)await evaluate(`(()=>{const id=HARUMAL_BEGINNER.words[${i}].id;malbitBeginnerReadDone(id);malbitBeginnerReadNext(id)})()`);
    assert.equal(await evaluate(`!!document.querySelector('.hbReadingComplete')`),true,'all 12 picture words can finish');
    assert.equal(await evaluate(`HARUMAL_BEGINNER.getReading().completed.length`),12);
    await shot('refresh-picture-reading-complete.png');
    console.log('Beginner refresh QA: 40-letter inventory, names versus sound, 4-language light/dark 320/390 layouts, syllable build, 12 picture words, reload and legacy progress preservation.');
  } finally {
    await evaluate(`(()=>{HARUMAL_HUB.closeSettings();MALBIT_TTS.cancel();if(window.__refreshNativeAudio)window.Audio=__refreshNativeAudio;if(window.__refreshSpeak)speechSynthesis.speak=__refreshSpeak;if(window.__refreshCancel)speechSynthesis.cancel=__refreshCancel;const saved=${JSON.stringify(before.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(saved,k))localStorage.removeItem(k);for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);S=JSON.parse(${JSON.stringify(before.state)});document.documentElement.dataset.theme=${JSON.stringify(before.theme)};render();for(const k of Object.keys(window))if(k.startsWith('__refresh'))delete window[k]})()`);
  }
}
