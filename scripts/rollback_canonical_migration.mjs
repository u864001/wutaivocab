/**
 * 課本題庫 Canonical 正規化安全回滾工具 (Rollback Tool from Verified Physical Backup)
 *
 * 規範依據：
 * 1. 讀取 src/data/backups/manifest.json 校驗 SHA-256 Checksum
 * 2. 完整物理還原 3,317 題 Expanded 題庫
 * 3. 驗證還原後的題庫長度與契約
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
console.log('  RESTORING FROM VERIFIED PHYSICAL EXPANDED BACKUP           ');
console.log('══════════════════════════════════════════════════════════════');

try {
  if (!fs.existsSync(backupFilePath) || !fs.existsSync(manifestFilePath)) {
    throw new Error(`Backup file or manifest not found in ${backupDir}. Cannot rollback.`);
  }

  // 1. 驗證 Manifest 與 Checksum
  const manifestRaw = fs.readFileSync(manifestFilePath, 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const backupContent = fs.readFileSync(backupFilePath, 'utf8');
  const calculatedHash = crypto.createHash('sha256').update(backupContent).digest('hex');

  if (calculatedHash !== manifest.sha256) {
    throw new Error(`Backup integrity check failed! Manifest SHA-256: ${manifest.sha256}, but backup file SHA-256 is ${calculatedHash}`);
  }
  console.log(`✓ Backup integrity verified! SHA-256: ${calculatedHash}`);

  // 2. 寫入暫存檔
  fs.writeFileSync(tmpFilePath, backupContent, 'utf8');

  // 3. 驗證暫存檔題數為 3,317
  const tmpCheck = await import(`file://${tmpFilePath}?t=${Date.now()}`);
  if (!tmpCheck.HERE_WE_GO_MCQ_BANK || tmpCheck.HERE_WE_GO_MCQ_BANK.length !== 3317) {
    throw new Error(`Restored database has invalid length: ${tmpCheck.HERE_WE_GO_MCQ_BANK?.length}, expected 3317.`);
  }

  // 4. 原子性替換
  fs.renameSync(tmpFilePath, mcqFilePath);
  console.log('✓ Atomically restored hereWeGoMcqBank.js to 3,317 questions.');
  console.log('🎉 Rollback completed successfully: full 3,317 database restored and verified!');
} catch (err) {
  console.error('❌ Rollback failed:', err.message);
  if (fs.existsSync(tmpFilePath)) {
    fs.unlinkSync(tmpFilePath);
  }
  process.exit(1);
}
