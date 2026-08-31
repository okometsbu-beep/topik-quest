// MALBIT Travel RPG reusable Korean streetscape tiles · atlas catalog and isolated fixture.
(function(){
  'use strict';

  const freezeEdges=edges=>Object.freeze({...edges});
  const tile=(id,atlasX,atlasY,terrain,walkable,variant,edges,orientation='none')=>Object.freeze({
    id,atlasX,atlasY,terrain,walkable,variant,orientation,layer:'ground',edges:freezeEdges(edges)
  });
  const all=material=>({north:material,east:material,south:material,west:material});
  const road=all('road'),sidewalk=all('sidewalk');
  const catalog=Object.freeze([
    tile('street-sidewalk-a',0,0,'sidewalk',true,'granite-a',sidewalk),
    tile('street-sidewalk-b',1,0,'sidewalk',true,'granite-b',sidewalk),
    tile('street-road-a',2,0,'road',true,'asphalt-a',road),
    tile('street-road-b',3,0,'road',true,'asphalt-b',road),
    tile('street-boundary-south',0,1,'boundary',false,'granite-curb',{
      north:'road',east:'boundary',south:'sidewalk',west:'boundary'
    },'south'),
    tile('street-boundary-west',1,1,'boundary',false,'granite-curb',{
      north:'boundary',east:'road',south:'boundary',west:'sidewalk'
    },'west'),
    tile('street-boundary-north',2,1,'boundary',false,'granite-curb',{
      north:'sidewalk',east:'boundary',south:'road',west:'boundary'
    },'north'),
    tile('street-boundary-east',3,1,'boundary',false,'granite-curb',{
      north:'boundary',east:'sidewalk',south:'boundary',west:'road'
    },'east'),
    tile('street-crosswalk-vertical-a',0,2,'crosswalk',true,'paint-a',road,'vertical'),
    tile('street-crosswalk-vertical-b',1,2,'crosswalk',true,'paint-b',road,'vertical'),
    tile('street-crosswalk-horizontal-a',2,2,'crosswalk',true,'paint-a',road,'horizontal'),
    tile('street-crosswalk-horizontal-b',3,2,'crosswalk',true,'paint-b',road,'horizontal'),
    tile('street-tactile-horizontal',0,3,'sidewalk',true,'tactile',sidewalk,'horizontal'),
    tile('street-tactile-vertical',1,3,'sidewalk',true,'tactile',sidewalk,'vertical'),
    tile('street-lane-horizontal',2,3,'road',true,'lane-dash',road,'horizontal'),
    tile('street-lane-vertical',3,3,'road',true,'lane-dash',road,'vertical')
  ]);
  const byId=Object.freeze(Object.fromEntries(catalog.map((entry,index)=>[entry.id,index])));
  const ids=(...names)=>Object.freeze(names.map(name=>byId[name]));
  const sidewalkRow=Object.freeze(Array.from({length:12},(_,x)=>byId[x%2?'street-sidewalk-b':'street-sidewalk-a']));
  const northEdge=ids(
    'street-boundary-south','street-boundary-south','street-boundary-south','street-boundary-south',
    'street-tactile-horizontal','street-tactile-horizontal','street-tactile-horizontal','street-tactile-horizontal',
    'street-boundary-south','street-boundary-south','street-boundary-south','street-boundary-south'
  );
  const roadRowA=ids(
    'street-road-a','street-road-b','street-road-a','street-road-b',
    'street-crosswalk-horizontal-a','street-crosswalk-horizontal-b','street-crosswalk-horizontal-a','street-crosswalk-horizontal-b',
    'street-road-a','street-road-b','street-road-a','street-road-b'
  );
  const roadRowB=ids(
    'street-road-b','street-road-a','street-road-b','street-road-a',
    'street-crosswalk-horizontal-b','street-crosswalk-horizontal-a','street-crosswalk-horizontal-b','street-crosswalk-horizontal-a',
    'street-road-b','street-road-a','street-road-b','street-road-a'
  );
  const southEdge=ids(
    'street-boundary-north','street-boundary-north','street-boundary-north','street-boundary-north',
    'street-tactile-horizontal','street-tactile-horizontal','street-tactile-horizontal','street-tactile-horizontal',
    'street-boundary-north','street-boundary-north','street-boundary-north','street-boundary-north'
  );
  const fixture=Object.freeze({
    id:'korean-street-basic-fixture-v1',
    purpose:'isolated-validation-only',
    width:12,
    height:8,
    tilemap:Object.freeze({
      version:1,
      tileSize:25,
      atlas:Object.freeze({
        id:'korean-street-basic-atlas-v1',
        image:'assets/art/travel/rpg/korean-street-basic-atlas-v1.webp',
        width:256,
        height:256,
        columns:4,
        rows:4,
        sourceTileSize:64
      }),
      palette:catalog,
      layers:Object.freeze({ground:Object.freeze([
        sidewalkRow,sidewalkRow,northEdge,roadRowA,roadRowB,southEdge,sidewalkRow,sidewalkRow
      ])})
    })
  });
  const tileset=Object.freeze({
    id:'korean-street-basic-v1',
    version:1,
    scope:'future-seoul-zones',
    catalog,
    byId,
    fixture
  });

  window.MALBIT_TRAVEL_TILESETS=Object.freeze([tileset]);
  window.MALBIT_TRAVEL_TILE_FIXTURES=Object.freeze([fixture]);
})();
