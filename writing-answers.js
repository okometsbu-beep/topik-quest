// Shared, DOM-free answer contract. Never infer a split from an unlabelled newline.
(function(root){
  const keys=['giyeok','nieun'];
  function split(value){
    const match=String(value||'').match(/^\s*(?:㉠|ㄱ)\s*[:：.)]?\s*([\s\S]*?)\s*(?:\/\s*)?(?:㉡|ㄴ)\s*[:：.)]?\s*([\s\S]*)$/u);
    return match?{giyeok:match[1].trim(),nieun:match[2].trim()}:null;
  }
  function normalize(value){
    if(value&&typeof value==='object'&&!Array.isArray(value))return {...value,schema:2,answers:{giyeok:String(value.answers?.giyeok??''),nieun:String(value.answers?.nieun??'')}};
    const old=typeof value==='string'?value:'';
    return {schema:2,answers:split(old)||{giyeok:old,nieun:''},...(old?{legacyText:old,needsReview:!split(old)}:{})};
  }
  const short=id=>Number(id)===51||Number(id)===52;
  const length=value=>String(value||'').replace(/\s/g,'').length;
  // PBT task targets: NIIED, TOPIK II Writing Guide (2024), pp. 3 and 5.
  // https://exam.topik.go.kr/nasdata/webnas/raonkeditordata/uploadId/2024/02/20240227_175504804_07236.pdf
  const pbtTargets=Object.freeze({53:Object.freeze({min:200,max:300}),54:Object.freeze({min:600,max:700})});
  const pbtTarget=id=>pbtTargets[Number(id)]||null;
  // Approximate typed length, not manuscript-grid cells (digits/punctuation have special grid rules).
  // Keep the non-space practice readiness counter above independent of these exam targets.
  const pbtLength=value=>Array.from(String(value||'').normalize('NFC').replace(/[\r\n]/g,'')).length;
  function ready(id,value,minimum){return short(id)?keys.every(k=>length(normalize(value).answers[k])>=minimum):length(value)>=minimum;}
  function text(id,value){return short(id)?keys.map(k=>normalize(value).answers[k]).join('\n'):String(value||'');}
  function assess(value,model){
    const answers=normalize(value).answers,models=split(model);
    const clean=s=>String(s||'').replace(/[\s.!?。]/g,'');
    return Object.fromEntries(keys.map(k=>[k,{answer:answers[k],model:models?.[k]||'',status:!length(answers[k])?'empty':models&&clean(answers[k])===clean(models[k])?'model-match':'compare'}]));
  }
  root.MALBIT_WRITING={keys,split,normalize,short,length,pbtTarget,pbtLength,ready,text,assess};
})(typeof window==='undefined'?globalThis:window);
