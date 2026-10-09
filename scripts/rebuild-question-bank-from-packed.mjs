#!/usr/bin/env node
// Recovery path when the original upload is unavailable. Inverts the documented
// packed-row schema without inventing source fields, then calls the normal builder.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname, '..');
const context = vm.createContext({ window: {} });
for (let part = 1; part <= 4; part++) vm.runInContext(fs.readFileSync(path.join(root, `data/question-bank-v1-part${part}.js`), 'utf8'), context);
const rows = context.window.MALBIT_QUESTION_BANK_PARTS.flat();
const sections = { l: 'listening', r: 'reading', w: 'writing' };
const difficulties = { e: 'easy', m: 'medium', h: 'hard', v: 'very_hard' };
const items = rows.map(r => ({ id:r[0], mock_set:r[1], level:r[2]===1?'TOPIK I':'TOPIK II', section:sections[r[3]], question_no:r[4], item_type:r[5], difficulty:difficulties[r[6]], instruction:r[7], passage:r[8], audio_script:r[9], prompt:r[10], options:r[11], answer:r[3]==='w'?r[12]:r[12]+1, explanation_ko:r[13], explanation_ja:r[14], target_skills:r[15], visual_asset_prompt:r[16], model_answer:r[17], rubric:r[18], stimulus_group:r[19] }));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'harumal-bank-rebuild-'));
try {
  const input = path.join(temp, 'reconstructed-source.json');
  fs.writeFileSync(input, JSON.stringify({ source_note: 'Lossless reconstruction from packed rows; not original authored upload.', items }));
  execFileSync(process.execPath, [path.join(root, 'scripts/build-question-bank.mjs'), input], { stdio: 'inherit' });
} finally { fs.rmSync(temp, { recursive:true, force:true }); }
