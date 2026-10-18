const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function boot({recent=false,reduced=false,saveData=false,webm=true,alpha=0,reject=false,storageFails=false,titleLoaded=true,sound=false,soundReady=true,soundMode='allow',reloadMarker=null,navigation='navigate'}={}){
  let clock=0,id=0,removed=false,plays=0,loads=0,pauses=0,seen=null;
  const titleEvents={},title={naturalWidth:titleLoaded?1448:0,addEventListener:(k,fn)=>titleEvents[k]=fn};
  const timers=new Map(),events={},panelEvents={},classes=new Set(),rejections=[],audios=[];
  const video={currentTime:0,playbackRate:1,paused:true,ended:false,style:{},muted:false,addEventListener:(k,fn)=>events[k]=fn,canPlayType:()=>webm?'probably':'',play(){plays++;this.paused=false;return{catch(fn){rejections.push(fn);if(reject)fn()}}},pause(){pauses++;this.paused=true},load(){loads++},removeAttribute(){delete this.src}};
  const panel={style:{},classList:{add:v=>classes.add(v),toggle:(v,on)=>on?classes.add(v):classes.delete(v)},addEventListener:(k,fn)=>panelEvents[k]=fn,remove(){removed=true}};
  const c={performance:{now:()=>clock,getEntriesByType:()=>[{type:navigation}]},navigator:{connection:{saveData}},matchMedia:()=>({matches:reduced}),sessionStorage:{getItem(){if(storageFails)throw Error();return reloadMarker?JSON.stringify(reloadMarker):recent?String(Date.now()):null},removeItem(){reloadMarker=null},setItem(k,v){if(storageFails)throw Error();seen=v}},setTimeout(fn,ms){timers.set(++id,{fn,at:clock+ms});return id},clearTimeout:id=>timers.delete(id),document:{currentScript:{src:'http://localhost/haruman-intro.js?v=172'},hidden:false,documentElement:{classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)}},querySelector:()=>panel,getElementById:id=>id==='harumanIntroTitle'?title:video,addEventListener:(k,fn)=>events[k]=fn,removeEventListener:k=>delete events[k],createElement:()=>({getContext:()=>({drawImage(){},getImageData:()=>({data:[0,0,0,alpha]})})})}};c.window=c;
  if(sound)c.Audio=function(){
    const media={readyState:soundReady?4:0,duration:2.8,currentTime:0,playbackRate:1,paused:true,events:{},requests:[],
      addEventListener(k,fn){this.events[k]=fn},pause(){this.paused=true},load(){},removeAttribute(){delete this.src},
      play(){const request={offset:this.currentTime,rate:this.playbackRate,src:this.src};this.requests.push(request);
        if(soundMode==='throw')throw Error('audio failure');
        if(soundMode==='reject')return Promise.reject(Error('autoplay denied'));
        this.paused=false;
        if(soundMode==='pending')return new Promise((resolve,reject)=>{request.resolve=()=>{this.paused=false;resolve()};request.reject=reject});
        return Promise.resolve();
      }};
    Object.defineProperty(media,'src',{configurable:true,get(){return this.url},set(value){this.url=value;this.duration=value.includes('-title.')?1.2:2.8}});
    audios.push(media);return media;
  };
  vm.runInNewContext(read('haruman-intro.js'),c);
  const tick=ms=>{const end=clock+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;clock=next[1].at;timers.delete(next[0]);next[1].fn()}clock=end};
  return{video,title,titleEvents,c,classes,tick,now:()=>clock,emit:k=>{if(k==='ended'){video.ended=true;video.paused=true}if(k==='playing')video.paused=false;events[k]?.()},audios,gesture:()=>events.click?.(),click:()=>panelEvents.click?.(),escape:()=>panelEvents.keydown?.({key:'Escape'}),removed:()=>removed,plays:()=>plays,loads:()=>loads,pauses:()=>pauses,seen:()=>seen,rejections};
}
test('transparent playback completes the title sequence and releases media',()=>{const b=boot();assert.match(b.video.src,/webm$/);b.emit('loadeddata');b.emit('playing');assert.equal(b.video.style.opacity,'1');b.emit('ended');assert.ok(!b.removed());b.tick(1500);assert.ok(b.removed());assert.equal(b.video.src,undefined)});
test('opaque WebM decoder or unsupported codec chooses matching MP4',()=>{const b=boot({alpha:255});b.emit('loadeddata');assert.match(b.video.src,/mp4$/);b.emit('loadeddata');assert.equal(b.video.style.opacity,'1');assert.match(boot({webm:false}).video.src,/mp4$/)});
test('click and Escape cannot skip; no skip button is shipped',()=>{const b=boot();b.click();b.escape();b.tick(220);assert.ok(!b.removed());assert.equal(b.pauses(),0);const intro=read('index.html').split('<script src="haruman-intro.js')[0];assert.doesNotMatch(intro,/<button|Skip|건너뛰기/);assert.equal(typeof b.c.HARUMAN_INTRO.finish,'function')});
test('load error and denied autoplay immediately dispose',()=>{const b=boot();b.emit('error');assert.ok(b.removed());assert.ok(boot({reject:true}).removed())});
test('delayed loading and playback beyond the old deadline wait for ended',()=>{const b=boot();b.tick(4500);assert.ok(!b.removed());b.emit('loadeddata');b.emit('playing');b.video.currentTime=1;b.emit('timeupdate');b.tick(4500);assert.ok(!b.removed());assert.ok(!b.classes.has('harumanIntroLeaving'));b.emit('ended');assert.ok(b.classes.has('harumanIntroWhiteout'));assert.ok(!b.classes.has('harumanIntroLeaving'));b.tick(1500);assert.ok(b.removed())});
test('healthy playback is never cut off by total elapsed duration',()=>{const b=boot();for(let i=1;i<=30;i++){b.tick(1000);b.video.currentTime=i/20;b.emit('timeupdate');assert.ok(!b.removed())}b.emit('ended');b.tick(1500);assert.ok(b.removed())});
test('only 15 seconds without playback progress triggers recovery',()=>{const b=boot();b.tick(14999);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());const s=boot();s.video.currentTime=1;s.emit('timeupdate');s.tick(10000);s.emit('timeupdate');s.tick(5000);assert.ok(s.removed());assert.equal(s.seen(),null)});
test('recent launch does not skip; reduced motion and save-data remain respected',()=>{const returning=boot({recent:true});assert.equal(returning.plays(),1);assert.ok(!returning.removed());for(const opts of [{reduced:true},{saveData:true}]){const b=boot(opts);assert.equal(b.plays(),0);assert.ok(b.removed())}});
test('backgrounding pauses and resumes without discarding unfinished playback',()=>{const b=boot({storageFails:true});b.video.currentTime=1;b.emit('timeupdate');b.c.document.hidden=true;b.emit('visibilitychange');assert.equal(b.pauses(),1);b.tick(20000);assert.ok(!b.removed());b.c.document.hidden=false;b.emit('visibilitychange');assert.equal(b.plays(),2);assert.equal(b.video.currentTime,1);b.emit('ended');b.tick(1500);assert.ok(b.removed())});
test('duplicate completion is harmless and no launch-skip state is recorded',()=>{const b=boot();b.emit('ended');b.tick(1500);b.emit('ended');assert.equal(b.loads(),1);assert.equal(b.seen(),null)});
test('replaced WebM play rejection cannot dismiss the MP4 fallback',()=>{const b=boot({alpha:255});b.emit('loadeddata');b.rejections[0]();assert.ok(!b.removed());assert.match(b.video.src,/mp4$/);b.emit('ended');b.tick(1500);assert.ok(b.removed())});
test('background pause rejection cannot dismiss resumed playback',()=>{const b=boot();b.c.document.hidden=true;b.emit('visibilitychange');b.c.document.hidden=false;b.emit('visibilitychange');b.rejections[0]();assert.ok(!b.removed());b.rejections[1]();assert.ok(b.removed())});
test('intro video stays muted, optional, proportional and outside mandatory offline cache',()=>{assert.match(read('index.html'),/muted playsinline/);assert.match(read('haruman-intro.css'),/object-fit:contain/);assert.doesNotMatch(read('sw.js').match(/const SHELL=.*?;/s)[0],/assets\/video\/|intro-v\d+\.(mp4|webm)/);assert.ok(read('sw.js').includes("url.pathname.includes('/assets/video/')"));assert.ok(read('sw.js').includes("url.pathname.includes('/assets/audio/haruman-intro-')"));assert.doesNotMatch(read('haruman-intro.js'),/localStorage/)});

