const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const base='audio/listening/original-v9/';
async function fixture(change=()=>{},tamper=false){
 const {buildCorpus,sha256}=await import('../scripts/build-original-listening-corpus.mjs');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'harumal-cast-review-')),folder=path.join(temp,base);fs.mkdirSync(folder,{recursive:true});
 const snapshot=read(base+'source-snapshot.json'),review=read(base+'gender-reference-review.json');
 snapshot.items=snapshot.items.filter(q=>q.id==='O08-II-L-48');delete snapshot.reusePacks;
 change(snapshot,review);
 const originalReviewBytes=fs.readFileSync(path.join(root,base,'gender-reference-review.json'),'utf8');
 const reviewBytes=JSON.stringify(review)===JSON.stringify(JSON.parse(originalReviewBytes))?originalReviewBytes:JSON.stringify(review);snapshot.genderReferenceReviewSha256=sha256(reviewBytes);
 if(tamper==='missingApproval')delete snapshot.genderReferenceReviewSha256;
 fs.writeFileSync(path.join(folder,'gender-reference-review.json'),reviewBytes+(tamper===true?' ':''));
 fs.writeFileSync(path.join(folder,'source-snapshot.json'),JSON.stringify(snapshot));
 try{return buildCorpus(temp,'original-v9')}finally{fs.rmSync(temp,{recursive:true,force:true})}
}
test('a reviewed fictional male character does not change the two unspecified interview voices',async()=>{
 const corpus=await fixture();assert.equal(corpus.questionCount,1);assert.equal(corpus.reviewedIncidentalGenderReferences.length,1);
 const cast=Object.values(corpus.casting)[0].roles;
 assert.deepEqual(cast.map(r=>[r.label,r.voice,r.genderInferredFromRole]),[['진행자','F1',false],['작가','M1',false]]);
 assert.equal(corpus.byId['O08-II-L-48'].sourceScriptSha256,read(base+'gender-reference-review.json').items[0].sourceScriptSha256);
 assert.ok(corpus.corpus.every(row=>!row.text.includes('아버지의 시계')),'hypothetical prompt must not enter synthesis');
});
test('missing, unapproved, tampered, duplicate, stale or wrong-target casting reviews fail closed',async()=>{
 const {reviewHash}=await import('../scripts/build-original-exams.mjs');
 await assert.rejects(fixture(()=>{},'missingApproval'),/Ambiguous gender target/);
 await assert.rejects(fixture(()=>{},true),/review file changed/);
 for(const change of [
  (s,r)=>r.status='draft',(s,r)=>r.reviewer='',(s,r)=>r.reviewedAt='invalid',
  (s,r)=>r.items.push({...r.items[0]}),(s,r)=>r.items[0].classification='speaker',
  (s,r)=>r.items[0].id='O08-II-L-47',
  (s,r)=>{s.items[0].id='O08-II-L-47';s.items[0].qa.contentSha256=reviewHash(s.items[0]);r.items[0].id=s.items[0].id;r.items[0].sourceContentSha256=s.items[0].qa.contentSha256},(s,r)=>r.items[0].gender='여자',
  ...['sourceContentSha256','sourceScriptSha256','promptSha256','instructionSha256'].map(k=>(s,r)=>r.items[0][k]='0'.repeat(64)),
  (s,r)=>{s.items[0].prompt='남자가 강조하는 생각은 무엇입니까?';s.items[0].qa.contentSha256=reviewHash(s.items[0])},
  (s,r)=>{s.items[0].script+=' ';s.items[0].qa.contentSha256=reviewHash(s.items[0])},
  (s,r)=>r.items.push({...r.items[0],id:'O08-II-L-49'})
 ])await assert.rejects(fixture(change));
});
test('optional reviewed-character handling exactly rebuilds every earlier published corpus without writes',async()=>{
 const {buildCorpus}=await import('../scripts/build-original-listening-corpus.mjs');
 for(let n=1;n<=8;n++){
  const file=`audio/listening/original-v${n}/corpus.json`,bytes=fs.readFileSync(path.join(root,file));
  assert.deepEqual(buildCorpus(root,`original-v${n}`),JSON.parse(bytes));
  assert.equal(hash(fs.readFileSync(path.join(root,file))),hash(bytes));
 }
});
