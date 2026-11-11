/**
 * 課本題庫 Canonical 正規化正式執行工具 (Prune Tool with Cross-Platform Atomic Safety & Physical Backup)
 *
 * 規範依據：
 * 1. 跨平台路徑相容：統一使用 pathToFileURL (Windows / Linux 雙向相容)
 * 2. 跨平台換行正規化：計算 SHA-256 前統一 normalizeForHash (\r\n -> \n)，免疫 Git autocrlf 差異
 * 3. 物理備份：prune 前將完整 3,317 題備份至 src/data/backups/hereWeGoMcqBank.expanded.3317.js
 * 4. 狀態旗標保護 (didSwap & backupVerified)：僅在已發生置換且備份驗證通過時才執行復原，絕不在置換前覆寫正式檔
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const importFresh = async (filePath) => {
  const url = pathToFileURL(filePath);
  url.searchParams.set('t', String(Date.now()));
  return import(url.href);
};

function normalizeForHash(text) {
  return text.replace(/\r\n/g, '\n');
}

function sha256Text(text) {
  return crypto
    .createHash('sha256')
    .update(normalizeForHash(text), 'utf8')
    .digest('hex');
}

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

let didSwap = false;
let backupVerified = false;

try {
  // 1. 讀取現有題庫
  const rawContent = fs.readFileSync(mcqFilePath, 'utf8');
  const { HERE_WE_GO_MCQ_BANK, HERE_WE_GO_BOOK_META } = await importFresh(mcqFilePath);

  console.log(`Current bank size: ${HERE_WE_GO_MCQ_BANK.length} questions.`);

  if (HERE_WE_GO_MCQ_BANK.length === 1589) {
    console.log('⚠️ Notice: hereWeGoMcqBank.js is already in pruned canonical state (1,589 questions). Nothing to prune.');
    process.exit(0);
  }

  if (HERE_WE_GO_MCQ_BANK.length !== 3317) {
    throw new Error(`Unexpected bank size: ${HERE_WE_GO_MCQ_BANK.length}, expected 3317.`);
  }

  // 2. 建立物理備份與正規化 SHA-256 Manifest
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const normalizedRaw = normalizeForHash(rawContent);
  const hash = sha256Text(normalizedRaw);
  fs.writeFileSync(backupFilePath, normalizedRaw, 'utf8');

  // 驗證寫入之備份檔
  const verifyBackupHash = sha256Text(fs.readFileSync(backupFilePath, 'utf8'));
  if (verifyBackupHash !== hash) {
    throw new Error('Failed to verify physical backup checksum.');
  }
  backupVerified = true;

  const manifest = {
    sourceFile: 'src/data/hereWeGoMcqBank.js',
    backupFile: 'src/data/backups/hereWeGoMcqBank.expanded.3317.js',
    totalQuestions: HERE_WE_GO_MCQ_BANK.length,
    sha256: hash,
    backupDate: new Date().toISOString(),
    status: 'verified'
  };
  fs.writeFileSync(manifestFilePath, normalizeForHash(JSON.stringify(manifest, null, 2) + '\n'), 'utf8');
  console.log(`✓ Created physical backup at: src/data/backups/hereWeGoMcqBank.expanded.3317.js`);
  console.log(`✓ Normalized SHA-256 Checksum: ${hash}`);

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
  const prunedContent = normalizeForHash(`export const HERE_WE_GO_BOOK_META = ${JSON.stringify(HERE_WE_GO_BOOK_META, null, 2)};\n\nexport const HERE_WE_GO_MCQ_BANK = ${JSON.stringify(canonicalOnly, null, 2)};\n`);
  fs.writeFileSync(tmpFilePath, prunedContent, 'utf8');

  // 6. 驗證暫存檔可正確 import
  const tmpCheck = await importFresh(tmpFilePath);
  if (!tmpCheck.HERE_WE_GO_MCQ_BANK || tmpCheck.HERE_WE_GO_MCQ_BANK.length !== 1589) {
    throw new Error('Temp file failed validation check.');
  }

  // 7. 原子性替換 (Atomic Rename)
  fs.renameSync(tmpFilePath, mcqFilePath);
  didSwap = true;

  // 8. 替換後最終確認
  const postSwapCheck = await importFresh(mcqFilePath);
  if (!postSwapCheck.HERE_WE_GO_MCQ_BANK || postSwapCheck.HERE_WE_GO_MCQ_BANK.length !== 1589) {
    throw new Error('Post-swap verification failed.');
  }

  console.log('✓ Atomically swapped hereWeGoMcqBank.js to pruned canonical database.');
  console.log('🎉 Pruning completed successfully: exactly 1,589 Canonical questions active!');
} catch (err) {
  console.error('❌ Pruning failed:', err.message);
  // 清理暫存檔
  if (fs.existsSync(tmpFilePath)) {
    fs.unlinkSync(tmpFilePath);
  }
  // 僅在已執行置換 (didSwap) 且備份已驗證 (backupVerified) 時才執行回滾，絕不無條件覆寫未修改的正式檔
  if (didSwap && backupVerified && fs.existsSync(backupFilePath)) {
    console.log('🔄 Post-swap failure detected. Auto-restoring from verified physical backup...');
    fs.copyFileSync(backupFilePath, mcqFilePath);
    console.log('✓ Successfully restored original 3,317 database from backup.');
  }
  process.exit(1);
}