test('only ended starts the 300ms whiteout, 1000ms title and 200ms exit in order',()=>{
  const b=boot();b.emit('loadeddata');b.tick(2000);
  assert.ok(!b.classes.has('harumanIntroWhiteout'));assert.ok(!b.classes.has('harumanIntroShowingTitle'));
  b.emit('ended');assert.ok(b.classes.has('harumanIntroWhiteout'));
  b.tick(299);assert.ok(!b.classes.has('harumanIntroShowingTitle'));
  b.tick(1);assert.ok(b.classes.has('harumanIntroShowingTitle'));
  b.tick(999);assert.ok(!b.classes.has('harumanIntroLeaving'));assert.ok(!b.removed());
  b.tick(1);assert.ok(b.classes.has('harumanIntroLeaving'));
  b.tick(199);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());
});
test('backgrounding the title pauses the remaining presentation without replaying video',()=>{
  const b=boot();b.emit('ended');b.tick(1000);
  b.c.document.hidden=true;b.emit('visibilitychange');assert.ok(b.classes.has('harumanIntroPaused'));
  b.tick(30000);assert.ok(!b.removed());assert.ok(!b.classes.has('harumanIntroLeaving'));
  b.c.document.hidden=false;b.emit('visibilitychange');assert.ok(!b.classes.has('harumanIntroPaused'));
  assert.equal(b.plays(),1);b.tick(299);assert.ok(!b.classes.has('harumanIntroLeaving'));
  b.tick(1);assert.ok(b.classes.has('harumanIntroLeaving'));b.tick(200);assert.ok(b.removed());
});
test('an unavailable title image leaves a readable fallback and never strands startup',()=>{
  const b=boot({titleLoaded:false});assert.ok(!b.classes.has('harumanIntroTitleReady'));
  b.emit('ended');b.tick(300);assert.ok(b.classes.has('harumanIntroShowingTitle'));
  b.tick(1200);assert.ok(b.removed());
  const late=boot({titleLoaded:false});late.title.naturalWidth=1448;late.titleEvents.load();
  assert.ok(late.classes.has('harumanIntroTitleReady'));
});
test('completion ignores late media errors and stale play rejections',()=>{
  const b=boot();b.emit('ended');b.emit('error');b.rejections[0]();b.emit('ended');
  b.tick(1000);assert.ok(!b.removed());assert.ok(b.classes.has('harumanIntroShowingTitle'));
  b.tick(499);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());assert.equal(b.loads(),1);
});

