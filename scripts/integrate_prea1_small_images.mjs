import fs from 'fs';
import path from 'path';
import {
  NEW_VOCAB_WORD2PIC,
  NEW_VOCAB_PIC2WORD,
  NEW_VOCAB_AUDIO2PIC,
  NEW_LISTEN_PIC2SENT,
  NEW_LISTEN_DLG2PIC,
  NEW_READ_PIC2WORD,
  NEW_READ_PIC2SENT
} from './expand_prea1_small_image_questions.mjs';

function formatItems(items, indent = 2) {
  const pad = ' '.repeat(indent);
  return items.map(item => {
    const json = JSON.stringify(item, null, indent);
    // indent all lines
    return json.split('\n').map((line, idx) => idx === 0 ? pad + line : pad + line).join('\n');
  }).join(',\n');
}

// 1. Update tmePreA1ReadingBank.js
const readingBankPath = path.resolve('src/data/exam/tmePreA1ReadingBank.js');
let readingBankContent = fs.readFileSync(readingBankPath, 'utf8');

const readingItems = [...NEW_READ_PIC2WORD, ...NEW_READ_PIC2SENT];
const readingFormatted = ',\n' + formatItems(readingItems, 2) + '\n';

// Find the last "];" in tmePreA1ReadingBank.js
const lastBracketIdx = readingBankContent.lastIndexOf('];');
if (lastBracketIdx === -1) {
  throw new Error('Could not find closing bracket in tmePreA1ReadingBank.js');
}

const newReadingBankContent = readingBankContent.slice(0, lastBracketIdx) +
  readingFormatted +
  readingBankContent.slice(lastBracketIdx);

fs.writeFileSync(readingBankPath, newReadingBankContent, 'utf8');
console.log(`✓ Added ${readingItems.length} items to tmePreA1ReadingBank.js`);

// 2. Update tmePreA1Bank.js
const mainBankPath = path.resolve('src/data/exam/tmePreA1Bank.js');
let mainBankContent = fs.readFileSync(mainBankPath, 'utf8');

const vocabListenItems = [
  ...NEW_VOCAB_WORD2PIC,
  ...NEW_VOCAB_PIC2WORD,
  ...NEW_VOCAB_AUDIO2PIC,
  ...NEW_LISTEN_PIC2SENT,
  ...NEW_LISTEN_DLG2PIC
];

const vocabListenFormatted = ',\n' + formatItems(vocabListenItems, 2) + '\n';

const marker = '];\n\n// Filter out old reading items from NON_WRITING_ITEMS';
const markerIdx = mainBankContent.indexOf(marker);
if (markerIdx === -1) {
  throw new Error('Could not find NON_WRITING_ITEMS closing marker in tmePreA1Bank.js');
}

const newMainBankContent = mainBankContent.slice(0, markerIdx) +
  vocabListenFormatted +
  mainBankContent.slice(markerIdx);

fs.writeFileSync(mainBankPath, newMainBankContent, 'utf8');
console.log(`✓ Added ${vocabListenItems.length} items to tmePreA1Bank.js`);

console.log('\nAll 40 questions successfully integrated into question banks!');
