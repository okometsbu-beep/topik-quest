const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
function mascot(){const c={};c.window=c;vm.createContext(c);vm.runInContext(read('haruman-mascot.js'),c);return c.HARUMAN}
test('Haruman assets are eight transparent, bounded app cuts cached for offline use',()=>{
 const frames=JSON.parse(read('assets/art/haruman/manifest.json')).frames;
 assert.equal(frames.length,8);assert.equal(new Set(frames.map(f=>f.emotion)).size,8);
 let total=0;for(const f of frames){const file='assets/art/haruman/'+f.file,bytes=fs.readFileSync(path.join(root,file));assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.includes(Buffer.from('ALPH'))||bytes.includes(Buffer.from('VP8L')),'alpha channel required');assert.equal(bytes.length,f.bytes);assert.ok(read('sw.js').includes('./'+file));total+=bytes.length}
 assert.ok(total<200000,'all eight web images fit under 200KB');
});
test('Haruman whitelist cannot inject paths or expose answer hints; decoration is idempotent',()=>{
 const m=mascot();assert.equal(m.emotions.length,8);assert.ok(m.markup('../bad','<script>').includes('lesson-welcome-v2.webp'));assert.ok(!m.markup('../bad','<script>').includes('<script>'));assert.match(m.markup('correct'),/aria-hidden="true"/);
 function target(classes=[]){return{html:'',classList:{contains:c=>classes.includes(c)},querySelector(){return this.html?{}:null},insertAdjacentHTML(_where,value){this.html+=value}}}
 const good=target(['good']),bad=target(['bad']),finished=target();const screen={querySelector:s=>s==='.advFinish'?finished:null,querySelectorAll:()=>[good,bad]};
 m.decorate(screen,'travelAdventure');const before=good.html+bad.html+finished.html;m.decorate(screen,'travelAdventure');assert.equal(good.html+bad.html+finished.html,before);assert.match(good.html,/data-haruman="correct"/);assert.match(bad.html,/data-haruman="retry"/);assert.match(finished.html,/data-haruman="celebrate"/);
});

test('Approved production poses preserve alpha and fit the offline size budget',()=>{
 const frames=JSON.parse(read('assets/art/haruman/ui-manifest-v2.json')).frames;const m=mascot();assert.equal(frames.length,12);assert.equal(m.poses.length,12);
 let total=0;for(const f of frames){const file='assets/art/haruman/'+f.file,b=fs.readFileSync(path.join(root,file));assert.equal(b.toString('ascii',8,12),'WEBP');assert.ok(b.includes(Buffer.from('ALPH'))||b.includes(Buffer.from('VP8L')));assert.equal(b.length,f.bytes);assert.match(f.sourceSHA256,/^[a-f0-9]{64}$/);assert.ok(read('sw.js').includes('./'+file));assert.ok(m.markup(f.pose).includes(f.file));total+=b.length}
 assert.ok(total<200000,'12 web cuts stay below 200KB');assert.match(m.markup('home-study'),/width="480" height="320"/);
});