test('a normal 2.8s video reaches home at 4.3s without cutting the video short',()=>{
  const b=boot();b.emit('loadeddata');b.emit('playing');
  b.tick(2799);assert.ok(!b.classes.has('harumanIntroWhiteout'));assert.ok(!b.removed());
  b.tick(1);b.video.currentTime=2.8;b.emit('ended');
  b.tick(1499);assert.equal(b.now(),4299);assert.ok(!b.removed());
  b.tick(1);assert.equal(b.now(),4300);assert.ok(b.removed());
});

for(const [stage,elapsed,remaining] of [['whiteout',150,1350],['exit',1400,100]]){
  test('backgrounding during '+stage+' preserves the remaining faster flow',()=>{
    const b=boot();b.emit('ended');b.tick(elapsed);
    b.c.document.hidden=true;b.emit('visibilitychange');
    b.tick(30000);assert.ok(!b.removed());assert.ok(b.classes.has('harumanIntroPaused'));
    b.c.document.hidden=false;b.emit('visibilitychange');
    assert.ok(!b.classes.has('harumanIntroPaused'));assert.equal(b.plays(),1);
    b.tick(remaining-1);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());
  });
}

test('CSS durations match the faster stages and preserve the warm-white and pause contracts',()=>{
  const css=read('haruman-intro.css');
  assert.match(css,/background:#f7f8f4/);
  assert.match(css,/harumanWhiteout 300ms/);
  assert.match(css,/harumanTitleIn 250ms/);
  assert.match(css,/harumanIntroOut 200ms/);
  assert.match(css,/\.harumanIntroPaused:before,\.harumanIntroPaused \.harumanIntroTitle\{animation-play-state:paused\}/);
});

test('browser timing checks reject old or shortened stages without imposing a playback deadline',async()=>{
  const {assertIntroTimeline}=await import('../scripts/haruman-intro-checks.mjs');
  const result={ended:2800,mediaDuration:2.8,mediaEndedAt:2.8,whiteout:2800,title:3100,leaving:4100,removed:4300};
  assert.doesNotThrow(()=>assertIntroTimeline(result));
  assert.throws(()=>assertIntroTimeline({...result,title:3400,leaving:5000,removed:5300}),/whiteout takes about 300ms/);
  assert.throws(()=>assertIntroTimeline({...result,leaving:3700,removed:3900}),/title includes 1000ms/);
  assert.throws(()=>assertIntroTimeline({...result,mediaEndedAt:2}),/final video frame/);
  assert.throws(()=>assertIntroTimeline({...result,ended:null}),/end naturally/);
  const delayed={...result};
  for(const stage of ['ended','whiteout','title','leaving','removed'])delayed[stage]+=15000;
  assert.doesNotThrow(()=>assertIntroTimeline(delayed));
});

test('v3 video sources match the verified release assets and preserve prior compatibility files',()=>{
  const {createHash}=require('node:crypto');
  assert.equal(boot().video.src,'assets/video/haruman-intro-v3.webm');
  assert.equal(boot({webm:false}).video.src,'assets/video/haruman-intro-v3.mp4');
  for(const [ext,size,sha256] of [
    ['mp4',297089,'e77976bb23a2894abbe71ca30fac105f7fe522bdb89c2817598118fcc1be5d51'],
    ['webm',920340,'acba198d4c3f7da5776be11f85d88f63bae8c9b3d8e65e9d457626aa0a864435']
  ]){
    const file=fs.readFileSync(path.join(__dirname,'..','assets','video','haruman-intro-v3.'+ext));
    assert.equal(file.length,size);assert.equal(createHash('sha256').update(file).digest('hex'),sha256);
    assert.ok(fs.statSync(path.join(__dirname,'..','assets','video','haruman-intro-v1.'+ext)).size>0);
    assert.ok(fs.statSync(path.join(__dirname,'..','assets','video','haruman-intro-v2.'+ext)).size>0);
  }
});

test('v168 compatibility media remain byte-identical after the v169 upgrade',()=>{
  const {createHash}=require('node:crypto');
  for(const [ext,sha256] of [
    ['mp4','7ba8d8bd17780082d709e6060b75a229ec75bd4561b57b855b2bc7fc52cf72f1'],
    ['webm','bab21e4462a05b2b45b26956b63de1c63918d51b1d9f2102b96ca210668f16c3']
  ]){
    const file=fs.readFileSync(path.join(__dirname,'..','assets','video','haruman-intro-v2.'+ext));
    assert.equal(createHash('sha256').update(file).digest('hex'),sha256);
  }
});


test('optional character sound follows media offset and title sound follows actual title entry',async()=>{
  const b=boot({sound:true});const [character,title]=b.audios;
  b.video.currentTime=.65;b.video.playbackRate=.5;b.emit('playing');
  assert.equal(character.requests.length,1);assert.equal(character.requests[0].offset,.65);assert.equal(character.requests[0].rate,.5);
  b.tick(5000);assert.equal(title.requests.length,0);assert.ok(!b.removed());
  b.emit('ended');assert.equal(character.paused,true);b.tick(299);assert.equal(title.requests.length,0);
  b.tick(1);assert.equal(title.requests.length,1);assert.equal(title.requests[0].offset,0);
  b.tick(1200);await Promise.resolve();assert.ok(b.removed());assert.ok(b.audios.every(a=>a.paused));
});
test('audio autoplay rejection and synchronous failure never dismiss a healthy intro',async()=>{
  for(const soundMode of ['reject','throw']){
    const b=boot({sound:true,soundMode});b.emit('playing');await Promise.resolve();
    assert.ok(!b.removed());b.tick(2000);b.emit('ended');b.tick(300);await Promise.resolve();
    assert.ok(!b.removed());b.tick(1199);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());
  }
});
test('late audio play promises cannot leak over another phase or Home',async()=>{
  const b=boot({sound:true,soundMode:'pending'});b.emit('playing');const character=b.audios[0];
  b.emit('ended');b.tick(300);character.requests[0].resolve();await Promise.resolve();assert.equal(character.paused,true);
  const title=b.audios[1];b.tick(1200);title.requests[0].resolve();await Promise.resolve();assert.equal(title.paused,true);assert.ok(b.removed());
});
test('late decoded audio joins the current frame or is discarded after that phase',()=>{
  const b=boot({sound:true,soundReady:false});const [character,title]=b.audios;b.emit('playing');
  b.video.currentTime=1.6;character.readyState=4;character.events.canplay();assert.equal(character.requests[0].offset,1.6);
  b.emit('ended');b.tick(700);title.readyState=4;title.events.canplay();assert.equal(title.requests[0].offset,.4);
  b.tick(800);character.events.canplay();title.events.canplay();assert.equal(character.requests.length,1);assert.equal(title.requests.length,1);
});
test('character sound pauses with buffering and follows resumed playback and rate changes',()=>{
  const b=boot({sound:true});b.emit('playing');const a=b.audios[0];b.emit('waiting');assert.equal(a.paused,true);
  b.video.currentTime=1.2;b.emit('playing');assert.equal(a.requests[1].offset,1.2);
  b.video.playbackRate=.25;b.emit('ratechange');assert.equal(a.requests[2].rate,.25);
});
test('backgrounding pauses sound and resumes only at the remaining stage offset',()=>{
  const b=boot({sound:true});b.video.currentTime=.8;b.emit('playing');
  b.c.document.hidden=true;b.emit('visibilitychange');assert.ok(b.audios.every(a=>a.paused));b.tick(10000);
  b.c.document.hidden=false;b.emit('visibilitychange');b.emit('playing');assert.equal(b.audios[0].requests[1].offset,.8);
  b.emit('ended');b.tick(500);b.c.document.hidden=true;b.emit('visibilitychange');b.tick(10000);
  b.c.document.hidden=false;b.emit('visibilitychange');assert.equal(b.audios[1].requests[1].offset,.2);
  b.tick(1000);assert.ok(b.removed());assert.ok(b.audios.every(a=>a.paused));
});
test('existing click can retry blocked sound without restarting or skipping the video',async()=>{
  const b=boot({sound:true,soundMode:'reject'});b.emit('playing');await Promise.resolve();
  b.video.currentTime=1.4;const plays=b.plays();b.gesture();await Promise.resolve();
  assert.equal(b.audios[0].requests[1].offset,1.4);assert.equal(b.plays(),plays);assert.ok(!b.removed());
  b.emit('ended');b.tick(1500);b.gesture();assert.equal(b.audios[0].requests.length,2);
});
test('MP4 fallback invalidates old audio and resynchronizes at its current frame',async()=>{
  const b=boot({sound:true,soundMode:'pending',alpha:255});b.emit('playing');const a=b.audios[0];
  b.emit('loadeddata');assert.ok(a.paused);b.video.currentTime=0;b.emit('playing');
  a.requests[0].reject(Error('stale'));await Promise.resolve();assert.equal(a.paused,false);assert.equal(a.requests[1].offset,0);
});
test('optional audio errors do not dismiss or alter video presentation',()=>{
  const b=boot({sound:true});b.emit('playing');b.audios[0].events.error();assert.ok(!b.removed());
  b.emit('ended');b.tick(300);b.audios[1].events.error();assert.ok(!b.removed());b.tick(1200);assert.ok(b.removed());
});
test('reduced motion and data saver bypass optional audio creation',()=>{
  for(const opt of [{reduced:true},{saveData:true}]){const b=boot({sound:true,...opt});assert.equal(b.audios.length,0);assert.ok(b.removed())}
});

