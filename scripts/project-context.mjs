import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const bootstrap=read('site-patch.js');
const manifest=JSON.parse(read('data/question-bank-manifest.json'));
const version=bootstrap.match(/const VERSION='(\d+)'/)?.[1]||'?';
const runtimeBlock=bootstrap.match(/RUNTIME_FILES=Object\.freeze\(\[([\s\S]*?)\]\)/)?.[1]||'';
const runtimeFiles=[...runtimeBlock.matchAll(/'([^']+\.js)'/g)].map(match=>match[1]);

function git(...args){
  try{return execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()}
  catch{return'?'}
}

const branch=git('branch','--show-current');
const commit=git('rev-parse','--short','HEAD');
const dirty=git('status','--porcelain');

console.log(`MALBIT v${version} | ${branch}@${commit} | ${dirty?'dirty':'clean'}`);
console.log(`Runtime ${runtimeFiles.length} files | Bank ${Number(manifest.total_items||0).toLocaleString('en-US')} items`);
console.log('Host: GitHub Pages | Storage: local-first | Secrets in client: forbidden');
console.log('Current gaps: no cloud sync; generative AI needs a secure server; TTS uses device voices');
console.log('Default read set: AGENTS.md + docs/HANDOFF.md + owning file slice + focused test');
console.log('Large TOPIK bundle/generated bank: content tasks only');
