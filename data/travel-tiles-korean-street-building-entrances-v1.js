// MALBIT Travel RPG reusable Korean building entrances · ground transitions and upper-layer baseline contract.
(function(){
  'use strict';

  const freezeEdges=edges=>Object.freeze({...edges});
  const entranceEdges=Object.freeze({north:'building',east:'sidewalk',south:'sidewalk',west:'sidewalk'});
  const groundTile=(id,atlasX,atlasY,entranceKind,variant,traversal,stepFree)=>Object.freeze({
    id,atlasX,atlasY,terrain:'entrance',walkable:true,variant,orientation:'north',entranceKind,
    traversal,stepFree,entryDirection:'north',layer:'ground',edges:freezeEdges(entranceEdges)
  });
  const upperTile=(id,atlasX,variant,baselineY)=>Object.freeze({
    id,atlasX,atlasY:3,terrain:'building',walkable:false,variant,orientation:'north',
    layer:'upper',baselineY,occludesAboveBaseline:true,edges:freezeEdges({north:'building',east:'building',south:'entrance',west:'building'})
  });
  const catalog=Object.freeze([
    groundTile('building-entrance-threshold-stone',0,0,'threshold','stone-sill','level',true),
    groundTile('building-entrance-threshold-wood',1,0,'threshold','wood-sill','level',true),
    groundTile('building-entrance-threshold-striped',2,0,'threshold','anti-slip-sill','level',true),
    groundTile('building-entrance-threshold-teal',3,0,'threshold','teal-sill','level',true),
    groundTile('building-entrance-step-landing',0,1,'steps','single-step','stairs',false),
    groundTile('building-entrance-steps-low',1,1,'steps','two-step','stairs',false),
    groundTile('building-entrance-steps-high',2,1,'steps','three-step','stairs',false),
    groundTile('building-entrance-step-platform',3,1,'steps','wide-landing','stairs',false),
    groundTile('building-entrance-ramp-plain',0,2,'ramp','curbed-ramp','ramp',true),
    groundTile('building-entrance-ramp-rail-left',1,2,'ramp','left-rail','ramp',true),
    groundTile('building-entrance-ramp-open',2,2,'ramp','open-ramp','ramp',true),
    groundTile('building-entrance-ramp-rails',3,2,'ramp','dual-rail','ramp',true)
  ]);
  const upperCatalog=Object.freeze([
    upperTile('building-entrance-upper-dark-door',0,'dark-door-frame',40),
    upperTile('building-entrance-upper-wood-door',1,'wood-door-frame',40),
    upperTile('building-entrance-upper-glass-door',2,'glass-door-frame',40),
    upperTile('building-entrance-upper-awning',3,'teal-awning',40)
  ]);
  const byId=Object.freeze(Object.fromEntries(catalog.map((entry,index)=>[entry.id,index])));
  const upperById=Object.freeze(Object.fromEntries(upperCatalog.map((entry,index)=>[entry.id,index])));
  const ids=(...names)=>Object.freeze(names.map(name=>byId[name]));
  const fixture=Object.freeze({
    id:'korean-street-building-entrances-fixture-v1',
    purpose:'isolated-building-entry-baseline-validation-only',
    width:4,
    height:3,
    specimens:Object.freeze([
      Object.freeze({kind:'threshold',tileId:'building-entrance-threshold-stone',x:0,y:0,traversal:'level',stepFree:true}),
      Object.freeze({kind:'steps',tileId:'building-entrance-steps-low',x:1,y:1,traversal:'stairs',stepFree:false}),
      Object.freeze({kind:'ramp',tileId:'building-entrance-ramp-rails',x:3,y:2,traversal:'ramp',stepFree:true})
    ]),
    upperSamples:Object.freeze(upperCatalog.map(entry=>Object.freeze({tileId:entry.id,baselineY:entry.baselineY}))),
    tilemap:Object.freeze({
      version:1,
      tileSize:25,
      atlas:Object.freeze({
        id:'korean-street-building-entrances-atlas-v1',
        image:'assets/art/travel/rpg/korean-street-building-entrances-atlas-v1.webp',
        width:256,
        height:256,
        columns:4,
        rows:4,
        sourceTileSize:64
      }),
      palette:catalog,
      layers:Object.freeze({ground:Object.freeze([
        ids('building-entrance-threshold-stone','building-entrance-threshold-wood','building-entrance-threshold-striped','building-entrance-threshold-teal'),
        ids('building-entrance-step-landing','building-entrance-steps-low','building-entrance-steps-high','building-entrance-step-platform'),
        ids('building-entrance-ramp-plain','building-entrance-ramp-rail-left','building-entrance-ramp-open','building-entrance-ramp-rails')
      ])})
    })
  });
  const tileset=Object.freeze({
    id:'korean-street-building-entrances-v1',
    version:1,
    scope:'future-seoul-zones',
    catalog,
    upperCatalog,
    byId,
    upperById,
    fixture
  });
  const previousTilesets=Array.isArray(window.MALBIT_TRAVEL_TILESETS)?window.MALBIT_TRAVEL_TILESETS:[];
  const previousFixtures=Array.isArray(window.MALBIT_TRAVEL_TILE_FIXTURES)?window.MALBIT_TRAVEL_TILE_FIXTURES:[];
  window.MALBIT_TRAVEL_TILESETS=Object.freeze([...previousTilesets,tileset]);
  window.MALBIT_TRAVEL_TILE_FIXTURES=Object.freeze([...previousFixtures,fixture]);
})();
