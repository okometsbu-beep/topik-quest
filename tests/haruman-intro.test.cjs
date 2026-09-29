const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function boot({recent=false,reduced=false,saveData=false,webm=true,alpha=0,reject=false,storageFails=false,titleLoaded=true}={}){
  let clock=0,id=0,removed=false,plays=0,loads=0,pauses=0,seen=null;
  const titleEvents={},title={naturalWidth:titleLoaded?1448:0,addEventListener:(k,fn)=>titleEvents[k]=fn};
  const timers=new Map(),events={},panelEvents={},classes=new Set(),rejections=[];
  const video={currentTime:0,style:{},muted:false,addEventListener:(k,fn)=>events[k]=fn,canPlayType:()=>webm?'probably':'',play(){plays++;return{catch(fn){rejections.push(fn);if(reject)fn()}}},pause(){pauses++},load(){loads++},removeAttribute(){delete this.src}};
  const panel={style:{},classList:{add:v=>classes.add(v),toggle:(v,on)=>on?classes.add(v):classes.delete(v)},addEventListener:(k,fn)=>panelEvents[k]=fn,remove(){removed=true}};
  const c={performance:{now:()=>clock},navigator:{connection:{saveData}},matchMedia:()=>({matches:reduced}),sessionStorage:{getItem(){if(storageFails)throw Error();return recent?String(Date.now()):null},setItem(k,v){if(storageFails)throw Error();seen=v}},setTimeout(fn,ms){timers.set(++id,{fn,at:clock+ms});return id},clearTimeout:id=>timers.delete(id),document:{hidden:false,documentElement:{classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)}},querySelector:()=>panel,getElementById:id=>id==='harumanIntroTitle'?title:video,addEventListener:(k,fn)=>events[k]=fn,removeEventListener:k=>delete events[k],createElement:()=>({getContext:()=>({drawImage(){},getImageData:()=>({data:[0,0,0,alpha]})})})}};c.window=c;
  vm.runInNewContext(read('haruman-intro.js'),c);
  const tick=ms=>{const end=clock+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;clock=next[1].at;timers.delete(next[0]);next[1].fn()}clock=end};
  return{video,title,titleEvents,c,classes,tick,emit:k=>events[k]?.(),click:()=>panelEvents.click?.(),escape:()=>panelEvents.keydown?.({key:'Escape'}),removed:()=>removed,plays:()=>plays,loads:()=>loads,pauses:()=>pauses,seen:()=>seen,rejections};
}
test('transparent playback completes the title sequence and releases media',()=>{const b=boot();assert.match(b.video.src,/webm$/);b.emit('loadeddata');b.emit('playing');assert.equal(b.video.style.opacity,'1');b.emit('ended');assert.ok(!b.removed());b.tick(2500);assert.ok(b.removed());assert.equal(b.video.src,undefined)});
test('opaque WebM decoder or unsupported codec chooses matching MP4',()=>{const b=boot({alpha:255});b.emit('loadeddata');assert.match(b.video.src,/mp4$/);b.emit('loadeddata');assert.equal(b.video.style.opacity,'1');assert.match(boot({webm:false}).video.src,/mp4$/)});
test('click and Escape cannot skip; no skip button is shipped',()=>{const b=boot();b.click();b.escape();b.tick(220);assert.ok(!b.removed());assert.equal(b.pauses(),0);const intro=read('index.html').split('<script src="haruman-intro.js')[0];assert.doesNotMatch(intro,/<button|Skip|건너뛰기/);assert.equal(b.c.HARUMAN_INTRO,undefined)});
test('load error and denied autoplay immediately dispose',()=>{const b=boot();b.emit('error');assert.ok(b.removed());assert.ok(boot({reject:true}).removed())});
test('delayed loading and playback beyond the old deadline wait for ended',()=>{const b=boot();b.tick(4500);assert.ok(!b.removed());b.emit('loadeddata');b.emit('playing');b.video.currentTime=1;b.emit('timeupdate');b.tick(4500);assert.ok(!b.removed());assert.ok(!b.classes.has('harumanIntroLeaving'));b.emit('ended');assert.ok(b.classes.has('harumanIntroWhiteout'));assert.ok(!b.classes.has('harumanIntroLeaving'));b.tick(2500);assert.ok(b.removed())});
test('healthy playback is never cut off by total elapsed duration',()=>{const b=boot();for(let i=1;i<=30;i++){b.tick(1000);b.video.currentTime=i/20;b.emit('timeupdate');assert.ok(!b.removed())}b.emit('ended');b.tick(2500);assert.ok(b.removed())});
test('only 15 seconds without playback progress triggers recovery',()=>{const b=boot();b.tick(14999);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());const s=boot();s.video.currentTime=1;s.emit('timeupdate');s.tick(10000);s.emit('timeupdate');s.tick(5000);assert.ok(s.removed());assert.equal(s.seen(),null)});
test('recent launch does not skip; reduced motion and save-data remain respected',()=>{const returning=boot({recent:true});assert.equal(returning.plays(),1);assert.ok(!returning.removed());for(const opts of [{reduced:true},{saveData:true}]){const b=boot(opts);assert.equal(b.plays(),0);assert.ok(b.removed())}});
test('backgrounding pauses and resumes without discarding unfinished playback',()=>{const b=boot({storageFails:true});b.video.currentTime=1;b.emit('timeupdate');b.c.document.hidden=true;b.emit('visibilitychange');assert.equal(b.pauses(),1);b.tick(20000);assert.ok(!b.removed());b.c.document.hidden=false;b.emit('visibilitychange');assert.equal(b.plays(),2);assert.equal(b.video.currentTime,1);b.emit('ended');b.tick(2500);assert.ok(b.removed())});
test('duplicate completion is harmless and no launch-skip state is recorded',()=>{const b=boot();b.emit('ended');b.tick(2500);b.emit('ended');assert.equal(b.loads(),1);assert.equal(b.seen(),null)});
test('replaced WebM play rejection cannot dismiss the MP4 fallback',()=>{const b=boot({alpha:255});b.emit('loadeddata');b.rejections[0]();assert.ok(!b.removed());assert.match(b.video.src,/mp4$/);b.emit('ended');b.tick(2500);assert.ok(b.removed())});
test('background pause rejection cannot dismiss resumed playback',()=>{const b=boot();b.c.document.hidden=true;b.emit('visibilitychange');b.c.document.hidden=false;b.emit('visibilitychange');b.rejections[0]();assert.ok(!b.removed());b.rejections[1]();assert.ok(b.removed())});
test('intro is optional, audio-free, proportional and outside mandatory offline cache',()=>{assert.match(read('index.html'),/muted playsinline/);assert.match(read('haruman-intro.css'),/object-fit:contain/);assert.doesNotMatch(read('sw.js').match(/const SHELL=.*?;/s)[0],/intro-v1\.(mp4|webm)/);assert.ok(read('sw.js').includes("url.pathname.includes('/assets/video/')"));assert.doesNotMatch(read('haruman-intro.js'),/localStorage/)});

