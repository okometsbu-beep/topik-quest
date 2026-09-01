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

function loadWorldWithStreetTiles(){
  const runtime={window:{}};runtime.window=runtime;vm.createContext(runtime);
  vm.runInContext(read('data/travel-tiles-korean-street-v1.js'),runtime);
  vm.runInContext(read('data/travel-tiles-korean-street-corners-v1.js'),runtime);
  vm.runInContext(read('data/travel-tiles-korean-street-junctions-v1.js'),runtime);
  vm.runInContext(read('data/travel-tiles-korean-street-building-entrances-v1.js'),runtime);
  vm.runInContext(read('data/travel-tiles-korean-street-decor-upper-v1.js'),runtime);
  vm.runInContext(read('data/travel-block-korean-street-v1.js'),runtime);
  vm.runInContext(read('data/travel-map-seoul-v1.js'),runtime);
  vm.runInContext(read('travel-rpg-engine.js'),runtime);
  return runtime;
}

function pathToInteraction(engine,zone,start,target,sceneId){
  const queue=[{x:start.x,y:start.y,path:[]}],seen=new Set([`${start.x},${start.y}`]);
  const entries=Object.entries(engine.directions);
  while(queue.length){
    const current=queue.shift();
    if(Math.abs(current.x-target.x)+Math.abs(current.y-target.y)<=engine.interactionRange(zone))return current.path;
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
  assert.equal(zone.width,48);assert.equal(zone.height,36);
  assert.equal(zone.grid.length,zone.height);
  assert.equal(zone.tilemap.coordinateScale,4);assert.equal(zone.tilemap.tileSize,25);
  assert.equal(zone.tilemap.atlas.columns,zone.width);assert.equal(zone.tilemap.atlas.rows,zone.height);
  assert.equal(zone.tilemap.layers.ground.length,zone.height);assert.equal(zone.tilemap.palette.length,zone.width*zone.height);
  const tileId=zone.tilemap.layers.ground[18][14],tile=zone.tilemap.palette[tileId];
  assert.deepEqual({atlasX:tile.atlasX,atlasY:tile.atlasY,terrain:tile.terrain,walkable:tile.walkable,layer:tile.layer},{atlasX:14,atlasY:18,terrain:'walkable',walkable:true,layer:'ground'});
  assert.deepEqual(Array.from(engine.validateWorld(world)),[]);
  assert.equal(zone.pois.length,4);
  const welcome=zone.pois.find(item=>item.id==='cheongsachorong-welcome');
  assert.ok(welcome,'the arrivals hall needs one Korean welcome investigation');
  assert.equal(welcome.korean,'어서 오세요');
  assert.match(welcome.detail.ja,/歓迎の気持ち/);
  assert.deepEqual({asset:welcome.visual.asset,width:welcome.visual.widthTiles,height:welcome.visual.heightTiles,reward:welcome.reward},{asset:'assets/art/travel/rpg/cheongsachorong-welcome-prop-v1.webp',width:3,height:4,reward:200});
  assert.equal(welcome.collision.length,2);
  assert.ok(pathToInteraction(engine,zone,zone.spawn,welcome,'arrival'),'the welcome lanterns must be reachable');
  for(const point of welcome.collision)assert.equal(engine.isWalkable(zone,point.x,point.y,null),false,'the lantern base must block its declared tiles');
  const welcomeArt=path.join(root,welcome.visual.asset);
  assert.ok(fs.existsSync(welcomeArt),'the Korean prop needs a production image');
  assert.ok(fs.statSync(welcomeArt).size>30000,'the Korean prop must not be a tiny placeholder');
  assert.deepEqual(JSON.parse(JSON.stringify(world.performanceBudget)),{version:1,maxGroundTilesPerZone:1728,maxUpperTilesPerZone:256,maxBoardDomNodes:2048,targetFrameMs:16.7,maxP95FrameMs:34,longFrameMs:50,maxLongFrameRatio:.15});
  for(const candidate of world.zones){
    const estimate=engine.performanceEstimate(candidate);
    assert.ok(estimate.groundTiles<=world.performanceBudget.maxGroundTilesPerZone,`${candidate.id}: ground tile budget`);
    assert.ok(estimate.upperTiles<=world.performanceBudget.maxUpperTilesPerZone,`${candidate.id}: upper tile budget`);
  }
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
  const gameOverArt=path.join(root,'assets/art/travel/rpg/travel-stamina-game-over-v1.webp');
  assert.ok(fs.existsSync(gameOverArt),'the exhausted-traveler screen needs a production image');
  assert.ok(fs.statSync(gameOverArt).size>100000,'the game-over image must not be a tiny placeholder');
  assert.deepEqual(Array.from(zone.foregrounds,item=>item.id),['information-desk','rail-wayfinding-sign','arrival-flower-planter']);
  assert.deepEqual(Array.from(transport.foregrounds,item=>item.id),['center-map-kiosk','south-left-planter','south-right-planter']);
  assert.deepEqual(Array.from(rail.foregrounds,item=>item.id),['left-ticket-gates','right-ticket-gates','left-ticket-machine','right-ticket-machine','south-left-planter','south-right-planter']);
  assert.deepEqual(Array.from(zone.lights,item=>item.id),['west-pillar-lamp','east-pillar-lamp','rail-wayfinding-glow']);
  assert.equal(transport.lights.length,3);assert.equal(rail.lights.length,3);
  for(const candidate of world.zones){
    for(const foreground of candidate.foregrounds){
      assert.ok(foreground.polygon.length>=4,`${candidate.id}:${foreground.id} needs an upper-layer silhouette`);
      for(const point of foreground.collision)assert.equal(engine.isWalkable(candidate,point.x,point.y,null),false,`${candidate.id}:${foreground.id} collision must block movement`);
    }
    for(const light of candidate.lights){
      assert.ok(light.x>=0&&light.y>=0&&light.x+light.width<=candidate.width&&light.y+light.height<=candidate.height,`${candidate.id}:${light.id} must stay bounded`);
      assert.ok(light.strength>0&&light.strength<=.65,`${candidate.id}:${light.id} strength must remain local`);
    }
  }
  assert.equal(engine.isWalkable(zone,26,18,null),false,'the rail sign base cannot be walked through');
  assert.equal(engine.isWalkable(transport,22,22,null),false,'the center kiosk base cannot be walked through');
  assert.equal(engine.isWalkable(rail,6,18,null),false,'the ticket machine base cannot be walked through');
  assert.equal(engine.isWalkable(rail,22,14,null),false,'the left ticket-gate bank cannot be walked through');
  const migrated=engine.normalizeProgress('route-001-airport-myeongdong',{version:1,zoneId:zone.id,x:5,y:7,direction:'up',steps:9,discoveries:[]},'arrival');
  assert.equal(migrated.version,2);assert.deepEqual({x:migrated.x,y:migrated.y},{x:22,y:30});assert.equal(migrated.steps,9);
});

