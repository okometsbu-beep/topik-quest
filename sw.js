const CACHE='malbit-v20';
const CORE=['./','./index.html','./site-patch.js','./site-patch-core.js','./topik1.js','./learning-features.js','./product-polish.js','./manifest.webmanifest','./icon.svg','./data/topik1-listening.js','./data/topik1-reading.js','./data/shorts-levels.js','./data/explanations-i18n.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  const request=event.request,isDocument=request.mode==='navigate';
  if(isDocument){event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return}
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));return response})));
});
