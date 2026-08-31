// MALBIT bootstrap v86
// Load the shared core, reviewed data, TOPIK I engine, then learning interactions.
(function(){
  'use strict';
  const VERSION='86';
  const RUNTIME_FILES=Object.freeze([
    'site-patch-core.js',
    'storage-guard.js',
    'neural-tts.js',
    'tts-quality.js',
    'data/topik1-listening.js',
    'data/topik1-reading.js',
    'data/shorts-levels.js',
    'data/explanations-i18n.js',
    'data/beginner-grammar-v1.js',
    'data/travel-pack-seoul-001.js',
    'data/travel-myeongdong-hub.js',
    'data/travel-tiles-korean-street-v1.js',
    'data/travel-tiles-korean-street-corners-v1.js',
    'data/travel-tiles-korean-street-junctions-v1.js',
    'data/travel-map-seoul-v1.js',
    'data/question-bank-v1-part1.js',
    'data/question-bank-v1-part2.js',
    'data/question-bank-v1-part3.js',
    'data/question-bank-v1-part4.js',
    'data/question-bank-practice-v1.js',
    'question-bank-engine.js',
    'topik1.js',
    'learning-features.js',
    'travel-rpg-engine.js',
    'travel-mode.js',
    'product-polish.js',
    'product-growth.js',
    'app-polish-v22.js',
    'app-polish-v24.js',
    'app-polish-v33.js',
    'app-polish-v34.js',
    'app-polish-v35.js',
    'beginner-grammar.js',
    'game-visual-system.js',
    'home-visual-system.js',
    'shorts-visual-system.js',
    'random-practice-visual-system.js',
    'review-visual-system.js',
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
  const preloadImage=src=>{
    const link=document.createElement('link');
    link.rel='preload';
    link.as='image';
    link.href=src;
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
  preloadImage('assets/art/travel/rpg/traveler-blue-4dir-v1.png');
  preloadImage('assets/art/travel/rpg/travel-stamina-game-over-v1.webp');
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
