// Keep native range selection and text editing available where a learner needs them;
// suppress unrelated UI callouts elsewhere.
(function(){
'use strict';
// A text field or a rich-text surface keeps the browser's own editing behaviour:
// long-press caret placement, selection, copy, cut and paste.
const EDITABLE='input,textarea,[contenteditable="true"],[contenteditable=""]';
const editingTarget=target=>{
  const node=target?.nodeType===3?target.parentElement:target;
  return node?.closest?.(EDITABLE)||null;
};
for(const type of ['contextmenu','selectstart','copy','cut','paste'])document.addEventListener(type,e=>{
 // Never take editing away from an input, textarea or contenteditable surface.
 if(editingTarget(e.target))return;
 const target=e.target?.nodeType===3?e.target.parentElement:e.target;
 const learningText=target?.closest?.('.selectable,.vocab-zone');
 const control=target?.closest?.('input,textarea,select,button,a,[contenteditable="true"],[role="button"]');
 if(learningText&&!control&&['contextmenu','selectstart','copy'].includes(type))return;
 e.preventDefault();
},{capture:true});
})();
