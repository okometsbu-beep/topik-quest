const VERSION='33',CACHE='malbit-v'+VERSION;
const CORE=['./','./index.html','./site-patch.js','./site-patch-core.js','./topik1.js','./learning-features.js','./product-polish.js','./product-growth.js','./app-polish-v22.js','./app-polish-v24.js','./app-polish-v33.js','./question-bank-engine.js','./assets/art/malbit-home-hero.webp','./assets/art/malbit-monsters-atlas.webp','./assets/art/malbit-monster-1.webp','./assets/art/malbit-monster-2.webp','./assets/art/malbit-monster-3.webp','./assets/art/malbit-monster-4.webp','./assets/art/malbit-monster-5.webp','./assets/art/malbit-monster-6.webp','./assets/art/malbit-monster-7.webp','./assets/art/malbit-monster-8.webp','./assets/art/malbit-adventurer.webp','./assets/art/malbit-stage-map.webp','./manifest.webmanifest','./icon.svg','./data/topik1-listening.js','./data/topik1-reading.js','./data/shorts-levels.js','./data/explanations-i18n.js','./data/question-bank-v1-part1.js','./data/question-bank-v1-part2.js','./data/question-bank-v1-part3.js','./data/question-bank-v1-part4.js','./data/question-bank-manifest.json'];
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  const request=event.request,isDocument=request.mode==='navigate';
  if(isDocument){event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return}
  const requestedVersion=new URL(request.url).searchParams.get('v'),ignoreSearch=!requestedVersion||requestedVersion===VERSION;
  event.respondWith(caches.match(request,{ignoreSearch}).then(hit=>hit||fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));return response})).catch(()=>fetch(request)));
});
