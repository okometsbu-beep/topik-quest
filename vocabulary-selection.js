// Keep an explicitly selected range intact and retain only its nearby sentence locally.
(function(){
'use strict';
let snapshot=null;
const clean=value=>String(value??'').trim();
function sentence(text,start,end){
 const value=String(text??''),left=value.slice(0,start),right=value.slice(end);
 const before=Math.max(left.lastIndexOf('.'),left.lastIndexOf('!'),left.lastIndexOf('?'),left.lastIndexOf('\n'))+1;
 const next=right.search(/[.!?\n]/),after=next<0?value.length:end+next+1;
 const result=value.slice(before,after).trim();
 // Do not save a whole long paragraph/page as context.
 return result.length<=700?result:value.slice(start,end).trim().slice(0,700);
}
function classify(term){return window.MALBIT_VOCAB_GRAMMAR?.lookup(term)||/^[-~]|^[AVN]-|[+·]/.test(term)?'grammar':/\s/.test(term)?'expression':'word'}
function capture(selection){
 if(!selection||selection.isCollapsed||!selection.rangeCount)return null;
 const term=clean(selection.toString());if(!term||term.length>500||!/[가-힣]/.test(term))return null;
 const range=selection.getRangeAt(0),element=node=>node?.nodeType===1?node:node?.parentElement;
 const first=element(range.startContainer),last=element(range.endContainer);
 const zone=first?.closest?.('.selectable,.vocab-zone');
 if(!zone||!zone.contains(last)||first.closest('input,textarea,[contenteditable="true"]'))return null;
 const a=first.closest('p,li,blockquote,h1,h2,h3,h4'),b=last?.closest?.('p,li,blockquote,h1,h2,h3,h4');
 const scope=a&&a===b?a:zone;let context=term;
 try{const before=range.cloneRange();before.selectNodeContents(scope);before.setEnd(range.startContainer,range.startOffset);const start=before.toString().length;context=sentence(scope.textContent,start,start+selection.toString().length)}catch(_){}
 return{term,raw:term,context,type:classify(term),selection:true};
}
window.MALBIT_VOCAB_SELECTION={capture,sentence,classify,current:()=>snapshot,clear:()=>{snapshot=null}};
document.addEventListener('selectionchange',()=>{clearTimeout(window._vocabRangeTimer);window._vocabRangeTimer=setTimeout(()=>{
 const next=capture(window.getSelection?.());if(!next)return;
 snapshot=next;if(typeof selectedText!=='undefined')selectedText=next.term;
 const bar=document.getElementById('selectionBar'),word=document.getElementById('selectionWord');if(word)word.textContent=next.term;if(bar)bar.classList.add('show');
},260)});
})();