test('Korean street foundation is a reusable isolated atlas catalog with a validated fixture',()=>{
  const runtime=loadWorldWithStreetTiles(),engine=runtime.MALBIT_TRAVEL_RPG,tileset=runtime.MALBIT_TRAVEL_TILESETS[0],fixture=runtime.MALBIT_TRAVEL_TILE_FIXTURES[0];
  assert.equal(tileset.id,'korean-street-basic-v1');assert.equal(tileset.scope,'future-seoul-zones');
  assert.equal(fixture.id,'korean-street-basic-fixture-v1');assert.equal(fixture.purpose,'isolated-validation-only');
  assert.deepEqual({width:fixture.width,height:fixture.height,columns:fixture.tilemap.atlas.columns,rows:fixture.tilemap.atlas.rows,sourceTileSize:fixture.tilemap.atlas.sourceTileSize},{width:12,height:8,columns:4,rows:4,sourceTileSize:64});
  assert.equal(tileset.catalog.length,16);assert.equal(new Set(Array.from(tileset.catalog,item=>item.id)).size,16);
  assert.deepEqual(Array.from(new Set(Array.from(tileset.catalog,item=>item.terrain))).sort(),['boundary','crosswalk','road','sidewalk']);
  assert.deepEqual(Array.from(tileset.catalog,item=>`${item.atlasX},${item.atlasY}`).sort(),Array.from({length:16},(_,index)=>`${index%4},${Math.floor(index/4)}`).sort());
  assert.ok(tileset.catalog.filter(item=>item.terrain==='boundary').every(item=>item.walkable===false),'curb boundaries must block ordinary walking');
  assert.ok(tileset.catalog.filter(item=>item.terrain!=='boundary').every(item=>item.walkable===true),'street surfaces must remain traversable');
  assert.ok(tileset.catalog.every(item=>item.layer==='ground'&&['north','east','south','west'].every(edge=>typeof item.edges[edge]==='string')),'every reusable tile needs layer and edge metadata');
  assert.deepEqual(Array.from(engine.validateTilemap(fixture.tilemap,fixture)),[]);
  assert.deepEqual(Array.from(engine.validateWorld(runtime.MALBIT_TRAVEL_WORLDS[0])),[],'loading the independent catalog must not change the airport world');
  assert.equal(runtime.MALBIT_TRAVEL_WORLDS[0].zones.length,3);assert.ok(!runtime.MALBIT_TRAVEL_WORLDS[0].zones.some(zone=>zone.id===fixture.id),'the validation fixture cannot ship as a playable zone');
  const broken=JSON.parse(JSON.stringify(fixture));broken.tilemap.palette[0].atlasX=4;
  assert.ok(engine.validateTilemap(broken.tilemap,broken).includes(`${fixture.id}: invalid tile atlas coordinate 0`),'atlas bounds must reject an invalid catalog entry');
  const atlasPath=path.join(root,fixture.tilemap.atlas.image),atlas=fs.readFileSync(atlasPath);
  assert.ok(atlas.length>4000,'the street atlas must not be a tiny placeholder');assert.equal(atlas.subarray(0,4).toString(),'RIFF');assert.equal(atlas.subarray(8,12).toString(),'WEBP');
  const html=read('tests/fixtures/korean-street-tiles.html');assert.match(html,/travel-tiles-korean-street-v1\.js/);assert.match(html,/streetFixtureBoard/);assert.match(html,/streetFixtureLegend/);
});

test('Korean street corner sibling atlas owns eight typed corners and a validated 90-degree fixture',()=>{
  const runtime=loadWorldWithStreetTiles(),engine=runtime.MALBIT_TRAVEL_RPG,tileset=runtime.MALBIT_TRAVEL_TILESETS[1],fixture=runtime.MALBIT_TRAVEL_TILE_FIXTURES[1];
  assert.equal(tileset.id,'korean-street-corners-v1');assert.equal(tileset.scope,'future-seoul-zones');
  assert.equal(fixture.id,'korean-street-corners-fixture-v1');assert.equal(fixture.purpose,'isolated-90-degree-validation-only');
  assert.deepEqual({width:fixture.width,height:fixture.height,columns:fixture.tilemap.atlas.columns,rows:fixture.tilemap.atlas.rows,sourceTileSize:fixture.tilemap.atlas.sourceTileSize},{width:12,height:8,columns:4,rows:4,sourceTileSize:64});
  assert.equal(tileset.catalog.length,16);assert.equal(new Set(Array.from(tileset.catalog,item=>item.id)).size,16);
  const corners=Array.from(tileset.catalog,item=>item).filter(item=>item.cornerKind);
  assert.equal(corners.length,8);assert.deepEqual(Array.from(new Set(corners.map(item=>item.cornerKind))).sort(),['inner','outer']);
  for(const kind of ['inner','outer'])assert.deepEqual(corners.filter(item=>item.cornerKind===kind).map(item=>item.orientation).sort(),['north-east','north-west','south-east','south-west']);
  const axis=direction=>['north','south'].includes(direction)?'vertical':'horizontal';
  assert.ok(corners.every(item=>item.terrain==='boundary'&&!item.walkable&&item.layer==='ground'),'corner curbs must block ordinary walking on the ground layer');
  assert.ok(corners.every(item=>item.curbExits.length===2&&new Set(item.curbExits).size===2&&axis(item.curbExits[0])!==axis(item.curbExits[1])),'each corner must expose one vertical and one horizontal curb exit');
  assert.deepEqual(Array.from(engine.validateTilemap(fixture.tilemap,fixture)),[]);
  for(const specimen of fixture.specimens){
    const corner=tileset.catalog[tileset.byId[specimen.cornerId]];
    assert.equal(corner.cornerKind,specimen.kind);assert.deepEqual(Array.from(specimen.arms,d=>d.direction).sort(),Array.from(corner.curbExits).sort());
    for(const arm of specimen.arms){
      const straight=tileset.catalog[tileset.byId[arm.tileId]];
      assert.equal(straight.cornerKind,null);assert.equal(straight.terrain,'boundary');
      assert.ok(straight.curbExits.every(direction=>axis(direction)===axis(arm.direction)),'straight arm must continue on the corner exit axis');
    }
  }
  assert.deepEqual(Array.from(engine.validateWorld(runtime.MALBIT_TRAVEL_WORLDS[0])),[],'loading corner tiles must not change the airport world');
  assert.equal(runtime.MALBIT_TRAVEL_WORLDS[0].zones.length,3);assert.ok(!runtime.MALBIT_TRAVEL_WORLDS[0].zones.some(zone=>zone.id===fixture.id),'the 90-degree fixture cannot ship as a playable zone');
  const atlasPath=path.join(root,fixture.tilemap.atlas.image),atlas=fs.readFileSync(atlasPath);
  assert.ok(atlas.length>4000,'the corner atlas must not be a tiny placeholder');assert.equal(atlas.subarray(0,4).toString(),'RIFF');assert.equal(atlas.subarray(8,12).toString(),'WEBP');
  const html=read('tests/fixtures/korean-street-corners.html');assert.match(html,/travel-tiles-korean-street-corners-v1\.js/);assert.match(html,/cornerFixtureBoard/);assert.match(html,/cornerFixtureLegend/);
});

