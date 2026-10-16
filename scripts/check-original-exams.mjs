import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {validateOriginalExams,readExistingBank,EXPECTED} from './build-original-exams.mjs';
import {buildSupport} from './build-original-support.mjs';
import {checkOriginalAudio} from './check-original-audio-coverage.mjs';
const read=f=>fs.readFileSync(f),json=f=>JSON.parse(read(f)),digest=x=>crypto.createHash('sha256').update(x).digest('hex');
const source=json('content/original-exams-v1.json'),manifest=json('data/original-exams-manifest.json');
// Explicit versioned release snapshot, never an unrestricted --allow-partial CI flag.
const scopePath='content/original-release-scope.json',scope=fs.existsSync(scopePath)?json(scopePath):null;
if(scope){assert.equal(scope.mode,'approved_subset');assert.equal(scope.targetItems,EXPECTED);assert.equal(scope.releaseVersion,Number(read('site-patch.js').toString().match(/const VERSION='(\d+)'/)[1]));for(const[file,sha]of Object.entries(scope.sourceHashes))assert.equal(digest(read(file)),sha,`Release input changed: ${file}`);for(const file of ['content/original-exams-v1.json','content/original-localization-support.json','content/original-listening-support.json','content/original-listening-locale-support.json'])assert.ok(scope.sourceHashes[file],`Unbound release input: ${file}`);}
const result=validateOriginalExams(source,{existing:readExistingBank(),allowPartial:!!scope});
assert.ok(result.items.every(q=>q.reviewReady&&q.visualReady),'Every included item must have current independent review and required visuals');
assert.equal(manifest.totalItems,scope?scope.approvedItems:EXPECTED);assert.equal(result.items.length,manifest.totalItems);assert.deepEqual(result.sets,manifest.sets);assert.equal(manifest.releaseReady,result.sets.every(s=>s.ready));
if(!scope)assert.equal(manifest.releaseReady,true);
assert.equal(digest(read('content/original-exams-v1.json')),manifest.sourceSha256,'Original source changed after build');for(const item of manifest.files)assert.equal(digest(read(item.file)),item.sha256,`Generated payload changed: ${item.file}`);
const support=json('data/original-support-manifest.json');assert.equal(support.coreSourceSha256,manifest.sourceSha256);assert.equal(support.totalCore,manifest.totalItems);assert.equal(support.fourLanguageReady,scope?scope.fourLanguageItems:EXPECTED);assert.equal(support.rejectedOrUnmatched,0);assert.equal(digest(read('data/original-support-v1.js')),support.outputSha256);
const rebuilt=buildSupport(source,{coaching:json('content/original-localization-support.json'),japanese:json('content/original-listening-support.json'),locales:json('content/original-listening-locale-support.json')});
for(const entry of Object.values(rebuilt.byId))for(const transcript of Object.values(entry.transcripts)){delete transcript.script;transcript.turns=transcript.turns.map(({speaker,text})=>({speaker,text}));transcript.evidence=transcript.evidence.map(({turnIndex,quote,role})=>({turnIndex,quote,role}))}
const c={window:{HARUMAL_LISTENING_AUDIO:{resolve:()=>null}},localStorage:{getItem:()=>null,setItem(){}}};vm.createContext(c);vm.runInContext(read('data/original-support-v1.js').toString(),c);assert.deepEqual(JSON.parse(JSON.stringify(c.window.HARUMAL_ORIGINAL_SUPPORT)),rebuilt,'Runtime localization differs from independently approved source');
const count=checkOriginalAudio('.',{expectedCount:scope?scope.listeningItems:960});
for(let i=1;i<=4;i++)for(const f of [`data/question-bank-v1-part${i}.js`,`data/original-exams-v1-part${i}.js`])vm.runInContext(read(f).toString(),c);
assert.deepEqual(JSON.parse(JSON.stringify(c.window.MALBIT_ORIGINAL_EXAM_PARTS.flat())),result.items.map(({qa,...runtime})=>runtime),'Generated original core payload differs from the approved source');
for(const f of ['data/question-bank-practice-v1.js',...fs.readdirSync('data').filter(f=>/^original-listening-audio-v\d+\.js$/.test(f)).map(f=>'data/'+f),'original-listening-audio.js','question-bank-engine.js'])vm.runInContext(read(f).toString(),c);
const readySets={};for(const lang of ['ko','ja','en','zh'])for(const level of [1,2]){const sets=c.window.MALBIT_BANK.mockSets(level,'original12-v1',lang);readySets[`${lang}-${level}`]=sets.filter(s=>s.ready).map(s=>s.set);assert.ok(sets.filter(s=>s.ready).every(s=>s.missingAudio===0));}
if(scope)assert.deepEqual(JSON.parse(JSON.stringify(readySets)),scope.readySets,'Locale set readiness must match the frozen approved release');else assert.ok(Object.values(readySets).every(x=>x.length===12));
console.log(`Original-exam release gate: ${manifest.totalItems}/${EXPECTED} reviewed items; ${support.fourLanguageReady} four-language items; ${count} source-matched listening recordings; unfinished sets remain locked`);
