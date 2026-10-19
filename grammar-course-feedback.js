/* Local activity rewards and evidence labels; never a proficiency certification. */
(function(){
'use strict';
const E=window.HARUMAL_GRAMMAR_ENGINE;
function independentConstruction(state,session,activity){const r=session.records[activity.id],first=r?.attempts?.[0];if(!r?.complete||r.attempts.length!==1||!first.correct||first.assisted||r.help.length)return false;if(!Number.isFinite(first.at))return true;return !Object.values(state.sessions||{}).some(other=>{if(other.id===session.id)return false;const prior=other.records?.[activity.id];if(!prior)return false;return prior.attempts.some(a=>a.at<first.at&&a.at+86400000>first.at)||(prior.help.length&&prior.updatedAt<first.at&&prior.updatedAt+86400000>first.at)})}
function skills(state,lesson,now=Date.now()){
 const result={guided:false,formed:false,constructed:false,transferred:false,recalled:false};
 for(const s of Object.values(state.sessions||{}).filter(s=>s.lessonId===lesson.id))for(const a of lesson.activities){const r=s.records[a.id];if(!r?.complete)continue;const independent=r.attempts.length===1&&r.attempts[0].correct&&!r.attempts[0].assisted&&!(r.help||[]).length;if(a.role==='guided')result.guided=true;else if(a.role==='construction'){if(independent&&independentConstruction(state,s,a))result.constructed=true}else if(a.phase==='transfer')result.transferred=true;else if(a.phase!=='review'&&a.type==='text')result.formed=true;}
 return result;
}
function opportunities(before,after,event,lesson,previousProgress,nextProgress,state={sessions:{}}){
 if(!before||!after||!event)return[];const result=[],identity='grammar-point:'+lesson.id;
 if(event.type==='submit'){const a=lesson.activities.find(a=>a.id===before.currentActivityId),r=after.records[a?.id];if(after.mode==='learn'&&a?.role==='construction'&&!before.records[a.id]?.complete&&r?.complete&&r.attempts.length===1&&r.attempts[0].correct&&!r.attempts[0].assisted&&!r.help.length&&independentConstruction(state,after,a))result.push({kind:'answer',source:'grammar-construction',sessionId:identity,slot:'independent-construction',question:{id:lesson.id,difficulty:'normal'},correct:true,assisted:false})}
 if(event.type==='submit'&&!before.complete&&after.complete){if(after.mode==='learn')result.push({kind:'stage',source:'grammar-course',sessionId:identity,stageId:'practice-complete',phase:'learn',assisted:E.summary(after).assisted});else if(nextProgress.retained&&nextProgress.successfulReviews>previousProgress.successfulReviews)result.push({kind:'stage',source:'grammar-course',sessionId:identity,stageId:'delayed-recall-'+Math.min(5,nextProgress.successfulReviews),phase:'transfer',assisted:false})}
 return result;
}
let audioContext;
function sound(){if(typeof S!=='object'||S.grammarCourseSound===false||S.muted===true||S.soundEnabled===false)return false;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;audioContext=audioContext||new AC();audioContext.resume?.();const now=audioContext.currentTime;for(const [frequency,offset] of [[660,0],[880,.10]]){const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency,now+offset);gain.gain.setValueAtTime(.0001,now+offset);gain.gain.exponentialRampToValueAtTime(.055,now+offset+.018);gain.gain.exponentialRampToValueAtTime(.0001,now+offset+.14);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now+offset);osc.stop(now+offset+.16)}return true}catch(_){return false}}
function award(rows){return rows.map(row=>window.HARUMAL_REWARDS?.[row.kind]?.(row)).filter(Boolean)}
window.HARUMAL_GRAMMAR_FEEDBACK=Object.freeze({skills,opportunities,award,sound,independentConstruction});
})();
