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
  assert.deepEqual(Array.from(world.districts[0].zoneIds),['icn-t1-arrivals','icn-t1-transport-center','icn-t1-airport-rail-concourse']);
  assert.deepEqual(Array.from(world.zones, item=>item.id),['icn-t1-arrivals','icn-t1-transport-center','icn-t1-airport-rail-concourse']);
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
  const transport=engine.zoneById(world,'icn-t1-transport-center');
  assert.equal(transport.pois.length,1);assert.equal(transport.pois[0].id,'transport-center-sign');
  const rail=engine.zoneById(world,'icn-t1-airport-rail-concourse');
  assert.equal(rail.pois.length,1);assert.equal(rail.pois[0].id,'boarding-direction-sign');
  assert.ok(pathToInteraction(engine,rail,rail.spawn,rail.pois[0],null),'the boarding-direction sign must be reachable');
  assert.equal(zone.portals.length,1);assert.equal(transport.portals.length,2);assert.equal(rail.portals.length,1);
  assert.equal(zone.portals[0].connectionId,transport.portals[0].connectionId,'both endpoints form one connection');
  const transportArt=path.join(root,transport.background);
  assert.ok(fs.existsSync(transportArt));assert.ok(fs.statSync(transportArt).size>80000);
  const railArt=path.join(root,rail.background);
  assert.ok(fs.existsSync(railArt));assert.ok(fs.statSync(railArt).size>80000);
});

