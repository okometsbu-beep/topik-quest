// MALBIT Travel RPG engine · pure world lookup, collision, movement, and interaction rules.
(function(){
  'use strict';

  const WORLDS=Array.isArray(window.MALBIT_TRAVEL_WORLDS)?window.MALBIT_TRAVEL_WORLDS:[];
  const DIRECTIONS=Object.freeze({
    up:Object.freeze({x:0,y:-1}),
    down:Object.freeze({x:0,y:1}),
    left:Object.freeze({x:-1,y:0}),
    right:Object.freeze({x:1,y:0})
  });
  const direction=value=>Object.hasOwn(DIRECTIONS,value)?value:'down';
  const point=(value,fallback)=>({
    x:Number.isInteger(Number(value?.x))?Number(value.x):fallback.x,
    y:Number.isInteger(Number(value?.y))?Number(value.y):fallback.y
  });
  const worldByRoute=packId=>WORLDS.find(world=>world.routeIds?.includes(packId))||null;
  const zoneById=(world,id)=>world?.zones?.find(zone=>zone.id===id)||null;
  const zoneScene=(zone,sceneId)=>zone?.scenes?.[sceneId]||null;
  function zoneForScene(packId,sceneId){
    const world=worldByRoute(packId);
    const zone=world?.zones?.find(candidate=>zoneScene(candidate,sceneId));
    return zone?{world,zone,anchor:zoneScene(zone,sceneId)}:null;
  }
  function cell(zone,x,y){
    if(!zone||x<0||y<0||x>=zone.width||y>=zone.height)return'#';
    return String(zone.grid?.[y]||'').charAt(x)||'#';
  }
  function occupied(zone,x,y,sceneId){
    const anchor=zoneScene(zone,sceneId);
    if(anchor?.x===x&&anchor?.y===y)return true;
    return !!zone?.pois?.some(item=>item.x===x&&item.y===y);
  }
  function isWalkable(zone,x,y,sceneId){return cell(zone,x,y)!=='#'&&!occupied(zone,x,y,sceneId)}
  function normalizeProgress(packId,value,sceneId){
    const match=zoneForScene(packId,sceneId);
    const world=match?.world||worldByRoute(packId);
    const requested=zoneById(world,value?.zoneId);
    const zone=match?.zone||requested||world?.zones?.[0]||null;
    if(!zone)return null;
    const spawn=point(zone.spawn,{x:0,y:0});
    let position=point(value,spawn);
    if(value?.zoneId!==zone.id||!isWalkable(zone,position.x,position.y,sceneId))position=spawn;
    return{
      version:1,
      worldId:world.id,
      zoneId:zone.id,
      x:position.x,
      y:position.y,
      direction:direction(value?.direction||zone.spawn?.direction),
      steps:Math.max(0,Number(value?.steps)||0),
      discoveries:Array.from(new Set(Array.isArray(value?.discoveries)?value.discoveries.filter(id=>typeof id==='string'):[]))
    };
  }
  function step(zone,progress,nextDirection,sceneId){
    const facing=direction(nextDirection),delta=DIRECTIONS[facing],x=progress.x+delta.x,y=progress.y+delta.y;
    if(!isWalkable(zone,x,y,sceneId))return{moved:false,blocked:true,progress:{...progress,direction:facing}};
    return{moved:true,blocked:false,progress:{...progress,x,y,direction:facing,steps:progress.steps+1}};
  }
  const distance=(a,b)=>Math.abs(Number(a.x)-Number(b.x))+Math.abs(Number(a.y)-Number(b.y));
  function interactionAt(zone,progress,sceneId){
    const anchor=zoneScene(zone,sceneId);
    if(anchor&&distance(progress,anchor)<=1)return{type:'scene',target:anchor};
    const target=zone?.pois?.find(item=>distance(progress,item)<=1);
    if(target)return{type:'poi',target};
    const portal=zone?.portals?.find(item=>distance(progress,item)<=1);
    return portal?{type:'portal',target:portal}:null;
  }
  function validateWorld(world){
    const errors=[],districtZones=new Set(world?.districts?.flatMap(item=>item.zoneIds||[])||[]);
    for(const zone of world?.zones||[]){
      if(zone.grid?.length!==zone.height)errors.push(`${zone.id}: height mismatch`);
      if(zone.grid?.some(row=>String(row).length!==zone.width))errors.push(`${zone.id}: width mismatch`);
      if(!districtZones.has(zone.id))errors.push(`${zone.id}: missing district link`);
      if(cell(zone,zone.spawn?.x,zone.spawn?.y)==='#')errors.push(`${zone.id}: blocked spawn`);
      const ids=(zone.pois||[]).map(item=>item.id);
      if(new Set(ids).size!==ids.length)errors.push(`${zone.id}: duplicate POI`);
    }
    return errors;
  }

  window.MALBIT_TRAVEL_RPG=Object.freeze({
    version:1,
    worlds:WORLDS,
    directions:DIRECTIONS,
    worldByRoute,
    zoneById,
    zoneForScene,
    zoneScene,
    normalizeProgress,
    isWalkable,
    step,
    interactionAt,
    validateWorld
  });
})();
