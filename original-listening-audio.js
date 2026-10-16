// Exact, technically verified original-script audio. Generation/review provenance
// is retained in the build manifest; this does not certify human listening quality.
(function(){
'use strict';
const base=window.HARUMAL_LISTENING_AUDIO;
const sourceById=new Map((window.MALBIT_ORIGINAL_EXAM_PARTS||[]).flat().map(q=>[q.id,q]));
function entry(source){
 const q=source;
 if(q?.section!=='listening'||q.collectionId!=='original12-v1'||q.reviewReady!==true)return null;
 for(const [data,batches]of [[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V9,['original-v1','original-v2','original-v3','original-v4','original-v5','original-v6','original-v7','original-v8','original-v9']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V8,['original-v1','original-v2','original-v3','original-v4','original-v5','original-v6','original-v7','original-v8']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V7,['original-v1','original-v2','original-v3','original-v4','original-v5','original-v6','original-v7']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V6,['original-v1','original-v2','original-v3','original-v4','original-v5','original-v6']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V5,['original-v1','original-v2','original-v3','original-v4','original-v5']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V4,['original-v1','original-v2','original-v3','original-v4']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V3,['original-v1','original-v2','original-v3']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO_V2,['original-v1','original-v2']],[window.HARUMAL_ORIGINAL_LISTENING_AUDIO,['original-v1']]]){
  if(data?.version!==1||data.verified!==true)continue;
  const found=data.byId?.[q.bankId||q.id];
  if(!found||!/^[a-f0-9]{64}$/.test(found.sourceScriptSha256)||!/^[a-f0-9]{64}$/.test(found.sourceContentSha256)||found.sourceContentSha256!==q.contentSha256||found.script!==q.script||!Array.isArray(found.segments)||!found.segments.length)continue;
  if(!found.segments.every(s=>s.pause?Number.isFinite(s.pause)&&s.pause>0&&s.pause<=10000:typeof s.text==='string'&&s.text.trim()&&/^[FM][1-9]$/.test(s.voice)&&/^[a-f0-9]{16,64}$/.test(s.id)&&batches.some(batch=>s.file===`audio/listening/${batch}/${s.voice}/${s.id}.mp3`)))continue;
  return found;
 }
 return null;
}
function resolve(script){
 for(const q of sourceById.values()){if(q.script!==script)continue;const found=entry(q);if(found)return found.segments.map(s=>s.pause?{pause:s.pause}:{url:s.file,text:s.text,gender:/^F/.test(s.voice)?'female':'male',source:'original-generated'})}
 return base?.resolve(script)||null;
}
window.HARUMAL_ORIGINAL_AUDIO=Object.freeze({entry});
if(base)window.HARUMAL_LISTENING_AUDIO=Object.freeze({...base,resolve,has:script=>!!resolve(script)});
})();
