/**
 * 課本題庫 Legacy Canonical Prune 安全回滾工具 (Legacy Prune Rollback Tool)
 *
 * 嚴格安全防線（P0 防護）：
 * 1. 僅允許在正式題庫處於「原始 Pruned 1,589 題狀態（commit cc7c275）」且正規化 SHA-256 完全吻合時執行。
 * 2. 若正式題庫已包含後續擴充批次（如 Batch A~D 之 _ba_ / _bb_ / _bc_ / _bd_ 題目，或題數 !== 1589），立即拒絕執行並中止，絕不覆蓋或刪除新擴充題目！
 * 3. 回滾時同時原子性還原題庫 (hereWeGoMcqBank.js -> 3,317 題) 與映射表 (canonicalMapping.js -> 1,589 Canonical 映射)，確保題庫與 Mapping 100% 同步。
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

const EXPECTED_PRUNED_1589_SHA256 = 'e497fc7d30ecb4dabde1f4197a2b1c21bcdfa28d03cc856b6ffc0ca63dcb8a09';
const EXPECTED_MAPPING_1589_SHA256 = '96f9067cc07182e2c2fcff2ec45becaa76e586d807354bf6c1f44d9f22907e5d';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcqFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');
const tmpFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.tmp.js');
const mappingFilePath = path.join(projectRoot, 'src/data/exam/canonicalMapping.js');
const tmpMappingFilePath = path.join(projectRoot, 'src/data/exam/canonicalMapping.tmp.js');
const backupDir = path.join(projectRoot, 'src/data/backups');
const backupFilePath = path.join(backupDir, 'hereWeGoMcqBank.expanded.3317.js');
const mappingBackupFilePath = path.join(backupDir, 'canonicalMapping.1589.js');
const manifestFilePath = path.join(backupDir, 'manifest.json');

console.log('══════════════════════════════════════════════════════════════');
console.log('  LEGACY PRUNE ROLLBACK: VERIFYING PRECONDITIONS & BACKUP     ');
console.log('══════════════════════════════════════════════════════════════');

try {
  if (!fs.existsSync(backupFilePath) || !fs.existsSync(manifestFilePath)) {
    throw new Error(`Backup file or manifest not found in ${backupDir}. Cannot rollback.`);
  }

  // 0. P0 防護：檢查當前題庫是否為原始 1,589 Pruned 狀態（嚴禁覆蓋已擴充 Batch A~D 之題庫）
  if (!fs.existsSync(mcqFilePath)) {
    throw new Error(`Active bank file not found at ${mcqFilePath}.`);
  }
  const currentBankContent = normalizeForHash(fs.readFileSync(mcqFilePath, 'utf8'));
  const currentBankHash = sha256Text(currentBankContent);
  const currentMod = await importFresh(mcqFilePath);
  const currentBank = currentMod.HERE_WE_GO_MCQ_BANK || [];
  const hasBatchExpansions = currentBank.some(q => /_b[a-d]_/i.test(q.id));

  if (hasBatchExpansions || currentBank.length !== 1589 || currentBankHash !== EXPECTED_PRUNED_1589_SHA256) {
    throw new Error(
      `Refusing to execute legacy prune rollback! Active bank has ${currentBank.length} items ` +
      `(hasBatchExpansions=${hasBatchExpansions}, sha256=${currentBankHash.slice(0, 12)}...). ` +
      `Legacy rollback is strictly restricted to the baseline 1,589-item pruned commit (cc7c275) to protect post-prune Batch A~D expansions.`
    );
  }

  // 1. 驗證 Manifest 與正規化 Checksum
  const manifestRaw = fs.readFileSync(manifestFilePath, 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const backupContent = normalizeForHash(fs.readFileSync(backupFilePath, 'utf8'));
  const calculatedHash = sha256Text(backupContent);

  if (calculatedHash !== manifest.sha256) {
    throw new Error(`Backup integrity check failed! Manifest SHA-256: ${manifest.sha256}, but backup file SHA-256 is ${calculatedHash}`);
  }
  console.log(`✓ Backup integrity verified! Normalized SHA-256: ${calculatedHash}`);

  // 2. 若存在 canonicalMapping.1589.js 備份，一併驗證並準備原子還原
  let mappingBackupContent = null;
  if (fs.existsSync(mappingBackupFilePath)) {
    mappingBackupContent = normalizeForHash(fs.readFileSync(mappingBackupFilePath, 'utf8'));
    const mappingHash = sha256Text(mappingBackupContent);
    const expectedMapHash = manifest.mapping1589Sha256 || EXPECTED_MAPPING_1589_SHA256;
    if (mappingHash !== expectedMapHash) {
      throw new Error(`Mapping backup integrity check failed! Expected ${expectedMapHash}, got ${mappingHash}`);
    }
    fs.writeFileSync(tmpMappingFilePath, mappingBackupContent, 'utf8');
  }

  // 3. 寫入題庫暫存檔並驗證題數為 3,317
  fs.writeFileSync(tmpFilePath, backupContent, 'utf8');
  const tmpCheck = await importFresh(tmpFilePath);
  if (!tmpCheck.HERE_WE_GO_MCQ_BANK || tmpCheck.HERE_WE_GO_MCQ_BANK.length !== 3317) {
    throw new Error(`Restored database has invalid length: ${tmpCheck.HERE_WE_GO_MCQ_BANK?.length}, expected 3317.`);
  }

  // 4. 原子性替換題庫與 Mapping
  fs.renameSync(tmpFilePath, mcqFilePath);
  if (mappingBackupContent && fs.existsSync(tmpMappingFilePath)) {
    fs.renameSync(tmpMappingFilePath, mappingFilePath);
    console.log('✓ Atomically restored canonicalMapping.js to 1,589 baseline state.');
  }
  console.log('✓ Atomically restored hereWeGoMcqBank.js to 3,317 questions.');
  console.log('🎉 Rollback completed successfully: full 3,317 database restored and verified!');
} catch (err) {
  console.error('❌ Rollback failed:', err.message);
  if (fs.existsSync(tmpFilePath)) {
    fs.unlinkSync(tmpFilePath);
  }
  if (fs.existsSync(tmpMappingFilePath)) {
    fs.unlinkSync(tmpMappingFilePath);
  }
  process.exit(1);
}