test('canplay, ratechange and existing clicks cannot restart sound during video buffering',()=>{
  const b=boot({sound:true});b.emit('playing');const a=b.audios[0];b.emit('waiting');
  a.events.canplay();b.gesture();b.emit('ratechange');assert.equal(a.requests.length,1);assert.equal(a.paused,true);
  b.video.currentTime=1;b.emit('playing');assert.equal(a.requests.length,2);assert.equal(a.requests[1].offset,1);
});
test('pending audio starts are resynchronized to the current frame and title stage',async()=>{
  const b=boot({sound:true,soundMode:'pending'});b.emit('playing');const [character,title]=b.audios;
  b.video.currentTime=1.8;character.requests[0].resolve();await Promise.resolve();assert.equal(character.currentTime,1.8);
  b.emit('ended');b.tick(900);title.requests[0].resolve();await Promise.resolve();assert.equal(title.currentTime,.6);
  b.tick(600);assert.ok(b.removed());assert.equal(title.paused,true);
});

test('a direct video pause silences character sound until real playback resumes',()=>{
  const b=boot({sound:true});b.emit('playing');const a=b.audios[0];b.video.paused=true;b.emit('pause');
  a.events.canplay();b.gesture();assert.equal(a.requests.length,1);assert.equal(a.paused,true);
  b.video.currentTime=1.3;b.emit('playing');assert.equal(a.requests[1].offset,1.3);
});

