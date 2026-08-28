const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

function loadWorld(){
  const runtime={window:{}};runtime.window=runtime;vm.createContext(runtime);
  vm.runInContext(read('data/travel-map-seoul-v1.js'),runtime);
  vm.runInContext(read('travel-rpg-engine.js'),runtime);
  return runtime;
}

function pathToInteraction(engine,zone,start,target,sceneId){
  const queue=[{x:start.x,y:start.y,path:[]}],seen=new Set([`${start.x},${start.y}`]);
  const entries=Object.entries(engine.directions);
  while(queue.length){
    const current=queue.shift();
    if(Math.abs(current.x-target.x)+Math.abs(current.y-target.y)<=1)return current.path;
    for(const [direction,delta] of entries){
      const x=current.x+delta.x,y=current.y+delta.y,key=`${x},${y}`;
      if(seen.has(key)||!engine.isWalkable(zone,x,y,sceneId))continue;
      seen.add(key);queue.push({x,y,path:[...current.path,direction]});
    }
  }
  return null;
}

test('Seoul travel world has a valid extensible district, zone, collision, POI, and scene contract',()=>{
  const runtime=loadWorld(),engine=runtime.MALBIT_TRAVEL_RPG,world=runtime.MALBIT_TRAVEL_WORLDS[0],zone=world.zones[0];
  assert.equal(world.id,'seoul-world-v1');
  assert.deepEqual(Array.from(world.districts,item=>item.id),['incheon-airport']);
  assert.deepEqual(Array.from(world.districts[0].zoneIds),['icn-t1-arrivals']);
  assert.equal(zone.width,12);assert.equal(zone.height,9);
  assert.equal(zone.grid.length,zone.height);
  assert.deepEqual(Array.from(engine.validateWorld(world)),[]);
  assert.ok(zone.pois.length>=3);
  assert.deepEqual(Object.keys(zone.scenes),['arrival','q-hello','q-station','q-myeongdong','transport']);
  const art=path.join(root,zone.background);
  assert.ok(fs.existsSync(art),'the production map asset must exist');
  assert.ok(fs.statSync(art).size>100000,'the map must be real pixel art, not a tiny placeholder');
  for(const [sceneId,target] of Object.entries(zone.scenes)){
    const progress=engine.normalizeProgress('route-001-airport-myeongdong',null,sceneId);
    assert.ok(pathToInteraction(engine,zone,progress,target,sceneId),`${sceneId} must be reachable from the zone spawn`);
  }
});

test('movement blocks scenery, preserves direction and discoveries, and prioritizes the active event',()=>{
  const runtime=loadWorld(),engine=runtime.MALBIT_TRAVEL_RPG,zone=runtime.MALBIT_TRAVEL_WORLDS[0].zones[0];
  let progress=engine.normalizeProgress('route-001-airport-myeongdong',{discoveries:['icn-t1-arrivals:baggage-carousel']},'arrival');
  assert.deepEqual(Array.from(progress.discoveries),['icn-t1-arrivals:baggage-carousel']);
  progress={...progress,x:1,y:1,direction:'down'};
  const blocked=engine.step(zone,progress,'up','arrival');
  assert.equal(blocked.moved,false);assert.equal(blocked.blocked,true);assert.equal(blocked.progress.direction,'up');
  const target=zone.scenes.arrival,path=pathToInteraction(engine,zone,zone.spawn,target,'arrival');
  progress=engine.normalizeProgress('route-001-airport-myeongdong',null,'arrival');
  for(const direction of path)progress=engine.step(zone,progress,direction,'arrival').progress;
  const interaction=engine.interactionAt(zone,progress,'arrival');
  assert.equal(interaction.type,'scene');assert.equal(interaction.target.sceneId,'arrival');
});

test('Travel runtime layers exploration over the existing event flow and saves one-time investigations',()=>{
  const storage=new Map(),screen={className:'screen',innerHTML:''},classes=new Set();
  const runtime={
    console,S:{lang:'ko',view:'home'},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},
    document:{body:{classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name),remove:(...names)=>names.forEach(name=>classes.delete(name))}},documentElement:{style:{}},getElementById:id=>id==='screen'?screen:null,querySelector:()=>null},
    renderShell:()=>{},navActive:()=>{},hideSelection:()=>{},flagMenu:()=>{},toast:()=>{},confirm:()=>true,speechSynthesis:{cancel:()=>{}},requestAnimationFrame:callback=>callback()
  };
  runtime.window=runtime;runtime.render=()=>{};runtime.setView=view=>{runtime.S.view=view;runtime.render()};vm.createContext(runtime);
  for(let part=1;part<=4;part++)vm.runInContext(read(`data/question-bank-v1-part${part}.js`),runtime);
  for(const file of ['data/question-bank-practice-v1.js','question-bank-engine.js','data/travel-pack-seoul-001.js','data/travel-myeongdong-hub.js','data/travel-map-seoul-v1.js','travel-rpg-engine.js','travel-mode.js'])vm.runInContext(read(file),runtime);
  runtime.malbitTravelStart('route-001-airport-myeongdong',false);
  assert.match(screen.innerHTML,/travelRpgCard/);assert.match(screen.innerHTML,/airport-arrivals-map-v1\.webp/);assert.match(screen.innerHTML,/한국 여행이 시작됐다/);
  for(const direction of ['left','left','up','up'])runtime.malbitTravelStep(direction);
  assert.match(screen.innerHTML,/수하물 벨트/);
  runtime.malbitTravelInteract();
  assert.match(screen.innerHTML,/수하물 찾는 곳/);assert.match(screen.innerHTML,/\+200원/);
  let state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79200);assert.deepEqual(state.exploration.discoveries,['icn-t1-arrivals:baggage-carousel']);
  runtime.malbitTravelInteract();
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79200,'an investigated POI never pays twice');
  runtime.malbitTravelCloseDiscovery();
  const zone=runtime.MALBIT_TRAVEL_WORLDS[0].zones[0],engine=runtime.MALBIT_TRAVEL_RPG,target=zone.scenes.arrival;
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  for(const direction of pathToInteraction(engine,zone,state.exploration,target,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();
  assert.match(screen.innerHTML,/travelSceneCard/);assert.match(screen.innerHTML,/어서 오세요/);
  runtime.malbitTravelCloseEvent();assert.match(screen.innerHTML,/travelRpgCard/);
  const after=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.ok(after.exploration.steps>0);assert.equal(after.exploration.worldId,'seoul-world-v1');
});

test('Travel styles expose separate light and dark theme tokens without forcing a scheme at render time',()=>{
  const css=read('styles.css'),runtime=read('travel-mode.js');
  assert.match(css,/html\[data-theme="light"\] body\.travel-active/);
  assert.match(css,/--travel-canvas:#071321/);assert.match(css,/--travel-canvas:#eef3fb/);
  assert.match(css,/\.travelRpgViewport/);assert.match(css,/\.travelRpgDpad button/);
  assert.doesNotMatch(runtime,/document\.documentElement\.style\.colorScheme='dark'/);
});
