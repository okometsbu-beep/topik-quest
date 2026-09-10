// MALBIT Shorts stable identity, semantic-family cycle, and schema-3 migration.
(function(root){
'use strict';
const RECENT_LIMIT=40;
const normalize=value=>String(value||'').normalize('NFKC').replace(/\s+/g,' ').trim();
const unique=values=>[...new Set((values||[]).filter(Boolean))];

function identity(item,level){
  const lv=Number(level)===1?1:2,type=normalize(item?.type||'item'),term=normalize(item?.term);
  const id=item?.bankId||`SHORT-${lv}-${type}-${term}`;
  const family=item?.bankId
    ?`BANK-${lv}-${type}-${term}-${(item.choices||[]).map(normalize).sort().join('¦')}`
    :`CURATED-${lv}-${type}-${term}`;
  return{id,family};
}

function catalog(deck,level){
  return (deck||[]).map((item,index)=>({item,index,...identity(item,level)}));
}

function migrate(state,deck,level){
  const rows=catalog(deck,level),p=state&&typeof state==='object'?state:{},byId=new Map(rows.map(row=>[row.id,row]));
  let current=(p.cardId&&byId.get(p.cardId))||(p.orderId&&rows.find(row=>row.item?.bankId===p.orderId));
  if(!current&&rows.length)current=rows[Math.max(0,Number(p.index)||0)%rows.length];
  const fromLegacy=unique((p.recent||[]).map(value=>rows[Math.max(0,Number(value)||0)%Math.max(1,rows.length)]?.id));
  const recentIds=unique(Array.isArray(p.recentIds)&&p.recentIds.length?p.recentIds:fromLegacy).filter(id=>byId.has(id)).slice(-RECENT_LIMIT);
  const familyById=new Map(rows.map(row=>[row.id,row.family]));
  const recentFamilies=unique(Array.isArray(p.recentFamilies)&&p.recentFamilies.length?p.recentFamilies:recentIds.map(id=>familyById.get(id)))
    .filter(family=>rows.some(row=>row.family===family)).slice(-RECENT_LIMIT);
  const cycleFamilies=unique(Array.isArray(p.cycleFamilies)?p.cycleFamilies:recentFamilies)
    .filter(family=>rows.some(row=>row.family===family));
  p.index=current?.index||0;
  p.cardId=current?.id||null;
  p.familyId=current?.family||null;
  p.recentIds=recentIds;
  p.recentFamilies=recentFamilies;
  p.cycleFamilies=cycleFamilies;
  p.cycle=Math.max(0,Number(p.cycle)||0);
  p.isReview=!!p.isReview;
  return p;
}

function pick(state,deck,level,random=Math.random){
  const rows=catalog(deck,level),p=migrate(state,deck,level);
  if(!rows.length)return 0;
  const families=unique(rows.map(row=>row.family)),currentFamily=p.familyId,currentId=p.cardId;
  let seen=new Set(p.cycleFamilies),cycle=p.cycle;
  let unseen=families.filter(family=>!seen.has(family));
  if(!unseen.length){seen=new Set();unseen=families.slice();cycle+=1}
  const recentFamilies=new Set(p.recentFamilies),recentIds=new Set(p.recentIds);
  let familyPool=unseen.filter(family=>family!==currentFamily&&!recentFamilies.has(family));
  if(!familyPool.length)familyPool=unseen.filter(family=>family!==currentFamily);
  if(!familyPool.length)familyPool=families.filter(family=>family!==currentFamily&&!recentFamilies.has(family));
  if(!familyPool.length)familyPool=families.filter(family=>family!==currentFamily);
  if(!familyPool.length)familyPool=families.slice();
  const family=familyPool[Math.min(familyPool.length-1,Math.floor(Math.max(0,Math.min(.999999,Number(random())||0))*familyPool.length))];
  let itemPool=rows.filter(row=>row.family===family&&!recentIds.has(row.id)&&row.id!==currentId);
  if(!itemPool.length)itemPool=rows.filter(row=>row.family===family&&row.id!==currentId);
  if(!itemPool.length)itemPool=rows.filter(row=>row.family===family);
  const row=itemPool[Math.min(itemPool.length-1,Math.floor(Math.max(0,Math.min(.999999,Number(random())||0))*itemPool.length))];
  p.index=row.index;
  p.cardId=row.id;
  p.familyId=row.family;
  p.cycle=cycle;
  p.isReview=cycle>0;
  p.cycleFamilies=unique([...seen,row.family]);
  p.recentIds=unique([...p.recentIds,row.id]).slice(-Math.min(RECENT_LIMIT,Math.max(1,rows.length-1)));
  p.recentFamilies=unique([...p.recentFamilies,row.family]).slice(-Math.min(RECENT_LIMIT,Math.max(1,families.length-1)));
  // Keep the old numeric history for backward compatibility; schema 3 reads stable IDs first.
  p.recent=[...(p.recent||[]).map(Number).filter(Number.isFinite),row.index].slice(-Math.min(RECENT_LIMIT,Math.max(1,rows.length-1)));
  return row.index;
}

const api=Object.freeze({schema:3,identity,migrate,pick});
root.MALBIT_SHORTS_CYCLE=api;
if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