test('Korean street junction sibling atlas validates every T and cross entry direction',()=>{
  const runtime=loadWorldWithStreetTiles(),engine=runtime.MALBIT_TRAVEL_RPG,tileset=runtime.MALBIT_TRAVEL_TILESETS[2],fixture=runtime.MALBIT_TRAVEL_TILE_FIXTURES[2];
  assert.equal(tileset.id,'korean-street-junctions-v1');assert.equal(tileset.scope,'future-seoul-zones');
  assert.equal(fixture.id,'korean-street-junctions-fixture-v1');assert.equal(fixture.purpose,'isolated-all-entry-junction-validation-only');
  assert.deepEqual({width:fixture.width,height:fixture.height,columns:fixture.tilemap.atlas.columns,rows:fixture.tilemap.atlas.rows,sourceTileSize:fixture.tilemap.atlas.sourceTileSize},{width:20,height:12,columns:4,rows:4,sourceTileSize:64});
  assert.equal(tileset.catalog.length,16);assert.equal(new Set(Array.from(tileset.catalog,item=>item.id)).size,16);
  assert.deepEqual(Array.from(tileset.catalog,item=>`${item.atlasX},${item.atlasY}`).sort(),Array.from({length:16},(_,index)=>`${index%4},${Math.floor(index/4)}`).sort());
  const junctions=Array.from(tileset.catalog,item=>item).filter(item=>item.junctionKind),tJunctions=junctions.filter(item=>item.junctionKind==='t'),crosses=junctions.filter(item=>item.junctionKind==='cross');
  assert.equal(junctions.length,8);assert.equal(tJunctions.length,4);assert.equal(crosses.length,4);
  assert.deepEqual(tJunctions.map(item=>item.orientation).sort(),['east','north','south','west']);
  assert.ok(tJunctions.every(item=>item.roadExits.length===3&&new Set(item.roadExits).size===3),'each T junction needs exactly three unique road entries');
  assert.ok(crosses.every(item=>item.roadExits.length===4&&new Set(item.roadExits).size===4),'each cross junction needs four road entries');
  assert.ok(junctions.every(item=>item.terrain==='road'&&item.walkable&&item.layer==='ground'),'junction centers must be traversable ground tiles');
  assert.deepEqual(Array.from(engine.validateTilemap(fixture.tilemap,fixture)),[]);assert.equal(fixture.specimens.length,5);
  const delta={north:{x:0,y:-1},east:{x:1,y:0},south:{x:0,y:1},west:{x:-1,y:0}},opposite={north:'south',east:'west',south:'north',west:'east'};
  assert.deepEqual(Array.from(fixture.specimens,item=>item.kind).sort(),['cross','t','t','t','t']);
  for(const specimen of fixture.specimens){
    const center=tileset.catalog[tileset.byId[specimen.centerId]];
    assert.equal(center.junctionKind,specimen.kind);assert.deepEqual(Array.from(center.roadExits).sort(),Array.from(specimen.arms,item=>item.direction).sort());
    assert.equal(fixture.tilemap.layers.ground[specimen.y][specimen.x],tileset.byId[specimen.centerId]);
    for(const arm of specimen.arms){
      const step=delta[arm.direction],entry=tileset.catalog[tileset.byId[arm.tileId]];
      assert.equal(fixture.tilemap.layers.ground[specimen.y+step.y][specimen.x+step.x],tileset.byId[arm.tileId]);
      assert.ok(entry.roadExits.includes(arm.direction)&&entry.roadExits.includes(opposite[arm.direction]),'approach must continue through both ends of its axis');
    }
    if(specimen.closedDirection){
      const step=delta[specimen.closedDirection];assert.equal(center.edges[specimen.closedDirection],'sidewalk');
      assert.equal(fixture.tilemap.layers.ground[specimen.y+step.y][specimen.x+step.x],tileset.byId['street-junction-sidewalk'],'the closed T side must stay sidewalk');
    }
  }
  assert.deepEqual(Array.from(engine.validateWorld(runtime.MALBIT_TRAVEL_WORLDS[0])),[],'loading junction tiles must not change the airport world');
  assert.equal(runtime.MALBIT_TRAVEL_WORLDS[0].zones.length,3);assert.ok(!runtime.MALBIT_TRAVEL_WORLDS[0].zones.some(zone=>zone.id===fixture.id),'the junction fixture cannot ship as a playable zone');
  const atlasPath=path.join(root,fixture.tilemap.atlas.image),atlas=fs.readFileSync(atlasPath);
  assert.ok(atlas.length>4000,'the junction atlas must not be a tiny placeholder');assert.equal(atlas.subarray(0,4).toString(),'RIFF');assert.equal(atlas.subarray(8,12).toString(),'WEBP');
  const html=read('tests/fixtures/korean-street-junctions.html');assert.match(html,/travel-tiles-korean-street-junctions-v1\.js/);assert.match(html,/junctionFixtureBoard/);assert.match(html,/junctionFixtureLegend/);
});

