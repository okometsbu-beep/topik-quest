const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app-polish-v24.js'), 'utf8');
const patch = source.slice(source.indexOf('function patchRandomFeedback(){'), source.indexOf('\nfunction randomNextButton()'));

class Element {
  constructor(name) { this.name = name; this.children = []; this.dataset = {}; this.isConnected = true; this.classList = {contains: value => value === 'good', toggle() {}}; }
  appendChild(child) { child.remove(); this.children.push(child); child.parent = this; return child; }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); this.parent = null; }
  set textContent(value) { this.text = value; for (const child of [...this.children]) child.remove(); }
  get textContent() { return this.text || ''; }
  set innerHTML(value) { this.textContent = value; }
  setAttribute() {}
  insertAdjacentElement(_, child) { this.parent.appendChild(child); return child; }
  after(...children) { for (const child of children) this.parent.appendChild(child); }
  querySelector(selector) {
    const names = {'.resultStrip': 'strip', '.t1TutorCoach': 'tutor', '[data-reviewed-panel]': 'reviewed', '.listeningTranscript': 'transcript'};
    if (selector === 'p') return new Element('paragraph');
    for (const child of this.children) { if (child.name === names[selector]) return child; const found = child.querySelector(selector); if (found) return found; }
    return null;
  }
  querySelectorAll() { return []; }
}

for (const hasReviewed of [true, false]) test(`actual random feedback preserves existing reviewed node: ${hasReviewed}`, async () => {
  const card = new Element('card'), strip = new Element('strip'), tutor = new Element('tutor'), reviewed = new Element('reviewed'), transcript = new Element('transcript');
  card.appendChild(strip); strip.appendChild(tutor); strip.appendChild(transcript);
  if (hasReviewed) strip.appendChild(reviewed);
  reviewed.localeSelection = 'vi'; reviewed.attemptIdentity = {};
  const state = {level: 1, key: 'random:1:M09-I-R-34', q: {answerIndex: 2}};
  const context = {document: {querySelector: () => card, createElement: () => new Element('generated')}, window: {MALBIT_LEARNING: {conciseEvidenceMarkup: () => '<p>existing explanation</p>'}}, randomQuestionState: () => state, L: (...values) => values[0], appState: () => ({lang: 'ko'}), originalQuestionText: () => 'original', translatedQuestion: async () => ({status: 'original', text: 'original'})};
  vm.runInNewContext(patch + '\npatchRandomFeedback();patchRandomFeedback();', context);
  await Promise.resolve();
  assert.equal(card.querySelector('[data-reviewed-panel]'), hasReviewed ? reviewed : null, 'feedback cleanup must preserve the exact panel node and its active attempt');
  assert.equal(reviewed.localeSelection, 'vi');
  assert.equal(card.querySelector('.listeningTranscript'), transcript);
  if (hasReviewed) assert.equal(strip.children.filter(child => child === reviewed).length, 1);
});
