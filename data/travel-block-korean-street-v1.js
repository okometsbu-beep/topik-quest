// MALBIT Travel RPG reusable Seoul street block · catalog-ID composition and isolated validation fixture.
(function(){
  'use strict';

  const BASIC='korean-street-basic-v1',CORNERS='korean-street-corners-v1',JUNCTIONS='korean-street-junctions-v1';
  const ENTRANCES='korean-street-building-entrances-v1',DECOR='korean-street-decor-upper-v1';
  const ref=(catalogId,tileId)=>Object.freeze({catalogId,tileId});
  const point=(x,y)=>Object.freeze({x,y});
  const route=(id,material,points)=>Object.freeze({id,material,points:Object.freeze(points.map(([x,y])=>point(x,y)))});
  const upper=(catalogId,tileId,x,y)=>Object.freeze({ref:ref(catalogId,tileId),x,y});
  const baseSidewalk=(x,y)=>ref((x+y)%3===0?CORNERS:BASIC,(x+y)%3===0?'street-corner-sidewalk':((x+y)%2?'street-sidewalk-b':'street-sidewalk-a'));
  const width=12,height=10,ground=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>baseSidewalk(x,y)));

  for(let y=0;y<6;y++)ground[y][6]=ref(JUNCTIONS,'street-junction-approach-north');
  for(let x=0;x<6;x++)ground[6][x]=ref(JUNCTIONS,'street-junction-approach-west');
  ground[6][6]=ref(JUNCTIONS,'street-junction-cross-lane-full');
  for(let x=7;x<width;x++)ground[6][x]=ref(JUNCTIONS,'street-junction-approach-east');
  for(let y=7;y<9;y++)ground[y][6]=ref(JUNCTIONS,'street-junction-approach-south');
  ground[9][6]=ref(CORNERS,'street-corner-road');
  for(let x=7;x<width;x++)ground[9][x]=ref(CORNERS,x%2?'street-corner-road':'street-corner-lane-horizontal');
  ground[0][2]=ref(ENTRANCES,'building-entrance-threshold-stone');
  ground[0][9]=ref(ENTRANCES,'building-entrance-ramp-rails');

  const fixture=Object.freeze({
    id:'korean-street-block-fixture-v1',
    purpose:'isolated-catalog-composition-validation-only',
    scope:'future-seoul-zones',
    playable:false,
    width,
    height,
    tileSize:25,
    requiredCatalogs:Object.freeze([BASIC,CORNERS,JUNCTIONS,ENTRANCES,DECOR]),
    layers:Object.freeze({
      ground:Object.freeze(ground.map(row=>Object.freeze(row))),
      upper:Object.freeze([
        upper(ENTRANCES,'building-entrance-upper-dark-door',2,0),
        upper(ENTRANCES,'building-entrance-upper-awning',9,0),
        upper(DECOR,'street-decor-sign-round',1,0),
        upper(DECOR,'street-decor-awning-teal',3,0),
        upper(DECOR,'street-decor-detail-wall-lamp',8,0),
        upper(DECOR,'street-decor-planter-shrub',1,2),
        upper(DECOR,'street-decor-planter-flower-box',10,2),
        upper(DECOR,'street-decor-detail-utility-cabinet',4,4)
      ])
    }),
    routes:Object.freeze([
      route('east-west-crossing','road',Array.from({length:width},(_,x)=>[x,6])),
      route('north-crossing','road',Array.from({length:7},(_,y)=>[6,y])),
      route('south-east-corner','road',[[6,6],[6,7],[6,8],[6,9],[7,9],[8,9],[9,9],[10,9],[11,9]]),
      route('level-shop-entry','sidewalk',[[2,2],[2,1],[2,0]]),
      route('step-free-shop-entry','sidewalk',[[9,2],[9,1],[9,0]])
    ]),
    ports:Object.freeze([
      Object.freeze({id:'road-west',x:0,y:6,direction:'west',material:'road'}),
      Object.freeze({id:'road-east',x:11,y:6,direction:'east',material:'road'}),
      Object.freeze({id:'road-north',x:6,y:0,direction:'north',material:'road'}),
      Object.freeze({id:'corner-east',x:11,y:9,direction:'east',material:'road'})
    ]),
    expectedCollisionCells:Object.freeze(['1,2','4,4','10,2'])
  });

  const catalogs=()=>Object.fromEntries((window.MALBIT_TRAVEL_TILESETS||[]).map(item=>[item.id,item]));
  const entries=(catalog,layer)=>layer==='upper'?catalog?.upperCatalog:catalog?.catalog;
  const resolve=(reference,layer='ground')=>{
    const catalog=catalogs()[reference?.catalogId],entry=(entries(catalog,layer)||[]).find(item=>item.id===reference?.tileId);
    return catalog&&entry?Object.freeze({catalog,entry,atlas:catalog.fixture?.tilemap?.atlas}):null;
  };
  const directions=Object.freeze({north:point(0,-1),east:point(1,0),south:point(0,1),west:point(-1,0)});
  const opposite=Object.freeze({north:'south',east:'west',south:'north',west:'east'});
  const directionBetween=(a,b)=>Object.keys(directions).find(direction=>a.x+directions[direction].x===b.x&&a.y+directions[direction].y===b.y);
  const inBounds=(block,x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<block.width&&y<block.height;
  const groundAt=(block,x,y)=>inBounds(block,x,y)?resolve(block.layers.ground[y][x],'ground'):null;

  const validateBlock=block=>{
    const errors=[];
    if(!block||block.playable!==false||block.purpose!=='isolated-catalog-composition-validation-only')errors.push('block must remain an isolated non-playable fixture');
    const available=catalogs();
    for(const catalogId of block?.requiredCatalogs||[])if(!available[catalogId])errors.push(`missing catalog ${catalogId}`);
    if(block?.layers?.ground?.length!==block?.height)errors.push('ground height mismatch');
    for(let y=0;y<(block?.height||0);y++){
      const row=block.layers.ground[y];
      if(row?.length!==block.width){errors.push(`ground row ${y} width mismatch`);continue}
      row.forEach((reference,x)=>{const match=resolve(reference,'ground');if(!match)errors.push(`unknown ground ref ${x},${y}`);else if(match.entry.layer!=='ground')errors.push(`non-ground entry at ${x},${y}`)});
    }
    for(const path of block?.routes||[]){
      for(const [index,current] of path.points.entries()){
        const match=groundAt(block,current.x,current.y);
        if(!match){errors.push(`${path.id}: point ${index} is outside the ground layer`);continue}
        if(!match.entry.walkable)errors.push(`${path.id}: point ${index} is not walkable`);
        if(index===0)continue;
        const previous=path.points[index-1],before=groundAt(block,previous.x,previous.y),direction=directionBetween(previous,current);
        if(!direction){errors.push(`${path.id}: points ${index-1}-${index} are not adjacent`);continue}
        const from=before?.entry?.edges?.[direction],to=match.entry.edges?.[opposite[direction]];
        if(from!==path.material||to!==path.material)errors.push(`${path.id}: ${previous.x},${previous.y} to ${current.x},${current.y} does not join on ${path.material}`);
      }
    }
    for(const port of block?.ports||[]){
      const match=groundAt(block,port.x,port.y),step=directions[port.direction];
      if(!match||!step)errors.push(`${port.id}: invalid port`);
      else{
        const outside=!inBounds(block,port.x+step.x,port.y+step.y);
        if(!outside||!match.entry.walkable||match.entry.edges?.[port.direction]!==port.material)errors.push(`${port.id}: invalid boundary connection`);
      }
    }
    const collision=[];
    for(const placement of block?.layers?.upper||[]){
      const match=resolve(placement.ref,'upper');
      if(!match){errors.push(`unknown upper ref ${placement.x},${placement.y}`);continue}
      if(!inBounds(block,placement.x,placement.y))errors.push(`${match.entry.id}: upper placement outside block`);
      if(match.entry.layer!=='upper'||!Number.isInteger(match.entry.baselineY))errors.push(`${match.entry.id}: missing upper baseline`);
      for(const cell of match.entry.collisionFootprint?.cells||[]){
        const x=placement.x+cell.x,y=placement.y+cell.y;
        if(!inBounds(block,x,y))errors.push(`${match.entry.id}: collision outside block`);else collision.push(`${x},${y}`);
      }
    }
    const actual=[...new Set(collision)].sort(),expected=[...(block?.expectedCollisionCells||[])].sort();
    if(JSON.stringify(actual)!==JSON.stringify(expected))errors.push('upper collision footprint mismatch');
    return Object.freeze(errors);
  };

  const previous=Array.isArray(window.MALBIT_TRAVEL_BLOCK_SCHEMAS)?window.MALBIT_TRAVEL_BLOCK_SCHEMAS:[];
  window.MALBIT_TRAVEL_BLOCK_SCHEMAS=Object.freeze([...previous,fixture]);
  window.MALBIT_TRAVEL_BLOCK_VALIDATOR=Object.freeze({validateBlock,resolve});
})();