test('Korean building entrance sibling atlas separates walkable transitions from upper baselines',()=>{
  const runtime=loadWorldWithStreetTiles(),engine=runtime.MALBIT_TRAVEL_RPG,tileset=runtime.MALBIT_TRAVEL_TILESETS[3],fixture=runtime.MALBIT_TRAVEL_TILE_FIXTURES[3];
  assert.equal(tileset.id,'korean-street-building-entrances-v1');assert.equal(tileset.scope,'future-seoul-zones');
  assert.equal(fixture.id,'korean-street-building-entrances-fixture-v1');assert.equal(fixture.purpose,'isolated-building-entry-baseline-validation-only');
  assert.deepEqual({width:fixture.width,height:fixture.height,columns:fixture.tilemap.atlas.columns,rows:fixture.tilemap.atlas.rows,sourceTileSize:fixture.tilemap.atlas.sourceTileSize},{width:4,height:3,columns:4,rows:4,sourceTileSize:64});
  assert.equal(tileset.catalog.length,12);assert.equal(tileset.upperCatalog.length,4);
  const entries=[...tileset.catalog,...tileset.upperCatalog];
  assert.equal(new Set(entries.map(item=>item.id)).size,16);assert.deepEqual(entries.map(item=>`${item.atlasX},${item.atlasY}`).sort(),Array.from({length:16},(_,index)=>`${index%4},${Math.floor(index/4)}`).sort());
  assert.deepEqual(Array.from(new Set(tileset.catalog.map(item=>item.entranceKind))).sort(),['ramp','steps','threshold']);
  for(const kind of ['threshold','steps','ramp'])assert.equal(tileset.catalog.filter(item=>item.entranceKind===kind).length,4);
  assert.ok(tileset.catalog.every(item=>item.terrain==='entrance'&&item.walkable&&item.layer==='ground'&&item.entryDirection==='north'),'entrance ground tiles must connect a walkable north-facing approach');
  assert.ok(tileset.catalog.every(item=>item.edges.north==='building'&&item.edges.south==='sidewalk'),'every entrance must bridge the building and sidewalk edges');
  assert.ok(tileset.catalog.filter(item=>item.entranceKind==='steps').every(item=>item.traversal==='stairs'&&!item.stepFree),'steps must declare a non-step-free traversal');
  assert.ok(tileset.catalog.filter(item=>item.entranceKind==='ramp').every(item=>item.traversal==='ramp'&&item.stepFree),'ramps must remain step-free');
  assert.ok(tileset.catalog.filter(item=>item.entranceKind==='threshold').every(item=>item.traversal==='level'&&item.stepFree),'thresholds must remain level and step-free');
  assert.ok(tileset.upperCatalog.every(item=>item.layer==='upper'&&!item.walkable&&item.baselineY===40&&item.occludesAboveBaseline),'upper facade pieces need one explicit foot-depth baseline');
  assert.deepEqual(Array.from(engine.validateTilemap(fixture.tilemap,fixture)),[]);assert.deepEqual(Array.from(fixture.specimens,item=>item.kind).sort(),['ramp','steps','threshold']);
  for(const specimen of fixture.specimens){
    const entry=tileset.catalog[tileset.byId[specimen.tileId]];assert.equal(entry.entranceKind,specimen.kind);assert.equal(entry.traversal,specimen.traversal);assert.equal(entry.stepFree,specimen.stepFree);
    assert.equal(fixture.tilemap.layers.ground[specimen.y][specimen.x],tileset.byId[specimen.tileId]);
  }
  assert.deepEqual(Array.from(fixture.upperSamples,item=>item.baselineY),[40,40,40,40]);
  assert.deepEqual(Array.from(engine.validateWorld(runtime.MALBIT_TRAVEL_WORLDS[0])),[],'loading entrance tiles must not change the airport world');
  assert.equal(runtime.MALBIT_TRAVEL_WORLDS[0].zones.length,3);assert.ok(!runtime.MALBIT_TRAVEL_WORLDS[0].zones.some(zone=>zone.id===fixture.id),'the entrance fixture cannot ship as a playable zone');
  const atlasPath=path.join(root,fixture.tilemap.atlas.image),atlas=fs.readFileSync(atlasPath);
  assert.ok(atlas.length>4000,'the entrance atlas must not be a tiny placeholder');assert.equal(atlas.subarray(0,4).toString(),'RIFF');assert.equal(atlas.subarray(8,12).toString(),'WEBP');
  const html=read('tests/fixtures/korean-street-building-entrances.html');assert.match(html,/travel-tiles-korean-street-building-entrances-v1\.js/);assert.match(html,/entranceFixtureBoard/);assert.match(html,/entranceUpperStrip/);assert.match(html,/entranceFixtureLegend/);
});

test('Korean street decoration upper atlas owns baseline, occlusion, and collision footprints',()=>{
  const runtime=loadWorldWithStreetTiles(),engine=runtime.MALBIT_TRAVEL_RPG,tileset=runtime.MALBIT_TRAVEL_TILESETS[4],fixture=runtime.MALBIT_TRAVEL_TILE_FIXTURES[4];
  assert.equal(tileset.id,'korean-street-decor-upper-v1');assert.equal(tileset.scope,'future-seoul-zones');
  assert.equal(fixture.id,'korean-street-decor-upper-fixture-v1');assert.equal(fixture.purpose,'isolated-decor-baseline-collision-validation-only');
  assert.deepEqual({width:fixture.width,height:fixture.height,columns:fixture.tilemap.atlas.columns,rows:fixture.tilemap.atlas.rows,sourceTileSize:fixture.tilemap.atlas.sourceTileSize},{width:4,height:4,columns:4,rows:4,sourceTileSize:64});
  assert.equal(tileset.upperCatalog.length,16);assert.equal(new Set(tileset.upperCatalog.map(item=>item.id)).size,16);
  assert.deepEqual(Array.from(tileset.upperCatalog,item=>`${item.atlasX},${item.atlasY}`).sort(),Array.from({length:16},(_,index)=>`${index%4},${Math.floor(index/4)}`).sort());
  for(const category of ['sign','awning','planter','street-detail'])assert.equal(tileset.upperCatalog.filter(item=>item.category===category).length,4);
  assert.ok(tileset.upperCatalog.every(item=>item.terrain==='decor'&&!item.walkable&&item.layer==='upper'&&item.occludesAboveBaseline),'decorations must remain independent upper-layer entries');
  assert.ok(tileset.upperCatalog.every(item=>Number.isInteger(item.baselineY)&&item.baselineY>=40&&item.baselineY<=56),'every decoration needs a stable foot-depth baseline');
  assert.ok(tileset.upperCatalog.every(item=>item.collisionFootprint&&Array.isArray(item.collisionFootprint.cells)),'every decoration must own an explicit collision footprint');
  const blockers=tileset.upperCatalog.filter(item=>item.blocksMovement),clear=tileset.upperCatalog.filter(item=>!item.blocksMovement);
  assert.equal(blockers.length,7);assert.equal(clear.length,9);
  assert.ok(blockers.every(item=>item.collisionFootprint.width===1&&item.collisionFootprint.height===1&&item.collisionFootprint.cells.length===1),'floor-standing props block one cell');
  assert.ok(clear.every(item=>item.collisionFootprint.width===0&&item.collisionFootprint.height===0&&!item.collisionFootprint.cells.length),'wall-mounted props cannot invent invisible collisions');
  assert.deepEqual(Array.from(fixture.tilemap.layers.upper,row=>Array.from(row)),[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]]);
  assert.deepEqual(Array.from(fixture.specimens,item=>item.kind).sort(),['awning','planter','sign','street-detail']);
  assert.deepEqual(Array.from(engine.validateWorld(runtime.MALBIT_TRAVEL_WORLDS[0])),[],'loading decoration tiles must not change the airport world');
  assert.equal(runtime.MALBIT_TRAVEL_WORLDS[0].zones.length,3);assert.ok(!runtime.MALBIT_TRAVEL_WORLDS[0].zones.some(zone=>zone.id===fixture.id),'the decoration fixture cannot ship as a playable zone');
  const atlasPath=path.join(root,fixture.tilemap.atlas.image),atlas=fs.readFileSync(atlasPath);
  assert.ok(atlas.length>4000,'the decoration atlas must not be a tiny placeholder');assert.equal(atlas.subarray(0,4).toString(),'RIFF');assert.equal(atlas.subarray(8,12).toString(),'WEBP');
  const html=read('tests/fixtures/korean-street-decor-upper.html');assert.match(html,/travel-tiles-korean-street-decor-upper-v1\.js/);assert.match(html,/decorFixtureBoard/);assert.match(html,/decorFixtureLegend/);assert.match(html,/__MALBIT_STREET_DECOR_UPPER_READY__/);
});