test('the airport portal moves both ways while preserving route progress',()=>{
  const runtime=loadWorld(),engine=runtime.MALBIT_TRAVEL_RPG,world=runtime.MALBIT_TRAVEL_WORLDS[0];
  const arrivals=engine.zoneById(world,'icn-t1-arrivals'),transport=engine.zoneById(world,'icn-t1-transport-center');
  let progress=engine.normalizeProgress('route-001-airport-myeongdong',{discoveries:['icn-t1-arrivals:baggage-carousel'],steps:7},'arrival');
  const outward=arrivals.portals[0];
  progress=engine.enterPortal(world,progress,outward);
  assert.equal(progress.zoneId,'icn-t1-transport-center');assert.equal(progress.steps,7);
  assert.deepEqual(Array.from(progress.discoveries),['icn-t1-arrivals:baggage-carousel']);
  assert.equal(engine.contextForProgress('route-001-airport-myeongdong',progress,'arrival').zone.id,transport.id);
  progress=engine.enterPortal(world,progress,transport.portals[0]);
  assert.equal(progress.zoneId,'icn-t1-arrivals');assert.deepEqual({x:progress.x,y:progress.y},{x:9,y:7});

  progress=engine.enterPortal(world,{...progress,zoneId:transport.id,x:5,y:2},transport.portals[1]);
  assert.equal(progress.zoneId,'icn-t1-airport-rail-concourse');assert.deepEqual({x:progress.x,y:progress.y},{x:5,y:7});
  const rail=engine.zoneById(world,'icn-t1-airport-rail-concourse');
  progress=engine.enterPortal(world,progress,rail.portals[0]);
  assert.equal(progress.zoneId,'icn-t1-transport-center');assert.deepEqual({x:progress.x,y:progress.y},{x:5,y:2});
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
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  const arrivalPortal=zone.portals[0];
  for(const direction of pathToInteraction(engine,zone,state.exploration,arrivalPortal,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/airport-transport-center-map-v1\.webp/);assert.match(screen.innerHTML,/인천공항 T1 교통센터/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.exploration.zoneId,'icn-t1-transport-center');
  const transport=engine.zoneById(runtime.MALBIT_TRAVEL_WORLDS[0],'icn-t1-transport-center'),sign=transport.pois[0];
  for(const direction of pathToInteraction(engine,transport,state.exploration,sign,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/교통센터 표지/);assert.match(screen.innerHTML,/\+200원/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79400);assert.ok(state.exploration.discoveries.includes('icn-t1-transport-center:transport-center-sign'));
  runtime.malbitTravelInteract();assert.equal(JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'].wallet,79400);
  runtime.malbitTravelCloseDiscovery();
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  for(const direction of pathToInteraction(engine,transport,state.exploration,transport.portals[1],'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/airport-rail-concourse-map-v1\.webp/);assert.match(screen.innerHTML,/공항철도 대합실/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.exploration.zoneId,'icn-t1-airport-rail-concourse');
  const rail=engine.zoneById(runtime.MALBIT_TRAVEL_WORLDS[0],'icn-t1-airport-rail-concourse'),boardingSign=rail.pois[0];
  for(const direction of pathToInteraction(engine,rail,state.exploration,boardingSign,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/승차 방향 표지/);assert.match(screen.innerHTML,/\+200원/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79600);assert.ok(state.exploration.discoveries.includes('icn-t1-airport-rail-concourse:boarding-direction-sign'));
  runtime.malbitTravelInteract();assert.equal(JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'].wallet,79600);
  runtime.malbitTravelCloseDiscovery();
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  for(const direction of pathToInteraction(engine,rail,state.exploration,rail.portals[0],'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/airport-transport-center-map-v1\.webp/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  for(const direction of pathToInteraction(engine,transport,state.exploration,transport.portals[0],'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/airport-arrivals-map-v1\.webp/);
  const after=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.ok(after.exploration.steps>0);assert.equal(after.exploration.worldId,'seoul-world-v1');
  assert.equal(after.exploration.zoneId,'icn-t1-arrivals');
  assert.equal(runtime.MALBIT_TRAVEL_RPG_MOTION.durationMs,190);
  assert.equal(runtime.MALBIT_TRAVEL_RPG_MOTION.busy,false);
});

test('Travel styles expose separate light and dark theme tokens without forcing a scheme at render time',()=>{
  const css=read('styles.css'),runtime=read('travel-mode.js');
  assert.match(css,/html\[data-theme="light"\] body\.travel-active/);
  assert.match(css,/--travel-canvas:#071321/);assert.match(css,/--travel-canvas:#eef3fb/);
  assert.match(css,/\.travelRpgViewport/);assert.match(css,/\.travelRpgDpad button/);
  assert.match(css,/\.travelRpgShell\{position:relative;height:100vh;height:100dvh/);
  assert.match(css,/\.travelRpgTopHud/);assert.match(css,/\.travelRpgObjectiveHud/);
  assert.match(css,/\.travelRpgControls\{position:absolute/);
  assert.match(css,/\.travelRpgBoard\{position:absolute;height:120%/);
  assert.match(css,/\.travelRpgPlayer\{width:7\.4%;height:14%/);
  assert.match(css,/background-size:800% 400%/);assert.match(css,/travelRpgWalk12 \.333333s/);
  assert.match(css,/@keyframes travelRpgIdle4/);assert.match(css,/@keyframes travelRpgWalk12/);
  assert.doesNotMatch(css,/@keyframes travelRpgWalk12[^}]*filter:/);
  assert.match(css,/cubic-bezier\(\.2,\.78,\.24,1\)/);
  assert.match(runtime,/travelRpgCard travelRpgShell/);assert.match(runtime,/travelRpgStatusHud/);
  assert.match(runtime,/class="travelRpgPlayer has-sprite idle/);assert.match(runtime,/data-walk-fps=/);
  assert.match(runtime,/player\.classList\.contains\('has-sprite'\)/);
  assert.match(runtime,/const RPG_CAMERA_SCALE=1\.2/);assert.match(runtime,/boardHeight=viewportHeight\*RPG_CAMERA_SCALE/);
  assert.match(runtime,/addEventListener\?\.\('resize',scheduleRpgCameraSync/);
  assert.match(runtime,/board\.style\.transition='none'/);assert.match(runtime,/board\.style\.removeProperty\('transition'\)/);
  assert.match(runtime,/document\.body\.classList\.toggle\('travel-rpg-active',true\)/);
  assert.match(runtime,/MALBIT_TRAVEL_RPG_MOTION/);assert.match(runtime,/RPG_MOTION\.queue\.length<32/);
  assert.doesNotMatch(runtime,/document\.documentElement\.style\.colorScheme='dark'/);
});
