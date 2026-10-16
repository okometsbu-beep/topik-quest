import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const internalLabel=/^(?:장면|그래프)\s*[가나다라]$/u;
const exposedLabel=/(?:장면|그래프)\s*[가나다라](?=$|[^\p{L}\p{N}])/u;
const elementText=value=>value.replace(/<[^>]*>/g,'').replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).trim();

// Preserve approved originals. A display derivative removes only an exact,
// nonsemantic internal scene/graph label element; all other bytes stay intact.
export function neutralizeSvg(source){
 assert.doesNotMatch(source,/<(?:script|foreignObject)\b|\son\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/)/i,'Unsafe SVG');
 const removed=[];
 const output=source.replace(/<(text|title|desc)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,element=>{
  const value=elementText(element);
  if(internalLabel.test(value)){removed.push(element);return ''}
  assert.ok(!exposedLabel.test(value),'Internal label mixed with meaningful text needs explicit review');
  return element;
 });
 return {output,removed};
}

export function deriveNeutralChoiceVisuals(root=ROOT,{source:providedSource}={}){
 const source=providedSource||JSON.parse(fs.readFileSync(path.join(root,'content/original-exams-v1.json'),'utf8'));
 const bySource={},files=new Map();let optionQuestions=0;
 for(const q of source.items){
  if(q.visual?.kind!=='options')continue;
  optionQuestions++;
  for(const item of Object.values(q.visual.byOption)){
   const src=item.src;assert.match(src,/^assets\/original\/[A-Za-z0-9_-]+\.svg$/);
   const original=fs.readFileSync(path.join(root,src),'utf8'),sourceSha256=hash(original);
   assert.equal(q.qa.assetHashes?.[src],sourceSha256,`Unreviewed source image: ${q.id} ${src}`);
   if(bySource[src]){assert.equal(bySource[src].sourceSha256,sourceSha256);continue}
   const {output,removed}=neutralizeSvg(original);
   const displaySrc=removed.length?src.replace('assets/original/','assets/original-neutral/'):src;
   if(removed.length)files.set(displaySrc,output);
   bySource[src]={src:displaySrc,sourceSha256,sha256:hash(output),removedInternalLabels:removed.length};
  }
 }
 return {data:{version:1,generated:true,scope:'Exact internal scene/graph label removal only; original approved SVGs preserved.',optionQuestions,sourceCount:Object.keys(bySource).length,derivedCount:files.size,bySource},files};
}

export function buildNeutralChoiceVisuals(root=ROOT,{check=false}={}){
 const result=deriveNeutralChoiceVisuals(root),catalog='// Generated display mappings; approved source images are never overwritten.\nwindow.HARUMAL_NEUTRAL_VISUALS='+JSON.stringify(result.data)+';\n';
 const files=new Map([...result.files,['data/neutral-choice-visuals-v1.js',catalog]]);
 for(const [relative,content]of files){const target=path.join(root,relative);if(check)assert.equal(fs.readFileSync(target,'utf8'),content,relative);else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,content)}}
 return result.data;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=buildNeutralChoiceVisuals(ROOT,{check:process.argv.includes('--check')});
 console.log(`Neutral visual choices: ${result.optionQuestions} questions, ${result.sourceCount} source images, ${result.derivedCount} exact-label derivatives`);
}
