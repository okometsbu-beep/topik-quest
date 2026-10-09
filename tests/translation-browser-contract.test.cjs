const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('CI translation browser QA is localhost-only and uses synthetic mock transport',()=>{
 const source=fs.readFileSync('scripts/vocabulary-translation-browser-checks.mjs','utf8'),runner=fs.readFileSync('scripts/check-travel-mobile.mjs','utf8');
 assert.match(source,/\['localhost','127\.0\.0\.1','\[::1\]'\]/);assert.match(source,/translation-ui-test\.invalid/);assert.match(source,/window\.fetch=/);assert.match(source,/window\.turnstile=/);assert.match(source,/window\.fetch=qa\.fetch/);assert.match(source,/Actual model\/Turnstile calls: 0/);
 assert.match(runner,/await verifyVocabularyTranslation\(/);assert.match(source,/late-mock-token/);assert.match(source,/translation-mock-consent-390\.png/);assert.match(source,/saved\.translationContext/);
});
