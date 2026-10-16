import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildCatalog} from './build-original-listening-catalog.mjs';
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
export function validateAudioCoverage(core,catalogs,{expectedCount=960}={}){
 const listening=core.items.filter(q=>q.section==='listening');assert.equal(listening.length,expectedCount,'Original listening collection is incomplete');
 const missing=[];for(const q of listening){const found=catalogs.some(c=>c.version===1&&c.verified===true&&c.byId?.[q.id]?.sourceContentSha256===q.qa?.contentSha256&&c.byId[q.id].sourceScriptSha256===digest(q.script)&&c.byId[q.id].script===q.script&&c.byId[q.id].segments?.some(s=>s.file));if(!found)missing.push(q.id);}
 assert.equal(missing.length,0,`Missing current-source verified recording: ${missing.join(', ')}`);return listening.length;
}
export function checkOriginalAudio(root='.',options={}){
 const files=fs.readdirSync(path.join(root,'data')).filter(file=>/^original-listening-audio-v[1-9][0-9]*\.js$/.test(file)),catalogs=[],runtime={window:{HARUMAL_LISTENING_AUDIO:{resolve:()=>null}}},bootstrap=fs.readFileSync(path.join(root,'site-patch.js'),'utf8');vm.createContext(runtime);
 for(let part=1;part<=4;part++)vm.runInContext(fs.readFileSync(path.join(root,`data/original-exams-v1-part${part}.js`),'utf8'),runtime);
 for(const file of files){const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data',file),'utf8'),c);const data=Object.values(c.window)[0];if(data?.verified!==true)continue;
  const batch=file.match(/-v([1-9][0-9]*)\.js$/)[1];assert.deepEqual(JSON.parse(JSON.stringify(data)),buildCatalog(root,`original-v${batch}`),`${file}: frozen source, generation record, catalog, or clip mismatch`);assert.ok(bootstrap.includes(`'data/${file}'`),`${file}: verified catalog is absent from the runtime loader`);
  Object.assign(runtime.window,c.window);catalogs.push(data);
 }
 const count=validateAudioCoverage(JSON.parse(fs.readFileSync(path.join(root,'content/original-exams-v1.json'),'utf8')),catalogs,options);
 vm.runInContext(fs.readFileSync(path.join(root,'original-listening-audio.js'),'utf8'),runtime);
 const questions=runtime.window.MALBIT_ORIGINAL_EXAM_PARTS.flat().filter(q=>q.section==='listening');assert.equal(questions.length,count);for(const q of questions)assert.ok(runtime.window.HARUMAL_ORIGINAL_AUDIO.entry(q),`${q.id}: verified recording not connected to the playback adapter`);
 return count;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(`Original audio release gate: ${checkOriginalAudio()} current-source technically verified listening questions; perceptual review is separate`);
