const test=require('node:test'),assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path');

test('preview server serves seekable media with exact byte ranges and HEAD',async()=>{
  const root=path.resolve(__dirname,'..');
  const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
  try{
    const url=await new Promise((resolve,reject)=>{
      child.once('error',reject);child.once('exit',code=>reject(Error('server exited '+code)));
      child.stdout.once('data',data=>resolve(String(data).match(/http:\/\/\S+/)[0]));
      child.stderr.once('data',data=>reject(Error(String(data))));
    });
    const file='assets/audio/haruman-intro-v3-character.mp3';
    const bytes=fs.readFileSync(path.join(root,file));
    const full=await fetch(url+'/'+file);assert.equal(full.status,200);
    assert.equal(full.headers.get('accept-ranges'),'bytes');
    assert.deepEqual(Buffer.from(await full.arrayBuffer()),bytes);
    for(const [range,start,end] of [['bytes=100-199',100,199],['bytes=100-',100,bytes.length-1],['bytes=-32',bytes.length-32,bytes.length-1]]){
      const response=await fetch(url+'/'+file,{headers:{Range:range}});
      assert.equal(response.status,206);assert.equal(response.headers.get('content-range'),`bytes ${start}-${end}/${bytes.length}`);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes.subarray(start,end+1));
    }
    const head=await fetch(url+'/'+file,{method:'HEAD'});
    assert.equal(Number(head.headers.get('content-length')),bytes.length);assert.equal((await head.arrayBuffer()).byteLength,0);
    for(const range of ['bytes=999999-','bytes=20-10','bytes=-0','bytes=abc-']){
      const response=await fetch(url+'/'+file,{headers:{Range:range}});assert.equal(response.status,416);
      assert.equal(response.headers.get('content-range'),`bytes */${bytes.length}`);
    }
  }finally{child.kill()}
});
