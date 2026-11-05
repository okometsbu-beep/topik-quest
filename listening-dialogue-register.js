// Only these exact corrected legacy conversations override the immutable audio catalog.
(function(){
'use strict';
const base=window.HARUMAL_LISTENING_AUDIO;
if(!base)return;
function resolve(script){
 const data=window.HARUMAL_LISTENING_DIALOGUE_REGISTER;
 const segments=data?.version===1&&data.verified===true&&data.scripts?.[script];
 if(!Array.isArray(segments))return base.resolve(script);
 const allowed={ '택배가 오늘 도착한다더니 아직 안 왔네요.':'2a7510344ed998fb','배송 조회를 해 보니까 기사님이 주소를 못 찾고 있대요.':'80e1574c8d1215ab','반찬을 매번 많이 만들어서 결국 버리게 돼요.':'ebf7282880cbb9aa','그러니까 처음부터 먹을 만큼만 준비하는 게 좋아요. 남은 재료가 있으면 다른 요리에 활용할 수도 있고요.':'a564215df85a8da8'};
 const lines=script.split('\n');
 if(segments.length!==2||lines.length!==2||segments.some((s,i)=>!s||s.pause||allowed[s.text]!==s.id||s.voice!==(i?'M1':'F1')||s.text!==lines[i].replace(/^(여자|남자): /,'')||!/^[a-f0-9]{16}$/.test(s.id)||s.file!=='audio/listening/dialogue-register-v1/'+s.voice+'/'+s.id+'.mp3'))return base.resolve(script);
 return segments.map(s=>s.pause?{pause:s.pause}:{url:s.file,text:s.text,gender:s.voice==='F1'?'female':'male'});
}
window.HARUMAL_LISTENING_AUDIO=Object.freeze({...base,resolve,has:script=>!!resolve(script)});
})();
