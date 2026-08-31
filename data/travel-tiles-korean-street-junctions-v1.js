// MALBIT Travel RPG reusable Korean streetscape junctions · sibling atlas and isolated entry-direction fixture.
(function(){
  'use strict';

  const freezeEdges=edges=>Object.freeze({...edges});
  const tile=(id,atlasX,atlasY,terrain,walkable,variant,edges,orientation='none',junctionKind=null,roadExits=[])=>Object.freeze({
    id,atlasX,atlasY,terrain,walkable,variant,orientation,junctionKind,roadExits:Object.freeze([...roadExits]),layer:'ground',edges:freezeEdges(edges)
  });
  const directions=Object.freeze(['north','east','south','west']);
  const all=material=>({north:material,east:material,south:material,west:material});
  const edgesFor=exits=>Object.fromEntries(directions.map(direction=>[direction,exits.includes(direction)?'road':'sidewalk']));
  const road=all('road'),sidewalk=all('sidewalk');
  const vertical={north:'road',east:'sidewalk',south:'road',west:'sidewalk'};
  const horizontal={north:'sidewalk',east:'road',south:'sidewalk',west:'road'};
  const catalog=Object.freeze([
    tile('street-junction-t-north',0,0,'road',true,'granite-curb-t',edgesFor(['north','east','west']),'north','t',['north','east','west']),
    tile('street-junction-t-east',1,0,'road',true,'granite-curb-t',edgesFor(['north','east','south']),'east','t',['north','east','south']),
    tile('street-junction-t-south',2,0,'road',true,'granite-curb-t',edgesFor(['east','south','west']),'south','t',['east','south','west']),
    tile('street-junction-t-west',3,0,'road',true,'granite-curb-t',edgesFor(['north','south','west']),'west','t',['north','south','west']),
    tile('street-junction-cross',0,1,'road',true,'asphalt-cross',road,'none','cross',directions),
    tile('street-junction-cross-lane-horizontal',1,1,'road',true,'cross-lane-horizontal',road,'horizontal','cross',directions),
    tile('street-junction-cross-lane-vertical',2,1,'road',true,'cross-lane-vertical',road,'vertical','cross',directions),
    tile('street-junction-cross-lane-full',3,1,'road',true,'cross-lane-full',road,'four-way','cross',directions),
    tile('street-junction-approach-north',0,2,'road',true,'straight-approach',vertical,'north',null,['north','south']),
    tile('street-junction-approach-east',1,2,'road',true,'straight-approach',horizontal,'east',null,['east','west']),
    tile('street-junction-approach-south',2,2,'road',true,'straight-approach',vertical,'south',null,['north','south']),
    tile('street-junction-approach-west',3,2,'road',true,'straight-approach',horizontal,'west',null,['east','west']),
    tile('street-junction-road',0,3,'road',true,'asphalt',road),
    tile('street-junction-lane-horizontal',1,3,'road',true,'lane-dash',road,'horizontal'),
    tile('street-junction-lane-vertical',2,3,'road',true,'lane-dash',road,'vertical'),
    tile('street-junction-sidewalk',3,3,'sidewalk',true,'granite',sidewalk)
  ]);
  const byId=Object.freeze(Object.fromEntries(catalog.map((entry,index)=>[entry.id,index])));
  const S='street-junction-sidewalk';
  const approach=Object.freeze({
    north:'street-junction-approach-north',east:'street-junction-approach-east',
    south:'street-junction-approach-south',west:'street-junction-approach-west'
  });
  const delta=Object.freeze({north:Object.freeze({x:0,y:-1}),east:Object.freeze({x:1,y:0}),south:Object.freeze({x:0,y:1}),west:Object.freeze({x:-1,y:0})});
  const specimen=(kind,centerId,x,y,roadExits,closedDirection=null)=>Object.freeze({
    kind,centerId,x,y,closedDirection,
    arms:Object.freeze(roadExits.map(direction=>Object.freeze({direction,tileId:approach[direction]})))
  });
  const specimens=Object.freeze([
    specimen('t','street-junction-t-north',2,2,['north','east','west'],'south'),
    specimen('t','street-junction-t-east',8,2,['north','east','south'],'west'),
    specimen('t','street-junction-t-south',2,8,['east','south','west'],'north'),
    specimen('t','street-junction-t-west',8,8,['north','south','west'],'east'),
    specimen('cross','street-junction-cross-lane-full',15,5,directions)
  ]);
  const width=20,height=12,rows=Array.from({length:height},()=>Array.from({length:width},()=>byId[S]));
  for(const item of specimens){
    rows[item.y][item.x]=byId[item.centerId];
    for(const arm of item.arms){
      const step=delta[arm.direction];rows[item.y+step.y][item.x+step.x]=byId[arm.tileId];
    }
  }
  const fixture=Object.freeze({
    id:'korean-street-junctions-fixture-v1',
    purpose:'isolated-all-entry-junction-validation-only',
    width,height,specimens,
    tilemap:Object.freeze({
      version:1,
      tileSize:25,
      atlas:Object.freeze({
        id:'korean-street-junctions-atlas-v1',
        image:'assets/art/travel/rpg/korean-street-junctions-atlas-v1.webp',
        width:256,
        height:256,
        columns:4,
        rows:4,
        sourceTileSize:64
      }),
      palette:catalog,
      layers:Object.freeze({ground:Object.freeze(rows.map(row=>Object.freeze(row)))})
    })
  });
  const tileset=Object.freeze({
    id:'korean-street-junctions-v1',
    version:1,
    scope:'future-seoul-zones',
    catalog,
    byId,
    fixture
  });
  const previousTilesets=Array.isArray(window.MALBIT_TRAVEL_TILESETS)?window.MALBIT_TRAVEL_TILESETS:[];
  const previousFixtures=Array.isArray(window.MALBIT_TRAVEL_TILE_FIXTURES)?window.MALBIT_TRAVEL_TILE_FIXTURES:[];
  window.MALBIT_TRAVEL_TILESETS=Object.freeze([...previousTilesets,tileset]);
  window.MALBIT_TRAVEL_TILE_FIXTURES=Object.freeze([...previousFixtures,fixture]);
})();
