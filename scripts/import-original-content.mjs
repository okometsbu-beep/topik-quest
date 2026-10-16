import {buildNeutralChoiceVisuals,deriveNeutralChoiceVisuals} from './build-neutral-choice-visuals.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {reviewHash,buildOriginalExams,validateOriginalExams,readExistingBank} from './build-original-exams.mjs';
import {buildSupport} from './build-original-support.mjs';
import publicReviewMetadata from './public-review-metadata.cjs';
const {projectReviewMetadata}=publicReviewMetadata;
const input=process.argv[2];if(!input)throw Error('Pass the local reviewed manuscript folder explicitly');
const dir=path.resolve(input),read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
const core=read('original-production-current.json'),items=core.items.filter(q=>q.qa?.status==='approved'),assets=new Map();
for(const q of items){if(q.qa.contentSha256!==reviewHash(q))throw Error(`Stale content review: ${q.id}`);q.qa=projectReviewMetadata({...q.qa,reviewer:'independent-content-review',report:'docs/qa/original-exams-content.md#review-integrity'});if(q.qa.blindReviewer)q.qa.blindReviewer='independent-blind-review';if(q.qa.blindReviewEvidence)q.qa.blindReviewEvidence='independent blind review recorded';
 const images=q.visual?.kind==='image'?[q.visual]:q.visual?.kind==='options'?Object.values(q.visual.byOption||{}):[];
 for(const image of images){if(!/^assets\/original\/[a-zA-Z0-9_.\/-]+\.(svg|png|webp)$/.test(image.src)||image.src.split('/').includes('..'))throw Error('Unsafe asset path');const bytes=fs.readFileSync(path.join(dir,image.src)),sha=crypto.createHash('sha256').update(bytes).digest('hex');if(q.qa.assetHashes?.[image.src]!==sha)throw Error(`Missing or stale visual review: ${q.id} ${image.src}`);assets.set(image.src,bytes)}
}
const source={...core,items},coverage=read('coverage-slots-2088.json'),packs={},files=new Map();
for(const [src,dst,key]of [['original-listening-support-current.json','original-listening-support.json','japanese'],['original-localization-support-current.json','original-localization-support.json','coaching'],['original-listening-locale-support-current.json','original-listening-locale-support.json','locales']]){const pack=read(src);pack.items=pack.items.filter(p=>p.qa?.status==='approved').map(p=>({...p,qa:projectReviewMetadata({...p.qa,reviewer:'independent-content-review',report:'docs/qa/original-exams-content.md#localization-support'})}));packs[key]=pack;files.set('content/'+dst,JSON.stringify(pack,null,2)+'\n')}
// Validate the whole incoming snapshot before replacing any current source/asset.
// Use the incoming coverage contract, never a module-load snapshot of an old file.
const preview=validateOriginalExams(source,{root:dir,allowPartial:true,existing:readExistingBank(),coverage:new Map(coverage.slots.map(s=>[s.id,s]))});
if(preview.items.some(q=>!q.reviewReady||!q.visualReady))throw Error('Approved import contains stale review or incomplete visuals');
const support=buildSupport(source,packs);
// Refuse unsupported mixed-label artwork before replacing any current file.
deriveNeutralChoiceVisuals(dir,{source});
files.set('content/original-exams-v1.json',JSON.stringify(source,null,2)+'\n');files.set('content/original-exams-coverage.json',JSON.stringify(coverage,null,2)+'\n');
for(const [file,bytes]of [...assets,...files]){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.importing',bytes);fs.renameSync(file+'.importing',file)}
const result=buildOriginalExams(path.resolve('content/original-exams-v1.json'),{allowPartial:true});buildNeutralChoiceVisuals();console.log(`Imported ${items.length} approved items; ${core.items.length-items.length} drafts withheld; ${result.sets.filter(s=>s.ready).length}/24 content-complete sets; support prevalidated for ${support.fourLanguageReady} items. Build support separately before testing.`);
