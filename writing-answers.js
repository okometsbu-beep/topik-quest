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
  function ready(id,value,minimum){return short(id)?keys.every(k=>length(normalize(value).answers[k])>=minimum):length(value)>=minimum;}
  function text(id,value){return short(id)?keys.map(k=>normalize(value).answers[k]).join('\n'):String(value||'');}
  function assess(value,model){
    const answers=normalize(value).answers,models=split(model);
    const clean=s=>String(s||'').replace(/[\s.!?。]/g,'');
    return Object.fromEntries(keys.map(k=>[k,{answer:answers[k],model:models?.[k]||'',status:!length(answers[k])?'empty':models&&clean(answers[k])===clean(models[k])?'model-match':'compare'}]));
  }
  root.MALBIT_WRITING={keys,split,normalize,short,length,ready,text,assess};
})(typeof window==='undefined'?globalThis:window);
