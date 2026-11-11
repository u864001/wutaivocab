/**
 * 課本題庫 Canonical Prune 與 Rollback 隔離沙盒全流程驗證 (test_prune_roundtrip.mjs)
 *
 * 驗證流程（於 os.tmpdir() 隔離目錄執行，完全不修改正式工作區）：
 * 1. 複製所需檔案至 mkdtemp 隔離沙盒
 * 2. 執行 expanded verifier (3,317 題)
 * 3. 執行 execute_canonical_prune.mjs (精簡為 1,589 題 + 產生備份與 manifest)
 * 4. 執行 pruned verifier (1,589 題)
 * 5. 模擬 Windows CRLF 換行污染備份檔，驗證 rollback 仍能透過 normalizeForHash 通過 SHA-256 校驗
 * 6. 執行 rollback_canonical_migration.mjs (還原為 3,317 題)
 * 7. 執行 expanded verifier (3,317 題)
 * 8. 比對 round-trip 前後的正規化 SHA-256 hash 100% 一致
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function normalizeForHash(text) {
  return text.replace(/\r\n/g, '\n');
}

function sha256Text(text) {
  return crypto
    .createHash('sha256')
    .update(normalizeForHash(text), 'utf8')
    .digest('hex');
}

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING ISOLATED PRUNE -> VERIFY -> ROLLBACK ROUND-TRIP     ');
console.log('══════════════════════════════════════════════════════════════');

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wutai_prune_roundtrip_'));

try {
  // 1. 建立隔離沙盒目錄結構
  fs.mkdirSync(path.join(tmpRoot, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(tmpRoot, 'src/data/exam'), { recursive: true });
  fs.mkdirSync(path.join(tmpRoot, 'src/data/backups'), { recursive: true });

  fs.writeFileSync(
    path.join(tmpRoot, 'package.json'),
    JSON.stringify({ type: 'module' }, null, 2),
    'utf8'
  );

  // 複製必要檔案至隔離沙盒
  const filesToCopy = [
    'scripts/verify_canonical_schema.mjs',
    'scripts/execute_canonical_prune.mjs',
    'scripts/rollback_canonical_migration.mjs',
    'src/data/exam/canonicalMapping.js'
  ];

  for (const relPath of filesToCopy) {
    fs.copyFileSync(
      path.join(projectRoot, relPath),
      path.join(tmpRoot, relPath)
    );
  }

  // 若正式工作區已處於 Pruned 狀態 (1,589 題)，沙盒從物理備份 (3,317 題) 啟動以測試完整 Expanded -> Prune -> Rollback 流程
  const expandedBackupSource = path.join(projectRoot, 'src/data/backups/hereWeGoMcqBank.expanded.3317.js');
  const activeMcqSource = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');
  const sandboxMcqPath = path.join(tmpRoot, 'src/data/hereWeGoMcqBank.js');

  if (fs.existsSync(expandedBackupSource)) {
    fs.copyFileSync(expandedBackupSource, sandboxMcqPath);
  } else {
    fs.copyFileSync(activeMcqSource, sandboxMcqPath);
  }

  const initialHash = sha256Text(fs.readFileSync(sandboxMcqPath, 'utf8'));
  console.log(`\n[1/6] Sandbox initialized at: ${tmpRoot}`);
  console.log(`  Initial Normalized SHA-256: ${initialHash}`);

  // 2. Step 1: Expanded Verifier
  console.log('\n[2/6] Running Expanded Verifier (3,317 items)...');
  const expOut1 = execFileSync(process.execPath, ['scripts/verify_canonical_schema.mjs'], {
    cwd: tmpRoot,
    encoding: 'utf8'
  });
  assert.match(expOut1, /EXPANDED DUAL \(3,317 items\)/);
  console.log('  ✓ Expanded Verifier passed (3,317 items).');

  // 3. Step 2: Execute Prune
  console.log('\n[3/6] Executing Canonical Prune in Sandbox...');
  const pruneOut = execFileSync(process.execPath, ['scripts/execute_canonical_prune.mjs'], {
    cwd: tmpRoot,
    encoding: 'utf8'
  });
  assert.match(pruneOut, /exactly 1,589 Canonical questions active/);
  console.log('  ✓ Prune completed successfully (1,589 items).');

  // 4. Step 3: Pruned Verifier
  console.log('\n[4/6] Running Pruned Verifier (1,589 items)...');
  const prunedOut = execFileSync(process.execPath, ['scripts/verify_canonical_schema.mjs'], {
    cwd: tmpRoot,
    encoding: 'utf8'
  });
  assert.match(prunedOut, /PRUNED CANONICAL \(1,589 items\)/);
  console.log('  ✓ Pruned Verifier passed (1,589 items).');

  // 5. Step 4: Simulate Windows CRLF conversion on backup file & Execute Rollback
  console.log('\n[5/6] Simulating Windows CRLF line endings on backup & Executing Rollback...');
  const sandboxBackupPath = path.join(tmpRoot, 'src/data/backups/hereWeGoMcqBank.expanded.3317.js');
  const lfBackup = fs.readFileSync(sandboxBackupPath, 'utf8');
  const crlfBackup = lfBackup.replace(/\r?\n/g, '\r\n');
  fs.writeFileSync(sandboxBackupPath, crlfBackup, 'utf8');

  const rollbackOut = execFileSync(process.execPath, ['scripts/rollback_canonical_migration.mjs'], {
    cwd: tmpRoot,
    encoding: 'utf8'
  });
  assert.match(rollbackOut, /full 3,317 database restored and verified/);
  console.log('  ✓ Rollback passed even under CRLF line endings!');

  // 6. Step 5 & 6: Expanded Verifier & SHA-256 Round-Trip Comparison
  console.log('\n[6/6] Running Post-Rollback Expanded Verifier & Comparing Round-Trip SHA-256...');
  const expOut2 = execFileSync(process.execPath, ['scripts/verify_canonical_schema.mjs'], {
    cwd: tmpRoot,
    encoding: 'utf8'
  });
  assert.match(expOut2, /EXPANDED DUAL \(3,317 items\)/);

  const finalHash = sha256Text(fs.readFileSync(sandboxMcqPath, 'utf8'));
  console.log(`  Final Normalized SHA-256:   ${finalHash}`);
  assert.equal(finalHash, initialHash, 'Round-trip SHA-256 must match initial hash 100%!');
  console.log('  ✓ Round-trip SHA-256 matches 100%!');

  // 7. Step 7: Test P1 Pre-Swap Failure Safety (Do NOT overwrite formal file if error occurs before swap)
  console.log('\n[7/7] Testing Pre-Swap Error Safety (Formal file must NOT be overwritten by stale backup)...');
  const sandboxBackupPath2 = path.join(tmpRoot, 'src/data/backups/hereWeGoMcqBank.expanded.3317.js');
  fs.writeFileSync(sandboxBackupPath2, '// STALE_BACKUP_DO_NOT_OVERWRITE\n', 'utf8');
  const invalidContent = 'export const HERE_WE_GO_BOOK_META = {};\nexport const HERE_WE_GO_MCQ_BANK = [{ id: "dummy" }];\n';
  fs.writeFileSync(sandboxMcqPath, invalidContent, 'utf8');

  let pruneFailedAsExpected = false;
  try {
    execFileSync(process.execPath, ['scripts/execute_canonical_prune.mjs'], {
      cwd: tmpRoot,
      encoding: 'utf8',
      stdio: 'pipe'
    });
  } catch {
    pruneFailedAsExpected = true;
  }
  assert.equal(pruneFailedAsExpected, true, 'Prune should abort on invalid bank size');
  const afterAbortContent = fs.readFileSync(sandboxMcqPath, 'utf8');
  assert.equal(afterAbortContent, invalidContent, 'Formal file must remain untouched when error happens before atomic swap!');
  console.log('  ✓ Pre-swap abort left formal file untouched (didSwap=false safety verified)!');

  console.log('\n🎉 ISOLATED PRUNE -> VERIFY -> ROLLBACK ROUND-TRIP PASSED 100%!');
} finally {
  // 清理暫存沙盒
  fs.rmSync(tmpRoot, { recursive: true, force: true });
}