test('Seoul street block composes catalog IDs with route, baseline, and collision validation',()=>{
  const runtime=loadWorldWithStreetTiles(),validator=runtime.MALBIT_TRAVEL_BLOCK_VALIDATOR,block=runtime.MALBIT_TRAVEL_BLOCK_SCHEMAS[0];
  assert.equal(block.id,'korean-street-block-fixture-v1');assert.equal(block.purpose,'isolated-catalog-composition-validation-only');assert.equal(block.scope,'future-seoul-zones');assert.equal(block.playable,false);
  assert.deepEqual({width:block.width,height:block.height,tileSize:block.tileSize},{width:12,height:10,tileSize:25});
  assert.deepEqual(Array.from(block.requiredCatalogs),[
    'korean-street-basic-v1','korean-street-corners-v1','korean-street-junctions-v1',
    'korean-street-building-entrances-v1','korean-street-decor-upper-v1'
  ]);
  assert.equal(block.layers.ground.length,10);assert.ok(block.layers.ground.every(row=>row.length===12));assert.equal(block.layers.upper.length,8);
  assert.ok(block.layers.ground.flat().every(reference=>Object.keys(reference).sort().join(',')==='catalogId,tileId'),'ground composition must use catalog and tile IDs only');
  assert.ok(block.layers.upper.every(placement=>Object.keys(placement.ref).sort().join(',')==='catalogId,tileId'),'upper composition must use catalog and tile IDs only');
  assert.deepEqual(Array.from(validator.validateBlock(block)),[]);assert.equal(block.routes.length,5);assert.equal(block.ports.length,4);
  assert.deepEqual(Array.from(block.expectedCollisionCells),['1,2','4,4','10,2']);
  const uppers=Array.from(block.layers.upper,placement=>validator.resolve(placement.ref,'upper').entry);
  assert.ok(uppers.every(entry=>entry.layer==='upper'&&Number.isInteger(entry.baselineY)),'every composed upper tile needs a catalog-owned baseline');
  assert.equal(uppers.filter(entry=>entry.collisionFootprint?.cells?.length).length,3,'only catalog-declared floor props create collision cells');
  assert.deepEqual(Array.from(runtime.MALBIT_TRAVEL_RPG.validateWorld(runtime.MALBIT_TRAVEL_WORLDS[0])),[]);assert.equal(runtime.MALBIT_TRAVEL_WORLDS[0].zones.length,3);assert.ok(!runtime.MALBIT_TRAVEL_WORLDS[0].zones.some(zone=>zone.id===block.id),'the street block fixture cannot ship as a playable zone');
  const brokenId=JSON.parse(JSON.stringify(block));brokenId.layers.ground[6][0].tileId='missing-tile';
  assert.ok(Array.from(validator.validateBlock(brokenId)).some(error=>error.includes('unknown ground ref')),'unknown cross-catalog IDs must fail');
  const brokenJoin=JSON.parse(JSON.stringify(block));brokenJoin.layers.ground[6][6]={catalogId:'korean-street-basic-v1',tileId:'street-sidewalk-a'};
  assert.ok(Array.from(validator.validateBlock(brokenJoin)).some(error=>error.includes('does not join on road')),'broken route surfaces must fail');
  const brokenCollision=JSON.parse(JSON.stringify(block));brokenCollision.expectedCollisionCells=[];
  assert.ok(Array.from(validator.validateBlock(brokenCollision)).includes('upper collision footprint mismatch'),'catalog collision footprints must match the composed block');
  const html=read('tests/fixtures/korean-street-block.html');assert.match(html,/travel-block-korean-street-v1\.js/);assert.match(html,/blockFixtureGround/);assert.match(html,/blockFixtureUpper/);assert.match(html,/blockFixtureCollision/);assert.match(html,/__MALBIT_STREET_BLOCK_READY__/);
});

test('neighboring Seoul street blocks connect only through aligned walkable ports',()=>{
  const runtime=loadWorldWithStreetTiles(),validator=runtime.MALBIT_TRAVEL_BLOCK_VALIDATOR,blocks=runtime.MALBIT_TRAVEL_BLOCK_SCHEMAS,composition=runtime.MALBIT_TRAVEL_BLOCK_COMPOSITIONS[0];
  assert.equal(blocks.length,3);assert.equal(blocks[1].id,'korean-street-block-neighbor-fixture-v1');assert.deepEqual(Array.from(validator.validateBlock(blocks[1])),[]);
  assert.equal(composition.id,'korean-street-adjacent-blocks-fixture-v1');assert.equal(composition.purpose,'isolated-east-west-block-adjacency-validation-only');assert.equal(composition.playable,false);
  assert.deepEqual({width:composition.width,height:composition.height,instances:composition.instances.length,connections:composition.connections.length},{width:24,height:10,instances:2,connections:2});
  assert.deepEqual(Array.from(validator.validateComposition(composition)),[]);
  assert.deepEqual(Array.from(validator.externalPorts(composition),port=>port.key),[
    'east-block:corner-east','east-block:road-east','east-block:road-north','west-block:road-north','west-block:road-west'
  ]);
  const wrongDirection=JSON.parse(JSON.stringify(composition));wrongDirection.connections[0].to.portId='road-north';
  assert.ok(Array.from(validator.validateComposition(wrongDirection)).some(error=>error.includes('port directions do not oppose')),'ports facing different axes must fail');
  const wrongMaterial=JSON.parse(JSON.stringify(composition));wrongMaterial.connections[0].material='sidewalk';
  assert.ok(Array.from(validator.validateComposition(wrongMaterial)).some(error=>error.includes('port materials do not match')),'connection material must match both catalog-owned port materials');
  const blockedNeighbor=JSON.parse(JSON.stringify(blocks[1]));blockedNeighbor.layers.ground[6][0]={catalogId:'korean-street-basic-v1',tileId:'street-boundary-east'};
  runtime.MALBIT_TRAVEL_BLOCK_SCHEMAS=[blocks[0],blockedNeighbor];
  assert.ok(Array.from(validator.validateComposition(composition)).some(error=>error.includes('connected ports must be walkable')),'a non-walkable endpoint must fail even when its position is aligned');
  runtime.MALBIT_TRAVEL_BLOCK_SCHEMAS=blocks;
  const html=read('tests/fixtures/korean-street-block-adjacency.html');assert.match(html,/travel-block-korean-street-v1\.js/);assert.match(html,/adjacencyFixtureGround/);assert.match(html,/adjacencyFixtureConnection/);assert.match(html,/__MALBIT_STREET_ADJACENCY_READY__/);
});

