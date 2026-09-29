const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function boot({recent=false,reduced=false,saveData=false,webm=true,alpha=0,reject=false,storageFails=false}={}){
  let clock=0,id=0,removed=false,plays=0,loads=0;
  const timers=new Map(),events={},panelEvents={},classes=new Set();
  const video={style:{},muted:false,addEventListener:(k,fn)=>events[k]=fn,canPlayType:()=>webm?'probably':'',play(){plays++;return{catch(fn){if(reject)fn()}}},pause(){},load(){loads++},removeAttribute(){delete this.src}};
  const panel={style:{},classList:{add:v=>classes.add(v)},addEventListener:(k,fn)=>panelEvents[k]=fn,remove(){removed=true}};
  const c={navigator:{connection:{saveData}},matchMedia:()=>({matches:reduced}),sessionStorage:{getItem(){if(storageFails)throw Error();return recent?String(Date.now()):null},setItem(){if(storageFails)throw Error()}},setTimeout(fn,ms){timers.set(++id,{fn,at:clock+ms});return id},clearTimeout:id=>timers.delete(id),document:{hidden:false,documentElement:{classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)}},querySelector:()=>panel,getElementById:()=>video,addEventListener:(k,fn)=>events[k]=fn,removeEventListener:k=>delete events[k],createElement:()=>({getContext:()=>({drawImage(){},getImageData:()=>({data:[0,0,0,alpha]})})})}};c.window=c;
  vm.runInNewContext(read('haruman-intro.js'),c);
  const tick=ms=>{const end=clock+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;clock=next[1].at;timers.delete(next[0]);next[1].fn()}clock=end};
  return{video,c,classes,tick,emit:k=>events[k]?.(),click:()=>panelEvents.click(),removed:()=>removed,plays:()=>plays,loads:()=>loads};
}
test('transparent playback finishes with fade and releases media',()=>{const b=boot();assert.match(b.video.src,/webm$/);b.emit('loadeddata');b.emit('playing');assert.equal(b.video.style.opacity,'1');b.emit('ended');assert.ok(!b.removed());b.tick(220);assert.ok(b.removed());assert.equal(b.video.src,undefined)});
test('opaque WebM decoder or unsupported codec chooses matching MP4',()=>{const b=boot({alpha:255});b.emit('loadeddata');assert.match(b.video.src,/mp4$/);b.emit('loadeddata');assert.equal(b.video.style.opacity,'1');assert.match(boot({webm:false}).video.src,/mp4$/)});
test('skip is idempotent and cannot leave a blocking panel',()=>{const b=boot();b.click();b.click();b.emit('error');b.tick(220);assert.ok(b.removed());assert.equal(b.loads(),1)});
test('load error and denied autoplay immediately dispose',()=>{const b=boot();b.emit('error');assert.ok(b.removed());assert.ok(boot({reject:true}).removed())});
test('slow loading exits in 800ms and stalled playback is bounded',()=>{const b=boot();b.tick(800);assert.ok(b.removed());const s=boot();s.emit('playing');s.tick(3600);assert.ok(s.removed())});
test('recent launch, reduced motion and save-data fetch no video',()=>{for(const opts of [{recent:true},{reduced:true},{saveData:true}]){const b=boot(opts);assert.equal(b.plays(),0);assert.ok(b.removed())}});
test('unavailable storage is harmless; backgrounding cleans up',()=>{const b=boot({storageFails:true});assert.equal(b.plays(),1);b.c.document.hidden=true;b.emit('visibilitychange');assert.ok(b.removed())});
test('intro is optional, audio-free, proportional and outside mandatory offline cache',()=>{assert.match(read('index.html'),/muted playsinline/);assert.match(read('haruman-intro.css'),/object-fit:contain/);assert.doesNotMatch(read('sw.js').match(/const SHELL=.*?;/s)[0],/intro-v1\.(mp4|webm)/);assert.ok(read('sw.js').includes("url.pathname.includes('/assets/video/')"));assert.doesNotMatch(read('haruman-intro.js'),/localStorage/)});
