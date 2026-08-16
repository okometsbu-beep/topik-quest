// MALBIT bootstrap v35
// Load the shared core, reviewed data, TOPIK I engine, then learning interactions.
(function(){
  const v='35';
  const finishBoot=reason=>{
    if(window.__malbitBoot?.finish)return window.__malbitBoot.finish(reason);
    document.documentElement.classList.remove('tq-booting');
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
    s.src=src+(src.includes('?')?'&':'?')+'v='+v;
    s.async=false;
    s.onload=()=>settle(true);
    s.onerror=()=>settle(false,new Error('Failed to load '+src));
    const timeout=setTimeout(()=>{
      s.remove();
      settle(false,new Error('Timed out loading '+src));
    },15000);
    document.body.appendChild(s);
  });
  load('site-patch-core.js')
    .then(()=>load('data/topik1-listening.js'))
    .then(()=>load('data/topik1-reading.js'))
    .then(()=>load('data/shorts-levels.js'))
    .then(()=>load('data/explanations-i18n.js'))
    .then(()=>load('data/question-bank-v1-part1.js'))
    .then(()=>load('data/question-bank-v1-part2.js'))
    .then(()=>load('data/question-bank-v1-part3.js'))
    .then(()=>load('data/question-bank-v1-part4.js'))
    .then(()=>load('question-bank-engine.js'))
    .then(()=>load('topik1.js'))
    .then(()=>load('learning-features.js'))
    .then(()=>load('product-polish.js'))
    .then(()=>load('product-growth.js'))
    .then(()=>load('app-polish-v22.js'))
    .then(()=>load('app-polish-v24.js'))
    .then(()=>load('app-polish-v33.js'))
    .then(()=>load('app-polish-v34.js'))
    .then(()=>load('app-polish-v35.js'))
    .then(()=>{
      if(typeof render==='function')render();
      const reveal=()=>finishBoot('ready');
      (window.requestAnimationFrame||window.setTimeout)(reveal,0);
    })
    .catch(e=>{
      console.error('[MALBIT bootstrap]',e);
      try{if(typeof render==='function')render()}catch(renderError){console.error('[MALBIT fallback]',renderError)}
      finishBoot('dependency-error');
    });
})();
