const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function boot(state){
 const lifecycle={},listeners={},card={style:{},dataset:{},focus(){},addEventListener:(k,f)=>listeners[k]=f,setPointerCapture(){}},screen={innerHTML:'',querySelector:()=>null};let stored,sounds=[];
 const c={addEventListener:(k,f)=>lifecycle[k]=f,removeEventListener:k=>delete lifecycle[k],S:state||{view:'home',lang:'ja',vocab:[{text:'학교',ja:'学校',manual:true,interval:3},{text:'사과',meanings:{ja:'りんご'}},{text:'뜻없음'}]},document:{createElement:()=>({}),getElementById:id=>id==='screen'?screen:card},render(){},renderShell(){},save(){stored=JSON.stringify(c.S)},setView(v){c.S.view=v;c.render()},AudioContext:function(){this.currentTime=0;this.state='running';this.createOscillator=()=>({frequency:{set value(v){sounds.push(v)}},connect(){},start(){},stop(){},disconnect(){}});this.createGain=()=>({gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}})}};c.window=c;vm.createContext(c);for(const f of ['vocab-test.js','vocab-flashcards.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),c);return {c,screen,card,listeners,lifecycle,sounds,saved:()=>JSON.parse(stored)};
}
test('saved vocabulary only; manual filter, one/zero words, exclusions and no mutations',()=>{const {c}=boot();const before=JSON.stringify(c.S.vocab);assert.equal(c.HARUMAL_FLASHCARDS.pool().length,2);assert.equal(c.HARUMAL_FLASHCARDS.pool('manual').length,1);c.harumalFlashcardsStart('manual');assert.equal(c.S.vocabFlashcards.items.length,1);c.harumalFlashcardsGrade(true);assert.equal(c.S.vocabFlashcards.answers.length,0);c.harumalFlashcardsFlip();c.harumalFlashcardsGrade(true);assert.ok(c.S.vocabFlashcards.finishedAt);c.harumalFlashcardsGrade(false);assert.equal(c.S.vocabFlashcards.answers.length,1);assert.equal(JSON.stringify(c.S.vocab),before);const b=boot({lang:'ja',view:'home',vocab:[]});b.c.harumalFlashcardsStart();assert.equal(b.c.S.view,'home')});
test('interrupted session survives reload, missed-only retry and repeated grading guard',()=>{const b=boot();b.c.harumalFlashcardsStart('all');b.c.harumalFlashcardsFlip();b.c.harumalFlashcardsGrade(false);b.c.harumalFlashcardsGrade(true);assert.equal(b.c.S.vocabFlashcards.answers.length,1);const {c}=boot(b.saved());c.harumalFlashcardsResume();assert.equal(c.S.vocabFlashcards.answers.length,1);c.harumalFlashcardsFlip();c.harumalFlashcardsGrade(true);c.harumalFlashcardsRetry();assert.equal(c.S.vocabFlashcards.items.length,1);assert.equal(c.S.vocabFlashcards.answers.length,0);c.harumalFlashcardsExit();c.harumalFlashcardsGrade(false);assert.equal(c.S.vocabFlashcards.answers.length,0)});
test('swipe click cannot reveal next card; vertical, short and canceled swipes do not grade',()=>{const {c,listeners,card}=boot();c.harumalFlashcardsStart();c.harumalFlashcardsFlip();const down=(x=0,y=0)=>listeners.pointerdown({isPrimary:true,button:0,pointerId:1,clientX:x,clientY:y});const up=(x,y)=>listeners.pointerup({pointerId:1,clientX:x,clientY:y});down();up(20,0);assert.equal(c.S.vocabFlashcards.answers.length,0);down();up(80,120);assert.equal(c.S.vocabFlashcards.answers.length,0);down();listeners.pointercancel();up(90,0);assert.equal(c.S.vocabFlashcards.answers.length,0);down();up(100,0);assert.equal(c.S.vocabFlashcards.answers.length,1);listeners.click();assert.equal(c.S.vocabFlashcards.revealed,false);down();up(0,0);listeners.click();assert.equal(c.S.vocabFlashcards.revealed,true);listeners.keydown({key:'ArrowLeft',repeat:false,preventDefault(){}});assert.equal(c.S.vocabFlashcards.answers.length,2);assert.equal(card.style.transform,'')});
test('correct/revisit sounds differ; persisted mute and unavailable audio are safe',()=>{const b=boot();b.c.harumalFlashcardsStart();b.c.harumalFlashcardsFlip();b.c.harumalFlashcardsGrade(true);assert.deepEqual(b.sounds,[523.25,659.25,783.99]);b.c.harumalFlashcardsFlip();b.c.harumalFlashcardsGrade(false);assert.deepEqual(b.sounds.slice(3),[294,220]);b.c.S.vocabFlashcardSound=false;b.c.save();const n=boot(b.saved());n.c.harumalFlashcardsStart();n.c.harumalFlashcardsFlip();n.c.harumalFlashcardsGrade(true);assert.equal(n.sounds.length,0);n.c.S.vocabFlashcardSound=true;n.c.AudioContext=undefined;n.c.harumalFlashcardsFlip();assert.doesNotThrow(()=>n.c.harumalFlashcardsGrade(false))});
test('user content is escaped, meaning hidden until reveal, target language retained',()=>{const {c,screen}=boot({lang:'ja',view:'home',vocab:[{text:'<script>韓国語',ja:'<img src=x onerror=alert(1)>'.repeat(40)}]});c.harumalFlashcardsStart();assert.ok(!screen.innerHTML.includes('onerror'));assert.match(screen.innerHTML,/&lt;script&gt;/);c.harumalFlashcardsFlip();assert.ok(!screen.innerHTML.includes('<img'));assert.match(screen.innerHTML,/lang="ja"/);assert.match(screen.innerHTML,/aria-pressed="true"/)});
test('flashcard assets are versioned, cached, and loaded after saved-word pool',()=>{const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');assert.match(read('index.html'),/vocab-flashcards.css\?v=\d+/);assert.match(read('sw.js'),/'\.\/vocab-flashcards.js'/);assert.match(read('site-patch.js'),/'vocab-test.js',\s*'vocab-flashcards.js'/);assert.match(read('vocab-flashcards.css'),/prefers-reduced-motion:reduce/)});

test('keyboard activation remains usable after canceled pointer gesture',()=>{const {c,listeners}=boot();c.harumalFlashcardsStart();listeners.pointerdown({isPrimary:true,button:0,pointerId:1,clientX:0,clientY:0});listeners.pointercancel();listeners.click({detail:0});assert.equal(c.S.vocabFlashcards.revealed,true)});
test('distance and velocity thresholds distinguish flicks, returns and vertical scrolling',()=>{const {c}=boot();const decide=c.HARUMAL_FLASHCARDS.swipeDecision;assert.equal(decide(100,5,.2,300,true),true);assert.equal(decide(-40,3,-.9,300,true),true);assert.equal(decide(35,0,.1,300,true),false);assert.equal(decide(80,110,.9,300,true),false);assert.equal(decide(140,0,2,300,false),false);assert.equal(decide(20,0,3,300,true),false)});
test('fling saves once before animation and a stale finish cannot reopen a dismissed quiz',()=>{const {c,card}=boot();c.harumalFlashcardsStart();c.harumalFlashcardsFlip();let finish,cleared=false;card.classList={add(){},remove(){}};card.style.setProperty=()=>{};card.getBoundingClientRect=()=>({width:300});c.document.querySelectorAll=()=>[];c.setTimeout=f=>(finish=f,1);c.clearTimeout=()=>{cleared=true};c.harumalFlashcardsGrade(true);assert.equal(c.S.vocabFlashcards.answers.length,1);assert.match(card.style.transform,/rotateY/);c.harumalFlashcardsGrade(false);assert.equal(c.S.vocabFlashcards.answers.length,1);c.setView('home');assert.equal(cleared,true);finish();assert.equal(c.S.view,'home');assert.equal(c.S.vocabFlashcards.answers.length,1)});
test('3D flip uses two backface-hidden faces and preserves a physical stack',()=>{const {c,screen}=boot({view:'home',lang:'ja',vocab:[{text:'가',ja:'一'},{text:'나',ja:'二'},{text:'다',ja:'三'}]});c.harumalFlashcardsStart();assert.match(screen.innerHTML,/hfUnder1/);assert.match(screen.innerHTML,/hfUnder2/);assert.match(screen.innerHTML,/hfFlipper/);const css=fs.readFileSync(path.join(__dirname,'../vocab-flashcards.css'),'utf8');assert.match(css,/rotateY\(180deg\)/);assert.match(css,/backface-visibility:hidden/);assert.match(css,/aspect-ratio:3\/4/)});

test('sound preference remains honored without a card-header toggle',()=>{const {c,screen}=boot();c.harumalFlashcardsStart();assert.ok(!screen.innerHTML.includes('flashcardSound'));c.S.soundEnabled=false;assert.equal(c.HARUMAL_FLASHCARDS.soundEnabled(),false);c.S.soundEnabled=true;c.S.muted=true;assert.equal(c.HARUMAL_FLASHCARDS.soundEnabled(),false)});

test('viewport lock is scoped, responsive, idempotent and released by all navigation',()=>{
 const {c}=boot(),calls=[],events=new Map(),classes=new Set(),props=new Map();
 const element={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},style:{setProperty:(k,v)=>props.set(k,v),removeProperty:k=>props.delete(k)}};
 c.document.documentElement=element;c.document.body=element;c.scrollY=230;
 c.addEventListener=(k,f)=>events.set(k,f);c.removeEventListener=k=>events.delete(k);c.scrollTo=x=>calls.push(x);
 const vvEvents=new Map();c.visualViewport={height:568,offsetTop:0,addEventListener:(k,f)=>vvEvents.set(k,f),removeEventListener:k=>vvEvents.delete(k)};
 c.harumalFlashcardsStart();assert.equal(classes.has('hfActive'),true);assert.equal(props.get('--hf-height'),'568px');
 c.visualViewport.height=510;c.visualViewport.offsetTop=12;vvEvents.get('resize')();assert.equal(props.get('--hf-height'),'510px');assert.equal(props.get('--hf-top'),'12px');
 c.render();assert.equal(events.size,1);assert.equal(vvEvents.size,2);
 c.setView('home');assert.equal(classes.has('hfActive'),false);assert.equal(events.size,0);assert.equal(vvEvents.size,0);assert.equal(props.size,0);assert.equal(calls.at(-1).top,230);
 c.harumalFlashcardsResume();assert.equal(classes.has('hfActive'),true);c.harumalFlashcardsExit();assert.equal(classes.has('hfActive'),false);
});
test('vertical-first and diagonal gestures do not turn into an accidental answer or flip',()=>{
 const {c,listeners,card}=boot();card.style.setProperty=()=>{};c.document.querySelectorAll=()=>[];
 c.harumalFlashcardsStart();c.harumalFlashcardsFlip();
 listeners.pointerdown({isPrimary:true,button:0,pointerId:1,clientX:0,clientY:0,timeStamp:1});
 listeners.pointermove({pointerId:1,clientX:4,clientY:30,timeStamp:30});
 listeners.pointermove({pointerId:1,clientX:130,clientY:40,timeStamp:60});
 listeners.pointerup({pointerId:1,clientX:130,clientY:40,timeStamp:80});listeners.click({detail:1});
 assert.equal(c.S.vocabFlashcards.answers.length,0);assert.equal(c.S.vocabFlashcards.revealed,true);
});
test('long content has a deliberate full-text control instead of card scroll arbitration',()=>{
 const {c,screen}=boot();c.harumalFlashcardsStart();assert.match(screen.innerHTML,/hfDetailsButton/);
 const css=fs.readFileSync(path.join(__dirname,'../vocab-flashcards.css'),'utf8');
 assert.match(css,/html body\.hfActive \.top,html body\.hfActive \.bottom\{display:none!important\}/);
 assert.match(css,/\.hfScreen \.hfCard,\.hfScreen \.hfTermScroll,\.hfScreen \.hfMeaningScroll\{touch-action:pinch-zoom\}/);
 assert.match(css,/\.hfDetailBody\{[^}]*overflow:auto;[^}]*touch-action:pan-y/);
});

 test('navigation unlocks even when a later renderer owns the destination outright',()=>{
 const {c}=boot(),classes=new Set();c.document.documentElement={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};c.document.body=c.document.documentElement;
 c.harumalFlashcardsStart();assert.equal(classes.has('hfActive'),true);
 const previous=c.render;c.render=function(){if(['travel','writing'].includes(c.S.view))return;return previous()};
 c.setView('travel');assert.equal(classes.has('hfActive'),false);c.harumalFlashcardsResume();assert.equal(classes.has('hfActive'),true);c.setView('writing');assert.equal(classes.has('hfActive'),false);
});

test('back-forward cache return rebuilds the flashcard viewport at its current height',()=>{
 const {c,lifecycle}=boot(),classes=new Set(),props=new Map();const root={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},style:{setProperty:(k,v)=>props.set(k,v),removeProperty:k=>props.delete(k)}};c.document.documentElement=root;c.document.body=root;c.innerHeight=844;c.scrollY=230;let restored;c.scrollTo=({top})=>{restored=top};
 c.harumalFlashcardsStart();c.harumalFlashcardsFlip();assert.equal(props.get('--hf-height'),'844px');
 lifecycle.pagehide();assert.equal(classes.has('hfActive'),false);c.innerHeight=568;c.scrollY=0;lifecycle.pageshow({persisted:true});assert.equal(classes.has('hfActive'),true);assert.equal(props.get('--hf-height'),'568px');assert.equal(c.S.vocabFlashcards.revealed,true);c.harumalFlashcardsExit();assert.equal(restored,230);
});
test('deferred return correction cancels on newer navigation, entry, pagehide and user input',()=>{
 for(const action of ['navigate','enter','pagehide','pointerdown']){
  const {c,lifecycle}=boot(),queue=[],classes=new Set(),calls=[];c.document.documentElement={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};c.document.body=c.document.documentElement;c.requestAnimationFrame=f=>queue.push(f);c.scrollY=350;c.scrollTo=x=>calls.push(x.top);
  c.harumalFlashcardsStart();c.harumalFlashcardsExit();assert.equal(classes.has('hfRestoring'),true);
  if(action==='navigate')c.setView('vocab');else if(action==='enter')c.harumalFlashcardsResume();else lifecycle[action]();
  const n=calls.length;while(queue.length)queue.shift()();assert.equal(calls.length,n,action);assert.equal(classes.has('hfRestoring'),false,action);
 }
});
