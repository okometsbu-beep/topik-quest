const VERSION='92',CACHE_PREFIX='malbit-v',CACHE=CACHE_PREFIX+VERSION,NEURAL_CACHE='malbit-neural-tts-v1';
const SHELL=Object.freeze(['./','./index.html','./styles.css','./legacy-data.js','./legacy-core.js','./site-patch.js','./manifest.webmanifest','./icon.svg','./assets/art/malbit-home-hero.webp','./assets/art/travel/rpg/traveler-blue-4dir-v1.png','./assets/art/travel/rpg/travel-stamina-game-over-v1.webp','./assets/art/travel/rpg/korean-street-basic-atlas-v1.webp','./assets/art/travel/rpg/korean-street-corners-atlas-v1.webp','./assets/art/travel/rpg/korean-street-junctions-atlas-v1.webp','./assets/art/travel/rpg/korean-street-building-entrances-atlas-v1.webp','./assets/art/travel/rpg/korean-street-decor-upper-atlas-v1.webp']);
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method==='GET'&&url.origin==='https://cdn.jsdelivr.net'&&url.pathname.includes('/onnxruntime-web@1.27.0/dist/')){event.respondWith(caches.open(NEURAL_CACHE).then(cache=>cache.match(request).then(hit=>hit||fetch(request).then(response=>{if(response?.ok)event.waitUntil(cache.put(request,response.clone()).catch(()=>{}));return response}))));return}
  if(request.method!=='GET'||url.origin!==location.origin)return;
  const isDocument=request.mode==='navigate';
  const remember=(key,response)=>{if(response?.ok)event.waitUntil(caches.open(CACHE).then(cache=>cache.put(key,response.clone())).catch(()=>{}));return response};
  if(isDocument){event.respondWith(fetch(request).then(response=>remember('./index.html',response)).catch(()=>caches.match('./index.html')));return}
  const requestedVersion=new URL(request.url).searchParams.get('v'),ignoreSearch=!requestedVersion||requestedVersion===VERSION;
  event.respondWith(caches.match(request,{ignoreSearch}).then(hit=>hit||fetch(request).then(response=>remember(request,response))).catch(()=>fetch(request)));
});
