import fs from 'node:fs';
export const listeningChoiceRepairs = JSON.parse(fs.readFileSync(new URL('./listening-choice-repairs.json', import.meta.url), 'utf8'));
export function repairListeningChoices(item) {
  const options = [...(item.options || [])];
  if (item.section !== 'listening') return options;
  for (const pattern of listeningChoiceRepairs.repairs) {
    const target = pattern.items.find(target => target.id === item.id);
    if (!target) continue;
    if (item.answer - 1 !== target.answer_index || options[target.answer_index] !== target.answer_text) throw new Error(`Unexpected key in repaired item ${item.id}`);
    if (!String(item.audio_script).includes(pattern.source_evidence)) throw new Error(`Missing contradiction evidence in ${item.id}`);
    if (![pattern.old, pattern.corrected].includes(options[target.option_index])) throw new Error(`Unexpected distractor in ${item.id}`);
    options[target.option_index] = pattern.corrected;
  }
  for (const target of listeningChoiceRepairs.particle_repairs) {
    if (target.id !== item.id) continue;
    if (![target.old, target.corrected].includes(options[target.option_index])) throw new Error(`Unexpected particle target in ${item.id}`);
    options[target.option_index] = target.corrected;
  }
  return options;
}
