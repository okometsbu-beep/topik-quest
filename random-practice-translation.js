// MALBIT · honest full-question translation states for Random Practice.
(function(){
'use strict';

const clean=value=>String(value??'').replace(/\s+/gu,' ').trim();
const hasHangul=value=>/[\uac00-\ud7a3]/u.test(String(value??''));
const hasJapanese=value=>/[\u3040-\u30ff]/u.test(String(value??''));

function unavailableText(target){
  return ({
    ja:'この問題の全文翻訳は現在利用できません。韓国語の原文は上に表示されています。',
    en:'A full translation is not available for this question. The Korean original is shown above.',
    zh:'这道题暂时无法提供全文翻译。上方显示的是韩语原文。'
  })[target]||'이 문제의 전체 번역은 현재 제공되지 않습니다. 한국어 원문은 위에 표시되어 있습니다.';
}

function usable(source,value,target){
  const original=clean(source),translated=clean(value);
  if(!translated||translated===original)return false;
  if(target==='ja'&&hasHangul(translated)&&!hasJapanese(translated))return false;
  return true;
}

async function resolve({source,target,reviewed,translate}){
  const original=String(source??'');
  if(target==='ko')return{status:'original',text:original};
  if(clean(reviewed))return{status:'reviewed',text:String(reviewed)};
  if(typeof translate!=='function')return{status:'unavailable',text:unavailableText(target)};
  try{
    const value=await translate(original,target);
    return usable(original,value,target)
      ?{status:'automatic',text:String(value)}
      :{status:'unavailable',text:unavailableText(target)};
  }catch(error){
    return{status:'unavailable',text:unavailableText(target)};
  }
}

window.MALBIT_RANDOM_TRANSLATION=Object.freeze({resolve,usable,unavailableText});
})();
