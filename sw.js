const VERSION='42',CACHE_PREFIX='malbit-v',CACHE=CACHE_PREFIX+VERSION;
const SHELL=Object.freeze(['./','./index.html','./styles.css','./legacy-data.js','./legacy-core.js','./site-patch.js','./manifest.webmanifest','./icon.svg','./assets/art/malbit-home-hero.webp']);
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  const request=event.request,isDocument=request.mode==='navigate';
  const remember=(key,response)=>{if(response?.ok)event.waitUntil(caches.open(CACHE).then(cache=>cache.put(key,response.clone())).catch(()=>{}));return response};
  if(isDocument){event.respondWith(fetch(request).then(response=>remember('./index.html',response)).catch(()=>caches.match('./index.html')));return}
  const requestedVersion=new URL(request.url).searchParams.get('v'),ignoreSearch=!requestedVersion||requestedVersion===VERSION;
  event.respondWith(caches.match(request,{ignoreSearch}).then(hit=>hit||fetch(request).then(response=>remember(request,response))).catch(()=>fetch(request)));
});
