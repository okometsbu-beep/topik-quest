const VERSION='184',CACHE_PREFIX='harumal-v',CACHE=CACHE_PREFIX+VERSION;
// Earlier releases wrote their caches under the retired MALBIT prefix. Keep deleting them so an
// upgraded install does not keep a full stale shell next to the current one.
const RETIRED_CACHE_PREFIX='malbit-v';
// The shell holds what a new install needs to open the app offline: every HTML/CSS entry point,
// the core runtime that renders Home, practice, review, vocabulary, beginner Hangul, writing,
// growth, travel and the mascot, and the art those screens draw. Question banks, listening audio,
// question images and the intro movie stay out: they are large, optional, and cached on first use.
const SHELL=Object.freeze([
  './','./index.html','./manifest.webmanifest','./icon.svg',
  './styles.css','./harumal-ui.css','./travel-adventure.css','./haruman-intro.css','./writing-curriculum.css','./growth-learning.css','./listening-player.css','./learning-hub.css','./beginner-hangul.css','./vocab-flashcards.css',
  './legacy-data.js','./legacy-core.js','./site-patch.js','./site-patch-core.js','./storage-guard.js','./tts-quality.js',
  './haruman-intro.js','./harumal-ui.js','./haruman-mascot.js','./app-touch.js',
  './topik1.js','./learning-features.js','./practice-sessions.js','./question-bank-engine.js','./practice-results.js','./question-tools.js','./shorts-cycle.js',
  './vocabulary-grammar.js','./vocabulary-selection.js','./vocabulary-translation.js','./vocab-editor.js','./vocab-test.js','./vocab-flashcards.js','./writing-answers.js',
  './learning-hub.js','./learning-rewards.js','./beginner-grammar.js','./product-polish.js','./product-growth.js',
  './travel-mode.js','./travel-adventure.js','./travel-rpg-engine.js','./listening-audio.js','./listening-player.js',
  './app-polish-v22.js','./app-polish-v24.js','./app-polish-v33.js','./app-polish-v34.js','./app-polish-v35.js',
  './growth-learning.js','./growth-learning-engine.js','./growth-learning-entrypoints.js','./data/growth-learning.js','./data/growth-learning-locales.js',
  './writing-curriculum.js','./writing-curriculum-engine.js','./writing-curriculum-i18n.js','./data/writing-curriculum.js','./data/writing-curriculum-locales.js',
  './assets/art/writing/flow-start-v1.webp','./assets/art/writing/flow-unlock-v1.webp','./assets/art/writing/flow-return-v1.webp','./assets/art/writing/context-work-v1.webp','./assets/art/writing/context-park-v1.webp','./assets/art/writing/context-study-v1.webp','./assets/art/writing/context-movie-v1.webp','./assets/art/writing/context-rain-v1.webp',
  './assets/art/haruman/home-study-v2.webp','./assets/art/haruman/shorts-quiz-v2.webp','./assets/art/haruman/travel-journey-v2.webp','./assets/art/haruman/vocab-reading-v2.webp','./assets/art/haruman/review-thinking-v2.webp','./assets/art/haruman/lesson-welcome-v2.webp','./assets/art/haruman/progress-proud-v2.webp','./assets/art/haruman/answer-correct-v2.webp','./assets/art/haruman/answer-retry-v2.webp','./assets/art/haruman/lesson-complete-v2.webp','./assets/art/haruman/review-empty-v2.webp','./assets/art/haruman/audio-listening-v2.webp',
  './assets/art/haruman/welcome-v1.webp','./assets/art/haruman/thinking-v1.webp','./assets/art/haruman/correct-v1.webp','./assets/art/haruman/retry-v1.webp','./assets/art/haruman/celebrate-v1.webp','./assets/art/haruman/encourage-v1.webp','./assets/art/haruman/journey-v1.webp','./assets/art/haruman/rest-v1.webp',
  './assets/art/beginner/beginner-objects-sprite-v1.png','./assets/harumal/ui/vocab-diary-empty-v1.webp',
  './assets/art/travel/rpg/traveler-blue-4dir-v1.png','./assets/art/travel/rpg/travel-stamina-game-over-v1.webp','./assets/art/travel/rpg/korean-street-basic-atlas-v1.webp','./assets/art/travel/rpg/korean-street-corners-atlas-v1.webp','./assets/art/travel/rpg/korean-street-junctions-atlas-v1.webp','./assets/art/travel/rpg/korean-street-building-entrances-atlas-v1.webp','./assets/art/travel/rpg/korean-street-decor-upper-atlas-v1.webp'
]);
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&(key.startsWith(CACHE_PREFIX)||key.startsWith(RETIRED_CACHE_PREFIX))).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);

  if(request.method!=='GET'||url.origin!==location.origin)return;
  // Optional movies must not gate shell installation or cache partial range responses.
  if(url.pathname.includes('/assets/video/')||url.pathname.includes('/assets/audio/haruman-intro-')||url.pathname.includes('/audio/listening/'))return;
  const isDocument=request.mode==='navigate';
  const remember=(key,response)=>{if(response?.ok)event.waitUntil(caches.open(CACHE).then(cache=>cache.put(key,response.clone())).catch(()=>{}));return response};
  if(isDocument){event.respondWith(fetch(request).then(response=>remember('./index.html',response)).catch(()=>caches.match('./index.html')));return}
  const requestedVersion=new URL(request.url).searchParams.get('v'),ignoreSearch=!requestedVersion||requestedVersion===VERSION;
  event.respondWith(caches.match(request,{ignoreSearch}).then(hit=>hit||fetch(request).then(response=>remember(request,response))).catch(()=>fetch(request)));
});
