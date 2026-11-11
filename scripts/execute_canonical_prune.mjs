/**
 * 課本題庫 Canonical 正規化正式執行工具 (Prune Tool)
 *
 * 警告：僅在獲得 Mark 與審查助理明確指示後執行！
 * 執行此工具將把 hereWeGoMcqBank.js 精簡為 1,589 題 Canonical 題目。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcqFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');

const { HERE_WE_GO_MCQ_BANK, HERE_WE_GO_BOOK_META } = await import(mcqFilePath);

console.log('Pruning 1,728 duplicate clones from hereWeGoMcqBank.js...');

const canonicalOnly = HERE_WE_GO_MCQ_BANK.filter(q => q.isCanonical === true);

if (canonicalOnly.length !== 1589) {
  console.error(`Error: Found ${canonicalOnly.length} canonical questions, expected 1589. Aborting.`);
  process.exit(1);
}

const content = `export const HERE_WE_GO_BOOK_META = ${JSON.stringify(HERE_WE_GO_BOOK_META, null, 2)};\n\nexport const HERE_WE_GO_MCQ_BANK = ${JSON.stringify(canonicalOnly, null, 2)};\n`;

fs.writeFileSync(mcqFilePath, content, 'utf8');
console.log(`🎉 Successfully pruned bank to exactly ${canonicalOnly.length} Canonical questions!`);