test('north-south Seoul street blocks require opposing walkable ports and a matching full seam',()=>{
  const runtime=loadWorldWithStreetTiles(),validator=runtime.MALBIT_TRAVEL_BLOCK_VALIDATOR,blocks=runtime.MALBIT_TRAVEL_BLOCK_SCHEMAS,composition=runtime.MALBIT_TRAVEL_BLOCK_COMPOSITIONS[1],vertical=blocks[2];
  assert.equal(vertical.id,'korean-street-block-north-south-neighbor-fixture-v1');assert.deepEqual(Array.from(validator.validateBlock(vertical)),[]);
  assert.deepEqual(Array.from(vertical.ports,port=>`${port.id}:${port.direction}`).sort(),['road-east:east','road-north:north','road-south:south','road-west:west']);
  assert.equal(composition.id,'korean-street-north-south-adjacent-blocks-fixture-v1');assert.equal(composition.purpose,'isolated-north-south-block-adjacency-validation-only');assert.equal(composition.playable,false);
  assert.deepEqual({width:composition.width,height:composition.height,instances:composition.instances.length,connections:composition.connections.length},{width:12,height:20,instances:2,connections:1});
  assert.deepEqual(Array.from(validator.validateComposition(composition)),[]);
  assert.deepEqual(Array.from(validator.externalPorts(composition),port=>port.key),[
    'north-block:road-east','north-block:road-north','north-block:road-west',
    'south-block:road-east','south-block:road-south','south-block:road-west'
  ]);
  const wrongDirection=JSON.parse(JSON.stringify(composition));wrongDirection.connections[0].to.portId='road-east';
  assert.ok(Array.from(validator.validateComposition(wrongDirection)).some(error=>error.includes('port directions do not oppose')),'north-south ports must face one another');
  const wrongMaterial=JSON.parse(JSON.stringify(composition));wrongMaterial.connections[0].material='sidewalk';
  assert.ok(Array.from(validator.validateComposition(wrongMaterial)).some(error=>error.includes('port materials do not match')),'vertical link material must match both endpoints');
  const brokenSeam=JSON.parse(JSON.stringify(vertical));brokenSeam.layers.ground[0][0]={catalogId:'korean-street-corners-v1',tileId:'street-corner-road'};
  runtime.MALBIT_TRAVEL_BLOCK_SCHEMAS=[blocks[0],blocks[1],brokenSeam];
  assert.ok(Array.from(validator.validateComposition(composition)).some(error=>error.includes('north-south seam')),'every touching tile edge must match across the vertical seam');
  runtime.MALBIT_TRAVEL_BLOCK_SCHEMAS=blocks;
  const html=read('tests/fixtures/korean-street-block-adjacency.html');assert.match(html,/params\.get\('axis'\)/);assert.match(html,/north-south/);
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
  assert.equal(progress.zoneId,'icn-t1-arrivals');assert.deepEqual({x:progress.x,y:progress.y},{x:38,y:30});

  progress=engine.enterPortal(world,{...progress,zoneId:transport.id,x:22,y:10},transport.portals[1]);
  assert.equal(progress.zoneId,'icn-t1-airport-rail-concourse');assert.deepEqual({x:progress.x,y:progress.y},{x:22,y:30});
  const rail=engine.zoneById(world,'icn-t1-airport-rail-concourse');
  progress=engine.enterPortal(world,progress,rail.portals[0]);
  assert.equal(progress.zoneId,'icn-t1-transport-center');assert.deepEqual({x:progress.x,y:progress.y},{x:22,y:10});
});

