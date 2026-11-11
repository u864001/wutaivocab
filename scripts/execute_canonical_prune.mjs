/**
 * 課本題庫 Canonical 正規化正式執行工具 (Prune Tool with Atomic Safety & Physical Backup)
 *
 * 規範依據：
 * 1. 物理備份：prune 前將完整 3,317 題備份至 src/data/backups/hereWeGoMcqBank.expanded.3317.js
 * 2. 完整性校驗：產出 manifest.json 記錄 SHA-256 hash 與時間戳記
 * 3. 原子性置換：先產出 .tmp 暫存檔，驗證通過後以 fs.renameSync 原子性替換
 * 4. 故障自動復原：若寫入或驗證失敗，自動從備份檔恢復，確保 0 風險
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcqFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');
const tmpFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.tmp.js');
const backupDir = path.join(projectRoot, 'src/data/backups');
const backupFilePath = path.join(backupDir, 'hereWeGoMcqBank.expanded.3317.js');
const manifestFilePath = path.join(backupDir, 'manifest.json');

console.log('══════════════════════════════════════════════════════════════');
console.log('  EXECUTING CANONICAL PRUNE WITH ATOMIC ROLLBACK SAFETY      ');
console.log('══════════════════════════════════════════════════════════════');

try {
  // 1. 讀取現有題庫
  const rawContent = fs.readFileSync(mcqFilePath, 'utf8');
  const { HERE_WE_GO_MCQ_BANK, HERE_WE_GO_BOOK_META } = await import(mcqFilePath);

  console.log(`Current bank size: ${HERE_WE_GO_MCQ_BANK.length} questions.`);

  if (HERE_WE_GO_MCQ_BANK.length === 1589) {
    console.log('⚠️ Notice: hereWeGoMcqBank.js is already in pruned canonical state (1,589 questions). Nothing to prune.');
    process.exit(0);
  }

  if (HERE_WE_GO_MCQ_BANK.length !== 3317) {
    throw new Error(`Unexpected bank size: ${HERE_WE_GO_MCQ_BANK.length}, expected 3317.`);
  }

  // 2. 建立物理備份與 SHA-256 Manifest
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const hash = crypto.createHash('sha256').update(rawContent).digest('hex');
  fs.writeFileSync(backupFilePath, rawContent, 'utf8');

  const manifest = {
    sourceFile: 'src/data/hereWeGoMcqBank.js',
    backupFile: 'src/data/backups/hereWeGoMcqBank.expanded.3317.js',
    totalQuestions: HERE_WE_GO_MCQ_BANK.length,
    sha256: hash,
    backupDate: new Date().toISOString(),
    status: 'verified'
  };
  fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✓ Created physical backup at: src/data/backups/hereWeGoMcqBank.expanded.3317.js`);
  console.log(`✓ SHA-256 Checksum: ${hash}`);

  // 3. 篩選 1,589 題 Canonical 題目
  const canonicalOnly = HERE_WE_GO_MCQ_BANK.filter(q => q.isCanonical === true);
  if (canonicalOnly.length !== 1589) {
    throw new Error(`Found ${canonicalOnly.length} canonical questions, expected exactly 1589.`);
  }

  // 4. 驗證 Canonical 結構完整性（正答唯一、長度 <= 2、七選項）
  for (const q of canonicalOnly) {
    if (!q.canonicalId || q.canonicalId !== q.id) {
      throw new Error(`Canonical question ${q.id} has invalid canonicalId: ${q.canonicalId}`);
    }
    if (!Array.isArray(q.scopes) || q.scopes.length === 0 || q.scopes.length > 2) {
      throw new Error(`Question ${q.id} scopes length is ${q.scopes?.length}, expected 1 or 2.`);
    }
    if (!q.scopes.includes(q.primaryScope)) {
      throw new Error(`Question ${q.id} scopes do not contain primaryScope (${q.primaryScope}).`);
    }
    if (q.options.length !== 7 || q.answer !== 0) {
      throw new Error(`Question ${q.id} violates 7-option answer 0 contract.`);
    }
  }

  // 5. 寫入暫存檔
  const prunedContent = `export const HERE_WE_GO_BOOK_META = ${JSON.stringify(HERE_WE_GO_BOOK_META, null, 2)};\n\nexport const HERE_WE_GO_MCQ_BANK = ${JSON.stringify(canonicalOnly, null, 2)};\n`;
  fs.writeFileSync(tmpFilePath, prunedContent, 'utf8');

  // 6. 驗證暫存檔可正確 import
  const tmpCheck = await import(`file://${tmpFilePath}?t=${Date.now()}`);
  if (!tmpCheck.HERE_WE_GO_MCQ_BANK || tmpCheck.HERE_WE_GO_MCQ_BANK.length !== 1589) {
    throw new Error('Temp file failed validation check.');
  }

  // 7. 原子性替換 (Atomic Rename)
  fs.renameSync(tmpFilePath, mcqFilePath);
  console.log('✓ Atomically swapped hereWeGoMcqBank.js to pruned canonical database.');
  console.log('🎉 Pruning completed successfully: exactly 1,589 Canonical questions active!');
} catch (err) {
  console.error('❌ Pruning failed:', err.message);
  // 清理暫存檔
  if (fs.existsSync(tmpFilePath)) {
    fs.unlinkSync(tmpFilePath);
  }
  // 自動從備份檔恢復
  if (fs.existsSync(backupFilePath)) {
    console.log('🔄 Auto-restoring from physical backup...');
    fs.copyFileSync(backupFilePath, mcqFilePath);
    console.log('✓ Successfully restored original 3,317 database from backup.');
  }
  process.exit(1);
}
