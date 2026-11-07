import fs from 'fs';
import path from 'path';

const bankPath = path.resolve('src/data/exam/tmePreA1Bank.js');
let content = fs.readFileSync(bankPath, 'utf8');

// 1. Add import for TME_PRE_A1_READING_BANK at top
if (!content.includes('TME_PRE_A1_READING_BANK')) {
  content = `import { TME_PRE_A1_READING_BANK } from './tmePreA1ReadingBank.js';\n` + content;
}

// 2. Export TME_PRE_A1_READING_BANK at the bottom
// Replace the bottom export
const oldExportRegex = /export const TME_PRE_A1_BANK = \[[\s\S]*?\];/;
const newExport = `// Filter out old reading items from NON_WRITING_ITEMS to ensure no duplicate reading questions
const NON_READING_ITEMS = NON_WRITING_ITEMS.filter(q => q.category !== 'reading');

export { TME_PRE_A1_READING_BANK };

export const TME_PRE_A1_BANK = [
  ...NON_READING_ITEMS,
  ...TME_PRE_A1_READING_BANK,
  ...TME_PRE_A1_SCRAMBLE_BANK
];`;

content = content.replace(oldExportRegex, newExport);

fs.writeFileSync(bankPath, content, 'utf8');
console.log('Successfully updated tmePreA1Bank.js with TME_PRE_A1_READING_BANK!');
