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
  const CUE_PLANS=Object.freeze({
    portal:Object.freeze({
      enter:Object.freeze({kind:'portal',phase:'enter',duration:110,sound:'portal-enter',vibration:Object.freeze([10])}),
      settle:Object.freeze({kind:'portal',phase:'arrive',duration:180,sound:'portal-arrive',vibration:Object.freeze([8,35,12])})
    }),
    poi:Object.freeze({
      enter:Object.freeze({kind:'investigation',phase:'discover',duration:80,sound:'investigation-open',vibration:Object.freeze([8])}),
      settle:Object.freeze({kind:'investigation',phase:'discover',duration:180,sound:'investigation-found',vibration:Object.freeze([10,28,10])})
    }),
    scene:Object.freeze({
      enter:Object.freeze({kind:'npc',phase:'enter',duration:100,sound:'npc-enter',vibration:Object.freeze([8])}),
      settle:null
    }),
    return:Object.freeze({
      enter:Object.freeze({kind:'return',phase:'return',duration:70,sound:'interaction-return',vibration:Object.freeze([6])}),
      settle:null
    })
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
  function contextForProgress(packId,value,sceneId){
    const sceneMatch=zoneForScene(packId,sceneId),world=sceneMatch?.world||worldByRoute(packId);
    const zone=zoneById(world,value?.zoneId)||sceneMatch?.zone||world?.zones?.[0]||null;
    return zone?{world,zone,anchor:zoneScene(zone,sceneId)}:null;
  }
  function cell(zone,x,y){
    if(!zone||x<0||y<0||x>=zone.width||y>=zone.height)return'#';
    return String(zone.grid?.[y]||'').charAt(x)||'#';
  }
  function occupied(zone,x,y,sceneId){
    const anchor=zoneScene(zone,sceneId);
    if(anchor?.x===x&&anchor?.y===y)return true;
    if(zone?.pois?.some(item=>item.x===x&&item.y===y))return true;
    return !!zone?.foregrounds?.some(item=>item.collision?.some(point=>point.x===x&&point.y===y));
  }
  function isWalkable(zone,x,y,sceneId){return cell(zone,x,y)!=='#'&&!occupied(zone,x,y,sceneId)}
  function normalizeProgress(packId,value,sceneId){
    const match=contextForProgress(packId,value,sceneId);
    const world=match?.world||worldByRoute(packId);
    const zone=match?.zone||null;
    if(!zone)return null;
    const spawn=point(zone.spawn,{x:0,y:0}),scale=Math.max(1,Number(zone.tilemap?.coordinateScale)||1);
    const legacy=value&&scale>1&&Number(value.version||1)<2;
    const source=legacy?{x:Number(value.x)*scale+Math.floor(scale/2),y:Number(value.y)*scale+Math.floor(scale/2)}:value;
    let position=point(source,spawn);
    if(value?.zoneId!==zone.id||!isWalkable(zone,position.x,position.y,sceneId))position=spawn;
    return{
      version:2,
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
  const interactionRange=zone=>Math.max(1,(Number(zone?.tilemap?.coordinateScale)||1)-1);
  function interactionAt(zone,progress,sceneId){
    const range=interactionRange(zone);
    const anchor=zoneScene(zone,sceneId);
    if(anchor&&distance(progress,anchor)<=range)return{type:'scene',target:anchor};
    const target=zone?.pois?.find(item=>distance(progress,item)<=range);
    if(target)return{type:'poi',target};
    const portal=zone?.portals?.find(item=>distance(progress,item)<=range);
    return portal?{type:'portal',target:portal}:null;
  }
  function enterPortal(world,progress,portal){
    const zone=zoneById(world,portal?.targetZoneId);
    if(!zone)return null;
    const target=point({x:portal.targetX,y:portal.targetY},zone.spawn);
    if(!isWalkable(zone,target.x,target.y,null))return null;
    return{
      ...progress,
      worldId:world.id,
      zoneId:zone.id,
      x:target.x,
      y:target.y,
      direction:direction(portal.direction||zone.spawn?.direction)
    };
  }
  function cuePlan(type,detail={}){
    const base=CUE_PLANS[type]||CUE_PLANS.return;
    if(type!=='poi'||!detail.found||!(Number(detail.reward)>0))return base;
    return Object.freeze({
      enter:base.enter,
      settle:Object.freeze({kind:'reward',phase:'reward',duration:220,sound:'reward-earned',vibration:Object.freeze([12,32,18])})
    });
  }
  function validateWorld(world){
    const errors=[],districtZones=new Set(world?.districts?.flatMap(item=>item.zoneIds||[])||[]),connections=new Map();
    for(const zone of world?.zones||[]){
      if(zone.grid?.length!==zone.height)errors.push(`${zone.id}: height mismatch`);
      if(zone.grid?.some(row=>String(row).length!==zone.width))errors.push(`${zone.id}: width mismatch`);
      const tilemap=zone.tilemap,ground=tilemap?.layers?.ground;
      if(!tilemap||tilemap.version!==1)errors.push(`${zone.id}: missing tilemap contract`);
      else{
        if(!tilemap.atlas?.image||tilemap.atlas.columns!==zone.width||tilemap.atlas.rows!==zone.height)errors.push(`${zone.id}: invalid tile atlas`);
        if(!Array.isArray(ground)||ground.length!==zone.height||ground.some(row=>String(row).length!==zone.width))errors.push(`${zone.id}: invalid ground tile layer`);
        for(const symbol of new Set(Array.from((ground||[]).join(''))))if(!tilemap.palette?.[symbol])errors.push(`${zone.id}: missing tile palette ${symbol}`);
      }
      if(!districtZones.has(zone.id))errors.push(`${zone.id}: missing district link`);
      if(cell(zone,zone.spawn?.x,zone.spawn?.y)==='#')errors.push(`${zone.id}: blocked spawn`);
      const ids=(zone.pois||[]).map(item=>item.id);
      if(new Set(ids).size!==ids.length)errors.push(`${zone.id}: duplicate POI`);
      const foregroundIds=(zone.foregrounds||[]).map(item=>item.id);
      if(new Set(foregroundIds).size!==foregroundIds.length)errors.push(`${zone.id}: duplicate foreground`);
      for(const foreground of zone.foregrounds||[]){
        if(!Number.isFinite(Number(foreground.depthY)))errors.push(`${zone.id}:${foreground.id}: missing depth`);
        if(!Array.isArray(foreground.polygon)||foreground.polygon.length<3)errors.push(`${zone.id}:${foreground.id}: invalid polygon`);
        else if(foreground.polygon.some(point=>!Number.isFinite(Number(point.x))||!Number.isFinite(Number(point.y))||point.x<0||point.y<0||point.x>zone.width||point.y>zone.height))errors.push(`${zone.id}:${foreground.id}: polygon out of bounds`);
        if(!Array.isArray(foreground.collision)||!foreground.collision.length)errors.push(`${zone.id}:${foreground.id}: missing collision`);
        else if(foreground.collision.some(point=>!Number.isInteger(Number(point.x))||!Number.isInteger(Number(point.y))||point.x<0||point.y<0||point.x>=zone.width||point.y>=zone.height))errors.push(`${zone.id}:${foreground.id}: collision out of bounds`);
      }
      const lightIds=(zone.lights||[]).map(item=>item.id);
      if(new Set(lightIds).size!==lightIds.length)errors.push(`${zone.id}: duplicate light`);
      for(const light of zone.lights||[]){
        const x=Number(light.x),y=Number(light.y),width=Number(light.width),height=Number(light.height),strength=Number(light.strength);
        if(!['lamp','screen','window'].includes(light.kind))errors.push(`${zone.id}:${light.id}: invalid light kind`);
        if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||x<0||y<0||x+width>zone.width||y+height>zone.height)errors.push(`${zone.id}:${light.id}: light out of bounds`);
        if(!/^#[0-9a-f]{6}$/i.test(String(light.color||'')))errors.push(`${zone.id}:${light.id}: invalid light color`);
        if(!Number.isFinite(strength)||strength<=0||strength>.65)errors.push(`${zone.id}:${light.id}: invalid light strength`);
      }
      for(const portal of zone.portals||[]){
        const targetZone=zoneById(world,portal.targetZoneId);
        if(!targetZone)errors.push(`${zone.id}:${portal.id}: missing target zone`);
        else if(!isWalkable(targetZone,portal.targetX,portal.targetY,null))errors.push(`${zone.id}:${portal.id}: blocked target`);
        if(cell(zone,portal.x,portal.y)==='#')errors.push(`${zone.id}:${portal.id}: blocked portal`);
        if(!portal.connectionId)errors.push(`${zone.id}:${portal.id}: missing connection`);
        else connections.set(portal.connectionId,(connections.get(portal.connectionId)||0)+1);
      }
    }
    for(const [id,count] of connections)if(count!==2)errors.push(`${id}: connection must have two endpoints`);
    return errors;
  }

  window.MALBIT_TRAVEL_RPG=Object.freeze({
    version:1,
    worlds:WORLDS,
    directions:DIRECTIONS,
    worldByRoute,
    zoneById,
    zoneForScene,
    contextForProgress,
    zoneScene,
    normalizeProgress,
    isWalkable,
    step,
    interactionRange,
    interactionAt,
    enterPortal,
    cuePlan,
    validateWorld
  });
})();