test('audio buffering resumes at the current video frame rather than a stale sound offset',()=>{
  const b=boot({sound:true});b.emit('playing');const a=b.audios[0];a.currentTime=.4;
  a.events.waiting();assert.equal(a.paused,true);b.video.currentTime=1.6;a.events.canplay();
  assert.equal(a.requests.length,2);assert.equal(a.requests[1].offset,1.6);
});

test('late title audio is discarded after its cue window without blocking Home',async()=>{
  const delayed=boot({sound:true,soundReady:false});delayed.emit('ended');delayed.tick(1500);
  const cue=delayed.audios[1];cue.readyState=4;cue.events.canplay();assert.equal(cue.requests.length,0);assert.ok(delayed.removed());
  const pending=boot({sound:true,soundMode:'pending'});pending.emit('ended');pending.tick(1500);
  pending.audios[1].requests[0].resolve();await Promise.resolve();assert.equal(pending.audios[1].paused,true);
});
test('late title decode joins the remaining 1.2-second tail instead of replaying its start',()=>{
  const b=boot({sound:true,soundReady:false});b.emit('ended');b.tick(1400);
  const title=b.audios[1];title.readyState=4;title.events.canplay();
  assert.equal(title.requests.length,1);assert.equal(title.requests[0].offset,1.1);
  assert.ok(b.classes.has('harumanIntroLeaving'));assert.equal(title.paused,false);
  b.tick(99);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());assert.equal(title.paused,true);
});
test('the title sound plays through the 200ms exit and is released exactly at Home',async()=>{
  const b=boot({sound:true});b.emit('ended');b.tick(300);await Promise.resolve();
  const title=b.audios[1];assert.equal(title.duration,1.2);assert.equal(title.requests.length,1);
  b.tick(999);assert.ok(!b.classes.has('harumanIntroLeaving'));assert.equal(title.paused,false);
  b.tick(1);assert.ok(b.classes.has('harumanIntroLeaving'));assert.equal(title.paused,false);
  b.tick(199);assert.equal(title.paused,false);assert.ok(!b.removed());
  b.tick(1);assert.ok(b.removed());assert.equal(title.paused,true);assert.equal(title.src,undefined);
});
test('ordinary title readiness, clicks and duplicate completion cannot replay its cue',()=>{
  const b=boot({sound:true});b.emit('ended');b.tick(300);const title=b.audios[1];
  for(let i=0;i<3;i++){title.events.canplay();b.gesture();b.emit('ended')}
  b.tick(1000);title.events.canplay();b.gesture();
  assert.equal(title.requests.length,1);assert.equal(title.requests[0].offset,0);
  b.tick(200);assert.ok(b.removed());assert.equal(title.paused,true);
});
test('backgrounding in the title exit resumes only its final 100ms',()=>{
  const b=boot({sound:true});b.emit('ended');b.tick(1400);const title=b.audios[1];
  b.c.document.hidden=true;b.emit('visibilitychange');b.tick(30000);
  assert.equal(title.paused,true);assert.ok(!b.removed());
  b.c.document.hidden=false;b.emit('visibilitychange');
  assert.equal(title.requests.length,2);assert.equal(title.requests[1].offset,1.1);
  b.tick(99);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());assert.equal(title.paused,true);
});
test('small audio clock differences do not trigger redundant seeks',async()=>{
  const b=boot({sound:true,soundMode:'pending'});b.video.currentTime=.5;b.emit('playing');
  const a=b.audios[0];b.video.currentTime=.53;a.requests[0].resolve();await Promise.resolve();assert.equal(a.currentTime,.5);
});
test('optional SFX assets match the authorized B+FX release files',()=>{
  const {createHash}=require('node:crypto');
  for(const [kind,size,hash] of [
    ['character',91436,'4301c0024249f1cd878b7f9abe2571f74aeb173680a9e7ee5976f2f86f77b2c1'],
    ['title',39980,'5a4e0d7a64abbf7a43cf0b5e440f3a248027fd9c20e7b8bd279419839deaf12b']
  ]){
    const file=fs.readFileSync(path.join(__dirname,'..','assets/audio/haruman-intro-v3-'+kind+'.mp3'));
    assert.equal(file.length,size);assert.equal(createHash('sha256').update(file).digest('hex'),hash);
  }
});

