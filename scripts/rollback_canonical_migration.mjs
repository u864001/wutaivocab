/**
 * 課本題庫 Canonical 正規化安全回滾工具 (Rollback Tool)
 *
 * 若未來需回滾 Scheme A 元資料，執行：
 *   node scripts/rollback_canonical_migration.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcqFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');

const { HERE_WE_GO_MCQ_BANK, HERE_WE_GO_BOOK_META } = await import(mcqFilePath);

console.log('Rolling back canonical metadata from hereWeGoMcqBank.js...');

const cleanBank = HERE_WE_GO_MCQ_BANK.map(q => {
  const { canonicalId, primaryScope, scopes, isCanonical, ...rest } = q;
  return rest;
});

const content = `export const HERE_WE_GO_BOOK_META = ${JSON.stringify(HERE_WE_GO_BOOK_META, null, 2)};\n\nexport const HERE_WE_GO_MCQ_BANK = ${JSON.stringify(cleanBank, null, 2)};\n`;

fs.writeFileSync(mcqFilePath, content, 'utf8');
console.log(`✓ Successfully rolled back ${cleanBank.length} questions to clean legacy schema.`);
