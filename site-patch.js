// TOPIK QUEST bootstrap v13
// Load the stable v11 core first, then the TOPIK I data and engine.
(function(){
  const v='13';
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
    .then(()=>load('topik1.js'))
    .then(()=>{
      if(typeof render==='function')render();
      const reveal=()=>document.documentElement.classList.remove('tq-booting');
      (window.requestAnimationFrame||window.setTimeout)(reveal,0);
    })
    .catch(e=>{
      console.error('[TOPIK QUEST bootstrap]',e);
      try{if(typeof render==='function')render()}catch(renderError){console.error('[TOPIK QUEST fallback]',renderError)}
      document.documentElement.classList.remove('tq-booting');
    });
})();
