// MALBIT bootstrap v23
// Load the shared core, reviewed data, TOPIK I engine, then learning interactions.
(function(){
  const v='23';
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src+(src.includes('?')?'&':'?')+'v='+v;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Failed to load '+src));
    document.body.appendChild(s);
  });
  load('site-patch-core.js')
    .then(()=>load('data/topik1-listening.js'))
    .then(()=>load('data/topik1-reading.js'))
    .then(()=>load('data/shorts-levels.js'))
    .then(()=>load('data/explanations-i18n.js'))
    .then(()=>load('topik1.js'))
    .then(()=>load('learning-features.js'))
    .then(()=>load('product-polish.js'))
    .then(()=>load('product-growth.js'))
    .then(()=>load('app-polish-v22.js'))
    .then(()=>{
      if(typeof render==='function')render();
      const reveal=()=>document.documentElement.classList.remove('tq-booting');
      (window.requestAnimationFrame||window.setTimeout)(reveal,0);
    })
    .catch(e=>{
      console.error('[MALBIT bootstrap]',e);
      try{if(typeof render==='function')render()}catch(renderError){console.error('[MALBIT fallback]',renderError)}
      document.documentElement.classList.remove('tq-booting');
    });
})();
