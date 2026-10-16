import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sha256,buildCorpus,packFolder} from './build-original-listening-corpus.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function buildCatalog(root=ROOT,pack='original-v1',{allowPending=false}={}){
 const read=file=>fs.readFileSync(path.join(root,file));
 const base=packFolder(pack)+'/',corpusBytes=read(base+'corpus.json'),manifestBytes=read(base+'manifest.json');
 const corpus=JSON.parse(corpusBytes),manifest=JSON.parse(manifestBytes);
 assert.deepEqual(corpus,buildCorpus(root,pack),'Frozen source/corpus mismatch');
 assert.equal(manifest.corpusSha256,sha256(corpusBytes));assert.equal(manifest.sourceSnapshotSha256,corpus.sourceSnapshotSha256);
 if(allowPending&&!manifest.decodeVerified){
  assert.notEqual(pack,'original-v1','The completed first pack must not be replaced by a pending catalog');
  return {version:1,batchId:pack,verified:false,status:'pending_generation',sourceSnapshotSha256:corpus.sourceSnapshotSha256,corpusSha256:sha256(corpusBytes),manifestSha256:sha256(manifestBytes),humanPronunciationReview:false,scriptToAudioMeaningVerified:false,physicalDevicePlaybackVerified:false,questionCount:corpus.questionCount,scriptCount:corpus.scriptCount,clipCount:corpus.clipCount,byId:{}};
 }
 const recordBytes=read(base+'generation-records.json'),records=JSON.parse(recordBytes);
 assert.equal(manifest.generationRecordsSha256,sha256(recordBytes));
 assert.equal(records.corpusSha256,sha256(corpusBytes));assert.equal(records.sourceSnapshotSha256,corpus.sourceSnapshotSha256);
 assert.equal(records.files.length,corpus.clipCount);
 assert.equal(manifest.corpusSha256,sha256(corpusBytes));assert.equal(manifest.sourceSnapshotSha256,corpus.sourceSnapshotSha256);
 for(const key of ['decodeVerified','loudnessMeasured','synthesisInputMappingVerified'])assert.equal(manifest[key],true,key);
 for(const key of ['missingFileCount','heldFileCount','invalidFileCount'])assert.equal(manifest[key],0,key);
 assert.equal(manifest.fileCount,corpus.clipCount);assert.equal(manifest.coveredQuestionCount,corpus.questionCount);
 for(const key of ['unexpectedFiles','duplicateAudioHashes'])assert.deepEqual(manifest[key],[]);
 const files=new Map(manifest.files.map(file=>[file.file,file]));assert.equal(files.size,corpus.clipCount);
 for(const file of manifest.files){const bytes=read(file.file);assert.equal(bytes.length,file.bytes);assert.equal(sha256(bytes),file.sha256)}
 for(const entry of Object.values(corpus.byId))for(const segment of entry.segments)if(!segment.pause){
  const file=files.get(segment.file);assert.ok(file);assert.equal(file.voice,segment.voice);assert.equal(file.id,segment.id);assert.equal(file.textSha256,sha256(segment.text));
 }
 const result={version:1,verified:true,verificationScope:'Technical decoding, loudness, exact approved source hashes and synthesis-input mapping. Pronunciation, spoken meaning, voice distinction and device playback remain unreviewed.',sourceSnapshotSha256:corpus.sourceSnapshotSha256,corpusSha256:sha256(corpusBytes),manifestSha256:sha256(manifestBytes),generationRecordsSha256:sha256(recordBytes),humanPronunciationReview:false,scriptToAudioMeaningVerified:false,physicalDevicePlaybackVerified:false,questionCount:corpus.questionCount,scriptCount:corpus.scriptCount,clipCount:corpus.clipCount,byId:corpus.byId};
 if(pack!=='original-v1')result.batchId=pack;
 return result;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const pack=process.argv.includes('--pack')?process.argv[process.argv.indexOf('--pack')+1]:'original-v1';
 const global=pack==='original-v1'?'HARUMAL_ORIGINAL_LISTENING_AUDIO':`HARUMAL_ORIGINAL_LISTENING_AUDIO_V${pack.slice('original-v'.length)}`;
 const result=buildCatalog(ROOT,pack,{allowPending:process.argv.includes('--allow-pending')}),output='// Generated from the frozen, reviewed original listening source. Technical checks do not certify listening quality.\nwindow.'+global+'='+JSON.stringify(result)+';\n';
 const target=path.join(ROOT,`data/original-listening-audio-v${pack.slice('original-v'.length)}.js`);
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),output);else fs.writeFileSync(target,output);
 console.log(`Original listening catalog: ${result.questionCount} questions, ${result.scriptCount} scripts, ${result.clipCount} ${result.verified?'verified':'planned; pending'} clips`);
}
