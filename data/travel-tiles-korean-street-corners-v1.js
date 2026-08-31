// MALBIT Travel RPG reusable Korean streetscape corners · sibling atlas and isolated 90-degree fixture.
(function(){
  'use strict';

  const freezeEdges=edges=>Object.freeze({...edges});
  const tile=(id,atlasX,atlasY,terrain,walkable,variant,edges,orientation='none',cornerKind=null,curbExits=[])=>Object.freeze({
    id,atlasX,atlasY,terrain,walkable,variant,orientation,cornerKind,curbExits:Object.freeze([...curbExits]),layer:'ground',edges:freezeEdges(edges)
  });
  const all=material=>({north:material,east:material,south:material,west:material});
  const road=all('road'),sidewalk=all('sidewalk');
  const cornerEdges=Object.freeze({
    ne:Object.freeze({north:'sidewalk',east:'sidewalk',south:'road',west:'road'}),
    se:Object.freeze({north:'road',east:'sidewalk',south:'sidewalk',west:'road'}),
    sw:Object.freeze({north:'road',east:'road',south:'sidewalk',west:'sidewalk'}),
    nw:Object.freeze({north:'sidewalk',east:'road',south:'road',west:'sidewalk'})
  });
  const catalog=Object.freeze([
    tile('street-corner-outer-ne',0,0,'boundary',false,'granite-curb-outer',cornerEdges.ne,'north-east','outer',['west','south']),
    tile('street-corner-outer-se',1,0,'boundary',false,'granite-curb-outer',cornerEdges.se,'south-east','outer',['west','north']),
    tile('street-corner-outer-sw',2,0,'boundary',false,'granite-curb-outer',cornerEdges.sw,'south-west','outer',['east','north']),
    tile('street-corner-outer-nw',3,0,'boundary',false,'granite-curb-outer',cornerEdges.nw,'north-west','outer',['east','south']),
    tile('street-corner-inner-ne',0,1,'boundary',false,'granite-curb-inner',cornerEdges.sw,'north-east','inner',['north','east']),
    tile('street-corner-inner-se',1,1,'boundary',false,'granite-curb-inner',cornerEdges.nw,'south-east','inner',['east','south']),
    tile('street-corner-inner-sw',2,1,'boundary',false,'granite-curb-inner',cornerEdges.ne,'south-west','inner',['west','south']),
    tile('street-corner-inner-nw',3,1,'boundary',false,'granite-curb-inner',cornerEdges.se,'north-west','inner',['west','north']),
    tile('street-corner-boundary-south',0,2,'boundary',false,'granite-curb-straight',{north:'road',east:'boundary',south:'sidewalk',west:'boundary'},'south',null,['east','west']),
    tile('street-corner-boundary-west',1,2,'boundary',false,'granite-curb-straight',{north:'boundary',east:'road',south:'boundary',west:'sidewalk'},'west',null,['north','south']),
    tile('street-corner-boundary-north',2,2,'boundary',false,'granite-curb-straight',{north:'sidewalk',east:'boundary',south:'road',west:'boundary'},'north',null,['east','west']),
    tile('street-corner-boundary-east',3,2,'boundary',false,'granite-curb-straight',{north:'boundary',east:'sidewalk',south:'boundary',west:'road'},'east',null,['north','south']),
    tile('street-corner-sidewalk',0,3,'sidewalk',true,'granite',sidewalk),
    tile('street-corner-road',1,3,'road',true,'asphalt',road),
    tile('street-corner-lane-horizontal',2,3,'road',true,'lane-dash',road,'horizontal'),
    tile('street-corner-lane-vertical',3,3,'road',true,'lane-dash',road,'vertical')
  ]);
  const byId=Object.freeze(Object.fromEntries(catalog.map((entry,index)=>[entry.id,index])));
  const ids=(...names)=>Object.freeze(names.map(name=>byId[name]));
  const S='street-corner-sidewalk',R='street-corner-road',LH='street-corner-lane-horizontal',LV='street-corner-lane-vertical';
  const BN='street-corner-boundary-north',BW='street-corner-boundary-west',BS='street-corner-boundary-south',BE='street-corner-boundary-east';
  const fixture=Object.freeze({
    id:'korean-street-corners-fixture-v1',
    purpose:'isolated-90-degree-validation-only',
    width:12,
    height:8,
    specimens:Object.freeze([
      Object.freeze({kind:'outer',cornerId:'street-corner-outer-nw',x:2,y:2,arms:Object.freeze([{direction:'east',tileId:BN},{direction:'south',tileId:BW}])}),
      Object.freeze({kind:'inner',cornerId:'street-corner-inner-se',x:8,y:4,arms:Object.freeze([{direction:'east',tileId:BS},{direction:'south',tileId:BE}])})
    ]),
    tilemap:Object.freeze({
      version:1,
      tileSize:25,
      atlas:Object.freeze({
        id:'korean-street-corners-atlas-v1',
        image:'assets/art/travel/rpg/korean-street-corners-atlas-v1.webp',
        width:256,
        height:256,
        columns:4,
        rows:4,
        sourceTileSize:64
      }),
      palette:catalog,
      layers:Object.freeze({ground:Object.freeze([
        ids(S,S,S,S,S,S,R,R,R,R,R,R),
        ids(S,S,S,S,S,S,R,R,R,R,R,R),
        ids(S,S,'street-corner-outer-nw',BN,BN,BN,R,R,R,R,R,R),
        ids(S,S,BW,R,LH,R,R,R,R,R,R,R),
        ids(S,S,BW,R,LH,R,R,R,'street-corner-inner-se',BS,BS,S),
        ids(S,S,BW,R,R,R,R,R,BE,S,S,S),
        ids(S,S,BW,R,LV,R,R,R,BE,S,S,S),
        ids(S,S,BW,R,LV,R,R,R,BE,S,S,S)
      ])})
    })
  });
  const tileset=Object.freeze({
    id:'korean-street-corners-v1',
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