test('browser audio contracts require real native playback or explicitly silent synthetic evidence',async()=>{
  const {assertIntroAudioTrace}=await import('../scripts/haruman-intro-checks.mjs');
  const timeline={ended:2800};
  const trace={unhandled:[],items:[{kind:'character',duration:2.8,exitOffset:2.8,paused:true,released:true},{kind:'title',duration:1.224,exitOffset:1.17,paused:true,released:true}],
    events:[{kind:'character',type:'loadedmetadata'},{kind:'title',type:'loadedmetadata'}],
    calls:[{kind:'character',at:300,state:'played',titleVisible:false},{kind:'title',at:3100,state:'played',titleVisible:true}]};
  assert.doesNotThrow(()=>assertIntroAudioTrace(trace,timeline));
  assert.throws(()=>assertIntroAudioTrace({...trace,items:[{paused:false,released:true},trace.items[1]]},timeline),/stopped and released/);
  assert.throws(()=>assertIntroAudioTrace({...trace,calls:trace.calls.map(c=>({...c,at:c.kind==='title'?2900:c.at}))},timeline),/actual ended/);
  assert.throws(()=>assertIntroAudioTrace({...trace,calls:trace.calls.map(c=>({...c,state:'rejected'}))},timeline),/really started/);
  assert.throws(()=>assertIntroAudioTrace({...trace,items:[trace.items[0],{...trace.items[1],duration:.65}]},timeline),/1.2-second PCM tail/);
  assert.throws(()=>assertIntroAudioTrace({...trace,items:[trace.items[0],{...trace.items[1],exitOffset:1.0}]},timeline),/200ms exit/);
  assert.throws(()=>assertIntroAudioTrace({...trace,calls:[...trace.calls,{...trace.calls[1]}]},timeline),/exactly one cue/);
  const synthetic={...trace,calls:trace.calls.map(c=>({...c,state:'synthetic-denied'}))};
  assert.doesNotThrow(()=>assertIntroAudioTrace(synthetic,timeline,{mode:'denied'}));
  assert.throws(()=>assertIntroAudioTrace({...synthetic,events:[...synthetic.events,{kind:'character',type:'playing'}]},timeline,{mode:'denied'}),/never start native/);
});


