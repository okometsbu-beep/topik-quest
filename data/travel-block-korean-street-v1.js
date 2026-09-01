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

  const neighborGround=fixture.layers.ground.map(row=>row.slice());
  for(let x=0;x<6;x++)neighborGround[9][x]=ref(CORNERS,x%2?'street-corner-road':'street-corner-lane-horizontal');
  const neighbor=Object.freeze({
    ...fixture,
    id:'korean-street-block-neighbor-fixture-v1',
    layers:Object.freeze({...fixture.layers,ground:Object.freeze(neighborGround.map(row=>Object.freeze(row)))}),
    routes:Object.freeze([...fixture.routes,route('south-west-lane','road',Array.from({length:7},(_,x)=>[x,9]))]),
    ports:Object.freeze([...fixture.ports,Object.freeze({id:'corner-west',x:0,y:9,direction:'west',material:'road'})])
  });

  const northSouthGround=fixture.layers.ground.map(row=>row.slice());
  for(let x=0;x<width;x++){
    northSouthGround[0][x]=baseSidewalk(x,0);
    northSouthGround[height-1][x]=baseSidewalk(x,height-1);
  }
  northSouthGround[0][6]=ref(JUNCTIONS,'street-junction-approach-north');
  northSouthGround[height-1][6]=ref(JUNCTIONS,'street-junction-approach-south');
  const northSouthNeighbor=Object.freeze({
    ...fixture,
    id:'korean-street-block-north-south-neighbor-fixture-v1',
    layers:Object.freeze({
      ground:Object.freeze(northSouthGround.map(row=>Object.freeze(row))),
      upper:Object.freeze(fixture.layers.upper.filter(placement=>placement.y>0))
    }),
    routes:Object.freeze([
      fixture.routes.find(item=>item.id==='east-west-crossing'),
      route('north-south-crossing','road',Array.from({length:height},(_,y)=>[6,y]))
    ]),
    ports:Object.freeze([
      Object.freeze({id:'road-west',x:0,y:6,direction:'west',material:'road'}),
      Object.freeze({id:'road-east',x:11,y:6,direction:'east',material:'road'}),
      Object.freeze({id:'road-north',x:6,y:0,direction:'north',material:'road'}),
      Object.freeze({id:'road-south',x:6,y:9,direction:'south',material:'road'})
    ])
  });

  const adjacency=Object.freeze({
    id:'korean-street-adjacent-blocks-fixture-v1',
    purpose:'isolated-east-west-block-adjacency-validation-only',
    scope:'future-seoul-zones',
    playable:false,
    width:24,
    height:10,
    instances:Object.freeze([
      Object.freeze({id:'west-block',blockId:fixture.id,x:0,y:0}),
      Object.freeze({id:'east-block',blockId:neighbor.id,x:12,y:0})
    ]),
    connections:Object.freeze([
      Object.freeze({id:'main-road-link',material:'road',from:Object.freeze({instanceId:'west-block',portId:'road-east'}),to:Object.freeze({instanceId:'east-block',portId:'road-west'})}),
      Object.freeze({id:'south-road-link',material:'road',from:Object.freeze({instanceId:'west-block',portId:'corner-east'}),to:Object.freeze({instanceId:'east-block',portId:'corner-west'})})
    ]),
    expectedExternalPorts:Object.freeze([
      'east-block:corner-east','east-block:road-east','east-block:road-north','west-block:road-north','west-block:road-west'
    ])
  });

  const northSouthAdjacency=Object.freeze({
    id:'korean-street-north-south-adjacent-blocks-fixture-v1',
    purpose:'isolated-north-south-block-adjacency-validation-only',
    scope:'future-seoul-zones',
    playable:false,
    width:12,
    height:20,
    instances:Object.freeze([
      Object.freeze({id:'north-block',blockId:northSouthNeighbor.id,x:0,y:0}),
      Object.freeze({id:'south-block',blockId:northSouthNeighbor.id,x:0,y:10})
    ]),
    connections:Object.freeze([
      Object.freeze({id:'north-south-road-link',material:'road',from:Object.freeze({instanceId:'north-block',portId:'road-south'}),to:Object.freeze({instanceId:'south-block',portId:'road-north'})})
    ]),
    expectedExternalPorts:Object.freeze([
      'north-block:road-east','north-block:road-north','north-block:road-west',
      'south-block:road-east','south-block:road-south','south-block:road-west'
    ])
  });

  const gridAdjacency=Object.freeze({
    id:'korean-street-four-block-grid-fixture-v1',
    purpose:'isolated-four-block-grid-adjacency-validation-only',
    scope:'future-seoul-zones',
    playable:false,
    width:24,
    height:20,
    instances:Object.freeze([
      Object.freeze({id:'north-west-block',blockId:northSouthNeighbor.id,x:0,y:0}),
      Object.freeze({id:'north-east-block',blockId:northSouthNeighbor.id,x:12,y:0}),
      Object.freeze({id:'south-west-block',blockId:northSouthNeighbor.id,x:0,y:10}),
      Object.freeze({id:'south-east-block',blockId:northSouthNeighbor.id,x:12,y:10})
    ]),
    connections:Object.freeze([
      Object.freeze({id:'north-row-road-link',material:'road',from:Object.freeze({instanceId:'north-west-block',portId:'road-east'}),to:Object.freeze({instanceId:'north-east-block',portId:'road-west'})}),
      Object.freeze({id:'south-row-road-link',material:'road',from:Object.freeze({instanceId:'south-west-block',portId:'road-east'}),to:Object.freeze({instanceId:'south-east-block',portId:'road-west'})}),
      Object.freeze({id:'west-column-road-link',material:'road',from:Object.freeze({instanceId:'north-west-block',portId:'road-south'}),to:Object.freeze({instanceId:'south-west-block',portId:'road-north'})}),
      Object.freeze({id:'east-column-road-link',material:'road',from:Object.freeze({instanceId:'north-east-block',portId:'road-south'}),to:Object.freeze({instanceId:'south-east-block',portId:'road-north'})})
    ]),
    expectedExternalPorts:Object.freeze([
      'north-east-block:road-east','north-east-block:road-north',
      'north-west-block:road-north','north-west-block:road-west',
      'south-east-block:road-east','south-east-block:road-south',
      'south-west-block:road-south','south-west-block:road-west'
    ])
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

  const blocks=()=>Object.fromEntries((window.MALBIT_TRAVEL_BLOCK_SCHEMAS||[]).map(item=>[item.id,item]));
  const portById=(block,id)=>(block?.ports||[]).find(port=>port.id===id);
  const endpointKey=endpoint=>`${endpoint.instanceId}:${endpoint.portId}`;
  const externalPorts=composition=>{
    const registry=blocks(),used=new Set((composition?.connections||[]).flatMap(connection=>[endpointKey(connection.from),endpointKey(connection.to)])),result=[];
    for(const instance of composition?.instances||[]){
      const block=registry[instance.blockId];
      for(const port of block?.ports||[]){
        const key=`${instance.id}:${port.id}`;
        if(!used.has(key))result.push(Object.freeze({key,instanceId:instance.id,portId:port.id,direction:port.direction,material:port.material,x:instance.x+port.x,y:instance.y+port.y}));
      }
    }
    return Object.freeze(result.sort((a,b)=>a.key.localeCompare(b.key)));
  };
  const validateComposition=composition=>{
    const errors=[],registry=blocks(),instances=new Map();
    const allowedPurposes=['isolated-east-west-block-adjacency-validation-only','isolated-north-south-block-adjacency-validation-only','isolated-four-block-grid-adjacency-validation-only'];
    if(!composition||composition.playable!==false||!allowedPurposes.includes(composition.purpose))errors.push('composition must remain an isolated non-playable adjacency fixture');
    for(const instance of composition?.instances||[]){
      if(instances.has(instance.id))errors.push(`${instance.id}: duplicate block instance`);
      const block=registry[instance.blockId];
      if(!block)errors.push(`${instance.id}: unknown block ${instance.blockId}`);
      else{
        for(const error of validateBlock(block))errors.push(`${instance.id}: ${error}`);
        if(!Number.isInteger(instance.x)||!Number.isInteger(instance.y)||instance.x<0||instance.y<0||instance.x+block.width>composition.width||instance.y+block.height>composition.height)errors.push(`${instance.id}: invalid composition bounds`);
      }
      instances.set(instance.id,Object.freeze({instance,block}));
    }
    const placed=[...instances.values()].filter(item=>item.block);
    for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++){
      const a=placed[i],b=placed[j],overlap=a.instance.x<b.instance.x+b.block.width&&a.instance.x+a.block.width>b.instance.x&&a.instance.y<b.instance.y+b.block.height&&a.instance.y+a.block.height>b.instance.y;
      if(overlap)errors.push(`${a.instance.id}/${b.instance.id}: block rectangles overlap`);
      const west=a.instance.x+a.block.width===b.instance.x?a:(b.instance.x+b.block.width===a.instance.x?b:null),east=west===a?b:(west===b?a:null);
      if(west&&east){
        const start=Math.max(west.instance.y,east.instance.y),end=Math.min(west.instance.y+west.block.height,east.instance.y+east.block.height);
        for(let y=start;y<end;y++){
          const left=groundAt(west.block,west.block.width-1,y-west.instance.y),right=groundAt(east.block,0,y-east.instance.y),from=left?.entry?.edges?.east,to=right?.entry?.edges?.west;
          if(!from||from!==to)errors.push(`${west.instance.id}/${east.instance.id}: east-west seam ${y} does not match`);
        }
      }
      const north=a.instance.y+a.block.height===b.instance.y?a:(b.instance.y+b.block.height===a.instance.y?b:null),south=north===a?b:(north===b?a:null);
      if(north&&south){
        const start=Math.max(north.instance.x,south.instance.x),end=Math.min(north.instance.x+north.block.width,south.instance.x+south.block.width);
        for(let x=start;x<end;x++){
          const top=groundAt(north.block,x-north.instance.x,north.block.height-1),bottom=groundAt(south.block,x-south.instance.x,0),from=top?.entry?.edges?.south,to=bottom?.entry?.edges?.north;
          if(!from||from!==to)errors.push(`${north.instance.id}/${south.instance.id}: north-south seam ${x} does not match`);
        }
      }
    }
    const used=new Set();
    for(const connection of composition?.connections||[]){
      const fromHolder=instances.get(connection.from?.instanceId),toHolder=instances.get(connection.to?.instanceId),fromPort=portById(fromHolder?.block,connection.from?.portId),toPort=portById(toHolder?.block,connection.to?.portId);
      if(!fromHolder?.block||!toHolder?.block||!fromPort||!toPort){errors.push(`${connection.id}: unknown connection endpoint`);continue}
      const fromKey=endpointKey(connection.from),toKey=endpointKey(connection.to);
      if(used.has(fromKey)||used.has(toKey)||fromKey===toKey)errors.push(`${connection.id}: port endpoint reused`);used.add(fromKey);used.add(toKey);
      if(opposite[fromPort.direction]!==toPort.direction)errors.push(`${connection.id}: port directions do not oppose`);
      if(fromPort.material!==toPort.material||connection.material!==fromPort.material)errors.push(`${connection.id}: port materials do not match`);
      const fromTile=groundAt(fromHolder.block,fromPort.x,fromPort.y),toTile=groundAt(toHolder.block,toPort.x,toPort.y);
      if(!fromTile?.entry?.walkable||!toTile?.entry?.walkable)errors.push(`${connection.id}: connected ports must be walkable`);
      const fromGlobal=point(fromHolder.instance.x+fromPort.x,fromHolder.instance.y+fromPort.y),toGlobal=point(toHolder.instance.x+toPort.x,toHolder.instance.y+toPort.y),step=directions[fromPort.direction];
      if(!step||fromGlobal.x+step.x!==toGlobal.x||fromGlobal.y+step.y!==toGlobal.y)errors.push(`${connection.id}: port cells are not adjacent`);
    }
    for(const holder of placed)for(const port of holder.block.ports){
      const step=directions[port.direction],outsideX=holder.instance.x+port.x+step.x,outsideY=holder.instance.y+port.y+step.y,insideComposition=outsideX>=0&&outsideY>=0&&outsideX<composition.width&&outsideY<composition.height;
      if(insideComposition&&!used.has(`${holder.instance.id}:${port.id}`))errors.push(`${holder.instance.id}:${port.id}: internal port is not connected`);
    }
    const external=externalPorts(composition),exitCells=new Set();
    for(const port of external){
      const step=directions[port.direction],exitX=port.x+step.x,exitY=port.y+step.y,exitKey=`${exitX},${exitY}`;
      if(exitX>=0&&exitY>=0&&exitX<composition.width&&exitY<composition.height)errors.push(`${port.key}: external port does not leave composition`);
      if(exitCells.has(exitKey))errors.push(`${port.key}: external port exit reused`);else exitCells.add(exitKey);
    }
    const actual=external.map(port=>port.key),expected=[...(composition?.expectedExternalPorts||[])].sort();
    if(JSON.stringify(actual)!==JSON.stringify(expected))errors.push('external port set mismatch');
    return Object.freeze(errors);
  };

  const previous=Array.isArray(window.MALBIT_TRAVEL_BLOCK_SCHEMAS)?window.MALBIT_TRAVEL_BLOCK_SCHEMAS:[];
  window.MALBIT_TRAVEL_BLOCK_SCHEMAS=Object.freeze([...previous,fixture,neighbor,northSouthNeighbor]);
  window.MALBIT_TRAVEL_BLOCK_COMPOSITIONS=Object.freeze([adjacency,northSouthAdjacency,gridAdjacency]);
  window.MALBIT_TRAVEL_BLOCK_VALIDATOR=Object.freeze({validateBlock,validateComposition,externalPorts,resolve});
})();
