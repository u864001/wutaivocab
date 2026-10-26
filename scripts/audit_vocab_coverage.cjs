const fs = require('fs');
const path = require('path');

// 1. Read spotterWordInventory.js
const invRaw = fs.readFileSync('src/games/spotter/spotterWordInventory.js', 'utf8');

// Parse curriculum matrix
const books = {};
const bookRegex = /'(\d)':\s*\{[\s\S]*?bookTitle:\s*'([^']+)'[\s\S]*?words:\s*\[([\s\S]*?)\]\s*\}/g;
let bMatch;
while ((bMatch = bookRegex.exec(invRaw)) !== null) {
  const bNum = bMatch[1];
  const bTitle = bMatch[2];
  const wordsRaw = bMatch[3];
  const wordEntries = [...wordsRaw.matchAll(/\{\s*en:\s*'([^']+)',\s*zh:\s*'([^']+)'(?:,\s*type:\s*'([^']+)')?/g)]
    .map(m => ({ en: m[1].toLowerCase().trim(), zh: m[2], type: m[3] || 'concrete' }));
  books[bNum] = { title: bTitle, words: wordEntries };
}

// 2. Read spotterData.js
const spotterDataRaw = fs.readFileSync('src/games/spotter/spotterData.js', 'utf8');

// Parse all scenes
const sceneRegex = /export const (BOOK\d+_[A-Z0-9_]+_SCENE)\s*=\s*\{([\s\S]*?)\n\};/g;
const scenes = [];
let sMatch;
while ((sMatch = sceneRegex.exec(spotterDataRaw)) !== null) {
  const varName = sMatch[1];
  const body = sMatch[2];
  const id = (body.match(/id:\s*'([^']+)'/) || [])[1] || '';
  const titleZh = (body.match(/titleZh:\s*'([^']+)'/) || [])[1] || '';
  const book = (body.match(/book:\s*'([^']+)'/) || [])[1] || '';
  
  // Target items (changing)
  const targetItems = [...body.matchAll(/word:\s*'([^']+)'/g)].map(m => m[1].toLowerCase().trim());
  
  // Background static items (found in backgroundItems: [ ... ])
  const bgMatch = body.match(/backgroundItems:\s*\[([\s\S]*?)\]/);
  const bgItems = bgMatch 
    ? [...bgMatch[1].matchAll(/word:\s*'([^']+)'/g)].map(m => m[1].toLowerCase().trim())
    : [];

  scenes.push({ varName, id, titleZh, book, targetItems: [...new Set(targetItems)], bgItems: [...new Set(bgItems)] });
}

console.log('=== SCENE INVENTORY AUDIT ===');
console.log('Total scenes in code:', scenes.length);

const targetFreq = {};
const bgFreq = {};
const overallFreq = {};

scenes.forEach(s => {
  console.log(`\n[${s.id}] Book ${s.book} - ${s.titleZh}`);
  console.log(`  Targets (${s.targetItems.length}): ${s.targetItems.join(', ')}`);
  if (s.bgItems.length > 0) {
    console.log(`  Static Backgrounds (${s.bgItems.length}): ${s.bgItems.join(', ')}`);
  }
  s.targetItems.forEach(w => {
    targetFreq[w] = (targetFreq[w] || 0) + 1;
    overallFreq[w] = (overallFreq[w] || 0) + 1;
  });
  s.bgItems.forEach(w => {
    bgFreq[w] = (bgFreq[w] || 0) + 1;
    overallFreq[w] = (overallFreq[w] || 0) + 1;
  });
});

console.log('\n=== FREQUENCY RANKING: TARGET WORDS (題目單字出現率) ===');
Object.entries(targetFreq)
  .sort((a,b) => b[1] - a[1])
  .forEach(([w, c]) => console.log(`  ${w.padEnd(15)}: ${c} scenes`));

console.log('\n=== FREQUENCY RANKING: BACKGROUND STATIC WORDS (背景單字出現率) ===');
Object.entries(bgFreq)
  .sort((a,b) => b[1] - a[1])
  .forEach(([w, c]) => console.log(`  ${w.padEnd(15)}: ${c} scenes`));

console.log('\n=== CURRICULUM COVERAGE CHECK (Books 1 to 5) ===');
for (let b = 1; b <= 5; b++) {
  const bData = books[b];
  if (!bData) continue;
  console.log(`\n--- Book ${b}: ${bData.title} (Total ${bData.words.length} vocabulary) ---`);
  let tested = 0;
  let inBg = 0;
  let untouched = 0;
  
  bData.words.forEach(item => {
    const w = item.en;
    const tCount = targetFreq[w] || 0;
    const bCount = bgFreq[w] || 0;
    const status = tCount > 0 ? `TESTED (x${tCount})` : (bCount > 0 ? `BG-ONLY (x${bCount})` : 'NOT USED');
    if (tCount > 0) tested++;
    else if (bCount > 0) inBg++;
    else untouched++;
    console.log(`  ${w.padEnd(16)} [${item.zh.padEnd(6)}] ${status}`);
  });
  console.log(`Summary Book ${b}: Tested as Target: ${tested}/${bData.words.length} (${Math.round(tested/bData.words.length*100)}%), Background Only: ${inBg}, Untouched: ${untouched}`);
}
