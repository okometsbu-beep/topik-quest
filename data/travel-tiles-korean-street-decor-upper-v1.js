// MALBIT Travel RPG reusable Korean street decoration upper layers · baseline and collision-footprint contract.
(function(){
  'use strict';

  const emptyFootprint=Object.freeze({width:0,height:0,cells:Object.freeze([])});
  const cellFootprint=Object.freeze({width:1,height:1,cells:Object.freeze([Object.freeze({x:0,y:0})])});
  const upperTile=(id,atlasX,atlasY,category,variant,baselineY,blocksMovement)=>Object.freeze({
    id,atlasX,atlasY,category,variant,terrain:'decor',walkable:false,orientation:'north',layer:'upper',
    baselineY,occludesAboveBaseline:true,blocksMovement,
    collisionFootprint:blocksMovement?cellFootprint:emptyFootprint
  });
  const upperCatalog=Object.freeze([
    upperTile('street-decor-sign-round',0,0,'sign','round-projecting',48,false),
    upperTile('street-decor-sign-square',1,0,'sign','square-projecting',48,false),
    upperTile('street-decor-sign-vertical',2,0,'sign','vertical-projecting',48,false),
    upperTile('street-decor-sign-blade',3,0,'sign','slim-blade',48,false),
    upperTile('street-decor-awning-teal',0,1,'awning','teal-fold',42,false),
    upperTile('street-decor-awning-navy',1,1,'awning','navy-fold',42,false),
    upperTile('street-decor-awning-rust',2,1,'awning','rust-fold',42,false),
    upperTile('street-decor-awning-cream',3,1,'awning','cream-fold',42,false),
    upperTile('street-decor-planter-shrub',0,2,'planter','round-shrub',56,true),
    upperTile('street-decor-planter-flower-box',1,2,'planter','flower-box',56,true),
    upperTile('street-decor-planter-ceramic',2,2,'planter','ceramic-pot',56,true),
    upperTile('street-decor-planter-hedge-box',3,2,'planter','hedge-box',56,true),
    upperTile('street-decor-detail-wall-lamp',0,3,'street-detail','wall-lamp',52,false),
    upperTile('street-decor-detail-utility-cabinet',1,3,'street-detail','utility-cabinet',56,true),
    upperTile('street-decor-detail-bench',2,3,'street-detail','wood-bench',56,true),
    upperTile('street-decor-detail-bollard',3,3,'street-detail','stone-bollard',56,true)
  ]);
  const upperById=Object.freeze(Object.fromEntries(upperCatalog.map((entry,index)=>[entry.id,index])));
  const fixture=Object.freeze({
    id:'korean-street-decor-upper-fixture-v1',
    purpose:'isolated-decor-baseline-collision-validation-only',
    width:4,
    height:4,
    specimens:Object.freeze([
      Object.freeze({kind:'sign',tileId:'street-decor-sign-round'}),
      Object.freeze({kind:'awning',tileId:'street-decor-awning-teal'}),
      Object.freeze({kind:'planter',tileId:'street-decor-planter-shrub'}),
      Object.freeze({kind:'street-detail',tileId:'street-decor-detail-bench'})
    ]),
    tilemap:Object.freeze({
      version:1,
      tileSize:25,
      atlas:Object.freeze({
        id:'korean-street-decor-upper-atlas-v1',
        image:'assets/art/travel/rpg/korean-street-decor-upper-atlas-v1.webp',
        width:256,
        height:256,
        columns:4,
        rows:4,
        sourceTileSize:64
      }),
      upperPalette:upperCatalog,
      layers:Object.freeze({upper:Object.freeze([
        Object.freeze([0,1,2,3]),
        Object.freeze([4,5,6,7]),
        Object.freeze([8,9,10,11]),
        Object.freeze([12,13,14,15])
      ])})
    })
  });
  const tileset=Object.freeze({id:'korean-street-decor-upper-v1',version:1,scope:'future-seoul-zones',upperCatalog,upperById,fixture});
  const previousTilesets=Array.isArray(window.MALBIT_TRAVEL_TILESETS)?window.MALBIT_TRAVEL_TILESETS:[];
  const previousFixtures=Array.isArray(window.MALBIT_TRAVEL_TILE_FIXTURES)?window.MALBIT_TRAVEL_TILE_FIXTURES:[];
  window.MALBIT_TRAVEL_TILESETS=Object.freeze([...previousTilesets,tileset]);
  window.MALBIT_TRAVEL_TILE_FIXTURES=Object.freeze([...previousFixtures,fixture]);
})();