test('only ended starts whiteout, then title, hold and home in order',()=>{
  const b=boot();b.emit('loadeddata');b.tick(2000);
  assert.ok(!b.classes.has('harumanIntroWhiteout'));assert.ok(!b.classes.has('harumanIntroShowingTitle'));
  b.emit('ended');assert.ok(b.classes.has('harumanIntroWhiteout'));
  b.tick(599);assert.ok(!b.classes.has('harumanIntroShowingTitle'));
  b.tick(1);assert.ok(b.classes.has('harumanIntroShowingTitle'));
  b.tick(1599);assert.ok(!b.classes.has('harumanIntroLeaving'));assert.ok(!b.removed());
  b.tick(1);assert.ok(b.classes.has('harumanIntroLeaving'));
  b.tick(299);assert.ok(!b.removed());b.tick(1);assert.ok(b.removed());
});
test('backgrounding the title pauses the remaining presentation without replaying video',()=>{
  const b=boot();b.emit('ended');b.tick(1000);
  b.c.document.hidden=true;b.emit('visibilitychange');assert.ok(b.classes.has('harumanIntroPaused'));
  b.tick(30000);assert.ok(!b.removed());assert.ok(!b.classes.has('harumanIntroLeaving'));
  b.c.document.hidden=false;b.emit('visibilitychange');assert.ok(!b.classes.has('harumanIntroPaused'));
  assert.equal(b.plays(),1);b.tick(1199);assert.ok(!b.classes.has('harumanIntroLeaving'));
  b.tick(1);assert.ok(b.classes.has('harumanIntroLeaving'));b.tick(300);assert.ok(b.removed());
});
test('an unavailable title image leaves a readable fallback and never strands startup',()=>{
  const b=boot({titleLoaded:false});assert.ok(!b.classes.has('harumanIntroTitleReady'));
  b.emit('ended');b.tick(600);assert.ok(b.classes.has('harumanIntroShowingTitle'));
  b.tick(1900);assert.ok(b.removed());
  const late=boot({titleLoaded:false});late.title.naturalWidth=1448;late.titleEvents.load();
  assert.ok(late.classes.has('harumanIntroTitleReady'));
});
test('completion ignores late media errors and stale play rejections',()=>{
  const b=boot();b.emit('ended');b.emit('error');b.rejections[0]();b.emit('ended');
  b.tick(1000);assert.ok(!b.removed());assert.ok(b.classes.has('harumanIntroShowingTitle'));
  b.tick(1500);assert.ok(b.removed());assert.equal(b.loads(),1);
});