test('interaction cue plans stay short, local, reusable, and explicitly opt-in for feedback',()=>{
  const engine=loadWorld().MALBIT_TRAVEL_RPG;
  const portal=engine.cuePlan('portal'),investigation=engine.cuePlan('poi',{found:false,reward:0}),reward=engine.cuePlan('poi',{found:true,reward:200}),npc=engine.cuePlan('scene'),back=engine.cuePlan('return');
  assert.deepEqual([portal.enter.phase,portal.settle.phase],['enter','arrive']);
  assert.deepEqual([investigation.enter.kind,investigation.settle.kind],['investigation','investigation']);
  assert.deepEqual([reward.enter.kind,reward.settle.kind,reward.settle.phase],['investigation','reward','reward']);
  assert.deepEqual([npc.enter.kind,npc.enter.phase,npc.settle],['npc','enter',null]);
  assert.deepEqual([back.enter.kind,back.enter.phase,back.settle],['return','return',null]);
  for(const plan of [portal,investigation,reward,npc,back])for(const stage of [plan.enter,plan.settle].filter(Boolean)){
    assert.ok(stage.duration>=0&&stage.duration<=220,'a cue cannot block exploration for long');
    assert.ok(stage.sound&&!stage.sound.includes('.'),'the contract names a cue instead of loading an audio file');
    assert.ok(Array.isArray(stage.vibration)&&stage.vibration.every(value=>value>0&&value<=35));
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

test('successful steps spend the saved 10,000-step stamina budget while collisions stay free',()=>{
  const runtime=loadWorld(),engine=runtime.MALBIT_TRAVEL_RPG,zone=runtime.MALBIT_TRAVEL_WORLDS[0].zones[0];
  let progress=engine.normalizeProgress('route-001-airport-myeongdong',null,'arrival');
  assert.deepEqual(JSON.parse(JSON.stringify(progress.stamina)),{version:1,maxSteps:10000,usedSteps:0,remainingSteps:10000,percent:100,exhausted:false});

  const blockedStart={...progress,x:1,y:1,direction:'down'};
  const blocked=engine.step(zone,blockedStart,'up','arrival');
  assert.equal(blocked.moved,false);assert.equal(blocked.blocked,true);
  assert.equal(blocked.progress.stamina.usedSteps,0,'a blocked tile must not consume stamina');

  const direction=pathToInteraction(engine,zone,progress,zone.scenes.arrival,'arrival')[0];
  progress=engine.normalizeProgress('route-001-airport-myeongdong',{...progress,stamina:{version:1,usedSteps:9999}},'arrival');
  const finalStep=engine.step(zone,progress,direction,'arrival');
  assert.equal(finalStep.moved,true);assert.equal(finalStep.exhausted,true);
  assert.deepEqual(JSON.parse(JSON.stringify(finalStep.progress.stamina)),{version:1,maxSteps:10000,usedSteps:10000,remainingSteps:0,percent:0,exhausted:true});
  assert.equal(engine.step(zone,finalStep.progress,direction,'arrival').moved,false,'exhausted travelers cannot take an extra step');

  const rested=engine.restAtZone(zone,finalStep.progress);
  assert.equal(rested.stamina.usedSteps,0);assert.equal(rested.stamina.percent,100);assert.equal(rested.stamina.exhausted,false);
  assert.equal(rested.steps,finalStep.progress.steps,'resting must preserve the lifetime step record');
  assert.deepEqual({x:rested.x,y:rested.y,direction:rested.direction},{x:zone.spawn.x,y:zone.spawn.y,direction:zone.spawn.direction});
});

test('Travel runtime layers exploration over the existing event flow and saves one-time investigations',()=>{
  const storage=new Map(),screen={className:'screen',innerHTML:''},classes=new Set(),cueSounds=[],cueVibrations=[];
  const runtime={
    console,S:{lang:'ko',view:'home'},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},
    document:{body:{classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name),remove:(...names)=>names.forEach(name=>classes.delete(name))}},documentElement:{style:{}},getElementById:id=>id==='screen'?screen:null,querySelector:()=>null},
    renderShell:()=>{},navActive:()=>{},hideSelection:()=>{},flagMenu:()=>{},toast:()=>{},confirm:()=>true,speechSynthesis:{cancel:()=>{}},requestAnimationFrame:callback=>callback()
  };
  runtime.MALBIT_TRAVEL_CUE_HOOKS={sound:true,vibration:true,playSound:name=>cueSounds.push(name),vibrate:pattern=>cueVibrations.push(pattern)};
  runtime.window=runtime;runtime.render=()=>{};runtime.setView=view=>{runtime.S.view=view;runtime.render()};vm.createContext(runtime);
  for(let part=1;part<=4;part++)vm.runInContext(read(`data/question-bank-v1-part${part}.js`),runtime);
  for(const file of ['data/question-bank-practice-v1.js','question-bank-engine.js','data/travel-pack-seoul-001.js','data/travel-myeongdong-hub.js','data/travel-map-seoul-v1.js','travel-rpg-engine.js','travel-mode.js'])vm.runInContext(read(file),runtime);
  runtime.malbitTravelStart('route-001-airport-myeongdong',false);
  assert.match(screen.innerHTML,/travelRpgCard/);assert.match(screen.innerHTML,/airport-arrivals-map-v1\.webp/);assert.match(screen.innerHTML,/한국 여행이 시작됐다/);
  assert.match(screen.innerHTML,/travelRpgGroundLayer/);assert.match(screen.innerHTML,/travelRpgEnvironmentLayer/);assert.match(screen.innerHTML,/travelRpgShadowLayer/);assert.match(screen.innerHTML,/travelRpgActorLayer/);assert.match(screen.innerHTML,/travelRpgUpperLayer/);
  assert.match(screen.innerHTML,/travelRpgStaminaHud/);assert.match(screen.innerHTML,/data-rpg-stamina-percent>100%/);
  assert.match(screen.innerHTML,/data-effect-contract="bounded-light"/);assert.match(screen.innerHTML,/data-light-id="west-pillar-lamp"/);
  assert.match(screen.innerHTML,/travelRpgLight kind-screen/);assert.doesNotMatch(screen.innerHTML,/travelRpgLight screen/);
  assert.match(screen.innerHTML,/travelRpgShadow npc/);assert.match(screen.innerHTML,/travelRpgShadow player/);
  assert.match(screen.innerHTML,/data-depth-contract="foot-y"/);assert.match(screen.innerHTML,/data-foreground-id="rail-wayfinding-sign"/);
  let state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  const startZone=runtime.MALBIT_TRAVEL_WORLDS[0].zones[0],startEngine=runtime.MALBIT_TRAVEL_RPG,baggage=startZone.pois[0];
  const clockBeforeRest=state.clockMinutes,finalDirection=pathToInteraction(startEngine,startZone,state.exploration,baggage,'arrival')[0];
  state.exploration.stamina={version:1,usedSteps:9999};
  const nearEmptyStore=JSON.parse(storage.get('malbitStoryV1'));nearEmptyStore.episodes[state.packId]=state;storage.set('malbitStoryV1',JSON.stringify(nearEmptyStore));runtime.render();
  assert.match(screen.innerHTML,/data-rpg-stamina-percent>1%/);
  runtime.malbitTravelStep(finalDirection);
  assert.match(screen.innerHTML,/GAME OVER/);assert.match(screen.innerHTML,/travel-stamina-game-over-v1\.webp/);assert.match(screen.innerHTML,/10,000보를 걸었습니다/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.exploration.stamina.usedSteps,10000);assert.equal(state.exploration.stamina.exhausted,true);
  runtime.malbitTravelRest();
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.exploration.stamina.usedSteps,0);assert.equal(state.exploration.stamina.percent,100);assert.equal(state.clockMinutes,clockBeforeRest+60);
  assert.deepEqual({x:state.exploration.x,y:state.exploration.y},{x:startZone.spawn.x,y:startZone.spawn.y});assert.match(screen.innerHTML,/travelRpgStaminaHud/);
  for(const direction of pathToInteraction(startEngine,startZone,state.exploration,baggage,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();
  assert.match(screen.innerHTML,/수하물 찾는 곳/);assert.match(screen.innerHTML,/\+200원/);
  assert.deepEqual(cueSounds.slice(-2),['investigation-open','reward-earned']);assert.equal(cueVibrations.length,2);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79200);assert.deepEqual(state.exploration.discoveries,['icn-t1-arrivals:baggage-carousel']);
  runtime.malbitTravelInteract();
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79200,'an investigated POI never pays twice');
  assert.equal(cueSounds.filter(name=>name==='reward-earned').length,1,'a recorded discovery cannot replay the reward cue');
  runtime.malbitTravelCloseDiscovery();
  assert.equal(cueSounds.at(-1),'interaction-return');
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  const welcome=startZone.pois.find(item=>item.id==='cheongsachorong-welcome');
  for(const direction of pathToInteraction(startEngine,startZone,state.exploration,welcome,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();
  assert.match(screen.innerHTML,/청사초롱 환영 장식/);assert.match(screen.innerHTML,/어서 오세요/);assert.match(screen.innerHTML,/\+200원/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79400);assert.ok(state.exploration.discoveries.includes('icn-t1-arrivals:cheongsachorong-welcome'));
  runtime.malbitTravelInteract();assert.equal(JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'].wallet,79400,'the Korean investigation reward is one-time');
  runtime.malbitTravelCloseDiscovery();
  const zone=runtime.MALBIT_TRAVEL_WORLDS[0].zones[0],engine=runtime.MALBIT_TRAVEL_RPG,target=zone.scenes.arrival;
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  for(const direction of pathToInteraction(engine,zone,state.exploration,target,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();
  assert.match(screen.innerHTML,/travelSceneCard/);assert.match(screen.innerHTML,/어서 오세요/);
  assert.equal(cueSounds.at(-1),'npc-enter');
  runtime.malbitTravelCloseEvent();assert.match(screen.innerHTML,/travelRpgCard/);
  assert.equal(cueSounds.at(-1),'interaction-return');
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  const arrivalPortal=zone.portals[0];
  for(const direction of pathToInteraction(engine,zone,state.exploration,arrivalPortal,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/airport-transport-center-map-v1\.webp/);assert.match(screen.innerHTML,/인천공항 T1 교통센터/);
  assert.deepEqual(cueSounds.slice(-2),['portal-enter','portal-arrive']);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.exploration.zoneId,'icn-t1-transport-center');
  const transport=engine.zoneById(runtime.MALBIT_TRAVEL_WORLDS[0],'icn-t1-transport-center'),sign=transport.pois[0];
  for(const direction of pathToInteraction(engine,transport,state.exploration,sign,'arrival'))runtime.malbitTravelStep(direction);
  runtime.malbitTravelInteract();assert.match(screen.innerHTML,/교통센터 표지/);assert.match(screen.innerHTML,/\+200원/);
  state=JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'];
  assert.equal(state.wallet,79600);assert.ok(state.exploration.discoveries.includes('icn-t1-transport-center:transport-center-sign'));
  runtime.malbitTravelInteract();assert.equal(JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'].wallet,79600);
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
  assert.equal(state.wallet,79800);assert.ok(state.exploration.discoveries.includes('icn-t1-airport-rail-concourse:boarding-direction-sign'));
  runtime.malbitTravelInteract();assert.equal(JSON.parse(storage.get('malbitStoryV1')).episodes['route-001-airport-myeongdong'].wallet,79800);
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
  assert.equal(runtime.MALBIT_TRAVEL_RPG_MOTION.durationMs,110);
  assert.equal(runtime.MALBIT_TRAVEL_RPG_MOTION.busy,false);
  assert.equal(runtime.MALBIT_TRAVEL_RPG_CUES.active,false);assert.equal(runtime.MALBIT_TRAVEL_RPG_CUES.hookKey,'MALBIT_TRAVEL_CUE_HOOKS');
});

test('Travel styles expose separate light and dark theme tokens without forcing a scheme at render time',()=>{
  const css=read('styles.css'),runtime=read('travel-mode.js');
  assert.match(css,/html\[data-theme="light"\] body\.travel-active/);
  assert.match(css,/--travel-canvas:#071321/);assert.match(css,/--travel-canvas:#eef3fb/);
  assert.match(css,/\.travelRpgViewport/);assert.match(css,/\.travelRpgDpad button/);
  assert.match(css,/\.travelRpgShell\{position:relative;height:100vh;height:100dvh/);
  assert.match(css,/\.travelRpgTopHud/);assert.match(css,/\.travelRpgObjectiveHud/);
  assert.match(css,/\.travelRpgControls\{position:absolute/);
  assert.match(css,/\.travelRpgBoard\{position:absolute;z-index:0;height:120%[^}]*isolation:isolate/);
  assert.match(css,/\.travelRpgGroundLayer\{position:absolute;z-index:0;inset:0;overflow:hidden/);
  assert.match(css,/\.travelRpgTile\{position:absolute;display:block/);
  assert.match(css,/\.travelRpgLight\{position:absolute;z-index:1;pointer-events:none;opacity:var\(--travel-rpg-light-strength\);filter:none;mix-blend-mode:screen/);
  assert.match(css,/\.travelRpgForeground\{position:absolute;inset:0/);
  assert.match(css,/\.travelRpgForeground[^}]*opacity:1;filter:none/);
  assert.match(css,/--travel-contact-shadow:/);assert.match(css,/\.travelRpgShadow\{position:absolute;width:var\(--travel-rpg-shadow-width/);
  assert.match(css,/\.travelRpgShadow[^}]*clip-path:polygon/);assert.match(css,/\.travelRpgPlayer[^}]*filter:none/);
  assert.doesNotMatch(css,/\.travelRpg(?:Player|Target\.character)[^}]*drop-shadow/);
  assert.match(css,/\.travelRpgPlayer\{width:var\(--travel-rpg-actor-width,1\.85%\);height:var\(--travel-rpg-actor-height,3\.5%\)/);
  assert.match(css,/\.travelRpgShell\.is-cue-active \.travelRpgControls\{pointer-events:none\}/);
  assert.match(css,/@keyframes travelRpgCueDiscover/);assert.match(css,/@keyframes travelRpgCueReward/);assert.match(css,/@keyframes travelRpgCueArrive/);
  assert.doesNotMatch(css,/travelRpgCue(?:Press|Discover|Reward|Arrive|Return)[^}]*filter:/);
  assert.match(css,/background-size:800% 400%/);assert.match(css,/travelRpgWalk12 \.333333s/);
  assert.match(css,/@keyframes travelRpgIdle4/);assert.match(css,/@keyframes travelRpgWalk12/);
  assert.doesNotMatch(css,/@keyframes travelRpgWalk12[^}]*filter:/);
  assert.match(css,/@keyframes travelRpgNpcIdle4/);assert.match(css,/touch-action:none/);
  assert.match(css,/-webkit-touch-callout:none/);assert.match(css,/-webkit-user-select:none/);assert.match(css,/-webkit-user-drag:none/);
  assert.match(runtime,/travelRpgCard travelRpgShell/);assert.match(runtime,/travelRpgStatusHud/);
  assert.match(runtime,/class="travelRpgPlayer has-sprite idle/);assert.match(runtime,/data-walk-fps=/);
  assert.match(runtime,/rpgForegroundMarkup/);assert.match(runtime,/data-depth-y=/);assert.match(runtime,/rpgEnvironmentMarkup/);assert.match(runtime,/data-effect-contract="bounded-light"/);assert.match(runtime,/rpgShadowMarkup/);assert.match(runtime,/class="travelRpgShadow/);
  assert.match(runtime,/rpgGroundMarkup/);assert.match(runtime,/data-tile-id=/);assert.match(runtime,/data-tile-x=/);assert.match(runtime,/data-walkable=/);
  assert.match(runtime,/travelRpgPoi \$\{visual\?'has-prop'/);assert.match(runtime,/--travel-rpg-prop-width/);
  assert.match(css,/\.travelRpgPoi\.has-prop\{/);assert.match(css,/\.travelRpgPoi\.has-prop img\{/);
  assert.match(runtime,/malbitTravelHoldStart/);assert.match(runtime,/onpointerdown=/);assert.match(runtime,/rpgArrowIcon/);assert.match(runtime,/rpgActionIcon/);
  assert.match(runtime,/oncontextmenu="return false" onselectstart="return false" ondragstart="return false"/);
  assert.doesNotMatch(runtime,/그쪽은 지나갈 수 없어요/);
  assert.match(runtime,/MALBIT_TRAVEL_RPG_CUES/);assert.match(runtime,/MALBIT_TRAVEL_CUE_HOOKS/);assert.match(runtime,/malbit:travel-cue/);
  assert.match(runtime,/player\.style\.zIndex=String\(point\.depth\)/);assert.match(runtime,/shadow\.style\.zIndex=String\(point\.depth\)/);
  assert.match(runtime,/player\.classList\.contains\('has-sprite'\)/);
  assert.match(runtime,/const RPG_CAMERA_SCALE=1\.2/);assert.match(runtime,/boardHeight=viewportHeight\*RPG_CAMERA_SCALE/);
  assert.match(runtime,/addEventListener\?\.\('resize',scheduleRpgCameraSync/);
  assert.match(runtime,/board\.style\.transition='none'/);assert.match(runtime,/board\.style\.removeProperty\('transition'\)/);
  assert.match(runtime,/document\.body\.classList\.toggle\('travel-rpg-active',true\)/);
  assert.match(runtime,/MALBIT_TRAVEL_RPG_MOTION/);assert.match(runtime,/RPG_MOTION\.queue\.length<32/);
  assert.doesNotMatch(runtime,/document\.documentElement\.style\.colorScheme='dark'/);
});
