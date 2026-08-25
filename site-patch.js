// MALBIT bootstrap v52
// Load the shared core, reviewed data, TOPIK I engine, then learning interactions.
(function(){
  'use strict';
  const VERSION='52';
  const RUNTIME_FILES=Object.freeze([
    'site-patch-core.js',
    'storage-guard.js',
    'neural-tts.js',
    'tts-quality.js',
    'data/topik1-listening.js',
    'data/topik1-reading.js',
    'data/shorts-levels.js',
    'data/explanations-i18n.js',
    'data/travel-pack-seoul-001.js',
    'data/travel-myeongdong-hub.js',
    'data/question-bank-v1-part1.js',
    'data/question-bank-v1-part2.js',
    'data/question-bank-v1-part3.js',
    'data/question-bank-v1-part4.js',
    'question-bank-engine.js',
    'topik1.js',
    'learning-features.js',
    'travel-mode.js',
    'product-polish.js',
    'product-growth.js',
    'app-polish-v22.js',
    'app-polish-v24.js',
    'app-polish-v33.js',
    'app-polish-v34.js',
    'app-polish-v35.js',
    'vocab-editor.js'
  ]);
  const versioned=src=>src+(src.includes('?')?'&':'?')+'v='+VERSION;
  const finishBoot=reason=>{
    if(window.__malbitBoot?.finish)return window.__malbitBoot.finish(reason);
    document.documentElement.classList.remove('tq-booting');
  };
  const preload=src=>{
    const link=document.createElement('link');
    link.rel='preload';
    link.as='script';
    link.href=versioned(src);
    document.head.appendChild(link);
  };
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    let settled=false;
    const settle=(ok,error)=>{
      if(settled)return;
      settled=true;
      clearTimeout(timeout);
      ok?resolve():reject(error);
    };
    s.src=versioned(src);
    s.async=false;
    s.onload=()=>settle(true);
    s.onerror=()=>settle(false,new Error('Failed to load '+src));
    const timeout=setTimeout(()=>{
      s.remove();
      settle(false,new Error('Timed out loading '+src));
    },15000);
    document.body.appendChild(s);
  });
  const loadSeries=async files=>{for(const file of files)await load(file)};
  window.__MALBIT_RUNTIME__=Object.freeze({version:VERSION,files:RUNTIME_FILES});
  RUNTIME_FILES.forEach(preload);
  (async()=>{
    await loadSeries(RUNTIME_FILES);
    if(typeof render==='function')render();
    const reveal=()=>finishBoot('ready');
    (window.requestAnimationFrame||window.setTimeout)(reveal,0);
  })().catch(e=>{
    console.error('[MALBIT bootstrap]',e);
    try{if(typeof render==='function')render()}catch(renderError){console.error('[MALBIT fallback]',renderError)}
    finishBoot('dependency-error');
  });
})();
