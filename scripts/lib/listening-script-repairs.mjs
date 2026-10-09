import fs from 'node:fs';

// Bounded, reviewed source repairs. Never infer new facts or change answer choices.
export const listeningScriptRepairs = JSON.parse(fs.readFileSync(new URL('./listening-script-repairs.json', import.meta.url), 'utf8')).repairs;
export function repairListeningScript(value) {
  let text = String(value || '');
  for (const { old, corrected } of listeningScriptRepairs) text = text.replaceAll(old, corrected);
  return text;
}
