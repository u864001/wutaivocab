import fs from 'fs';
import path from 'path';

const bankPath = path.resolve('src/data/exam/tmePreA1Bank.js');
let content = fs.readFileSync(bankPath, 'utf8');

// 1. Add import for TME_PRE_A1_LISTENING_BANK at top
if (!content.includes('TME_PRE_A1_LISTENING_BANK')) {
  content = `import { TME_PRE_A1_LISTENING_BANK } from './tmePreA1ListeningBank.js';\n` + content;
}

// 2. Replace the bottom export
const oldExportRegex = /\/\/ Filter out old reading items[\s\S]*?export const TME_PRE_A1_BANK = \[[\s\S]*?\];/;
const newExport = `// Filter out old reading and listening items from NON_WRITING_ITEMS to ensure no duplicate questions
const BASE_ITEMS = NON_WRITING_ITEMS.filter(q => q.category !== 'reading' && q.category !== 'listening');

export { TME_PRE_A1_READING_BANK, TME_PRE_A1_LISTENING_BANK, TME_PRE_A1_SCRAMBLE_BANK, TME_SCRAMBLE_PATTERNS };

export const TME_PRE_A1_BANK = [
  ...BASE_ITEMS,
  ...TME_PRE_A1_LISTENING_BANK,
  ...TME_PRE_A1_READING_BANK,
  ...TME_PRE_A1_SCRAMBLE_BANK
];`;

content = content.replace(oldExportRegex, newExport);

fs.writeFileSync(bankPath, content, 'utf8');
console.log('Successfully updated tmePreA1Bank.js with TME_PRE_A1_LISTENING_BANK!');
