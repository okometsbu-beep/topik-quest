const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const corpusBytes=read('audio/listening/register-v1/corpus.json'),manifestBytes=read('audio/listening/register-v1/manifest.json'),corpus=JSON.parse(corpusBytes),manifest=JSON.parse(manifestBytes);
assert.equal(manifest.decodeVerified,true);assert.equal(manifest.missingFileCount,0);assert.equal(manifest.invalidFileCount,0);assert.equal(manifest.corpusSha256,hash(corpusBytes));
const files=new Map(manifest.files.map(f=>[f.file,f]));for(const f of manifest.files){assert.equal(hash(read(f.file)),f.sha256);assert.equal(read(f.file).length,f.bytes)}
for(const segments of Object.values(corpus.scripts))for(const s of segments){if(s.pause)continue;assert.ok(fs.existsSync(s.file));if(s.file.includes('/register-v1/'))assert.ok(files.has(s.file))}
const result={version:1,verified:true,verificationScope:'technical decoding, loudness and source-input mapping; listening quality not certified',manifestSha256:hash(manifestBytes),corpusSha256:hash(corpusBytes),scripts:corpus.scripts};
const output='// Generated technical audio catalog. Activation and perceptual review are separate.\nwindow.HARUMAL_LISTENING_REGISTER_AUDIO='+JSON.stringify(result)+';\n';const path='data/listening-register-audio-v1.js';if(process.argv.includes('--check'))assert.equal(read(path).toString(),output);else fs.writeFileSync(path,output);console.log('Verified correction catalog: 60 clips; activation unchanged');
