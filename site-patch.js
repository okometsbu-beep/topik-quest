// TOPIK QUEST bootstrap v12
// Load the stable v11 core first, then the TOPIK I data and engine.
(function(){
  const v=Date.now();
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
    .catch(e=>{console.error('[TOPIK QUEST bootstrap]',e)});
})();