test('reinitialization during playback and after disposal never duplicates video or audio owners',()=>{
 const b=boot({sound:true});b.emit('playing');const owner=b.c.HARUMAN_INTRO;
 for(let i=0;i<3;i++)vm.runInNewContext(read('haruman-intro.js'),b.c);
 assert.equal(b.plays(),1);assert.equal(b.audios.length,2);assert.equal(b.audios[0].requests.length,1);assert.equal(b.c.HARUMAN_INTRO,owner);
 b.emit('ended');b.tick(1500);vm.runInNewContext(read('haruman-intro.js'),b.c);assert.equal(b.plays(),1);assert.ok(b.removed());
});
test('worker reload waits for natural completion and is consumed only on the matching reload',async()=>{
 const first=boot({sound:true});first.emit('playing');const waiting=first.c.HARUMAN_INTRO.prepareReload('172');assert.ok(!first.removed());first.emit('ended');first.tick(1499);assert.ok(!first.removed());first.tick(1);await waiting;
 assert.ok(first.removed());assert.ok(first.audios.every(a=>a.paused));assert.deepEqual(JSON.parse(first.seen()),{version:'172'});
 const second=boot({reloadMarker:JSON.parse(first.seen()),navigation:'reload',sound:true});assert.equal(second.plays(),0);assert.equal(second.audios.length,0);assert.ok(second.removed());
 assert.equal(boot({navigation:'reload'}).plays(),1,'ordinary later refresh is a new entry');
 assert.equal(boot({reloadMarker:{version:'172'},navigation:'navigate'}).plays(),1);
 assert.equal(boot({reloadMarker:{version:'171'},navigation:'reload'}).plays(),1);
});
test('recovery during whiteout or title is immediate and repeated cleanup is harmless',()=>{
 for(const delay of [0,400]){const b=boot({sound:true});b.emit('playing');b.emit('ended');b.tick(delay);b.c.HARUMAN_INTRO.finish(true);b.c.HARUMAN_INTRO.finish(true);b.tick(10000);assert.ok(b.removed());assert.equal(b.loads(),1);assert.ok(b.audios.every(a=>a.paused));}
});
test('history fallback preserves unrelated state when session storage is unavailable',()=>{
 const b=boot({storageFails:true,sound:true});let state={route:'keep',learning:{score:7}};b.c.history={get state(){return state},replaceState(value){state=value}};
 b.c.HARUMAN_INTRO.prepareReload('172');assert.equal(state.route,'keep');assert.equal(state.learning.score,7);assert.equal(state.harumalIntroReload.version,'172');assert.ok(!b.removed());b.emit('ended');b.tick(1500);assert.ok(b.removed());
});
