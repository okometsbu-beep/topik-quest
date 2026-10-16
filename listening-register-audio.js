// Add exact corrected-script mappings without rewriting the immutable original catalog.
(function(){
'use strict';
const base=window.HARUMAL_LISTENING_AUDIO;if(!base)return;
function resolve(script){const data=window.HARUMAL_LISTENING_REGISTER_AUDIO;
 if(data?.version!==1||data.verified!==true)return base.resolve(script);
 const segments=data.scripts?.[script];if(!Array.isArray(segments))return base.resolve(script);
 return segments.map(s=>s.pause?{pause:s.pause}:{url:s.file,text:s.text,gender:/^F/.test(s.voice)?'female':'male'});
}
window.HARUMAL_LISTENING_AUDIO=Object.freeze({...base,resolve,has:script=>!!resolve(script)});
})();
